import test from "node:test";
import assert from "node:assert/strict";
import {
  MOBILITY_ACQUISITION,
  getRentalGuidance,
  getReimbursementGuidance
} from "../src/mobility/acquisition.js";

test("MEYRA reimbursement claim is explicitly not treated as official SÚKL verification", () => {
  const guidance = getReimbursementGuidance(["meyra-ideal-3061982"]);
  assert.equal(guidance.length, 1);
  assert.equal(guidance[0].sourceType, "manufacturer_current_claim");
  assert.equal(guidance[0].officialVerification.status, "current_exact_record_not_verified");
  assert.equal(guidance[0].officialVerification.amountKc, null);
  assert.equal(guidance[0].officialVerification.copayKc, null);
});

test("exact reimbursement amounts require an official monthly SÚKL source and validity", () => {
  for (const item of Object.values(MOBILITY_ACQUISITION)) {
    const reimbursement = item.reimbursement;
    if (!reimbursement) continue;

    const official = reimbursement.officialVerification;
    if (official.amountKc !== null || official.copayKc !== null) {
      assert.equal(reimbursement.sourceType, "official_sukl_monthly");
      assert.ok(official.validFor);
      assert.match(official.sourceUrl, /^https:\/\//);
    }
  }
});

test("rental guidance preserves freshness and does not imply universal availability", () => {
  const rentals = getRentalGuidance(["meyra-ideal-3061982"]);
  assert.equal(rentals.length, 1);
  assert.equal(rentals[0].status, "verified_example_check_availability");
  assert.equal(rentals[0].checkedAt, "2026-10-06");
  assert.match(rentals[0].note, /ověřte/i);
});

test("unknown products do not invent acquisition evidence", () => {
  assert.deepEqual(getReimbursementGuidance(["unknown-product"]), []);
  assert.deepEqual(getRentalGuidance(["unknown-product"]), []);
});


test("manufacturer reimbursement figures stay separate from official verification", () => {
  const guidance = getReimbursementGuidance(["meyra-ideal-3061982"])[0];

  assert.equal(guidance.manufacturerClaim.retailPriceKc, 3408);
  assert.equal(guidance.manufacturerClaim.reimbursementKc, 3408);
  assert.equal(guidance.manufacturerClaim.copayKc, 0);

  assert.equal(guidance.officialVerification.amountKc, null);
  assert.equal(guidance.officialVerification.copayKc, null);
  assert.equal(guidance.officialVerification.validFor, null);
});


test("stale rental evidence hides exact pricing from display guidance", () => {
  const rentals = getRentalGuidance(
    ["meyra-ideal-3061982"],
    new Date("2026-11-06T12:00:00Z")
  );

  assert.equal(rentals[0].freshnessStatus, "stale");
  assert.equal(rentals[0].displayPricing, null);
});

test("fresh rental evidence keeps exact pricing available", () => {
  const rentals = getRentalGuidance(
    ["meyra-ideal-3061982"],
    new Date("2026-11-05T12:00:00Z")
  );

  assert.equal(rentals[0].freshnessStatus, "fresh");
  assert.equal(rentals[0].displayPricing.perMonthKc, 360);
});

test("stale reimbursement claim replaces current-sounding manufacturer message", () => {
  const guidance = getReimbursementGuidance(
    ["meyra-ideal-3061982"],
    new Date("2026-11-07T12:00:00Z")
  );

  assert.equal(guidance[0].freshnessStatus, "stale");
  assert.match(guidance[0].displayMessage, /starší než 31 dní/i);
  assert.doesNotMatch(guidance[0].displayMessage, /aktuálně uvádí plnou úhradu/i);
});
