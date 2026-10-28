import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {recommendBathroom} from "../src/bathroom/engine.js";
import {previewBathroomCandidates} from "../src/bathroom/preview.js";

const variants = [
  ["no load capacity", {primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"no"}],
  ["no WC attachment fit", {primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"yes",toiletFit:"no"}],
  ["no feet support", {primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"yes",toiletFit:"yes",feetFlatAtRaisedHeight:"no"}],
  ["no toilet frame fit", {primaryNeed:"toilet_support",transferAbility:"steadying",loadFit:"yes",wallFixing:"unverified",supportFrameFit:"no"}],
  ...["shower_seated","toilet_nearby","multifunction_toilet_shower"].flatMap(primaryNeed=>[
    ["no stable floor "+primaryNeed,{primaryNeed,transferAbility:"independent",loadFit:"yes",floorStable:"no",spaceFit:"yes"}],
    ["no space "+primaryNeed,{primaryNeed,transferAbility:"independent",loadFit:"yes",floorStable:"yes",spaceFit:"no"}]
  ]),
  ["no bath alternatives", {primaryNeed:"bath_transfer",transferAbility:"independent",loadFit:"yes",bathTransferIndependent:"yes",bathFit:"no",bathBenchFit:"no"}]
];

test("Explicit negative model/installation fit is not presented as a missing answer or product",()=>{
  for (const [scenario,answers] of variants) {
    const output=recommendBathroom(answers);
    assert.equal(output.status,"no_safe_fit",scenario);
    assert.deepEqual(output.missing,[],scenario);
    assert.deepEqual(output.recommendations,[],scenario);
    assert.deepEqual(output.acquisition,[],scenario);
    assert.ok(output.headline && output.nextStep,scenario);
  }
});
test("Negative first-stage floor cannot open a commercial preview",()=>{
  for (const primaryNeed of ["shower_seated","toilet_nearby","multifunction_toilet_shower"]) {
    const preview=previewBathroomCandidates({primaryNeed,transferAbility:"independent",floorStable:"no"});
    assert.equal(preview.status,"no_safe_fit",primaryNeed);
    assert.deepEqual(preview.missing,[]);
    assert.deepEqual(preview.productCandidateIds,[]);
    assert.ok(!Object.hasOwn(preview,"offers"));
  }
});
test("Unknown fit remains a genuine correctable missing answer",()=>{
  const cases=[
    [{primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"unknown"},"loadFit"],
    [{primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"yes",toiletFit:"unknown"},"toiletFit"],
    [{primaryNeed:"shower_seated",transferAbility:"independent",loadFit:"yes",floorStable:"unknown"},"floorStable"],
    [{primaryNeed:"shower_seated",transferAbility:"independent",loadFit:"yes",floorStable:"yes",spaceFit:"unknown"},"spaceFit"],
    [{primaryNeed:"bath_transfer",transferAbility:"independent",loadFit:"yes",bathTransferIndependent:"yes",bathFit:"no",bathBenchFit:"unknown"},"bathBenchFit"]
  ];
  for (const [answers,missing] of cases) {
    const output=recommendBathroom(answers);
    assert.equal(output.status,"needs_more_info",JSON.stringify(answers));
    assert.deepEqual(output.missing,[missing]);
    assert.deepEqual(output.recommendations,[]);
  }
});
test("Blocked UX includes explicit no-fit state, with no missing-answer action or commercial unlock",()=>{
  const hub=readFileSync(new URL("../assets/js/bathroom-advisor.js",import.meta.url),"utf8");
  assert.match(hub,/no_safe_fit: "Tato varianta nevyhovuje"/);
  assert.match(hub,/\["professional_check", "needs_more_info", "no_safe_fit"\]\.includes\(status\)/);
  assert.match(hub,/\["needs_more_info", "invalid_input", "no_safe_fit"\]\.includes\(output\.status\)/);
});
