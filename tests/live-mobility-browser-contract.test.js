import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const smoke=readFileSync(new URL("../scripts/audit-live-mobility-candidate-edit-488.mjs",import.meta.url),"utf8");
const workflow=readFileSync(new URL("../.github/workflows/live-mobility-browser-acceptance.yml",import.meta.url),"utf8");

test("Production Chrome smoke spans all three actual Mobility Advisor forms and outputs",()=>{
 for(const fragment of [
  "#zp-mobility-advisor","#zp-indoor-walker-advisor","#zp-rollator-advisor",
  "#zp-mobility-result","#zp-indoor-walker-result","#zp-rollator-result",
  "#zp-mobility-submit","#zp-indoor-walker-submit","#zp-rollator-submit"
 ])assert.ok(smoke.includes(fragment),"Missing real DOM fixture "+fragment);
 assert.match(smoke,/puppeteer\.launch\(/);
 assert.match(smoke,/setViewport\(\{width:390/);
 assert.match(smoke,/page\.goto\(origin\+spec\.path/);
 assert.match(smoke,/data-zp-edit-answers="1"/);
 assert.match(smoke,/allFitUnlock:true/);
 assert.match(smoke,/revokedFitRelock:true/);
 assert.match(smoke,/staleOfferCleared:true/);
 assert.match(smoke,/safeRecovery:blocked\.recoveryHref/);
 assert.match(smoke,/assert\.equal\(stale\.content,""/);
});

test("Audit never follows merchant CTA, persists sensitive answers or makes network writes",()=>{
 assert.match(smoke,/req\.method\(\)!=="GET"/);
 assert.match(smoke,/return req\.abort\(\)/);
 assert.match(smoke,/merchantClicks,0/);
 assert.match(smoke,/assert\.deepEqual\(forbiddenWrites,\[\]/);
 assert.doesNotMatch(smoke,/\.click\(\s*spec\.merchant|page\.goto\([^)]*merchant|axios\.post|fetch\([^,]+,\s*\{method:/);
 assert.doesNotMatch(smoke,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|form\.submit\(/);
 assert.ok(smoke.includes("ready.integrity"));
});

test("Browser audit cannot silently skip the intended features on unchanged theme version",()=>{
 assert.doesNotMatch(smoke,/if\s*\(releaseAtLeast|NOT_YET_DEPLOYED|ZP_RELEASE\s*=/);
 assert.match(smoke,/assert\.equal\(metadata\.release,ready\.release/);
 assert.match(smoke,/assert\.equal\(initial\.editIsButton,true/);
 assert.match(smoke,/assert\.equal\(blocked\.recoveryHref,spec\.recovery/);
 for(const x of ["pull_request:","push:","workflow_dispatch:","puppeteer-core@24","node --check"]){
  assert.ok(workflow.includes(x),"Missing workflow gate "+x);
 }
 assert.ok(workflow.includes("node scripts/audit-live-mobility-candidate-edit-488.mjs"));
});
