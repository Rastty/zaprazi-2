import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const script=read("scripts/audit-live-bathroom-blocked-guide-492.mjs");
const workflow=read(".github/workflows/live-bathroom-blocked-guide-492.yml");
test("Browser tests five blocked Bathroom routes with exact vetted help destinations",()=>{
 for(const s of ["toilet-riser","shower-chair","toilet-chair","toilet-support","bath-transfer",
   "#mereni-wc","#mereni-sprcha","#mereni-vana","#sedm-kontrol-zidle-postel",
   "#kontroly-madla-sadrokarton"]){
  assert.ok(script.includes(s),"Missing real browser check "+s);
 }
 assert.match(script,/puppeteer\.launch/);
 assert.match(script,/page\.goto\(origin\+spec\.path/);
 assert.match(script,/page\.once\("popup"/);
 assert.match(script,/assert\.equal\(destination\.anchorFound,true/);
 assert.match(script,/assert\.deepEqual\(after\.answers,spec\.answers/);
 assert.match(script,/assert\.equal\(current\.merchants,0/);
 assert.match(script,/assert\.equal\(current\.help\.length,1/);
 assert.match(script,/assert\.equal\(current\.fitEdit,0/);
 assert.match(script,/assert\.equal\(current\.situationEdit,1/);
});
test("Read-only Chrome acceptance never follows merchant CTA or writes private answers",()=>{
 assert.match(script,/req\.method\(\)!=="GET"/);
 assert.match(script,/return req\.abort\(\)/);
 assert.match(script,/assert\.deepEqual\(nonGet,\[\]/);
 assert.match(script,/merchantClicks:0,postRequests:/);
 assert.doesNotMatch(script,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|fetch\([^)]*,\s*\{method:\s*["']POST/);
 assert.doesNotMatch(script,/NOT_YET_DEPLOYED|releaseAtLeast/);
 for(const name of ["pull_request:","push:","workflow_dispatch:","puppeteer-core@24",
    "node scripts/audit-live-bathroom-blocked-guide-492.mjs"]){
  assert.ok(workflow.includes(name),"Missing workflow integration "+name);
 }
});
