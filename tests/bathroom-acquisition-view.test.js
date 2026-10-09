import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { recommendBathroom } from "../src/bathroom/engine.js";
import { renderBathroomAcquisition } from "../src/bathroom/acquisition-view.js";

const escapeHtml = value => String(value ?? "")
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
  .replaceAll('"',"&quot;").replaceAll("'","&#039;");

const cases = [
  ["toilet-riser", {primaryNeed:"raise_toilet",transferAbility:"independent",loadFit:"yes",toiletFit:"yes",feetFlatAtRaisedHeight:"yes"}],
  ["shower-chair", {primaryNeed:"shower_seated",transferAbility:"independent",loadFit:"yes",floorStable:"yes",spaceFit:"yes"}],
  ["toilet-chair", {primaryNeed:"toilet_nearby",transferAbility:"independent",loadFit:"yes",floorStable:"yes",spaceFit:"yes"}],
  ["toilet-support", {primaryNeed:"toilet_support",transferAbility:"steadying",loadFit:"yes",wallFixing:"verified"}],
  ["bath-transfer", {primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"yes",bathFit:"yes",loadFit:"yes"}]
];

test("all five narrow Bathroom Advisors actually show different next steps for short vs long use",()=>{
  for (const [name, input] of cases) {
    const source=fs.readFileSync(new URL("../assets/js/"+name+"-advisor.js",import.meta.url),"utf8");
    assert.match(source,/renderBathroomAcquisition\(/,"Acquisition omitted from user interface: "+name);
    assert.match(source,/\.acquisition/,"Must use real recommendation engine acquisition data");
    const short=recommendBathroom({...input,duration:"short_term"});
    const long=recommendBathroom({...input,duration:"long_term"});
    assert.equal(short.status,"candidate",name);
    assert.equal(long.status,"candidate",name);
    const shortHtml=renderBathroomAcquisition(short.acquisition,escapeHtml);
    const longHtml=renderBathroomAcquisition(long.acquisition,escapeHtml);
    assert.match(shortHtml,/Porovnat půjčení a koupi/,"Short-term solution must discuss rent");
    assert.match(longHtml,/Porovnat koupi a případné půjčení/,"Long-term solution must discuss buy");
    assert.notEqual(shortHtml,longHtml,"The duration question must materially change what visitor sees");
    for(const html of [shortHtml,longHtml]) {
      assert.match(html,/Jak pomůcku získat/);
      assert.match(html,/Jak ověřit možnosti úhrady/);
      assert.match(html,/href="\/pomucky-do-koupelny-na-pojistovnu\/"/);
      assert.doesNotMatch(html,/ehub\.cz|merchant-link|affiliate/,"Acquisition block is not an offer bypass");
    }
  }
});

test("unknown duration leaves buy/rent neutral, without false certainty",()=>{
  const result=recommendBathroom({...cases[0][1],duration:"unknown"});
  assert.equal(result.status,"candidate");
  const markup=renderBathroomAcquisition(result.acquisition,escapeHtml);
  assert.match(markup,/Ověřit způsob pořízení/);
  assert.doesNotMatch(markup,/Nejdřív porovnat půjčení|Porovnat koupi a případné půjčení/);
});

test("without verified safety/fit, acquisition UI remains empty",()=>{
  for(const [,input] of cases) {
    const blocked=recommendBathroom({...input,loadFit:"unknown",duration:"short_term"});
    assert.notEqual(blocked.status,"candidate");
    assert.deepEqual(blocked.acquisition,[]);
    assert.equal(renderBathroomAcquisition(blocked.acquisition,escapeHtml),"");
  }
});

test("acquisition markup escapes engine text and never constructs user-derived URLs",()=>{
  const markup=renderBathroomAcquisition([{
    id:"untrusted",
    label:"<script>alert(1)</script>",
    reason:"test \" x"
  }],escapeHtml);
  assert.doesNotMatch(markup,/<script/);
  assert.match(markup,/&lt;script&gt;/);
  assert.doesNotMatch(markup,/href=/);
  assert.equal(renderBathroomAcquisition([],escapeHtml),"");
  assert.throws(()=>renderBathroomAcquisition([{id:"x"}]),/escape function required/);
});
