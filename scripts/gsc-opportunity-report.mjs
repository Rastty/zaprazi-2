#!/usr/bin/env node
/**
 * Usage: node scripts/gsc-opportunity-report.mjs --pages /private/Pages.csv
 *   --queries /private/Queries.csv --from 2026-09-01 --to 2026-09-28
 * Or consume the existing approved Prometheus 28-day final snapshot:
 *   node scripts/gsc-opportunity-report.mjs --snapshot /private/prometheus-zaprazi-gsc.json
 * Only finalized, host-bound, allowlisted data are accepted in snapshot mode.
 * Works offline; no GSC credentials, no data uploaded to GitHub or WordPress.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {parseGscCsv,analyzeGsc,renderGscReport} from "./lib/gsc-prioritization.mjs";
import {parseSanitizedGscSnapshot} from "./gsc-period-compare.mjs";
import {renderSafeIntentEvidence} from "./lib/gsc-safe-intents.mjs";
import {renderGoogleIndexReview} from "./lib/gsc-index-review.mjs";

export function cliArgs(argv){
  const options={};
  for(let i=0;i<argv.length;i++){
    if(!["--pages","--queries","--from","--to","--snapshot"].includes(argv[i])||i+1>=argv.length)
      throw new Error("Allowed: --snapshot FILE, or --pages FILE [--queries FILE] --from YYYY-MM-DD --to YYYY-MM-DD");
    if(options[argv[i]])throw new Error("Repeated flag "+argv[i]);
    options[argv[i]]=argv[++i];
  }
  // Reuse the existing read-only, strictly host-bound Prometheus final snapshot.
  // Mixing modes could falsely attach manually asserted dates to an API capture.
  if(options["--snapshot"]){
    if(Object.keys(options).length!==1)
      throw new Error("--snapshot must be the sole flag");
    return options;
  }
  if(!options["--pages"]||!options["--from"]||!options["--to"])
    throw new Error("Required: --pages FILE --from YYYY-MM-DD --to YYYY-MM-DD");
  return options;
}
export function reportFromSanitizedSnapshot(snapshot){
  // Exact property, 28 final days, allowlisted paths and count/CTR checks are
  // validated by the existing site-native GSC snapshot contract. No queries,
  // user URLs, credentials, or health answers are displayed or persisted.
  const data=parseSanitizedGscSnapshot(snapshot);
  const analysis=analyzeGsc({
    pages:data.rows,queries:[],periodStart:data.from,periodEnd:data.to
  });
  // Keep the new bounded intent readout *before* the 53-URL table so the
  // existing 38-line Core Actions summary shows useful page-level direction.
  // Both optional and missing buckets pass through the strict privacy guard.
  const main=renderGscReport(analysis,{source:"prometheus_final_28d"});
  const tableAnchor="## 1b. Všechny doložené hlavní URL";
  if(!main.includes(tableAnchor))throw new Error("GSC report structure changed");
  const safeIntents=renderSafeIntentEvidence(snapshot.queryIntentEvidence);
  return [
    "**Zdroj:** Prometheus — finální anonymizovaný 28denní Search Console agregát ("+
      data.property+"). Jen "+data.rows.length+" sledovaných existujících URL; "+
      "chybějící řádek = UNKNOWN, nikoli nulové zobrazení nebo deindexace. "+
      "Dotazové řádky nejsou součástí tohoto agregátu.",
    main.replace(tableAnchor,
      renderGoogleIndexReview(snapshot.indexInspectionEvidence)+"\n\n"+
      safeIntents+"\n\n"+tableAnchor)
  ].join("\n\n");
}
export function reportFromFiles(args){
  if(args["--snapshot"])
    return reportFromSanitizedSnapshot(JSON.parse(readFileSync(args["--snapshot"],"utf8")));

  const pages=parseGscCsv(readFileSync(args["--pages"],"utf8"),"page");
  const queries=args["--queries"]
    ?parseGscCsv(readFileSync(args["--queries"],"utf8"),"query"):[];
  return renderGscReport(analyzeGsc({
    pages,queries,periodStart:args["--from"],periodEnd:args["--to"]
  }));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  try{process.stdout.write(reportFromFiles(cliArgs(process.argv.slice(2))));}
  catch(e){process.stderr.write("GSC_OFFLINE_REPORT_FAILED: "+e.message+"\n");process.exitCode=1;}
}
