import test from "node:test";
import assert from "node:assert/strict";
import { BATHROOM_PRODUCTS, getBathroomProducts } from "../src/bathroom/catalog.js";

test("bathroom catalog has unique product ids", () => {
  const ids = BATHROOM_PRODUCTS.map((product) => product.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("production products have evidence and canonical offers", () => {
  for (const product of BATHROOM_PRODUCTS.filter((item) => item.productionEligible)) {
    assert.ok(product.evidence.length > 0);
    assert.ok(product.offers.length > 0);
    for (const offer of product.offers) {
      assert.match(offer.url, /^https:\/\//);
      assert.equal(offer.affiliateUrl, null);
      assert.ok(offer.checkedAt);
    }
  }
});

test("high-support shower/toilet wheelchair is research-only", () => {
  const product = BATHROOM_PRODUCTS.find((item) => item.id === "unizdrav-p2085");
  assert.equal(product.productionEligible, false);
  assert.deepEqual(product.offers, []);
});

test("catalog lookup filters research-only products", () => {
  const products = getBathroomProducts(["unizdrav-p2868", "unizdrav-p2085"]);
  assert.deepEqual(products.map((product) => product.id), ["unizdrav-p2868"]);
});

test("grab rail records installation caveat", () => {
  const rail = BATHROOM_PRODUCTS.find((item) => item.id === "unizdrav-p2131");
  assert.ok(rail.selectionNotes.some((note) => /ukotven/i.test(note)));
});
