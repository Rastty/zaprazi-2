/**
 * Read-only, conservative lexical triage of the published legacy URL inventory.
 *
 * Usage: node scripts/audit-legacy-seo.mjs [path-to-export.csv]
 * Output: JSON to stdout only. NEVER changes WordPress, redirects or noindex.
 *
 * Terms match titles/slugs, not article text. This cannot substitute for
 * GSC query/page export, backlinks, or expert content-intent review.
 */
import { readFileSync } from "node:fs";

const file = process.argv[2] || "data/legacy-url-inventory.csv";
const csv = readFileSync(file, "utf8");

// RFC-4180-style parser supports escaped double quotes, commas and newlines.
// Export script wraps every field in quotes; no data is interpreted as code.
function parseCsv(input) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (c === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = []; field = "";
    } else {
      field += c;
    }
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const [headers, ...rawRows] = parseCsv(csv);
const expected = ["type", "id", "status", "url", "slug", "title", "modified", "category_ids"];
if (JSON.stringify(headers) !== JSON.stringify(expected)) {
  throw new Error("Unexpected CSV headers; do not analyze unknown schema");
}
if (rawRows.some(row => row.length !== headers.length)) {
  throw new Error("Malformed CSV record; refused partial audit");
}
const rows = rawRows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
const seen = new Set();
for (const item of rows) {
  if (item.status !== "publish" || !["page", "post"].includes(item.type)) {
    throw new Error("Expected only published WordPress posts and pages");
  }
  if (!item.url.startsWith("https://zaprazi.cz/") || seen.has(item.url)) {
    throw new Error("Unexpected or duplicate canonical URL: " + item.url);
  }
  seen.add(item.url);
}

const normalize = text => String(text || "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase();

const posts = rows.filter(row => row.type === "post");
const pages = rows.filter(row => row.type === "page");
// Deliberately use a high-precision set, not a broad keyword like "pad"
// (which falsely matches "čerpadlo") or "byt" (which means "to be" in Czech).
const rules = {
  direct_walking_aids: /\bchoditk|\brollator|\bberl|\bfrancouzsk[aey] hol|\binvalidni vozik|\bkompenzacni pomuck/,
  direct_bathroom_aids: /\b(?:wc|toalet|zachod|koupeln|sprch|vana|vany|madl)/,
  direct_bathroom_safety: /\b(?:wc|toalet|zachod|koupeln|sprch|vana|vany|madl).*(?:senior|opora|presun|bezpecn|bezbarier)|(?:senior|opora|presun|bezpecn|bezbarier).*\b(?:wc|toalet|zachod|koupeln|sprch|vana|vany|madl)/,
  adjustable_beds: /\bpolohovaci (?:postel|luzko)|\bluzko pro senior|\bpostel pro senior/,
  generic_beds: /\bpostel|\bmatrac|\bspankov/,
  home_care_discharge: /\bpropusteni z nemocnic|\bnavrat z nemocnic|\bdomaci (?:zdravotni )?pece|\bpec[eio] o senior/,
  senior_direct: /\bsenior|\bduchodc/,
  solar_term: /solarn/,
  pump_term: /cerpadl/,
  office_term: /kancelar/
};

const byTitle = row => normalize(row.title + " " + row.slug);
const counts = {};
const candidates = {};
for (const [key, regex] of Object.entries(rules)) {
  const matches = posts.filter(item => regex.test(byTitle(item)));
  counts[key] = matches.length;
  if (key.startsWith("direct_") || ["adjustable_beds", "generic_beds", "home_care_discharge", "senior_direct"].includes(key)) {
    candidates[key] = matches.slice(0, 20).map(item => ({
      id: Number(item.id), title: item.title, url: item.url
    }));
  }
}

const years = {};
for (const post of posts) {
  const year = post.modified.slice(0, 4);
  years[year] = (years[year] || 0) + 1;
}

const output = {
  provenance: "data/legacy-url-inventory.csv snapshot; public WordPress REST export",
  scope: "title + slug lexical matches only, no article body, rankings, traffic or backlinks",
  generated_from_inventory: file,
  published_posts: posts.length,
  published_pages_in_snapshot: pages.length,
  unique_urls: seen.size,
  years_by_last_modified: years,
  keyword_counts_may_overlap: counts,
  review_candidates_only: candidates,
  guardrail: "Do not redirect, noindex, merge or delete without GSC, backlinks and manual intent review."
};
process.stdout.write(JSON.stringify(output, null, 2) + "\n");
