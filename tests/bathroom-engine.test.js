import test from "node:test";
import assert from "node:assert/strict";
import { recommendBathroom } from "../src/bathroom/engine.js";

test("fails closed when main need is unknown", () => {
  const result = recommendBathroom({ primaryNeed: "unknown" });
  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("requires transfer clarification before any exact product", () => {
  const result = recommendBathroom({ primaryNeed: "raise_toilet", loadFit: "yes" });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("transferAbility"));
});

test("routes physical-assistance transfer to professional check", () => {
  const result = recommendBathroom({
    primaryNeed: "shower_seated",
    transferAbility: "person_assist",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("raised toilet seat requires toilet fit", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "independent",
    loadFit: "yes",
    toiletFit: "unknown",
    feetFlatAtRaisedHeight: "yes"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("toiletFit"));
});

test("raised toilet seat refuses unsafe foot support", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "independent",
    loadFit: "yes",
    toiletFit: "yes",
    feetFlatAtRaisedHeight: "no"
  });
  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("returns WC raiser only after critical fit gates pass", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "independent",
    loadFit: "yes",
    toiletFit: "yes",
    feetFlatAtRaisedHeight: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2868"]);
});

test("unverified wall fixing does not return wall-mounted grab rail", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_support",
    transferAbility: "steadying",
    loadFit: "yes",
    wallFixing: "unverified"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2015"]);
});

test("verified wall fixing allows fixed rail comparison", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_support",
    transferAbility: "steadying",
    loadFit: "yes",
    wallFixing: "verified"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2131", "unizdrav-p2015"]);
});

test("static commode requires stable floor and space", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_nearby",
    transferAbility: "independent",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "unknown"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("spaceFit"));
});

test("returns static commode after fit gates pass", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_nearby",
    transferAbility: "steadying",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2807"]);
});

test("returns shower chair only after stable floor and space fit", () => {
  const result = recommendBathroom({
    primaryNeed: "shower_seated",
    transferAbility: "independent",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2062"]);
});

test("bath transfer remains professional-check only", () => {
  const result = recommendBathroom({
    primaryNeed: "bath_transfer",
    transferAbility: "independent",
    loadFit: "yes"
  });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("combined shower/toilet chair remains professional-check only", () => {
  const result = recommendBathroom({
    primaryNeed: "combined_shower_toilet",
    transferAbility: "steadying",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("output never echoes raw input payload", () => {
  const input = {
    primaryNeed: "toilet_support",
    transferAbility: "steadying",
    loadFit: "yes",
    wallFixing: "verified",
    duration: "short_term"
  };
  const result = recommendBathroom(input);
  assert.equal("input" in result, false);
  assert.equal("answers" in result, false);
});
