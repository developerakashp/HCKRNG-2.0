export function validateBusinessIntent(outputText: string, lockedFacts: any) {
  const violations = [];
  const text = outputText.toLowerCase();

  // Basic deterministic validation for demo
  
  if (lockedFacts.offer && !text.includes(lockedFacts.offer.toLowerCase())) {
    violations.push(`Offer changed from ${lockedFacts.offer}.`);
  }

  if (lockedFacts.offerAppliesTo && !text.includes(lockedFacts.offerAppliesTo.toLowerCase())) {
    violations.push(`Offer applies to ${lockedFacts.offerAppliesTo}, not all products.`);
  }
  
  if (lockedFacts.eligibleCustomers && !text.includes("student")) {
    if (text.includes("everyone") || text.includes("all customers")) {
      violations.push(`Eligible customers changed from ${lockedFacts.eligibleCustomers} to Everyone.`);
    }
  }

  if (lockedFacts.validity) {
    if (text.includes("all week") || text.includes("every day")) {
      violations.push(`Validity changed from ${lockedFacts.validity}.`);
    } else if (!text.includes("saturday") || !text.includes("sunday")) {
      if (text.includes("weekend")) {
        // weekend is fine for saturday and sunday
      } else {
        violations.push(`Validity changed from ${lockedFacts.validity}.`);
      }
    }
  }

  return {
    valid: violations.length === 0,
    violations
  };
}
