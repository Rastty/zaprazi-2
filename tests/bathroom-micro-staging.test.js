import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { previewBathroomCandidates } from "../src/bathroom/preview.js";
import { recommendBathroom } from "../src/bathroom/engine.js";
import { getBathroomProducts } from "../src/bathroom/catalog.js";
const read = path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

const cases = [
  ["toilet-riser","nastavec-na-wc-pro-seniory",["toiletFit","feetFlatAtRaisedHeight","loadFit"],"raise_toilet","unizdrav-p2868",{}],
  ["shower-chair","sprchovaci-zidle-pro-seniory",["spaceFit","loadFit"],"shower_seated","unizdrav-p2062",{floorStable:"yes"}],
  ["toilet-chair","toaletni-zidle-pro-seniory",["spaceFit","loadFit"],"toilet_nearby","unizdrav-p2807",{floorStable:"yes"}],
  ["toilet-support","madlo-k-wc-pro-seniory",["loadFit"],"toilet_support","unizdrav-p2015",{wallFixing:"unverified"}],
  ["bath-transfer","sedatko-do-vany-pro-seniory",["bathFit","bathBenchFit","loadFit"],"bath_transfer","besco-bs008",{bathTransferIndependent:"yes"}]
];

test("all five product micro advisors defer model-specific confirmations until exact product shown",()=>{
  const helper=read("src/bathroom/micro-staging.js");
  for(const [slug,pageSlug,fields] of cases){
    const page=read("page-"+pageSlug+".php");
    const script=read("assets/js/"+slug+"-advisor.js");
    assert.ok(page.includes('id="zp-'+slug+'-preview"'));
    assert.ok(page.includes('id="zp-'+slug+'-fit-stage"'));
    assert.ok(page.includes("1. Ukázat možný výrobek"));
    assert.ok(script.includes('installBathroomMicroStaging({'));
    assert.ok(script.includes('key: "'+slug+'"'));
    for(const field of fields){
      assert.ok(script.includes('"'+field+'"'),slug+": "+field);
      assert.ok(page.includes('name="'+field+'"'),pageSlug+": "+field);
    }
  }
  assert.match(helper,/fitStage\.appendChild\(group\)/);
  assert.match(helper,/event\.stopImmediatePropagation\(\)/);
  assert.match(helper,/previewBathroomCandidates\(input\(\)\)/);
  assert.match(helper,/!group\.closest\("\[hidden\]"\)/);
  assert.match(helper,/submit\.textContent = "2\. Vyhodnotit parametry"/);
  assert.match(helper,/fitStage\.querySelectorAll\('input\[type="radio"\]'\)/);
  const preliminary=helper.split("const renderProduct =")[1].split("const block =")[0];
  assert.doesNotMatch(preliminary,/href=|affiliateMap|resolvedUrl|merchant-link|renderOffers/);
  assert.doesNotMatch(helper,/sendBeacon|localStorage|fetch\(/);
});

test("each micro preview shows known technical facts, never actual offer or approved status",()=>{
  for(const [slug,,fit,need,expected,other] of cases){
    const answers={primaryNeed:need,transferAbility:"independent",duration:"long_term",...other};
    const preview=previewBathroomCandidates(answers);
    assert.equal(preview.status,"unverified_preview",slug);
    assert.ok(preview.productCandidateIds.includes(expected),slug);
    assert.equal(Object.hasOwn(preview,"offers"),false);
    assert.equal(Object.hasOwn(preview,"acquisition"),false);
    const products=getBathroomProducts(preview.productCandidateIds);
    assert.ok(products.length && products.every(p=>p.facts && p.evidence),slug);
    const strict=recommendBathroom(answers);
    assert.notEqual(strict.status,"candidate",slug);
    assert.deepEqual(strict.recommendations,[]);
  }
});

test("no-fit and unknown capacity remain blocked after preview",()=>{
  for(const [, ,fields,need,,other] of cases){
    const base={primaryNeed:need,transferAbility:"independent",duration:"long_term",...other};
    const allValid={...base,loadFit:"yes",spaceFit:"yes",toiletFit:"yes",feetFlatAtRaisedHeight:"yes",
      bathFit:"yes",bathBenchFit:"unknown"};
    assert.equal(recommendBathroom(allValid).status,"candidate");
    for(const field of fields.filter(f=>f!=="bathBenchFit")){
      const denied=recommendBathroom({...allValid,[field]:"no"});
      assert.notEqual(denied.status,"candidate",field+" "+need);
    }
    const noWeight=recommendBathroom({...allValid,loadFit:"unknown"});
    assert.notEqual(noWeight.status,"candidate");
  }
});

test("high-risk transfer and unsafe floor do not even show a product preview",()=>{
  const blocked=[
    {primaryNeed:"raise_toilet",transferAbility:"person_assist"},
    {primaryNeed:"shower_seated",transferAbility:"independent",floorStable:"no"},
    {primaryNeed:"toilet_nearby",transferAbility:"independent",floorStable:"unknown"},
    {primaryNeed:"bath_transfer",transferAbility:"steadying",bathTransferIndependent:"yes"},
    {primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"no"}
  ];
  for(const input of blocked){
    const result=previewBathroomCandidates(input);
    assert.notEqual(result.status,"unverified_preview",JSON.stringify(input));
    assert.deepEqual(result.productCandidateIds,[]);
  }
});
