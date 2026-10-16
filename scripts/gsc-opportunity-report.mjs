#!/usr/bin/env node
/**
 * Usage: node scripts/gsc-opportunity-report.mjs --pages /private/Pages.csv
 *   --queries /private/Queries.csv --from 2026-09-01 --to 2026-09-28
 * Works offline; no GSC credentials, no data uploaded to GitHub or WordPress.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {parseGscCsv,analyzeGsc,renderGscReport} from "./lib/gsc-prioritization.mjs";

export function cliArgs(argv){
  const options={};
  for(let i=0;i<argv.length;i++){
    if(!["--pages","--queries","--from","--to"].includes(argv[i])||i+1>=argv.length)
      throw new Error("Allowed flags: --pages FILE --queries FILE --from YYYY-MM-DD --to YYYY-MM-DD");
    if(options[argv[i]])throw new Error("Repeated flag "+argv[i]);
    options[argv[i]]=argv[++i];
  }
  if(!options["--pages"]||!options["--from"]||!options["--to"])
    throw new Error("Required: --pages FILE --from YYYY-MM-DD --to YYYY-MM-DD");
  return options;
}
export function reportFromFiles(args){
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
