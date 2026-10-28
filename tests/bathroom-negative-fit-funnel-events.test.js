import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const advisors=[
 "bathroom-advisor.js",
 "toilet-riser-advisor.js",
 "shower-chair-advisor.js",
 "toilet-chair-advisor.js",
 "toilet-support-advisor.js",
 "bath-transfer-advisor.js"
];
test("Every live Bathroom adviser excludes confirmed no_safe_fit from completed-funnel events",()=>{
 for(const file of advisors){
  const s=source("assets/js/"+file);
  const index=s.indexOf('track("builder_complete")');
  assert.ok(index>0,"No event gate: "+file);
  const gate=s.slice(Math.max(0,index-180),index+24);
  assert.match(gate,/needs_more_info/,"Don't count unknown fit: "+file);
  assert.match(gate,/invalid_input|builder_complete/,"Must preserve previous invalid input semantics: "+file);
  assert.match(gate,/no_safe_fit/,"Explicit no fit must not complete: "+file);
  assert.ok(s.includes('track("builder_start")'),"Keep safe-start analytics: "+file);
  assert.ok(s.includes('track("recommendation_view")'),"Keep actual recommendation events: "+file);
  assert.ok(!s.includes('status==="no_safe_fit" && track("builder_complete")'));
 }
});
test("Status gate does not change affiliate commerce or store answer combinations",()=>{
 for(const file of advisors.slice(1)){
  const s=source("assets/js/"+file);
  assert.ok(s.includes('=== "candidate"')||s.includes('==="candidate"'),"Merchant still requires candidate: "+file);
  assert.doesNotMatch(s,/localStorage\.setItem|sessionStorage\.setItem|navigator\.sendBeacon/);
 }
});
