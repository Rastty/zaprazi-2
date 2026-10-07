// ZP_RELEASE_0_8_21
import { recommendAdjustableBed } from "../../src/bed/engine.js";
import { getAdjustableBedProducts } from "../../src/bed/catalog.js";

const form = document.querySelector("#zp-bed-advisor");
const result = document.querySelector("#zp-bed-result");
const submitButton = document.querySelector("#zp-bed-submit");
const errorBox = document.querySelector("#zp-bed-errors");
const candidateNote = document.querySelector("#zp-bed-candidate-note");
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

  const candidateSummary = (need) => ({
    home_positioning: "CLASSIC: max. hmotnost pacienta 178 kg, vnější rozměr 102,5 × 212 cm, výška 38,6–80,6 cm.",
    caregiver_access: "CLASSIC: max. hmotnost pacienta 178 kg, vnější rozměr 102,5 × 212 cm, výška 38,6–80,6 cm.",
    robust_high_load: "Hospital: nosnost 250 kg, vnější rozměr 105 × 214 cm, výška 40–70 cm.",
    advanced_in_bed_care: "Multibed: nosnost 260 kg, vnější rozměr 96 × 212 cm, výška 50–70 cm; matrace je součástí.",
    unknown: "Nejdřív vyberte hlavní praktickou potřebu."
  }[need] || "Nejdřív vyberte hlavní praktickou potřebu.");

  const updateCandidateNote = () => {
    candidateNote.innerHTML = `<strong>${escapeHtml(candidateSummary(checkedValue("primaryNeed", "unknown")))}</strong><p>Přesnou hmotnost člověka do poradce nezadávejte. Stačí ověřit, zda technický limit kandidáta bezpečně vyhovuje.</p>`;
  };

  const resolveOffer = (offer) => {
    const configured = offer.affiliateKey ? affiliateMap[offer.affiliateKey] : null;
    const affiliateUrl = typeof configured === "string" && configured.startsWith("https://") ? configured : null;
    return { ...offer, resolvedUrl: affiliateUrl || offer.url, isAffiliate: Boolean(affiliateUrl) };
  };

  const factsFor = (product) => {
    const f = product.facts || {};
    return [
      f.sleepingSurfaceCm ? `ložná plocha: ${f.sleepingSurfaceCm} cm` : null,
      f.outerSizeCm ? `vnější rozměr: ${f.outerSizeCm} cm` : null,
      f.heightRangeCm ? `výška ložné plochy: ${f.heightRangeCm} cm` : null,
      f.maxUserWeightKg ? `max. hmotnost pacienta: ${f.maxUserWeightKg} kg` : null,
      f.maxLoadKg ? `nosnost: ${f.maxLoadKg} kg` : null,
      f.safeWorkingLoadKg ? `pracovní zatížení: ${f.safeWorkingLoadKg} kg` : null,
      f.lateralTurnDeg ? `boční otáčení: do ${f.lateralTurnDeg}°` : null,
      f.mattressIncluded === true ? "matrace: součástí" : "matrace: není součástí"
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
                <div class="zp-offer">
                  <strong>${escapeHtml(offer.merchantName)}</strong>
                  <a class="zp-link-btn" data-zp-bed-merchant-link="1" href="${escapeHtml(offer.resolvedUrl)}" target="_blank" rel="${offer.isAffiliate ? "noopener nofollow sponsored" : "noopener nofollow"}">${offer.isAffiliate ? "Přejít k obchodníkovi" : "Zobrazit produkt u obchodníka"}</a>
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
      <h3>Jak postel získat</h3>
      <div>
        ${items.map((item) => `
          <article>
            <h4>${escapeHtml(item.label)}</h4>
            <p>${escapeHtml(item.reason)}</p>
            ${item.id === "rent_first" ? '<p><a class="zp-text-link" href="https://studenka.charita.cz/jak-pomahame/pujcovna-kompenzacnich-pomucek/" target="_blank" rel="noopener">Příklad místní půjčovny</a></p>' : ""}
            ${item.id === "check_reimbursement_or_circulation" ? '<p><a class="zp-text-link" href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/jake-jsou-podminky-predepsani-a-uhrady-polohovaciho-luzka" target="_blank" rel="noopener">Podmínky VZP</a></p>' : ""}
          </article>
        `).join("")}
      </div>
    </section>
  `;

  const visibleRequiredGroups = () =>
    [...form.querySelectorAll("[data-zp-bed-required]")];

  const validate = () => {
    const missing = visibleRequiredGroups().filter((fieldset) => !checkedValue(fieldset.dataset.zpBedRequired));

    visibleRequiredGroups().forEach((fieldset) => {
      const invalid = !checkedValue(fieldset.dataset.zpBedRequired);
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

  updateCandidateNote();

  form.addEventListener("change", (event) => {
    if (event.target?.name === "primaryNeed") updateCandidateNote();

    const group = event.target?.closest?.("[data-zp-bed-required]");
    if (group && checkedValue(group.dataset.zpBedRequired)) {
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

    const output = recommendAdjustableBed({
      primaryNeed: checkedValue("primaryNeed", "unknown"),
      transferAbility: checkedValue("transferAbility", "unknown"),
      loadFit: checkedValue("loadFit", "unknown"),
      spaceFit: checkedValue("spaceFit", "unknown"),
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
    const products = getAdjustableBedProducts(ids);

    if (!["needs_more_info", "invalid_input"].includes(output.status)) track("builder_complete");
    if (output.recommendations.length) track("recommendation_view");

    result.innerHTML = `
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${recommendations}
      ${renderProducts(products)}
      ${output.status === "candidate" ? renderAcquisition(output.acquisition) : ""}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-bed-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
