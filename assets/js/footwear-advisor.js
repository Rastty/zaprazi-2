// ZP_RELEASE_0_8_72
import { chooseEasyFootwear } from "../../src/footwear/engine.js";
import { canLinkEvidence } from "../../src/decision/evidence-links.js";

const form = document.querySelector("#zp-footwear-advisor");
const result = document.querySelector("#zp-footwear-result");
const submitButton = document.querySelector("#zp-footwear-submit");
const errorBox = document.querySelector("#zp-footwear-errors");
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

  // A result belongs to the exact answers used to produce it.
  // Hide and remove any previous outbound offer as soon as an answer changes.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const groups = () => [...form.querySelectorAll("[data-zp-footwear-required]")];

  const validate = () => {
    const missing = groups().filter((fieldset) => !checkedValue(fieldset.dataset.zpFootwearRequired));
    groups().forEach((fieldset) => {
      const invalid = !checkedValue(fieldset.dataset.zpFootwearRequired);
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
        <h3>${output.status === "candidate" ? "Ověřený kandidát k porovnání" : "Kandidát po doplnění měření"}</h3>
        <article class="zp-product-card">
          <h4>${escapeHtml(candidate.product)}</h4>
          <ul class="zp-facts">
            ${candidate.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}
            <li>Kontrolovaná cena: ${escapeHtml(candidate.listedPriceCzk)} Kč</li>
          </ul>
          ${output.checks?.length ? `<h5>Co ještě ověřit</h5><ul>${output.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          <details class="zp-sources">
            <summary>Zdroj a datum ověření</summary>
            <p>${canLinkSource
              ? `<a href="${escapeHtml(candidate.sourceUrl)}" target="_blank" rel="noopener">Ověřit produkt u zdroje</a>`
              : "Produktový podklad je ověřený; obchodní odkaz se zpřístupní až po dokončení měření a kontroly."} · ověřeno ${escapeHtml(candidate.checkedAt)}</p>
          </details>
          ${allowOffer ? `
            <div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small>
              <strong>${escapeHtml(candidate.merchant)}</strong>
              <a class="zp-link-btn" data-zp-footwear-merchant-link="1" href="${escapeHtml(resolvedUrl)}" target="_blank" rel="${affiliateUrl ? "noopener nofollow sponsored" : "noopener nofollow"}">${affiliateUrl ? "Zobrazit cenu a dostupnost" : "Zobrazit produkt a dostupnost"}</a>
              ${affiliateUrl ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
            </div>
          ` : '<p class="zp-disclaimer">Nejdřív dokončete měření a praktickou kontrolu. Obchodní odkaz zatím nezobrazujeme jako další krok.</p>'}
        </article>
      </section>
    `;
  };

  form.addEventListener("change", (event) => {
    const group = event.target?.closest?.("[data-zp-footwear-required]");
    if (group && checkedValue(group.dataset.zpFootwearRequired)) {
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

    const output = chooseEasyFootwear({
      openingNeed: checkedValue("openingNeed", "unknown"),
      toe: checkedValue("toe", "unknown"),
      velcroUse: checkedValue("velcroUse", "unknown"),
      measuredFeet: checkedValue("measuredFeet", "unknown")
    });

    if (!["needs_more_context", "invalid_input"].includes(output.status)) track("builder_complete");
    if (output.candidate) track("recommendation_view");

    result.innerHTML = `
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${renderCandidate(output)}
      ${output.safetyNote ? `<p class="zp-disclaimer">${escapeHtml(output.safetyNote)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-footwear-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
