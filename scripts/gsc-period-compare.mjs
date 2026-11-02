#!/usr/bin/env node
/**
 * Local-only, read-only comparison of two *equally long, non-overlapping*
 * Search Console "Pages" CSV exports. No GA4 join, WordPress or API writes.
 *
 * Example:
 * node scripts/gsc-period-compare.mjs \
 *   --before-pages /private/gsc/pages-before.csv --before-from 2026-09-07 --before-to 2026-10-04 \
 *   --after-pages /private/gsc/pages-after.csv --after-from 2026-10-05 --after-to 2026-11-01
 *
 * Export both from the same verified GSC property with the same filters.
 * CSVs do not prove property identity, query attribution or traffic causality.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {parseGscCsv} from "./lib/gsc-prioritization.mjs";
import {requiredDecisionPaths} from "./audit-public-sitemap.mjs";

const CORE=new Set(["/",...requiredDecisionPaths]);
const DAY=86_400_000;
const flags=new Set(["--before-pages","--before-from","--before-to",
  "--after-pages","--after-from","--after-to"]);
const fmt=n=>new Intl.NumberFormat("cs-CZ").format(n);
const signed=n=>(n>0?"+":"")+fmt(n);
const percent=n=>n===null?"n/a":(100*n).toLocaleString("cs-CZ",{maximumFractionDigits:2})+" %";
const safePath=s=>CORE.has(s)?s:"unlisted_path";

function day(date) {
  if(typeof date!=="string"||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))
    throw new Error("Invalid ISO date");
  const time=Date.parse(date+"T00:00:00Z");
  if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==date)
    throw new Error("Invalid ISO date");
  return time;
}
function days(from,to) {
  const start=day(from),end=day(to);
  const length=(end-start)/DAY+1;
  if(length<1||length>366)throw new Error("Invalid GSC interval");
  return {start,end,length};
}
function known(rows) {
  if(!Array.isArray(rows)||!rows.length)throw new Error("GSC Pages export is required");
  const filtered=new Map();
  for(const row of rows) {
    // Neither unknown URL paths nor search parameters may be echoed in reports.
    if(!CORE.has(row.path))continue;
    if(filtered.has(row.path))throw new Error("Duplicate canonical page in GSC export");
    if(!Number.isSafeInteger(row.clicks)||!Number.isSafeInteger(row.impressions)||
      row.clicks<0||row.impressions<0||row.clicks>row.impressions||
      !Number.isFinite(row.position)||row.position<0)
      throw new Error("Invalid GSC page metrics");
    filtered.set(row.path,row);
  }
  return filtered;
}

/** Only matched, allowlisted page rows are compared. Missing CSV rows are UNKNOWN. */
export function compareGscPeriods({before,after,beforeFrom,beforeTo,afterFrom,afterTo}) {
  const oldPeriod=days(beforeFrom,beforeTo),newPeriod=days(afterFrom,afterTo);
  if(oldPeriod.length!==newPeriod.length)
    throw new Error("Compare equal-length GSC export periods only");
  if(newPeriod.start<=oldPeriod.end)
    throw new Error("Current GSC export must start after baseline period");
  const oldPages=known(before),newPages=known(after);
  const matched=[],baselineOnly=[],currentOnly=[];
  for(const [path,b] of oldPages) {
    const a=newPages.get(path);
    if(!a){baselineOnly.push(path);continue;}
    matched.push({
      path,baselineClicks:b.clicks,currentClicks:a.clicks,
      baselineImpressions:b.impressions,currentImpressions:a.impressions,
      deltaClicks:a.clicks-b.clicks,deltaImpressions:a.impressions-b.impressions,
      baselineCtr:b.ctr,currentCtr:a.ctr,
      baselinePosition:b.position,currentPosition:a.position
    });
  }
  for(const path of newPages.keys())if(!oldPages.has(path))currentOnly.push(path);
  // Lost clicks first (review, not attribution), then largest additional search
  // visibility. Scores never trigger indexation, redirects or publication.
  matched.sort((a,b)=>a.deltaClicks-b.deltaClicks||
    b.deltaImpressions-a.deltaImpressions||a.path.localeCompare(b.path));
  return {
    beforeFrom,beforeTo,afterFrom,afterTo,periodDays:oldPeriod.length,
    matched,baselineOnly:baselineOnly.sort(),currentOnly:currentOnly.sort(),
    ignoredBefore:before.length-oldPages.size,
    ignoredAfter:after.length-newPages.size,
    matchedTotals:matched.reduce((acc,r)=>({
      beforeClicks:acc.beforeClicks+r.baselineClicks,
      afterClicks:acc.afterClicks+r.currentClicks,
      beforeImpressions:acc.beforeImpressions+r.baselineImpressions,
      afterImpressions:acc.afterImpressions+r.currentImpressions
    }),{beforeClicks:0,afterClicks:0,beforeImpressions:0,afterImpressions:0})
  };
}
function recommendation(row) {
  if(row.deltaClicks<0) return "Prověřit pokles: dotazy pro tuto URL, SERP a indexaci; nevyvozovat příčinu";
  if(row.deltaImpressions>0&&row.currentImpressions>=100&&
    row.currentCtr!==null&&row.currentCtr<0.02)
    return "Více zobrazení, nízké CTR: prověřit záměr a snippet";
  return "Zkontrolovat změnu záměru, jinak sledovat";
}
export function renderGscComparison(r) {
  const table=[
    "| Hlavní URL | Kliky dříve → nyní | Rozdíl kliků | Zobrazení dříve → nyní | Rozdíl zobrazení | CTR dříve → nyní | Co ověřit |",
    "|---|---:|---:|---:|---:|---:|---|",
    ...r.matched.slice(0,10).map(x=>"| "+safePath(x.path)+" | "+fmt(x.baselineClicks)+
      " → "+fmt(x.currentClicks)+" | "+signed(x.deltaClicks)+" | "+
      fmt(x.baselineImpressions)+" → "+fmt(x.currentImpressions)+" | "+
      signed(x.deltaImpressions)+" | "+percent(x.baselineCtr)+" → "+
      percent(x.currentCtr)+" | "+recommendation(x)+" |")
  ];
  if(!r.matched.length)table.push("| — | — | — | — | — | — | Žádná bezpečně párovatelná hlavní URL |");
  const paths=items=>items.length?items.slice(0,20).map(s=>"- "+safePath(s)).join("\n"):"Žádné.";
  return [
    "# Zápraží — srovnání dvou období GSC (pouze hlavní URL)",
    "**Dříve:** "+r.beforeFrom+" až "+r.beforeTo+"; **nyní:** "+r.afterFrom+
      " až "+r.afterTo+" ("+r.periodDays+" kalendářních dní v každém období).",
    "**Bezpečně párované hlavní stránky:** "+r.matched.length+
      ". Mimo schválené hlavní URL / parametrické / jiné hosty: "+
      r.ignoredBefore+" dříve, "+r.ignoredAfter+" nyní.",
    "## 10 prioritních kontrol podle změny kliků\n"+table.join("\n"),
    "## Pouze v dřívějším exportu — nynější výkon UNKNOWN\n"+paths(r.baselineOnly),
    "## Pouze v novějším exportu — dřívější výkon UNKNOWN\n"+paths(r.currentOnly),
    "## Hranice důkazu\n"+
      "- CSV exporty mohou být omezené; součet párovaných URL není výkon celé property.\n"+
      "- Absence URL ve druhém CSV není 0 kliků ani důkaz deindexace.\n"+
      "- Změny nejsou automaticky výsledkem úprav webu; ověřte shodnou GSC property, filtry, vyhledávací typ a přesná období.\n"+
      "- Nelze přiřadit dotaz konkrétní URL podle pořadí řádků; pro konkrétní URL použijte filtr stránky přímo v GSC.\n"+
      "- Výstup nic nemaže, nepřesměrovává ani nemění indexaci. Affiliate provize nevyhodnocuje.",
    "**Následující krok:** u první relevantní URL ověřit stránky/dotazy v GSC, existující obsah a návaznost na bezpečného poradce; teprve pak navrhnout jeden měřitelný zásah."
  ].join("\n\n")+"\n";
}
export function cliArgs(argv) {
  const found={};
  for(let i=0;i<argv.length;i++){
    if(!flags.has(argv[i])||i+1>=argv.length||found[argv[i]])
      throw new Error("Expected six unique GSC comparison flags");
    found[argv[i]]=argv[++i];
  }
  if([...flags].some(f=>!found[f]))throw new Error("All six GSC comparison flags are required");
  return found;
}
export function reportFromFiles(args) {
  const before=parseGscCsv(readFileSync(args["--before-pages"],"utf8"),"page");
  const after=parseGscCsv(readFileSync(args["--after-pages"],"utf8"),"page");
  return renderGscComparison(compareGscPeriods({before,after,
    beforeFrom:args["--before-from"],beforeTo:args["--before-to"],
    afterFrom:args["--after-from"],afterTo:args["--after-to"]}));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  try{process.stdout.write(reportFromFiles(cliArgs(process.argv.slice(2))));}
  catch{process.stderr.write("GSC_PERIOD_COMPARE_FAILED: verify files, dates and CSV exports; no content changed\n");process.exitCode=1;}
}
