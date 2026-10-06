import test from "node:test";
import assert from "node:assert/strict";
import { MOBILITY_PRODUCTS, getMobilityProducts } from "../src/mobility/catalog.js";
import { recommendMobility } from "../src/mobility/engine.js";

test("mobility catalog product ids are unique", () => {
  const ids = MOBILITY_PRODUCTS.map((product) => product.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every production candidate has evidence and no invented affiliate URL", () => {
  for (const product of MOBILITY_PRODUCTS) {
    assert.ok(product.evidence.length > 0);
    for (const offer of product.offers) {
      assert.equal(offer.affiliateUrl, null);
      assert.match(offer.url, /^https:\/\//);
    }
  }
});

test("outdoor engine shortlist resolves to catalog products", () => {
  const result = recommendMobility({
    environment: "outdoor",
    supportNeed: "steady",
    handBrakes: "yes"
  });

  const ids = result.recommendations.flatMap((item) => item.productCandidateIds ?? []);
  const products = getMobilityProducts(ids);

  assert.equal(products.length, ids.length);
  assert.ok(products.every((product) => product.solutionFamily === "rollator"));
});

test("indoor no-lift shortlist resolves only to two-wheel walker", () => {
  const result = recommendMobility({
    environment: "indoor",
    supportNeed: "steady",
    canLiftWalker: "no"
  });

  const ids = result.recommendations.flatMap((item) => item.productCandidateIds ?? []);
  const products = getMobilityProducts(ids);

  assert.deepEqual(products.map((product) => product.id), ["besco-wa21"]);
});
