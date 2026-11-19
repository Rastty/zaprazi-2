import test from "node:test";
import assert from "node:assert/strict";
import {
  AXE_TAGS, AUDIT_PATHS, summarizeAxeRun, countViolations, shouldFailAudit
} from "../scripts/lib/axe-audit-summary.mjs";

const sample = {
  violations: [{id: "aria-required-attr", impact: "serious", nodeCount: 1}],
  incomplete: [{id: "color-contrast", impact: "moderate", nodeCount: 1}]
};

test("coverage covers WCAG A/AA through 2.2, never best-practice-only claims", () => {
  assert.deepEqual(AXE_TAGS, ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);
});

test("axe summary contains only safe rule counts, not private node details", () => {
  const report = summarizeAxeRun({
    path: "/koupelna-a-wc/", viewport: "mobile", state: "incomplete", result: sample
  });
  assert.deepEqual(report.violations, [{rule: "aria-required-attr", impact: "serious", affectedNodes: 1}]);
  assert.deepEqual(report.incomplete, [{rule: "color-contrast", impact: "moderate", affectedNodes: 1}]);
  assert.doesNotMatch(JSON.stringify(report), /nodes|target|html/);
  assert.equal(countViolations([report]), 1);
});

test("strict mode can fail after remediation; pilot records findings without fake compliance", () => {
  const baseline = summarizeAxeRun({
    path: "/koupelna-a-wc/", viewport: "desktop", state: "verified", result: sample
  });
  const scans = AUDIT_PATHS.flatMap(path => ["mobile", "desktop"].flatMap(viewport =>
    ["entry", "incomplete", "verified"].map(state => ({...baseline, path, viewport, state}))));
  assert.equal(shouldFailAudit({scans, enforce: false}), false);
  assert.equal(shouldFailAudit({scans, enforce: true}), true);
  assert.equal(shouldFailAudit({scans: scans.slice(1), enforce: false}), true);
  assert.equal(shouldFailAudit({scans: [], enforce: false}), true);
  assert.equal(shouldFailAudit({scans: Array.from({length: 36}, () => baseline), enforce: false}), true);
  const clean = scans.map(scan => ({...scan, violations: []}));
  assert.equal(shouldFailAudit({scans: clean, enforce: true}), false);
});

test("unsafe identifiers are rejected before reporting", () => {
  for (const path of ["/foo/?answer=x", "https://example.test/foo/", "/foo/../bar/"]) {
    assert.throws(() => summarizeAxeRun({path, viewport: "mobile", state: "entry", result: sample}));
  }
});
