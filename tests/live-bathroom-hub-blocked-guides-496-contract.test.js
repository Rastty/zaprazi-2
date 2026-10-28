import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const src=read("scripts/audit-live-bathroom-hub-blocked-guides-496.mjs");
const action=read(".github/workflows/live-bathroom-hub-blocked-guides-496.yml");
test("Real Chrome acceptance covers six safe guide routes and two deliberately unsupported situations",()=>{
 for(const need of ["raise_toilet","toilet_support","toilet_nearby","shower_seated",
   "bath_transfer","multifunction_toilet_shower","combined_shower_toilet","unknown"]){
  assert.ok(src.includes('need:"'+need+'"'),need+" missing");
 }
 assert.match(src,/puppeteer\.launch/);
 assert.match(src,/page\.goto\(origin\+"\/koupelna-a-wc\/"/);
 assert.match(src,/page\.once\("popup"/);
 assert.match(src,/assert\.equal\(dest\.anchorExists,true/);
 assert.match(src,/assert\.deepEqual\(after\.retained,answers/);
 assert.match(src,/assert\.equal\(state\.merchantLinks,0/);
 assert.match(src,/assert\.equal\(state\.links,spec\.guide\?1:0/);
 assert.match(src,/assert\.equal\(focus\.name,"primaryNeed"/);
});
test("Acceptance does not write private answers or initiate a purchase",()=>{
 assert.match(src,/req\.method\(\)!=="GET"/);
 assert.match(src,/req\.abort\(\)/);
 assert.match(src,/assert\.deepEqual\(writes,\[\]/);
 assert.match(src,/merchantClicks:0,postRequests:/);
 assert.doesNotMatch(src,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|fetch\([^)]*,\s*\{method:\s*["']POST/);
 for(const token of ["workflow_dispatch:","pull_request:","push:","puppeteer-core@24"]){
  assert.ok(action.includes(token),token);
 }
});
