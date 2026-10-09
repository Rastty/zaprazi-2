function normalizeUrl(value) {
  return String(value || "")
    .trim()
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "");
}

/**
 * Evidence transparency must never become a hidden purchase-path bypass.
 * A URL that is also a merchant offer may be linked only after the relevant
 * product-fit gate has been completed.
 */
export function canLinkEvidence(url, commerceUrls = [], commerceUnlocked = false) {
  if (!url) return false;
  if (commerceUnlocked) return true;
  const target = normalizeUrl(url);
  return !commerceUrls.some(value => normalizeUrl(value) === target);
}
