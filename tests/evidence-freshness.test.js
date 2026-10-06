import test from "node:test";
import assert from "node:assert/strict";
import {
  EVIDENCE_FRESHNESS_DAYS,
  evidenceAgeDays,
  evidenceFreshness
} from "../src/evidence/freshness.js";

test("evidence age is deterministic from injected reference time", () => {
  const now = new Date("2026-11-05T12:00:00Z");
  assert.equal(evidenceAgeDays("2026-10-06", now), 30);
});

test("merchant offer is fresh through the configured boundary", () => {
  const now = new Date("2026-11-05T12:00:00Z");
  const result = evidenceFreshness("2026-10-06", EVIDENCE_FRESHNESS_DAYS.merchantOffer, now);
  assert.equal(result.status, "fresh");
  assert.equal(result.ageDays, 30);
});

test("merchant offer becomes stale after the configured boundary", () => {
  const now = new Date("2026-11-06T12:00:00Z");
  const result = evidenceFreshness("2026-10-06", EVIDENCE_FRESHNESS_DAYS.merchantOffer, now);
  assert.equal(result.status, "stale");
  assert.equal(result.ageDays, 31);
});

test("future or malformed checked dates fail closed as unknown", () => {
  assert.equal(evidenceFreshness("bad-date", 30, new Date("2026-10-06T12:00:00Z")).status, "unknown");
  assert.equal(evidenceFreshness("2026-10-07", 30, new Date("2026-10-06T12:00:00Z")).status, "unknown");
});

test("technical product evidence has a longer freshness window than commerce evidence", () => {
  assert.ok(EVIDENCE_FRESHNESS_DAYS.productTechnical > EVIDENCE_FRESHNESS_DAYS.merchantOffer);
  assert.ok(EVIDENCE_FRESHNESS_DAYS.productTechnical > EVIDENCE_FRESHNESS_DAYS.reimbursementClaim);
});
