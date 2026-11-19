import {countViolations, summarizeAxeFindings} from "./axe-audit-summary.mjs";

export const MOBILITY_STATES = Object.freeze([
  "entry", "incomplete", "candidate_locked", "candidate_unlocked", "professional_check"
]);
export const MOBILITY_VIEWPORTS = Object.freeze(["mobile", "desktop"]);

export function summarizeMobilityAxe({viewport, state, result}) {
  if (!MOBILITY_VIEWPORTS.includes(viewport) || !MOBILITY_STATES.includes(state)) {
    throw new Error("Unsupported Mobility audit state or viewport");
  }
  return {path: "/", viewport, state, ...summarizeAxeFindings(result)};
}

export function shouldFailMobilityAxe({scans, enforce = false}) {
  const expected = new Set(MOBILITY_VIEWPORTS.flatMap(viewport =>
    MOBILITY_STATES.map(state => `/${viewport}/${state}`)));
  if (!Array.isArray(scans) || scans.length !== expected.size) return true;
  for (const scan of scans) {
    if (!scan || scan.path !== "/" || !MOBILITY_VIEWPORTS.includes(scan.viewport) ||
        !MOBILITY_STATES.includes(scan.state) ||
        !Array.isArray(scan.violations) || !Array.isArray(scan.incomplete)) return true;
    const key = `/${scan.viewport}/${scan.state}`;
    if (!expected.delete(key)) return true;
  }
  if (expected.size) return true;
  return Boolean(enforce) && countViolations(scans) > 0;
}
