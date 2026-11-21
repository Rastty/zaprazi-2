import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";
import {validateRollatorSupply,reportRollatorSupply,supplyCli} from "../scripts/rollator-supply-review.mjs";

const data=JSON.parse(readFileSync(
  new URL("../data/mobility-rollator-supply-review-20261121.json",import.meta.url),"utf8"));
const clone=x=>JSON.parse(JSON.stringify(x));
const modify=(id,fn)=>{
  const item=clone(data).candidates.find(c=>c.id===id);
  fn(item);
  const next=clone(data);
  next.candidates=next.candidates.map(c=>c.id===id?item:c);
  return next;
};

test("P0 rollator supply leads are real merchant SKUs but no live offers or fake commissions",()=>{
  assert.equal(validateRollatorSupply(data),data);
  const report=reportRollatorSupply(data);
  assert.equal(report.total_candidates,3);
  assert.equal(report.active_offers_added,0);
  assert.equal(report.publisher_deeplinks_verified,0);
  assert.equal(report.current_stock_verified,0);
  assert.ok(report.candidates.every(c=>c.status==="hold"));
  assert.deepEqual(new Set(report.candidates.map(c=>c.id)),new Set([
    "besco-wa78","unizdrav-p2879","unizdrav-p3774"
  ]));
  const candidateMap=new Map(MOBILITY_PRODUCTS.map(p=>[p.id,p]));
  assert.equal(candidateMap.get("besco-wa78").productionEligible,false);
  assert.equal(candidateMap.get("besco-wa78").identityStatus,"conflict");
  assert.equal(candidateMap.has("unizdrav-p2879"),false);
  assert.equal(candidateMap.has("unizdrav-p3774"),false);
  assert.match(supplyCli(),/"active_offers_added": 0/);
});

test("BESCO official 110 kg versus seller 136 kg and sold-out claim cannot be smoothed away",()=>{
  const wa=data.candidates.find(c=>c.id==="besco-wa78");
  assert.equal(wa.manufacturerClaim.maxUserWeightKg,110);
  assert.equal(wa.merchantClaim.maxUserWeightKg,136);
  assert.equal(wa.merchantClaim.availability,"sold_out_displayed");
  assert.match(wa.manufacturerUrl,/bescomedical\.com\/455-deluxe/);
  for(const bad of [
    modify("besco-wa78",c=>{c.merchantClaim.maxUserWeightKg=110;}),
    modify("besco-wa78",c=>{c.manufacturerModel="BES-WA77";}),
    modify("besco-wa78",c=>{c.manufacturerUrl="https://example.org/rollator";}),
    modify("besco-wa78",c=>{c.merchantClaim.availability="in_stock_displayed";}),
    modify("besco-wa78",c=>{c.blockers=c.blockers.filter(b=>b!=="critical_max_load_disagreement");}),
    modify("besco-wa78",c=>{c.blockers=c.blockers.filter(b=>b!=="linked_manual_brand_disagreement");})
  ])assert.throws(()=>validateRollatorSupply(bad));
});

test("UNIZDRAV seller descriptions never count as independent medical device identity, live stock or publisher tracking",()=>{
  for(const id of ["unizdrav-p2879","unizdrav-p3774"]){
    const c=data.candidates.find(c=>c.id===id);
    assert.equal(c.manufacturerUrl,null);
    assert.equal(c.manufacturerClaim,null);
    assert.equal(c.productionEligible,false);
    assert.equal(c.stockVerifiedCurrent,false);
    assert.equal(c.publisherDeeplinkVerified,false);
    for(const bad of [
      modify(id,x=>{x.productionEligible=true;}),
      modify(id,x=>{x.stockVerifiedCurrent=true;}),
      modify(id,x=>{x.publisherDeeplinkVerified=true;}),
      modify(id,x=>{x.manufacturerUrl="https://unizdrav.cz/other";}),
      modify(id,x=>{x.blockers=[];}),
      modify(id,x=>{x.blockers=x.blockers.filter(b=>b!=="independent_model_manual_missing");}),
      modify(id,x=>{x.blockers=x.blockers.filter(b=>b!=="exact_publisher_deeplink_unverified");}),
      modify(id,x=>{x.retailerUrl="https://unizdrav.cz/zbozi/2879/pojizdne?aid=private";}),
      modify(id,x=>{x.retailerSku="P4714";})
    ]) assert.throws(()=>validateRollatorSupply(bad));
  }
});

test("the supplier queue refuses tracking, fake health profile and accidentally production-enabled candidates",()=>{
  for(const bad of [
    modify("unizdrav-p2879",c=>{c.affiliateUrl="https://example.com/token";}),
    modify("unizdrav-p2879",c=>{c.clientId="test-person";}),
    modify("unizdrav-p3774",c=>{c.retailerUrl="https://evil.example/zbozi/3774/";}),
    modify("unizdrav-p3774",c=>{c.blockers.push("exact_publisher_deeplink_unverified");}),
    {...clone(data),candidates:[data.candidates[0],data.candidates[0],data.candidates[2]]},
    {...clone(data),productionEffect:"affiliates_live"}
  ])assert.throws(()=>validateRollatorSupply(bad));
  const badLive=clone(MOBILITY_PRODUCTS);
  badLive.push({...MOBILITY_PRODUCTS[0],id:"unizdrav-p2879",productionEligible:true});
  assert.throws(()=>validateRollatorSupply(data,badLive));
  assert.doesNotMatch(JSON.stringify(reportRollatorSupply(data)),
    /https?:\/\/|user.?id|answer=|token=|subid=|tracking/i);
});
