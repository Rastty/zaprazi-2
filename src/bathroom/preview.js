import { recommendBathroom } from "./engine.js";

/**
 * Discovery preview only. Hypothetical "yes" is used exclusively to identify
 * which catalog facts to show BEFORE the visitor can verify a specific aid.
 * The caller must never use this result to render merchant links or to claim fit.
 * Only recommendBathroom() with the visitor's real fit answers can approve
 * final product offers.
 */
export function previewBathroomCandidates(input = {}) {
  const outcome = recommendBathroom({
    ...input,
    loadFit: "yes",
    toiletFit: "yes",
    feetFlatAtRaisedHeight: "yes",
    supportFrameFit: "yes",
    spaceFit: "yes",
    bathFit: "yes",
    bathBenchFit: "unknown"
  });

  return {
    status: outcome.status === "candidate" ? "unverified_preview" : outcome.status,
    headline: outcome.status === "candidate"
      ? "Možná řešení – před výběrem ověřte parametry"
      : outcome.headline,
    nextStep: outcome.status === "candidate"
      ? "Níže uvidíte konkrétní výrobek a jeho údaje. Teprve potom zkontrolujete, zda vyhovuje člověku a prostoru."
      : outcome.nextStep,
    productCandidateIds: outcome.status === "candidate"
      ? outcome.recommendations.flatMap(item => item.productCandidateIds ?? [])
      : [],
    // No offers, acquisition guidance or completion signal in stage 1.
  };
}
