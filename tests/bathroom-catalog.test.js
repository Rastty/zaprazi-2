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


test("raised WC seat with arms has verified retail evidence and direct-pay route", () => {
  const product = BATHROOM_PRODUCTS.find((item) => item.id === "besco-bs15");
  assert.ok(product);
  assert.equal(product.productionEligible, true);
  assert.equal(product.solutionFamily, "raised_toilet_seat_with_arms");
  assert.equal(product.facts.heightIncreaseCm, 11.5);
  assert.equal(product.facts.maxUserWeightKg, 100);
  assert.equal(product.offers[0].affiliateKey, "rehabilitacni-pomucky-cz:besco-bs15");
  assert.ok(product.selectionNotes.some((note) => /stabilní oporu rukama/i.test(note)));
});


test("DMA EH-CMDA has exact retail identity and guarded reimbursement evidence", () => {
  const product = BATHROOM_PRODUCTS.find((item) => item.id === "dma-eh-cmda");
  assert.ok(product);
  assert.equal(product.productionEligible, true);
  assert.equal(product.solutionFamily, "multifunction_toilet_shower_chair");
  assert.equal(product.facts.totalWidthCm, 51);
  assert.equal(product.facts.totalDepthCm, 40);
  assert.equal(product.facts.maxUserWeightKg, 150);
  assert.equal(product.offers[0].affiliateKey, "drmax-cz:dma-eh-cmda");
  assert.equal(product.reimbursementEvidence.payerCode, "5019427");
  assert.equal(product.reimbursementEvidence.monthlySuklListVerified, false);
});


test("bath transfer bench has exact dimensions and runtime affiliate key", () => {
  const product = BATHROOM_PRODUCTS.find((item) => item.id === "unizdrav-p2203");
  assert.ok(product);
  assert.equal(product.productionEligible, true);
  assert.equal(product.solutionFamily, "bath_transfer_bench");
  assert.equal(product.facts.totalWidthCm, 81);
  assert.equal(product.facts.totalDepthCm, 61);
  assert.equal(product.facts.maxUserWeightKg, 110);
  assert.equal(product.offers[0].affiliateKey, "unizdrav-cz:p2203");
  assert.ok(product.selectionNotes.some((note) => /jedna strana konstrukce stojí ve vaně/i.test(note)));
});
