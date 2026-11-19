/**
 * Shrinkable, reproducible P0 Mobility safety pilot. 100% pure local engine;
 * no production URL, no network requests, no browser, no real visitor answers.
 * fast-check is installed temporarily by its own workflow, never bundled
 * into the WordPress theme or the regular npm test dependency graph.
 */
import assert from "node:assert/strict";
import fc from "fast-check";
import {recommendMobility} from "../../src/mobility/engine.js";
import {verifyMobilityInvariants, withPrivateCanary}
  from "../lib/mobility-property-invariants.mjs";

const seed = 0x5a9e2026;
const valid = fc.record({
  environment: fc.constantFrom("indoor", "outdoor", "both"),
  supportNeed: fc.constantFrom("steady", "light", "person_assist", "unknown"),
  seatNeeded: fc.boolean(),
  handBrakes: fc.constantFrom("yes", "no", "unknown"),
  canLiftWalker: fc.constantFrom("yes", "no", "unknown"),
  homeSpace: fc.constantFrom("tight", "standard", "unknown"),
  transportNeed: fc.boolean(),
  duration: fc.constantFrom("short_term", "long_term", "unknown")
});

// Reproducible seeding and counterexample shrinking are provided by fc.assert.
fc.assert(fc.property(valid, answers => {
  const input = withPrivateCanary(answers);
  verifyMobilityInvariants(input, recommendMobility(input));
}), {seed, numRuns: 3000, endOnFailure: false});

// The length of a requested rental/buy period may affect acquisition options,
// never the safe candidate family, product identity or safety status.
fc.assert(fc.property(valid, answers => {
  const comparison = ["short_term", "long_term", "unknown"].map(duration =>
    recommendMobility({...answers, duration}));
  for (const result of comparison.slice(1)) {
    assert.equal(result.status, comparison[0].status, "Duration altered safety status");
    assert.deepEqual(result.recommendations, comparison[0].recommendations,
      "Duration altered safety/product recommendations");
  }
}), {seed: seed + 1, numRuns: 1500, endOnFailure: false});

// Invalid shapes and type confusion must never unlock a candidate or a CTA.
const badValue = fc.oneof(
  // Undefined is intentionally a default for optional inputs in the engine.
  // Null, bad strings and wrong types must not silently become safe answers.
  fc.constant(null), fc.integer({min: -2, max: 2}),
  fc.constantFrom("", "false", "true", "invalid", [], {})
);
fc.assert(fc.property(valid, fc.constantFrom(
  "environment", "supportNeed", "seatNeeded", "handBrakes", "canLiftWalker",
  "homeSpace", "transportNeed", "duration"
), badValue, (answers, field, invalidValue) => {
  const input = withPrivateCanary({...answers, [field]: invalidValue});
  const result = recommendMobility(input);
  verifyMobilityInvariants(input, result);
  assert.equal(result.status, "invalid_input", "Invalid data was silently normalized");
}), {seed: seed + 2, numRuns: 1500, endOnFailure: false});

console.log("MOBILITY_FAST_CHECK_PASS", JSON.stringify({
  seed, fixedCaseRuns: 3000, metamorphicRuns: 1500,
  malformedRuns: 1500, totalCases: 6000, shrinkable: true,
  productionWrites: 0, externalRequests: 0, privateAnswerExports: 0
}));
