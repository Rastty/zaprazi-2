/**
 * Public CI reports must not echo untrusted page titles, meta tags, JSON-LD,
 * links, query strings, URL fragments or browser exception text. The raw
 * report stays in memory for the actual SEO assertions; only fixed issue codes
 * and bounded, non-identifying counts may be serialized to Actions logs.
 */
const safePath = value => typeof value === "string" &&
  /^\/(?:[a-z0-9-]+\/)?$/.test(value) ? value : "unlisted_path";
const safeCode = value => typeof value === "string" &&
  /^[A-Z][A-Z0-9_]*$/.test(value) ? value : "UNCLASSIFIED";
const count = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
const status = value => Number.isInteger(value) && value >= 100 && value <= 599
  ? value : value === "fetch_error" ? "fetch_error" : "unknown";

export function publicEditorialReport(report) {
  const issues = rows => (Array.isArray(rows) ? rows : []).map(({path,code}) => ({
    path:safePath(path),code:safeCode(code)
  }));
  const inbound = Object.fromEntries(Object.entries(report.inbound || {})
    .filter(([path]) => safePath(path) !== "unlisted_path")
    .map(([path,value]) => [path,count(value)]));
  return {
    summary:{
      audited:count(report.audited),
      errors:issues(report.errors),
      warnings:issues(report.warnings),
      edges:count(report.edges),
      inbound,
      limitations:"Public HTML quality and link audit only; not evidence of indexation, traffic or commissions."
    },
    pages:(Array.isArray(report.pages) ? report.pages : []).map(page => ({
      path:safePath(page.path),status:status(page.status),
      h1:count(page.h1),descriptionLength:count(page.descriptionLength),
      words:count(page.words),outboundCore:count(page.outboundCore),
      inboundCore:count(page.inboundCore),
      mainContentInternalLinks:count(page.mainContentInternalLinks)
    }))
  };
}
