import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";
import {validateRollatorSupply,validatePartnerRollatorFallbacks,reportRollatorSupply,supplyCli} from "../scripts/rollator-supply-review.mjs";

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

const fallbackMutate=(id,fn)=>{
  const copy=clone(data);
  fn(copy.partnerFallbacks.find(row=>row.id===id));
  return copy;
};

test("two independent existing-Lékárna partner alternatives are explicitly HOLD, never active merchant offers",()=>{
  const records=validatePartnerRollatorFallbacks(data);
  assert.equal(records.length,2);
  assert.deepEqual(records.map(x=>x.id),[
    "meyra-rollator-2-3061982-r","vitea-care-mobilus-lite-vcbk"
  ]);
  const report=reportRollatorSupply(data);
  assert.equal(report.approved_partner_fallbacks,2);
  assert.equal(report.fallback_offers_activated,0);
  assert.ok(records.every(x=>x.existingPartner==="lekarna-cz"&&
    x.offerStatus==="HOLD"&&x.productionEligible===false&&
    x.verifiedModelEquivalence===false&&x.currentInventoryVerified===false&&
    x.publisherDestinationVerified===false));
  assert.ok(records.every(x=>!MOBILITY_PRODUCTS.some(y=>y.id===x.id)));
  assert.match(supplyCli(),/"fallback_offers_activated": 0/);
});

test("MEYRA Rollator 2 -R is not the current IDEAL rollator; retailer/manufacturer dimension split persists",()=>{
  const id="meyra-rollator-2-3061982-r";
  const x=data.partnerFallbacks.find(z=>z.id===id);
  assert.equal(x.manufacturer.model,"3061982-R");
  assert.equal(x.merchant.sku,"468904");
  assert.equal(x.merchant.ean,"4041314026320");
  assert.equal(x.merchant.facts.handleHeightCm,"79–99");
  assert.equal(x.manufacturer.facts.handleHeightCm,"79–95");
  assert.equal(x.merchant.facts.depthCm,68);
  assert.equal(x.manufacturer.facts.depthCm,65);
  for(const bad of [
    fallbackMutate(id,r=>{r.manufacturer.model="3061982";}),
    fallbackMutate(id,r=>{r.merchant.sku="473021";}),
    fallbackMutate(id,r=>{r.merchant.ean="4041314026320x";}),
    fallbackMutate(id,r=>{r.manufacturer.facts.handleHeightCm="79–99";}),
    fallbackMutate(id,r=>{r.merchant.facts.seatHeightCm=60;}),
    fallbackMutate(id,r=>{r.manufacturer.facts.weightKg=11;}),
    fallbackMutate(id,r=>{r.verifiedModelEquivalence=true;}),
    fallbackMutate(id,r=>{r.productionEligible=true;}),
    fallbackMutate(id,r=>{r.publisherDestinationVerified=true;}),
    fallbackMutate(id,r=>{r.merchant.url="https://www.lekarna.cz/another-rollator/";})
  ])assert.throws(()=>validateRollatorSupply(bad));
});

test("VITEA current manufacturer differs from old catalogue/seller; never infer exact shipped variant",()=>{
  const id="vitea-care-mobilus-lite-vcbk";
  const v=data.partnerFallbacks.find(x=>x.id===id);
  assert.equal(v.manufacturer.model,"VCBK");
  assert.equal(v.manufacturer.manualEdition,"2023-05");
  assert.match(v.manufacturer.url,/Chod%C3%ADtko_Mobilus_Lite_n%C3%A1vod/);
  assert.match(v.manufacturer.productUrl,/viteacare\.com/);
  assert.equal(v.merchant.sku,"468905");
  assert.equal(v.merchant.ean,"5901095209031");
  assert.equal(v.merchant.facts.widthCm,67);
  assert.equal(v.manufacturer.facts.widthCm,66);
  assert.equal(v.merchant.facts.handleHeightCm,"77–88");
  assert.equal(v.manufacturer.facts.handleHeightCm,"79.5–92");
  for(const bad of [
    fallbackMutate(id,r=>{r.merchant.facts.widthCm=66;}),
    fallbackMutate(id,r=>{r.manufacturer.facts.widthCm=67;}),
    fallbackMutate(id,r=>{r.manufacturer.facts.handleHeightCm="77–88";}),
    fallbackMutate(id,r=>{r.historicManufacturerContext.note="Same as current version";}),
    fallbackMutate(id,r=>{r.historicManufacturerContext.url="https://example.com/file.pdf";}),
    fallbackMutate(id,r=>{r.manufacturer.model="VCBK222B";}),
    fallbackMutate(id,r=>{r.manufacturer.manualEdition="2020-01";}),
    fallbackMutate(id,r=>{r.manufacturer.productUrl="https://example.com/model";}),
    fallbackMutate(id,r=>{r.currentInventoryVerified=true;}),
    fallbackMutate(id,r=>{r.manufacturer.url="https://wrong.example/product";}),
    fallbackMutate(id,r=>{r.affiliateUrl="https://tracking.example/checkout";}),
    fallbackMutate(id,r=>{r.visitorHealthAnswer="private";}),
    fallbackMutate(id,r=>{r.publisherDestinationVerified=true;})
  ])assert.throws(()=>validateRollatorSupply(bad));
});

test("an extra, duplicate or removed Lékárna alternative cannot slip into supply gate",()=>{
  for(const bad of [
    {...clone(data),partnerFallbacks:[]},
    {...clone(data),partnerFallbacks:[...data.partnerFallbacks,data.partnerFallbacks[0]]},
    {...clone(data),partnerFallbacks:[data.partnerFallbacks[0],data.partnerFallbacks[0]]},
    {...clone(data),partnerFallbacks:[data.partnerFallbacks[0],{...data.partnerFallbacks[1],id:"new-unknown-model"}]},
    fallbackMutate("vitea-care-mobilus-lite-vcbk",x=>{x.nextAction="Trust me";}),
    fallbackMutate("meyra-rollator-2-3061982-r",x=>{x.merchant.url+="?clickid=secret";})
  ])assert.throws(()=>validateRollatorSupply(bad));
  const fakeCatalog=clone(MOBILITY_PRODUCTS);
  fakeCatalog.push({...fakeCatalog[0],id:"meyra-rollator-2-3061982-r",productionEligible:true});
  assert.throws(()=>validateRollatorSupply(data,fakeCatalog));
  assert.doesNotMatch(JSON.stringify(reportRollatorSupply(data)),
    /https?:\/\/|orderId|visitorHealth|token=|clickid=/i);
});
