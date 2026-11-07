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
    // Never read the body or redirect destination; only inspect the public content type.
    const contentType = response.headers?.get?.("content-type");
    const nonHtml = typeof contentType === "string" && contentType.length > 0 &&
      !/^text\/html(?:\s*;|\s*$)/i.test(contentType);
    // No reading response body/redirect destination: never leak tracking tokens.
    // Body cleanup is best-effort: a locked/already-closed stream must not
    // erase a valid HTTP status and turn a 404 into network_unverifiable.
    try { if (response.body?.cancel) await response.body.cancel(); }
    catch { /* Keep the status; never inspect or log the response body. */ }
    // A successful HTTP status from a different final URL is not evidence that
    // the canonical product page was reached. Never expose that URL in reports.
    const unexpectedFinalUrl = typeof response.url === "string" &&
      response.url !== target.url;
    return { key:target.key, merchant:target.merchant,
      status:unexpectedFinalUrl ? "redirect_review" :
        (response.status === 200 && nonHtml ? "unexpected_content_review" : statusOf(response.status)),
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
    access_unverifiable:0,upstream_unavailable:0,unexpected_status_review:0,unexpected_content_review:0,network_unverifiable:0};
  for(const result of items) counts[result.status]++;
  return {scope:"25 exact PUBLIC canonical merchant product targets; no tracking or affiliate URLs",
    checked_at:new Date().toISOString(), total:items.length, counts, results:items,
    limitations:"HTTP 200 is not product identity, price, stock, valid affiliate deeplink, real click or approved commission. Blocked requests are UNKNOWN, not dead products."};
}
/**
 * Three curated public product-identity leads. Their presence must NEVER turn
 * a 404/403 into an approved sale, or make a publisher deeplink "verified".
 * This is only a human-review queue, attached to the existing weekly HTTP
 * audit without further requests, redirects, or merchant/affiliate clicks.
 */
export function buildIdentityReviewQueue(report, targets, watchlist) {
  assert.equal(watchlist?.schemaVersion,1,"Unsupported watchlist schema");
  assert.equal(watchlist?.evidenceScope,
    "public_product_listing_only_not_affiliate_or_purchase_verification");
  assert.match(watchlist?.reviewedAt||"",/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Array.isArray(watchlist.items),"Missing identity watchlist");
  const expectedKeys=[
    "zdrava-obuv-cz:xavier",
    "lekarna-cz:meyra-ideal-3061982",
    "drmax-cz:dma-eh-cmda"
  ];
  assert.equal(watchlist.items.length,expectedKeys.length,"Review of priority keys required");
  const canonical=new Map(targets.map(x=>[x.key,x.url]));
  const observations=new Map(report.results.map(x=>[x.key,x]));
  const seen=new Set();
  const review=[];
  const evidenceHosts=new Set([...Object.values(expectedHosts),"eshop.meyra.cz"]);
  for(const item of watchlist.items){
    assert.ok(expectedKeys.includes(item.slot),"Unexpected priority merchant slot");
    assert.ok(!seen.has(item.slot),"Duplicate priority merchant slot");
    seen.add(item.slot);
    assert.equal(item.priority,"P1","Do not silently downgrade unresolved commercial risk");
    assert.equal(item.canonicalUrl,canonical.get(item.slot),
      "Public watchlist must match EXACT current canonical PHP target");
    assert.ok(typeof item.productIdentity==="string" &&
      item.productIdentity.length>=10 && item.productIdentity.length<=180);
    assert.ok(Array.isArray(item.publicEvidenceUrls)&&
      item.publicEvidenceUrls.length>=1&&item.publicEvidenceUrls.length<=2);
    assert.ok(item.publicEvidenceUrls.includes(item.canonicalUrl),
      "Evidence must refer to exact canonical product URL");
    for(const source of item.publicEvidenceUrls){
      const u=new URL(source);
      assert.equal(u.protocol,"https:");
      assert.ok(evidenceHosts.has(u.hostname),"Unexpected public evidence host");
      assert.equal(u.username,"");
      assert.equal(u.password,"");
      assert.equal(u.search,"","Never log tracking tokens in source evidence");
      assert.equal(u.hash,"");
      assert.equal(u.href,source,"Evidence URL normalization not allowed");
    }
    assert.match(item.evidenceObservation||"",
      /^(?:public_html_observed|public_indexed_product_html_and_manufacturer_model|older_public_indexed_product_html_seen)_2026-11-07$/);
    assert.match(item.unresolvedConflict||"",
      /^(?:automated_canonical_http_404_vs_public_product_listing|automated_http_403_and_merchant_manufacturer_dimension_discrepancy|automated_canonical_http_403_unverifiable)$/);
    assert.match(item.action||"",/^manual_check_[a-z0-9_]+_publisher_deeplink$/);
    const probe=observations.get(item.slot);
    assert.ok(probe,"Missing exact canonical audit result for watched slot");
    const reviewState=probe.status==="not_found_review"
      ?"conflicting_public_evidence_manual_recheck"
      :probe.status==="access_unverifiable"
        ?"automated_access_blocked_manual_recheck"
        :probe.status==="http_ok_identity_unverified"
          ?"reachable_not_identity_or_affiliate_verified"
          :"needs_manual_review";
    review.push({
      slot:item.slot,priority:item.priority,
      current_http_status:probe.http_status,
      current_probe_status:probe.status,
      review_state:reviewState,
      identity_evidence:"public_listing_only",
      publisher_deeplink:"unverified",
      approved_commission:"unverified",
      manual_action:item.action,
      evidence_date:watchlist.reviewedAt
    });
  }
  assert.deepEqual([...seen].sort(),[...expectedKeys].sort());
  return review;
}

export function markdownSummary(report) {
  const summary=Object.entries(report.counts).map(([key,value])=>"- "+key+": **"+value+"**").join("\n");
  const exceptions=report.results.filter(x=>x.status!=="http_ok_identity_unverified")
    .map(x=>("| "+x.key+" | "+x.http_status+" | "+x.status+" |")).join("\n");
  return "## Public merchant target audit\n"+report.checked_at+"\n\n"+summary+
    "\n\n### Needs manual follow-up or verification\n| Slot | HTTP | State |\n|---|---:|---|\n"+
    (exceptions||"| — | — | No non-200 results; exact identities still unverified |")+
    (Array.isArray(report.identity_review_queue) ?
      "\n\n### Priority product identity follow-ups (NOT verified affiliate)\n| Slot | Probe | Review | Affiliate | Next check |\n|---|---|---|---|---|\n" +
      report.identity_review_queue.map(x=>
        "| "+x.slot+" | "+x.current_probe_status+" | "+x.review_state+" | "+x.publisher_deeplink+" | "+x.manual_action+" |").join("\n") : "")+
    "\n\n**Limit:** "+report.limitations+"\n";
}
export async function main() {
  const php=readFileSync(new URL("../functions.php",import.meta.url),"utf8");
  const targets=extractCanonicalTargets(php);
  const report=await auditCanonicalTargets(targets);
  const watchlist=JSON.parse(readFileSync(new URL("../data/merchant-identity-watchlist.json",import.meta.url),"utf8"));
  report.identity_review_queue=buildIdentityReviewQueue(report,targets,watchlist);
  process.stdout.write(JSON.stringify(report,null,2)+"\n");
  if(process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdownSummary(report),"utf8");
}
if(process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href){
  main().catch(e=>{console.error("CANONICAL_TARGET_AUDIT_CONFIG_ERROR",e.message);process.exitCode=1;});
}
