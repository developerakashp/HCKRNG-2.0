import { NextResponse } from "next/server";

// Sanitize string inputs to prevent injection
function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength).replace(/<[^>]*>/g, "");
}

export async function POST(req: Request) {
  // Enforce JSON content-type
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "Invalid content type" },
      { status: 415 },
    );
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { idea } = body as Record<string, unknown>;
    const sanitizedIdea = sanitizeString(idea);

    if (!sanitizedIdea) {
      return NextResponse.json(
        { success: false, error: "ಕ್ಯಾಂಪೇನ್ ಐಡಿಯಾ ಅಗತ್ಯ (Campaign idea is required)" },
        { status: 400 },
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isWeekend =
      sanitizedIdea.toLowerCase().includes("weekend") ||
      sanitizedIdea.toLowerCase().includes("saturday");
    const offerValue = sanitizedIdea.match(/\d+%/)?.[0] || "15%";
    const product = sanitizedIdea.toLowerCase().includes("coffee")
      ? "Filter Coffee"
      : "Our Products";

    return NextResponse.json({
      success: true,
      originalIntent: {
        offer: offerValue,
        product,
        timeline: isWeekend ? "This Weekend" : "Limited Time",
      },
      generations: {
        instagram: {
          text: `Your weekend deserves a perfect cup of ${product.toLowerCase()}. Enjoy ${offerValue} off this ${
            isWeekend ? "Saturday" : "week"
          }.`,
        },
        whatsapp: {
          text: `ಈ ವಾರಾಂತ್ಯಕ್ಕೆ ಒಂದು ಬಿಸಿ ಬಿಸಿ ${
            product === "Filter Coffee" ? "ಫಿಲ್ಟರ್ ಕಾಫಿ" : product
          }! Enjoy ${offerValue} off.`,
        },
        poster: {
          text: `${offerValue} OFF`,
          subtext: isWeekend ? "THIS SATURDAY" : "TODAY",
        },
      },
      predictions: {
        reach: "8.4K",
        engagement: "7.8%",
        conversions: 214,
      },
    });
  } catch {
    // Never leak internal errors to the client
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
