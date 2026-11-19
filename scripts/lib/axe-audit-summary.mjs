/**
 * Deliberately limited axe reporting: do not export DOM HTML, page answers,
 * network payloads or potentially sensitive strings from live pages.
 */
export const AXE_TAGS = Object.freeze([
  "wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"
]);
export const AUDIT_PATHS = Object.freeze([
  "/nastavec-na-wc-pro-seniory/", "/sprchovaci-zidle-pro-seniory/",
  "/toaletni-zidle-pro-seniory/", "/madlo-k-wc-pro-seniory/",
  "/sedatko-do-vany-pro-seniory/", "/koupelna-a-wc/"
]);
const AUDIT_VIEWPORTS = ["mobile", "desktop"];
const AUDIT_STATES = ["entry", "incomplete", "verified"];

export function summarizeAxeRun({path, viewport, state, result}) {
  if (!/^\/[a-z0-9-]+\/$/.test(path)) throw new Error("Unsafe audit path");
  if (!["mobile", "desktop"].includes(viewport)) throw new Error("Unsafe viewport");
  if (!["entry", "incomplete", "verified"].includes(state)) throw new Error("Unsafe state");
  return {path, viewport, state, ...summarizeAxeFindings(result)};
}

/** Safe rule counts shared by independent read-only browser audits. */
export function summarizeAxeFindings(result) {
  if (!result || !Array.isArray(result.violations) || !Array.isArray(result.incomplete)) {
    throw new Error("Missing axe result");
  }
  const summarized = findings => findings.map(finding => ({
    rule: String(finding.id || "unknown").replace(/[^a-z0-9-]/g, "").slice(0, 80),
    impact: ["critical", "serious", "moderate", "minor"].includes(finding.impact)
      ? finding.impact : "unknown",
    affectedNodes: Number.isSafeInteger(finding.nodeCount) && finding.nodeCount >= 0
      ? finding.nodeCount : 0
  })).sort((a, b) => a.rule.localeCompare(b.rule));
  return {violations: summarized(result.violations), incomplete: summarized(result.incomplete)};
}

export function countViolations(scans) {
  return scans.reduce((sum, scan) => sum + scan.violations.length, 0);
}

export function shouldFailAudit({scans, enforce}) {
  if (!Array.isArray(scans) || scans.length !== 36) return true;
  if (scans.some(scan => !scan || !Array.isArray(scan.violations))) return true;
  const found = new Set(scans.map(scan => `${scan.path}|${scan.viewport}|${scan.state}`));
  if (found.size !== 36) return true;
  for (const path of AUDIT_PATHS) {
    for (const viewport of AUDIT_VIEWPORTS) {
      for (const state of AUDIT_STATES) {
        if (!found.has(`${path}|${viewport}|${state}`)) return true;
      }
    }
  }
  return Boolean(enforce) && countViolations(scans) > 0;
}
