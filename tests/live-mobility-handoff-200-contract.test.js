import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("0.8.200+ real Chrome acceptance covers four meaningful editorial-to-Advisor clicks",()=>{
  const script=read("scripts/audit-live-mobility-guide-handoff-200.mjs");
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  const start=workflow.indexOf("  browser-qa:");
  const end=workflow.indexOf("  return-home-ux-185:",start);
  assert.ok(start>=0&&end>start,"Chrome acceptance must be inside main browser-qa job");
  const job=workflow.slice(start,end);
  assert.match(job,/node scripts\/audit-live-mobility-guide-handoff-200\.mjs/);
  assert.match(job,/Verify 0\.8\.200 Mobility guide to Advisor handoffs in Chrome\s+if: github\.event_name != 'pull_request'/);
  assert.match(workflow,/scripts\/audit-live-mobility-guide-handoff-200\.mjs/);
  assert.match(workflow,/tests\/live-mobility-handoff-200-contract\.test\.js/);
  for(const token of [
    "GITHUB_EVENT_NAME === \"pull_request\"",
    "SOURCE_THEME_RELEASE",
    "EXPECTED_LIVE_RELEASE",
    "readiness.integrity",
    "readiness.slot_total,25",
    "readiness.configured_total,25",
    "/choditka-pro-seniory/",
    "/choditko-do-bytu-pro-seniory/",
    "/rollator-pro-seniory/",
    "/choditko-na-pojistovnu/",
    "#rychla-cesta-na-epoukaz",
    "Neplaťte předem v očekávání zpětného proplacení",
    "data-zp-journey",
    "analyticsAttempts",
    "merchantAttempts",
    "nonGet",
    "assert.equal(destination.search,\"\"",
    "page.click(scenario.selector)",
    "waitForSelector(destination.hash"
  ]) assert.ok(script.includes(token),"Missing strict production check: "+token);
  assert.match(script,/if\(!atLeast\(SOURCE_THEME_RELEASE,"0\.8\.200"\)\)/);
  assert.equal((script.match(/from:"\/choditka-pro-seniory\/"/g)||[]).length,2);
  assert.equal((script.match(/label:"/g)||[]).length,4);
  assert.doesNotMatch(script, /method:\s*["']POST["']|page\.type\(|screenshot\(|recordVideo|sendBeacon\(/);
  const syntax=spawnSync(process.execPath,["--check","scripts/audit-live-mobility-guide-handoff-200.mjs"],{encoding:"utf8"});
  assert.equal(syntax.status,0,syntax.stderr||"Chrome QA script syntax failed");
});

test("new production handoff acceptance does not touch theme assets or modify release",()=>{
  const script=read("scripts/audit-live-mobility-guide-handoff-200.mjs");
  assert.match(script,/u\.origin===origin&&request\.method\(\)==="GET"/);
  assert.match(script,/u\.search===""/);
  assert.match(script,/assert\.equal\(analyticsAttempts,0/);
  assert.match(script,/assert\.equal\(merchantAttempts,0/);
  assert.match(script,/assert\.equal\(nonGet,0/);
  assert.doesNotMatch(script,/fetch\(.*\/wp-json\/wp\/v2\/|wp_update_post|update_option|localStorage\.setItem/);
});
