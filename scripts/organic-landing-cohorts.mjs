#!/usr/bin/env node
/**
 * Classify consented, aggregated GA4 Organic Search landing sessions against
 * the exact WordPress October 2026 trash manifests. No remote requests, no
 * URL probing, no health answers, no user IDs and no affiliate requests.
 *
 * Usage: node scripts/organic-landing-cohorts.mjs ga4-aggregate.json
 * Input: {data:[{landing_page,session_default_channel_group,sessions}, ...]}
 * or an array of those rows. The tool emits counts ONLY, never landing paths.
 *
 * A historical trash manifest is not a live HTTP 404 check: the report must
 * never equate membership with current HTTP status, indexing or irrelevance
 * of every non-archived URL.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

const MANIFEST_FILES = Object.freeze([
  "data/archive-offtopic-trash-20261027-part-01.json",
  "data/archive-offtopic-trash-20261027-part-02.json",
  "data/archive-offtopic-trash-20261027-part-03.json",
  "data/archive-residual-311-review-20261027.json"
]);
const PRESERVED_POST_ID = "3638";

export function loadRetiredArchiveSlugs(base = new URL("../", import.meta.url)) {
  const retired = new Set();
  const seenIds = new Set();
  for (const relativePath of MANIFEST_FILES) {
    const document = JSON.parse(readFileSync(new URL(relativePath, base), "utf8"));
    if (!Array.isArray(document.entries)) throw new Error("Invalid archive manifest");
    for (const entry of document.entries) {
      const id = String(entry.id);
      if (seenIds.has(id)) throw new Error("Duplicate archive post ID");
      seenIds.add(id);
      if (id === PRESERVED_POST_ID) continue;
      if (typeof entry.slug !== "string" ||
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) ||
          retired.has(entry.slug)) throw new Error("Invalid or duplicate archive slug");
      retired.add(entry.slug);
    }
  }
  // This is a pinned historical manifest. Fail closed if a partial data load
  // would make archived traffic appear to be new, valid landing pages.
  if (retired.size !== 4359 || seenIds.size !== 4360)
    throw new Error("Incomplete archived-post inventory");
  return retired;
}

export function classifyLanding(landingPage, retiredSlugs) {
  if (landingPage === "(not set)") return "unassigned";
  // Path-only GA4 reports may omit the final slash. Do not accept URLs,
  // query strings or fragments (including WordPress ?s= searches).
  if (typeof landingPage !== "string" ||
      !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*\/?)?$/.test(landingPage))
    return "unclassifiable";
  const slug = landingPage.slice(1).replace(/\/$/, "");
  return retiredSlugs.has(slug) ? "retired_archive" : "non_archive_path";
}

export function summarizeOrganicLandingRows(input, retiredSlugs) {
  const rows = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(rows) || rows.length > 10000 || !(retiredSlugs instanceof Set))
    throw new Error("Expected bounded GA4 aggregate rows and a retired slug set");
  const groups = {
    retired_archive: 0,
    non_archive_path: 0,
    unassigned: 0,
    unclassifiable: 0
  };
  let organicRows = 0;
  for (const row of rows) {
    if (!row || typeof row !== "object" || Array.isArray(row) ||
        Object.keys(row).some(key => ![
          "landing_page", "session_default_channel_group", "sessions"
        ].includes(key)) ||
        typeof row.landing_page !== "string" ||
        typeof row.session_default_channel_group !== "string" ||
        !Number.isSafeInteger(row.sessions) || row.sessions < 0)
      throw new Error("Invalid aggregate row; only path, channel and sessions are allowed");
    if (row.session_default_channel_group !== "Organic Search") continue;
    const group = classifyLanding(row.landing_page, retiredSlugs);
    if (!Number.isSafeInteger(groups[group] + row.sessions))
      throw new Error("Organic session count overflow");
    groups[group] += row.sessions;
    organicRows++;
  }
  const totalOrganicSessions = Object.values(groups).reduce((sum, n) => sum + n, 0);
  if (!Number.isSafeInteger(totalOrganicSessions)) throw new Error("Organic session count overflow");
  return {
    totalOrganicSessions,
    organicLandingRows: organicRows,
    ...groups,
    retiredArchiveShare: totalOrganicSessions ?
      Math.round(10000 * groups.retired_archive / totalOrganicSessions) / 100 : null,
    warning: "Archiv = v manifestu koše z října 2026, ne důkaz aktuální HTTP 404. Ostatní adresa neznamená relevantní, indexovanou ani dostupnou stránku. GA4 nepočítá návštěvníky bez souhlasu."
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    if (process.argv.length !== 3 || process.argv[2].startsWith("-"))
      throw new Error("Usage: node scripts/organic-landing-cohorts.mjs ga4-aggregate.json");
    const input = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
    process.stdout.write(JSON.stringify(summarizeOrganicLandingRows(
      input, loadRetiredArchiveSlugs()), null, 2) + "\n");
  } catch (error) {
    // Do not echo input paths or row values into public logs.
    process.stderr.write("ORGANIC_LANDING_AUDIT_FAILED: " +
      (/^Usage:/.test(error.message) ? error.message : "Invalid or unreadable aggregate input/inventory") + "\n");
    process.exitCode = 1;
  }
}
