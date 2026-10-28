import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {recommendMobility} from "../src/mobility/engine.js";
import {getMobilityNextSteps} from "../src/mobility/next-steps.js";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("Safe candidates retain their acquisition choices, unsafe scenarios do not",()=>{
 for(const input of [
  {environment:"indoor",supportNeed:"steady",canLiftWalker:"yes"},
  {environment:"indoor",supportNeed:"steady",canLiftWalker:"no"},
  {environment:"both",supportNeed:"steady",handBrakes:"yes"}
 ]){
  const r=recommendMobility(input);
  assert.equal(r.status,"candidate");
  assert.ok(getMobilityNextSteps(r).items.length>0);
 }
 for(const input of [
  {environment:"both",supportNeed:"steady",handBrakes:"no"},
  {environment:"indoor",supportNeed:"steady",canLiftWalker:"unknown"},
  {environment:"indoor",supportNeed:"person_assist"}
 ]){
  const r=recommendMobility(input);
  assert.notEqual(r.status,"candidate");
  assert.deepEqual(r.recommendations,[]);
  assert.deepEqual(getMobilityNextSteps(r).items,[]);
 }
});

test("Homepage candidate edit returns to first question and invalidates old offers",()=>{
 const s=read("assets/js/mobility-advisor.js");
 assert.match(s,/data-zp-edit-focus="start"/);
 assert.match(s,/fromStart \? "environment"/);
 assert.match(s,/output\.status === "candidate"/);
 assert.match(s,/Upravit odpovědi a přepočítat výsledek/);
 assert.match(s,/form\.addEventListener\("change", \(\) => \{\s*result\.hidden = true;\s*result\.innerHTML = ""/);
 assert.match(s,/installMobilityProductFitGate\(result\)/);
});

test("Both specialist candidates can edit their answers while maintaining offer gates",()=>{
 for(const name of ["indoor-walker-advisor.js","rollator-advisor.js"]){
  const s=read("assets/js/"+name);
  assert.match(s,/const candidateEdit = out\.status==="candidate"/);
  assert.match(s,/Upravit odpovědi a přepočítat výsledek/);
  assert.ok(s.includes("safeRecoveryMarkup"));
  assert.ok(s.includes("candidateEdit"));
  assert.ok(s.includes('questionName=out.status==="candidate"?"supportNeed":'));
  assert.match(s,/form\.addEventListener\("change", \(\) => \{\s*result\.hidden = true;\s*result\.innerHTML = ""/);
  assert.match(s,/installMobilityProductFitGate\(result\)/);
  assert.match(s,/renderMobilityProductFitGate\(/);
  assert.doesNotMatch(s,/localStorage|sessionStorage|navigator\.sendBeacon|FormData/);
 }
});

test("Edit actions are buttons, never product or merchant shortcuts",()=>{
 for(const name of ["mobility-advisor.js","indoor-walker-advisor.js","rollator-advisor.js"]){
  const s=read("assets/js/"+name);
  const matches=s.split("\n").filter(x=>x.includes("Upravit odpovědi a přepočítat výsledek"));
  assert.equal(matches.length,1);
  assert.ok(matches[0].includes('type="button"'));
  assert.ok(matches[0].includes('data-zp-edit-answers="1"'));
  assert.doesNotMatch(matches[0],/href=|data-zp-merchant-link|affiliate|product_click|merchant_click/);
 }
 assert.match(read("style.css"),/\.zp-fit-locked-offers\[hidden\]\{display:none!important\}/);
});
