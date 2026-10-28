import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const script=read("scripts/audit-live-bathroom-five-edit-490.mjs");
const workflow=read(".github/workflows/live-bathroom-five-browser-acceptance.yml");
test("Real browser audit covers all five Bathroom Advisors and two distinct stages",()=>{
 for(const value of ["toilet-riser","shower-chair","toilet-chair","toilet-support","bath-transfer",
  "fit-stage","-preview","-submit","-result","-advisor"]){
  assert.ok(script.includes(value),"Missing browser scenario "+value);
 }
 assert.match(script,/puppeteer\.launch/);
 assert.match(script,/page\.goto\(origin\+spec\.path/);
 assert.match(script,/setViewport\(\{width:390/);
 assert.match(script,/data-zp-bath-edit="situation"/);
 assert.match(script,/data-zp-bath-edit="fit"/);
 assert.match(script,/assert\.equal\(cleared\.htmlSize,0/);
 assert.match(script,/assert\.equal\(reset\.verifiedFit,0/);
 assert.match(script,/assert\.equal\(blocked\.merchants,0/);
 assert.match(script,/assert\.equal\(blocked\.fit,false/);
});
test("No shortcuts, no sensitive data transport, no merchant click",()=>{
 assert.match(script,/req\.method\(\)!=="GET"/);
 assert.match(script,/req\.abort\(\)/);
 assert.match(script,/merchantClicks:0,postRequests:/);
 assert.doesNotMatch(script,/fetch\([^)]*,\s*\{\s*method:\s*["']POST|localStorage\.setItem|sessionStorage\.setItem|navigator\.sendBeacon/);
 assert.match(script,/assert\.equal\(ready\.integrity,"ok"/);
 assert.match(script,/assert\.equal\(meta\.release,ready\.release/);
 assert.doesNotMatch(script,/NOT_YET_DEPLOYED|releaseAtLeast|skip.*0\.8\.183/);
});
test("Workflow is repeatable after future deploys without WPVibe rate limits",()=>{
 for(const key of ["workflow_dispatch:","pull_request:","push:","puppeteer-core@24",
    "node --check scripts/audit-live-bathroom-five-edit-490.mjs",
    "node scripts/audit-live-bathroom-five-edit-490.mjs"]){
  assert.ok(workflow.includes(key),key);
 }
 assert.doesNotMatch(workflow,/WPVibe|WP_USERNAME|WP_PASSWORD/);
});
