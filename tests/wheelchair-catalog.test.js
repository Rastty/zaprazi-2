import test from "node:test";
import assert from "node:assert/strict";
import { WHEELCHAIR_PRODUCTS, getWheelchairProducts } from "../src/wheelchair/catalog.js";

test("Slice 4 catalog contains three production candidates", () => {
  assert.equal(WHEELCHAIR_PRODUCTS.filter((item) => item.productionEligible).length, 3);
});

test("Basic has exact companion-transport facts", () => {
  const item = WHEELCHAIR_PRODUCTS.find((product) => product.id === "unizdrav-p4384");
  assert.ok(item);
  assert.equal(item.solutionFamily, "manual_companion_transport");
  assert.equal(item.facts.seatWidthCm, 48);
  assert.equal(item.facts.maxUserWeightKg, 100);
  assert.equal(item.facts.chairWeightKg, 18.4);
  assert.equal(item.offers[0].affiliateKey, "unizdrav-cz:p4384");
});

test("P3641 supports self-propulsion and companion braking", () => {
  const item = WHEELCHAIR_PRODUCTS.find((product) => product.id === "unizdrav-p3641");
  assert.ok(item);
  assert.equal(item.solutionFamily, "manual_self_or_companion");
  assert.equal(item.facts.selfPropulsionRims, true);
  assert.equal(item.facts.companionBrakes, true);
  assert.equal(item.facts.seatWidthCm, "48 nebo 51");
});

test("P2961 has exact powered-chair route facts", () => {
  const item = WHEELCHAIR_PRODUCTS.find((product) => product.id === "unizdrav-p2961");
  assert.ok(item);
  assert.equal(item.solutionFamily, "powered_joystick");
  assert.equal(item.facts.totalWidthCm, 63);
  assert.equal(item.facts.chairWeightWithBatteryKg, 62);
  assert.equal(item.facts.maxUserWeightKg, 135);
  assert.equal(item.facts.turningRadiusCm, 86.5);
  assert.equal(item.offers[0].affiliateKey, "unizdrav-cz:p2961");
});

test("catalog lookup returns only requested production candidates", () => {
  const result = getWheelchairProducts(["unizdrav-p4384", "missing"]);
  assert.deepEqual(result.map((item) => item.id), ["unizdrav-p4384"]);
});
