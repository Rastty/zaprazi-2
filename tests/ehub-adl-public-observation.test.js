import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {ehubAdlTargets} from "../scripts/audit-ehub-adl-listings.mjs";

const observation=JSON.parse(readFileSync(
  new URL("../data/ehub-adl-seller-observation-20261122.json",import.meta.url),"utf8"
));
const expected=ehubAdlTargets();

test("independently observed public eHUB category is an exact dated four-SKU mapping",()=>{
  assert.equal(observation.schemaVersion,1);
  assert.equal(observation.observedOn,"2026-11-22");
  assert.equal(observation.sourceUrl,"https://www.rehavita.cz/pomucky-pro-sobestacnost/");
  assert.equal(observation.items.length,4);
  assert.deepEqual(observation.items.map(x=>x.candidateId),expected.map(x=>x.id));
  assert.deepEqual(observation.items.map(x=>x.sellerSku),expected.map(x=>x.sku));
  assert.deepEqual(observation.items.map(x=>x.sellerProductUrl),expected.map(x=>x.url));
  assert.equal(new Set(observation.items.map(x=>x.sellerSku)).size,4);
  assert.equal(new Set(observation.items.map(x=>x.sellerProductUrl)).size,4);
  for(const row of observation.items){
    assert.deepEqual(Object.keys(row).sort(),
      ["candidateId","sellerLabel","sellerProductUrl","sellerSku"].sort());
    assert.equal(row.sellerLabel,"Skladem");
    const url=new URL(row.sellerProductUrl);
    assert.equal(url.origin,"https://www.rehavita.cz");
    assert.equal(url.search,"");
    assert.equal(url.hash,"");
  }
});

test("dated public seller display cannot refresh production product or affiliate truth",()=>{
  assert.equal(observation.conclusions.exactSellerCategoryCardMatches,4);
  assert.equal(observation.conclusions.sellerDeclaredAvailableLabels,4);
  for(const field of [
    "exactManufacturerVariantVerification","physicalWarehouseStock",
    "authorizedPublisherDeeplinkDestination","affiliateAttribution","approvedCommission"
  ])assert.equal(observation.conclusions[field],"UNKNOWN");
  assert.deepEqual(observation.nonActions,{
    refreshRuntimeCheckedAt:false,changeAffiliateDestination:false,
    enableOrReorderOffers:false,changeMedicalOrProductFit:false,
    wordpressWrites:0,affiliateClickRequests:0
  });
  assert.ok(expected.every(x=>x.checkedAt==="2026-10-07"),
    "Do not mutate original runtime verification dates based on a third-party rendering");
  assert.match(observation.observationMethod,/NOT authenticated eHUB publisher API/);
  assert.match(observation.limitations,/HTTP 403/);
  assert.doesNotMatch(JSON.stringify(observation),
    /[?&](?:affiliate|aff_id|sid|token|publisher_id)=|approvedRevenue|physicalStockQuantity/i);
});
