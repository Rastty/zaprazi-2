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

// The only production Mobility offer slots in Slice 1. Keep this short queue
// separate from the broader 25-slot merchant monitor and identity watchlist:
// an old observation calls for a human source recheck, not a product removal.
const MOBILITY_P0_SLOTS = Object.freeze([
  "rehabilitacni-pomucky-cz:besco-wa17",
  "rehabilitacni-pomucky-cz:besco-wa21",
  "lekarna-cz:meyra-ideal-3061982"
]);

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

/**
 * A bounded follow-up for the first complete purchase journey. No new requests
 * and no automatic date refresh: verification of the exact merchant model,
 * mutable offer, publisher route and approved commission are separate tasks.
 */
export function mobilityOfferRecheckQueue(report) {
  assert.ok(report && Array.isArray(report.results), "Missing dated offer report");
  const byKey = new Map();
  for (const row of report.results) {
    assert.ok(typeof row.key === "string" && !byKey.has(row.key), "Duplicate or invalid dated offer key");
    byKey.set(row.key, row);
  }
  return MOBILITY_P0_SLOTS.flatMap(slot => {
    const source = byKey.get(slot);
    assert.ok(source && source.group === "mobility", "Missing exact Slice 1 merchant evidence: " + slot);
    assert.ok(["fresh", "stale", "unknown"].includes(source.status), "Invalid source state");
    if (source.status === "fresh") return [];
    return [{
      slot,
      priority: "P0",
      source_status: source.status,
      source_age_days: source.age_days,
      source_checked_at: source.source_checked_at,
      next_action: "manual_exact_variant_and_current_merchant_offer_recheck",
      publisher_deeplink: "not_verified_by_source_age",
      approved_commission: "not_verified_by_source_age"
    }];
  });
}

export function markdownMobilityRecheckQueue(queue) {
  assert.ok(Array.isArray(queue), "Missing Slice 1 review queue");
  return "\n\n### P0 Slice 1 — dated Mobility offers requiring manual recheck\n" +
    "| Product slot | Source state | Last observed | Age (days) | Next action |\n" +
    "|---|---|---|---:|---|\n" +
    (queue.length ? queue.map(x => "| " + x.slot + " | " + x.source_status + " | " +
      (x.source_checked_at ?? "UNKNOWN") + " | " + (x.source_age_days ?? "UNKNOWN") +
      " | " + x.next_action + " |").join("\n") :
      "| — | — | — | — | No aged Mobility source observations |") +
    "\n\nRecheck exact delivered model/variant and today's merchant product evidence. " +
    "Publisher deeplink tracking and network-approved commissions need **independent** evidence; " +
    "an HTTP 200, refreshed date or configured slot does not establish either. " +
    "Do not change suitability, rank or fit gates from this queue.\n";
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
    "\n\n**Limit:** " + report.limitations + "\n" +
    (report.mobility_recheck_queue ? markdownMobilityRecheckQueue(report.mobility_recheck_queue) : "");
}
