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
  // The 0.8.198 behavior remains present after future theme releases.
  // The historical 0.8.198 postdeploy script is intentionally version-locked,
  // but a current 0.8.199+ source must not fail merely for advancing safely.
  const version=theme.match(/^Version:\s*(\d+)\.(\d+)\.(\d+)\s*$/m);
  assert.ok(version,"Current theme version header required");
  const [major,minor,patch]=version.slice(1).map(Number);
  assert.ok(major>0||(major===0&&(minor>8||(minor===8&&patch>=198))),
    "Original Walker hero behavior requires release 0.8.198 or later");
  assert.ok(functions.includes("define( 'ZAPRAZI_RELEASE', '"+version.slice(1).join(".")+"' );"),
    "PHP and CSS theme release must match");
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
