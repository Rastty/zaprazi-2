import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const workflow=read(".github/workflows/production-advisor-qa.yml");
const script=read("scripts/audit-live-transport-rate-214.mjs");
const template=read("page-prevoz-seniora-k-lekari.php");
test("0.8.214 transport live acceptance uses exact source, read-only Chrome and expires amount",()=>{
  assert.match(workflow,/scripts\/audit-live-transport-rate-214\.mjs/);
  assert.match(workflow,/tests\/audit-live-transport-rate-214\.test\.js/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'\s+env:\s+CHROME_BIN:[^\n]+\s+run: node scripts\/audit-live-transport-rate-214\.mjs/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/SOURCE_THEME_RELEASE,"0\.8\.214"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE/);
  assert.match(script,/req\.method\(\)==="GET"/);
  assert.match(script,/u\.origin===ORIGIN/);
  assert.match(script,/timeZone:"Europe\/Prague"/);
  assert.match(script,/today>="2026-01-01"&&today<="2026-12-31"/);
  assert.match(script,/meta\[name="zaprazi-release"\]/);
  assert.match(script,/meta\[name="zaprazi-integrity"\]/);
  assert.match(script,/7,98 Kč\/km/);
  assert.match(script,/TRANSPORT_RATE_214_CHROME_PASS/);
  assert.match(script,/noMerchantClicks:true/);
  assert.match(script,/noFormsSubmitted:true/);
  assert.doesNotMatch(script,/page\.click\(|\.submit\(|method:\s*["']POST["']|page\.type\(/i);
  assert.ok(template.includes('id="rychla-odpoved-prevoz"'));
  assert.ok(template.includes('Historická sazba 2026 již není aktuální'));
  assert.ok(template.includes('href="#vyber-dopravy"'));
  const syntax=spawnSync(process.execPath,["--check","scripts/audit-live-transport-rate-214.mjs"],
    {encoding:"utf8"});
  assert.equal(syntax.status,0,syntax.stderr||"Invalid postdeploy transport script");
});
