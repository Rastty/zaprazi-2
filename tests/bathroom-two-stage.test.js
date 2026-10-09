import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { recommendBathroom } from "../src/bathroom/engine.js";
import { previewBathroomCandidates } from "../src/bathroom/preview.js";

const page = fs.readFileSync(new URL("../page-koupelna-a-wc.php", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../assets/js/bathroom-advisor.js", import.meta.url), "utf8");

const bathroomInput = {
  primaryNeed: "raise_toilet",
  transferAbility: "independent",
  loadFit: "unknown",
  toiletFit: "unknown",
  feetFlatAtRaisedHeight: "unknown",
  duration: "long_term"
};

test("raised-toilet preview identifies product first without claiming fit", () => {
  const preview = previewBathroomCandidates(bathroomInput);
  assert.equal(preview.status, "unverified_preview");
  assert.deepEqual(preview.productCandidateIds, ["unizdrav-p2868"]);
  assert.equal(Object.hasOwn(preview, "recommendations"), false);
  assert.equal(Object.hasOwn(preview, "acquisition"), false);
  assert.equal(Object.hasOwn(preview, "offers"), false);

  const strict = recommendBathroom(bathroomInput);
  assert.equal(strict.status, "needs_more_info");
  assert.equal(strict.recommendations.length, 0);
});

test("raised-toilet recommendation unlocks only after real fit confirmations", () => {
  for (const missing of ["loadFit", "toiletFit", "feetFlatAtRaisedHeight"]) {
    const answers = {
      ...bathroomInput, loadFit: "yes", toiletFit: "yes",
      feetFlatAtRaisedHeight: "yes", [missing]: "unknown"
    };
    const result = recommendBathroom(answers);
    assert.notEqual(result.status, "candidate", "unknown " + missing + " must fail closed");
    assert.deepEqual(result.recommendations, []);
  }
  const verified = recommendBathroom({
    ...bathroomInput, loadFit: "yes", toiletFit: "yes", feetFlatAtRaisedHeight: "yes"
  });
  assert.equal(verified.status, "candidate");
  assert.deepEqual(verified.recommendations[0].productCandidateIds, ["unizdrav-p2868"]);
  for (const bad of ["loadFit", "toiletFit", "feetFlatAtRaisedHeight"]) {
    const denied = recommendBathroom({
      ...bathroomInput, loadFit: "yes", toiletFit: "yes", feetFlatAtRaisedHeight: "yes",
      [bad]: "no"
    });
    assert.notEqual(denied.status, "candidate", "invalid " + bad + " must fail closed");
  }
});

test("candidate preview preserves pre-product mobility and transfer safety gates", () => {
  for (const changes of [
    { transferAbility: "person_assist" },
    { transferAbility: "unknown" },
    { primaryNeed: "combined_shower_toilet" },
    { primaryNeed: "bath_transfer", transferAbility: "steadying" },
    { primaryNeed: "bath_transfer", bathTransferIndependent: "no" },
    { primaryNeed: "toilet_nearby", floorStable: "no" },
    { primaryNeed: "shower_seated", floorStable: "unknown" },
    { primaryNeed: "unknown" }
  ]) {
    const preview = previewBathroomCandidates({ ...bathroomInput, ...changes });
    assert.notEqual(preview.status, "unverified_preview", JSON.stringify(changes));
    assert.deepEqual(preview.productCandidateIds, []);
  }
});

test("bath-transfer preliminary seat and strict bench fallback remain distinct", () => {
  const input = {
    primaryNeed: "bath_transfer", transferAbility: "independent",
    bathTransferIndependent: "yes", loadFit: "unknown", bathFit: "unknown", bathBenchFit: "unknown"
  };
  const preview = previewBathroomCandidates(input);
  assert.equal(preview.status, "unverified_preview");
  assert.deepEqual(preview.productCandidateIds, ["besco-bs008"]);
  const blocked = recommendBathroom(input);
  assert.equal(blocked.recommendations.length, 0);
  const bench = recommendBathroom({ ...input, loadFit: "yes", bathFit: "no", bathBenchFit: "yes" });
  assert.equal(bench.status, "candidate");
  assert.deepEqual(bench.recommendations[0].productCandidateIds, ["unizdrav-p2203"]);
});

test("staged UI shows technical details before confirmation and no preview commerce", () => {
  assert.match(page, /id="zp-bathroom-preview"/);
  assert.match(page, /id="zp-bathroom-fit-stage"/);
  assert.match(page, /1\. Ukázat možná řešení/);
  assert.match(page, /Má konkrétní zobrazená pomůcka dostatečnou nosnost/);
  assert.match(page, /Pasuje výše zobrazený nástavec/);
  assert.match(app, /fitStage\.appendChild\(fieldset\)/);
  assert.match(app, /previewBathroomCandidates\(initialAnswers\)/);
  assert.match(app, /renderPreviewProduct\(p, !primaryIds\.has\(p\.id\)\)/);
  assert.match(app, /previewReady = true/);
  assert.match(app, /!fieldset\.dataset\.zpBathFitCheck \|\| previewReady/);
  assert.match(app, /const output = recommendBathroom\(readAnswers\(\)\)/);
  assert.match(app, /data-zp-bath-merchant-link/);
  assert.match(app, /renderOffers\(product\.offers\)/);
  const previewMarkup = app.split("const renderPreviewProduct =")[1].split("const showBlockedPreview")[0];
  assert.doesNotMatch(previewMarkup, /renderOffers|resolveOffer|affiliateMap|merchant-link|track\(/);
  assert.doesNotMatch(app, /sendBeacon|localStorage|fetch\(/);
});
