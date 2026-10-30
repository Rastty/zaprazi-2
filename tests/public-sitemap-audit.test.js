import test from "node:test";
import assert from "node:assert/strict";
import { auditPublicSitemap, extractLocs, requiredDecisionPaths, stagedDecisionPaths, assertPublicSitemapHealthy } from "../scripts/audit-public-sitemap.mjs";

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
  assert.deepEqual(result.index, {total: 2, http: 2, https: 0, noncanonical: 0});
  assert.equal(result.leaf_sitemaps[0].http, 1);
  assert.equal(result.leaf_sitemaps[1].https, 1);
  assert.deepEqual(result.required_decision_paths_present.sort(),
    ["/koupelna-a-wc/", "/navrat-z-nemocnice/"].sort());
  assert.ok(result.required_decision_paths_missing.includes("/choditka-pro-seniory/"));
  assert.ok(result.required_decision_paths_missing.includes("/invalidni-vozik-do-auta/"));
  assert.deepEqual(result.staged_decision_paths_present, []);
  assert.equal(result.html_pages_indexed_by_google, "unknown");
  assert.equal(result.noncanonical_urls_count, 0);
  assert.deepEqual(requested.sort(), Object.keys(files).sort());
  assert.ok(requested.every(url => url.startsWith("https://zaprazi.cz/")),
    "Read-only fetches must not follow advertised HTTP sitemap URLs");
});

