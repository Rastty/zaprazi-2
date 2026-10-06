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

test("requires lift clarification before indoor fixed-walker shortlist", () => {
  const result = recommendMobility({ environment: "indoor", supportNeed: "steady", canLiftWalker: "unknown" });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("canLiftWalker"));
});

test("returns two-wheel walker when user cannot lift whole walker", () => {
  const result = recommendMobility({
    environment: "indoor",
    supportNeed: "steady",
    canLiftWalker: "no"
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.recommendations[0].id, "indoor_front_wheel_walker_candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["besco-wa21"]);
});

test("returns fixed and front-wheel candidates when lifting is possible", () => {
  const result = recommendMobility({
    environment: "indoor",
    supportNeed: "steady",
    canLiftWalker: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["besco-wa17", "besco-wa21"]);
});

test("returns rollator candidates for steady outdoor support with brake use confirmed", () => {
  const result = recommendMobility({
    environment: "outdoor",
    supportNeed: "steady",
    handBrakes: "yes",
    seatNeeded: true,
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.recommendations[0].id, "rollator_candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["meyra-ideal-3061982"]);
  assert.ok(result.recommendations[0].parameters.some((x) => x.includes("sedátko")));
  assert.ok(result.acquisition.some((x) => x.id === "check_reimbursement"));
});

test("short-term need explicitly compares rental and purchase", () => {
  const result = recommendMobility({
    environment: "indoor",
    supportNeed: "steady",
    canLiftWalker: "yes",
    duration: "short_term"
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.acquisition[0].id, "compare_rent_buy");
});

test("output does not echo raw answer payload", () => {
  const input = {
    environment: "both",
    supportNeed: "steady",
    handBrakes: "yes",
    canLiftWalker: "unknown",
    seatNeeded: true,
    homeSpace: "standard",
    transportNeed: true,
    duration: "unknown"
  };

  const result = recommendMobility(input);
  assert.equal("input" in result, false);
  assert.equal("answers" in result, false);
});


test("indoor candidate uses walking-movement wording instead of brake wording", () => {
  const result = recommendMobility({
    environment: "indoor",
    supportNeed: "steady",
    canLiftWalker: "no"
  });

  const parameters = result.recommendations[0].parameters;
  assert.ok(parameters.some((value) => value.includes("posouvání chodítka")));
  assert.ok(parameters.every((value) => !value.includes("brzd")));
});

test("outdoor candidate includes brake-use parameter", () => {
  const result = recommendMobility({
    environment: "outdoor",
    supportNeed: "steady",
    handBrakes: "yes"
  });

  const parameters = result.recommendations[0].parameters;
  assert.ok(parameters.some((value) => value.includes("brzd")));
});
