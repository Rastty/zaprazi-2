import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateGraph,planGrowth,renderGrowthPlan,growthCli} from "../scripts/growth-graph.mjs";
const graph=JSON.parse(readFileSync(new URL("../config/growth-graph.json",import.meta.url),"utf8"));
const blank={schemaVersion:1,asOf:null,metrics:{},metricSources:{},nodes:{}};
const clone=x=>JSON.parse(JSON.stringify(x));
test("real growth graph is a prerequisite DAG with explicit feedback loops",()=>{
  assert.equal(validateGraph(graph),graph);
  assert.ok(graph.feedbackEdges.some(x=>x.from==="review_learning"&&x.to==="intent_evidence"));
  assert.throws(()=>validateGraph({...graph,nodes:graph.nodes.map(x=>
    x.id==="safety_qa"?{...x,dependsOn:["conversion_ux"]}:x)}),/Cycle/);
  assert.throws(()=>validateGraph({...graph,nodes:[...graph.nodes,{...graph.nodes[0]}]}),/duplicate/i);
});
test("missing evidence is unknown and no monetization can leapfrog safety gate",()=>{
  const p=planGrowth(graph,blank);
  assert.equal(p.metrics.organic_clicks_28d,null);
  assert.equal(p.tasks.find(x=>x.id==="affiliate_audit").status,"waiting_dependencies");
  assert.equal(p.tasks.find(x=>x.id==="conversion_ux").status,"waiting_dependencies");
  assert.ok(p.next.some(x=>x.id==="safety_qa"));
  assert.match(renderGrowthPlan(p),/UNKNOWN/);
  assert.match(growthCli([]),/Growth Graph/);
});
test("verified dependencies unlock affiliate review but only with source-backed evidence",()=>{
  const s=clone(blank);
  s.nodes.safety_qa={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/pull/503"};
  assert.equal(planGrowth(graph,s).tasks.find(x=>x.id==="affiliate_audit").status,"ready");
  assert.equal(planGrowth(graph,s).tasks.find(x=>x.id==="conversion_ux").status,"waiting_dependencies");
  s.nodes.affiliate_audit={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/issues/509"};
  assert.equal(planGrowth(graph,s).tasks.find(x=>x.id==="conversion_ux").status,"ready");
  s.nodes.affiliate_audit.evidenceUrl="";
  assert.throws(()=>planGrowth(graph,s),/HTTPS evidence/);
});
test("verified downstream nodes cannot bypass unverified safety or evidence prerequisites",()=>{
  const s=clone(blank);
  s.nodes.conversion_ux={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/pull/519"};
  assert.throws(()=>planGrowth(graph,s),/Verified node requires verified dependencies: conversion_ux/);
  s.nodes.safety_qa={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/pull/519"};
  assert.throws(()=>planGrowth(graph,s),/conversion_ux -> affiliate_audit/);
  s.nodes.affiliate_audit={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/pull/519"};
  assert.equal(planGrowth(graph,s).tasks.find(x=>x.id==="conversion_ux").status,"verified");

  const content=clone(blank);
  content.nodes.content_upgrade={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/pull/513"};
  assert.throws(()=>planGrowth(graph,content),/content_upgrade -> intent_evidence/);
  content.nodes.intent_evidence={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/pull/513"};
  assert.equal(planGrowth(graph,content).tasks.find(x=>x.id==="content_upgrade").status,"verified");
});
test("evidence-backed aggregate data may raise review priority without inventing sales",()=>{
  const s=clone(blank);
  s.asOf="2026-10-29";
  s.metrics={merchant_clicks_28d:24,approved_affiliate_commission_28d:0,organic_impressions_28d:105};
  s.metricSources={
    merchant_clicks_28d:"https://example.org/ga4-aggregates",
    approved_affiliate_commission_28d:"https://example.org/affiliate-approved",
    organic_impressions_28d:"https://example.org/gsc-summary"
  };
  const p=planGrowth(graph,s);
  assert.equal(p.tasks.find(x=>x.id==="affiliate_audit").score,92);
  assert.equal(p.tasks.find(x=>x.id==="intent_evidence").score,98);
  assert.equal(p.metrics.organic_clicks_28d,null);
  assert.equal(p.tasks.find(x=>x.id==="affiliate_audit").status,"waiting_dependencies");
  delete s.metricSources.merchant_clicks_28d;
  assert.throws(()=>planGrowth(graph,s),/evidence/);
  s.metricSources.merchant_clicks_28d="https://example.org/ga4-aggregates";
  s.metrics.patient_diagnosis=3;
  assert.throws(()=>planGrowth(graph,s),/unsupported/);
});
test("public growth evidence links reject tokens, credentials and malformed HTTPS",()=>{
  const s=clone(blank);
  s.asOf="2026-10-31";
  s.metrics.organic_clicks_28d=12;
  s.metricSources.organic_clicks_28d="https://example.org/gsc/aggregate-report";
  assert.equal(planGrowth(graph,s).metrics.organic_clicks_28d,12);
  for(const unsafe of [
    "https://", "https://user:secret@example.org/report",
    "https://example.org/report?access_token=private",
    "https://example.org/report#patient-answer",
    "https://example.org/report\nleak", "http://example.org/report"
  ]){
    s.metricSources.organic_clicks_28d=unsafe;
    assert.throws(()=>planGrowth(graph,s),/HTTPS evidence/);
  }
  delete s.metrics.organic_clicks_28d;
  delete s.metricSources.organic_clicks_28d;
  s.nodes.safety_qa={status:"verified",evidenceUrl:"https://github.com/Rastty/zaprazi-2/actions/runs/123"};
  assert.equal(planGrowth(graph,s).tasks.find(x=>x.id==="safety_qa").status,"verified");
  s.nodes.safety_qa.evidenceUrl="https://github.com/Rastty/zaprazi-2/actions/runs/123?token=secret";
  assert.throws(()=>planGrowth(graph,s),/HTTPS evidence/);
});
test("28-day evidence must be dated and event counts must be whole numbers",()=>{
  const s=clone(blank);
  s.metrics.organic_clicks_28d=12;
  s.metricSources.organic_clicks_28d="https://example.org/gsc-aggregate";
  assert.throws(()=>planGrowth(graph,s),/observation date/);
  s.asOf="2026-10-31";
  assert.equal(planGrowth(graph,s).metrics.organic_clicks_28d,12);
  for(const invalid of [0.5,12.5,Number.MAX_SAFE_INTEGER+1]){
    s.metrics.organic_clicks_28d=invalid;
    assert.throws(()=>planGrowth(graph,s),/Invalid or unsupported aggregate metric/);
  }
  s.metrics.organic_clicks_28d=12;
  s.metrics.approved_affiliate_commission_28d=18.75;
  s.metricSources.approved_affiliate_commission_28d="https://example.org/affiliate-approved";
  assert.equal(planGrowth(graph,s).metrics.approved_affiliate_commission_28d,18.75);
  delete s.metrics.organic_clicks_28d;
  delete s.metricSources.organic_clicks_28d;
  assert.equal(planGrowth(graph,s).metrics.organic_clicks_28d,null);
  delete s.metrics.approved_affiliate_commission_28d;
  delete s.metricSources.approved_affiliate_commission_28d;
  s.asOf=null;
  assert.equal(planGrowth(graph,s).metrics.organic_clicks_28d,null);
});
test("malformed states and unknown nodes fail closed",()=>{
  const s=clone(blank);
  s.nodes.affiliate_audit={status:"verified"};
  assert.throws(()=>planGrowth(graph,s),/HTTPS evidence/);
  s.nodes.not_a_node={status:"pending"};
  assert.throws(()=>planGrowth(graph,s),/Unknown state node/);
  assert.throws(()=>growthCli(["--ignored"]),/Usage/);
});
