// ZP_RELEASE_0_8_92
import { recommendWheelchair } from "../../src/wheelchair/engine.js";
import { getWheelchairProducts } from "../../src/wheelchair/catalog.js";
import { previewWheelchair } from "../../src/decision/product-preview.js";

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

  // A result belongs to the exact answers used to produce it.
  // Hide and remove any previous outbound offer as soon as an answer changes.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  const preview = document.querySelector("#zp-wheelchair-preview");
  const fitStage = document.querySelector("#zp-wheelchair-fit-stage");
  let previewReady = false;
  const fitFields = ["seatWidthVariant","seatFit","widthFit","wheelType","loadFit"];
  if (preview && fitStage) {
    for (const name of fitFields) {
      const fieldset = form.querySelector(`[data-zp-product-fit][data-zp-wheelchair-required="${name}"]`);
      if (fieldset) fitStage.appendChild(fieldset);
    }
  }

  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  // This is relevant only for P3641, not the Basic companion or powered chair.
  const updateVariantQuestions = () => {
    const manual = ["self_manual", "mixed_manual"].includes(checkedValue("propulsion", "unknown"));
    for (const name of ["seatWidthVariant", "wheelType"]) {
      const group = form.querySelector(`[data-zp-product-fit][data-zp-wheelchair-required="${name}"]`);
      if (!group) continue;
      group.hidden = !manual;
      if (!manual) group.querySelectorAll("input").forEach(input => { input.checked = false; });
    }
  };

  const candidateSummary = (propulsion) => ({
    companion: "Basic: sed 48 cm, celková šířka 65 cm, nosnost 100 kg, hmotnost 18,4 kg.",
    self_manual: "Odlehčený vozík: sed 48 cm → celková šířka 68 cm; sed 51 cm → šířka 70 cm. Nosnost 125/136 kg podle kol.",
    mixed_manual: "Odlehčený vozík: sed 48 cm → šířka 68 cm, sed 51 cm → šířka 70 cm. Hnací obruče a brzdy pro doprovod.",
    powered: "Elektrický vozík: sed 46 cm, celková šířka 63 cm, nosnost 135 kg, hmotnost s baterií 62 kg, poloměr otáčení 86,5 cm.",
    unknown: "Nejdřív vyberte, kdo má vozík běžně pohánět."
  }[propulsion] || "Nejdřív vyberte, kdo má vozík běžně pohánět.");

  const updateConditional = () => {
    const propulsion = checkedValue("propulsion", "unknown");
    const powered = propulsion === "powered";
    const manual = ["self_manual", "mixed_manual"].includes(propulsion);

    for (const [condition, visible] of [["powered", powered], ["manual", manual]]) {
      form.querySelectorAll(`[data-zp-wheelchair-conditional='${condition}']`).forEach((fieldset) => {
        fieldset.hidden = !visible;
        if (!visible) {
          fieldset.querySelectorAll("input").forEach((input) => {
            input.checked = false;
            input.required = false;
          });
          fieldset.classList.remove("is-error");
          fieldset.removeAttribute("aria-invalid");
        }
      });
    }
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

  const readAnswers = () => ({
    propulsion: checkedValue("propulsion", "unknown"),
    transferAbility: checkedValue("transferAbility", "unknown"),
    seatFit: checkedValue("seatFit", "unknown"),
    widthFit: checkedValue("widthFit", "unknown"),
    loadFit: checkedValue("loadFit", "unknown"),
    wheelType: checkedValue("wheelType", "unknown"),
    seatWidthVariant: checkedValue("seatWidthVariant", "unknown"),
    manualControlSafe: checkedValue("manualControlSafe", "unknown"),
    joystickSafe: checkedValue("joystickSafe", "unknown"),
    chargingReady: checkedValue("chargingReady", "unknown"),
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
    [...form.querySelectorAll("[data-zp-wheelchair-required]")].filter((fieldset) => !fieldset.hidden && !fieldset.closest('[hidden]'));

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
    if (previewReady && !event.target?.closest?.("#zp-wheelchair-fit-stage")) {
      previewReady = false;
      preview.hidden = true;
      fitStage.hidden = true;
      result.hidden = true;
      submitButton.textContent = "1. Ukázat možný výrobek";
      fitStage.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
    }
    // A different seat size also changes total width (48/68 vs 51/70 cm).
    // Both real-world confirmations belong to the *selected* seat construction.
    if (event.target?.name === "seatWidthVariant") {
      for (const name of ["seatFit", "widthFit"]) {
        const group = form.querySelector(`[data-zp-product-fit][data-zp-wheelchair-required="${name}"]`);
        group?.querySelectorAll("input").forEach(input => { input.checked = false; });
        group?.classList?.remove("is-error");
        group?.removeAttribute?.("aria-invalid");
      }
    }
    // Selecting a new 125kg/136kg construction invalidates any older approval.
    if (event.target?.name === "wheelType") {
      const load = form.querySelector('[data-zp-product-fit][data-zp-wheelchair-required="loadFit"]');
      load?.querySelectorAll("input").forEach(input => { input.checked = false; });
      load?.classList?.remove("is-error");
      load?.removeAttribute?.("aria-invalid");
    }
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
    if (!preview || !fitStage || !validate()) return;

    if (!previewReady) {
      const upcoming = previewWheelchair(readAnswers());
      if (upcoming.status !== "unverified_preview") {
        displayBlocked(upcoming);
        return;
      }
      const products = getWheelchairProducts(upcoming.productCandidateIds);
      if (!products.length) {
        displayBlocked({
          headline: "Nemáme ověřený výrobek pro tuto situaci.",
          nextStep: "Vyberte jiný způsob použití nebo vyhledejte odborné posouzení."
        });
        return;
      }
      // Preview contains no shop URLs: no actual fit confirmed yet.
      preview.innerHTML = `
        <h2>1. Možné vozíky k ověření</h2>
        <p>Zkontrolujte následující skutečné parametry výrobku. Jeho vhodnost ještě nebyla potvrzena.</p>
        <div class="zp-product-grid">${products.map(renderUnverifiedProduct).join("")}</div>
        <p class="zp-disclaimer">Nákupní odkazy se objeví až po skutečném ověření parametrů v druhém kroku.</p>
      `;
      previewReady = true;
      updateVariantQuestions();
      preview.hidden = false;
      fitStage.hidden = false;
      result.hidden = true;
      submitButton.textContent = "2. Vyhodnotit parametry";
      preview.focus();
      return;
    }

    const output = recommendWheelchair(readAnswers());

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
