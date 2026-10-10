import test from "node:test";
import assert from "node:assert/strict";
import { chooseEasyFootwear } from "../src/footwear/engine.js";

test("ARSENE is selected for wide easy opening with open toe", () => {
  const r = chooseEasyFootwear({ openingNeed:"wide_opening", toe:"open_ok", velcroUse:"yes", measuredFeet:"yes", sizeChartFit:"yes" });
  assert.equal(r.status, "candidate");
  assert.equal(r.candidate?.affiliateKey, "zdrava-obuv-cz:arsene");
});

test("XAVIER is selected for extra-wide low closed shoe", () => {
  const r = chooseEasyFootwear({ openingNeed:"extra_wide_low", toe:"closed_needed", velcroUse:"yes", measuredFeet:"yes", sizeChartFit:"yes" });
  assert.equal(r.status, "candidate");
  assert.equal(r.candidate?.affiliateKey, "zdrava-obuv-cz:xavier");
});

test("ALTITUDE is selected for full-opening closed ankle shoe", () => {
  const r = chooseEasyFootwear({ openingNeed:"full_opening", toe:"closed_needed", velcroUse:"yes", measuredFeet:"yes", sizeChartFit:"yes" });
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
  const r = chooseEasyFootwear({ openingNeed:"wide_opening", toe:"closed_needed", velcroUse:"yes", measuredFeet:"yes", sizeChartFit:"yes" });
  assert.equal(r.status, "no_match");
  assert.equal(r.candidate, null);
});

test("engine does not read diagnosis or medication inputs", () => {
  const src = chooseEasyFootwear.toString();
  assert.doesNotMatch(src, /input\.(diagnosis|diabetes|medication|medications|swellingCause)/i);
  assert.match(src, /input\.openingNeed/);
  assert.match(src, /input\.toe/);
  assert.match(src, /input\.velcroUse/);
  assert.match(src, /input\.measuredFeet/);
  assert.match(src, /input\.sizeChartFit/);
});

test("feet measurements are not enough until this exact model's size chart is checked", () => {
  for (const sizeChartFit of ["unknown", "no", undefined]) {
    const r = chooseEasyFootwear({
      openingNeed:"extra_wide_low", toe:"closed_needed",
      velcroUse:"yes", measuredFeet:"yes", sizeChartFit
    });
    assert.equal(r.status, "needs_fit_check", String(sizeChartFit));
    assert.equal(r.candidate?.affiliateKey, "zdrava-obuv-cz:xavier");
    assert.match(r.nextStep, /rozměr|šířk|tabulk/i);
  }
});

test("size-chart yes cannot bypass missing measurement, Velcro or a wrong product combination", () => {
  const base={openingNeed:"extra_wide_low",toe:"closed_needed",sizeChartFit:"yes"};
  for(const answers of [
    {...base,measuredFeet:"no",velcroUse:"yes"},
    {...base,measuredFeet:"unknown",velcroUse:"yes"},
    {...base,measuredFeet:"yes",velcroUse:"unknown"},
    {...base,measuredFeet:"yes",velcroUse:"no"}
  ]) {
    const result=chooseEasyFootwear(answers);
    assert.notEqual(result.status,"candidate");
  }
  const mismatch=chooseEasyFootwear({...base,toe:"open_ok",measuredFeet:"yes",velcroUse:"yes"});
  assert.equal(mismatch.status,"no_match");
});
