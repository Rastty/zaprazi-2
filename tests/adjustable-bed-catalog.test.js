import test from "node:test";
import assert from "node:assert/strict";
import { ADJUSTABLE_BED_PRODUCTS, getAdjustableBedProducts } from "../src/bed/catalog.js";

test("Slice 3 catalog contains exactly three production candidates", () => {
  assert.equal(ADJUSTABLE_BED_PRODUCTS.filter((item) => item.productionEligible).length, 3);
});

test("CLASSIC has exact home-fit facts", () => {
  const item = ADJUSTABLE_BED_PRODUCTS.find((product) => product.id === "unizdrav-p2777");
  assert.ok(item);
  assert.equal(item.facts.outerSizeCm, "102.5 × 212");
  assert.equal(item.facts.heightRangeCm, "38.6–80.6");
  assert.equal(item.facts.maxUserWeightKg, 178);
  assert.equal(item.facts.mattressIncluded, false);
  assert.equal(item.offers[0].affiliateKey, "unizdrav-cz:p2777");
});

test("Hospital is the robust candidate", () => {
  const item = ADJUSTABLE_BED_PRODUCTS.find((product) => product.id === "unizdrav-p4707");
  assert.ok(item);
  assert.equal(item.solutionFamily, "electric_adjustable_bed_robust");
  assert.equal(item.facts.maxLoadKg, 250);
  assert.equal(item.facts.centralBrake, true);
});

test("Multibed is the advanced-care candidate", () => {
  const item = ADJUSTABLE_BED_PRODUCTS.find((product) => product.id === "unizdrav-p4044");
  assert.ok(item);
  assert.equal(item.solutionFamily, "electric_adjustable_bed_advanced_care");
  assert.equal(item.facts.lateralTurnDeg, 45);
  assert.equal(item.facts.mattressIncluded, true);
  assert.equal(item.facts.maxLoadKg, 260);
});

test("catalog lookup exposes only requested production products", () => {
  const result = getAdjustableBedProducts(["unizdrav-p2777", "missing"]);
  assert.deepEqual(result.map((item) => item.id), ["unizdrav-p2777"]);
});
