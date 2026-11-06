import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("0.8.197 walker Chrome acceptance is postdeploy-only with exact release, privacy and safety checks",()=>{
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  const script=read("scripts/audit-live-walker-safety-197.mjs");
  assert.match(workflow,/scripts\/audit-live-walker-safety-197\.mjs/);
  assert.match(workflow,/tests\/audit-live-walker-safety-197\.test\.js/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'\s+env:\s+CHROME_BIN:[^\n]+\s+run: node scripts\/audit-live-walker-safety-197\.mjs/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.197"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,"0\.8\.197"/);
  assert.match(script,/readiness\.integrity,"ok"/);
  assert.match(script,/brzdy stisknout, bezpečně zastavit a zajistit parkovací brzdu/);
  assert.match(script,/není možné ani s následným doporučením lékaře/);
  assert.match(script,/proplaceni-choditka/);
  assert.match(script,/poradce-rollator/);
  assert.match(script,/insuranceGuideSelector/);
  assert.ok(script.includes('a[href="${origin}/choditko-na-pojistovnu/"]'),
    "Chrome must select the exact safe internal ePoukaz guide");
  assert.equal(script.includes('await page.click("#jak-ziskat-choditko .zp-acquire-grid article:nth-child(3) a[href]");'),false,
    "Never click the first insurance card link: it is the official external VZP source");
  assert.match(script,/merchantAttempts,0/);
  assert.match(script,/nonGetRequests,0/);
  assert.doesNotMatch(script,/method:\s*["']POST["']|data-zp-affiliate-target/);
  const syntax=spawnSync(process.execPath,["--check","scripts/audit-live-walker-safety-197.mjs"],
    {encoding:"utf8"});
  assert.equal(syntax.status,0,syntax.stderr||"Invalid Chrome acceptance syntax");
});
