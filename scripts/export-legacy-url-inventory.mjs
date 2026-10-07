import fs from "node:fs";
import path from "node:path";

const baseUrl = (process.env.ZAPRAZI_BASE_URL || "https://zaprazi.cz").replace(/\/$/, "");
const perPage = 100;

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

async function fetchCollection(type, fields) {
  const rows = [];
  let page = 1;
  let totalPages = 1;
  let reportedTotal = null;

  do {
    const url = new URL(`${baseUrl}/wp-json/wp/v2/${type}`);
    url.searchParams.set("status", "publish");
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("orderby", "id");
    url.searchParams.set("order", "asc");
    url.searchParams.set("_fields", fields.join(","));

    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "user-agent": "ZaPrazi-Inventory/1.0 (+https://zaprazi.cz/)"
      }
    });

    if (!response.ok) {
      throw new Error(`${type} page ${page}: HTTP ${response.status} ${response.statusText}`);
    }

    const batch = await response.json();
    if (!Array.isArray(batch)) {
      throw new Error(`${type} page ${page}: unexpected response shape`);
    }

    reportedTotal = Number(response.headers.get("x-wp-total") || reportedTotal || batch.length);
    totalPages = Number(response.headers.get("x-wp-totalpages") || totalPages || 1);
    rows.push(...batch);
    page += 1;
  } while (page <= totalPages);

  if (reportedTotal !== null && rows.length !== reportedTotal) {
    throw new Error(`${type}: fetched ${rows.length}, WordPress reported ${reportedTotal}`);
  }

  return rows;
}

const [posts, pages] = await Promise.all([
  fetchCollection("posts", ["id", "link", "slug", "title", "modified", "status", "categories"]),
  fetchCollection("pages", ["id", "link", "slug", "title", "modified", "status"])
]);

const normalized = [
  ...posts.map((row) => ({
    type: "post",
    id: row.id,
    status: row.status,
    url: row.link,
    slug: row.slug,
    title: row.title?.rendered || "",
    modified: row.modified || "",
    category_ids: row.categories || []
  })),
  ...pages.map((row) => ({
    type: "page",
    id: row.id,
    status: row.status,
    url: row.link,
    slug: row.slug,
    title: row.title?.rendered || "",
    modified: row.modified || "",
    category_ids: []
  }))
].sort((a, b) => a.url.localeCompare(b.url, "cs"));

const urls = normalized.map((row) => row.url);
const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
if (duplicates.length) {
  throw new Error(`Duplicate URLs found: ${[...new Set(duplicates)].slice(0, 10).join(", ")}`);
}

fs.mkdirSync(path.resolve("data"), { recursive: true });

const headers = ["type", "id", "status", "url", "slug", "title", "modified", "category_ids"];
const csv = [
  headers.map(csvCell).join(","),
  ...normalized.map((row) => headers.map((key) => csvCell(row[key])).join(","))
].join("\n") + "\n";

fs.writeFileSync("data/legacy-url-inventory.csv", csv, "utf8");

const summary = {
  source: baseUrl,
  generated_at_utc: new Date().toISOString(),
  scope: "Public WordPress REST rows with status=publish",
  counts: {
    posts: posts.length,
    pages: pages.length,
    total: normalized.length
  },
  unique_urls: urls.length,
  artifact: "data/legacy-url-inventory.csv"
};

fs.writeFileSync(
  "data/legacy-url-inventory.summary.json",
  JSON.stringify(summary, null, 2) + "\n",
  "utf8"
);

console.log(JSON.stringify(summary));
