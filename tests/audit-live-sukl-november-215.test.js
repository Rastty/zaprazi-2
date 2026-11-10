import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const script=read("scripts/audit-live-sukl-november-215.mjs");
const workflow=read(".github/workflows/production-advisor-qa.yml");
const template=read("page-choditko-na-pojistovnu.php");
const source=read("src/mobility/acquisition.js");
const pdf="https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01973@SUKLAA/26D0TU21@SUKLAA/ZPSCAU_20261101.pdf";

test("215 browser witness is same-origin GET-only, postdeploy only and exact-release",()=>{
  assert.match(workflow,/scripts\/audit-live-sukl-november-215\.mjs/);
  assert.match(workflow,/tests\/audit-live-sukl-november-215\.test\.js/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'\s+env:\s+CHROME_BIN:[^\n]+\s+run: node scripts\/audit-live-sukl-november-215\.mjs/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/SOURCE_THEME_RELEASE,"0\.8\.215"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE/);
  assert.match(script,/req\.method\(\)==="GET"/);
  assert.match(script,/u\.origin===ORIGIN/);
  assert.match(script,/timeZone:"Europe\/Prague"/);
  assert.match(script,/SUKL_NOVEMBER_215_CHROME_PASS/);
  assert.match(script,/thirdPartyRequestsSent:0/);
  assert.match(script,/merchantClicks:0/);
  assert.match(script,/formsSubmitted:0/);
  assert.doesNotMatch(script,/page\.click\(|page\.type\(|\.submit\(|method:\s*["']POST["']/i);
  const checked=spawnSync(process.execPath,["--check","scripts/audit-live-sukl-november-215.mjs"],{encoding:"utf8"});
  assert.equal(checked.status,0,checked.stderr||"Invalid Chrome test syntax");
});

test("official November PDF, row and 30 November expiry are consistent in source and output",()=>{
  assert.ok(script.includes(pdf));
  assert.ok(template.includes(pdf));
  assert.ok(source.includes(pdf));
  assert.match(template,/kód 5005963/);
  assert.match(template,/strana 10 z 92/);
  assert.match(template,/úhrada 3 408 Kč/);
  assert.match(source,/validFor: "2026-11"/);
  assert.match(source,/validThrough: "2026-11-30"/);
  assert.match(source,/copayKc: null/);
  assert.match(template,/Historická úhrada v listopadovém seznamu/);
  assert.match(template,/Poslední ověřený záznam už není aktuální/);
  assert.ok(template.includes("Úhrada není automatický nárok"));
  assert.doesNotMatch(template,/doplatek 0 Kč|bez doplatku zaručeno|nárok garantován/i);
});
