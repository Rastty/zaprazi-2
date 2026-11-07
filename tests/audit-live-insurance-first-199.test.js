import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("release 0.8.199 verifies safe first-screen ePoukaz path only after real deploy",()=>{
  const script=read("scripts/audit-live-insurance-first-199.mjs");
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  const css=read("style.css"),php=read("functions.php");
  // The historical browser scenario is pinned to its original release,
  // but its static contract must not block newer, separately verified releases.
  const parsed=css.match(/^Version:\s*(\d+)\.(\d+)\.(\d+)\s*$/m);
  assert.ok(parsed,"Theme source version required");
  const [major,minor,patch]=parsed.slice(1).map(Number);
  assert.ok(major>0||(major===0&&(minor>8||(minor===8&&patch>=199))));
  assert.ok(php.includes("define( 'ZAPRAZI_RELEASE', '"+parsed.slice(1).join(".")+"' );"));
  assert.match(workflow,/scripts\/audit-live-insurance-first-199\.mjs/);
  assert.match(workflow,/tests\/audit-live-insurance-first-199\.test\.js/);
  assert.match(workflow,
    /Verify 0\.8\.199 ePoukaz first-screen safe answer and Advisor handoff in Chrome\s+if: github\.event_name != 'pull_request'/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.199"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,"0\.8\.199"/);
  assert.match(script,/readiness\.release,"0\.8\.199"/);
  assert.match(script,/readiness\.integrity,"ok"/);
  assert.match(script,/configured_total,25/);
  assert.match(script,/numberedSteps,3/);
  assert.match(script,/id=\"rychla-cesta-na-epoukaz\"|#rychla-cesta-na-epoukaz/);
  assert.match(script,/Neplaťte předem v očekávání zpětného proplacení/);
  assert.match(script,/advisorHandoff:true/);
  assert.match(script,/nonGet,0/);
  assert.match(script,/merchantAttempts,0/);
  assert.doesNotMatch(script,/method:\s*["']POST["']|data-zp-affiliate-target|screenshot\(|recordVideo/i);
  const syntax=spawnSync(process.execPath,["--check","scripts/audit-live-insurance-first-199.mjs"],
    {encoding:"utf8"});
  assert.equal(syntax.status,0,syntax.stderr||"Invalid Chrome acceptance syntax");
});
