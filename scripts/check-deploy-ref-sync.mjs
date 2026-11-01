#!/usr/bin/env node
/**
 * Read-only deploy preflight: require the canonical GitHub main/dev refs and
 * the local checkout to point to the same immutable commit.
 * No WordPress access, ref updates, credentials or deploy actions.
 */
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

const REPO="https://github.com/Rastty/zaprazi-2.git";
const REF_NAMES=new Set(["refs/heads/main","refs/heads/dev"]);
const SHA=/^[0-9a-f]{40}$/;

export function verifyDeployRefs(remoteText,localHead){
  if(typeof remoteText!=="string"||typeof localHead!=="string")
    throw new Error("Invalid deploy ref evidence");
  const refs=new Map();
  for(const line of remoteText.trim().split(/\r?\n/)){
    const match=/^([0-9a-f]{40})\t(refs\/heads\/(?:main|dev))$/.exec(line);
    if(!match||!REF_NAMES.has(match[2])||refs.has(match[2]))
      throw new Error("Missing, duplicate or malformed remote release ref");
    refs.set(match[2],match[1]);
  }
  const main=refs.get("refs/heads/main"),dev=refs.get("refs/heads/dev");
  if(!main||!dev)throw new Error("Both canonical main and dev refs are required");
  if(main!==dev)
    throw new Error("PENDING_RELEASE_SYNC: main and dev point to different commits");
  const head=localHead.trim();
  if(!SHA.test(head)||head!==main)
    throw new Error("PENDING_RELEASE_SYNC: local checkout is not the release commit");
  return {status:"ready_for_manual_deploy_gate",commit:main,branches:["main","dev"],
    note:"Ref sync alone does not prove CI, WordPress deploy or production acceptance"};
}

function git(args){
  return execFileSync("git",args,{encoding:"utf8",timeout:20000,maxBuffer:16384,
    stdio:["ignore","pipe","pipe"]});
}

export function runDeployPreflight(){
  let remote,head;
  try{
    remote=git(["ls-remote","--heads",REPO,"refs/heads/main","refs/heads/dev"]);
    head=git(["rev-parse","HEAD"]);
  }catch{
    throw new Error("Unable to read canonical GitHub refs and local HEAD; deploy blocked");
  }
  return verifyDeployRefs(remote,head);
}

if(process.argv[1]&&import.meta.url===new URL("file://"+resolve(process.argv[1])).href){
  try{
    if(process.argv.length!==2)throw new Error("Usage: node scripts/check-deploy-ref-sync.mjs");
    console.log("ZP_DEPLOY_REF_PREFLIGHT",JSON.stringify(runDeployPreflight()));
  }catch(error){
    console.error("ZP_DEPLOY_REF_PREFLIGHT_BLOCKED",error.message);
    process.exitCode=1;
  }
}
