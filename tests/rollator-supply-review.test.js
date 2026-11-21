import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";
import {validateRollatorSupply,reportRollatorSupply,supplyCli} from "../scripts/rollator-supply-review.mjs";

const data=JSON.parse(readFileSync(
  new URL("../data/mobility-rollator-supply-review-20261121.json",import.meta.url),"utf8"));
const clone=v=>JSON.parse(JSON.stringify(v));
const mutate=(id,fn)=>{
  const result=clone(data);
  fn(result.candidates.find(c=>c.id===id));
  return result;
};
const byId=id=>data.candidates.find(c=>c.id===id);

test("Four exactly sourced supplier records remain commercially blocked",()=>{
  assert.equal(validateRollatorSupply(data),data);
  const r=reportRollatorSupply(data);
  assert.equal(r.total_records,4);
  assert.equal(r.current_seller_listings,2);
  assert.equal(r.retired_skus,1);
  assert.equal(r.product_load_conflicts,1);
  assert.equal(r.active_offers_added,0);
  assert.equal(r.publisher_deeplinks_verified,0);
  assert.equal(r.physical_stock_verified,0);
  assert.deepEqual(new Set(r.items.map(x=>x.id)),new Set([
    "besco-wa78","unizdrav-p2879","unizdrav-p3774","unizdrav-p5559"
  ]));
  assert.ok(r.items.every(x=>!x.production_eligible));
  assert.equal(MOBILITY_PRODUCTS.find(x=>x.id==="besco-wa78")?.productionEligible,false);
  assert.ok(MOBILITY_PRODUCTS.every(x=>!x.id.startsWith("unizdrav-p")));
  assert.match(supplyCli(),/"retired_skus": 1/);
});

test("WA78 disputed 110/136 kg load, out of stock and wrong brand manual cannot disappear",()=>{
  const wa=byId("besco-wa78");
  assert.equal(wa.manufacturerClaim.maxUserWeightKg,110);
  assert.equal(wa.merchantClaim.maxUserWeightKg,136);
  for(const m of [
    mutate(wa.id,x=>{x.merchantClaim.maxUserWeightKg=110;}),
    mutate(wa.id,x=>{x.manufacturerClaim.maxUserWeightKg=136;}),
    mutate(wa.id,x=>{x.manufacturerModel="other";}),
    mutate(wa.id,x=>{x.merchantClaim.availability="in_stock_displayed";}),
    mutate(wa.id,x=>{x.blockers=x.blockers.filter(b=>b!=="critical_max_load_disagreement");}),
    mutate(wa.id,x=>{x.blockers=x.blockers.filter(b=>b!=="linked_manual_brand_disagreement");})
  ])assert.throws(()=>validateRollatorSupply(m));
});

test("P3774 explicitly retired, never interchangeable with P5559 MEGO 2",()=>{
  const old=byId("unizdrav-p3774"),next=byId("unizdrav-p5559");
  assert.equal(old.lifecycleStatus,"retired");
  assert.equal(old.merchantClaim.availability,"retired_by_merchant");
  assert.equal(old.relatedModel.id,next.id);
  assert.equal(old.relatedModel.relation,"different_sku_not_equivalent");
  assert.notEqual(old.merchantClaim.widthCm,next.merchantClaim.widthCm);
  assert.notEqual(old.merchantClaim.handleHeightCm,next.merchantClaim.handleHeightCm);
  assert.notEqual(old.retailerSku,next.retailerSku);
  for(const m of [
    mutate(old.id,x=>{x.lifecycleStatus="seller_listing_observed";}),
    mutate(old.id,x=>{x.merchantClaim.availability="in_stock_displayed";}),
    mutate(old.id,x=>{x.productionEligible=true;}),
    mutate(old.id,x=>{x.relatedModel.relation="same_variant";}),
    mutate(old.id,x=>{x.relatedModel.id="unizdrav-p2879";}),
    mutate(old.id,x=>{x.merchantObservation.statusText="skladem";}),
    mutate(old.id,x=>{x.blockers=x.blockers.filter(b=>b!=="retired_by_merchant");}),
    mutate(next.id,x=>{x.retailerSku="P3774";}),
    mutate(next.id,x=>{x.merchantClaim.widthCm=63;})
  ])assert.throws(()=>validateRollatorSupply(m));
});

test("Seller displays are leads, never proof of stock, manual, publisher credit or safe fit",()=>{
  for(const id of ["unizdrav-p2879","unizdrav-p5559"]){
    const row=byId(id);
    assert.equal(row.lifecycleStatus,"seller_listing_observed");
    assert.equal(row.productionEligible,false);
    assert.equal(row.stockVerifiedCurrent,false);
    assert.equal(row.publisherDeeplinkVerified,false);
    assert.equal(row.manufacturerUrl,null);
    assert.equal(row.manufacturerClaim,null);
    for(const bad of [
      mutate(id,x=>{x.productionEligible=true;}),
      mutate(id,x=>{x.publisherDeeplinkVerified=true;}),
      mutate(id,x=>{x.stockVerifiedCurrent=true;}),
      mutate(id,x=>{x.manufacturerUrl="https://manufacturer.example/manual";}),
      mutate(id,x=>{x.blockers=x.blockers.filter(b=>b!=="independent_model_manual_missing");}),
      mutate(id,x=>{x.blockers=x.blockers.filter(b=>b!=="same_variant_fresh_inventory_not_verified");}),
      mutate(id,x=>{x.merchantObservation.availabilityScope="physical_stock_verified";}),
      mutate(id,x=>{x.retailerUrl+="?affid=secret";}),
      mutate(id,x=>{x.affiliateUrl="https://tracking.example";}),
      mutate(id,x=>{x.visitorHealth="sensitive";})
    ])assert.throws(()=>validateRollatorSupply(bad));
  }
});

test("No unreviewed candidate, unknown blocker or unsafe replacement enters live catalog",()=>{
  const copy=clone(data);
  copy.candidates.pop();
  assert.throws(()=>validateRollatorSupply(copy));
  for(const invalid of [
    mutate("unizdrav-p5559",x=>{x.blockers.push("safe_auto_rank");}),
    mutate("unizdrav-p3774",x=>{x.blockers.push("retired_by_merchant");}),
    mutate("unizdrav-p2879",x=>{x.retailerUrl="https://evil.example/p2879";}),
    {...clone(data),productionEffect:"wordpress_published"},
  ])assert.throws(()=>validateRollatorSupply(invalid));
  const live=clone(MOBILITY_PRODUCTS);
  live.push({...live[0],id:"unizdrav-p5559",productionEligible:true});
  assert.throws(()=>validateRollatorSupply(data,live));
  assert.doesNotMatch(JSON.stringify(reportRollatorSupply(data)),/https?:\/\/|[?]affid=|sessionId|diagnosis/i);
});
