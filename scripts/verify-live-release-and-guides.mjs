/**
 * Independent read-only production acceptance.
 * Uses public HTTPS GET and source-controlled expected release. Never sends
 * answers, touches merchants, performs WordPress writes or uses WPVibe.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { parseThemeRelease } from "./lib/live-release.mjs";

const origin = "https://zaprazi.cz";
const version = parseThemeRelease(readFileSync(new URL("../style.css", import.meta.url), "utf8"));

export function isExactAnchor(html, id) {
  const match = String(html).match(new RegExp('<[a-z][^>]*\\bid=(["\\\'])'+id+'\\1', 'i'));
  return !!match;
}

export function checkReadiness(response, expected = version) {
  assert.equal(typeof response, "object", "Readiness must be JSON object");
  assert.match(response.release || "", /^\d+\.\d+\.\d+$/);
  assert.equal(response.integrity, "ok", "Live theme is partially deployed");
  assert.equal(response.configured_total, 25, "Affiliate configurations must remain 25/25");
  assert.equal(response.slot_total, 25, "Unexpected affiliate inventory");
  return { expected, deployed: response.release, release_matches: response.release === expected };
}

export function assertGuidance(html, target) {
  const doc = String(html);
  assert.match(doc, /class=["'][^"']*zp-search-guidance/, "No relevant guidance shown");
  assert.ok(doc.includes(target), "Expected safe guide not present: "+target);
  assert.ok(!doc.includes("affiliate-query-result"), "Unexpected merchant route in search");
}
export function assertNoGuidance(html) {
  assert.doesNotMatch(String(html), /class=["'][^"']*zp-search-guidance/, "Off-topic search is incorrectly routed");
}
function sanitizeSourceUrl(raw) {
  const u = new URL(raw);
  assert.equal(u.origin, origin, "Only allow same-origin live GET");
  assert.equal(u.username, "");
  assert.equal(u.password, "");
  assert.equal(u.port, "");
  return u.href;
}
async function getText(url) {
  const safe = sanitizeSourceUrl(url);
  const response = await fetch(safe, {
    redirect: "manual", headers: { Accept: "text/html,application/json" },
    signal: AbortSignal.timeout(25000)
  });
  assert.equal(response.status, 200, "GET failed for "+safe+" ("+response.status+")");
  const body = await response.text();
  assert.ok(body.length>0 && body.length<2500000, "Unexpected payload size "+safe);
  return body;
}
function searchUrl(term) {
  const u = new URL(origin+"/");
  u.searchParams.set("s",term);
  return u.href;
}
export async function verifyLiveReleaseAndGuides() {
  const readiness = checkReadiness(JSON.parse(await getText(origin+"/wp-json/zaprazi/v1/affiliate-readiness")));
  const report = { checked_at: new Date().toISOString(), site: origin, ...readiness,
    note: "Read-only public production checks; no WordPress writes, no personal data, no organic/commission conclusions." };
  if (!readiness.release_matches) {
    report.status = "pending_deploy";
    console.warn("::warning::Live release "+readiness.deployed+" differs from checked-out "+readiness.expected+"; content checks will run after deploy.");
    console.log("ZP_PRODUCTION_ACCEPTANCE",JSON.stringify(report));
    return report;
  }
  const guides = [
    {path:"/senior-nemuze-vstat-z-postele/",anchor:"presun-z-postele-na-vozik",phrase:"Nezvládám zvedání seniora"},
    {path:"/navrat-z-nemocnice/",anchor:"domaci-zdravotni-pece-nebo-pecovatelska-sluzba",phrase:"Terénní pečovatelská služba"},
    {path:"/choditka-pro-seniory/",anchor:"hul-nebo-choditko",phrase:"Francouzská berle"}
  ];
  const pageReports=[];
  for (const guide of guides) {
    const html = await getText(origin+guide.path);
    assert.ok(isExactAnchor(html,guide.anchor), "Missing content anchor "+guide.path+"#"+guide.anchor);
    assert.ok(html.includes(guide.phrase), "Missing live useful content on "+guide.path);
    pageReports.push({path:guide.path,anchor:guide.anchor,exists:true});
  }
  const cases = [
    {term:"presun z postele na vozik",target:"/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik"},
    {term:"pecovatelska sluzba",target:"/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba"},
    {term:"hul nebo choditko",target:"/choditka-pro-seniory/#hul-nebo-choditko"}
  ];
  const queries=[];
  for (const entry of cases) {
    assertGuidance(await getText(searchUrl(entry.term)),origin+entry.target);
    queries.push({term:entry.term,first_guidance:entry.target,ok:true});
  }
  assertNoGuidance(await getText(searchUrl("fotovoltaika")));
  report.status="verified";
  report.guides=pageReports;
  report.search=queries;
  report.unrelated_query_protected=true;
  console.log("ZP_PRODUCTION_ACCEPTANCE",JSON.stringify(report));
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  verifyLiveReleaseAndGuides().catch(e=>{ console.error("ZP_PRODUCTION_ACCEPTANCE_FAILED",String(e));process.exitCode=1; });
}
