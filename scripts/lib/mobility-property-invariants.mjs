import assert from "node:assert/strict";

const MOBILITY_IDS = new Set(["besco-wa17", "besco-wa21", "meyra-ideal-3061982"]);
const PRIVATE_SENTINEL = "PRIVATE_DO_NOT_EXPORT_A7EC";

/**
 * Portable safety invariants, independently callable by deterministic tests
 * and by the isolated fast-check runner. No browser or visitor data involved.
 */
export function verifyMobilityInvariants(input, result) {
  assert.ok(result && typeof result === "object", "Decision engine must return an object");
  assert.ok(Array.isArray(result.recommendations), "Missing recommendations array");
  assert.ok(Array.isArray(result.acquisition), "Missing acquisition array");
  assert.equal(Object.hasOwn(result, "input"), false, "Raw input must not be echoed");
  assert.equal(Object.hasOwn(result, "answers"), false, "Answer object must not be echoed");
  const encoded = JSON.stringify(result);
  assert.ok(!encoded.includes(PRIVATE_SENTINEL), "Private synthetic canary leaked into result");
  assert.ok(!/https?:\/\//i.test(encoded), "Decision engine must not construct merchant URLs");

  if (result.status !== "candidate") {
    assert.deepEqual(result.recommendations, [], "No product on unresolved or blocked situation");
    assert.deepEqual(result.acquisition, [], "No acquisition CTA on unresolved or blocked situation");
    return;
  }

  assert.equal(input.supportNeed, "steady", "Candidate without independently steady support");
  assert.equal(result.recommendations.length, 1, "One unambiguous solution family required");
  assert.ok(result.acquisition.some(step => step.id === "check_reimbursement"),
    "Buying cannot erase reimbursement verification");
  const ids = result.recommendations[0].productCandidateIds;
  assert.ok(Array.isArray(ids) && ids.length > 0, "Candidate must have source-backed products");
  assert.equal(new Set(ids).size, ids.length, "Duplicate product in candidate list");
  for (const id of ids) assert.ok(MOBILITY_IDS.has(id), "Unknown model exposed: " + id);

  if (input.seatNeeded || input.environment !== "indoor") {
    assert.equal(input.handBrakes, "yes", "Braked rollator offered without confirmed brake use");
    assert.deepEqual(ids, ["meyra-ideal-3061982"], "Rollator selection changed identity");
  } else if (input.canLiftWalker === "no") {
    assert.deepEqual(ids, ["besco-wa21"], "Cannot lift walker but fixed walker offered");
  } else {
    assert.equal(input.canLiftWalker, "yes", "Unknown lift ability must block selection");
    assert.deepEqual(ids, ["besco-wa17", "besco-wa21"]);
  }
}

export function withPrivateCanary(input) {
  return {...input, privateNote: PRIVATE_SENTINEL};
}
