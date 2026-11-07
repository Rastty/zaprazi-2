#!/usr/bin/env node
/**
 * Observe a manually deployed WordPress release and, only after strict public
 * integrity checks, request the existing full read-only Production Advisor QA.
 *
 * This never updates WordPress, a Git ref, site content, affiliate data, or
 * Growth Graph safety status. Green here is NOT a production QA pass.
 */
import {fileURLToPath,pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {RELEASE_CHECK_PATHS,verifyReleaseCoherence} from "./audit-live-release-coherence.mjs";

const ORIGIN="https://zaprazi.cz";
const READINESS=ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness";
const REPO="Rastty/zaprazi-2";
const WORKFLOW="production-advisor-qa.yml";
const VERSION=/^\d+\.\d+\.\d+$/;
const SHA=/^[0-9a-f]{40}$/;
const MAX_DISPATCH_ATTEMPTS_PER_SHA=2;

function publicSummary(status,sourceRelease,liveRelease=null){
  const v={status,source_release:sourceRelease};
  if(typeof liveRelease==="string"&&VERSION.test(liveRelease))v.live_release=liveRelease;
  return v;
}

async function getPublic(url,accept,fetchImpl){
  if(url!==READINESS&&!RELEASE_CHECK_PATHS.some(path=>url===ORIGIN+path))
    throw new Error("Unexpected public probe URL");
  const response=await fetchImpl(url,{
    method:"GET",redirect:"error",cache:"no-store",
    headers:{Accept:accept,"Cache-Control":"no-cache"},
    signal:AbortSignal.timeout(20000)
  });
  if(response?.status!==200||response.url&&response.url!==url)
    throw new Error("Public probe failed");
  return response;
}

export function inspectPendingReadiness(data,expected){
  if(!data||typeof data!=="object"||Array.isArray(data)||!VERSION.test(data.release))
    return publicSummary("blocked_invalid_readiness",expected);
  const live=data.release;
  const groups=data.groups;
  const validGroups=groups&&typeof groups==="object"&&!Array.isArray(groups)&&
    Object.keys(groups).length>0&&Object.values(groups).every(group=>
      group&&Number.isSafeInteger(group.total)&&group.total>=0&&
      group.configured===group.total&&Array.isArray(group.missing)&&group.missing.length===0);
  if(data.integrity!=="ok"||data.slot_total!==25||
    data.configured_total!==25||!validGroups)
    return publicSummary("blocked_incomplete_live_integrity",expected,live);
  if(live!==expected)return publicSummary("pending_wp_pull_and_deploy",expected,live);
  return publicSummary("ready_for_full_qa_probe",expected,live);
}

export async function observePublicDeploy(fetchImpl=fetch,expected=SOURCE_THEME_RELEASE){
  if(typeof expected!=="string"||!VERSION.test(expected))
    throw new Error("Invalid source release");
  const before=await (await getPublic(READINESS,"application/json",fetchImpl)).json();
  const pre=inspectPendingReadiness(before,expected);
  if(pre.status!=="ready_for_full_qa_probe")return pre;
  const pages=[];
  for(const path of RELEASE_CHECK_PATHS){
    const html=await (await getPublic(ORIGIN+path,"text/html",fetchImpl)).text();
    pages.push({path,html});
  }
  const after=await (await getPublic(READINESS,"application/json",fetchImpl)).json();
  try {
    const proof=verifyReleaseCoherence({before,after,pages,expected});
    return {...publicSummary("ready_for_full_qa",expected,expected),
      pages:proof.pages,affiliate_slots:proof.affiliate_slots,readiness_checks:proof.readiness_checks};
  }catch {
    // Never echo HTML, HTTP query strings, WordPress responses, or user data.
    return publicSummary("blocked_mixed_or_incomplete_live_release",expected);
  }
}

export function decideDispatch(runs,sha){
  if(!SHA.test(sha)||!Array.isArray(runs))throw new Error("Invalid dispatch history");
  const history=runs.filter(run=>run&&run.event==="workflow_dispatch"&&
    run.head_sha===sha&&run.head_branch==="main");
  if(history.some(run=>run.status==="completed"&&run.conclusion==="success"))
    return "already_verified_for_this_commit";
  if(history.some(run=>run.status==="queued"||run.status==="in_progress"||
    run.status==="waiting"||run.status==="requested"||run.status==="pending"))
    return "already_running_for_this_commit";
  if(history.length>=MAX_DISPATCH_ATTEMPTS_PER_SHA)
    return "manual_review_required_retry_cap";
  return "dispatch_once";
}

function githubHeaders(token){
  return {Authorization:"Bearer "+token,Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28"};
}
async function githubApi(url,options,fetchImpl){
  const response=await fetchImpl(url,{
    ...options,redirect:"error",signal:AbortSignal.timeout(20000)
  });
  if(!response||response.status<200||response.status>=300)
    throw new Error("GitHub Actions API unavailable; no QA dispatch recorded");
  return response;
}

export async function dispatchWhenReady(publicState,options,fetchImpl=fetch){
  if(publicState?.status!=="ready_for_full_qa")
    return "no_dispatch_unverified_public_release";
  const {repo,ref,sha,token}=options??{};
  if(repo!==REPO||ref!=="refs/heads/main"||typeof token!=="string"||token.length<10||
    !SHA.test(sha))throw new Error("Invalid GitHub Actions dispatch context");
  const api="https://api.github.com/repos/"+REPO;
  const headers=githubHeaders(token);

  // A release probe started on an older main commit must not dispatch a QA
  // workflow against a newer, perhaps not-yet-deployed release.
  const currentRef=await (await githubApi(api+"/git/ref/heads/main",
    {method:"GET",headers},fetchImpl)).json();
  if(currentRef?.object?.sha!==sha)return "source_ref_changed_no_dispatch";

  const url=api+"/actions/workflows/"+WORKFLOW+"/runs?event=workflow_dispatch&branch=main&per_page=100";
  const history=await (await githubApi(url,{method:"GET",headers},fetchImpl)).json();
  if(!Array.isArray(history?.workflow_runs))throw new Error("Invalid workflow history");
  const decision=decideDispatch(history.workflow_runs,sha);
  if(decision!=="dispatch_once")return decision;

  await githubApi(api+"/actions/workflows/"+WORKFLOW+"/dispatches",{
    method:"POST",headers:{...headers,"Content-Type":"application/json"},
    body:JSON.stringify({ref:"main"})
  },fetchImpl);
  return "full_production_qa_requested";
}

export async function main(){
  const snapshot=await observePublicDeploy();
  if(snapshot.status!=="ready_for_full_qa"){
    process.stdout.write("ZP_DEPLOY_MONITOR "+JSON.stringify({
      ...snapshot,wordpress_written:false,full_production_qa_passed:false
    })+"\n");
    if(snapshot.status!=="pending_wp_pull_and_deploy")
      process.exitCode=1;
    return;
  }
  const action=await dispatchWhenReady(snapshot,{
    repo:process.env.GITHUB_REPOSITORY,
    ref:process.env.GITHUB_REF,
    sha:process.env.GITHUB_SHA,
    token:process.env.GITHUB_TOKEN
  });
  process.stdout.write("ZP_DEPLOY_MONITOR "+JSON.stringify({
    ...snapshot,action,wordpress_written:false,full_production_qa_passed:false
  })+"\n");
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  main().catch(()=>{
    // Generic error only: no API payload or secret ever enters Actions logs.
    process.stderr.write("ZP_DEPLOY_MONITOR_FAILED: read-only verification or guarded QA request failed.\n");
    process.exitCode=1;
  });
}
