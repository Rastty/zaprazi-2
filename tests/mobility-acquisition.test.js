import test from "node:test";
import assert from "node:assert/strict";
import {
  MOBILITY_ACQUISITION,
  getRentalGuidance,
  getReimbursementGuidance
} from "../src/mobility/acquisition.js";

test("MEYRA reimbursement uses the verified current monthly SÚKL record", () => {
  const guidance = getReimbursementGuidance(
    ["meyra-ideal-3061982"],
    new Date("2026-11-10T12:00:00Z")
  );
  assert.equal(guidance.length, 1);
  assert.equal(guidance[0].sourceType, "official_sukl_monthly");
  assert.equal(guidance[0].officialVerification.status, "verified_current_month");
  assert.equal(guidance[0].officialVerification.suklCode, "5005963");
  assert.equal(guidance[0].officialVerification.amountKc, 3408);
  assert.equal(guidance[0].officialVerification.copayKc, null);
  assert.equal(guidance[0].officialVerification.validFor, "2026-11");
  assert.equal(guidance[0].officialVerification.validThrough, "2026-11-30");
  assert.equal(guidance[0].checkedAt, "2026-11-10");
  assert.match(guidance[0].officialVerification.sourceUrl, /ZPSCAU_20261101\.pdf$/);
  assert.equal(guidance[0].displayAmountKc, 3408);
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


test("manufacturer claim remains separate from official monthly verification", () => {
  const guidance = getReimbursementGuidance(
    ["meyra-ideal-3061982"],
    new Date("2026-11-10T12:00:00Z")
  )[0];

  assert.equal(guidance.manufacturerClaim.retailPriceKc, 3408);
  assert.equal(guidance.manufacturerClaim.reimbursementKc, 3408);
  assert.equal(guidance.manufacturerClaim.copayKc, 0);

  assert.equal(guidance.officialVerification.amountKc, 3408);
  assert.equal(guidance.officialVerification.copayKc, null);
  assert.equal(guidance.officialVerification.reimbursementGroup, "07.03.02.03");
  assert.equal(guidance.officialVerification.intervalMonths, 60);
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

test("November SÚKL row becomes usable only after verified date and expires on 1 December",()=>{
  const beforeCheck=getReimbursementGuidance(
    ["meyra-ideal-3061982"],new Date("2026-11-09T12:00:00Z")
  )[0];
  assert.equal(beforeCheck.freshnessStatus,"unknown");
  assert.equal(beforeCheck.displayAmountKc,null);

  const current=getReimbursementGuidance(
    ["meyra-ideal-3061982"],new Date("2026-11-10T12:00:00Z")
  )[0];
  assert.equal(current.freshnessStatus,"fresh");
  assert.equal(current.officialVerification.validFor,"2026-11");
  assert.equal(current.displayAmountKc,3408);
  assert.equal(current.officialVerification.copayKc,null);
  assert.match(current.displayMessage,/Individuální nárok ani konečný doplatek tím nejsou potvrzeny/i);

  const lastDay=getReimbursementGuidance(
    ["meyra-ideal-3061982"],new Date("2026-11-30T12:00:00Z")
  )[0];
  assert.equal(lastDay.freshnessStatus,"fresh");
  assert.equal(lastDay.displayAmountKc,3408);

  const expired=getReimbursementGuidance(
    ["meyra-ideal-3061982"],new Date("2026-12-01T00:00:00Z")
  )[0];
  assert.equal(expired.freshnessStatus,"stale");
  assert.equal(expired.displayAmountKc,null);
  assert.match(expired.displayMessage,/už není platný pro aktuální měsíc/i);
});
