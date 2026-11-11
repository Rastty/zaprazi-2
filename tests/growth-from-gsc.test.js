import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {planFromFinalGsc,renderFinalGscGrowthPlan} from "../scripts/growth-plan-from-gsc.mjs";

const graph=JSON.parse(readFileSync(new URL("../config/growth-graph.json",import.meta.url),"utf8"));
const state=JSON.parse(readFileSync(new URL("../config/growth-state.json",import.meta.url),"utf8"));
const now=new Date("2026-11-11T11:00:00Z");
const runId="42999955350";
const sample=()=>({
 schemaVersion:1,status:"evidence_available",site:"zaprazi.cz",
 source:"Google Search Console Search Analytics API",
 property:{url:"https://zaprazi.cz/",permission:"siteOwner",hostRestricted:true},
 period:{startDate:"2026-10-12",endDate:"2026-11-08",days:28,
   finalityLagDays:3,dataState:"final",searchType:"web"},
 sitewide:{clicks:8,impressions:928,ctr:8/928,position:20.05},
 trackedPages:[{path:"/choditko-na-pojistovnu/",clicks:1,impressions:58,
   ctr:1/58,position:10.16}],
 queryIntentEvidence:{rawQueries:["NEVER_EXPOSE_RAW_QUERY"],
   pages:[{path:"/choditko-na-pojistovnu/",intents:[]}]} 
});
const clone=x=>JSON.parse(JSON.stringify(x));

test("GSC finalized evidence raises review lane, never rewrites state or re-dates GA4",()=>{
 const local=clone(state);
 local.metrics.merchant_clicks_28d=999;
 local.metricSources.merchant_clicks_28d="https://example.org/some-older-ga4";
 local.asOf="2026-10-01"; // stale unrelated evidence must NOT get refreshed
 const before=JSON.stringify(local);
 const snapshot=sample();
 const p=planFromFinalGsc(graph,local,snapshot,runId,now);
 assert.equal(JSON.stringify(local),before);
 assert.equal(p.evidence.type,"prometheus_final_28d_gsc_only");
 assert.equal(p.evidence.periodStart,"2026-10-12");
 assert.equal(p.evidence.periodEnd,"2026-11-08");
 assert.equal(p.evidence.trackedCanonicalPages,1);
 assert.equal(p.evidence.source,"https://github.com/Rastty/prometheus-growth-os/actions/runs/42999955350");
 assert.equal(p.evidenceFreshness,"fresh");
 assert.equal(p.asOf,"2026-11-08");
 assert.equal(p.metrics.organic_clicks_28d,8);
 assert.equal(p.metrics.organic_impressions_28d,928);
 assert.equal(p.metrics.merchant_clicks_28d,null);
 assert.equal(p.tasks.find(x=>x.id==="intent_evidence").score,98);
 assert.equal(p.tasks.find(x=>x.id==="affiliate_audit").score,84,
   "Cannot promote monetization lane from stale GA4 evidence");
 const text=renderFinalGscGrowthPlan(p);
 assert.match(text,/GSC-only přehled/);
 assert.match(text,/2026-10-12 až 2026-11-08/);
 assert.match(text,/8/);
 assert.doesNotMatch(text,/NEVER_EXPOSE_RAW_QUERY|some-older-ga4/);
});
test("host, age, finality and count mismatches all fail closed without values",()=>{
 const changes=[
  s=>{s.site="outside.example";},
  s=>{s.property.url="https://foreign.example/";},
  s=>{s.property.permission="unverified";},
  s=>{s.period.dataState="partial";},
  s=>{s.period.days=27;},
  s=>{s.period.endDate="2026-11-11";},
  s=>{s.period.startDate="2026-10-01";},
  s=>{s.period.startDate="2026-09-01";s.period.endDate="2026-09-28";},
  s=>{s.sitewide.clicks=9999;},
  s=>{s.trackedPages[0].path="/private-health-secret/";},
  s=>{s.trackedPages[0].ctr=0.95;},
  s=>{s.trackedPages=[];},
  s=>{s.status="no_final_gsc_rows";}
 ];
 for(const change of changes){
  const input=sample();change(input);
  assert.throws(()=>planFromFinalGsc(graph,state,input,runId,now),
    error=>!error.message.includes("foreign.example")&&
      !error.message.includes("private-health-secret")&&
      !error.message.includes("NEVER_EXPOSE_RAW_QUERY"));
 }
 for(const id of ["","a-raw-query","42999955350?token=SECRET","-1234","0","99999999999999999999999"])
  assert.throws(()=>planFromFinalGsc(graph,state,sample(),id,now),
    /Invalid bounded GSC evidence reference/);
});
test("CLI reads private snapshot in memory, emits safe plan and makes no writes",()=>{
 const dir=mkdtempSync(join(tmpdir(),"zp-growth-from-gsc-"));
 try{
  const path=join(dir,"final.json");
  writeFileSync(path,JSON.stringify(sample()));
  const result=spawnSync(process.execPath,["scripts/growth-plan-from-gsc.mjs","--snapshot",path],
    {encoding:"utf8",timeout:12000,env:{...process.env,GITHUB_RUN_ID:runId}});
  // The CLI uses the real current Prague date. Tests run against Nov 2026
  // in CI; static planning API above remains deterministic beyond this date.
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/8/);
  assert.doesNotMatch(result.stdout,/NEVER_EXPOSE_RAW_QUERY/);
  assert.doesNotMatch(result.stderr,/NEVER_EXPOSE_RAW_QUERY/);
  const secret=spawnSync(process.execPath,["scripts/growth-plan-from-gsc.mjs","--snapshot",path],
    {encoding:"utf8",timeout:12000,env:{...process.env,GITHUB_RUN_ID:"INVALID_SECRET"}});
  assert.notEqual(secret.status,0);
  assert.doesNotMatch(secret.stderr,/INVALID_SECRET|NEVER_EXPOSE_RAW_QUERY/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test("overlay cannot issue network calls, WordPress writes or source file updates",()=>{
 const source=readFileSync(new URL("../scripts/growth-plan-from-gsc.mjs",import.meta.url),"utf8");
 for(const forbidden of [/\bfetch\s*\(/,/\bwriteFileSync\b/,/\baxios\b/,/XMLHttpRequest/,
   /wp_update_post/,/wp_remote_post/,/process\.env\.GSC_OAUTH_/])
  assert.doesNotMatch(source,forbidden);
});
