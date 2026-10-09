// ZP_RELEASE_0_8_75
/**
 * Shared acquisition guidance for the main Bathroom Advisor and five focused
 * Bathroom/WC Advisors. Recommendation data is deterministic engine output.
 * This module never emits merchant links or processes user answers.
 */
const RENTAL_STEP_IDS = new Set(["compare_rent_buy", "compare_buy_rent", "compare_acquisition"]);

const rentalHowTo = `
  <details class="zp-acquisition-rental">
    <summary>Jak ověřit půjčení ve svém okolí</summary>
    <ol>
      <li>Vyhledejte půjčovnu kompenzačních pomůcek ve svém městě či okolí (například u místní Charity nebo poskytovatele sociálních služeb).</li>
      <li>Telefonicky ověřte dostupnost konkrétního typu, potřebné rozměry a nosnost, cenu za týden nebo měsíc, kauci a možnost dopravy.</li>
      <li>Před převzetím si nechte ukázat bezpečné použití, zkontrolujte stav a vyčištění pomůcky, návod i podmínky vrácení.</li>
    </ol>
    <p class="zp-muted-copy">Půjčovny jsou místní služby; dostupnost konkrétní pomůcky ani její vhodnost nelze zaručit online.</p>
  </details>`;

const reimbursementLinks = `
  <p><a class="zp-text-link" href="/pomucky-do-koupelny-na-pojistovnu/">Jak ověřit možnosti úhrady</a></p>
  <p><a class="zp-text-link" href="https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/" target="_blank" rel="noopener">Aktuální seznam SÚKL</a>
  · <a class="zp-text-link" href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/zdravotnicke-pomucky-pro-imobilni-pacienty" target="_blank" rel="noopener">Zdroj VZP</a></p>`;

export function renderBathroomAcquisition(items = [], escapeHtml) {
  if (!Array.isArray(items) || !items.length) return "";
  if (typeof escapeHtml !== "function") throw new Error("HTML escape function required");
  const rows = items.map(item => {
    const rental = RENTAL_STEP_IDS.has(item.id) ? rentalHowTo : "";
    const reimbursement = item.id === "check_reimbursement_alternative" ? reimbursementLinks : "";
    return `<article><h4>${escapeHtml(item.label)}</h4><p>${escapeHtml(item.reason)}</p>${rental}${reimbursement}</article>`;
  }).join("");
  return `<section class="zp-acquisition-summary"><h3>Jak pomůcku získat</h3><div>${rows}</div></section>`;
}
