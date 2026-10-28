import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {recommendBathroom} from "../src/bathroom/engine.js";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const hub=read("assets/js/bathroom-advisor.js");

test("Bathroom engine supplies a precise missing input instead of an unsafe recommendation",()=>{
 const cases=[
  [{primaryNeed:"raise_toilet",transferAbility:"unknown"},"transferAbility"],
  [{primaryNeed:"shower_seated",transferAbility:"independent",loadFit:"yes",floorStable:"unknown"},"floorStable"],
  [{primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"unknown"},"loadFit"]
 ];
 for(const [answers,expected] of cases){
  const outcome=recommendBathroom(answers);
  assert.equal(outcome.status,"needs_more_info");
  assert.deepEqual(outcome.missing,[expected]);
  assert.deepEqual(outcome.recommendations,[]);
  assert.deepEqual(outcome.acquisition,[]);
 }
});

test("User-facing direct edit action only targets a known visible questionnaire field",()=>{
 assert.match(hub,/const correctableNames = new Set\(\[/);
 assert.match(hub,/const visibleCorrectionGroup = name =>/);
 assert.match(hub,/if \(!correctableNames\.has\(name\)\) return null/);
 assert.match(hub,/!group\.hidden && !group\.closest\("\[hidden\]"\)/);
 assert.match(hub,/const renderMissingAnswerAction = name =>/);
 assert.match(hub,/visibleCorrectionGroup\(name\)/);
 assert.match(hub,/data-zp-bathroom-focus="/);
 assert.match(hub,/escapeHtml\(name\)/);
 assert.match(hub,/Upřesnit důležitou odpověď/);
 assert.match(hub,/renderMissingAnswerAction\(outcome\.missing\?\.\[0\]\)/);
 assert.match(hub,/renderMissingAnswerAction\(output\.missing\?\.\[0\]\)/);
 assert.match(hub,/const directName = button\.dataset\.zpBathroomFocus/);
 assert.match(hub,/directName\s*\?\s*visibleCorrectionGroup\(directName\)/);
 assert.match(hub,/if \(!group \|\| group\.hidden \|\| group\.closest\("\[hidden\]"\)\) return/);
 assert.match(hub,/if \(target && !target\.closest\("\[hidden\]"\)\) target\.focus\(\)/);
});

test("Correction link cannot unlock offers or leak answer combinations",()=>{
 const segment=hub.split("const correctableNames =")[1].split("// Only fixed, relevant editorial destinations.")[0];
 assert.doesNotMatch(segment,/href=|merchant-link|affiliateMap|renderOffers|\.offers|\.checked\s*=|\.click\(\)|new URLSearchParams|sendBeacon|fetch\(|localStorage|sessionStorage/);
 assert.match(hub,/form\.addEventListener\("change", \(\) => \{\s*result\.hidden = true;\s*result\.innerHTML = "";/);
 assert.match(read("style.css"),/\.zp-bathroom-missing-action \.zp-link-btn\{[^}]*min-height:44px/);
});
