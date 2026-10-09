import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { recommendWheelchair } from "../src/wheelchair/engine.js";
import { recommendAdjustableBed } from "../src/bed/engine.js";
import { recommendBathroom } from "../src/bathroom/engine.js";
import { recommendMobility } from "../src/mobility/engine.js";
import { chooseEasyFootwear } from "../src/footwear/engine.js";
import { chooseAdlSelfCareAid } from "../src/adl/engine.js";
import { renderMobilityProductFitGate, installMobilityProductFitGate } from "../src/mobility/offer-fit-gate.js";

const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("all 14 live Advisor forms invalidate stale results and outbound links as soon as any answer changes", () => {
  const files = [
    "mobility","bathroom","bed","wheelchair","adl","footwear","return-home",
    "toilet-riser","shower-chair","toilet-chair","toilet-support",
    "bath-transfer","indoor-walker","rollator"
  ];
  for (const name of files) {
    const source = read("assets/js/" + name + "-advisor.js");
    const marker = source.indexOf('// Never keep a purchase link tied to old answers on the page.');
    const conventional = source.indexOf('// A result belongs to the exact answers used to produce it.');
    const start = Math.max(marker, conventional);
    assert.ok(start >= 0, "missing invalidation on " + name);
    const block = source.slice(start, start + 340);
    assert.match(block, /form\.addEventListener\("change",\s*\(\)\s*=>/);
    assert.match(block, /result\.hidden = true/);
    assert.match(block, /result\.innerHTML = ""/);
    // No server persistence or personally identifiable event payload.
    assert.doesNotMatch(block, /localStorage|sendBeacon|fetch\(/);
  }
});

test("unknown transfer never produces a wheelchair candidate even when all technical fields say yes", () => {
  for (const propulsion of ["companion","self_manual","mixed_manual","powered"]) {
    for (const transferAbility of ["unknown","person_assist"]) {
      const result = recommendWheelchair({
        propulsion,transferAbility,
        seatFit:"yes",widthFit:"yes",loadFit:"yes",joystickSafe:"yes",chargingReady:"yes"
      });
      assert.notEqual(result.status, "candidate", JSON.stringify({propulsion,transferAbility}));
      assert.deepEqual(result.recommendations, []);
    }
  }
});

test("wheelchair valid fit is blocked if any individual part is no or unknown", () => {
  const base = {propulsion:"companion", transferAbility:"independent", loadFit:"yes", widthFit:"yes", seatFit:"yes"};
  assert.equal(recommendWheelchair(base).status, "candidate");
  for (const key of ["loadFit","widthFit","seatFit"]) {
    for (const val of ["no","unknown"]) {
      const output = recommendWheelchair({...base,[key]:val});
      assert.notEqual(output.status,"candidate", key + "=" + val);
    }
  }
});

test("one physical-fit answer never approves two distinct toilet support constructions", () => {
  const base={primaryNeed:"toilet_support",transferAbility:"steadying",loadFit:"yes"};
  for(const wallFixing of ["verified","unverified","not_possible","unknown"]) {
    const result=recommendBathroom({...base,wallFixing});
    assert.equal(result.status,"candidate");
    const ids=result.recommendations.flatMap(x=>x.productCandidateIds||[]);
    assert.equal(ids.length,1, "single load confirmation must address exactly one physical model");
    assert.deepEqual(ids, wallFixing === "verified" ? ["unizdrav-p2131"] : ["unizdrav-p2015"]);
  }
});

test("critical transfer, capacity, width and floor safety gates fail closed across categories",()=>{
  for (const need of ["raise_toilet","toilet_support","toilet_nearby","shower_seated","bath_transfer","multifunction_toilet_shower"]) {
    for (const transferAbility of ["person_assist","unknown"]) {
      const r=recommendBathroom({
        primaryNeed:need,transferAbility,loadFit:"yes",toiletFit:"yes",
        feetFlatAtRaisedHeight:"yes",floorStable:"yes",spaceFit:"yes",
        bathTransferIndependent:"yes",bathFit:"yes"
      });
      assert.notEqual(r.status,"candidate");
    }
    for (const loadFit of ["no","unknown"]) {
      const r=recommendBathroom({
        primaryNeed:need,transferAbility:"independent",loadFit,toiletFit:"yes",
        feetFlatAtRaisedHeight:"yes",floorStable:"yes",spaceFit:"yes",
        bathTransferIndependent:"yes",bathFit:"yes"
      });
      assert.notEqual(r.status,"candidate");
    }
  }
  for (const primaryNeed of ["home_positioning","caregiver_access","robust_high_load","advanced_in_bed_care"]) {
    for (const field of ["loadFit","spaceFit"]) {
      const base={primaryNeed,transferAbility:"independent",loadFit:"yes",spaceFit:"yes"};
      for (const value of ["no","unknown"])
        assert.notEqual(recommendAdjustableBed({...base,[field]:value}).status,"candidate");
    }
  }
  for (const environment of ["outdoor","both"]) {
    for (const handBrakes of ["no","unknown"])
      assert.notEqual(recommendMobility({environment,supportNeed:"steady",handBrakes}).status,"candidate");
  }
  assert.equal(chooseEasyFootwear({openingNeed:"wide_opening",toe:"open_ok",velcroUse:"no",measuredFeet:"yes"}).status,"no_match");
  assert.equal(chooseAdlSelfCareAid({task:"drink",mainProblem:"swallowing_or_medical"}).status,"professional_check");
});

test("mobility offers require three checks for each product, independently", () => {
  const markup=renderMobilityProductFitGate('<a href="https://merchant.example/">Offer</a>');
  assert.match(markup,/zp-fit-locked-offers" hidden/);
  assert.equal((markup.match(/type="checkbox"/g)||[]).length,3);
  assert.match(markup,/Maximální nosnost/);
  assert.match(markup,/Šířka tohoto modelu/);
  assert.match(markup,/Výšku madel/);
  assert.equal(renderMobilityProductFitGate(""),"");
  const listeners=[];
  const root={addEventListener(type,fn){assert.equal(type,"change");listeners.push(fn);}};
  installMobilityProductFitGate(root);
  assert.equal(listeners.length,1);
  const models = Array.from({length:2},()=> {
    const inputs=Array.from({length:3},()=>({checked:false}));
    const offers={hidden:true};
    const gate={querySelectorAll(){return inputs;},querySelector(){return offers;}};
    const target={matches(){return true;},closest(){return gate;}};
    return {inputs,offers,target};
  });
  const fire = model => listeners[0]({target:models[model].target});
  models[0].inputs[0].checked=true;fire(0);
  assert.equal(models[0].offers.hidden,true);
  models[0].inputs[1].checked=true;models[0].inputs[2].checked=true;fire(0);
  assert.equal(models[0].offers.hidden,false);
  assert.equal(models[1].offers.hidden,true, "other product stays locked");
  models[0].inputs[1].checked=false;fire(0);
  assert.equal(models[0].offers.hidden,true,"revoking a model check hides link again");
});

test("all three mobility entrypoints render the shared product-specific gate", () => {
  for (const path of ["mobility","indoor-walker","rollator"]) {
    const script=read("assets/js/"+path+"-advisor.js");
    assert.match(script,/installMobilityProductFitGate\(result\)/);
    assert.match(script,/renderMobilityProductFitGate\(/);
    assert.match(script,/data-zp-.*merchant-link/);
  }
  assert.match(read("style.css"),/\.zp-fit-locked-offers\[hidden\]\{display:none!important\}/);
});
