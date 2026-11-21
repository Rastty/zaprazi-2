#!/usr/bin/env node
/**
 * Independent read-only public 0.8.245+ chair-guide acceptance.
 * No WordPress writes, form requests, analytics events, merchant clicks or answers.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {verifyChairMobilityHandoff} from "./auto-postdeploy-qa.mjs";

const URL="https://zaprazi.cz/vstavani-z-kresla-pro-seniora/";
const versions=version=>String(version).split(".").map(Number);

export async function auditLiveChairHandoff(fetchImpl=fetch,expected=SOURCE_THEME_RELEASE){
  if(!/^\d+\.\d+\.\d+$/.test(expected))
    throw new Error("Invalid source release");
  const [major,minor,patch]=versions(expected);
  if(major===0&&minor===8&&patch<245)
    return {status:"not_applicable",source_release:expected,wordpress_written:false};
  const response=await fetchImpl(URL,{
    method:"GET",redirect:"error",cache:"no-store",
    headers:{Accept:"text/html","Cache-Control":"no-cache"},
    signal:AbortSignal.timeout(20000)
  });
  if(response?.status!==200||response.url&&response.url!==URL)
    throw new Error("Chair page is not an exact public HTTP 200");
  verifyChairMobilityHandoff(await response.text(),expected);
  return {status:"verified",source_release:expected,
    chair_mobility_handoff:"verified",wordpress_written:false};
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  auditLiveChairHandoff().then(result=>{
    process.stdout.write("ZP_LIVE_CHAIR_HANDOFF "+JSON.stringify(result)+"\n");
  }).catch(()=>{
    // Do not echo actual HTML, URLs, answers or injected text into CI.
    process.stderr.write("ZP_LIVE_CHAIR_HANDOFF_FAILED: exact deployed release or safe chair-to-Mobility action missing.\n");
    process.exitCode=1;
  });
}
