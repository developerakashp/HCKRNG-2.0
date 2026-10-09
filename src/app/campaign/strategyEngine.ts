export interface ChannelStrategy {
  channel: string;
  role: string;
  contentFormat: string;
  messagingStyle: string[];
  primaryMessage: string;
  cta: string;
  languages: string[];
}

export interface CampaignMessageMap {
  hook: string;
  offerMessage: string;
  validityMessage: string;
  conditionMessage: string;
  cta: string;
}

export interface CampaignStrategy {
  campaignObjective: string;
  supportingObjective: string;
  coreMessage: string;
  messageHierarchy: CampaignMessageMap;
  campaignPillars: { title: string; description: string }[];
  channelStrategies: ChannelStrategy[];
  languages: string[];
  primaryTone: string;
  secondaryTone: string[];
  primaryCta: string;
  alternativeCtas: string[];
  contentPlan: {
    title: string;
    purpose: string;
    angle: string;
    channels: string[];
  }[];
  audience: string;
  strategyStatus: "draft" | "needs_review" | "ready_for_generation";
  validation: {
    valid: boolean;
    violations: string[];
  };
  createdAt: string;
}

export function generateCampaignStrategy(lockedFacts: any, audienceStrategy: any): CampaignStrategy {
  const f = lockedFacts.facts;
  const isWeekend = f.validity.toLowerCase().includes("saturday") || f.validity.toLowerCase().includes("weekend");

  const strategy: CampaignStrategy = {
    campaignObjective: f.campaignGoal || "Increase Engagement",
    supportingObjective: `Drive awareness and visits among ${f.eligibleCustomers}.`,
    coreMessage: `Your ${isWeekend ? 'weekend' : ''} ${f.offerAppliesTo} treat, now ${f.offer} for ${f.eligibleCustomers.toLowerCase()}.`,
    messageHierarchy: {
      hook: `${isWeekend ? 'Weekend plans? ' : ''}Your ${f.offerAppliesTo} just got better.`,
      offerMessage: `${f.eligibleCustomers} get ${f.offer} on ${f.offerAppliesTo}.`,
      validityMessage: `Available ${f.validity}.`,
      conditionMessage: f.conditions,
      cta: `Visit ${f.businessName} ${isWeekend ? 'this weekend' : 'today'}.`
    },
    campaignPillars: [
      { title: "Target Value", description: `Highlight the ${f.offer} benefit for eligible ${f.eligibleCustomers.toLowerCase()}.` },
      { title: `${isWeekend ? 'Weekend ' : ''}Moment`, description: `Position the ${f.offerAppliesTo} as a simple ${isWeekend ? 'weekend ' : ''}café experience.` },
      { title: "Local Café Experience", description: `Use ${f.businessName}'s ${f.location.split(',')[1]?.trim() || 'local'} identity and friendly tone without inventing unsupported claims.` },
      { title: "Clear Eligibility", description: `Make ${f.eligibleCustomers.toLowerCase()} eligibility and the ${f.conditions.toLowerCase()} condition easy to understand.` }
    ],
    channelStrategies: audienceStrategy.recommendedChannels.map((ch: any) => {
      if (ch.name === "Instagram") {
        return {
          channel: "INSTAGRAM",
          role: "Primary Discovery Channel",
          contentFormat: "Short promotional post / carousel / story-style messaging",
          messagingStyle: ["Short", "Visual", "Youthful", "Hook-first"],
          primaryMessage: `${isWeekend ? 'Weekend ' : ''}${f.offerAppliesTo} + ${f.offer}`,
          cta: `Visit ${f.businessName} ${isWeekend ? 'this weekend' : 'today'}`,
          languages: audienceStrategy.languageStrategy.map((l: any) => l.language)
        };
      } else if (ch.name === "WhatsApp") {
        return {
          channel: "WHATSAPP",
          role: "Direct Sharing Channel",
          contentFormat: "Concise promotional message",
          messagingStyle: ["Personal", "Direct", "Easy to forward"],
          primaryMessage: `${f.eligibleCustomers} ${f.offerAppliesTo} offer`,
          cta: `Visit ${f.businessName} ${isWeekend ? 'this weekend' : 'today'}`,
          languages: audienceStrategy.languageStrategy.map((l: any) => l.language)
        };
      }
      return {
        channel: ch.name.toUpperCase(),
        role: "Supporting Channel",
        contentFormat: "Standard post",
        messagingStyle: ["Clear", "Direct"],
        primaryMessage: `${f.offer} on ${f.offerAppliesTo}`,
        cta: `Visit ${f.businessName}`,
        languages: audienceStrategy.languageStrategy.map((l: any) => l.language)
      }
    }),
    languages: audienceStrategy.languageStrategy.map((l: any) => l.language),
    primaryTone: audienceStrategy.recommendedTone[0] || "Friendly",
    secondaryTone: audienceStrategy.recommendedTone.slice(1) || ["Youthful"],
    primaryCta: `Visit ${f.businessName} ${isWeekend ? 'this weekend' : 'today'}.`,
    alternativeCtas: [
      `Make your ${isWeekend ? 'weekend ' : ''}${f.offerAppliesTo} stop.`,
      `Drop by ${f.businessName} ${isWeekend ? 'this weekend' : 'today'}.`
    ],
    contentPlan: [
      {
        title: "CONTENT 01 — ATTENTION",
        purpose: "Stop the scroll.",
        angle: `${isWeekend ? 'Weekend ' : ''}${f.offerAppliesTo} moment.`,
        channels: ["Instagram"]
      },
      {
        title: "CONTENT 02 — OFFER EXPLANATION",
        purpose: "Clearly explain the offer.",
        angle: `${f.offer} on ${f.offerAppliesTo} for ${f.eligibleCustomers}.`,
        channels: audienceStrategy.recommendedChannels.map((c: any) => c.name)
      },
      {
        title: "CONTENT 03 — REMINDER",
        purpose: `Remind eligible ${f.eligibleCustomers.toLowerCase()} before/during the ${isWeekend ? 'weekend' : 'validity period'}.`,
        angle: `${isWeekend ? 'Weekend ' : ''}offer reminder.`,
        channels: ["WhatsApp", "Instagram"]
      }
    ],
    audience: f.eligibleCustomers,
    strategyStatus: "draft",
    validation: { valid: true, violations: [] },
    createdAt: new Date().toISOString()
  };

  strategy.validation = validateCampaignStrategy(strategy, lockedFacts);
  return strategy;
}

export function validateCampaignStrategy(strategy: CampaignStrategy, lockedFacts: any) {
  const violations = [];
  const f = lockedFacts.facts;
  
  const strategyStr = JSON.stringify(strategy).toLowerCase();
  
  if (f.offer && !strategyStr.includes(f.offer.toLowerCase())) {
    violations.push(`Offer percentage changed or missing: Expected ${f.offer}.`);
  }
  
  if (f.offerAppliesTo && !strategyStr.includes(f.offerAppliesTo.toLowerCase())) {
    violations.push(`Product changed or missing: Expected ${f.offerAppliesTo}.`);
  }
  
  if (f.eligibleCustomers && !strategyStr.includes(f.eligibleCustomers.toLowerCase().split(' ')[0])) {
    violations.push(`Eligibility changed or missing: Expected ${f.eligibleCustomers}.`);
  }

  return {
    valid: violations.length === 0,
    violations
  };
}
