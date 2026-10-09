import test from "node:test";
import assert from "node:assert/strict";
import { recommendAdjustableBed } from "../src/bed/engine.js";

test("standard home branch returns CLASSIC after load and space gates pass", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "home_positioning",
    transferAbility: "independent",
    loadFit: "yes",
    spaceFit: "yes",
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2777"]);
  assert.ok(result.acquisition.some((item) => item.id === "check_reimbursement_or_circulation"));
});

test("caregiver access uses same CLASSIC candidate with different rationale", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "caregiver_access",
    transferAbility: "person_assist",
    loadFit: "yes",
    spaceFit: "yes",
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2777"]);
  assert.match(result.recommendations[0].reason, /pečující osoby/i);
  assert.match(result.disclaimer, /sama neřeší bezpečný přesun/i);
});

test("robust branch returns Hospital", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "robust_high_load",
    userCapacityVerified: "yes",
    transferAbility: "steadying",
    loadFit: "yes",
    spaceFit: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p4707"]);
  assert.match(result.recommendations[0].parameters.join(" "), /250 kg/);
});

test("advanced in-bed care returns Multibed with explicit caregiver caution", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "advanced_in_bed_care",
    userCapacityVerified: "yes",
    transferAbility: "mostly_in_bed",
    loadFit: "yes",
    spaceFit: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p4044"]);
  assert.match(result.disclaimer, /zaučení pečující osoby/i);
});

test("unknown load fit returns no exact bed", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "home_positioning",
    transferAbility: "independent",
    loadFit: "unknown",
    spaceFit: "yes"
  });

  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("failed standard load fit routes toward robust branch without asking raw weight", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "home_positioning",
    transferAbility: "steadying",
    loadFit: "no",
    spaceFit: "yes"
  });

  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("primaryNeed"));
  assert.doesNotMatch(result.nextStep, /kg|kilogram/i);
});

test("failed space fit returns no exact bed", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "robust_high_load",
    transferAbility: "person_assist",
    loadFit: "yes",
    spaceFit: "no"
  });

  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("short-term acquisition leads with rental", () => {
  const result = recommendAdjustableBed({
    primaryNeed: "home_positioning",
    transferAbility: "independent",
    loadFit: "yes",
    spaceFit: "yes",
    duration: "short_term"
  });

  assert.equal(result.acquisition[0].id, "rent_first");
  assert.ok(result.acquisition.some((item) => item.id === "check_reimbursement_or_circulation"));
});


test("generic bed nosnost cannot authorize Hospital or Multibed patient-weight suitability", () => {
  for (const primaryNeed of ["robust_high_load", "advanced_in_bed_care"]) {
    const input = { primaryNeed, transferAbility: "independent", loadFit: "yes", spaceFit: "yes" };
    for (const confirmation of [undefined, "unknown", "no"]) {
      const outcome = recommendAdjustableBed({...input, ...(confirmation ? {userCapacityVerified:confirmation} : {})});
      assert.equal(outcome.status, "needs_more_info");
      assert.deepEqual(outcome.recommendations, []);
      assert.deepEqual(outcome.acquisition, []);
      assert.deepEqual(outcome.missing, ["userCapacityVerified"]);
      assert.match(outcome.nextStep, /nosnost|hmotnost|výrobce/i);
    }
    const confirmed = recommendAdjustableBed({...input, userCapacityVerified:"yes"});
    assert.equal(confirmed.status, "candidate");
  }
  const classic = recommendAdjustableBed({primaryNeed:"home_positioning",loadFit:"yes",spaceFit:"yes"});
  assert.equal(classic.status,"candidate","CLASSIC has a separately evidenced max patient weight");
  assert.equal(recommendAdjustableBed({
    primaryNeed:"robust_high_load",loadFit:"yes",spaceFit:"yes",userCapacityVerified:"untrusted"
  }).status,"invalid_input");
});
