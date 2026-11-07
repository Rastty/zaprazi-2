#!/usr/bin/env node
/**
 * Public, read-only merchant PRODUCT target monitor (not an affiliate audit).
 * Source of truth: zaprazi_2_affiliate_targets() in functions.php.
 * Never reads WP options, generated publisher deeplinks, answers or analytics.
 * Never follows redirects or clicks on affiliate hosts.
 */
import assert from "node:assert/strict";
import { readFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const expectedHosts = Object.freeze({
  "rehabilitacni-pomucky-cz": "www.rehabilitacnipomucky.cz",
  "lekarna-cz": "www.lekarna.cz",
  "unizdrav-cz": "unizdrav.cz",
  "drmax-cz": "www.drmax.cz",
  "rehavita-cz": "www.rehavita.cz",
  "zdrava-obuv-cz": "www.zdrava-obuv-eshop.cz"
});
const EXPECTED_SLOTS = 25;

export function extractCanonicalTargets(phpSource, expectedCount = EXPECTED_SLOTS) {
  const match = String(phpSource).match(
    /function\s+zaprazi_2_affiliate_targets\s*\(\s*\)\s*\{\s*return\s+array\s*\(([\s\S]*?)\)\s*;\s*\}/
  );
  assert.ok(match, "Missing exact PHP canonical affiliate targets source");
  const body = match[1];
  const syntax = /'([^']+)'\s*=>\s*'([^']+)'/g;
  const entries = [...body.matchAll(syntax)];
  assert.equal(body.replace(syntax, "").replace(/[\s,]/g, ""), "", "Unexpected PHP array syntax");
  assert.equal(entries.length, expectedCount, "Canonical target inventory changed: review slot count");
  const keys = new Set(), urls = new Set();
  return entries.map(([, key, rawUrl]) => {
    assert.ok(!keys.has(key), "Duplicate affiliate slot "+key);
    keys.add(key);
    const merchant = key.split(":")[0];
    assert.ok(Object.hasOwn(expectedHosts, merchant), "Unexpected merchant: "+merchant);
    const u = new URL(rawUrl);
    assert.equal(u.protocol, "https:", "Canonical target must use HTTPS");
    assert.equal(u.hostname, expectedHosts[merchant], "Wrong merchant host for "+key);
    assert.equal(u.username, "", "No URL credentials");
    assert.equal(u.password, "", "No URL credentials");
    assert.equal(u.port, "", "No nonstandard port");
    assert.equal(u.search, "", "No query parameters, tracking or personal data");
    assert.equal(u.hash, "", "No fragment or answer payload");
    assert.ok(u.pathname.startsWith("/") && u.pathname !== "/", "Exact product path required");
    assert.equal(u.href, rawUrl, "Canonical URL must not silently normalize");
    assert.ok(!urls.has(rawUrl), "One target URL reused across slots");
    urls.add(rawUrl);
    return { key, merchant, url:rawUrl };
  });
}
export function statusOf(httpStatus) {
  if (httpStatus === 200) return "http_ok_identity_unverified";
  if ([301,302,303,307,308].includes(httpStatus)) return "redirect_review";
  if ([404,410].includes(httpStatus)) return "not_found_review";
  if ([401,403,429,451].includes(httpStatus)) return "access_unverifiable";
  if (httpStatus >= 500) return "upstream_unavailable";
  return "unexpected_status_review";
}
export async function checkCanonicalTarget(target, fetchImpl=fetch) {
  const checkedAt = new Date().toISOString();
  try {
    const response = await fetchImpl(target.url, {
      method: "GET",
      redirect: "manual",
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(12000)
    });
    // No reading response body/redirect destination: never leak tracking tokens.
    if (response.body?.cancel) await response.body.cancel();
    // A successful HTTP status from a different final URL is not evidence that
    // the canonical product page was reached. Never expose that URL in reports.
    const unexpectedFinalUrl = typeof response.url === "string" &&
      response.url !== target.url;
    return { key:target.key, merchant:target.merchant,
      status:unexpectedFinalUrl ? "redirect_review" : statusOf(response.status),
      http_status:response.status, checked_at:checkedAt };
  } catch {
    return { key:target.key, merchant:target.merchant, status:"network_unverifiable",
      http_status:null, checked_at:checkedAt };
  }
}
export async function auditCanonicalTargets(targets, fetchImpl=fetch, concurrency=3) {
  assert.ok(Number.isInteger(concurrency) && concurrency>=1 && concurrency<=3, "Bound public requests");
  const items = Array(targets.length);
  let cursor=0;
  await Promise.all(Array.from({length:Math.min(concurrency,targets.length)},async()=>{
    while(cursor<targets.length){
      const index=cursor++;
      items[index]=await checkCanonicalTarget(targets[index],fetchImpl);
    }
  }));
  const counts={http_ok_identity_unverified:0,redirect_review:0,not_found_review:0,
    access_unverifiable:0,upstream_unavailable:0,unexpected_status_review:0,network_unverifiable:0};
  for(const result of items) counts[result.status]++;
  return {scope:"25 exact PUBLIC canonical merchant product targets; no tracking or affiliate URLs",
    checked_at:new Date().toISOString(), total:items.length, counts, results:items,
    limitations:"HTTP 200 is not product identity, price, stock, valid affiliate deeplink, real click or approved commission. Blocked requests are UNKNOWN, not dead products."};
}
export function markdownSummary(report) {
  const summary=Object.entries(report.counts).map(([key,value])=>"- "+key+": **"+value+"**").join("\n");
  const exceptions=report.results.filter(x=>x.status!=="http_ok_identity_unverified")
    .map(x=>("| "+x.key+" | "+x.http_status+" | "+x.status+" |")).join("\n");
  return "## Public merchant target audit\n"+report.checked_at+"\n\n"+summary+
    "\n\n### Needs manual follow-up or verification\n| Slot | HTTP | State |\n|---|---:|---|\n"+
    (exceptions||"| — | — | No non-200 results; exact identities still unverified |")+
    "\n\n**Limit:** "+report.limitations+"\n";
}
export async function main() {
  const php=readFileSync(new URL("../functions.php",import.meta.url),"utf8");
  const targets=extractCanonicalTargets(php);
  const report=await auditCanonicalTargets(targets);
  process.stdout.write(JSON.stringify(report,null,2)+"\n");
  if(process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdownSummary(report),"utf8");
}
if(process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href){
  main().catch(e=>{console.error("CANONICAL_TARGET_AUDIT_CONFIG_ERROR",e.message);process.exitCode=1;});
}
