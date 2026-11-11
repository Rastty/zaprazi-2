#!/usr/bin/env node
/**
 * Read-only Growth Graph overlay from the same validated Prometheus 28-day
 * final GSC snapshot used by the site SEO report. Never rewrites growth-state,
 * publishes content, logs search terms or joins unrelated metrics.
 *
 * GitHub Actions:
 * GITHUB_RUN_ID=42999955350 node scripts/growth-plan-from-gsc.mjs \
 *   --snapshot /tmp/zaprazi-gsc-28d-sanitized.json
 */
import {readFileSync,statSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {parseSanitizedGscSnapshot} from "./gsc-period-compare.mjs";
import {planGrowth,renderGrowthPlan} from "./growth-graph.mjs";

const MAX_SNAPSHOT_BYTES=2_000_000;
const DAY=86_400_000;
const RUN_ID=/^[1-9][0-9]{5,15}$/;
const RUN_BASE="https://github.com/Rastty/prometheus-growth-os/actions/runs/";

export function planFromFinalGsc(graph,state,snapshot,runId,now=new Date()) {
  if(!RUN_ID.test(String(runId))||!(now instanceof Date)||
      Number.isNaN(now.getTime()))throw Error("Invalid bounded GSC evidence reference");
  // Existing parser enforces final 28d, exact site/property, curated canonical
  // paths and coherent counts. Extra fields, incl. GSC private query groups,
  // are never read by this adapter or copied into public plan output.
  const evidence=parseSanitizedGscSnapshot(snapshot);
  const end=Date.parse(evidence.to+"T00:00:00Z");
  const today=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Prague",
    year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
  const ageDays=Math.round((Date.parse(today+"T00:00:00Z")-end)/DAY);
  if(ageDays<3||ageDays>35)throw Error("Finalized GSC evidence outside allowed age window");
  const clicks=snapshot.sitewide.clicks;
  const impressions=snapshot.sitewide.impressions;
  const evidenceUrl=RUN_BASE+String(runId);

  // The committed state has ONE 'asOf' for every metric. Never redate an
  // older GA4 sample or affiliate-network report to a recent GSC snapshot:
  // other metrics deliberately become UNKNOWN in this temporary overlay.
  // Workflow does not write the overlay to source control or WordPress.
  const overlay={...state,asOf:evidence.to,metrics:{
    organic_clicks_28d:clicks,organic_impressions_28d:impressions
  },metricSources:{
    organic_clicks_28d:evidenceUrl,
    organic_impressions_28d:evidenceUrl
  }};
  const plan=planGrowth(graph,overlay,now);
  return {
    ...plan,
    evidence:{
      type:"prometheus_final_28d_gsc_only",
      source:evidenceUrl,site:"zaprazi.cz",
      periodStart:evidence.from,periodEnd:evidence.to,
      trackedCanonicalPages:evidence.rows.length
    },
    limitations:[...plan.limitations,
      "Tento GSC-only overlay nepřebírá stáří ani přínos GA4 a affiliate metrik; zde zůstávají UNKNOWN.",
      "Bez konkrétních bezpečně agregovaných dotazů a SERP důkazu se titulky ani obsah nemění automaticky."
    ]
  };
}
export function renderFinalGscGrowthPlan(plan) {
  return [
    "# Zápraží Growth Graph — čerstvá GSC evidence",
    "Zdroj: "+plan.evidence.source,
    "Finálních 28 dní: "+plan.evidence.periodStart+" až "+plan.evidence.periodEnd+
      "; doloženo "+plan.evidence.trackedCanonicalPages+
      " hlavních URL. Chybějící URL = UNKNOWN, nikoliv nula.",
    "**GSC-only přehled**: ostatní metriky jsou UNKNOWN; žádná změna WordPressu.",
    renderGrowthPlan(plan)
  ].join("\n\n");
}
export function growthFromGscCli(argv,env=process.env,now=new Date()) {
  if(argv.length!==2||argv[0]!=="--snapshot"||!argv[1]||
      argv[1].startsWith("--"))throw Error("Usage: --snapshot FILE");
  const path=argv[1];
  if(statSync(path).size>MAX_SNAPSHOT_BYTES)throw Error("GSC snapshot too large");
  const snapshot=JSON.parse(readFileSync(path,"utf8"));
  const root=new URL("../",import.meta.url);
  const graph=JSON.parse(readFileSync(new URL("config/growth-graph.json",root),"utf8"));
  const state=JSON.parse(readFileSync(new URL("config/growth-state.json",root),"utf8"));
  return renderFinalGscGrowthPlan(planFromFinalGsc(
    graph,state,snapshot,env.GITHUB_RUN_ID,now
  ));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])) {
  try{process.stdout.write(growthFromGscCli(process.argv.slice(2))+"\n");}
  catch {process.stderr.write("GROWTH_GSC_OVERLAY_FAILED: invalid, unauthorized or unavailable finalized snapshot\n");process.exitCode=1;}
}
