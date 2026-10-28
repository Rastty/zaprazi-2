import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { requiredDecisionPaths } from "../scripts/audit-public-sitemap.mjs";

// Static source-level coverage only. PHP / JS dynamic routes, real 404s,
// legacy article bodies and Google indexation belong in separate live audits.
const root = new URL("../", import.meta.url);
const fileNames = [
  "front-page.php",
  ...readdirSync(root).filter(name => /^page-[a-z0-9-]+\.php$/.test(name))
].sort();
const slug = name => name === "front-page.php"
  ? "/"
  : "/" + name.replace(/^page-/, "").replace(/\.php$/, "") + "/";
const source = new Map(fileNames.map(name =>
  [slug(name), readFileSync(new URL("../" + name, import.meta.url), "utf8")]
));
const idsIn = html => new Set([...html.matchAll(/\bid=(["'])([^"']+)\1/g)]
  .map(match => match[2]));

test("every required core SEO route has a corresponding WordPress page template", () => {
  assert.equal(fileNames.length, 54,
    "Template set changed; review the exact list before accepting a new page");
  for (const page of requiredDecisionPaths) {
    assert.ok(source.has(page), "Core SEO/sitemap path lacks a matching page template: " + page);
  }
});

test("all literal home_url links point to existing templates and real anchors", () => {
  let links = 0;
  const inbound = new Map([...source.keys()].map(path => [path, new Set()]));
  for (const [from, html] of source) {
    // Dynamic home_url expressions cannot be resolved safely without running PHP.
    for (const match of html.matchAll(/home_url\(\s*(["'])(\/[^"']*)\1\s*\)/g)) {
      const href = match[2], url = new URL(href, "https://zaprazi.cz");
      assert.equal(url.origin, "https://zaprazi.cz", "Unsafe internal route " + href);
      assert.equal(url.search, "", "Unexpected query on a core route " + href);
      const target = source.get(url.pathname);
      assert.ok(target !== undefined, from + " links to unknown page " + href);
      if (url.hash) {
        let anchor;
        try { anchor = decodeURIComponent(url.hash.slice(1)); }
        catch { assert.fail(from + " has malformed anchor " + href); }
        assert.ok(idsIn(target).has(anchor), from + " links to missing anchor " + href);
      }
      inbound.get(url.pathname).add(from);
      links++;
    }
    for (const match of html.matchAll(/\bhref=(["'])#([^"' ]+)\1/g)) {
      assert.ok(idsIn(html).has(match[2]), from + " has missing local anchor #" + match[2]);
    }
  }
  assert.ok(links >= 140, "Unusually few internal links; check the source audit coverage");
  for (const path of requiredDecisionPaths) {
    const independent = [...inbound.get(path)].filter(from => from !== path);
    assert.ok(independent.length > 0, "Core authored SEO page has no inbound source link: " + path);
  }
});
