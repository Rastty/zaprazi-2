import test from "node:test";
import assert from "node:assert/strict";
import { recommendWheelchair } from "../src/wheelchair/engine.js";

test("companion branch returns Basic after fit gates pass", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "steadying",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p4384"]);
  assert.ok(result.acquisition.some((item) => item.id === "check_insurer"));
});

test("self-propelled branch returns lightweight manual chair", () => {
  const result = recommendWheelchair({
    propulsion: "self_manual",
    transferAbility: "independent",
    manualControlSafe: "yes",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p3641"]);
  assert.match(result.recommendations[0].reason, /pohánět rukama/i);
});

test("mixed manual branch uses the same dual-use chair", () => {
  const result = recommendWheelchair({
    propulsion: "mixed_manual",
    transferAbility: "steadying",
    manualControlSafe: "yes",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p3641"]);
  assert.match(result.recommendations[0].reason, /střídat/i);
});

test("manual propulsion requires practical steering and stopping safety", () => {
  for (const propulsion of ["self_manual", "mixed_manual"]) {
    const unknown = recommendWheelchair({
      propulsion,
      transferAbility: "independent",
      manualControlSafe: "unknown",
      seatFit: "yes",
      widthFit: "yes",
      loadFit: "yes"
    });
    assert.equal(unknown.status, "needs_more_info");
    assert.ok(unknown.missing.includes("manualControlSafe"));
    assert.deepEqual(unknown.recommendations, []);

    const unsafe = recommendWheelchair({
      propulsion,
      transferAbility: "independent",
      manualControlSafe: "no",
      seatFit: "yes",
      widthFit: "yes",
      loadFit: "yes"
    });
    assert.equal(unsafe.status, "professional_check");
    assert.deepEqual(unsafe.recommendations, []);
  }
});

test("powered branch requires practical joystick safety", () => {
  const result = recommendWheelchair({
    propulsion: "powered",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    joystickSafe: "unknown",
    chargingReady: "yes"
  });

  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("joystickSafe"));
  assert.deepEqual(result.recommendations, []);
});

test("powered branch requires charging setup", () => {
  const result = recommendWheelchair({
    propulsion: "powered",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    joystickSafe: "yes",
    chargingReady: "unknown"
  });

  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("chargingReady"));
});

test("powered branch returns exact electric chair after all gates pass", () => {
  const result = recommendWheelchair({
    propulsion: "powered",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    joystickSafe: "yes",
    chargingReady: "yes",
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2961"]);
  assert.match(result.recommendations[0].parameters.join(" "), /62 kg/);
  assert.match(result.recommendations[0].parameters.join(" "), /86,5 cm/);
});

test("physical assistance transfer remains professional-check only", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "person_assist",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("unknown load fit returns no exact product without asking raw weight", () => {
  const result = recommendWheelchair({
    propulsion: "self_manual",
    transferAbility: "independent",
    manualControlSafe: "yes",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "unknown"
  });

  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
  assert.match(result.nextStep, /Přesnou hmotnost/i);
});

test("failed seat fit returns no exact product", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "independent",
    seatFit: "no",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("short-term acquisition leads with rental", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    duration: "short_term"
  });

  assert.equal(result.acquisition[0].id, "rent_first");
});
