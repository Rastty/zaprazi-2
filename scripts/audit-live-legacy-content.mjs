/**
 * Read-only scan of published public WordPress article bodies, bounded to
 * zaprazi.cz, with cautious one-at-a-time REST requests.
 *
 * node scripts/audit-live-legacy-content.mjs
 * node scripts/audit-live-legacy-content.mjs --pages=2   (partial diagnostic)
 */
import { inspectLegacyPost, summarizeLegacyContent } from "./lib/legacy-content-quality.mjs";

const origin = "https://zaprazi.cz";
const arg = process.argv.slice(2);
if (arg.some(a => !/^--pages=\d+$/.test(a))) throw new Error("Only --pages=N supported");
const limitPages = arg.length ? Number(arg[0].split("=")[1]) : Infinity;
if (Number.isFinite(limitPages) && (limitPages < 1 || limitPages > 60)) throw new Error("Invalid page count");
const all = [], seenIds = new Set();
let expected = null, pages = 0, totalPages = null;
const pageSize = 100;
for (let pageNo = 1; pageNo <= Math.min(totalPages ?? 60, limitPages); pageNo++) {
  const url = new URL("/wp-json/wp/v2/posts", origin);
  url.searchParams.set("status", "publish");
  url.searchParams.set("per_page", String(pageSize));
  url.searchParams.set("page", String(pageNo));
  url.searchParams.set("_fields", "id,link,modified,content");
  const response = await fetch(url, {
    method: "GET", redirect: "manual",
    headers: {Accept: "application/json"},
    signal: AbortSignal.timeout(30000)
  });
  if (response.status !== 200) throw new Error("Public REST error " + response.status + " on page " + pageNo);
  const contentType = response.headers.get("content-type") || "";
  if (!/application\/json/i.test(contentType)) throw new Error("Non-JSON response");
  const total = Number(response.headers.get("x-wp-total"));
  const pageCount = Number(response.headers.get("x-wp-totalpages"));
  if (!Number.isSafeInteger(total) || total < 1 ||
      !Number.isSafeInteger(pageCount) || pageCount < 1 || pageCount > 60 ||
      total > 6000) throw new Error("Missing or unsafe REST pagination metadata");
  if (expected !== null && (expected !== total || totalPages !== pageCount)) {
    throw new Error("Corpus changed mid-audit: retry after the publishing window");
  }
  expected = total; totalPages = pageCount;
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > pageSize) {
    throw new Error("Invalid REST page " + pageNo);
  }
  for (const row of rows) {
    if (seenIds.has(row.id)) throw new Error("Duplicate published post across REST pages");
    seenIds.add(row.id);
    all.push(inspectLegacyPost(row));
  }
  pages++;
  if (pageNo % 10 === 0) console.log("LEGACY_PROGRESS", pages + "/" + totalPages);
}
if (limitPages < totalPages) {
  console.log("LEGACY_PARTIAL_DIAGNOSTIC", JSON.stringify({
    pages_fetched: pages, posts_observed: all.length, total_posts: expected,
    note: "Partial sample; no corpus-wide conclusions"
  }));
} else {
  const summary = summarizeLegacyContent(all, expected, pages);
  console.log("LEGACY_CONTENT_SUMMARY", JSON.stringify(summary));
}
