import { NextResponse } from 'next/server';

// Sanitize string inputs to prevent injection
function sanitizeString(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/<[^>]*>/g, '');
}

function sanitizeArray(arr: unknown, maxItems = 10): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item): item is string => typeof item === 'string')
    .slice(0, maxItems)
    .map(s => sanitizeString(s, 100));
}

export async function POST(req: Request) {
  // Enforce JSON content-type
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const rawBody = body as Record<string, unknown>;
    const { campaignInput: rawInput, lockedFacts } = rawBody;

    // Sanitize and validate campaign input
    const campaignInput = rawInput && typeof rawInput === 'object' ? rawInput as Record<string, unknown> : null;
    if (!campaignInput || !lockedFacts) {
      return NextResponse.json({ error: 'Missing campaign input or facts.' }, { status: 400 });
    }
    // Sanitize text fields
    if (campaignInput.targetAudience) campaignInput.targetAudience = sanitizeString(campaignInput.targetAudience);
    if (campaignInput.brandTone) campaignInput.brandTone = sanitizeString(campaignInput.brandTone);
    if (campaignInput.offer) campaignInput.offer = sanitizeString(campaignInput.offer);
    if (Array.isArray(campaignInput.languages)) campaignInput.languages = sanitizeArray(campaignInput.languages);
    if (Array.isArray(campaignInput.channels)) campaignInput.channels = sanitizeArray(campaignInput.channels);

    // 2. Validation - Check that offer facts are locked
    if (!lockedFacts || typeof lockedFacts !== 'object' || !(lockedFacts as Record<string,unknown>).isLocked) {
      return NextResponse.json({ error: 'Offer facts must be locked before generating a campaign.' }, { status: 400 });
    }
    
    // 3. Validation - Check clarifications server-side
    const questions = analyzeCampaignForClarifications(campaignInput);
    if (questions.length > 0) {
      return NextResponse.json({ 
        error: 'Unresolved clarifications remain.', 
        clarifications: questions 
      }, { status: 400 });
    }

    // Call Agnes AI - Initial Generation
    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      console.error("AGNES_API_KEY is missing from environment.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const systemPrompt = `You are an AI marketing campaign planner. Create marketing content that preserves the exact business intent and does not invent offers, prices, discounts, dates, locations, product claims, guarantees or other business facts that were not provided.

CRITICAL CHANNEL ADAPTATION:
- INSTAGRAM must contain: Hook, Main promotional message, Call to action, and Hashtags.
- WHATSAPP must contain: Short conversational message, Offer, Important business information, and Call to action.
DO NOT simply copy the same text into both channels. Both versions must originate from the same campaign strategy and strictly preserve the exact locked business facts.

CRITICAL LOCALIZATION INSTRUCTION:
When generating content for different languages, DO NOT simply translate word-for-word. Adapt the tone naturally to the target audience while strictly preserving the exact business offer and intent. Never add unsupported claims.

Return ONLY a valid JSON object with the following structure:
{
  "strategy": "A short paragraph explaining the campaign strategy.",
  "coreMessage": "The central message to be conveyed.",
  "content": {
    "[Language Name]": {
      "Instagram": "Instagram adapted content",
      "WhatsApp": "WhatsApp adapted content"
    }
  }
}`;

    const languages = Array.isArray(campaignInput.languages) ? (campaignInput.languages as string[]) : [];
    const channels = Array.isArray(campaignInput.channels) ? (campaignInput.channels as string[]) : [];

    const userPrompt = `Campaign Facts (STRICTLY PRESERVE THESE):\n${JSON.stringify(lockedFacts, null, 2)}\n\nTarget Audience: ${String(campaignInput.targetAudience ?? '')}\nBrand Tone: ${String(campaignInput.brandTone ?? '')}\n\nRequired Languages: ${languages.join(', ')}\nTarget Channels: ${channels.join(', ')}\n\nPlease generate the campaign now, ensuring you provide a nested object in 'content' for each Required Language containing each Target Channel.`;

    let response = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "agnes-3.0-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to generate initial campaign." }, { status: 502 });
    }

    let data = await response.json();
    let currentCampaign = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    // ==========================================
    // CAMPAIGN VALIDATOR LOOP
    // ==========================================
    
    let validationResult: any = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS) {
      // 1. Run Validation
      const validatorPrompt = `You are a strict compliance validator. Verify that EVERY generated marketing message exactly matches the locked business facts.
      
Check for: Incorrect offer, changed discount, changed price, incorrect date, incorrect location, invented product/service, unsupported guarantee, unsupported claim, contradictory information, missing critical offer information.

Locked Facts:
${JSON.stringify(lockedFacts, null, 2)}

Generated Campaign to validate:
${JSON.stringify(currentCampaign, null, 2)}

Return a strict JSON object:
{
  "status": "PASS" or "FAIL",
  "issues": ["List of specific issues found, or empty array"],
  "checkedFacts": ["List of facts that were verified"],
  "correctionsRequired": ["Specific instructions to fix the issues, or empty array"]
}`;

      const valResponse = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "agnes-3.0-flash",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: validatorPrompt }],
          temperature: 0.1 // Low temperature for strict evaluation
        })
      });

      if (!valResponse.ok) throw new Error('Validator request failed');
      
      const valData = await valResponse.json();
      validationResult = JSON.parse(valData.choices?.[0]?.message?.content || "{}");

      if (validationResult.status === "PASS") {
        break; // Validation successful
      }

      // 2. Optimization / Correction Phase
      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        break; // Max attempts reached, we will return the failed state to the user
      }

      const correctionPrompt = `The previous campaign generation FAILED validation against the strict business facts.
      
Locked Facts (STRICTLY PRESERVE):
${JSON.stringify(lockedFacts, null, 2)}

Previous Campaign:
${JSON.stringify(currentCampaign, null, 2)}

Validation Issues:
${JSON.stringify(validationResult.issues, null, 2)}

Corrections Required:
${JSON.stringify(validationResult.correctionsRequired, null, 2)}

Regenerate the campaign, fixing all validation issues while preserving the EXACT structure. DO NOT invent facts.`;

      const optResponse = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "agnes-3.0-flash",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: correctionPrompt }
          ],
          temperature: 0.3 // Lower temp for corrections
        })
      });

      if (!optResponse.ok) throw new Error('Correction request failed');
      
      const optData = await optResponse.json();
      currentCampaign = JSON.parse(optData.choices?.[0]?.message?.content || "{}");
    }

    return NextResponse.json({
      success: true,
      campaign: currentCampaign,
      validation: validationResult
    });

  } catch {
    // Never expose internal error details to the client
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}

// Server-side copy of the deterministic rule engine to ensure security and consistency
function analyzeCampaignForClarifications(data: any) {
  const questions = [];
  const offerLower = (data.offer || "").toLowerCase();
  const promotingLower = (data.promoting || "").toLowerCase();
  
  if ((offerLower.includes("discount") || offerLower.includes("off")) && !/\d/.test(offerLower)) {
    questions.push({ id: "missing_discount", field: "offer" });
  }
  
  if (offerLower.includes("special offer") && offerLower.length < 20) {
    questions.push({ id: "vague_offer", field: "offer" });
  }

  if ((offerLower.includes("limited time") || promotingLower.includes("limited time")) && !offerLower.includes("date") && !offerLower.includes("until") && !/\d/.test(offerLower)) {
    questions.push({ id: "missing_dates", field: "offer" });
  }

  if ((data.targetAudience || "").toLowerCase().trim() === "everyone" || (data.targetAudience || "").toLowerCase().trim() === "anyone") {
    questions.push({ id: "vague_audience", field: "targetAudience" });
  }

  return questions;
}
