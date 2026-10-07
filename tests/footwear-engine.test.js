import test from "node:test";
import assert from "node:assert/strict";
import { chooseEasyFootwear } from "../src/footwear/engine.js";

test("ARSENE is selected for wide easy opening with open toe", () => {
  const r = chooseEasyFootwear({ openingNeed:"wide_opening", toe:"open_ok", velcroUse:"yes", measuredFeet:"yes" });
  assert.equal(r.status, "candidate");
  assert.equal(r.candidate?.affiliateKey, "zdrava-obuv-cz:arsene");
});

test("XAVIER is selected for extra-wide low closed shoe", () => {
  const r = chooseEasyFootwear({ openingNeed:"extra_wide_low", toe:"closed_needed", velcroUse:"yes", measuredFeet:"yes" });
  assert.equal(r.status, "candidate");
  assert.equal(r.candidate?.affiliateKey, "zdrava-obuv-cz:xavier");
});

test("ALTITUDE is selected for full-opening closed ankle shoe", () => {
  const r = chooseEasyFootwear({ openingNeed:"full_opening", toe:"closed_needed", velcroUse:"yes", measuredFeet:"yes" });
  assert.equal(r.status, "candidate");
  assert.equal(r.candidate?.affiliateKey, "zdrava-obuv-cz:altitude");
});

test("measurement is required before shopping-first candidate state", () => {
  const r = chooseEasyFootwear({ openingNeed:"extra_wide_low", toe:"closed_needed", velcroUse:"yes", measuredFeet:"unknown" });
  assert.equal(r.status, "needs_fit_check");
  assert.equal(r.candidate?.affiliateKey, "zdrava-obuv-cz:xavier");
});

test("shortlist fails closed when velcro cannot be managed", () => {
  const r = chooseEasyFootwear({ openingNeed:"wide_opening", toe:"open_ok", velcroUse:"no", measuredFeet:"yes" });
  assert.equal(r.status, "no_match");
  assert.equal(r.candidate, null);
});

test("mismatched toe/opening combination does not force a product", () => {
  const r = chooseEasyFootwear({ openingNeed:"wide_opening", toe:"closed_needed", velcroUse:"yes", measuredFeet:"yes" });
  assert.equal(r.status, "no_match");
  assert.equal(r.candidate, null);
});

test("engine does not ask for diagnosis or medication", () => {
  const src = chooseEasyFootwear.toString();
  assert.doesNotMatch(src, /diagnosis|diagnóz|medication|léky|diabet/i);
});
