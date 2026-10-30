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
export function assertPrimaryGuidance(html, target) {
  const section = String(html).match(/<section\b[^>]*class=["'][^"']*\bzp-search-guidance\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/i)?.[1];
  assert.ok(section, "Missing guide recommendation section");
  const primary = section.match(/<a\b[^>]*class=["'][^"']*\bzp-btn\b[^"']*["'][^>]*href=["']([^"']+)["']/i)?.[1];
  assert.ok(primary, "Missing prominent first-guide action");
  assert.equal(primary, target, "Primary action must open the safest first guide");
  const u = new URL(primary);
  assert.equal(u.search, "", "Do not copy search text into guide links");
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
async function getPage(url) {
  const safe = sanitizeSourceUrl(url);
  const response = await fetch(safe, {
    redirect: "manual", headers: { Accept: "text/html,application/json" },
    signal: AbortSignal.timeout(25000)
  });
  assert.equal(response.status, 200, "GET failed for "+safe+" ("+response.status+")");
  const body = await response.text();
  assert.ok(body.length>0 && body.length<2500000, "Unexpected payload size "+safe);
  return {body, xRobotsTag:response.headers.get("x-robots-tag") ?? ""};
}
async function getText(url) {
  return (await getPage(url)).body;
}
function searchUrl(term) {
  const u = new URL(origin+"/");
  u.searchParams.set("s",term);
  return u.href;
}
// Fixed synthetic queries only. No visitor answers, no search analytics.
export const liveSearchCases = Object.freeze([
  {term:"presun z postele na vozik",target:"/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik"},
  {term:"pecovatelska sluzba",target:"/jak-vybrat-pecovatelskou-sluzbu/#vyber-pecovatelske-sluzby-kroky"},
  {term:"osobni asistence",target:"/jak-vybrat-pecovatelskou-sluzbu/#vyber-pecovatelske-sluzby-kroky"},
  {term:"domaci zdravotni pece",target:"/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba"},
  {term:"hul nebo choditko",target:"/choditka-pro-seniory/#hul-nebo-choditko"},
  {term:"senior odmita choditko",target:"/senior-odmita-choditko/#proc-senior-odmita"},
  {term:"senior nechce do sprchy",target:"/senior-odmita-koupani/#vyber-hygieny-bez-sprchy"},
  {term:"senior malo pije",target:"/senior-malo-pije/#varovne-priznaky-malo-pije"},
  {term:"babicka sama doma",target:"/senior-doma-sam-sos-pomoc/#jak-funguje-pomoc-sos"},
  {term:"senior nepije",target:"/senior-malo-pije/#varovne-priznaky-malo-pije"},
  {term:"malo pije",target:"/senior-malo-pije/#varovne-priznaky-malo-pije"}
]);


/**
 * Independent public SEO smoke for the four editorial guides fixed in #513.
 * Source-code assertions alone cannot establish that WordPress serves the
 * metadata. This check runs only when the exact source release is live.
 */
export const liveEditorialSeoCases = Object.freeze([
  {path:"/prevoz-seniora-k-lekari/", intent:/zdravotnickou dopravu|zdravotnické dopravy/i},
  {path:"/senior-nestihne-dojit-na-wc/", intent:/varovné příznaky/i},
  {path:"/prispevek-na-peci-pro-seniora/", intent:/sociální šetření/i},
  {path:"/jak-vybrat-pecovatelskou-sluzbu/", intent:/registr MPSV/i}
]);
function htmlAttribute(tag, name) {
  const attributes = [...String(tag).matchAll(/\b([a-z-]+)\s*=\s*(["'])(.*?)\2/gi)];
  return attributes.find(match => match[1].toLowerCase() === name)?.[3] ?? null;
}
export function assertLiveEditorialSeo(html, entry, xRobotsTag = "") {
  const head = String(html).split(/<\/head\s*>/i)[0];
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]);
  const descriptions = metas.filter(tag => htmlAttribute(tag,"name")?.toLowerCase() === "description");
  assert.equal(descriptions.length, 1, "Expected exactly one live meta description: " + entry.path);
  const description = htmlAttribute(descriptions[0],"content") ?? "";
  assert.ok(description.length >= 100 && description.length <= 180,
    "Missing or implausible live meta description: " + entry.path);
  assert.match(description, entry.intent, "Wrong intent in live meta description: " + entry.path);
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]);
  const canonical = links.filter(tag => htmlAttribute(tag,"rel")?.toLowerCase() === "canonical");
  assert.equal(canonical.length, 1, "Expected one canonical link: " + entry.path);
  assert.equal(htmlAttribute(canonical[0],"href"), origin + entry.path,
    "Canonical must be the exact HTTPS public guide URL: " + entry.path);
  // Google can receive noindex from robots, googlebot or HTTP X-Robots-Tag.
  // `none` is equivalent to noindex,nofollow; directives can be separated by
  // whitespace, commas or semicolons, not only a leading comma.
  const blocked = value => /(?:^|[\s,;:])(?:noindex|none)(?=$|[\s,;])/i.test(value);
  const robots = metas.filter(tag => ["robots","googlebot"].includes(htmlAttribute(tag,"name")?.toLowerCase()));
  assert.ok(!robots.some(tag => blocked(htmlAttribute(tag,"content") ?? "")) && !blocked(xRobotsTag),
    "Guide must not be noindex: " + entry.path);
  return {path:entry.path, description_length:description.length, description};
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
    {path:"/jak-vybrat-pecovatelskou-sluzbu/",anchor:"vyber-pecovatelske-sluzby-kroky",phrase:"Sedm kroků k reálně dostupné a vhodné pomoci doma"},
    {path:"/choditka-pro-seniory/",anchor:"hul-nebo-choditko",phrase:"Francouzská berle"},
    {path:"/senior-odmita-choditko/",anchor:"proc-senior-odmita",phrase:"Čtyři možné důvody"},
    {path:"/senior-odmita-koupani/",anchor:"vyber-hygieny-bez-sprchy",phrase:"Čtyři časté překážky"},
    {path:"/senior-malo-pije/",anchor:"varovne-priznaky-malo-pije",phrase:"Kdy není správné zkoušet"},
    {path:"/senior-doma-sam-sos-pomoc/",anchor:"jak-funguje-pomoc-sos",phrase:"Tlačítko je jen začátek"}
  ];
  const pageReports=[];
  for (const guide of guides) {
    const html = await getText(origin+guide.path);
    assert.ok(isExactAnchor(html,guide.anchor), "Missing content anchor "+guide.path+"#"+guide.anchor);
    assert.ok(html.includes(guide.phrase), "Missing live useful content on "+guide.path);
    pageReports.push({path:guide.path,anchor:guide.anchor,exists:true});
  }
  // Keep these synthetic search expectations aligned with the deterministic
  // PHP router. A separate unit contract runs the real PHP function so future
  // editorial routing improvements cannot silently break live acceptance.
  const cases = liveSearchCases;
  const queries=[];
  for (const entry of cases) {
    const searchHtml = await getText(searchUrl(entry.term));
    try {
      assertGuidance(searchHtml,origin+entry.target);
      assertPrimaryGuidance(searchHtml,origin+entry.target);
      queries.push({term:entry.term,first_guidance:entry.target,ok:true});
    } catch (error) {
      // Fixed synthetic test query, never real visitor search or answers.
      console.error("ZP_PRODUCTION_SEARCH_MISMATCH", JSON.stringify({
        term:entry.term,expected_first:entry.target,
        guidance_present:searchHtml.includes("zp-search-guidance"),
        primary_action_present:searchHtml.includes("Otevřít první praktický návod"),
        verified_before_failure:queries.length
      }));
      throw error;
    }
  }
  assertNoGuidance(await getText(searchUrl("fotovoltaika")));
  assertNoGuidance(await getText(searchUrl("malo pije cerpadlo")));
  const editorial=[];
  const seenDescriptions=new Set();
  for (const entry of liveEditorialSeoCases) {
    const page=await getPage(origin+entry.path);
    const seo=assertLiveEditorialSeo(page.body,entry,page.xRobotsTag);
    assert.ok(!seenDescriptions.has(seo.description), "Duplicate live SEO descriptions");
    seenDescriptions.add(seo.description);
    editorial.push({path:seo.path,description_length:seo.description_length,canonical_ok:true});
  }
  report.editorial_seo=editorial;
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
