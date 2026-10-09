import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { recommendBathroom } from "../src/bathroom/engine.js";

const scenarios = [
  ["toilet-riser",{primaryNeed:"raise_toilet", transferAbility:"independent",toiletFit:"yes",feetFlatAtRaisedHeight:"yes",loadFit:"yes"}],
  ["shower-chair",{primaryNeed:"shower_seated",transferAbility:"independent",floorStable:"yes",spaceFit:"yes",loadFit:"yes"}],
  ["toilet-chair",{primaryNeed:"toilet_nearby",transferAbility:"independent",floorStable:"yes",spaceFit:"yes",loadFit:"yes"}],
  ["toilet-support",{primaryNeed:"toilet_support",transferAbility:"steadying",wallFixing:"verified",loadFit:"yes"}],
  ["bath-transfer",{primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"yes",bathFit:"yes",loadFit:"yes"}]
];

test("each specific Bathroom Advisor actually presents the shared engine rationale",()=>{
  for(const [name, input] of scenarios){
    const source=fs.readFileSync(new URL("../assets/js/"+name+"-advisor.js", import.meta.url),"utf8");
    assert.match(source,/Proč právě toto řešení\?/,"Missing understandable why explanation in "+name);
    assert.match(source,/\.recommendations\.map\(/,"Rationale must derive from deterministic engine in "+name);
    assert.match(source,/item\.reason/,"Decision explanation omitted in "+name);
    assert.match(source,/esc\(item\.reason\)|escapeHtml\(item\.reason\)/,
      "User-facing reason must be HTML escaped in "+name);
    const outcome=recommendBathroom(input);
    assert.equal(outcome.status,"candidate",name);
    assert.ok(outcome.recommendations.length>0,name+" has no product rationale");
    assert.ok(outcome.recommendations.every(x=>typeof x.reason==="string"&&x.reason.length>28),
      name+" explanation missing from engine");
  }
});

test("no rationale can be mistaken for an approved product on unsafe Bathroom branches",()=>{
  for(const [name,ok] of scenarios){
    const blocked = recommendBathroom({...ok,loadFit:"unknown"});
    assert.notEqual(blocked.status,"candidate",name);
    assert.deepEqual(blocked.recommendations,[],"Must not show a positive explanation for unverified fit "+name);
    const unsafe = recommendBathroom({...ok,transferAbility:"person_assist"});
    assert.notEqual(unsafe.status,"candidate",name);
    assert.deepEqual(unsafe.recommendations,[],name);
  }
});

test("WC explanation changes with the actual construction and evidence",()=>{
  const base={primaryNeed:"toilet_support",transferAbility:"steadying",loadFit:"yes"};
  const rail=recommendBathroom({...base,wallFixing:"verified"});
  const frame=recommendBathroom({...base,wallFixing:"unverified",supportFrameFit:"yes"});
  assert.equal(rail.status,"candidate");
  assert.equal(frame.status,"candidate");
  assert.deepEqual(rail.recommendations[0].productCandidateIds,["unizdrav-p2131"]);
  assert.deepEqual(frame.recommendations[0].productCandidateIds,["unizdrav-p2015"]);
  assert.match(rail.recommendations[0].reason,/Nástěnné kotvení/);
  assert.match(frame.recommendations[0].reason,/toaletního rámu/);
  assert.notEqual(rail.recommendations[0].reason,frame.recommendations[0].reason);
});
