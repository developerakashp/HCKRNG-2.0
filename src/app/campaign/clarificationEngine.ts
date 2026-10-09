export type ClarificationQuestion = {
  id: string;
  question: string;
  reason: string;
  type: "text" | "date" | "date-range" | "single-select" | "multi-select" | "yes-no";
  field: string;
  required: boolean;
  status: "pending" | "current" | "answered" | "resolved";
  options?: string[];
  answer?: string | string[];
};

export type AnalysisResult = {
  status: "needs_clarification" | "ready_for_offer_lock" | "has_conflicts";
  questions: ClarificationQuestion[];
  conflicts: { id: string; message: string; versionA: string; versionB: string; field: string }[];
};

export function analyzeCampaignBrief(brief: any): AnalysisResult {
  const questions: ClarificationQuestion[] = [];
  const conflicts: AnalysisResult["conflicts"] = [];

  const idea = (brief.roughIdea || "").toLowerCase();
  const offer = (brief.offer || "").toLowerCase();

  // 1. Conflict Detection
  const ideaPercents = idea.match(/\d+%/g) || [];
  const offerPercents = offer.match(/\d+%/g) || [];
  
  if (ideaPercents.length > 0 && offerPercents.length > 0) {
    if (ideaPercents[0] !== offerPercents[0]) {
      conflicts.push({
        id: "discount-conflict",
        message: "We found two different offer details.",
        versionA: ideaPercents[0] + " off (from Idea)",
        versionB: offerPercents[0] + " off (from Offer)",
        field: "offer"
      });
    }
  }

  if (conflicts.length > 0) {
    return { status: "has_conflicts", questions: [], conflicts };
  }

  // 2. Offer Details Analysis
  const hasOfferDetail = offer.includes("%") || offer.includes("off") || offer.includes("free") || idea.includes("%") || idea.includes("free") || idea.includes("off");
  if (!hasOfferDetail && (idea.includes("special offer") || offer.includes("special offer") || offer.trim() === "")) {
    if (!brief.exactOfferDetails) {
      questions.push({
        id: "offer-details",
        question: "What exactly is the offer customers will receive?",
        reason: "The campaign cannot safely communicate an offer without knowing its exact value.",
        type: "text",
        field: "exactOfferDetails",
        required: true,
        status: "pending"
      });
    }
  }

  // 3. Validity Analysis
  const mentionsWeekend = idea.includes("weekend") || offer.includes("weekend");
  const mentionsSpecificDay = idea.includes("saturday") || idea.includes("sunday") || idea.includes("monday") || idea.includes("tuesday") || idea.includes("wednesday") || idea.includes("thursday") || idea.includes("friday");
  
  if ((hasOfferDetail || mentionsWeekend) && !mentionsSpecificDay) {
    if (!brief.offerValidity) {
      questions.push({
        id: "offer-validity",
        question: mentionsWeekend ? "Which days does the weekend offer apply to?" : "When is this discount valid?",
        reason: "This information is required so the campaign does not promise an incorrect validity period.",
        type: "single-select",
        field: "offerValidity",
        required: true,
        options: ["Saturday + Sunday", "Saturday only", "Sunday only", "Entire Week"],
        status: "pending"
      });
    }
  }

  // 4. Target Audience
  if (!brief.targetAudience || brief.targetAudience.trim() === "") {
    if (!idea.includes("student") && !idea.includes("customer")) {
       questions.push({
         id: "target-audience",
         question: "Who is this campaign intended for?",
         reason: "Knowing your audience helps tailor the messaging correctly.",
         type: "single-select",
         field: "targetAudience",
         required: true,
         options: ["Students", "Young Professionals", "Families", "Local Customers", "Everyone"],
         status: "pending"
       });
    }
  }

  // Set first question to current
  if (questions.length > 0) {
    questions[0].status = "current";
    return { status: "needs_clarification", questions, conflicts: [] };
  }

  return { status: "ready_for_offer_lock", questions: [], conflicts: [] };
}
