import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { recommendAdjustableBed } from "../src/bed/engine.js";
import { recommendWheelchair } from "../src/wheelchair/engine.js";
import { previewAdjustableBed, previewWheelchair } from "../src/decision/product-preview.js";
const read = path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("bed preview identifies exact model but cannot approve unverified space or weight",()=>{
  for(const [need,id] of [["home_positioning","unizdrav-p2777"],["robust_high_load","unizdrav-p4707"],["advanced_in_bed_care","unizdrav-p4044"]]){
    const input={primaryNeed:need,transferAbility:"independent",loadFit:"unknown",spaceFit:"unknown"};
    const preview=previewAdjustableBed(input);
    assert.equal(preview.status,"unverified_preview");
    assert.deepEqual(preview.productCandidateIds,[id]);
    assert.equal(Object.hasOwn(preview,"offers"),false);
    assert.equal(Object.hasOwn(preview,"recommendations"),false);
    assert.equal(recommendAdjustableBed(input).status,"needs_more_info");
    for(const fail of ["loadFit","spaceFit"]){
      const result=recommendAdjustableBed({...input,loadFit:"yes",spaceFit:"yes",[fail]:"unknown"});
      assert.notEqual(result.status,"candidate");
      assert.deepEqual(result.recommendations,[]);
    }
    const valid=recommendAdjustableBed({...input,loadFit:"yes",spaceFit:"yes"});
    assert.equal(valid.status,"candidate");
    assert.deepEqual(valid.recommendations[0].productCandidateIds,[id]);
  }
});

test("wheelchair preview blocks assisted or unknown transfers and unsafe powered controls",()=>{
  for(const changes of [
    {propulsion:"companion",transferAbility:"person_assist"},
    {propulsion:"companion",transferAbility:"unknown"},
    {propulsion:"unknown",transferAbility:"independent"},
    {propulsion:"powered",transferAbility:"independent",joystickSafe:"no",chargingReady:"yes"},
    {propulsion:"powered",transferAbility:"independent",joystickSafe:"unknown",chargingReady:"yes"},
    {propulsion:"powered",transferAbility:"independent",joystickSafe:"yes",chargingReady:"no"}
  ]) {
    const result=previewWheelchair(changes);
    assert.notEqual(result.status,"unverified_preview",JSON.stringify(changes));
    assert.deepEqual(result.productCandidateIds,[]);
  }
});

test("wheelchair models preview without fit claims and strict checkout gates stay closed",()=>{
  const modes=[
    {propulsion:"companion",id:"unizdrav-p4384"},
    {propulsion:"self_manual",id:"unizdrav-p3641"},
    {propulsion:"mixed_manual",id:"unizdrav-p3641"},
    {propulsion:"powered",id:"unizdrav-p2961"}
  ];
  for(const {propulsion,id} of modes) {
    const input={propulsion,transferAbility:"independent",joystickSafe:"yes",chargingReady:"yes",
      loadFit:"unknown",seatFit:"unknown",widthFit:"unknown"};
    const p=previewWheelchair(input);
    assert.equal(p.status,"unverified_preview");
    assert.deepEqual(p.productCandidateIds,[id]);
    assert.equal(recommendWheelchair(input).status,"needs_more_info");
    for(const field of ["loadFit","seatFit","widthFit"]){
      const output=recommendWheelchair({...input,loadFit:"yes",seatFit:"yes",widthFit:"yes",[field]:"no"});
      assert.notEqual(output.status,"candidate");
      assert.deepEqual(output.recommendations,[]);
    }
    const approved=recommendWheelchair({...input,loadFit:"yes",seatFit:"yes",widthFit:"yes"});
    assert.equal(approved.status,"candidate");
  }
});

test("bed and wheelchair Advisor UI renders factual preview before fit, without merchant links",()=>{
  for(const [slug,engine,prefix,fitFields] of [
    ["bed","previewAdjustableBed","bed",["loadFit","spaceFit"]],
    ["wheelchair","previewWheelchair","wheelchair",["seatFit","widthFit","loadFit"]]
  ]) {
    const page=read(slug==="bed"?"page-polohovaci-postel.php":"page-invalidni-vozik.php");
    const script=read("assets/js/"+slug+"-advisor.js");
    assert.match(page,new RegExp('id="zp-'+prefix+'-preview"'));
    assert.match(page,new RegExp('id="zp-'+prefix+'-fit-stage"'));
    assert.match(page,/1\. Ukázat možný výrobek/);
    for(const field of fitFields) assert.match(page,new RegExp('data-zp-product-fit="1" data-zp-'+prefix+'-required="'+field+'"'));
    assert.ok(script.includes(engine+"(readAnswers())"));
    assert.match(script,/fitStage\.appendChild\(fieldset\)/);
    assert.match(script,/!fieldset\.closest\('\[hidden\]'\)/);
    assert.match(script,/const output = recommend[A-Z][A-Za-z]+\(readAnswers\(\)\)/);
    assert.match(script,/previewReady = true/);
    assert.match(script,/fitStage\.hidden = true/);
    const factPreview=script.split("const renderUnverifiedProduct =")[1].split("const displayBlocked =")[0];
    assert.doesNotMatch(factPreview,/href=|renderProducts|resolveOffer|affiliateMap|merchant-link/);
    assert.doesNotMatch(script,/sendBeacon|localStorage|fetch\(/);
  }
});
