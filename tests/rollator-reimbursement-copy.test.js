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

test("November official row is shown only while valid and never promises a final copay",()=>{
  const before=getReimbursementGuidance(
    ["meyra-ideal-3061982"],new Date("2026-11-09T12:00:00Z")
  )[0];
  const verified=getReimbursementGuidance(
    ["meyra-ideal-3061982"],new Date("2026-11-10T12:00:00Z")
  )[0];
  const december=getReimbursementGuidance(
    ["meyra-ideal-3061982"],new Date("2026-12-01T12:00:00Z")
  )[0];
  assert.equal(before.displayAmountKc,null);
  assert.equal(verified.officialVerification.validFor,"2026-11");
  assert.equal(verified.officialVerification.validThrough,"2026-11-30");
  assert.ok(verified.officialVerification.sourceUrl.endsWith("ZPSCAU_20261101.pdf"));
  assert.equal(verified.officialVerification.copayKc,null);
  assert.equal(verified.displayAmountKc,3408);
  assert.equal(december.displayAmountKc,null);
  assert.equal(december.freshnessStatus,"stale");
  assert.match(december.displayMessage,/už není platný/);
});
