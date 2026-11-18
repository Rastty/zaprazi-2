/**
 * Source-only offer observation audit. Public HTTP reachability, even HTTP 200,
 * does not renew a dated product/merchant observation or verify stock/price.
 * This adapter reads the 25 existing offer records without touching WordPress,
 * affiliate links, browser answers or merchant endpoints.
 */
import assert from "node:assert/strict";
import { MOBILITY_PRODUCTS } from "../../src/mobility/catalog.js";
import { BATHROOM_PRODUCTS } from "../../src/bathroom/catalog.js";
import { ADJUSTABLE_BED_PRODUCTS } from "../../src/bed/catalog.js";
import { WHEELCHAIR_PRODUCTS } from "../../src/wheelchair/catalog.js";
import { adlSelfCareCandidates } from "../../src/adl/engine.js";
import { FOOTWEAR_CANDIDATES } from "../../src/footwear/engine.js";
import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../../src/evidence/freshness.js";

export function curatedOfferObservations() {
  const catalogs = [
    ["mobility", MOBILITY_PRODUCTS],
    ["bathroom", BATHROOM_PRODUCTS],
    ["bed", ADJUSTABLE_BED_PRODUCTS],
    ["wheelchair", WHEELCHAIR_PRODUCTS]
  ];
  const catalogOffers = catalogs.flatMap(([group, items]) =>
    items.flatMap(item => (item.offers ?? []).filter(offer => typeof offer.affiliateKey === "string").map(offer => ({
      group, key: offer.affiliateKey, url: offer.url, checkedAt: offer.checkedAt
    }))));
  const candidateOffers = [
    ...Object.values(adlSelfCareCandidates).map(item => ({
      group: "adl", key: item.affiliateKey, url: item.sourceUrl, checkedAt: item.checkedAt
    })),
    ...Object.values(FOOTWEAR_CANDIDATES).map(item => ({
      group: "footwear", key: item.affiliateKey, url: item.sourceUrl, checkedAt: item.checkedAt
    }))
  ];
  return [...catalogOffers, ...candidateOffers];
}

export function auditOfferObservationAge(targets, observations = curatedOfferObservations(), now = new Date()) {
  assert.ok(Array.isArray(targets) && Array.isArray(observations), "Invalid merchant inventory");
  assert.ok(now instanceof Date && !Number.isNaN(now.getTime()), "Invalid audit date");
  const byKey = new Map();
  for (const item of observations) {
    assert.ok(typeof item.key === "string" && item.key, "Missing source offer key");
    assert.ok(!byKey.has(item.key), "Duplicate source offer key: " + item.key);
    byKey.set(item.key, item);
  }
  assert.equal(observations.length, targets.length, "Offer observations differ from PHP target count");
  const counts = { fresh: 0, stale: 0, unknown: 0 };
  const results = targets.map(target => {
    const source = byKey.get(target.key);
    assert.ok(source, "Missing source offer key: " + target.key);
    assert.equal(source.url, target.url, "Source/PHP target mismatch for " + target.key);
    assert.ok(["mobility", "bathroom", "bed", "wheelchair", "adl", "footwear"].includes(source.group),
      "Unexpected source offer group for " + target.key);
    const freshness = evidenceFreshness(source.checkedAt, EVIDENCE_FRESHNESS_DAYS.merchantOffer, now);
    counts[freshness.status]++;
    return {
      key: target.key,
      group: source.group,
      status: freshness.status,
      age_days: freshness.ageDays,
      source_checked_at: freshness.status === "unknown" ? null : source.checkedAt
    };
  });
  return {
    threshold_days: EVIDENCE_FRESHNESS_DAYS.merchantOffer,
    observation_at: now.toISOString(),
    total: results.length,
    counts,
    results,
    limitations: "Source observation dates only. HTTP 200 does not renew merchant evidence, confirm stock, current price, publisher tracking or commission."
  };
}

export function markdownOfferAgeSummary(report) {
  const pending = report.results.filter(x => x.status !== "fresh");
  return "\n\n### Dated merchant evidence (source only)\n" +
    "- Observation policy: **" + report.threshold_days + " days**\n" +
    "- Fresh: **" + report.counts.fresh + "**, stale: **" + report.counts.stale +
    "**, unknown: **" + report.counts.unknown + "** (of " + report.total + ")\n\n" +
    "| Offer slot | Group | Last source observation | Age (days) | State |\n" +
    "|---|---|---|---:|---|\n" +
    (pending.length ? pending.map(x => "| " + x.key + " | " + x.group + " | " +
      (x.source_checked_at ?? "UNKNOWN") + " | " + (x.age_days ?? "UNKNOWN") +
      " | " + x.status + " |").join("\n") : "| — | — | — | — | No pending source dates |") +
    "\n\n**Limit:** " + report.limitations + "\n";
}
