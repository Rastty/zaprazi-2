/**
 * Source-agnostic signals only. Counts do NOT establish editorial accuracy,
 * duplication, indexation, traffic, or permission to remove any URL.
 */
const textOnly = html => String(html || "")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
  .replace(/<[^>]*>/g, " ")
  .replace(/&(?:nbsp|amp|quot|lt|gt|hellip|mdash|ndash);/gi, " ")
  .replace(/&#(?:x[0-9a-f]+|\d+);/gi, " ")
  .replace(/\s+/g, " ").trim();

export function inspectLegacyPost(row) {
  if (!Number.isSafeInteger(row?.id) || row.id <= 0 ||
      typeof row.link !== "string" ||
      typeof row.content?.rendered !== "string") {
    throw new Error("Incomplete public post row: id/link/rendered content required");
  }
  const url = new URL(row.link);
  if (url.origin !== "https://zaprazi.cz" || url.search || url.hash ||
      !/^\/[a-z0-9-]+\/$/.test(url.pathname)) {
    throw new Error("Unexpected post URL in public WordPress response");
  }
  const html = row.content.rendered;
  const text = textOnly(html);
  const words = text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || [];
  const wordCount = words.length;
  const markup = {
    doctype: (html.match(/<!doctype\b/gi) || []).length,
    html: (html.match(/<html\b/gi) || []).length,
    head: (html.match(/<head\b/gi) || []).length,
    body: (html.match(/<body\b/gi) || []).length
  };
  const embeddedDocument = Object.values(markup).some(n => n > 0);
  const legacyCta = /\bsu-button\b|href\s*=\s*["']https?:\/\/zaprazi\.cz\/fotovoltaika(?:\/|["'#?])/i.test(html);
  const brokenImage = /<img\b[^>]*\bsrc\s*=\s*["'](?:\s*|https?:\/\/[^"']*404[^"']*)["']/i.test(html);
  return {
    id: row.id, path: url.pathname, modified: String(row.modified || "").slice(0, 19),
    words: wordCount, empty: wordCount === 0, thin: wordCount > 0 && wordCount < 120,
    embedded_document: embeddedDocument, doc_markers: markup,
    repeated_doctype: markup.doctype > 1,
    legacy_cta: legacyCta, empty_or_suspicious_image: brokenImage
  };
}

export function summarizeLegacyContent(inspected, expectedTotal, pagesFetched) {
  if (!Number.isSafeInteger(expectedTotal) || expectedTotal < 0) {
    throw new Error("Missing authoritative REST total");
  }
  if (inspected.length !== expectedTotal) {
    throw new Error("Incomplete legacy corpus: inspected " + inspected.length +
      " of " + expectedTotal + ". Never publish partial results as complete.");
  }
  const ids = inspected.map(row => row.id);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate post id in REST pagination");
  const count = key => inspected.filter(row => row[key]).length;
  const rank = inspected.filter(row => row.embedded_document || row.empty || row.thin)
    .sort((a,b) => Number(b.embedded_document) - Number(a.embedded_document)
      || Number(b.empty) - Number(a.empty)
      || a.words - b.words);
  return {
    observed_at_utc: new Date().toISOString(),
    scope: "Public WordPress REST rendered post content (not Search Console)",
    expected_total: expectedTotal, inspected: inspected.length, pages_fetched: pagesFetched,
    zero_text: count("empty"), thin_under_120_words: count("thin"),
    embedded_full_document_markup: count("embedded_document"),
    repeated_doctype: count("repeated_doctype"),
    obsolete_su_button_or_photovoltaika_cta: count("legacy_cta"),
    empty_or_suspicious_image_src: count("empty_or_suspicious_image"),
    priority_review_sample: rank.slice(0, 18).map(row => ({
      id: row.id, path: row.path, words: row.words,
      embedded_document: row.embedded_document, doctype: row.doc_markers.doctype,
      legacy_cta: row.legacy_cta
    })),
    limitations: "Heuristic flags, not proof of an invalid page or Google issue. No GSC clicks, indexation, backlinks, business value, redirects, writes or deletion."
  };
}
