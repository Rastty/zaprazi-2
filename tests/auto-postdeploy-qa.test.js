import test from "node:test";
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE} from "../scripts/lib/live-release.mjs";
import {RELEASE_CHECK_PATHS} from "../scripts/audit-live-release-coherence.mjs";
import {inspectPendingReadiness,observePublicDeploy,decideDispatch,
  dispatchWhenReady} from "../scripts/auto-postdeploy-qa.mjs";

const origin="https://zaprazi.cz";
const readinessUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const sha="a".repeat(40),token="test-mocked-placeholder-not-real";
const readiness=(release=SOURCE_THEME_RELEASE)=>({
  release,integrity:"ok",slot_total:25,configured_total:25,
  groups:{mobility:{total:3,configured:3,missing:[]},bathroom:{total:22,configured:22,missing:[]}}
});
const html=(release=SOURCE_THEME_RELEASE,integrity="ok")=>
  '<!doctype html><head><meta name="zaprazi-release" content="'+release+
  '"><meta name="zaprazi-integrity" content="'+integrity+'"></head>';
const historicalRun=(status="completed",conclusion="success",head_sha=sha)=>({
  event:"workflow_dispatch",head_branch:"main",head_sha,status,conclusion
});

test("old 0.8.198 live is a pending deploy, never an accepted 0.8.199",async()=>{
  const observed=[];
  const fetchMock=async(url,options)=>{
    observed.push({url,options});
    return {status:200,url,json:async()=>readiness("0.8.198")};
  };
  const state=await observePublicDeploy(fetchMock,"0.8.199");
  assert.deepEqual(state,{status:"pending_wp_pull_and_deploy",
    source_release:"0.8.199",live_release:"0.8.198"});
  assert.equal(observed.length,1,"Do not probe all pages or request QA before deploy");
  assert.equal(observed[0].url,readinessUrl);
  assert.equal(observed[0].options.method,"GET");
  assert.equal(observed[0].options.redirect,"error");
  assert.equal(await dispatchWhenReady(state,{}),"no_dispatch_unverified_public_release");
});

test("only exact 0.8.199 across two 25/25 readiness reads and four pages becomes QA-ready",async()=>{
  const called=[];
  const fetchMock=async(url,options)=>{
    called.push({url,options});
    return {status:200,url,
      json:async()=>readiness("0.8.199"),text:async()=>html("0.8.199")};
  };
  const state=await observePublicDeploy(fetchMock,"0.8.199");
  assert.deepEqual(state,{status:"ready_for_full_qa",source_release:"0.8.199",
    live_release:"0.8.199",pages:4,affiliate_slots:25,readiness_checks:2});
  assert.deepEqual(called.map(c=>c.url),[
    readinessUrl,...RELEASE_CHECK_PATHS.map(p=>origin+p),readinessUrl
  ]);
  assert.ok(called.every(c=>c.options.method==="GET"&&c.options.redirect==="error"));
  assert.ok(called.every(c=>!c.url.includes("?")));
  assert.ok(called.every(c=>c.url.startsWith(origin)));
});

test("partial, misconfigured, duplicate or mixed release never unlocks a QA request",async()=>{
  for(const data of [
    {...readiness("0.8.199"),integrity:"partial"},
    {...readiness("0.8.199"),configured_total:24},
    {...readiness("0.8.199"),groups:{mobility:{total:3,configured:2,missing:["one"]}}},
    {...readiness("0.8.199"),release:"evil-token-or-health-payload"},
    null
  ]) {
    const safe=inspectPendingReadiness(data,"0.8.199");
    assert.ok(safe.status.startsWith("blocked"));
    assert.ok(!JSON.stringify(safe).includes("evil-token"));
  }
  let count=0;
  const mixed=await observePublicDeploy(async url=>{
    count++;
    return {status:200,url,
      json:async()=>readiness("0.8.199"),
      text:async()=>html(count===3?"0.8.198":"0.8.199")};
  },"0.8.199");
  assert.equal(mixed.status,"blocked_mixed_or_incomplete_live_release");
  assert.equal(await dispatchWhenReady(mixed,{}),"no_dispatch_unverified_public_release");

  let second=0;
  const changing=await observePublicDeploy(async url=>({
    status:200,url,
    json:async()=>readiness(++second===1?"0.8.199":"0.8.198"),
    text:async()=>html("0.8.199")
  }),"0.8.199");
  assert.equal(changing.status,"blocked_mixed_or_incomplete_live_release");
});

