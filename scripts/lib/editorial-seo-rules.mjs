/**
 * Pure editorial SEO checks. Browser/network work belongs to the read-only
 * runner; these checks never edit WordPress or imply Google indexation.
 */
export function summarizeEditorialPages(pages, site = "https://zaprazi.cz") {
  const byPath = new Map(pages.map(p => [p.path, p]));
  const errors = [], warnings = [], edges = [];
  const add = (bucket, path, code, details = "") => bucket.push({path, code, details});
  const titleMap = new Map(), descriptionMap = new Map();

  for (const p of pages) {
    if (p.status !== 200) {
      add(errors, p.path, "HTTP_NOT_200", String(p.status)); continue;
    }
    if (p.h1.length !== 1) add(errors, p.path, "H1_COUNT", String(p.h1.length));
    if (!p.title?.trim()) add(errors, p.path, "MISSING_TITLE");
    if (!p.description?.trim()) add(warnings, p.path, "MISSING_DESCRIPTION");
    const url = new URL(p.canonical || site + "/", site);
    if (url.origin !== site || url.pathname !== p.path || url.search || url.hash) {
      add(errors, p.path, "CANONICAL_MISMATCH", p.canonical);
    }
    if (/(^|[,\s])noindex\b/i.test(p.robots)) add(errors, p.path, "NOINDEX", p.robots);
    if (p.title) {
      const norm = p.title.toLocaleLowerCase("cs").trim();
      if (titleMap.has(norm)) add(warnings, p.path, "DUPLICATE_TITLE", titleMap.get(norm));
      titleMap.set(norm, p.path);
    }
    if (p.description) {
      const norm = p.description.toLocaleLowerCase("cs").trim();
      if (descriptionMap.has(norm)) add(warnings, p.path, "DUPLICATE_DESCRIPTION", descriptionMap.get(norm));
      descriptionMap.set(norm, p.path);
    }
    if ((p.mainContentLinks || []).length === 0) add(warnings, p.path, "NO_CONTEXTUAL_INTERNAL_LINKS");
    if ((p.mainWords || 0) < 80) add(warnings, p.path, "VERY_THIN_MAIN", String(p.mainWords));
    for (const href of p.mainContentLinks || []) {
      let linked;
      try { linked = new URL(href, site); } catch { continue; }
      if (linked.origin !== site) continue;
      if (linked.protocol !== "https:") add(warnings, p.path, "HTTP_INTERNAL_LINK", href);
      const target = byPath.get(linked.pathname);
      if (!target) continue;
      edges.push({from:p.path,to:target.path,hash:linked.hash});
      if (linked.hash && !(target.ids || []).includes(decodeURIComponent(linked.hash.slice(1)))) {
        add(warnings, p.path, "BROKEN_INPAGE_ANCHOR", href);
      }
    }
  }
  const inbound = Object.fromEntries(pages.map(p => [p.path, 0]));
  for (const path of new Set(edges.filter(e=>e.from!==e.to).map(e=>e.from+"|"+e.to))) {
    const to=path.slice(path.indexOf("|")+1);
    inbound[to]=(inbound[to] || 0)+1;
  }
  for (const p of pages) {
    if (p.path !== "/" && inbound[p.path] === 0) add(warnings, p.path, "ZERO_CORE_CONTEXT_INBOUND",
      "No content link from other sampled main content; may still have nav/footer inbound");
  }
  return {
    audited:pages.length, errors, warnings, edges:edges.length,
    inbound, pages:pages.map(p => ({
      path:p.path,status:p.status,h1:p.h1.length,title:p.title,
      descriptionLength:p.description?.length || 0,canonical:p.canonical,
      robots:p.robots,words:p.mainWords,
      outboundCore:[...new Set(edges.filter(e=>e.from===p.path).map(e=>e.to))].length,
      inboundCore:inbound[p.path],
      mainContentInternalLinks:p.mainContentLinks?.length||0
    })),
    limitations:"Public HTML quality/link graph only. Excludes Google indexation, SERP positions, traffic, backlinks and historical post bodies."
  };
}
