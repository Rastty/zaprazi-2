/**
 * Safe release-gated discovery check for the newest practical SEO guide.
 * This checks WordPress/Yoast public XML, not Google indexation or ranking.
 * Read-only: no WordPress credentials, writes or user answer data.
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";

export const newGuide = Object.freeze({
  path: "/senior-nemuze-vstat-z-postele/",
  release: "0.8.155"
});

export function compareRelease(left, right) {
  if (!/^\d+\.\d+\.\d+$/.test(left) || !/^\d+\.\d+\.\d+$/.test(right)) {
    throw new Error("Invalid three-part release version");
  }
  const a = left.split(".").map(Number), b = right.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (!Number.isSafeInteger(a[i]) || !Number.isSafeInteger(b[i])) throw new Error("Invalid release component");
    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  }
  return 0;
}

export function assessAcquisitionDiscovery(readiness, sitemap) {
  if (!readiness || readiness.integrity !== "ok") {
    throw new Error("Live theme deployment integrity is not OK");
  }
  const deployed = compareRelease(readiness.release, newGuide.release) >= 0;
  if (!deployed) return {
    status: "awaiting_deploy",
    release: readiness.release,
    expected_after: newGuide.release,
    path: newGuide.path,
    note: "Do not infer published content from a merged pull request."
  };
  const location = sitemap?.required_decision_path_locations?.[newGuide.path];
  if (!location) throw new Error("Deployed acquisition guide missing from public sitemap: " + newGuide.path);
  if (!/^\/page-sitemap\d*\.xml$/.test(location.sitemap)) {
    throw new Error("Guide not in a Yoast page sitemap: " + location.sitemap);
  }
  if (location.url !== "https://zaprazi.cz" + newGuide.path) {
    throw new Error("Guide XML loc is not the clean HTTPS canonical URL: " + location.url);
  }
  return {status: "discovered", release: readiness.release,
    path: newGuide.path, sitemap: location.sitemap,
    note: "Discovered in public XML; Google indexing and traffic remain unverified."};
}

export async function checkAcquisitionDiscovery(fetcher = fetch, origin = "https://zaprazi.cz") {
  if (origin !== "https://zaprazi.cz") throw new Error("Refuse non-production origin");
  const res = await fetcher(origin + "/wp-json/zaprazi/v1/affiliate-readiness",
    {signal: AbortSignal.timeout(15000), headers: {Accept: "application/json"}});
  if (res.status !== 200) throw new Error("Cannot verify live deployment release: HTTP " + res.status);
  const readiness = await res.json();
  const audit = await auditPublicSitemap(fetcher, origin);
  return assessAcquisitionDiscovery(readiness, audit);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  checkAcquisitionDiscovery().then(result => {
    console.log("ACQUISITION_SITEMAP_GATE", JSON.stringify(result));
  }).catch(error => {
    console.error("ACQUISITION_SITEMAP_GATE_FAILED", error.message);
    process.exitCode = 1;
  });
}
