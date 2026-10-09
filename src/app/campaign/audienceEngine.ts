export type AudienceProfile = {
  id: string;
  name: string;
  role: "primary" | "secondary" | "suggested";
  relevance: "high" | "medium" | "low";
  motivation: string;
  needs: string;
  messagingPreference: string;
  recommendedTone: string;
  messageAngle: string;
};

export type AudienceStrategy = {
  primaryAudience: AudienceProfile | null;
  secondaryAudiences: AudienceProfile[];
  suggestedAudiences: AudienceProfile[];
  recommendedChannels: { name: string; relevance: "High" | "Medium" | "Low"; reason: string }[];
  recommendedTone: string[];
  languageStrategy: { language: string; role: string; explanation: string }[];
  alignmentWarning: string | null;
  generatedAt: string;
};

export function analyzeAudience(brief: any, lockedFacts: any): AudienceStrategy {
  const targetAudienceStr = (lockedFacts.facts.targetAudience || brief.targetAudience || "").toLowerCase();
  const offerStr = (lockedFacts.facts.offer || brief.offer || "").toLowerCase();
  const ideaStr = (brief.roughIdea || "").toLowerCase();

  const strategy: AudienceStrategy = {
    primaryAudience: null,
    secondaryAudiences: [],
    suggestedAudiences: [],
    recommendedChannels: [],
    recommendedTone: brief.brandTone || ["Friendly", "Youthful"],
    languageStrategy: [],
    alignmentWarning: null,
    generatedAt: new Date().toISOString()
  };

  // 1. Audience Identification
  let isStudent = targetAudienceStr.includes("student") || targetAudienceStr.includes("college");
  let isPro = targetAudienceStr.includes("professional") || targetAudienceStr.includes("young");
  let isFamily = targetAudienceStr.includes("famil") || ideaStr.includes("family");

  if (!isStudent && !isPro && !isFamily) {
    if (ideaStr.includes("student")) isStudent = true;
    if (ideaStr.includes("family")) isFamily = true;
  }

  // Primary vs Secondary vs Suggested
  if (isStudent) {
    strategy.primaryAudience = {
      id: "aud-students",
      name: "College Students",
      role: "primary",
      relevance: "high",
      motivation: "Affordable options and social experiences.",
      needs: "Value-focused offers.",
      messagingPreference: "Short, energetic and easy to understand.",
      recommendedTone: "Friendly + youthful.",
      messageAngle: "Affordable weekend coffee for students."
    };
    if (isPro) {
      strategy.secondaryAudiences.push({
        id: "aud-pros",
        name: "Young Professionals",
        role: "secondary",
        relevance: "medium",
        motivation: "Quality coffee breaks and unwinding.",
        needs: "Convenience and premium experience.",
        messagingPreference: "Professional but relaxed.",
        recommendedTone: "Premium + welcoming.",
        messageAngle: "Take a well-deserved coffee break this weekend."
      });
    }
  } else if (isFamily) {
    strategy.primaryAudience = {
      id: "aud-family",
      name: "Families",
      role: "primary",
      relevance: "high",
      motivation: "Quality time and sharing meals.",
      needs: "Comfortable environment and good group offers.",
      messagingPreference: "Warm and inviting.",
      recommendedTone: "Friendly + warm.",
      messageAngle: "Enjoy a perfect family outing."
    };
  } else {
    // Suggested
    strategy.suggestedAudiences.push({
      id: "aud-local",
      name: "Local Customers",
      role: "suggested",
      relevance: "medium",
      motivation: "Convenience and supporting local business.",
      needs: "Quick service and local connection.",
      messagingPreference: "Direct and community-focused.",
      recommendedTone: "Friendly + local.",
      messageAngle: "Your neighborhood favorite coffee."
    });
  }

  // 2. Offer-Audience Consistency
  if (offerStr.includes("student") && !isStudent) {
    strategy.alignmentWarning = "Audience and offer may not align. Offer mentions students, but primary audience is different.";
  }
  if (offerStr.includes("family") && !isFamily) {
    strategy.alignmentWarning = "Audience and offer may not align. Offer mentions families, but primary audience is different.";
  }

  // 3. Channels
  const channels = brief.channels || ["Instagram", "WhatsApp"];
  if (channels.includes("Instagram") || isStudent) {
    strategy.recommendedChannels.push({ name: "Instagram", relevance: "High", reason: "Best for visual discovery and short promotional messaging." });
  }
  if (channels.includes("WhatsApp")) {
    strategy.recommendedChannels.push({ name: "WhatsApp", relevance: "High", reason: "Useful for direct, conversational promotion." });
  }
  if (channels.includes("Facebook") || isFamily) {
    strategy.recommendedChannels.push({ name: "Facebook", relevance: "Medium", reason: "Potentially useful for broader local reach." });
  }

  // 4. Languages
  const languages = brief.languages || ["English", "Kannada"];
  languages.forEach((lang: string, index: number) => {
    if (index === 0) {
      strategy.languageStrategy.push({ language: lang, role: "Primary campaign language", explanation: "Standard business communication language." });
    } else {
      strategy.languageStrategy.push({ language: lang, role: "Localized campaign language", explanation: `${lang} messaging should feel natural and culturally appropriate rather than being a word-for-word translation.` });
    }
  });

  return strategy;
}
