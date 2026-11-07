import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("0.8.198 two safe direct Walker entries are postdeploy Chrome-verified",()=>{
  const wf=read(".github/workflows/production-advisor-qa.yml");
  const script=read("scripts/audit-live-walker-hero-198.mjs");
  const theme=read("style.css");
  const functions=read("functions.php");
  assert.match(theme,/Version: 0\.8\.198/);
  assert.match(functions,/define\( 'ZAPRAZI_RELEASE', '0\.8\.198' \)/);
  assert.match(wf,/scripts\/audit-live-walker-hero-198\.mjs/);
  assert.match(wf,/tests\/walker-hero-direct-paths-198\.test\.js/);
  assert.match(wf,/Verify 0\.8\.198 direct indoor and outdoor walker Advisor links in real Chrome\s+if: github\.event_name != 'pull_request'/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.198"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,"0\.8\.198"/);
  assert.match(script,/readiness\.integrity,"ok"/);
  assert.match(script,/configured_total,25/);
  assert.match(script,/poradce-choditko-byt/);
  assert.match(script,/poradce-rollator/);
  assert.match(script,/await page\.click\(selector\)/);
  assert.match(script,/nonGetRequests,0/);
  assert.match(script,/merchantRequests,0/);
  assert.doesNotMatch(script,/method:\s*["']POST["']|fetch\([^)]*affiliate|recordVideo|screenshot\(/i);
  const check=spawnSync(process.execPath,["--check","scripts/audit-live-walker-hero-198.mjs"],{
    encoding:"utf8"
  });
  assert.equal(check.status,0,check.stderr||"Invalid Chrome acceptance syntax");
});