test("Deployed 0.8.183 guides are required, not indefinitely staged", async () => {
  const files = {
    [root + "/robots.txt"]: "Sitemap: https://zaprazi.cz/sitemap_index.xml",
    [root + "/sitemap_index.xml"]: '<sitemapindex><sitemap><loc>https://zaprazi.cz/page-sitemap.xml</loc></sitemap></sitemapindex>',
    [root + "/page-sitemap.xml"]: '<urlset><url><loc>https://zaprazi.cz/invalidni-vozik-do-auta/</loc></url></urlset>'
  };
  const result = await auditPublicSitemap(mock(files).get);
  assert.ok(requiredDecisionPaths.includes("/invalidni-vozik-do-auta/"));
  assert.ok(requiredDecisionPaths.includes("/najezdova-rampa-na-jeden-schod/"));
  assert.ok(requiredDecisionPaths.includes("/prisavne-madlo-do-koupelny-bez-vrtani/"));
  assert.ok(requiredDecisionPaths.includes("/antidekubitni-matrace-na-polohovaci-postel/"));
  assert.ok(requiredDecisionPaths.includes("/myti-vlasu-na-luzku/"));
  assert.ok(requiredDecisionPaths.includes("/oblekani-ponozek-a-kalhot-bez-ohybani/"));
  assert.ok(requiredDecisionPaths.includes("/hygiena-leziciho-seniora-doma/"));
  assert.ok(requiredDecisionPaths.includes("/nastupovani-seniora-do-auta/"));
  assert.ok(requiredDecisionPaths.includes("/senior-doma-sam-sos-pomoc/"));
  assert.ok(requiredDecisionPaths.includes("/senior-odmita-choditko/"));
  assert.ok(requiredDecisionPaths.includes("/senior-odmita-koupani/"));
  assert.ok(requiredDecisionPaths.includes("/senior-malo-pije/"));
  assert.ok(requiredDecisionPaths.includes("/jak-vybrat-pecovatelskou-sluzbu/"));
  assert.ok(requiredDecisionPaths.includes("/prispevek-na-peci-pro-seniora/"));
  assert.ok(requiredDecisionPaths.includes("/prevoz-seniora-k-lekari/"));
  assert.ok(requiredDecisionPaths.includes("/senior-nestihne-dojit-na-wc/"));
  assert.deepEqual(stagedDecisionPaths, []);
  assert.deepEqual(result.staged_decision_paths_present, []);
  assert.ok(result.required_decision_paths_present.includes("/invalidni-vozik-do-auta/"));
  assert.deepEqual(result.staged_decision_paths_missing, []);
  assert.ok(result.required_decision_paths_missing.includes("/jak-vybrat-pecovatelskou-sluzbu/"));
  // Published live guides are now required but deliberately absent from this synthetic fixture.
  assert.ok(result.required_decision_paths_present.includes("/invalidni-vozik-do-auta/"));
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

test("public sitemap health gate fails closed on lost pages, HTTP or duplicate URLs", async () => {
  const index=root+"/sitemap_index.xml";
  const page=root+"/page-sitemap.xml";
  const urls=requiredDecisionPaths.map(path=>"<url><loc>"+root+path+"</loc></url>").join("");
  const files={
    [root+"/robots.txt"]:"Sitemap: "+index,
    [index]:"<sitemapindex><loc>"+page+"</loc></sitemapindex>",
    [page]:"<urlset>"+urls+"</urlset>"
  };
  const good=await auditPublicSitemap(mock(files).get);
  assert.equal(assertPublicSitemapHealthy(good).required_count,requiredDecisionPaths.length);
  const removed=await auditPublicSitemap(mock({...files,[page]:files[page].replace("<url><loc>"+root+requiredDecisionPaths[0]+"</loc></url>","")}).get);
  assert.throws(()=>assertPublicSitemapHealthy(removed),/Missing required decision paths/);
  assert.throws(()=>assertPublicSitemapHealthy({...good,robots_sitemaps:["http://zaprazi.cz/sitemap_index.xml"]}),/robots.txt/);
  assert.throws(()=>assertPublicSitemapHealthy({...good,index:{...good.index,http:1}}),/HTTP locs/);
  assert.throws(()=>assertPublicSitemapHealthy({...good,duplicate_paths_sample:["/duplicate/"]}),/Duplicate/);
  assert.throws(()=>assertPublicSitemapHealthy({...good,noncanonical_urls_count:1}),/Noncanonical/);
  assert.throws(()=>assertPublicSitemapHealthy({...good,index:{...good.index,noncanonical:1}}),/Noncanonical/);
  assert.throws(()=>assertPublicSitemapHealthy({}),/Incomplete/);
});

// A URL with tracking parameters or a fragment is not the clean canonical URL,
// even when its pathname matches a required decision page. Never expose values.
test("sitemap health rejects query/fragment locs without logging parameter values", async () => {
  const index = root + "/sitemap_index.xml";
  const page = root + "/page-sitemap.xml";
  const all = requiredDecisionPaths.map(path => root + path);
  const files = {
    [root + "/robots.txt"]: "Sitemap: " + index,
    [index]: "<sitemapindex><loc>" + page + "</loc></sitemapindex>",
    [page]: "<urlset>" + all.map(url => "<url><loc>" + url + "</loc></url>").join("") + "</urlset>"
  };
  files[page] = files[page].replace(root + requiredDecisionPaths[0],
    root + requiredDecisionPaths[0] + "?sensitive=DO_NOT_LOG");
  const report = await auditPublicSitemap(mock(files).get);
  assert.deepEqual(report.required_decision_paths_missing, []);
  assert.equal(report.noncanonical_urls_count, 1);
  assert.deepEqual(report.noncanonical_urls_sample,
    [{path: requiredDecisionPaths[0], issue: "query"}]);
  assert.ok(!JSON.stringify(report).includes("DO_NOT_LOG"));
  assert.deepEqual(report.required_decision_path_locations[requiredDecisionPaths[0]],
    {sitemap: "/page-sitemap.xml", url: root + requiredDecisionPaths[0], noncanonical: true});
  assert.throws(() => assertPublicSitemapHealthy(report), /Noncanonical/);

  files[page] = files[page].replace("?sensitive=DO_NOT_LOG", "#fragment");
  const fragmentReport = await auditPublicSitemap(mock(files).get);
  assert.deepEqual(fragmentReport.noncanonical_urls_sample,
    [{path: requiredDecisionPaths[0], issue: "fragment"}]);
  assert.throws(() => assertPublicSitemapHealthy(fragmentReport), /Noncanonical/);

  files[page] = files[page].replace("#fragment", "");
  files[index] = "<sitemapindex><loc>" + page + "?x=1</loc></sitemapindex>";
  const indexReport = await auditPublicSitemap(mock(files).get);
  assert.equal(indexReport.index.noncanonical, 1);
  assert.throws(() => assertPublicSitemapHealthy(indexReport), /Noncanonical/);
});
