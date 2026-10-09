import test from "node:test";
import assert from "node:assert/strict";
import { recommendMobility } from "../src/mobility/engine.js";
import { getMobilityProducts } from "../src/mobility/catalog.js";
import { recommendBathroom } from "../src/bathroom/engine.js";
import { getBathroomProducts } from "../src/bathroom/catalog.js";
import { recommendAdjustableBed } from "../src/bed/engine.js";
import { getAdjustableBedProducts } from "../src/bed/catalog.js";
import { recommendWheelchair } from "../src/wheelchair/engine.js";
import { getWheelchairProducts } from "../src/wheelchair/catalog.js";

const scenarios = [
  ["mobile indoor fixed walker",recommendMobility,getMobilityProducts,{environment:"indoor",supportNeed:"steady",canLiftWalker:"yes"}],
  ["mobile indoor two-wheel walker",recommendMobility,getMobilityProducts,{environment:"indoor",supportNeed:"steady",canLiftWalker:"no"}],
  ["mobile rollator",recommendMobility,getMobilityProducts,{environment:"both",supportNeed:"steady",handBrakes:"yes"}],
  ["toilet riser",recommendBathroom,getBathroomProducts,{primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"yes",toiletFit:"yes",feetFlatAtRaisedHeight:"yes"}],
  ["toilet riser support",recommendBathroom,getBathroomProducts,{primaryNeed:"raise_toilet",transferAbility:"steadying",loadFit:"yes",toiletFit:"yes",feetFlatAtRaisedHeight:"yes"}],
  ["toilet frame",recommendBathroom,getBathroomProducts,{primaryNeed:"toilet_support",transferAbility:"steadying",loadFit:"yes",wallFixing:"unknown",supportFrameFit:"yes"}],
  ["wall rail",recommendBathroom,getBathroomProducts,{primaryNeed:"toilet_support",transferAbility:"steadying",loadFit:"yes",wallFixing:"verified"}],
  ["bedside toilet",recommendBathroom,getBathroomProducts,{primaryNeed:"toilet_nearby",transferAbility:"independent",loadFit:"yes",floorStable:"yes",spaceFit:"yes"}],
  ["shower chair",recommendBathroom,getBathroomProducts,{primaryNeed:"shower_seated",transferAbility:"independent",loadFit:"yes",floorStable:"yes",spaceFit:"yes"}],
  ["four in one chair",recommendBathroom,getBathroomProducts,{primaryNeed:"multifunction_toilet_shower",transferAbility:"independent",loadFit:"yes",floorStable:"yes",spaceFit:"yes"}],
  ["bath rim seat",recommendBathroom,getBathroomProducts,{primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"yes",loadFit:"yes",bathFit:"yes"}],
  ["bath transfer bench",recommendBathroom,getBathroomProducts,{primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"yes",loadFit:"yes",bathFit:"no",bathBenchFit:"yes"}],
  ["standard bed",recommendAdjustableBed,getAdjustableBedProducts,{transferAbility:"independent",primaryNeed:"home_positioning",loadFit:"yes",spaceFit:"yes"}],
  ["caregiver bed",recommendAdjustableBed,getAdjustableBedProducts,{transferAbility:"independent",primaryNeed:"caregiver_access",loadFit:"yes",spaceFit:"yes"}],
  ["robust bed",recommendAdjustableBed,getAdjustableBedProducts,{transferAbility:"independent",primaryNeed:"robust_high_load",loadFit:"yes",spaceFit:"yes",userCapacityVerified:"yes"}],
  ["advanced care bed",recommendAdjustableBed,getAdjustableBedProducts,{transferAbility:"independent",primaryNeed:"advanced_in_bed_care",loadFit:"yes",spaceFit:"yes",userCapacityVerified:"yes"}],
  ["companion wheelchair",recommendWheelchair,getWheelchairProducts,{propulsion:"companion",transferAbility:"independent",seatFit:"yes",widthFit:"yes",loadFit:"yes"}],
  ["manual wheelchair",recommendWheelchair,getWheelchairProducts,{propulsion:"self_manual",wheelType:"pneumatic",seatWidthVariant:"48",transferAbility:"independent",manualControlSafe:"yes",seatFit:"yes",widthFit:"yes",loadFit:"yes"}],
  ["mixed wheelchair",recommendWheelchair,getWheelchairProducts,{propulsion:"mixed_manual",wheelType:"tubeless",seatWidthVariant:"51",transferAbility:"independent",manualControlSafe:"yes",seatFit:"yes",widthFit:"yes",loadFit:"yes"}],
  ["powered wheelchair",recommendWheelchair,getWheelchairProducts,{propulsion:"powered",transferAbility:"independent",seatFit:"yes",widthFit:"yes",loadFit:"yes",joystickSafe:"yes",chargingReady:"yes"}]
];

test("every commercial engine branch maps to real, eligible, uniquely identified product(s) with evidence",()=>{
  for (const [label,engine,catalog,answers] of scenarios) {
    const decision=engine(answers);
    assert.equal(decision.status,"candidate",label+": "+decision.status);
    const ids=decision.recommendations.flatMap(item=>item.productCandidateIds||[]);
    assert.ok(ids.length>0,label+": no candidate IDs");
    assert.equal(new Set(ids).size,ids.length,label+": duplicate candidate ID");
    const products=catalog(ids);
    assert.equal(products.length,ids.length,label+": missing catalog candidate(s)");
    for(const product of products){
      assert.equal(product.productionEligible,true,label+": product is not approved for production");
      assert.ok(product.name && product.id,label+": missing exact model identity");
      assert.ok(product.facts && Object.keys(product.facts).length,label+": missing measured product facts");
      assert.ok(Array.isArray(product.evidence)&&product.evidence.length>0,label+": missing manufacturer or merchant evidence");
      for(const source of product.evidence) {
        assert.match(source.url,/^https:\/\//,label+": non-HTTPS evidence URL");
        assert.match(source.checkedAt,/^\d{4}-\d{2}-\d{2}$/,label+": no provenance check date");
      }
      assert.ok(product.offers?.length,label+": approved candidate has no merchant path");
      for(const offer of product.offers){
        assert.match(offer.url,/^https:\/\//,label+": missing real merchant destination");
        assert.ok(offer.merchantName,label+": merchant identity missing");
      }
    }
  }
});

test("no safety-gated case leaks a non-eligible product",()=>{
  for(const [engine,catalog,answers] of [
    [recommendBathroom,getBathroomProducts,{primaryNeed:"combined_shower_toilet",transferAbility:"independent",loadFit:"yes"}],
    [recommendBathroom,getBathroomProducts,{primaryNeed:"bath_transfer",transferAbility:"person_assist",loadFit:"yes",bathFit:"yes"}],
    [recommendWheelchair,getWheelchairProducts,{propulsion:"powered",transferAbility:"unknown",seatFit:"yes",widthFit:"yes",loadFit:"yes",joystickSafe:"yes",chargingReady:"yes"}],
    [recommendMobility,getMobilityProducts,{environment:"outdoor",supportNeed:"steady",handBrakes:"no"}]
  ]) {
    const outcome=engine(answers);
    assert.notEqual(outcome.status,"candidate");
    const ids=outcome.recommendations.flatMap(item=>item.productCandidateIds||[]);
    assert.equal(catalog(ids).length,0);
  }
});
