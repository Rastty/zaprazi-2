/** Read-only live postdeploy acceptance for Zápraží 0.8.175. Never sends user data or WordPress mutations. */
import assert from "node:assert/strict";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";

const origin = "https://zaprazi.cz";
const release = "0.8.175";
const slug = "/senior-malo-pije/";
const header = { Accept: "text/html", "Cache-Control": "no-cache" };
async function request(path, json = false) {
  const response = await fetch(origin + path, {
    headers: json ? { Accept: "application/json", "Cache-Control": "no-cache" } : header,
    redirect: "follow",
    signal: AbortSignal.timeout(25000)
  });
  assert.equal(response.status, 200, `HTTP ${response.status}: ${path} (final: ${response.url})`);
  assert.equal(new URL(response.url).origin, origin, "Unexpected redirect host");
  return json ? response.json() : response.text();
}
const attr = (tag, key) => tag.match(new RegExp(`\\b${key}=["']([^"']*)["']`, "i"))?.[1] ?? "";
const meta = (html, name) => attr((html.match(/<meta\b[^>]*>/gi) || []).find(x => attr(x, "name") === name) || "", "content");
function section(html, id) {
  const at = html.indexOf('id="' + id + '"');
  assert.ok(at >= 0, "Missing section #" + id);
  const start = html.lastIndexOf("<section", at), end = html.indexOf("</section>", at);
  assert.ok(start >= 0 && end > at, "Malformed section #" + id);
  return html.slice(start, end);
}
function linksTo(html, from, to, hash) {
  return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].some(m => {
    try {
      const u = new URL(m[2].replaceAll("&amp;", "&"), origin + from);
      return u.origin === origin && u.pathname === to && u.hash === "#" + hash;
    } catch { return false; }
  });
}
function artSrc(html) {
  const art = (html.match(/<img\b[^>]*>/gi) || [])
    .find(img => attr(img, "src").includes("/assets/illustrations/doma-v-bezpeci.svg"));
  assert.ok(art, "Original warm illustration not present");
  assert.equal(attr(art, "width"), "720");
  assert.equal(attr(art, "height"), "510");
  assert.ok(attr(art, "alt").length >= 25, "Missing accessible image description");
  const url = new URL(attr(art, "src").replaceAll("&amp;", "&"), origin);
  assert.equal(url.origin, origin, "Not a first-party image");
  return url;
}

const readiness = await request("/wp-json/zaprazi/v1/affiliate-readiness", true);
assert.equal(readiness.release, release, "Live WordPress is not on 0.8.175");
assert.equal(readiness.integrity, "ok", "Live WordPress deployment has mismatched runtime files");
assert.equal(readiness.configured_total, 25, "Affiliate readiness regressed");
assert.equal(readiness.slot_total, 25, "Affiliate slot count regressed");

const article = await request(slug);
assert.equal(meta(article, "zaprazi-release"), release);
assert.equal(meta(article, "zaprazi-integrity"), "ok");
const main = article.slice(article.indexOf("<main"));
assert.ok(main.length >= 10500, "Rendered hydration article is unexpectedly short");
assert.equal((main.match(/<h1\b/gi) || []).length, 1);
assert.match(main, /Senior málo pije/);
assert.ok(!/noindex/i.test(meta(article, "robots")), "New guide blocked by robots");
const description = meta(article, "description");
assert.ok(description.length >= 75, "Missing SEO description");
const canonical = (article.match(/<link\b[^>]*>/gi) || [])
  .find(t => attr(t, "rel") === "canonical");
assert.equal(attr(canonical || "", "href"), origin + slug, "Incorrect HTTPS canonical");
assert.equal((section(main, "varovne-priznaky-malo-pije").match(/class="zp-decision-card"/g) || []).length, 4);
assert.equal((section(main, "proc-senior-malo-pije").match(/class="zp-decision-card"/g) || []).length, 4);
assert.equal((section(main, "pomucky-pro-piti").match(/class="zp-decision-card"/g) || []).length, 4);
assert.equal((section(main, "sedm-kroku-pitny-rezim").match(/<li>/g) || []).length, 7);
assert.equal((section(main, "denni-kontrola-piti").match(/<li>/g) || []).length, 8);
assert.equal((section(main, "faq-senior-malo-pije").match(/<details>/g) || []).length, 6);
assert.match(main, /polykání/);
assert.match(main, /volejte 155/);

const home = await request("/");
assert.equal(meta(home, "zaprazi-release"), release, "Homepage serves wrong release");
const art = artSrc(article);
assert.equal(artSrc(home).href, art.href, "Homepage and article illustration mismatch");
const image = await fetch(art, { signal: AbortSignal.timeout(20000), headers: { Accept: "image/svg+xml" } });
assert.equal(image.status, 200, "First-party illustration missing");
assert.match(await image.text(), /<svg\b/);
for (const from of ["/", "/sobestacnost/", "/nocni-cesta-z-postele-na-wc/"]) {
  const html = from === "/" ? home : await request(from);
  const anchor = from === "/sobestacnost/" ? "varovne-priznaky-malo-pije" : "proc-senior-malo-pije";
  assert.ok(linksTo(html, from, slug, anchor), "Missing live inbound " + from);
}
const siteMap = await auditPublicSitemap();
assert.ok(siteMap.staged_decision_paths_present.includes(slug) ||
  siteMap.required_decision_paths_present.includes(slug), "New hydration page not in sitemap");
console.log(JSON.stringify({
  verdict: "PASS", release, integrity: readiness.integrity, affiliate_slots: readiness.slot_total,
  path: slug, inbound: 3, check_steps: 7, checklist: 8, faq: 6, seo: "indexable_https_canonical",
  sitemap: "discovered", note: "Sitemap inclusion does not imply Google indexation or revenue"
}, null, 2));
