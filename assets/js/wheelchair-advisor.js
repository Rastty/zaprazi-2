// ZP_RELEASE_0_8_59
import { recommendWheelchair } from "../../src/wheelchair/engine.js";
import { getWheelchairProducts } from "../../src/wheelchair/catalog.js";

const form = document.querySelector("#zp-wheelchair-advisor");
const result = document.querySelector("#zp-wheelchair-result");
const submitButton = document.querySelector("#zp-wheelchair-submit");
const errorBox = document.querySelector("#zp-wheelchair-errors");
const candidateNote = document.querySelector("#zp-wheelchair-candidate-note");
const runtime = window.ZaPraziRuntime || { affiliateMap: {} };
const affiliateMap = runtime.affiliateMap || {};
let builderStarted = false;

const track = (eventName) => {
  window.dispatchEvent(new CustomEvent("zaprazi:analytics", { detail: { event: eventName } }));
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

if (form && result && submitButton && errorBox && candidateNote) {
  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const candidateSummary = (propulsion) => ({
    companion: "Basic: sed 48 cm, celková šířka 65 cm, nosnost 100 kg, hmotnost 18,4 kg.",
    self_manual: "Odlehčený vozík: sed 48 nebo 51 cm, celková šířka 68 nebo 70 cm, nosnost 125/136 kg podle kol.",
    mixed_manual: "Odlehčený vozík: sed 48 nebo 51 cm, hnací obruče pro uživatele a brzdy pro doprovod.",
    powered: "Elektrický vozík: sed 46 cm, celková šířka 63 cm, nosnost 135 kg, hmotnost s baterií 62 kg, poloměr otáčení 86,5 cm.",
    unknown: "Nejdřív vyberte, kdo má vozík běžně pohánět."
  }[propulsion] || "Nejdřív vyberte, kdo má vozík běžně pohánět.");

  const updateConditional = () => {
    const powered = checkedValue("propulsion", "unknown") === "powered";
    form.querySelectorAll("[data-zp-wheelchair-conditional='powered']").forEach((fieldset) => {
      fieldset.hidden = !powered;
      if (!powered) {
        fieldset.querySelectorAll("input").forEach((input) => {
          input.checked = false;
          input.required = false;
        });
        fieldset.classList.remove("is-error");
        fieldset.removeAttribute("aria-invalid");
      }
    });
  };

  const updateCandidateNote = () => {
    candidateNote.innerHTML = `<strong>${escapeHtml(candidateSummary(checkedValue("propulsion", "unknown")))}</strong><p>Nosnost a šířku sedu ověřte mimo poradce; přesnou hmotnost člověka sem nezadávejte.</p>`;
  };

  const resolveOffer = (offer) => {
    const configured = offer.affiliateKey ? affiliateMap[offer.affiliateKey] : null;
    const affiliateUrl = typeof configured === "string" && configured.startsWith("https://") ? configured : null;
    return { ...offer, resolvedUrl: affiliateUrl || offer.url, isAffiliate: Boolean(affiliateUrl) };
  };

  const factsFor = (product) => {
    const f = product.facts || {};
    return [
      f.seatWidthCm ? `šířka sedu: ${f.seatWidthCm} cm` : null,
      f.totalWidthCm ? `celková šířka: ${f.totalWidthCm} cm` : null,
      f.outerSizeCm ? `celkové rozměry: ${f.outerSizeCm} cm` : null,
      f.maxUserWeightKg ? `nosnost: ${f.maxUserWeightKg} kg` : null,
      f.chairWeightKg ? `hmotnost vozíku: ${f.chairWeightKg} kg` : null,
      f.chairWeightWithBatteryKg ? `hmotnost s baterií: ${f.chairWeightWithBatteryKg} kg` : null,
      f.maxSpeedKmh ? `max. rychlost: ${f.maxSpeedKmh} km/h` : null,
      f.turningRadiusCm ? `poloměr otáčení: ${f.turningRadiusCm} cm` : null
    ].filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  };

  const renderProducts = (products) => {
    if (!products.length) return "";
    return `
      <section class="zp-product-section">
        <h3>Ověřený kandidát k porovnání</h3>
        <div class="zp-product-grid">
          ${products.map((product) => {
            const offer = resolveOffer(product.offers[0]);
            return `
              <article class="zp-product-card">
                <h4>${escapeHtml(product.name)}</h4>
                <ul class="zp-facts">${factsFor(product)}</ul>
                <details><summary>Co ještě ověřit</summary><ul>${product.selectionNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul></details>
                <details class="zp-sources"><summary>Zdroje a datum ověření</summary><ul>${product.evidence.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Ověřit zdroj</a> <small>ověřeno ${escapeHtml(source.checkedAt)}</small></li>`).join("")}</ul></details>
                <div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small>
                  <strong>${escapeHtml(offer.merchantName)}</strong>
                  <a class="zp-link-btn" data-zp-wheelchair-merchant-link="1" href="${escapeHtml(offer.resolvedUrl)}" target="_blank" rel="${offer.isAffiliate ? "noopener nofollow sponsored" : "noopener nofollow"}">${offer.isAffiliate ? "Zobrazit cenu a dostupnost" : "Zobrazit produkt a dostupnost"}</a>
                  ${offer.isAffiliate ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  };

  const renderAcquisition = (items = []) => `
    <section class="zp-acquisition-summary">
      <h3>Jak vozík získat</h3>
      <div>
        ${items.map((item) => `
          <article>
            <h4>${escapeHtml(item.label)}</h4>
            <p>${escapeHtml(item.reason)}</p>
            ${item.id === "check_insurer" || item.id === "check_insurer_or_specialist" ? '<p><a class="zp-text-link" href="https://www.vzp.cz/poskytovatele/informace-pro-praxi/poradna/ziskani-invalidniho-voziku-a-mozne-chyby-pri-zpracovani-zadosti-o-nej" target="_blank" rel="noopener">Jak VZP popisuje získání vozíku</a></p>' : ""}
          </article>
        `).join("")}
      </div>
    </section>
  `;

  const visibleRequiredGroups = () =>
    [...form.querySelectorAll("[data-zp-wheelchair-required]")].filter((fieldset) => !fieldset.hidden);

  const validate = () => {
    const missing = visibleRequiredGroups().filter((fieldset) => !checkedValue(fieldset.dataset.zpWheelchairRequired));

    visibleRequiredGroups().forEach((fieldset) => {
      const invalid = !checkedValue(fieldset.dataset.zpWheelchairRequired);
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

  updateConditional();
  updateCandidateNote();

  form.addEventListener("change", (event) => {
    if (event.target?.name === "propulsion") {
      updateConditional();
      updateCandidateNote();
    }

    const group = event.target?.closest?.("[data-zp-wheelchair-required]");
    if (group && checkedValue(group.dataset.zpWheelchairRequired)) {
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

    const output = recommendWheelchair({
      propulsion: checkedValue("propulsion", "unknown"),
      transferAbility: checkedValue("transferAbility", "unknown"),
      seatFit: checkedValue("seatFit", "unknown"),
      widthFit: checkedValue("widthFit", "unknown"),
      loadFit: checkedValue("loadFit", "unknown"),
      joystickSafe: checkedValue("joystickSafe", "unknown"),
      chargingReady: checkedValue("chargingReady", "unknown"),
      duration: checkedValue("duration", "unknown")
    });

    const recommendations = output.recommendations.map((item) => `
      <article>
        <h3>${escapeHtml(item.label)}</h3>
        <p>${escapeHtml(item.reason)}</p>
        <h4>Co ověřit před rozhodnutím</h4>
        <ul>${item.parameters.map((parameter) => `<li>${escapeHtml(parameter)}</li>`).join("")}</ul>
      </article>
    `).join("");

    const ids = output.recommendations.flatMap((item) => item.productCandidateIds ?? []);
    const products = getWheelchairProducts(ids);

    if (!["needs_more_info", "invalid_input"].includes(output.status)) track("builder_complete");
    if (output.recommendations.length) track("recommendation_view");

    result.innerHTML = `
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${recommendations}
      ${renderProducts(products)}
      ${output.acquisition?.length ? renderAcquisition(output.acquisition) : ""}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-wheelchair-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
