#!/usr/bin/env node
/**
 * Read-only candidate preflight for Deployer for Git (issue #948).
 * No deploy endpoint access, secret read, Git write, QA dispatch or authorization.
 * Reuses the native exact public feature probe and main/dev preflight.
 */
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {runDeployPreflight} from "./check-deploy-ref-sync.mjs";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {observePublicDeploy} from "./auto-postdeploy-qa.mjs";

const SHA=/^[0-9a-f]{40}$/;
const VERSION=/^\d+\.\d+\.\d+$/;
const ORIGIN="https://zaprazi.cz";
const ROUTE="/wp-json/dfg/v1/package_update";
const reject=()=>{throw new Error("DFG_CANARY_PREFLIGHT_BLOCKED");};

/** Offline format validation only. The caller must independently verify the
 * installed slug and configured branch in the WordPress administrator UI.
 * Never return or print the URL, secret, or offending input. */
export function validateDfgThemeEndpoint(value,approvedSlug){
  if(typeof value!=="string"||value.length>4096||value.trim()!==value||
    /[\s\\]/u.test(value)||typeof approvedSlug!=="string"||
    !/^[a-z0-9][a-z0-9_-]{0,127}$/.test(approvedSlug))reject();
  let u;
  try{u=new URL(value);}catch{reject();}
  if(u.origin!==ORIGIN||u.username||u.password||u.hash||u.pathname!==ROUTE)reject();
  // Reject duplicate and unexpected parameters, even when values agree.
  if([...u.searchParams.keys()].length!==3||
    ["secret","type","package"].some(k=>u.searchParams.getAll(k).length!==1)||
    u.searchParams.get("type")!=="theme"||u.searchParams.get("package")!==approvedSlug||
    !u.searchParams.get("secret")?.trim()||/[\s\x00-\x1f\x7f]/u.test(u.searchParams.get("secret")))reject();
  return true;
}

const summary=(status,sha,target,predecessor)=>({
  status,source_commit:sha,source_release:target,accepted_predecessor:predecessor,
  wordpress_written:false,deploy_endpoint_contacted:false,production_action_authorized:false,
  full_production_qa_passed:false
});

export async function inspectDfgCanary({expectedSha,expectedRelease,acceptedRelease},
  {sourceRelease=SOURCE_THEME_RELEASE,readRefs=runDeployPreflight,
   observe=release=>observePublicDeploy(fetch,release)}={}){
  if(typeof expectedSha!=="string"||!SHA.test(expectedSha)||
    typeof expectedRelease!=="string"||!VERSION.test(expectedRelease)||
    expectedRelease!==sourceRelease||typeof acceptedRelease!=="string"||
    !VERSION.test(acceptedRelease)||acceptedRelease===expectedRelease)reject();
  // Current pilot permits only a single patch successor, never downgrade or jump.
  const a=acceptedRelease.split(".").map(Number),b=expectedRelease.split(".").map(Number);
  if(![...a,...b].every(Number.isSafeInteger)||a[0]!==b[0]||a[1]!==b[1]||b[2]!==a[2]+1)reject();
  const checkRefs=()=>{
    const r=readRefs();
    if(r?.status!=="ready_for_manual_deploy_gate"||r.commit!==expectedSha)reject();
  };
  checkRefs();
  const live=await observe(acceptedRelease);
  checkRefs();
  if(live?.live_release===expectedRelease&&live.status==="pending_wp_pull_and_deploy")
    return summary("target_already_live_requires_acceptance_no_redeploy",expectedSha,expectedRelease,acceptedRelease);
  if(live?.status!=="ready_for_full_qa"||live.source_release!==acceptedRelease||
    live.live_release!==acceptedRelease||live.affiliate_slots!==25||live.readiness_checks!==2)
    return summary("blocked_predecessor_not_publicly_verified",expectedSha,expectedRelease,acceptedRelease);
  return summary("candidate_readonly_preflight_passed",expectedSha,expectedRelease,acceptedRelease);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{
    if(process.argv.length!==4)reject();
    const graph=JSON.parse(readFileSync(new URL("../config/growth-state.json",import.meta.url),"utf8"));
    if(graph.nodes?.safety_qa?.status!=="verified"||!graph.nodes.safety_qa.evidenceUrl)reject();
    const result=await inspectDfgCanary({expectedSha:process.argv[2],expectedRelease:process.argv[3],
      acceptedRelease:graph.nodes.safety_qa.verifiedRelease});
    console.log("ZP_DFG_CANARY_PREFLIGHT",JSON.stringify(result));
    if(result.status!=="candidate_readonly_preflight_passed")process.exitCode=1;
  }catch{
    console.error("ZP_DFG_CANARY_PREFLIGHT_BLOCKED: no deploy or authorization");
    process.exitCode=1;
  }
}
