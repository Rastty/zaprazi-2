/**
 * Summarize read-only mobile Lighthouse reports (lab conditions).
 * No guessed CrUX / field Core Web Vitals and no promises of user speed.
 *
 * node scripts/audit-lighthouse-metrics.mjs /tmp/zp-lighthouse/*.json
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export function summarizeLighthouseReport(report) {
  if (!report || typeof report !== "object" || !report.categories?.performance ||
      !report.audits || !report.finalDisplayedUrl) {
    throw new Error("Invalid Lighthouse JSON report");
  }
  const u = new URL(report.finalDisplayedUrl);
  if (u.origin !== "https://zaprazi.cz") throw new Error("Unexpected final audit origin: " + u.origin);
  const audit = (id) => {
    const raw = report.audits[id]?.numericValue;
    return typeof raw === "number" && Number.isFinite(raw) ? Math.round(raw * 100) / 100 : null;
  };
  const requestSummary = report.audits["network-requests"]?.details?.items || [];
  const firstPartyRequests = requestSummary.filter(r => {
    try { return new URL(r.url).hostname === "zaprazi.cz"; }
    catch { return false; }
  });
  const largeAssets = firstPartyRequests
    .filter(r => Number(r.transferSize) >= 80000)
    .sort((a,b) => Number(b.transferSize)-Number(a.transferSize))
    .slice(0, 8)
    .map(r => ({
      path: new URL(r.url).pathname,
      transfer_kb: Math.round(Number(r.transferSize) / 1024),
      type: r.resourceType || "unknown"
    }));
  const score = report.categories.performance.score;
  if (typeof score !== "number") throw new Error("Missing performance score");
  return {
    audited_at: report.fetchTime || null,
    path: u.pathname,
    lighthouse_version: report.lighthouseVersion,
    environment: "Mobile Lighthouse laboratory simulation (not field CrUX data)",
    score: Math.round(score * 100),
    metrics: {
      LCP_ms: audit("largest-contentful-paint"),
      FCP_ms: audit("first-contentful-paint"),
      CLS: audit("cumulative-layout-shift"),
      TBT_ms: audit("total-blocking-time"),
      Speed_Index_ms: audit("speed-index")
    },
    requests: {
      total: requestSummary.length,
      first_party: firstPartyRequests.length,
      first_party_transfer_kb: Math.round(firstPartyRequests.reduce(
        (total, r) => total + (Number(r.transferSize) || 0), 0) / 1024),
      large_first_party: largeAssets
    },
    warnings: report.runWarnings || [],
    disclaimers: "One synthetic run per URL; not p75 user metrics, INP, conversions, ranking or a speed comparison."
  };
}

export function summarizeLighthouseReports(rawReports) {
  const pages=rawReports.map(summarizeLighthouseReport);
  if (new Set(pages.map(x=>x.path)).size !== pages.length)
    throw new Error("Duplicate report path");
  return {
    measurement: "Single-run baseline, not before/after or field CWV",
    pages,
    optimization_candidates: pages.flatMap(page =>
      page.requests.large_first_party.map(asset => ({page:page.path,...asset}))
    ).slice(0,25)
  };
}

if(process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const paths=process.argv.slice(2);
  if(!paths.length)throw new Error("Provide one or more JSON Lighthouse report paths");
  const data=summarizeLighthouseReports(paths.map(file => JSON.parse(readFileSync(file,"utf8"))));
  console.log("LIGHTHOUSE_BASELINE",JSON.stringify(data));
}
