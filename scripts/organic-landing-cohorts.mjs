#!/usr/bin/env node
/**
 * Classify consented, aggregated GA4 Organic Search landing sessions against
 * the exact WordPress October 2026 trash manifests. No remote requests, no
 * URL probing, no health answers, no user IDs and no affiliate requests.
 *
 * Usage: node scripts/organic-landing-cohorts.mjs ga4-aggregate.json
 * Input: {data:[{landing_page,session_default_channel_group,sessions,
 *   engaged_sessions?}, ...]} or an array. Engaged sessions are accepted only
 * when every Organic Search row has the field; partial observations fail closed.
 * The tool emits counts ONLY, never landing paths.
 *
 * A historical trash manifest is not a live HTTP 404 check: the report must
 * never equate membership with current HTTP status, indexing or irrelevance
 * of every non-archived URL.
 */
import {readFileSync, readdirSync} from "node:fs";
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

/**
 * File-name hints only: these URLs may have a page template in Git, but that
 * is NOT proof WordPress published the route, HTTP returned 200, Google indexed
 * it, or an organic visitor completed a decision. Keep these separate from
 * independently audited current decision-page sessions.
 */
export function loadThemeTemplateSlugs(base = new URL("../", import.meta.url)) {
  const names = readdirSync(base, {withFileTypes: true})
    .filter(entry => entry.isFile() &&
      /^page-[a-z0-9]+(?:-[a-z0-9]+)*\.php$/.test(entry.name))
    .map(entry => entry.name.slice(5, -4));
  if (names.length < 30 || names.length > 100 || new Set(names).size !== names.length)
    throw new Error("Incomplete or unexpected theme page-template inventory");
  return new Set(names);
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

export function summarizeOrganicLandingRows(input, retiredSlugs, themeSlugs = loadThemeTemplateSlugs()) {
  const rows = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(rows) || rows.length > 10000 ||
      !(retiredSlugs instanceof Set) || !(themeSlugs instanceof Set) ||
      themeSlugs.size < 30 || themeSlugs.size > 100)
    throw new Error("Expected bounded GA4 aggregate rows and audited slug sets");
  const groups = {
    retired_archive: 0,
    non_archive_path: 0,
    unassigned: 0,
    unclassifiable: 0
  };
  let organicRows = 0;
  let themeTemplateCandidateSessions = 0;
  let otherNonArchiveSessions = 0;
  // Optional GA4 engagedSessions measure. It is *not* an affiliate event,
  // unique person, consent proof or source of a derived conversion rate.
  // Refuse a partial organic sample: missing values cannot be treated as 0.
  let engagementMode = null;
  const engaged = {retired_archive:0,non_archive_path:0,
    unassigned:0,unclassifiable:0};
  let engagedTemplateCandidates=0,engagedOtherNonArchive=0;
  for (const row of rows) {
    if (!row || typeof row !== "object" || Array.isArray(row) ||
        Object.keys(row).some(key => ![
          "landing_page", "session_default_channel_group", "sessions",
          "engaged_sessions"
        ].includes(key)) ||
        typeof row.landing_page !== "string" ||
        typeof row.session_default_channel_group !== "string" ||
        !Number.isSafeInteger(row.sessions) || row.sessions < 0 ||
        (Object.hasOwn(row,"engaged_sessions") &&
          (!Number.isSafeInteger(row.engaged_sessions) ||
           row.engaged_sessions < 0 || row.engaged_sessions > row.sessions)))
      throw new Error("Invalid aggregate row; only bounded session counts are allowed");
    if (row.session_default_channel_group !== "Organic Search") continue;
    const hasEngaged=Object.hasOwn(row,"engaged_sessions");
    if (engagementMode===null) engagementMode=hasEngaged;
    else if (engagementMode!==hasEngaged)
      throw new Error("Partial organic engagement observation: do not infer missing counts");
    const group = classifyLanding(row.landing_page, retiredSlugs);
    if (engagementMode) {
      if (!Number.isSafeInteger(engaged[group]+row.engaged_sessions))
        throw new Error("Engaged session count overflow");
      engaged[group]+=row.engaged_sessions;
    }
    if (!Number.isSafeInteger(groups[group] + row.sessions))
      throw new Error("Organic session count overflow");
    groups[group] += row.sessions;
    if (group === "non_archive_path") {
      const slug = row.landing_page.slice(1).replace(/\/$/, "");
      if (slug === "" || themeSlugs.has(slug)) {
        if (!Number.isSafeInteger(themeTemplateCandidateSessions + row.sessions))
          throw new Error("Theme candidate session count overflow");
        themeTemplateCandidateSessions += row.sessions;
        if (engagementMode) {
          if (!Number.isSafeInteger(engagedTemplateCandidates+row.engaged_sessions))
            throw new Error("Theme engagement overflow");
          engagedTemplateCandidates+=row.engaged_sessions;
        }
      } else {
        if (!Number.isSafeInteger(otherNonArchiveSessions + row.sessions))
          throw new Error("Other non-archive session count overflow");
        otherNonArchiveSessions += row.sessions;
        if (engagementMode) {
          if (!Number.isSafeInteger(engagedOtherNonArchive+row.engaged_sessions))
            throw new Error("Other engagement overflow");
          engagedOtherNonArchive+=row.engaged_sessions;
        }
      }
    }
    organicRows++;
  }
  const totalOrganicSessions = Object.values(groups).reduce((sum, n) => sum + n, 0);
  if (!Number.isSafeInteger(totalOrganicSessions)) throw new Error("Organic session count overflow");
  return {
    totalOrganicSessions,
    organicLandingRows: organicRows,
    ...groups,
    theme_template_candidate: themeTemplateCandidateSessions,
    other_non_archive_path: otherNonArchiveSessions,
    retiredArchiveShare: totalOrganicSessions ?
      Math.round(10000 * groups.retired_archive / totalOrganicSessions) / 100 : null,
    engagement: engagementMode===true ? {
      totalOrganicEngagedSessions:Object.values(engaged).reduce((sum,n)=>sum+n,0),
      ...engaged,
      theme_template_candidate:engagedTemplateCandidates,
      other_non_archive_path:engagedOtherNonArchive
    } : null,
    warning: "Archiv = starý manifest, ne důkaz aktuální HTTP 404. Theme template = pouze shoda názvu PHP souboru, NE potvrzení existující živé decision page, indexace ani použitelnosti. Non-archive se dělí na theme_template_candidate + other_non_archive_path; žádná část bez nezávislé live kontroly není kvalifikovanou návštěvou. GA4 může vynechávat návštěvy bez souhlasu. Engaged session (>10 s, key event nebo 2+ pageview) není objednávka, konverze ani důkaz účinku úprav; s malým vzorkem neporovnávat kauzálně."
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
