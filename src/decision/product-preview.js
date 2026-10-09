// ZP_RELEASE_0_8_71
import { recommendAdjustableBed } from "../bed/engine.js";
import { recommendWheelchair } from "../wheelchair/engine.js";

/**
 * Source-backed product FACTS preview only.
 * Hypothetical "yes" fit values identify catalog IDs but never count as real
 * confirmations. Buying links can be unlocked only by the original strict
 * recommendation engine with the visitor's actual stage-2 answers.
 */
function toPreview(result) {
  return result.status === "candidate"
    ? {
        status: "unverified_preview",
        headline: "Výrobek k ověření – zatím není potvrzená vhodnost",
        nextStep: "Porovnejte zobrazené parametry s potřebami člověka a s prostředím doma.",
        productCandidateIds: result.recommendations.flatMap(row => row.productCandidateIds ?? [])
      }
    : {
        status: result.status,
        headline: result.headline,
        nextStep: result.nextStep,
        productCandidateIds: []
      };
}

export function previewAdjustableBed(input = {}) {
  return toPreview(recommendAdjustableBed({ ...input, loadFit: "yes", spaceFit: "yes", userCapacityVerified: "yes" }));
}

export function previewWheelchair(input = {}) {
  // Unsafe/unknown personal transfer and powered control must be resolved
  // before even previewing an exact wheelchair model.
  if (!["independent", "steadying"].includes(input.transferAbility)) {
    const result = recommendWheelchair({ ...input, loadFit: "yes", seatFit: "yes", widthFit: "yes", wheelType: "pneumatic" });
    if (input.transferAbility === "person_assist") return toPreview(result);
    return {
      status: "needs_more_info",
      headline: "Nejdřív je potřeba objasnit způsob přesunu.",
      nextStep: "U invalidního vozíku je pro bezpečnost zásadní, zda člověk potřebuje fyzické zvedání.",
      productCandidateIds: []
    };
  }
  return toPreview(recommendWheelchair({
    ...input, loadFit: "yes", seatFit: "yes", widthFit: "yes", wheelType: "pneumatic"
  }));
}
