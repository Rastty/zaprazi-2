/**
 * Pages already confirmed live by dedicated postdeploy acceptance.
 * These routes are now required after confirmed production 0.8.183 deployment.
 * The historical semantic subset remains for QA; live audits de-duplicate
 * its overlap with the canonical requiredDecisionPaths inventory.
 */
export const liveVerifiedProblemPaths = Object.freeze([
  "/senior-doma-sam-sos-pomoc/",
  "/senior-odmita-choditko/",
  "/senior-odmita-koupani/",
  "/senior-malo-pije/"
]);
