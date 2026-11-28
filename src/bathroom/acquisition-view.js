// ZP_RELEASE_0_8_253
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
  <p><a class="zp-text-link" href="/pomucky-do-koupelny-na-pojistovnu/" target="_blank" rel="noopener noreferrer">Jak ověřit možnosti úhrady (otevře se v nové kartě)</a></p>
  <p class="zp-muted-copy">Rozpracované odpovědi zůstanou v původní kartě poradce.</p>
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


// Fixed first-party editorial destinations, selected only from the actual
// candidate products. No query parameters, answers or new offer events.
const COMPARISON_GUIDES = Object.freeze({
  "unizdrav-p2062": [
    ["/sprchovaci-zidle-pro-seniory/#srovnani-sprchovacich-zidli", "Porovnat rozměry tří sprchovacích židlí"],
    ["/sprchovaci-zidle-pro-seniory/#pujceni-sprchovaci-zidle", "Ceny a podmínky čtyř půjčoven"]
  ],
  "unizdrav-p2868": [
    ["/nastavec-na-wc-pro-seniory/#srovnani-nastavcu-na-wc", "Porovnat výšky a uchycení čtyř nástavců"]
  ],
  "besco-bs15": [
    ["/nastavec-na-wc-pro-seniory/#srovnani-nastavcu-na-wc", "Porovnat výšky a uchycení čtyř nástavců"]
  ],
  "unizdrav-p2807": [
    ["/toaletni-zidle-pro-seniory/#srovnani-toaletnich-zidli", "Porovnat čtyři toaletní židle a jejich obsluhu"],
    ["/toaletni-zidle-pro-seniory/#nahradni-nadoba-toaletni-zidle", "Jak ověřit správnou náhradní nádobu"]
  ],
  "dma-eh-cmda": [
    ["/toaletni-zidle-pro-seniory/#srovnani-toaletnich-zidli", "Porovnat čtyři toaletní židle a jejich obsluhu"],
    ["/toaletni-zidle-pro-seniory/#nahradni-nadoba-toaletni-zidle", "Jak ověřit správnou náhradní nádobu"]
  ]
});

export function renderBathroomComparisonLinks(outcome, products) {
  if (outcome?.status !== "candidate" || !Array.isArray(products)) return "";
  const links = new Map();
  for (const product of products) {
    if (!product || !Object.hasOwn(COMPARISON_GUIDES, product.id)) continue;
    for (const [url, label] of COMPARISON_GUIDES[product.id]) links.set(url, label);
  }
  if (!links.size) return "";
  // URL and label are from the fixed map, never from product input.
  return `<section class="zp-acquisition-summary" aria-label="Porovnání před nákupem">
    <h3>Ještě než objednáte: porovnejte rozměry a způsob pořízení</h3>
    <p>V průvodcích jsou i jiné katalogové modely. Nejsou automaticky ověřené pro vaše podmínky; každý potřebuje vlastní kontrolu vhodnosti.</p>
    <ul>${[...links].map(([url,label])=>`<li><a class="zp-text-link" href="${url}" target="_blank" rel="noopener noreferrer">${label} (nová karta)</a></li>`).join("")}</ul>
    <p class="zp-muted-copy">Odpovědi zůstanou v původní kartě poradce. Odkazy nevedou na obchodníky.</p>
  </section>`;
}
