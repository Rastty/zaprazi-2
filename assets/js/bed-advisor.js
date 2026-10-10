// ZP_RELEASE_0_8_96
import { recommendAdjustableBed } from "../../src/bed/engine.js";
import { getAdjustableBedProducts } from "../../src/bed/catalog.js";
import { previewAdjustableBed } from "../../src/decision/product-preview.js";

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

  // A result belongs to the exact answers used to produce it.
  // Hide and remove any previous outbound offer as soon as an answer changes.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  const preview = document.querySelector("#zp-bed-preview");
  const fitStage = document.querySelector("#zp-bed-fit-stage");
  let previewReady = false;
  const fitFields = ["loadFit","spaceFit","userCapacityVerified"];
  if (preview && fitStage) {
    for (const name of fitFields) {
      const fieldset = form.querySelector(`[data-zp-product-fit][data-zp-bed-required="${name}"]`);
      if (fieldset) fitStage.appendChild(fieldset);
    }
  }

  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const updateCapacityQuestion = () => {
    const capacityGroup = form.querySelector('[data-zp-product-fit][data-zp-bed-required="userCapacityVerified"]');
    if (!capacityGroup) return;
    const need = checkedValue("primaryNeed", "unknown");
    const required = ["robust_high_load", "advanced_in_bed_care"].includes(need);
    capacityGroup.hidden = !required;
    if (!required) {
      capacityGroup.querySelectorAll('input').forEach(input => { input.checked = false; });
    }
  };

  const candidateSummary = (need) => ({
    home_positioning: "CLASSIC: max. hmotnost pacienta 178 kg, vnější rozměr 102,5 × 212 cm, výška 38,6–80,6 cm.",
    caregiver_access: "CLASSIC: max. hmotnost pacienta 178 kg, vnější rozměr 102,5 × 212 cm, výška 38,6–80,6 cm.",
    robust_high_load: "Hospital: obecně uváděná nosnost 250 kg; samostatný limit hmotnosti uživatele není na produktové stránce doložen. Rozměr 105 × 214 cm.",
    advanced_in_bed_care: "Multibed: obecně uváděná nosnost 260 kg; samostatný limit hmotnosti uživatele není na produktové stránce doložen. Vnější rozměr 96 × 212 cm; matrace je součástí.",
    unknown: "Nejdřív vyberte hlavní praktickou potřebu."
  }[need] || "Nejdřív vyberte hlavní praktickou potřebu.");

  const updateCandidateNote = () => {
    candidateNote.innerHTML = `<strong>${escapeHtml(candidateSummary(checkedValue("primaryNeed", "unknown")))}</strong><p>U Hospital a Multibed je nutné ověřit maximální hmotnost samotného uživatele přímo u výrobce nebo odborné výdejny. Přesnou hmotnost člověka do poradce nezadávejte.</p>`;
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
      f.maxLoadKg ? `prodejcem uváděná nosnost postele: ${f.maxLoadKg} kg (nikoli doložený samostatný limit uživatele)` : null,
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
                <div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small>
                  <strong>${escapeHtml(offer.merchantName)}</strong>
                  <a class="zp-link-btn" data-zp-bed-merchant-link="1" href="${escapeHtml(offer.resolvedUrl)}" target="_blank" rel="${offer.isAffiliate ? "noopener nofollow sponsored" : "noopener nofollow"}">${offer.isAffiliate ? "Zobrazit cenu a dostupnost" : "Zobrazit produkt a dostupnost"}</a>
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

  const readAnswers = () => ({
    primaryNeed: checkedValue("primaryNeed", "unknown"),
    transferAbility: checkedValue("transferAbility", "unknown"),
    loadFit: checkedValue("loadFit", "unknown"),
    spaceFit: checkedValue("spaceFit", "unknown"),
    userCapacityVerified: checkedValue("userCapacityVerified", "unknown"),
    duration: checkedValue("duration", "unknown")
  });

  const renderUnverifiedProduct = (product) => `
    <article class="zp-product-card">
      <p class="zp-result-status">Pouze předběžný kandidát – vhodnost není potvrzena</p>
      <h4>${escapeHtml(product.name)}</h4>
      <ul class="zp-facts">${factsFor(product)}</ul>
      <details><summary>Co ještě ověřit</summary><ul>${product.selectionNotes.map(note=>`<li>${escapeHtml(note)}</li>`).join("")}</ul></details>
      <p class="zp-muted-copy">Zdroje technických údajů: ${product.evidence.map(e=>escapeHtml(e.checkedAt)).join(", ")}. Nejde o ověření individuální vhodnosti.</p>
    </article>
  `;

  const displayBlocked = (outcome) => {
    previewReady = false;
    preview.hidden = true;
    fitStage.hidden = true;
    result.innerHTML = `<h2>${escapeHtml(outcome.headline)}</h2><p>${escapeHtml(outcome.nextStep)}</p><p class="zp-disclaimer">V této situaci nedoporučujeme konkrétní výrobek bez dalšího ověření.</p>`;
    result.hidden = false;
    result.focus();
  };

  const visibleRequiredGroups = () =>
    [...form.querySelectorAll("[data-zp-bed-required]")].filter((fieldset) => !fieldset.hidden && !fieldset.closest('[hidden]'));

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
    if (previewReady && !event.target?.closest?.("#zp-bed-fit-stage")) {
      previewReady = false;
      preview.hidden = true;
      fitStage.hidden = true;
      result.hidden = true;
      submitButton.textContent = "1. Ukázat možný výrobek";
      fitStage.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
    }
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
    if (!preview || !fitStage || !validate()) return;

    if (!previewReady) {
      const upcoming = previewAdjustableBed(readAnswers());
      if (upcoming.status !== "unverified_preview") {
        displayBlocked(upcoming);
        return;
      }
      const products = getAdjustableBedProducts(upcoming.productCandidateIds);
      if (!products.length) {
        displayBlocked({
          headline: "Nemáme ověřený výrobek pro tuto situaci.",
          nextStep: "Vyberte jiný způsob použití nebo vyhledejte odborné posouzení."
        });
        return;
      }
      // Preview contains no shop URLs: no actual fit confirmed yet.
      preview.innerHTML = `
        <h2>1. Možné postele k ověření</h2>
        <p>Zkontrolujte následující skutečné parametry výrobku. Jeho vhodnost ještě nebyla potvrzena.</p>
        <div class="zp-product-grid">${products.map(renderUnverifiedProduct).join("")}</div>
        <p class="zp-disclaimer">Nákupní odkazy se objeví až po skutečném ověření parametrů v druhém kroku.</p>
      `;
      previewReady = true;
      updateCapacityQuestion();
      preview.hidden = false;
      fitStage.hidden = false;
      result.hidden = true;
      submitButton.textContent = "2. Vyhodnotit parametry";
      preview.focus();
      return;
    }

    const output = recommendAdjustableBed(readAnswers());

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
