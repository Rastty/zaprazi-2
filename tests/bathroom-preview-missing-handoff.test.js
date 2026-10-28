import test from "node:test";
import assert from "node:assert/strict";
import {previewBathroomCandidates} from "../src/bathroom/preview.js";
import {recommendBathroom} from "../src/bathroom/engine.js";

const blocked=[
 ["unknown transfer",{primaryNeed:"raise_toilet",transferAbility:"unknown"},"transferAbility"],
 ["unknown shower floor",{primaryNeed:"shower_seated",transferAbility:"independent",floorStable:"unknown"},"floorStable"],
 ["unknown toilet-chair floor",{primaryNeed:"toilet_nearby",transferAbility:"independent",floorStable:"unknown"},"floorStable"],
 ["unknown bath transfer",{primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"unknown"},"bathTransferIndependent"]
];
test("Blocked preliminary Bathroom results retain exact safe missing question for UX PR498",()=>{
 for(const [label,input,field] of blocked){
  const full=recommendBathroom({...input,loadFit:"yes",toiletFit:"yes",feetFlatAtRaisedHeight:"yes",supportFrameFit:"yes",spaceFit:"yes",bathFit:"yes",bathBenchFit:"unknown"});
  const preview=previewBathroomCandidates(input);
  assert.equal(preview.status,"needs_more_info",label);
  assert.deepEqual(preview.missing,[field],label);
  assert.deepEqual(preview.missing,full.missing,label+" decision engine mismatch");
  assert.deepEqual(preview.productCandidateIds,[],label+" exposed product before safety");
  assert.ok(!Object.hasOwn(preview,"offers"));
  assert.ok(!Object.hasOwn(preview,"acquisition"));
 }
});
test("Professional safety block has no missing-field shortcut, no products",()=>{
 const result=previewBathroomCandidates({
  primaryNeed:"raise_toilet",transferAbility:"person_assist"
 });
 assert.equal(result.status,"professional_check");
 assert.deepEqual(result.missing,[]);
 assert.deepEqual(result.productCandidateIds,[]);
 assert.ok(!Object.hasOwn(result,"offers"));
});
test("Safe preview remains unverified: forwarding missing never approves merchant or fit",()=>{
 const result=previewBathroomCandidates({
  primaryNeed:"raise_toilet",transferAbility:"independent"
 });
 assert.equal(result.status,"unverified_preview");
 assert.deepEqual(result.missing,[]);
 assert.ok(result.productCandidateIds.length>0);
 assert.equal(Object.hasOwn(result,"recommendations"),false);
 assert.equal(Object.hasOwn(result,"acquisition"),false);
 assert.equal(Object.hasOwn(result,"offers"),false);
});
