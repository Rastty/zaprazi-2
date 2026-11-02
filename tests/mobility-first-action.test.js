import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {recommendMobility} from "../src/mobility/engine.js";
import {getMobilityQuickGuide,getMobilityNextSteps} from "../src/mobility/next-steps.js";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const base={environment:"indoor",supportNeed:"steady",canLiftWalker:"yes",duration:"short_term"};
const result=more=>recommendMobility({...base,...more});

test("safe Mobility candidate receives concise type and FULL-conditions reminder without declaring medical or model fit",()=>{
  for(const input of [
    {},{canLiftWalker:"no"},{environment:"both",handBrakes:"yes",canLiftWalker:"unknown"}
  ]){
    const r=result(input),before=JSON.stringify(r),guide=getMobilityQuickGuide(r);
    assert.equal(r.status,"candidate");
    assert.equal(guide.isCandidate,true);
    assert.ok(guide.situation.includes(r.recommendations[0].label));
    assert.match(guide.situation,/nikoliv ověřená vhodnost/);
    assert.match(guide.verify,/ostatní důležité parametry najdete níže/);
    assert.match(guide.next,/samostatné kontrole parametrů/);
    assert.equal(JSON.stringify(r),before,"Presentation must not alter engine decision");
    assert.equal(getMobilityNextSteps(r).items.length,2,"Existing acquisition whitelist remains intact");
  }
});

test("unknown brakes, unknown lift and physical help produce no commercial navigation or product assurance",()=>{
  const cases=[
    {input:{environment:"outdoor",handBrakes:"unknown"},expect:"needs_more_info"},
    {input:{environment:"both",handBrakes:"no"},expect:"needs_more_info"},
    {input:{canLiftWalker:"unknown"},expect:"needs_more_info"},
    {input:{supportNeed:"person_assist"},expect:"professional_check"},
    {input:{supportNeed:"light"},expect:"outside_current_slice"},
    {input:{supportNeed:"unknown"},expect:"needs_more_info"}
  ];
  for(const {input,expect} of cases){
    const r=result(input),guide=getMobilityQuickGuide(r);
    assert.equal(r.status,expect,JSON.stringify(input));
    assert.equal(guide.isCandidate,false);
    assert.equal(guide.situation,r.headline);
    assert.equal(guide.verify,r.nextStep);
    assert.match(guide.next,/nevybírejte|konzultujte|nezobrazujeme/);
    assert.deepEqual(getMobilityNextSteps(r).items,[]);
    assert.deepEqual(r.recommendations,[]);
    assert.deepEqual(r.acquisition,[]);
    assert.equal(Object.prototype.hasOwnProperty.call(guide,"href"),false);
  }
});

test("unrecognized inputs or malformed engine data cannot fabricate an apparent valid summary",()=>{
  assert.equal(getMobilityQuickGuide(null),null);
  assert.equal(getMobilityQuickGuide({}),null);
  assert.equal(getMobilityQuickGuide({status:"invalid_input",headline:"?",nextStep:"?"}),null);
  const invalid=result({environment:"made-up"});
  assert.equal(invalid.status,"invalid_input");
  assert.equal(getMobilityQuickGuide(invalid),null);
  const noEvidence=getMobilityQuickGuide({status:"candidate",headline:"x",nextStep:"y",recommendations:[]});
  assert.equal(noEvidence.isCandidate,false,"No product claim from empty recommendations");
});

test("main Mobility result puts the three accessible safe steps before every product and acquisition offer",()=>{
  const js=read("assets/js/mobility-advisor.js");
  const css=read("style.css");
  const block=js.slice(js.indexOf("    result.innerHTML = "),js.indexOf("    result.querySelectorAll("));
  const pos=[block.indexOf("\${quickGuideMarkup}"),block.indexOf("\${recommendations}"),
    block.indexOf("\${renderProducts(products"),block.indexOf("\${acquisition}")];
  assert.ok(pos[0]>=0&&pos[1]>pos[0]&&pos[2]>pos[1]&&pos[3]>pos[2],
    "The guidance must precede long model/offer list without hiding it");
  for(const key of ["situation","verify","next"]) {
    assert.ok(js.includes("escapeHtml(quickGuide."+key+")"),"Missing escaped field "+key);
  }
  for(const step of ["Co víme","Co ověřit","Jak bezpečně pokračovat"])assert.ok(js.includes(step));
  assert.match(js,/aria-labelledby="zp-mobility-orientation-title"/);
  assert.match(js,/form\.addEventListener\("change", \(\) => \{\s*result\.hidden = true;\s*result\.innerHTML = "";/);
  assert.match(js,/installMobilityProductFitGate\(result\)/);
  assert.match(js,/renderMobilityProductFitGate\(/);
  assert.match(css,/\.zp-orientation-list li::before/);
  assert.match(css,/@media\(max-width:540px\)/);
  assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(|sendBeacon/);
  assert.doesNotMatch(read("src/mobility/next-steps.js"),/data-zp-merchant-link|merchant_click|affiliateMap|localStorage/);
});
