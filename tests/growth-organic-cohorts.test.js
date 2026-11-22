import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {METRICS,planGrowth,renderGrowthPlan} from "../scripts/growth-graph.mjs";

const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const graph=read("config/growth-graph.json");
const snapshot=read("config/growth-state.json");
const clone=x=>JSON.parse(JSON.stringify(x));
const date=new Date("2026-11-22T12:00:00Z");

test("real, dated GA4 organic cohort evidence is not counted as 19 decision visits",()=>{
  const p=planGrowth(graph,snapshot,date);
  assert.equal(p.metrics.organic_sessions_28d,19);
  assert.equal(p.metrics.organic_decision_page_sessions_28d,6);
  assert.equal(p.metrics.organic_retired_archive_sessions_28d,11);
  assert.equal(p.metrics.organic_unassigned_sessions_28d,2);
  for(const key of [
    "organic_sessions_28d","organic_decision_page_sessions_28d",
    "organic_retired_archive_sessions_28d","organic_unassigned_sessions_28d"
  ]){
    assert.ok(METRICS.includes(key));
    assert.equal(p.metricAsOf[key],"2026-11-20");
    assert.ok(snapshot.metricSources[key].startsWith("https://github.com/Rastty/zaprazi-2/issues/401"));
  }
  const rendered=renderGrowthPlan(p);
  assert.match(rendered,/31\.58 % \(6 z 19\)/);
  assert.match(rendered,/Retired archive je členství ve starém manifestu/);
  assert.match(rendered,/GSC, GA4/);
  assert.equal(p.metrics.approved_affiliate_commission_28d,null);
  // Production 0.8.246 has now passed the exact postdeploy 14-Advisor
  // Chrome acceptance. The earlier 0.8.245 QA cannot certify this release.
  assert.equal(snapshot.nodes.safety_qa.verifiedRelease,"0.8.246");
  assert.equal(snapshot.nodes.safety_qa.evidenceUrl,
    "https://github.com/Rastty/zaprazi-2/actions/runs/45002528029");
  assert.equal(p.tasks.find(t=>t.id==="safety_qa").status,"verified",
    "Source and independently accepted live release must match");
  const oldProduction=clone(snapshot);
  oldProduction.nodes.safety_qa.verifiedRelease="0.8.245";
  oldProduction.nodes.safety_qa.evidenceUrl=
    "https://github.com/Rastty/zaprazi-2/actions/runs/44896362946";
  assert.equal(planGrowth(graph,oldProduction,date).tasks.find(t=>t.id==="safety_qa").status,
    "needs_revalidation","An older approved QA must never verify new source release");
});

test("GA4 organic cohorts fail closed on more sessions than measured or non-reconciling totals",()=>{
  let bad=clone(snapshot);
  bad.metrics.organic_decision_page_sessions_28d=20;
  assert.throws(()=>planGrowth(graph,bad,date),/cohort cannot exceed/);
  bad=clone(snapshot);
  bad.metrics.organic_decision_page_sessions_28d=7;
  assert.throws(()=>planGrowth(graph,bad,date),/cohorts must reconcile/);
});

test("missing cohort information is UNKNOWN, not an invented zero or engagement rate",()=>{
  const incomplete=clone(snapshot);
  delete incomplete.metrics.organic_unassigned_sessions_28d;
  delete incomplete.metricSources.organic_unassigned_sessions_28d;
  delete incomplete.metricAsOf.organic_unassigned_sessions_28d;
  const p=planGrowth(graph,incomplete,date);
  assert.equal(p.metrics.organic_unassigned_sessions_28d,null);
  assert.match(renderGrowthPlan(p),/Podíl vstupů na rozhodovací stránky: UNKNOWN/);
  assert.doesNotMatch(renderGrowthPlan(p),/31\.58 %/);
});

test("mixed GA4 cohort observation dates cannot create a false qualification rate",()=>{
  const bad=clone(snapshot);
  bad.metricAsOf.organic_decision_page_sessions_28d="2026-11-19";
  assert.throws(()=>planGrowth(graph,bad,date),/must use the same observation date/);
});

test("GA4 aggregate evidence can never contain raw search answers or signed URLs",()=>{
  const bad=clone(snapshot);
  bad.metricSources.organic_decision_page_sessions_28d=
    "https://example.org/report?health=private";
  assert.throws(()=>planGrowth(graph,bad,date),/HTTPS evidence/);
  const extra=clone(snapshot);
  extra.metrics.diagnosis_answer_28d=1;
  extra.metricSources.diagnosis_answer_28d="https://example.org/report";
  assert.throws(()=>planGrowth(graph,extra,date),/Invalid or unsupported aggregate metric/);
});
