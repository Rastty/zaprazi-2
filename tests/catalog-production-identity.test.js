import test from "node:test";
import assert from "node:assert/strict";
import { isVerifiedProductionProduct } from "../src/decision/product-identity-gate.js";
import { BATHROOM_PRODUCTS, getBathroomProducts } from "../src/bathroom/catalog.js";
import { MOBILITY_PRODUCTS, getMobilityProducts } from "../src/mobility/catalog.js";
import { WHEELCHAIR_PRODUCTS, getWheelchairProducts } from "../src/wheelchair/catalog.js";

const scenarios = [
  ["bathroom", BATHROOM_PRODUCTS, getBathroomProducts],
  ["mobility", MOBILITY_PRODUCTS, getMobilityProducts],
  ["wheelchair", WHEELCHAIR_PRODUCTS, getWheelchairProducts]
];

test("two independent approvals and dated HTTPS identity evidence required for any offerable candidate", () => {
  const good = {
    id: "example-1", name: "Verified sample", productionEligible: true,
    identityStatus: "verified",
    evidence: [{ url: "https://example.test/product", checkedAt: "2026-10-10" }]
  };
  assert.equal(isVerifiedProductionProduct(good), true);
  assert.equal(isVerifiedProductionProduct({ ...good, identityStatus: "conflict" }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, identityStatus: "verified_research_only" }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, identityStatus: "unknown" }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, productionEligible: false }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, productionEligible: "true" }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, evidence: [] }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, evidence: [{ url: "http://example.test", checkedAt: "2026-10-10" }] }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, evidence: [{ url: "https://example.test" }] }), false);
  assert.equal(isVerifiedProductionProduct({ ...good, name: "" }), false);
  assert.equal(isVerifiedProductionProduct(null), false);
});

test("existing verified products remain selectable and all research/conflict records remain excluded", () => {
  for (const [family, items, getter] of scenarios) {
    const approved = items.filter(item => item.productionEligible && item.identityStatus === "verified");
    const output = getter(items.map(item=>item.id));
    assert.deepEqual(output.map(p => p.id), approved.map(p=>p.id), family);
    assert.ok(approved.length, family);
    assert.ok(output.every(p => isVerifiedProductionProduct(p)), family);
  }
});

test("WA78 conflict and research-only shower/toilet chair cannot become production offers through an accidental flag", () => {
  const wa78 = MOBILITY_PRODUCTS.find(item => item.id === "besco-wa78");
  const research = BATHROOM_PRODUCTS.find(item => item.id === "unizdrav-p2085");
  assert.equal(wa78.identityStatus, "conflict");
  assert.equal(research.identityStatus, "verified_research_only");
  for (const [item, getter] of [[wa78, getMobilityProducts], [research, getBathroomProducts]]) {
    const old = item.productionEligible;
    try {
      item.productionEligible = true;
      assert.deepEqual(getter([item.id]), [], item.id + " must remain quarantined");
    } finally {
      item.productionEligible = old;
    }
  }
});

test("even production-marked wheelchair entries are quarantined if exact identity evidence is revoked", () => {
  const chair = WHEELCHAIR_PRODUCTS.find(item => item.productionEligible);
  const old = chair.identityStatus;
  try {
    chair.identityStatus = "conflict";
    assert.deepEqual(getWheelchairProducts([chair.id]), []);
  } finally {
    chair.identityStatus = old;
  }
});
