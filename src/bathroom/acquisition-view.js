// ZP_RELEASE_0_8_68
/**
 * A single safe acquisition presentation for all five narrow Bathroom/WC Advisors.
 * Values come exclusively from recommendBathroom().acquisition (not affiliate ranking).
 * No product or merchant links are emitted, and only known education URL is allowed.
 */
export function renderBathroomAcquisition(items = [], escapeHtml) {
  if (!Array.isArray(items) || !items.length) return "";
  if (typeof escapeHtml !== "function") throw new Error("HTML escape function required");
  const rows = items.map(item => {
    const link = item.id === "check_reimbursement_alternative"
      ? '<p><a class="zp-text-link" href="/pomucky-do-koupelny-na-pojistovnu/">Jak ověřit možnosti úhrady</a></p>'
      : "";
    return `<article><h4>${escapeHtml(item.label)}</h4><p>${escapeHtml(item.reason)}</p>${link}</article>`;
  }).join("");
  return `<section class="zp-acquisition-summary"><h3>Jak pomůcku získat</h3><div>${rows}</div></section>`;
}
