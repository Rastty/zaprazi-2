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


test("bath transfer seat is production-eligible only with explicit fit notes", () => {
  const seat = BATHROOM_PRODUCTS.find((item) => item.id === "besco-bs008");
  assert.ok(seat);
  assert.equal(seat.productionEligible, true);
  assert.equal(seat.solutionFamily, "bath_transfer_seat");
  assert.equal(seat.facts.bathInnerWidthCm, "41–65");
  assert.equal(seat.facts.maxUserWeightKg, 100);
  assert.ok(seat.selectionNotes.some((note) => /41–65 cm/.test(note)));
  assert.ok(seat.selectionNotes.some((note) => /bez fyzického zvedání/i.test(note)));
  assert.equal(seat.offers[0].affiliateKey, "rehabilitacni-pomucky-cz:besco-bs008");
});
