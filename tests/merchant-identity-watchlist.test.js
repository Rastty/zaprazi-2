import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  extractCanonicalTargets, buildIdentityReviewQueue, markdownSummary
} from "../scripts/audit-canonical-merchant-targets.mjs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const source=read("functions.php");
const watchlist=JSON.parse(read("data/merchant-identity-watchlist.json"));
const targets=extractCanonicalTargets(source);
const byKey=new Map(watchlist.items.map(x=>[x.slot,x]));
const makeReport=()=>({
  total:targets.length,
  counts:{http_ok_identity_unverified:22,access_unverifiable:2,not_found_review:1},
  limitations:"HTTP reachability is not product identity, affiliate attribution or commission.",
  results:targets.map(x=>({
    key:x.key,merchant:x.merchant,status:
      x.key==="zdrava-obuv-cz:xavier"?"not_found_review":
      ["lekarna-cz:meyra-ideal-3061982","drmax-cz:dma-eh-cmda"].includes(x.key)
        ?"access_unverifiable":"http_ok_identity_unverified",
    http_status:x.key==="zdrava-obuv-cz:xavier"?404:
      ["lekarna-cz:meyra-ideal-3061982","drmax-cz:dma-eh-cmda"].includes(x.key)?403:200
  }))
});
const clone=value=>JSON.parse(JSON.stringify(value));

test("exact three historical merchant-risk entries match 25 PHP canonical product targets",()=>{
  assert.equal(targets.length,25);
  assert.equal(watchlist.schemaVersion,1);
  assert.equal(watchlist.reviewedAt,"2026-11-07");
  assert.equal(watchlist.items.length,3);
  for(const item of watchlist.items){
    assert.equal(item.priority,"P1");
    assert.equal(item.canonicalUrl,targets.find(x=>x.key===item.slot)?.url);
    assert.ok(item.publicEvidenceUrls.includes(item.canonicalUrl));
  }
  assert.match(byKey.get("zdrava-obuv-cz:xavier").productIdentity,/XAVIER.*5031/);
  assert.match(byKey.get("lekarna-cz:meyra-ideal-3061982").productIdentity,
    /3061982.*not ROLLATOR 2 3061982-R/);
  assert.match(byKey.get("drmax-cz:dma-eh-cmda").productIdentity,
    /EH-CMDA.*8034055107553/);
});

test("snapshot 404 and bot-blocked 403 remain unresolved, despite public product listings",()=>{
  const report=makeReport();
  const review=buildIdentityReviewQueue(report,targets,watchlist);
  assert.equal(review.length,3);
  const row=key=>review.find(x=>x.slot===key);
  assert.equal(row("zdrava-obuv-cz:xavier").current_http_status,404);
  assert.equal(row("zdrava-obuv-cz:xavier").review_state,
    "conflicting_public_evidence_manual_recheck");
  assert.equal(row("lekarna-cz:meyra-ideal-3061982").review_state,
    "automated_access_blocked_manual_recheck");
  assert.equal(row("drmax-cz:dma-eh-cmda").review_state,
    "automated_access_blocked_manual_recheck");
  for(const item of review){
    assert.equal(item.identity_evidence,"public_listing_only");
    assert.equal(item.publisher_deeplink,"unverified");
    assert.equal(item.approved_commission,"unverified");
    assert.match(item.manual_action,/^manual_check_/);
    assert.equal(item.priority,"P1");
  }
  report.identity_review_queue=review;
  const summary=markdownSummary(report);
  assert.match(summary,/NOT verified affiliate/);
  for(const item of review) assert.ok(summary.includes(item.slot));
  assert.doesNotMatch(JSON.stringify(review),/https?:\/\/|[?]subid=/);
});

test("even fresh HTTP 200 cannot auto-close source-identity and publisher-deeplink checks",()=>{
  const report=makeReport();
  for(const result of report.results)
    if(watchlist.items.some(x=>x.slot===result.key)){
      result.status="http_ok_identity_unverified";
      result.http_status=200;
    }
  const review=buildIdentityReviewQueue(report,targets,watchlist);
  assert.ok(review.every(x=>x.review_state==="reachable_not_identity_or_affiliate_verified"));
  assert.ok(review.every(x=>x.publisher_deeplink==="unverified"));
});

test("reject a silent merchant/model swap, affiliate tracking URL, missing source or downgraded risk",()=>{
  const mutate=fn=>{const copy=clone(watchlist);fn(copy);return copy;};
  const corrupt=[
    mutate(x=>{x.items[0].canonicalUrl="https://www.zdrava-obuv-eshop.cz/another/";}),
    mutate(x=>{x.items[1].canonicalUrl="https://www.lekarna.cz/meyra-rollator-2/";}),
    mutate(x=>{x.items[2].publicEvidenceUrls[0]="https://www.drmax.cz/other/?affiliate=secret";}),
    mutate(x=>{x.items[0].publicEvidenceUrls[0]="https://evil.example/product";}),
    mutate(x=>{x.items[1].publicEvidenceUrls=[];}),
    mutate(x=>{x.items[0].priority="P3";}),
    mutate(x=>{x.items[2].action="https://affiliate.example?token=secret";}),
    mutate(x=>{x.items[2].slot=x.items[1].slot;}),
    mutate(x=>{x.items.pop();}),
    mutate(x=>{x.evidenceScope="approved_affiliate_sales";})
  ];
  for(const bad of corrupt){
    assert.throws(()=>buildIdentityReviewQueue(makeReport(),targets,bad));
  }
});

test("weekly report never exposes publisher secrets or substitutes product suitability",()=>{
  const script=read("scripts/audit-canonical-merchant-targets.mjs");
  const workflow=read(".github/workflows/merchant-target-health.yml");
  const joined=JSON.stringify(watchlist);
  assert.doesNotMatch(joined,/utm_|subid=|clickid=|&partner=|gclid=|password|access_token=/i);
  assert.match(script,/report\.identity_review_queue=buildIdentityReviewQueue/);
  assert.match(script,/manual_action/);
  assert.match(script,/identity_evidence:"public_listing_only"/);
  assert.match(script,/approved_commission:"unverified"/);
  assert.match(workflow,/merchant-identity-watchlist\.test\.js/);
  assert.doesNotMatch(script,/fetch\([^)]*affiliate|wp_update_post|update_option/);
});
