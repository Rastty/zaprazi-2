import test from "node:test";
import assert from "node:assert/strict";
import { auditPublicSitemap, extractLocs, requiredDecisionPaths, stagedDecisionPaths } from "../scripts/audit-public-sitemap.mjs";

const root = "https://zaprazi.cz";
function mock(files) {
  const requested = [];
  const get = async url => {
    requested.push(url);
    const body = files[url];
    return {status: typeof body === "string" ? 200 : 404,
      text: async () => body || ""};
  };
  return {get, requested};
}

test("XML URL parser handles escaped special chars and numerical entities", () => {
  assert.deepEqual(extractLocs('<urlset><url><loc>https://zaprazi.cz/a/?a=1&amp;b=2</loc></url><url><loc>https://zaprazi.cz/&#x63;/</loc></url></urlset>'),
    ["https://zaprazi.cz/a/?a=1&b=2", "https://zaprazi.cz/c/"]);
});

test("Read-only live audit inventories each sitemap and reports missing important URLs", async () => {
  const files = {
    [root + "/robots.txt"]: "User-agent: *\nSitemap: http://zaprazi.cz/sitemap_index.xml\n",
    [root + "/sitemap_index.xml"]: '<sitemapindex><sitemap><loc>http://zaprazi.cz/post-sitemap.xml</loc></sitemap><sitemap><loc>http://zaprazi.cz/page-sitemap.xml</loc></sitemap></sitemapindex>',
    [root + "/post-sitemap.xml"]: '<urlset><url><loc>http://zaprazi.cz/old-post/</loc></url></urlset>',
    [root + "/page-sitemap.xml"]: '<urlset><url><loc>http://zaprazi.cz/koupelna-a-wc/</loc></url><url><loc>https://zaprazi.cz/navrat-z-nemocnice/</loc></url></urlset>'
  };
  const {get, requested} = mock(files);
  const result = await auditPublicSitemap(get);
  assert.equal(result.total_url_entries, 3);
  assert.equal(result.unique_paths, 3);
  assert.deepEqual(result.index, {total: 2, http: 2, https: 0});
  assert.equal(result.leaf_sitemaps[0].http, 1);
  assert.equal(result.leaf_sitemaps[1].https, 1);
  assert.deepEqual(result.required_decision_paths_present.sort(),
    ["/koupelna-a-wc/", "/navrat-z-nemocnice/"].sort());
  assert.ok(result.required_decision_paths_missing.includes("/choditka-pro-seniory/"));
  assert.ok(result.staged_decision_paths_missing.includes("/invalidni-vozik-do-auta/"));
  assert.deepEqual(result.staged_decision_paths_present, []);
  assert.equal(result.html_pages_indexed_by_google, "unknown");
  assert.deepEqual(requested.sort(), Object.keys(files).sort());
  assert.ok(requested.every(url => url.startsWith("https://zaprazi.cz/")),
    "Read-only fetches must not follow advertised HTTP sitemap URLs");
});

test("Staged car guide is reported when present, without changing old required URLs", async () => {
  const files = {
    [root + "/robots.txt"]: "Sitemap: https://zaprazi.cz/sitemap_index.xml",
    [root + "/sitemap_index.xml"]: '<sitemapindex><sitemap><loc>https://zaprazi.cz/page-sitemap.xml</loc></sitemap></sitemapindex>',
    [root + "/page-sitemap.xml"]: '<urlset><url><loc>https://zaprazi.cz/invalidni-vozik-do-auta/</loc></url></urlset>'
  };
  const result = await auditPublicSitemap(mock(files).get);
  assert.ok(stagedDecisionPaths.includes("/invalidni-vozik-do-auta/"));
  assert.ok(stagedDecisionPaths.includes("/najezdova-rampa-na-jeden-schod/"));
  assert.ok(stagedDecisionPaths.includes("/prisavne-madlo-do-koupelny-bez-vrtani/"));
  assert.ok(stagedDecisionPaths.includes("/antidekubitni-matrace-na-polohovaci-postel/"));
  assert.ok(stagedDecisionPaths.includes("/myti-vlasu-na-luzku/"));
  assert.ok(stagedDecisionPaths.includes("/oblekani-ponozek-a-kalhot-bez-ohybani/"));
  assert.ok(stagedDecisionPaths.includes("/hygiena-leziciho-seniora-doma/"));
  assert.deepEqual(result.staged_decision_paths_present, ["/invalidni-vozik-do-auta/"]);
  assert.deepEqual(result.staged_decision_paths_missing.sort(), ["/najezdova-rampa-na-jeden-schod/","/prisavne-madlo-do-koupelny-bez-vrtani/","/antidekubitni-matrace-na-polohovaci-postel/","/myti-vlasu-na-luzku/","/oblekani-ponozek-a-kalhot-bez-ohybani/","/hygiena-leziciho-seniora-doma/"].sort());
  // The two newly staged guides remain unpublished in this isolated fixture.
  assert.ok(!result.required_decision_paths_present.includes("/invalidni-vozik-do-auta/"));
});

test("Refuse external host and duplicate child sitemap references", async () => {
  const baseline = {
    [root + "/robots.txt"]: "User-agent: *\n",
    [root + "/sitemap_index.xml"]: "<sitemapindex><sitemap><loc>https://other.example/x.xml</loc></sitemap></sitemapindex>"
  };
  await assert.rejects(auditPublicSitemap(mock(baseline).get), /external or unsafe/);
  baseline[root + "/sitemap_index.xml"] = '<sitemapindex><loc>http://zaprazi.cz/post-sitemap.xml</loc><loc>https://zaprazi.cz/post-sitemap.xml</loc></sitemapindex>';
  await assert.rejects(auditPublicSitemap(mock(baseline).get), /Duplicate child sitemap/);
  await assert.rejects(auditPublicSitemap(mock(baseline).get, "https://other.example"), /Refuse non-production/);
});

test("Reject malformed page XML and unavailable sitemap endpoints", async () => {
  const files = {
    [root + "/robots.txt"]: "User-agent: *\n",
    [root + "/sitemap_index.xml"]: "<sitemapindex><loc>https://zaprazi.cz/post-sitemap.xml</loc></sitemapindex>",
    [root + "/post-sitemap.xml"]: "<html>soft 200 error</html>"
  };
  await assert.rejects(auditPublicSitemap(mock(files).get), /Expected XML urlset/);
  delete files[root + "/post-sitemap.xml"];
  await assert.rejects(auditPublicSitemap(mock(files).get), /HTTP 404/);
});

test("Prioritized URLs are unique and cover all deployed Advisor entry paths", () => {
  assert.equal(new Set(requiredDecisionPaths).size, requiredDecisionPaths.length);
  for (const slug of [
    "/choditka-pro-seniory/", "/koupelna-a-wc/", "/navrat-z-nemocnice/",
    "/sobestacnost/", "/obuv-pro-seniory/", "/rollator-pro-seniory/"
  ]) assert.ok(requiredDecisionPaths.includes(slug), "Missing critical entry " + slug);
});
