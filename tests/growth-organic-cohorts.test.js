import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {METRICS,planGrowth,renderGrowthPlan} from "../scripts/growth-graph.mjs";

const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const graph=read("config/growth-graph.json");
const snapshot=read("config/growth-state.json");
const clone=x=>JSON.parse(JSON.stringify(x));
const date=new Date("2026-11-22T12:00:00Z");

test("newest finalized 28-day GSC sitewide snapshot retains exact source and date",()=>{
  const p=planGrowth(graph,snapshot,date);
  assert.equal(p.metrics.organic_clicks_28d,16);
  assert.equal(p.metrics.organic_impressions_28d,1529);
  for(const key of ["organic_clicks_28d","organic_impressions_28d"]){
    assert.equal(p.metricAsOf[key],"2026-11-19");
    assert.equal(snapshot.metricSources[key],
      "https://github.com/Rastty/prometheus-growth-os/actions/runs/45004223794");
  }
  // GSC pages and GA4 Organic Search sessions have different reporting
  // universes; no retired-archive inference from sitewide totals.
  assert.equal(p.metrics.organic_sessions_28d,19);
  assert.equal(p.metrics.organic_decision_page_sessions_28d,6);
  assert.equal(p.metrics.approved_affiliate_commission_28d,null);
});

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
  // 0.8.248 is verified only by its exact independent postdeploy acceptance.
  // Future or older source versions must never inherit the current QA.
  assert.equal(snapshot.nodes.safety_qa.verifiedRelease,"0.8.248");
  assert.equal(snapshot.nodes.safety_qa.evidenceUrl,
    "https://github.com/Rastty/zaprazi-2/actions/runs/45048858868");
  assert.equal(p.tasks.find(t=>t.id==="safety_qa").status,
    p.sourceRelease==="0.8.248"?"verified":"needs_revalidation",
    "Production acceptance is version-scoped");
  assert.equal(planGrowth(graph,snapshot,date,"0.8.248").tasks.find(t=>t.id==="safety_qa").status,
    "verified","Exact accepted source release is independently verified");
  assert.equal(planGrowth(graph,snapshot,date,"0.8.249").tasks.find(t=>t.id==="safety_qa").status,
    "needs_revalidation","A future release must never inherit 0.8.248 live QA");
  assert.equal(planGrowth(graph,snapshot,date,"0.8.247").tasks.find(t=>t.id==="safety_qa").status,
    "needs_revalidation","Older version must not claim acceptance of current live source");
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
