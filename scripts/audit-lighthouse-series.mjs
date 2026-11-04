/**
 * Evidence-first mobile Lighthouse baseline for the live (deployed) Zápraží
 * production URLs. Repeats every page three times, verifies same tool and
 * mobile mode, then reports medians/ranges rather than claiming field CWV.
 *
 * This script does NOT perform browsing, grant tracking consent, touch WP
 * data, send form inputs, or click merchants.
 */
import {readFileSync,writeFileSync,appendFileSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {summarizeLighthouseReport} from "./audit-lighthouse-metrics.mjs";

export const REQUIRED_PATHS=[
  "/",
  "/choditka-pro-seniory/",
  "/koupelna-a-wc/"
];
export const REPEATS=3;

const median=items=>{
  if(!items.length)return null;
  const a=[...items].sort((a,b)=>a-b);
  const m=Math.floor(a.length/2);
  return a.length%2?a[m]:Math.round((a[m-1]+a[m])/2*100)/100;
};
const spread=items=>{
  const values=items.filter(x=>typeof x==="number"&&Number.isFinite(x));
  if(!values.length)return {median:null,min:null,max:null};
  return {median:median(values),min:Math.min(...values),max:Math.max(...values)};
};

export function summarizeRepeatedMobileLighthouse(reports,{liveRelease=null}={}){
  if(liveRelease!==null&&!/^\d+\.\d+\.\d+$/.test(liveRelease))
    throw new Error("Malformed observed production release");
  if(!Array.isArray(reports)||reports.length!==REQUIRED_PATHS.length*REPEATS)
    throw new Error("Expected exactly "+REPEATS+" mobile Lighthouse reports for each of "+REQUIRED_PATHS.length+" fixed public URLs");
  const groups=new Map(REQUIRED_PATHS.map(path=>[path,[]]));
  let version=null;
  for(const report of reports){
    if(report?.configSettings?.formFactor!=="mobile")
      throw new Error("Only explicit mobile Lighthouse reports accepted");
    const data=summarizeLighthouseReport(report);
    if(!groups.has(data.path))
      throw new Error("Unexpected audited path: "+data.path);
    if(version===null) version=data.lighthouse_version;
    if(!version||data.lighthouse_version!==version)
      throw new Error("Lighthouse version drift inside one series");
    if(typeof data.audited_at!=="string"||!Number.isFinite(Date.parse(data.audited_at)))
      throw new Error("Missing audit timestamp");
    if(data.warnings.length)
      throw new Error("Lighthouse emitted warnings for "+data.path+": "+JSON.stringify(data.warnings).slice(0,500));
    if(Object.values(data.metrics).some(n=>n===null))
      throw new Error("Missing numeric Lighthouse metric for "+data.path);
    groups.get(data.path).push(data);
  }
  const pages=[];
  for(const path of REQUIRED_PATHS){
    const rows=groups.get(path);
    if(rows.length!==REPEATS)
      throw new Error("Need "+REPEATS+" measured runs for "+path+"; found "+rows.length);
    const metrics={};
    for(const name of Object.keys(rows[0].metrics)){
      metrics[name]=spread(rows.map(x=>x.metrics[name]));
    }
    const score=spread(rows.map(x=>x.score));
    const first_party_transfer_kb=spread(rows.map(x=>x.requests.first_party_transfer_kb));
    const largeAssets=new Map();
    for(const row of rows){
      for(const asset of row.requests.large_first_party){
        const key=asset.path+"|"+asset.type;
        const old=largeAssets.get(key);
        if(!old||asset.transfer_kb>old.transfer_kb)
          largeAssets.set(key,asset);
      }
    }
    pages.push({
      path,runs:REPEATS,score,metrics,first_party_transfer_kb,
      large_first_party_assets:[...largeAssets.values()].sort((a,b)=>b.transfer_kb-a.transfer_kb).slice(0,8),
      sample_instability:score.max-score.min>=10,
      earliest_run:rows.map(x=>x.audited_at).sort()[0],
      latest_run:rows.map(x=>x.audited_at).sort().at(-1)
    });
  }
  return {
    source:"GitHub Actions, Lighthouse CLI lab with simulated mobile conditions",
    release_context:"Run only against independently deployed production; source release 0.8.195 at creation",
    lighthouse_version:version,
    live_release:liveRelease,
    protocol:"Three independent Lighthouse runs per fixed URL; report median/min/max; never imply a causal speed gain",
    audit_scope:"Read-only pages without granting consent, form submits, merchant clicks or persistent health answers",
    metric_limit:"Not user field p75, not CrUX or INP, not GSC organic clicks, not purchases or approved affiliate commissions",
    pages
  };
}

export function seriesMarkdown(summary){
  const rows=summary.pages.map(p=>
    "| \`"+p.path+"\` | "+p.runs+" | "+p.score.median+" ("+p.score.min+"–"+p.score.max+")"+
    " | "+p.metrics.LCP_ms.median+" | "+p.metrics.FCP_ms.median+
    " | "+p.metrics.TBT_ms.median+" | "+p.metrics.CLS.median+
    " | "+p.first_party_transfer_kb.median+" |"+(p.sample_instability?" ⚠️":"")
  );
  return [
    "### Zápraží — verified repeated mobile Lighthouse laboratory baseline",
    "",
    "Source: Lighthouse "+summary.lighthouse_version+", production release "+(summary.live_release??"unverified")+", **3 real synthetic mobile runs/URL**; medians, score ranges and transfer size.",
    "",
    "| URL | Runs | Score median (range) | LCP median ms | FCP median ms | TBT median ms | CLS median | First-party KB median |",
    "|:--|--:|--:|--:|--:|--:|--:|--:|",
    ...rows,
    "",
    summary.pages.some(p=>p.sample_instability)?"⚠️ Some scores vary by at least 10 points; investigate before making optimization decisions.":"",
    "**Limit:** lab only; does not measure field INP/p75, traffic, consent rate, sales or approved commissions.",
    ""
  ].join("\n");
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const paths=process.argv.slice(2);
  const result=summarizeRepeatedMobileLighthouse(paths.map(file=>JSON.parse(readFileSync(file,"utf8"))),
    {liveRelease:process.env.ZP_LIVE_RELEASE??null});
  if(process.env.ZP_LIGHTHOUSE_SUMMARY_PATH)
    writeFileSync(process.env.ZP_LIGHTHOUSE_SUMMARY_PATH,JSON.stringify(result,null,2)+"\n");
  if(process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,seriesMarkdown(result));
  console.log("LIGHTHOUSE_REPEATABLE_MOBILE",JSON.stringify(result));
}
