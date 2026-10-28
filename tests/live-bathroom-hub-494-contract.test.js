import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const js=read("scripts/audit-live-bathroom-hub-494.mjs");
const workflow=read(".github/workflows/live-bathroom-hub-494.yml");
test("Full live Chrome Bathroom hub acceptance does real user choices, edit, model reset",()=>{
 for(const v of ["puppeteer.launch","/koupelna-a-wc/","primaryNeed","raise_toilet",
    "shower_seated","person_assist","toiletFit","feetFlatAtRaisedHeight",
    "loadFit","render","[data-zp-bathroom-edit="]){
  assert.ok(js.includes(v),"Missing browser check: "+v);
 }
 assert.match(js,/page\.goto\(origin\+"\/koupelna-a-wc\/"/);
 assert.match(js,/assert\.equal\(removed\.markup,0/);
 assert.match(js,/assert\.deepEqual\(reset\.checked,\[\]/);
 assert.match(js,/assert\.equal\(out\.merchant,0/);
 assert.match(js,/assert\.deepEqual\(retained,\{need:"shower_seated"/);
 assert.match(js,/assert\.deepEqual\(errors,\[\]/);
});
test("Live acceptance protects privacy and never follows a merchant CTA",()=>{
 assert.match(js,/req\.method\(\)!=="GET"/);
 assert.match(js,/req\.abort\(\)/);
 assert.match(js,/merchantClicks:0,postRequests:/);
 assert.doesNotMatch(js,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|fetch\([^)]*,\s*\{method:\s*["']POST/);
 for(const w of ["pull_request:","push:","workflow_dispatch:","puppeteer-core@24"]){
  assert.ok(workflow.includes(w));
 }
});
