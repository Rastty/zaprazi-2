// ZP_RELEASE_0_8_85
import { recommendBathroom } from "../../src/bathroom/engine.js";
import { getBathroomProducts } from "../../src/bathroom/catalog.js";
import { renderBathroomAcquisition } from "../../src/bathroom/acquisition-view.js";
import { installBathroomMicroStaging } from "../../src/bathroom/micro-staging.js";

const form = document.querySelector("#zp-toilet-chair-advisor");
const result = document.querySelector("#zp-toilet-chair-result");
const submitButton = document.querySelector("#zp-toilet-chair-submit");
const errorBox = document.querySelector("#zp-toilet-chair-errors");
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

  // Never keep a purchase link tied to old answers on the page.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  installBathroomMicroStaging({
    form, result, submit: submitButton, errors: errorBox,
    key: "toilet-chair", requiredAttr: "data-zp-chair-required",
    fitNames: ["spaceFit","loadFit"], primaryNeed: (value => value("chairMode") === "toilet_shower" ? "multifunction_toilet_shower" : "toilet_nearby")
  });

  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const groups = () => [...form.querySelectorAll("[data-zp-chair-required]")].filter((fieldset) => !fieldset.hidden && !fieldset.closest('[hidden]'));

  const validate = () => {
    const missing = groups().filter((fieldset) => !checkedValue(fieldset.dataset.zpChairRequired));
    groups().forEach((fieldset) => {
      const invalid = !checkedValue(fieldset.dataset.zpChairRequired);
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
      f.seatWidthCm ? `šířka sedáku: ${f.seatWidthCm} cm` : null,
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
            <a class="zp-link-btn" data-zp-chair-merchant-link="1" href="${escapeHtml(resolvedUrl)}" target="_blank" rel="${affiliateUrl ? "noopener nofollow sponsored" : "noopener nofollow"}">${affiliateUrl ? "Zobrazit cenu a dostupnost" : "Zobrazit produkt a dostupnost"}</a>
            ${affiliateUrl ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
          </div>
        ` : '<p class="zp-disclaimer">Obchodní odkaz zatím není další krok. Nejdřív dokončete uvedenou bezpečnostní nebo rozměrovou kontrolu.</p>'}
      </article>
    `;
  };

  form.addEventListener("change", (event) => {
    const group = event.target?.closest?.("[data-zp-chair-required]");
    if (group && checkedValue(group.dataset.zpChairRequired)) {
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

    const mode = checkedValue("chairMode");
    const output = recommendBathroom({
      primaryNeed: mode === "toilet_shower" ? "multifunction_toilet_shower" : "toilet_nearby",
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
      ${output.recommendations.map((item) => `<section class="zp-why-recommendation"><h3>Proč právě toto řešení?</h3><p>${escapeHtml(item.reason)}</p></section>`).join("")}
      ${renderBathroomAcquisition(output.status === "candidate" ? output.acquisition : [], escapeHtml)}
      ${products.length ? `<section class="zp-product-section"><h3>Ověřený výrobek k porovnání</h3><div class="zp-product-grid">${products.map((product) => renderProduct(product, allowOffer)).join("")}</div></section>` : ""}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-chair-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
