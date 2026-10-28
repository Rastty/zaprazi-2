import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {recommendMobility} from "../src/mobility/engine.js";
import {getMobilitySafeRecovery,getMobilityNextSteps} from "../src/mobility/next-steps.js";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const scenario = extras => recommendMobility({
 environment:"indoor",supportNeed:"steady",canLiftWalker:"yes",handBrakes:"unknown",...extras
});

test("Physical help blocks product acquisition but offers a practical safe-service information route",()=>{
 const result=scenario({supportNeed:"person_assist"});
 assert.equal(result.status,"professional_check");
 assert.deepEqual(getMobilityNextSteps(result).items,[]);
 const follow=getMobilitySafeRecovery(result);
 assert.ok(follow);
 assert.equal(follow.href,"/jak-vybrat-pecovatelskou-sluzbu/#vyber-pecovatelske-sluzby-kroky");
 assert.match(follow.reason,/nenahrazuje posouzení bezpečné chůze/);
 assert.deepEqual(result.recommendations,[]);
 assert.deepEqual(result.acquisition,[]);
});

test("Unknown or unsafe brakes lead to safety information, never a product, rental, or reimbursement shortcut",()=>{
 for(const brakes of ["unknown","no"]){
  const result=scenario({environment:"outdoor",handBrakes:brakes});
  assert.equal(result.status,"needs_more_info");
  const follow=getMobilitySafeRecovery(result,{handBrakes:brakes});
  assert.equal(follow.href,"/rollator-pro-seniory/#bezpecne-pouziti-rollatoru");
  assert.match(follow.reason,/brzdy|brzd/);
  assert.deepEqual(getMobilityNextSteps(result).items,[]);
  assert.deepEqual(result.recommendations,[]);
  assert.deepEqual(result.acquisition,[]);
 }
});

test("Unknown ability to lift walker gets the right decision guide, without unlocking product offers",()=>{
 const result=scenario({canLiftWalker:"unknown"});
 assert.equal(result.status,"needs_more_info");
 assert.ok(result.missing.includes("canLiftWalker"));
 assert.equal(getMobilitySafeRecovery(result).href,"/choditka-pro-seniory/#vyber-typu");
 assert.deepEqual(result.recommendations,[]);
 assert.deepEqual(getMobilityNextSteps(result).items,[]);
});

test("No extra recovery on approved candidate, invalid input, generic light or undecided branches",()=>{
 const candidate=scenario({});
 assert.equal(candidate.status,"candidate");
 assert.equal(getMobilitySafeRecovery(candidate),null);
 const invalid=scenario({environment:"not-a-real-place"});
 assert.equal(invalid.status,"invalid_input");
 assert.equal(getMobilitySafeRecovery(invalid),null);
 for(const s of ["light","unknown"]){
  const result=scenario({supportNeed:s});
  assert.equal(getMobilitySafeRecovery(result),null);
 }
 assert.equal(getMobilitySafeRecovery(null),null);
 assert.equal(getMobilitySafeRecovery({status:"needs_more_info",missing:[]}),null);
 assert.equal(getMobilitySafeRecovery({status:"needs_more_info",missing:["canLiftWalker"]},{handBrakes:"no"}).href,
   "/choditka-pro-seniory/#vyber-typu","Never override a missing walker-lift safety question using irrelevant brakes");
});

test("Recovery links point to real internal pages and exact anchors, with no merchant behavior",()=>{
 const next=read("src/mobility/next-steps.js");
 assert.ok(next.includes("ZP_RELEASE_0_8_183"));
 for(const status of [
  getMobilitySafeRecovery(scenario({supportNeed:"person_assist"})),
  getMobilitySafeRecovery(scenario({environment:"outdoor",handBrakes:"no"}),{handBrakes:"no"}),
  getMobilitySafeRecovery(scenario({canLiftWalker:"unknown"}))
 ]){
  const u=new URL(status.href,"https://zaprazi.cz");
  assert.equal(u.origin,"https://zaprazi.cz");
  assert.equal(u.search,"");
  const page=read("page-"+u.pathname.replace(/^\/|\/$/g,"")+".php");
  assert.ok(page.includes('id="'+u.hash.slice(1)+'"'),"Missing exact anchor "+status.href);
  assert.doesNotMatch(status.href,/affiliate|merchant|kup|pujc|lekarna|awin|https:\/\//i);
 }
 assert.doesNotMatch(next,/data-zp-merchant-link|merchant_click|affiliateMap|https:\/\/[^/]+\/[^\s]*click|window\.location|localStorage|sessionStorage|sendBeacon/);
});

test("All three Advisor renderers show one escaped informational link only for blocked results",()=>{
 for(const script of ["mobility-advisor.js","indoor-walker-advisor.js","rollator-advisor.js"]){
  const source=read("assets/js/"+script);
  assert.ok(source.includes("getMobilitySafeRecovery"),script);
  assert.ok(source.includes("zp-safe-recovery"),script);
  assert.ok(source.includes("safeRecoveryMarkup"),script);
  assert.ok(source.includes("safeRecovery.reason"),script);
  assert.ok(source.includes("safeRecovery.href"),script);
  assert.ok(source.includes("safeRecovery.action"),script);
  assert.ok(source.includes("getMobilityNextSteps"),script);
  assert.ok(source.includes("safeRecovery\n") || source.includes("safeRecoveryMarkup"),script);
 }
 const css=read("style.css");
 assert.match(css,/\.zp-safe-recovery\s*\{/);
 assert.match(css,/\.zp-safe-recovery \.zp-link-btn\{[^}]*min-height:44px/);
 assert.match(css,/\.zp-fit-locked-offers\[hidden\]\{display:none!important\}/);
});
