/**
 * Read-only WordPress/Yoast public sitemap audit.
 *
 * Usage: node scripts/audit-public-sitemap.mjs
 *
 * This reports XML inclusion, not Google indexation, visits or ranking.
 * Fetches only the exact Zápraží host; no WordPress credentials or mutations.
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const requiredDecisionPaths = Object.freeze([
  "/choditka-pro-seniory/", "/koupelna-a-wc/",
  "/navrat-z-nemocnice/", "/bezpecny-byt-pro-seniora/",
  "/co-zmerit-v-koupelne-pred-vyberem-pomucky/",
  "/nocni-cesta-z-postele-na-wc/", "/otazky-pred-propustenim-z-nemocnice/",
  "/pujceni-choditka/", "/choditko-na-pojistovnu/",
  "/polohovaci-postel/", "/polohovaci-postel-na-pojistovnu/",
  "/invalidni-vozik/", "/invalidni-vozik-na-pojistovnu/",
  "/projede-invalidni-vozik-dvermi/",
  "/sobestacnost/", "/obuv-pro-seniory/",
  "/jak-zmerit-chodidlo-pro-vyber-obuvi/",
  "/co-zmerit-pred-vyberem-choditka/",
  "/kompenzacni-pomucky-pro-seniory/",
  "/pomucky-do-koupelny-na-pojistovnu/",
  "/nastavec-na-wc-pro-seniory/", "/sprchovaci-zidle-pro-seniory/",
  "/toaletni-zidle-pro-seniory/", "/madlo-k-wc-pro-seniory/",
  "/sedatko-do-vany-pro-seniory/", "/choditko-do-bytu-pro-seniory/",
  "/rollator-pro-seniory/", "/jak-vznika-doporuceni/",
  "/schody-pro-seniora-doma/", "/vstavani-z-kresla-pro-seniora/",
  "/senior-nemuze-vstat-z-postele/",
  "/senior-spadl-doma/",
  "/prevoz-seniora-k-lekari/",
  "/senior-nestihne-dojit-na-wc/"
]);

// Proposed editorial route: add to requiredDecisionPaths only after production
// 0.8.165 publishes it, so read-only PR audits never mistake a staged 404 for
// a live production failure. The release's postdeploy gate must promote it.
export const stagedDecisionPaths = Object.freeze([
  "/invalidni-vozik-do-auta/",
  "/najezdova-rampa-na-jeden-schod/",
  "/prisavne-madlo-do-koupelny-bez-vrtani/",
  "/antidekubitni-matrace-na-polohovaci-postel/",
  "/myti-vlasu-na-luzku/",
  "/oblekani-ponozek-a-kalhot-bez-ohybani/",
  "/hygiena-leziciho-seniora-doma/",
  "/nastupovani-seniora-do-auta/",
  "/senior-doma-sam-sos-pomoc/",
  "/senior-odmita-choditko/",
  "/senior-odmita-koupani/",
  "/senior-malo-pije/",
  "/prispevek-na-peci-pro-seniora/"
]);

const decode = text => text.replace(/&(?:amp|quot|apos|lt|gt|#x[0-9a-f]+|#\d+);/gi, entity => {
  const table = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  const lower = entity.toLowerCase();
  if (table[lower]) return table[lower];
  if (lower.startsWith("&#")) {
    const hex = lower.startsWith("&#x");
    const code = Number.parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  }
  return entity;
});

export function extractLocs(xml) {
  return [...String(xml).matchAll(/<loc(?:\s[^>]*)?>\s*([^<]*?)\s*<\/loc\s*>/gi)]
    .map(match => decode(match[1].trim()));
}

const sitePath = url => {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.hostname.toLowerCase() !== "zaprazi.cz" ||
      parsed.username || parsed.password || parsed.port) {
    throw new Error("Unexpected external or unsafe URL in sitemap: " + url.slice(0, 250));
  }
  return parsed.pathname;
};

async function getText(fetcher, href) {
  const response = await fetcher(href, { signal: AbortSignal.timeout(15000) });
  if (response.status !== 200) throw new Error("HTTP " + response.status + " from " + href);
  const body = await response.text();
  if (body.length > 5_000_000) throw new Error("Unexpected sitemap payload size: " + href);
  return body;
}

export async function auditPublicSitemap(fetcher = fetch, origin = "https://zaprazi.cz") {
  const host = new URL(origin);
  if (host.origin !== "https://zaprazi.cz") throw new Error("Refuse non-production origin");
  const [robots, index] = await Promise.all([
    getText(fetcher, origin + "/robots.txt"),
    getText(fetcher, origin + "/sitemap_index.xml")
  ]);
  if (!/<sitemapindex\b/i.test(index)) throw new Error("Expected XML sitemap index, not an HTML page");
  const indexUrls = extractLocs(index);
  if (!indexUrls.length || indexUrls.length > 40) throw new Error("Unexpected sitemap index entry count");
  const indexPaths = indexUrls.map(sitePath);
  if (new Set(indexPaths).size !== indexPaths.length) throw new Error("Duplicate child sitemap path");

  const reports = [];
  const seenPages = new Map();
  for (const [n, path] of indexPaths.entries()) {
    // Sitemap locations can temporarily be HTTP in Yoast output.
    // Network fetches ALWAYS use HTTPS for the exact approved production host.
    if (!/^\/[a-z0-9_-]+(?:-sitemap\d*)?\.xml$/i.test(path)) {
      throw new Error("Unexpected sitemap leaf path: " + path);
    }
    const xml = await getText(fetcher, origin + path);
    if (!/<urlset\b/i.test(xml)) throw new Error("Expected XML urlset in " + path);
    const urls = extractLocs(xml);
    const schemes = { http: 0, https: 0 };
    const duplicates = [];
    for (const value of urls) {
      const localPath = sitePath(value);
      schemes[new URL(value).protocol.replace(":", "")]++;
      if (seenPages.has(localPath)) duplicates.push(localPath);
      else seenPages.set(localPath, { sitemap: path, url: value });
    }
    reports.push({
      name: path.replace(/^\//, ""),
      entries: urls.length,
      http: schemes.http,
      https: schemes.https,
      duplicate_paths: duplicates.slice(0, 8)
    });
  }
  const advertised = robots.split(/\r?\n/).map(s => s.trim())
    .filter(s => /^Sitemap:/i.test(s)).map(s => s.replace(/^Sitemap:\s*/i, ""));
  const httpIndexCount = indexUrls.filter(u => new URL(u).protocol === "http:").length;
  const total = reports.reduce((sum, r) => sum + r.entries, 0);
  return {
    observed_at_utc: new Date().toISOString(),
    site: origin,
    limitations: "Public XML discovery only; not Google indexation, traffic, ranking, or backlinks.",
    robots_sitemaps: advertised,
    index: { total: indexUrls.length, http: httpIndexCount, https: indexUrls.length - httpIndexCount },
    leaf_sitemaps: reports,
    total_url_entries: total,
    unique_paths: seenPages.size,
    duplicate_paths_sample: reports.flatMap(r => r.duplicate_paths).slice(0, 20),
    required_decision_paths_present: requiredDecisionPaths.filter(p => seenPages.has(p)),
    required_decision_paths_missing: requiredDecisionPaths.filter(p => !seenPages.has(p)),
    staged_decision_paths_present: stagedDecisionPaths.filter(p => seenPages.has(p)),
    staged_decision_paths_missing: stagedDecisionPaths.filter(p => !seenPages.has(p)),
    required_decision_path_locations: Object.fromEntries(requiredDecisionPaths
      .filter(p => seenPages.has(p)).map(p => [p, seenPages.get(p)])),
    html_pages_indexed_by_google: "unknown"
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  auditPublicSitemap()
    .then(result => { process.stdout.write(JSON.stringify(result, null, 2) + "\n"); })
    .catch(error => { process.stderr.write("SITEMAP_AUDIT_FAILED: " + error.message + "\n"); process.exitCode = 1; });
}
