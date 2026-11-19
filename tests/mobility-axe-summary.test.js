import test from "node:test";
import assert from "node:assert/strict";
import {summarizeMobilityAxe, shouldFailMobilityAxe,
  MOBILITY_STATES, MOBILITY_VIEWPORTS} from "../scripts/lib/mobility-axe-summary.mjs";

const safe = {violations: [], incomplete: [{id: "color-contrast", impact: "serious", nodeCount: 3}]};
const coverage = () => MOBILITY_VIEWPORTS.flatMap(viewport =>
  MOBILITY_STATES.map(state => summarizeMobilityAxe({viewport, state, result: safe})));

test("Mobility audit covers every live stage on mobile and desktop", () => {
  assert.equal(MOBILITY_STATES.length, 5);
  assert.equal(coverage().length, 10);
  assert.equal(shouldFailMobilityAxe({scans: coverage(), enforce: true}), false);
  assert.equal(shouldFailMobilityAxe({scans: coverage().slice(1)}), true);
  assert.equal(shouldFailMobilityAxe({scans: [...coverage().slice(1), coverage()[1]]}), true);
});

test("Incomplete contrast is reported, not mistaken for proven compliance", () => {
  const report = summarizeMobilityAxe({viewport: "mobile", state: "entry", result: safe});
  assert.deepEqual(report.incomplete, [{rule: "color-contrast", impact: "serious", affectedNodes: 3}]);
  assert.deepEqual(report.violations, []);
});

test("Proven axe violations fail enforced mode, but baseline remains observational", () => {
  const runs = coverage();
  runs[0] = summarizeMobilityAxe({viewport: "mobile", state: "entry", result: {
    violations: [{id: "aria-invalid-attr", impact: "critical", nodeCount: 1}], incomplete: []
  }});
  assert.equal(shouldFailMobilityAxe({scans: runs}), false);
  assert.equal(shouldFailMobilityAxe({scans: runs, enforce: true}), true);
});

test("Audit exports no DOM, health answers, target selectors or third-party URLs", () => {
  const report = summarizeMobilityAxe({viewport: "desktop", state: "candidate_locked",
    result: {violations: [{id: "aria-foo!?", impact: "moderate", nodeCount: 2,
      nodes: [{html: "PRIVATE_DO_NOT_EXPORT", target: ["#private"]}]}], incomplete: []}});
  assert.equal(report.violations[0].rule, "aria-foo");
  assert.doesNotMatch(JSON.stringify(report), /PRIVATE|#private|html|target|https?:/);
  assert.throws(() => summarizeMobilityAxe({viewport: "tablet", state: "entry", result: safe}));
  assert.throws(() => summarizeMobilityAxe({viewport: "mobile", state: "anything", result: safe}));
});
