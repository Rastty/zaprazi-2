// ZP_RELEASE_0_8_80
import { chooseAdlSelfCareAid } from "../../src/adl/engine.js";
import { canLinkEvidence } from "../../src/decision/evidence-links.js";

const form = document.querySelector("#zp-adl-advisor");
const result = document.querySelector("#zp-adl-result");
const submitButton = document.querySelector("#zp-adl-submit");
const errorBox = document.querySelector("#zp-adl-errors");
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

if (form && result && submitButton && errorBox) {

  // A result belongs to the exact answers used to produce it.
  // Hide and remove any previous outbound offer as soon as an answer changes.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const fitGroup = form.querySelector("#zp-adl-product-fit");
  const fitChecks = form.querySelector("#zp-adl-product-fit-checks");
  const clearProductFit = () => {
    if (!fitGroup) return;
    fitGroup.hidden = true;
    if (fitChecks) fitChecks.textContent = "";
    fitGroup.querySelectorAll("input").forEach((input) => { input.checked = false; });
    fitGroup.classList.remove("is-error");
    fitGroup.removeAttribute("aria-invalid");
  };
  const showProductFit = (output) => {
    if (!fitGroup || !fitChecks || !output.requiresProductFit || !output.candidate) return false;
    if (!fitGroup.hidden) return false;
    fitChecks.innerHTML = `<strong>Model k ověření: ${escapeHtml(output.candidate.product)}</strong><p>Co je potřeba skutečně ověřit:</p><ul>${(output.checks || [])
      .map((check) => `<li>${escapeHtml(check)}</li>`).join("")}</ul>`;
    fitGroup.hidden = false;
    return true;
  };

  const updateConditional = () => {
    const task = checkedValue("task", "unknown");

    form.querySelectorAll("[data-zp-adl-conditional]").forEach((fieldset) => {
      const visible = fieldset.dataset.zpAdlConditional === task;
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
  };

  const visibleRequiredGroups = () =>
    [...form.querySelectorAll("[data-zp-adl-required]")].filter((fieldset) => !fieldset.hidden);

  const validate = () => {
    const missing = visibleRequiredGroups().filter((fieldset) => !checkedValue(fieldset.dataset.zpAdlRequired));

    visibleRequiredGroups().forEach((fieldset) => {
      const invalid = !checkedValue(fieldset.dataset.zpAdlRequired);
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

  const renderCandidate = (output) => {
    const candidate = output.candidate;
    if (!candidate) return "";

    const configured = candidate.affiliateKey ? affiliateMap[candidate.affiliateKey] : null;
    const affiliateUrl = typeof configured === "string" && configured.startsWith("https://") ? configured : null;
    const resolvedUrl = affiliateUrl || candidate.sourceUrl;
    const allowOffer = output.status === "candidate";
    const canLinkSource = canLinkEvidence(candidate.sourceUrl, [candidate.sourceUrl], allowOffer);

    return `
      <section class="zp-product-section">
        <h3>${output.status === "candidate" ? "Ověřený kandidát k porovnání" : "Kandidát po doplnění kontroly"}</h3>
        <article class="zp-product-card">
          <h4>${escapeHtml(candidate.product)}</h4>
          <ul class="zp-facts">
            <li>SKU: ${escapeHtml(candidate.sku)}</li>
            ${candidate.facts?.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("") || ""}
          </ul>
          ${output.checks?.length ? `<h5>Co ještě ověřit</h5><ul>${output.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          <details class="zp-sources">
            <summary>Zdroj a datum ověření</summary>
            <p>${canLinkSource
              ? `<a href="${escapeHtml(candidate.sourceUrl)}" target="_blank" rel="noopener">Ověřit produkt u zdroje</a>`
              : "Produktový podklad je ověřený; obchodní odkaz se zpřístupní až po dokončení kontroly."} · ověřeno ${escapeHtml(candidate.checkedAt)}</p>
          </details>
          ${allowOffer ? `
            <div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small>
              <strong>${escapeHtml(candidate.merchant)}</strong>
              <a class="zp-link-btn" data-zp-adl-merchant-link="1" href="${escapeHtml(resolvedUrl)}" target="_blank" rel="${affiliateUrl ? "noopener nofollow sponsored" : "noopener nofollow"}">${affiliateUrl ? "Zobrazit cenu a dostupnost" : "Zobrazit produkt a dostupnost"}</a>
              ${affiliateUrl ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
            </div>
          ` : '<p class="zp-disclaimer">Nejdřív dokončete uvedenou praktickou kontrolu. Obchodní odkaz zatím nezobrazujeme jako další krok.</p>'}
        </article>
      </section>
    `;
  };

  updateConditional();

  form.addEventListener("change", (event) => {
    if (event.target?.name !== "productFit") clearProductFit();
    if (event.target?.name === "task") {
      // The previous obstacle belongs to the previous activity. Keeping it
      // would silently evaluate a mismatched task/problem pair.
      form.querySelectorAll('input[name="mainProblem"]').forEach((input) => {
        input.checked = false;
      });
      const problemGroup = form.querySelector('[data-zp-adl-required="mainProblem"]');
      problemGroup?.classList.remove("is-error");
      problemGroup?.removeAttribute("aria-invalid");
      errorBox.hidden = true;
      errorBox.textContent = "";
      updateConditional();
    }

    const group = event.target?.closest?.("[data-zp-adl-required]");
    if (group && checkedValue(group.dataset.zpAdlRequired)) {
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

    const output = chooseAdlSelfCareAid({
      task: checkedValue("task", "unknown"),
      mainProblem: checkedValue("mainProblem", "unknown"),
      stableSurface: checkedValue("stableSurface", "unknown"),
      oneHandUse: checkedValue("oneHandUse", "unknown"),
      productFit: checkedValue("productFit", "unknown")
    });

    const newlyOpenedFit = showProductFit(output);
    if (!output.requiresProductFit && fitGroup && !fitGroup.hidden) clearProductFit();

    if (!["needs_more_context", "needs_fit_check", "invalid_input"].includes(output.status)) track("builder_complete");
    if (output.status === "candidate") track("recommendation_view");

    result.innerHTML = `
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${renderCandidate(output)}
      ${output.safetyNote ? `<p class="zp-disclaimer">${escapeHtml(output.safetyNote)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-adl-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    // First reveal the practical checks; do not let a preliminary result look final.
    if (newlyOpenedFit) fitGroup.focus();
    else result.focus();
  });
}
