import test from "node:test";
import assert from "node:assert/strict";
import {validateDfgThemeEndpoint,inspectDfgCanary} from "../scripts/dfg-canary-preflight.mjs";

const sha="a".repeat(40),other="b".repeat(40),slug="test-theme";
const url="https://zaprazi.cz/wp-json/dfg/v1/package_update?secret=synthetic-test-secret&type=theme&package="+slug;
const inputs={expectedSha:sha,expectedRelease:"0.8.250",acceptedRelease:"0.8.249"};
const ready={status:"ready_for_full_qa",source_release:"0.8.249",live_release:"0.8.249",
  affiliate_slots:25,readiness_checks:2};
const refs=()=>({status:"ready_for_manual_deploy_gate",commit:sha});
const deps={sourceRelease:"0.8.250",readRefs:refs,observe:async()=>ready};

test("official HTTPS theme endpoint format accepted without returning secret",()=>{
  assert.equal(validateDfgThemeEndpoint(url,slug),true);
  assert.equal(validateDfgThemeEndpoint(url.replace("secret=synthetic-test-secret&type=theme","type=theme&secret=synthetic-test-secret"),slug),true);
});

test("reject noncanonical host, protocol, path, slug, type, duplicates and extra parameters",()=>{
  for(const bad of [
    url.replace("https:","http:"),url.replace("zaprazi.cz","www.zaprazi.cz"),
    url.replace("zaprazi.cz","zaprazi.cz.example.org"),
    url.replace("zaprazi.cz","user:pass@zaprazi.cz"),
    url.replace("zaprazi.cz","zaprazi.cz:8080"),
    url.replace("package_update","other"),url+"#fragment",url+"&extra=1",
    url+"&secret=other",url+"&type=theme",url+"&package="+slug,
    url.replace("type=theme","type=plugin"),url.replace("package="+slug,"package=other"),
    url.replace("secret=synthetic-test-secret","secret="),
    url.replace("secret=synthetic-test-secret","secret=%0A"),
    url.replace("secret=synthetic-test-secret","secret=%00"),
    " "+url,null,{}
  ]){
    assert.throws(()=>validateDfgThemeEndpoint(bad,slug),{message:"DFG_CANARY_PREFLIGHT_BLOCKED"});
  }
  assert.throws(()=>validateDfgThemeEndpoint(url,"other"));
  assert.throws(()=>validateDfgThemeEndpoint(url,"../theme"));
});

test("successful read-only candidate binds exact SHA and accepted predecessor without authorization",async()=>{
  const calls=[];
  const result=await inspectDfgCanary(inputs,{...deps,readRefs:()=>{calls.push("refs");return refs();},
    observe:async release=>{calls.push(release);return ready;}});
  assert.deepEqual(calls,["refs","0.8.249","refs"]);
  assert.deepEqual(result,{status:"candidate_readonly_preflight_passed",source_commit:sha,
    source_release:"0.8.250",accepted_predecessor:"0.8.249",wordpress_written:false,
    deploy_endpoint_contacted:false,production_action_authorized:false,full_production_qa_passed:false});
});

test("mismatched release, SHA, downgrade or skipped version blocks before any network observation",async()=>{
  for(const input of [{...inputs,expectedSha:"main"},{...inputs,expectedRelease:"0.8.251"},
    {...inputs,acceptedRelease:"0.8.248"},{...inputs,acceptedRelease:"0.8.251"},
    {...inputs,acceptedRelease:"0.8.250"},{...inputs,acceptedRelease:"0.7.249"}]){
    let count=0;
    await assert.rejects(inspectDfgCanary(input,{...deps,observe:async()=>{count++;return ready;}}));
    assert.equal(count,0);
  }
});

test("moving or unsynchronized refs block before or after public probe",async()=>{
  await assert.rejects(inspectDfgCanary(inputs,{...deps,readRefs:()=>({status:"pending",commit:sha}),
    observe:async()=>{assert.fail("no public probe allowed");}}));
  let n=0;
  await assert.rejects(inspectDfgCanary(inputs,{...deps,readRefs:()=>({status:"ready_for_manual_deploy_gate",
    commit:++n===1?sha:other})}));
});

test("already live target is not a request to redeploy or acceptance",async()=>{
  const r=await inspectDfgCanary(inputs,{...deps,observe:async()=>({
    status:"pending_wp_pull_and_deploy",source_release:"0.8.249",live_release:"0.8.250"})});
  assert.equal(r.status,"target_already_live_requires_acceptance_no_redeploy");
  assert.equal(r.production_action_authorized,false);
  assert.equal(r.full_production_qa_passed,false);
});

test("partial, unexpected or incomplete predecessor evidence is blocked",async()=>{
  for(const observation of [null,{...ready,affiliate_slots:24},{...ready,readiness_checks:1},
    {...ready,source_release:"0.8.248"},{...ready,live_release:"0.8.248"},
    {status:"blocked_mixed_or_incomplete_live_release"},{status:"pending_wp_pull_and_deploy",live_release:"0.8.248"}]){
    const r=await inspectDfgCanary(inputs,{...deps,observe:async()=>observation});
    assert.equal(r.status,"blocked_predecessor_not_publicly_verified");
    assert.equal(r.wordpress_written,false);
  }
});

test("endpoint rejection never echoes private URL or secret",()=>{
  assert.throws(()=>validateDfgThemeEndpoint(url+"&extra=1",slug),err=>{
    assert.equal(err.message,"DFG_CANARY_PREFLIGHT_BLOCKED");
    assert.ok(!err.message.includes("synthetic-test-secret"));
    return true;
  });
});
