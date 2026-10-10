import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getReimbursementGuidance } from "../src/mobility/acquisition.js";

const article = fs.readFileSync(new URL("../page-rollator-pro-seniory.php", import.meta.url), "utf8");

test("rollator article never confuses manufacturer's copay claim with verified official reimbursement", () => {
  assert.match(article, /MEYRA Ideal Rollator 3061982/);
  assert.match(article, /ZP 07-5005963/);
  assert.match(article, /měsíčního seznamu SÚKL/);
  assert.match(article, /Údaj o doplatku na stránce výrobce není automatickým potvrzením/);
  assert.doesNotMatch(article, /doplatek\s*0\s*Kč|úhradu\s*3\s*408\s*Kč|plnou úhradu/i);
  assert.doesNotMatch(article, /Výrobce aktuálně uvádí|MEYRA aktuálně uvádí/);
  assert.ok((article.match(/home_url\( '\/choditko-na-pojistovnu\/' \)/g) || []).length >= 2);
});

test("dated official reimbursement is displayed only for a valid month and never asserts a final copay", () => {
  const october = getReimbursementGuidance(["meyra-ideal-3061982"], new Date("2026-10-10T10:00:00Z"))[0];
  const november = getReimbursementGuidance(["meyra-ideal-3061982"], new Date("2026-11-01T12:00:00Z"))[0];
  assert.equal(october.officialVerification.validFor, "2026-10");
  assert.equal(october.officialVerification.copayKc, null);
  assert.equal(october.displayAmountKc, 3408);
  assert.equal(november.displayAmountKc, null);
  assert.equal(november.freshnessStatus, "stale");
  assert.match(november.displayMessage, /už není platný/);
});
