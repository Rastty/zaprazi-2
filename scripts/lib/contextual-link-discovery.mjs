/**
 * Contextual discoverability of the fixed, public Zápraží decision-page set.
 * Uses only the links already captured by the read-only live link audit;
 * performs no additional requests and never handles GSC query/user data.
 *
 * This is an editorial main-content graph, NOT a statement about Google
 * indexing, sitewide menus, XML sitemap coverage or actual PageRank.
 */

const canonicalPage = value =>
  typeof value === "string" && /^\/(?:[a-z0-9_-]+\/)*$/i.test(value) &&
  !/^\/(?:wp-|wp\/|go\/|out\/|click\/|affiliate\/|track\/|redirect\/)/i.test(value);

export function contextualLinkDiscovery(preparedTargets, sourcePages, decisionPaths) {
  if (!Array.isArray(preparedTargets) || !Array.isArray(sourcePages) ||
      !Array.isArray(decisionPaths) || decisionPaths.length > 100 ||
      sourcePages.length > 101) throw Error("Invalid bounded contextual link input");

  const expected = ["/", ...decisionPaths];
  if (new Set(expected).size !== expected.length ||
      expected.some(path => !canonicalPage(path)))
    throw Error("Invalid curated decision paths");

  // If one page could not be read, there is no evidence it has zero links.
  // Do not produce a false orphan-page list from an incomplete scan.
  if (new Set(sourcePages).size !== sourcePages.length ||
      sourcePages.some(path => !canonicalPage(path) || !expected.includes(path)))
    throw Error("Unexpected contextual source pages");
  if (sourcePages.length !== expected.length ||
      expected.some(path => !sourcePages.includes(path)))
    return {
      status: "incomplete", scanned_pages: sourcePages.length,
      expected_pages: expected.length,
      limitation: "Incomplete public main-content crawl; no inbound-link or reachability claims."
    };

  const known = new Set(expected);
  const inbound = new Map(expected.map(path => [path, new Set()]));
  const outgoing = new Map(expected.map(path => [path, new Set()]));
  for (const target of preparedTargets) {
    if (!target || !known.has(target.path) || !Array.isArray(target.sources)) continue;
    for (const source of target.sources) {
      if (!known.has(source) || source === target.path) continue;
      inbound.get(target.path).add(source);
      outgoing.get(source).add(target.path);
    }
  }

  const distances = new Map([["/", 0]]);
  const queue = ["/"];
  for (let i = 0; i < queue.length; i++) {
    const source = queue[i];
    for (const target of outgoing.get(source)) {
      if (distances.has(target)) continue;
      distances.set(target, distances.get(source) + 1);
      queue.push(target);
    }
  }

  const pages = decisionPaths.map(path => {
    const from = inbound.get(path);
    return {
      path,
      inbound_contextual_sources: from.size,
      inbound_from_other_decision_pages: [...from].filter(source => source !== "/").length,
      linked_from_homepage_main: from.has("/"),
      homepage_main_depth: distances.get(path) ?? null
    };
  });
  const needsAttention = pages.filter(page =>
    page.inbound_from_other_decision_pages === 0 || page.homepage_main_depth === null)
    .sort((a, b) => a.inbound_from_other_decision_pages - b.inbound_from_other_decision_pages ||
      (a.homepage_main_depth === null ? -1 : 0) -
      (b.homepage_main_depth === null ? -1 : 0) || a.path.localeCompare(b.path));
  return {
    status: "complete",
    scanned_pages: sourcePages.length,
    decision_pages: pages.length,
    with_homepage_main_link: pages.filter(page => page.linked_from_homepage_main).length,
    with_no_other_editorial_inbound: pages.filter(page =>
      page.inbound_from_other_decision_pages === 0).length,
    unreachable_from_homepage_main: pages.filter(page =>
      page.homepage_main_depth === null).length,
    weak_contextual_discovery: needsAttention.slice(0, 15),
    weak_contextual_discovery_total: needsAttention.length,
    // Full bounded table lets the SEO owner correlate ANY Google-excluded URL
    // with links, including healthy ones absent from the weak-top-15 summary.
    pages,
    limitation: "Only curated public main-content links; menus, archive articles, external links and Google indexation are not assessed. Missing contextual links are hypotheses for editorial review, not proof of deindexation."
  };
}
