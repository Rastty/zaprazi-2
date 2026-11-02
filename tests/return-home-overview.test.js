import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildReturnHomePlan} from "../src/return-home/engine.js";
import {buildReturnHomeChecklist,buildReturnHomeOverview} from "../src/return-home/checklist.js";

const base={
  timing:"within_week",entranceReady:"yes",transferAbility:"independent",
  walking:"independent",toiletReady:"yes",bathroomReady:"yes",bedReady:"yes",
  wheelchairReady:"yes",homeCare:"not_needed"
};

test("critical obstacles remain primary and a three-card overview never replaces any blocker",()=>{
  const plan=buildReturnHomePlan({...base,entranceReady:"no",
    transferAbility:"person_assist",toiletReady:"no",bedReady:"no"});
  const before=JSON.stringify(plan);
  const overview=buildReturnHomeOverview(plan);
  assert.equal(plan.status,"blocked_before_discharge");
  assert.equal(overview.criticalCount,plan.blockers.length);
  assert.ok(plan.blockers.length>=4);
  assert.match(overview.knowledge,/kritických bodů/);
  assert.match(overview.verification,/4 kritické body/);
  assert.ok(overview.verification.includes(plan.blockers[0].label));
  assert.match(overview.verification,/všechny kritické body/);
  assert.ok(overview.action.includes(plan.dischargeActions[0].label));
  assert.equal(JSON.stringify(plan),before,"Overview cannot modify medical or product decision");
  assert.ok(buildReturnHomeChecklist(plan).length>0,"Original full action list remains available");
});

test("unknown practical inputs are not made to sound confirmed",()=>{
  const plan=buildReturnHomePlan({...base,entranceReady:"unknown",
    transferAbility:"unknown",homeCare:"unknown",toiletReady:"unknown"});
  const overview=buildReturnHomeOverview(plan);
  assert.equal(plan.status,"action_plan");
  assert.ok(!/připravenost potvrzená|návrat je bezpečný/i.test(overview.knowledge));
  assert.ok(overview.verification.includes(plan.priorities[0].label));
  assert.ok(overview.action.includes(plan.dischargeActions[0].label));
  assert.match(overview.action,/Nejde o potvrzení zdravotní způsobilosti/);
  assert.equal(overview.criticalCount,0);
});

test("basic confirmed answers still do not become a medical discharge clearance",()=>{
  const plan=buildReturnHomePlan({...base,timing:"later"});
  assert.equal(plan.status,"ready_basic");
  const overview=buildReturnHomeOverview(plan);
  assert.match(overview.knowledge,/základní domácí připravenost/);
  assert.match(overview.verification,/Zdravotní i praktickou připravenost/);
  assert.match(overview.action,/nemocničním týmem/);
  assert.equal(overview.criticalCount,0);
  assert.deepEqual(buildReturnHomeChecklist(plan),[]);
  assert.equal(buildReturnHomeOverview({status:"invalid_input"}),null);
  assert.equal(buildReturnHomeOverview({}),null);
});

test("the rendered three-step summary is accessible, escaped and cannot hide critical decisions",()=>{
  const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
  const script=read("assets/js/return-home-advisor.js");
  const engine=read("src/return-home/engine.js");
  const css=read("style.css");
  const rendering=script.slice(script.indexOf("result.innerHTML = "+String.fromCharCode(96)),
    script.indexOf('track("builder_complete")'));
  const critical=rendering.indexOf('renderItems("Blokuje bezpečný návrat domů"');
  const summary=rendering.indexOf("renderOverview(output)");
  const checklist=rendering.indexOf("renderChecklist(output)");
  assert.ok(critical>=0&&summary>critical&&checklist>summary,
    "Must show ALL blockers first, then short orientation, then full action list");
  assert.match(script,/aria-labelledby="zp-return-overview-title"/);
  for(const heading of ["Co víme z odpovědí","Co ještě ověřit","Co udělat jako první"]){
    assert.ok(script.includes(heading),"Missing three-step heading "+heading);
  }
  for(const prop of ["knowledge","verification","action"]){
    assert.ok(script.includes("escapeHtml(overview."+prop+")"),"Unsafe overview markup: "+prop);
  }
  assert.match(script,/form\.addEventListener\("change", \(\) => \{\s*result\.hidden = true;\s*result\.innerHTML = "";/);
  assert.match(css,/\.zp-decision-grid/);
  assert.match(css,/@media\(max-width:900px\)\{/);
  assert.match(engine,/hasUnresolvedEssentials/);
  assert.doesNotMatch(script,/localStorage|sessionStorage|fetch\(|navigator\.sendBeacon|navigator\.clipboard/);
});
