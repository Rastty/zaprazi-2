import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const smoke=read("scripts/audit-live-bathroom-missing-focus-498.mjs");
const workflow=read(".github/workflows/live-bathroom-missing-focus-498.yml");
test("real production Chrome checks direct question focus for three distinct unresolved inputs",()=>{
 for(const exact of ['unknown_transfer_stage_one','unknown_floor_stage_one','unknown_load_stage_two',
  'focus:"transferAbility"','focus:"floorStable"','focus:"loadFit"',
  'person_assist','shower_seated','toiletFit','feetFlatAtRaisedHeight'])
  assert.ok(smoke.includes(exact),"Missing real-browser assertion "+exact);
 assert.match(smoke,/puppeteer\.launch\(/);
 assert.match(smoke,/page\.goto\(origin\+"\/koupelna-a-wc\/"/);
 assert.match(smoke,/assert\.deepEqual\(before\.focus,\[spec\.focus\]/);
 assert.match(smoke,/assert\.equal\(focused\.visible,true\)/);
 assert.match(smoke,/assert\.equal\(focused\.hiddenAncestor,false\)/);
 assert.match(smoke,/assert\.deepEqual\(reset\.fitChecked,0\)|assert\.equal\(reset\.fitChecked,0/);
 assert.match(smoke,/assert\.equal\(before\.htmlLength,0/);
});
test("QA does not trigger merchant clicks, write health data or bypass blocked model gates",()=>{
 assert.match(smoke,/request\.method\(\)!=="GET"/);
 assert.match(smoke,/request\.abort\(\)/);
 assert.match(smoke,/merchantClicks:0,postRequests:/);
 assert.match(smoke,/assert\.deepEqual\(writes,\[\]/);
 assert.doesNotMatch(smoke,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|navigator\.sendBeacon/);
 for(const key of ["workflow_dispatch:","pull_request:","push:","puppeteer-core@24"])
  assert.ok(workflow.includes(key),key);
});
