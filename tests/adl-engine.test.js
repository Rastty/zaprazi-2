import test from "node:test";
import assert from "node:assert/strict";
import { chooseAdlSelfCareAid } from "../src/adl/engine.js";

test("UpCup is selected only for a grip/spill drinking problem", () => {
  const result = chooseAdlSelfCareAid({
    task: "drink",
    mainProblem: "grip_or_spill",
    stableSurface: "yes",
    oneHandUse: "unknown"
  });

  assert.equal(result.status, "candidate");
  assert.equal(result.candidate?.sku, "15-050101");
  assert.equal(result.candidate?.merchant, "RehaVita.cz");
});

test("swallowing or medical issue fails closed without a product", () => {
  const result = chooseAdlSelfCareAid({
    task: "drink",
    mainProblem: "swallowing_or_medical",
    stableSurface: "yes",
    oneHandUse: "yes"
  });

  assert.equal(result.status, "professional_check");
  assert.equal(result.candidate, null);
  assert.match(result.nextStep, /odborník/i);
});

test("Beat It requires a stable work surface", () => {
  const blocked = chooseAdlSelfCareAid({
    task: "stabilize_container",
    mainProblem: "container_moves",
    stableSurface: "no",
    oneHandUse: "unknown"
  });
  assert.equal(blocked.status, "no_match");
  assert.equal(blocked.candidate, null);

  const candidate = chooseAdlSelfCareAid({
    task: "stabilize_container",
    mainProblem: "container_moves",
    stableSurface: "yes",
    oneHandUse: "unknown"
  });
  assert.equal(candidate.status, "candidate");
  assert.equal(candidate.candidate?.sku, "15-050102");
});

test("unknown Beat It fit does not become an automatic recommendation", () => {
  const result = chooseAdlSelfCareAid({
    task: "stabilize_container",
    mainProblem: "container_moves",
    stableSurface: "unknown",
    oneHandUse: "unknown"
  });

  assert.equal(result.status, "needs_fit_check");
  assert.equal(result.candidate?.sku, "15-050102");
});

test("Theomatik requires one-hand use to be confirmed for automatic candidate status", () => {
  const uncertain = chooseAdlSelfCareAid({
    task: "one_hand_meal",
    mainProblem: "one_hand_setup",
    stableSurface: "yes",
    oneHandUse: "unknown"
  });
  assert.equal(uncertain.status, "needs_fit_check");

  const result = chooseAdlSelfCareAid({
    task: "one_hand_meal",
    mainProblem: "one_hand_setup",
    stableSurface: "yes",
    oneHandUse: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.equal(result.candidate?.sku, "15-050103");
});

test("affiliate availability never forces a mismatched recommendation", () => {
  const result = chooseAdlSelfCareAid({
    task: "other",
    mainProblem: "other",
    stableSurface: "yes",
    oneHandUse: "yes"
  });

  assert.equal(result.status, "no_match");
  assert.equal(result.candidate, null);
});

test("engine has no diagnosis or raw body-weight inputs", () => {
  const source = chooseAdlSelfCareAid.toString();
  assert.doesNotMatch(source, /diagnos|weightKg|bodyWeight|operation|medication|wound/i);
});