test("public probes reject redirects and HTTP errors instead of trusting HTML",async()=>{
  for(const response of [{status:302},{status:500},
    {status:200,url:"https://untrusted.example/redirect",json:async()=>readiness()}]) {
    await assert.rejects(()=>observePublicDeploy(async()=>response,"0.8.199"));
  }
});

test("dispatch dedupe refuses success, active runs or more than two failed attempts",()=>{
  assert.equal(decideDispatch([],sha),"dispatch_once");
  assert.equal(decideDispatch([historicalRun()],sha),"already_verified_for_this_commit");
  for(const status of ["queued","in_progress","waiting","requested","pending"]){
    assert.equal(decideDispatch([historicalRun(status,null)],sha),
      "already_running_for_this_commit");
  }
  assert.equal(decideDispatch([historicalRun("completed","failure")],sha),"dispatch_once");
  assert.equal(decideDispatch([historicalRun("completed","failure"),
    historicalRun("completed","failure")],sha),"manual_review_required_retry_cap");
  const different=historicalRun("completed","success","b".repeat(40));
  assert.equal(decideDispatch([different],sha),"dispatch_once");
  assert.throws(()=>decideDispatch([],"not-sha"));
});

test("dispatch checks current main SHA and prior workflow_dispatch runs; never writes WordPress",async()=>{
  const urls=[],body=[];
  const api="https://api.github.com/repos/Rastty/zaprazi-2";
  const githubFetch=async(url,opts)=>{
    urls.push(url);
    assert.ok(url.startsWith(api+"/"));
    assert.ok(opts.headers.Authorization.startsWith("Bearer "));
    if(opts.method==="POST")body.push(JSON.parse(opts.body));
    if(url.endsWith("/git/ref/heads/main"))return {
      status:200,json:async()=>({object:{sha}})};
    if(url.includes("/runs?"))return {
      status:200,json:async()=>({workflow_runs:[]})};
    return {status:204};
  };
  const input={status:"ready_for_full_qa"};
  const options={repo:"Rastty/zaprazi-2",ref:"refs/heads/main",sha,token};
  assert.equal(await dispatchWhenReady(input,options,githubFetch),
    "full_production_qa_requested");
  assert.deepEqual(body,[{ref:"main"}]);
  assert.equal(urls.length,3);
  assert.equal(urls[2],api+"/actions/workflows/production-advisor-qa.yml/dispatches");

  const stale=await dispatchWhenReady(input,options,async(url)=>({
    status:200,json:async()=>({object:{sha:"b".repeat(40)}})
  }));
  assert.equal(stale,"source_ref_changed_no_dispatch");
  await assert.rejects(()=>dispatchWhenReady(input,{...options,ref:"refs/heads/dev"},
    githubFetch),/Invalid GitHub Actions/);
  await assert.rejects(()=>dispatchWhenReady(input,{...options,sha:"not valid"},
    githubFetch),/Invalid GitHub Actions/);
});

test("a prior success never repeats automated QA, even if the public release is ready",async()=>{
  const requests=[],input={status:"ready_for_full_qa"};
  const result=await dispatchWhenReady(input,{
    repo:"Rastty/zaprazi-2",ref:"refs/heads/main",sha,token
  },async(url,opts)=>{
    requests.push(opts.method);
    if(url.endsWith("/git/ref/heads/main"))
      return {status:200,json:async()=>({object:{sha}})};
    return {status:200,json:async()=>({workflow_runs:[historicalRun()]})};
  });
  assert.equal(result,"already_verified_for_this_commit");
  assert.deepEqual(requests,["GET","GET"]);
});
