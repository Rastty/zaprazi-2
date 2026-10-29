import test from "node:test";
import assert from "node:assert/strict";
import {recommendMobility} from "../src/mobility/engine.js";

const base = {
  environment: "indoor", supportNeed: "steady", canLiftWalker: "yes",
  handBrakes: "yes", seatNeeded: false, transportNeed: false,
  homeSpace: "standard", duration: "unknown"
};

test("Mobility rejects malformed inputs and ambiguous boolean flags without product/acquisition links", () => {
  for (const input of [null, [], "indoor", 0, true]) {
    const result = recommendMobility(input);
    assert.equal(result.status, "invalid_input", String(input));
    assert.deepEqual(result.recommendations, []);
    assert.deepEqual(result.acquisition, []);
  }
  for (const field of ["seatNeeded", "transportNeed"]) {
    for (const value of ["false", "true", 0, 1, null, [], {}]) {
      const result = recommendMobility({...base, [field]: value});
      assert.equal(result.status, "invalid_input", field + ": " + String(value));
      assert.deepEqual(result.missing, [field]);
      assert.deepEqual(result.recommendations, []);
      assert.deepEqual(result.acquisition, []);
    }
  }
  assert.equal(recommendMobility(base).status, "candidate",
    "Real boolean answers still preserve the valid journey");
});

test("Exhaustive 3,888-combination Mobility safety matrix never unlocks a blocked branch", () => {
  let cases = 0, candidates = 0, blocked = 0;
  for (const environment of ["indoor", "outdoor", "both"])
  for (const supportNeed of ["light", "steady", "person_assist", "unknown"])
  for (const handBrakes of ["yes", "no", "unknown"])
  for (const canLiftWalker of ["yes", "no", "unknown"])
  for (const seatNeeded of [false, true])
  for (const transportNeed of [false, true])
  for (const homeSpace of ["tight", "standard", "unknown"])
  for (const duration of ["short_term", "long_term", "unknown"]) {
    const input = {environment, supportNeed, handBrakes, canLiftWalker,
      seatNeeded, transportNeed, homeSpace, duration};
    const result = recommendMobility(input);
    const braked = seatNeeded || environment !== "indoor";
    const allowed = supportNeed === "steady" &&
      (braked ? handBrakes === "yes" : canLiftWalker !== "unknown");
    const label = JSON.stringify(input);
    assert.equal(result.status === "candidate", allowed, label);
    if (allowed) {
      candidates++;
      assert.equal(result.recommendations.length, 1, label);
      assert.equal(result.acquisition.length, 2, label);
      const ids = result.recommendations[0].productCandidateIds;
      assert.deepEqual(ids, braked
        ? ["meyra-ideal-3061982"]
        : canLiftWalker === "no" ? ["besco-wa21"] : ["besco-wa17", "besco-wa21"], label);
      assert.ok(result.disclaimer.includes("není diagnóza"), label);
    } else {
      blocked++;
      assert.deepEqual(result.recommendations, [], label);
      assert.deepEqual(result.acquisition, [], label);
    }
    cases++;
  }
  assert.equal(cases, 3888);
  assert.ok(candidates > 0 && blocked > 0);
});
