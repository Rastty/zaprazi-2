import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SCENARIOS,validOfferCard} from "../scripts/audit-live-mobility-offer-parity.mjs";
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";
import {recommendMobility} from "../src/mobility/engine.js";

const reportFor=(s,overrides={})=>({
  cardCount:1,linkCount:1,runtimeMatches:true,sponsored:true,
  sameModel:true,requiredControlsOk:true,hasBrakeControl:s.brakes,
  hidden:true,otherModelsLocked:true,...overrides
});

test("three unique primary Mobility routes use real eligible sourced exact models",()=>{
  assert.deepEqual(SCENARIOS.map(s=>s.id),["wa17","wa21","meyra"]);
  assert.equal(new Set(SCENARIOS.map(s=>s.key)).size,3);
  for(const s of SCENARIOS){
    const model=MOBILITY_PRODUCTS.find(p=>p.offers?.some(o=>o.affiliateKey===s.key));
    assert.ok(model,"Missing catalog route: "+s.id);
    assert.equal(model.productionEligible,true);
    assert.equal(model.identityStatus,"verified");
    assert.equal(model.offers.filter(o=>o.affiliateKey===s.key).length,1);
    assert.ok(model.name.includes(s.title));
    assert.equal(s.brakes,model.solutionFamily==="rollator");
  }
});

test("three exact candidate decisions and unsafe unknown brakes remain fail-closed",()=>{
  for(const s of SCENARIOS){
    const result=recommendMobility({
      environment:s.environment,supportNeed:"steady",
      canLiftWalker:s.canLiftWalker||"unknown",
      handBrakes:s.handBrakes||"unknown",duration:"unknown",
      seatNeeded:false,transportNeed:false,homeSpace:"standard"
    });
    assert.equal(result.status,"candidate");
    const ids=result.recommendations.flatMap(row=>row.productCandidateIds);
    const id=s.id==="meyra"?"meyra-ideal-3061982":"besco-"+s.id;
    assert.ok(ids.includes(id),"Unexpected exact model candidate "+s.id);
  }
  const unsafe=recommendMobility({
    environment:"outdoor",supportNeed:"steady",
    handBrakes:"unknown",canLiftWalker:"unknown",
    seatNeeded:false,transportNeed:false,homeSpace:"standard",duration:"unknown"
  });
  assert.notEqual(unsafe.status,"candidate");
  assert.deepEqual(unsafe.recommendations,[]);
});

test("CTA only unlocks after exact-model checks and cannot unlock another product",()=>{
  for(const s of SCENARIOS){
    assert.doesNotThrow(()=>validOfferCard(reportFor(s),s,false));
    assert.doesNotThrow(()=>validOfferCard(reportFor(s,{hidden:false}),s,true));
    assert.throws(()=>validOfferCard(reportFor(s,{hidden:false}),s,false),/prematurely shown/);
    assert.throws(()=>validOfferCard(reportFor(s,{hidden:true}),s,true),/not unlocked/);
    assert.throws(()=>validOfferCard(reportFor(s,{otherModelsLocked:false}),s,false),/another product card/);
  }
});

test("wrong affiliate slot, missing disclosure, variant or brake gate must fail",()=>{
  for(const s of SCENARIOS){
    for(const [field,value] of [
      ["runtimeMatches",false],["sponsored",false],["sameModel",false],
      ["linkCount",0],["cardCount",0],["requiredControlsOk",false],
      ["hasBrakeControl",!s.brakes]
    ]){
      assert.throws(()=>validOfferCard(reportFor(s,{[field]:value}),s,false));
    }
  }
});

test("live Chrome monitor compares only in-browser URLs and never visits merchants",()=>{
  const s=readFileSync(new URL("../scripts/audit-live-mobility-offer-parity.mjs",import.meta.url),"utf8");
  const w=readFileSync(new URL("../.github/workflows/production-advisor-qa.yml",import.meta.url),"utf8");
  assert.match(s,/EXPECTED_LIVE_RELEASE/);
  assert.match(s,/link.getAttribute\("href"\)===runtime\[key\]/);
  assert.match(s,/page\.setRequestInterception\(true\)/);
  assert.match(s,/request\.method\(\)==="GET"/);
  assert.match(s,/assert\.equal\(blockedNonGet,0/);
  assert.match(s,/assert\.equal\(blockedMerchant,0/);
  assert.match(s,/new URL\(page\.url\(\)\)\.search/);
  assert.match(w,/node scripts\/audit-live-mobility-offer-parity\.mjs/);
  assert.match(w,/tests\/live-mobility-offer-parity\.test\.js/);
  assert.doesNotMatch(s,/(?:page|element)\.click\(\s*["'][^"']*(?:merchant|affiliate)/);
  assert.doesNotMatch(s,/console\.log\([^\n]*url\.href/);
});
