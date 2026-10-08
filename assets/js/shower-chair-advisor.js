// ZP_RELEASE_0_8_57
import { recommendBathroom } from "../../src/bathroom/engine.js";
import { getBathroomProducts } from "../../src/bathroom/catalog.js";

const form = document.querySelector("#zp-shower-chair-advisor");
const result = document.querySelector("#zp-shower-chair-result");
const submitButton = document.querySelector("#zp-shower-chair-submit");
const errorBox = document.querySelector("#zp-shower-chair-errors");
const runtime = window.ZaPraziRuntime || { affiliateMap: {} };
const affiliateMap = runtime.affiliateMap || {};
let builderStarted = false;

const track = (eventName) => {
  window.dispatchEvent(new CustomEvent("zaprazi:analytics", { detail: { event: eventName } }));
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

if (form && result && submitButton && errorBox) {
  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const groups = () => [...form.querySelectorAll("[data-zp-shower-required]")];

  const validate = () => {
    const missing = groups().filter((fieldset) => !checkedValue(fieldset.dataset.zpShowerRequired));
    groups().forEach((fieldset) => {
      const invalid = !checkedValue(fieldset.dataset.zpShowerRequired);
      fieldset.classList.toggle("is-error", invalid);
      if (invalid) fieldset.setAttribute("aria-invalid", "true");
      else fieldset.removeAttribute("aria-invalid");
    });

    if (!missing.length) {
      errorBox.hidden = true;
      errorBox.textContent = "";
      return true;
    }

    errorBox.textContent = missing.length === 1
      ? "Doplňte prosím zvýrazněnou otázku."
      : `Doplňte prosím ${missing.length} zvýrazněné otázky.`;
    errorBox.hidden = false;
    missing[0].setAttribute("tabindex", "-1");
    missing[0].focus();
    return false;
  };

  const renderProduct = (product, allowOffer) => {
    const offer = product.offers?.[0];
    if (!offer) return "";

    const configured = offer.affiliateKey ? affiliateMap[offer.affiliateKey] : null;
    const affiliateUrl = typeof configured === "string" && configured.startsWith("https://") ? configured : null;
    const resolvedUrl = affiliateUrl || offer.url;
    const f = product.facts || {};
    const facts = [
      f.totalWidthCm ? `celková šířka: ${f.totalWidthCm} cm` : null,
      f.totalDepthCm ? `celková hloubka: ${f.totalDepthCm} cm` : null,
      f.seatHeightCm ? `výška sedu: ${f.seatHeightCm} cm` : null,
      f.seatCm ? `sedák: ${f.seatCm} cm` : null,
      f.maxUserWeightKg ? `max. nosnost: ${f.maxUserWeightKg} kg` : null,
      f.weightKg ? `hmotnost: ${f.weightKg} kg` : null
    ].filter(Boolean);

    return `
      <article class="zp-product-card">
        <h4>${escapeHtml(product.name)}</h4>
        <ul class="zp-facts">${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
        <details>
          <summary>Co ještě ověřit</summary>
          <ul>${product.selectionNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
        </details>
        <details class="zp-sources">
          <summary>Zdroje a datum ověření</summary>
          <ul>${product.evidence.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Ověřit zdroj</a> <small>ověřeno ${escapeHtml(source.checkedAt)}</small></li>`).join("")}</ul>
        </details>
        ${allowOffer ? `
          <div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small>
            <strong>${escapeHtml(offer.merchantName)}</strong>
            <a class="zp-link-btn" data-zp-shower-merchant-link="1" href="${escapeHtml(resolvedUrl)}" target="_blank" rel="${affiliateUrl ? "noopener nofollow sponsored" : "noopener nofollow"}">${affiliateUrl ? "Zobrazit cenu a dostupnost" : "Zobrazit produkt a dostupnost"}</a>
            ${affiliateUrl ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
          </div>
        ` : '<p class="zp-disclaimer">Obchodní odkaz zatím není další krok. Nejdřív dokončete uvedenou bezpečnostní nebo rozměrovou kontrolu.</p>'}
      </article>
    `;
  };

  form.addEventListener("change", (event) => {
    const group = event.target?.closest?.("[data-zp-shower-required]");
    if (group && checkedValue(group.dataset.zpShowerRequired)) {
      group.classList.remove("is-error");
      group.removeAttribute("aria-invalid");
    }
    if (!builderStarted) {
      builderStarted = true;
      track("builder_start");
    }
  });

  submitButton.addEventListener("click", () => {
    if (!validate()) return;

    const output = recommendBathroom({
      primaryNeed: "shower_seated",
      transferAbility: checkedValue("transferAbility", "unknown"),
      floorStable: checkedValue("floorStable", "unknown"),
      spaceFit: checkedValue("spaceFit", "unknown"),
      loadFit: checkedValue("loadFit", "unknown"),
      duration: checkedValue("duration", "unknown")
    });

    const ids = output.recommendations.flatMap((item) => item.productCandidateIds ?? []);
    const products = getBathroomProducts(ids);
    const allowOffer = output.status === "candidate";

    if (!["needs_more_info", "invalid_input"].includes(output.status)) track("builder_complete");
    if (products.length) track("recommendation_view");

    result.innerHTML = `
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${products.length ? `<section class="zp-product-section"><h3>Ověřený výrobek k porovnání</h3><div class="zp-product-grid">${products.map((product) => renderProduct(product, allowOffer)).join("")}</div></section>` : ""}
      ${output.status === "candidate" ? '<p><a class="zp-text-link" href="/pomucky-do-koupelny-na-pojistovnu/">Prověřit také cestu přes pojišťovnu</a></p>' : ""}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-shower-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
