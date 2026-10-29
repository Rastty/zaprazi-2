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


test("explicit monthly validity keeps evidence fresh through the valid-through date", () => {
  const result = evidenceFreshness(
    "2026-10-06",
    31,
    new Date("2026-10-31T12:00:00Z"),
    "2026-10-31"
  );
  assert.equal(result.status, "fresh");
});

test("explicit monthly validity expires evidence immediately after valid-through date", () => {
  const result = evidenceFreshness(
    "2026-10-06",
    31,
    new Date("2026-11-01T00:00:00Z"),
    "2026-10-31"
  );
  assert.equal(result.status, "stale");
});

test("malformed explicit validity fails closed as unknown", () => {
  const result = evidenceFreshness(
    "2026-10-06",
    31,
    new Date("2026-10-20T12:00:00Z"),
    "October 2026"
  );
  assert.equal(result.status, "unknown");
});

test("impossible calendar dates cannot make evidence look fresh", () => {
  const now = new Date("2026-05-01T12:00:00Z");
  for (const bad of ["2026-02-29", "2026-02-30", "2026-04-31", "2026-13-01", "2026-00-01"]) {
    assert.equal(evidenceAgeDays(bad, now), null, bad);
    assert.equal(evidenceFreshness(bad, 365, now).status, "unknown", bad);
  }
  assert.equal(evidenceAgeDays("2028-02-29", new Date("2028-03-01T12:00:00Z")), 1);
});

test("invalid or reversed monthly validity cannot count as a fresh SÚKL record", () => {
  const now = new Date("2026-03-01T12:00:00Z");
  for (const bad of ["2026-02-29", "2026-02-30", "2026-13-01", "2026-00-01"]) {
    assert.equal(evidenceFreshness("2026-02-20", 31, now, bad).status, "unknown", bad);
  }
  assert.equal(evidenceFreshness("2026-03-01", 31, now, "2026-02-28").status, "unknown");
  assert.equal(evidenceFreshness("2028-02-20", 31,
    new Date("2028-02-29T12:00:00Z"), "2028-02-29").status, "fresh");
});
