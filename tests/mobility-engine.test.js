import test from "node:test";
import assert from "node:assert/strict";
import { recommendMobility } from "../src/mobility/engine.js";

test("fails closed when support need is unknown", () => {
  const result = recommendMobility({ environment: "indoor", supportNeed: "unknown" });
  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("routes frequent physical assistance to professional check", () => {
  const result = recommendMobility({ environment: "both", supportNeed: "person_assist", handBrakes: "yes" });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("does not force a walker for light support in v1", () => {
  const result = recommendMobility({ environment: "indoor", supportNeed: "light" });
  assert.equal(result.status, "outside_current_slice");
  assert.deepEqual(result.recommendations, []);
});

test("requires brake-use clarification before outdoor rollator candidate", () => {
  const result = recommendMobility({ environment: "outdoor", supportNeed: "steady", handBrakes: "unknown" });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("handBrakes"));
});

test("returns rollator candidate for steady outdoor support with brake use confirmed", () => {
  const result = recommendMobility({ environment: "outdoor", supportNeed: "steady", handBrakes: "yes", seatNeeded: true, duration: "long_term" });
  assert.equal(result.status, "candidate");
  assert.equal(result.recommendations[0].id, "rollator_candidate");
  assert.ok(result.recommendations[0].parameters.some((x) => x.includes("sedátko")));
  assert.ok(result.acquisition.some((x) => x.id === "check_reimbursement"));
});

test("short-term need explicitly compares rental and purchase", () => {
  const result = recommendMobility({ environment: "indoor", supportNeed: "steady", duration: "short_term" });
  assert.equal(result.status, "candidate");
  assert.equal(result.acquisition[0].id, "compare_rent_buy");
});

test("tight indoor space creates compact indoor candidate", () => {
  const result = recommendMobility({ environment: "indoor", supportNeed: "steady", homeSpace: "tight" });
  assert.equal(result.recommendations[0].id, "indoor_compact_walker_candidate");
});

test("output does not echo raw answer payload", () => {
  const input = { environment: "both", supportNeed: "steady", handBrakes: "yes", seatNeeded: true, homeSpace: "standard", transportNeed: true, duration: "unknown" };
  const result = recommendMobility(input);
  assert.equal("input" in result, false);
  assert.equal("answers" in result, false);
});
