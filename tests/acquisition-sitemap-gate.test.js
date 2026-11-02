import test from "node:test";
import assert from "node:assert/strict";
import { assessAcquisitionDiscovery, compareRelease, newGuide, checkAcquisitionDiscovery } from "../scripts/check-acquisition-sitemap.mjs";
import { auditPublicSitemap, requiredDecisionPaths } from "../scripts/audit-public-sitemap.mjs";

const root = "https://zaprazi.cz";
const location = { sitemap: "/page-sitemap.xml", url: root + newGuide.path };
const report = { required_decision_path_locations: { [newGuide.path]: location } };

test("Newest practical guides are included in required public sitemap inventory", () => {
  for (const path of ["/schody-pro-seniora-doma/", "/vstavani-z-kresla-pro-seniora/", "/senior-nemuze-vstat-z-postele/", newGuide.path]) {
    assert.ok(requiredDecisionPaths.includes(path), "Missing new acquisition route: " + path);
  }
  assert.equal(requiredDecisionPaths.length, new Set(requiredDecisionPaths).size);
});

test("Release comparison is numerical, never lexicographic", () => {
  assert.equal(compareRelease("0.8.154", "0.8.155"), -1);
  assert.equal(compareRelease("0.8.155", "0.8.155"), 0);
  assert.equal(compareRelease("0.8.1000", "0.8.155"), 1);
  assert.throws(() => compareRelease("main", "0.8.155"), /Invalid/);
  assert.throws(() => compareRelease("0.8.155", "0.8.155-beta"), /Invalid/);
});

test("Merged release must not be mistaken for deployed public content", () => {
  const result = assessAcquisitionDiscovery({ release: "0.8.154", integrity: "ok" }, {});
  assert.equal(result.status, "awaiting_deploy");
  assert.equal(result.path, newGuide.path);
  assert.equal(result.expected_after, "0.8.156");
  assert.equal(assessAcquisitionDiscovery({ release: "0.8.155", integrity: "ok" }, {}).status, "awaiting_deploy");
});

test("After 0.8.156 the guide must exist in the exact clean HTTPS page sitemap", () => {
  const live = { release: "0.8.156", integrity: "ok" };
  assert.equal(assessAcquisitionDiscovery(live, report).status, "discovered");
  assert.throws(() => assessAcquisitionDiscovery(live, {}), /missing from public sitemap/);
  assert.throws(() => assessAcquisitionDiscovery(live, {
    required_decision_path_locations: {[newGuide.path]: {...location, url: "http://zaprazi.cz" + newGuide.path}}
  }), /HTTPS/);
  assert.throws(() => assessAcquisitionDiscovery(live, {
    required_decision_path_locations: {[newGuide.path]: {...location, sitemap: "/post-sitemap.xml"}}
  }), /page sitemap/);
  assert.throws(() => assessAcquisitionDiscovery(live, {
    required_decision_path_locations: {[newGuide.path]: {...location, noncanonical: true}}
  }), /noncanonical/);
  assert.throws(() => assessAcquisitionDiscovery({release: "0.8.156", integrity: "partial"}, report), /integrity/);
});

test("Sitemap audit exposes the exact location of a page without changing WordPress", async () => {
  const files = {
    [root + "/robots.txt"]: "User-agent: *\nSitemap: https://zaprazi.cz/sitemap_index.xml\n",
    [root + "/sitemap_index.xml"]: "<sitemapindex><loc>https://zaprazi.cz/page-sitemap.xml</loc></sitemapindex>",
    [root + "/page-sitemap.xml"]: "<urlset><url><loc>" + root + newGuide.path + "</loc></url></urlset>"
  };
  const requests = [];
  const get = async url => {
    requests.push(url);
    return {status: files[url] === undefined ? 404 : 200, text: async () => files[url] || ""};
  };
  const result = await auditPublicSitemap(get);
  assert.deepEqual(result.required_decision_path_locations[newGuide.path], location);
  assert.deepEqual(requests.sort(), Object.keys(files).sort());
});

test("End-to-end read-only gate checks readiness and public XML without redirecting to another host", async () => {
  const bodies = {
    [root + "/wp-json/zaprazi/v1/affiliate-readiness"]: JSON.stringify({release: "0.8.156", integrity:"ok"}),
    [root + "/robots.txt"]: "Sitemap: https://zaprazi.cz/sitemap_index.xml",
    [root + "/sitemap_index.xml"]: "<sitemapindex><loc>https://zaprazi.cz/page-sitemap.xml</loc></sitemapindex>",
    [root + "/page-sitemap.xml"]: "<urlset><loc>" + root + newGuide.path + "</loc></urlset>"
  };
  const requested = [];
  const mockFetch = async (url, options) => {
    requested.push({url, method: options?.method || "GET", redirect: options?.redirect});
    return {status: url in bodies ? 200 : 404, url, redirected: false,
      text: async () => bodies[url] || "",
      json: async () => JSON.parse(bodies[url] || "null")};
  };
  const result = await checkAcquisitionDiscovery(mockFetch);
  assert.equal(result.status, "discovered");
  assert.equal(requested.length, 4);
  assert.ok(requested.every(r => r.url.startsWith(root + "/") && r.method === "GET" && r.redirect === "manual"));
  await assert.rejects(() => checkAcquisitionDiscovery(mockFetch, "https://other.example"), /Refuse/);
});

test("Readiness gate rejects HTTP redirects without following a new host", async () => {
  const requested = [];
  const fetcher = async (url, options) => {
    requested.push({url, redirect: options.redirect});
    return {status: 302, url, redirected: false};
  };
  await assert.rejects(() => checkAcquisitionDiscovery(fetcher), /HTTP 302/);
  assert.deepEqual(requested, [{
    url: root + "/wp-json/zaprazi/v1/affiliate-readiness", redirect: "manual"
  }]);
});

test("Readiness gate rejects a followed redirect disguised as HTTP 200", async () => {
  const fetcher = async (url, options) => {
    assert.equal(options.redirect, "manual");
    return {status: 200, url: "https://external.example/fake-ready",
      redirected: true, json: async () => ({release: "0.8.999", integrity: "ok"})};
  };
  await assert.rejects(() => checkAcquisitionDiscovery(fetcher), /exact production endpoint/);
});

test("Readiness gate fails closed on malformed or unavailable JSON without leaking errors", async () => {
  const endpoint = root + "/wp-json/zaprazi/v1/affiliate-readiness";
  const badJson = async () => ({status: 200, url: endpoint, redirected: false,
    json: async () => {throw new Error("PRIVATE_HEALTH_ANSWER_CANARY");}});
  await assert.rejects(() => checkAcquisitionDiscovery(badJson), error =>
    /Invalid live release readiness JSON/.test(error.message) &&
    !error.message.includes("PRIVATE_HEALTH_ANSWER_CANARY"));
  const networkError = async () => {throw new Error("PRIVATE_HEALTH_ANSWER_CANARY");};
  await assert.rejects(() => checkAcquisitionDiscovery(networkError), error =>
    /Live release readiness request failed/.test(error.message) &&
    !error.message.includes("PRIVATE_HEALTH_ANSWER_CANARY"));
});
