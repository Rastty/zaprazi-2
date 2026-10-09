import test from "node:test";
import assert from "node:assert/strict";
import { formatBathroomFacts } from "../src/bathroom/product-facts-display.js";
import { BATHROOM_PRODUCTS } from "../src/bathroom/catalog.js";

test("every Bathroom product fact has a Czech label and exact original numeric value", () => {
  for (const product of BATHROOM_PRODUCTS) {
    const output = formatBathroomFacts(product.facts);
    const values = Object.entries(product.facts)
      .filter(([,value]) => value != null);
    assert.equal(output.length, values.length, "Missing fact for " + product.id);
    for (const [index, [key,value]] of values.entries()) {
      assert.ok(!output[index].includes(key), "Exposed internal catalog key " + key + " for " + product.id);
      const original = (Array.isArray(value) ? value.join(" / ") : String(value))
        .replace(/(\d)\.(\d)/g, "$1,$2");
      assert.ok(output[index].includes(original), "Lost exact fact " + key + " for " + product.id);
    }
  }
});

test("key selection parameters are expressed in ordinary Czech with units", () => {
  assert.deepEqual(formatBathroomFacts({
    maxUserWeightKg: 110,
    totalWidthCm: 81,
    totalDepthCm: 61,
    weightKg: 4.4,
    lengthsCm: [30,40,45],
    fixingHoleSpacingCm: 14.4
  }),[
    "Maximální nosnost: 110 kg",
    "Celková šířka: 81 cm",
    "Celková hloubka: 61 cm",
    "Hmotnost pomůcky: 4,4 kg",
    "Dostupné délky: 30 / 40 / 45 cm",
    "Rozteč montážních otvorů: 14,4 cm"
  ]);
});

test("unknown technical field fails obviously instead of silently mislabelling it", () => {
  assert.throws(() => formatBathroomFacts({ unverifiedMetric: 300 }), /Unknown Bathroom fact label/);
});
