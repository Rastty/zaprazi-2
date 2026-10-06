import { recommendMobility } from "../../src/mobility/engine.js";
import { getMobilityProducts } from "../../src/mobility/catalog.js";
import { getRentalGuidance, getReimbursementGuidance } from "../../src/mobility/acquisition.js";

const form = document.querySelector("#zp-mobility-advisor");
const result = document.querySelector("#zp-mobility-result");
const submitButton = document.querySelector("#zp-mobility-submit");
const runtime = window.ZaPraziRuntime || { affiliateMap: {} };
const affiliateMap = runtime.affiliateMap || {};
let builderStarted = false;

const track = (eventName) => {
  window.dispatchEvent(new CustomEvent("zaprazi:analytics", {
    detail: { event: eventName }
  }));
};

if (form && result && submitButton) {
  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const isChecked = (name) =>
    Boolean(form.querySelector(`input[name="${name}"]:checked`));
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const familyLabel = (family) => ({
    fixed_walker: "Čtyřbodové chodítko",
    front_wheel_walker: "Dvoukolové chodítko",
    rollator: "Čtyřkolový rollátor"
  }[family] || family);

  const statusLabel = (status) => ({
    candidate: "Vhodný směr k porovnání",
    needs_more_info: "Ještě potřebujeme jednu informaci",
    professional_check: "Nejdřív ověřit s odborníkem",
    outside_current_slice: "Tady zatím nechceme hádat",
    invalid_input: "Zkontrolujte odpovědi"
  }[status] || "");

  const formatCheckedAt = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    return match ? `${Number(match[3])}. ${Number(match[2])}. ${match[1]}` : value;
  };

  const productFacts = (product) => {
    const facts = [
      product.facts.heightCm ? `výška madel / chodítka: ${product.facts.heightCm} cm` : null,
      product.facts.widthCm ? `šířka: ${product.facts.widthCm} cm` : null,
      product.facts.weightKg ? `hmotnost: ${product.facts.weightKg} kg` : null,
      product.facts.maxUserWeightKg ? `max. nosnost: ${product.facts.maxUserWeightKg} kg` : null,
      product.facts.seatHeightCm ? `výška sedátka: ${product.facts.seatHeightCm} cm` : null
    ].filter(Boolean);

    return facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("");
  };

  const resolveOffer = (offer) => {
    const configuredAffiliateUrl = offer.affiliateKey ? affiliateMap[offer.affiliateKey] : null;
    const affiliateUrl = typeof configuredAffiliateUrl === "string" && configuredAffiliateUrl.startsWith("https://")
      ? configuredAffiliateUrl
      : null;

    return {
      ...offer,
      resolvedUrl: affiliateUrl || offer.url,
      isAffiliate: Boolean(affiliateUrl)
    };
  };

  const renderOffers = (offers = []) => {
    if (!offers.length) return "";

    return `
      <div class="zp-offers">
        ${offers.map((rawOffer) => {
          const offer = resolveOffer(rawOffer);
          const rel = offer.isAffiliate ? "noopener nofollow sponsored" : "noopener nofollow";
          return `
            <div class="zp-offer">
              <strong>${escapeHtml(offer.merchantName)}</strong>
              <p>${escapeHtml(offer.note)}</p>
              <a class="zp-link-btn" data-zp-merchant-link="1" href="${escapeHtml(offer.resolvedUrl)}" target="_blank" rel="${rel}">
                ${offer.isAffiliate ? "Přejít k obchodníkovi" : "Zobrazit produkt u obchodníka"}
              </a>
              ${offer.isAffiliate ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  };

  const evidenceLabel = (type) => ({
    instruction_manual: "Návod k použití",
    manufacturer_manual: "Návod výrobce",
    manufacturer_product_page: "Stránka výrobce",
    merchant_identity: "Stránka obchodníka",
    linked_instruction_manual_identity_conflict: "Připojený návod – konflikt identity"
  }[type] || "Zdroj");

  const renderSources = (evidence = []) => {
    if (!evidence.length) return "";

    return `
      <details class="zp-sources">
        <summary>Zdroje a datum ověření</summary>
        <ul>
          ${evidence.map((source) => `
            <li>
              <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(evidenceLabel(source.type))}</a>
              <small>ověřeno ${escapeHtml(formatCheckedAt(source.checkedAt))}</small>
            </li>
          `).join("")}
        </ul>
      </details>
    `;
  };

  const renderProducts = (products) => {
    if (!products.length) return "";

    return `
      <section class="zp-product-section">
        <h3>Ověřené výrobky k porovnání</h3>
        <p class="zp-muted-copy">Nejde o potvrzení individuální zdravotní vhodnosti. Shortlist vychází z praktických odpovědí a ověřených technických údajů.</p>
        <div class="zp-product-grid">
          ${products.map((product) => `
            <article class="zp-product-card">
              <p class="zp-product-family">${escapeHtml(familyLabel(product.solutionFamily))}</p>
              <h4>${escapeHtml(product.name)}</h4>
              <ul class="zp-facts">${productFacts(product)}</ul>
              <details>
                <summary>Co ještě ověřit</summary>
                <ul>${product.selectionNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
              </details>
              ${renderSources(product.evidence)}
              ${product.facts.suklCode ? `<p class="zp-sukl">Kód ZP uvedený výrobcem: <strong>${escapeHtml(product.facts.suklCode)}</strong>. Aktuální úhradu je nutné prověřit před nákupem.</p>` : ""}
              ${renderOffers(product.offers)}
            </article>
          `).join("")}
        </div>
      </section>
    `;
  };

  const renderAcquisitionEvidence = (productIds, duration) => {
    const reimbursement = getReimbursementGuidance(productIds);
    const rentals = getRentalGuidance(productIds);

    if (!reimbursement.length && !rentals.length) return "";

    const rentCards = duration === "long_term"
      ? ""
      : rentals.map((item) => `
          <article class="zp-acquisition-card">
            <p class="zp-acquisition-label">Půjčit</p>
            <h4>${escapeHtml(item.providerName)}</h4>
            <p>Aktuálně uvádí pronájem tohoto typu chodítka za <strong>${escapeHtml(item.pricing.perDayKc)} Kč/den</strong> nebo <strong>${escapeHtml(item.pricing.perMonthKc)} Kč/měsíc</strong>.</p>
            <p class="zp-muted-copy">${escapeHtml(item.note)} Ověřeno ${escapeHtml(formatCheckedAt(item.checkedAt))}.</p>
            <a class="zp-link-btn" href="${escapeHtml(item.url)}" target="_blank" rel="noopener nofollow">Prověřit půjčení</a>
          </article>
        `).join("");

    const reimbursementCards = reimbursement.map((item) => `
      <article class="zp-acquisition-card">
        <p class="zp-acquisition-label">Prověřit úhradu</p>
        <h4>Kód ZP ${escapeHtml(item.zpCode)}</h4>
        <p>${escapeHtml(item.userMessage)}</p>
        <p class="zp-source-state">Zdroj tvrzení: výrobce · ověřeno ${escapeHtml(formatCheckedAt(item.checkedAt))}. Přesná aktuální částka není na ZaPrazi zobrazena, dokud ji nepotvrdíme v platném měsíčním seznamu SÚKL.</p>
        <a class="zp-link-btn" href="${escapeHtml(item.officialVerification.sourceUrl)}" target="_blank" rel="noopener">Ověřit v oficiálním seznamu SÚKL</a>
      </article>
    `).join("");

    return `
      <section class="zp-acquisition-evidence">
        <h3>Koupit, půjčit, nebo prověřit úhradu?</h3>
        <div class="zp-acquisition-grid">
          ${rentCards}
          ${reimbursementCards}
        </div>
      </section>
    `;
  };

  const updateConditionalQuestions = () => {
    const environment = checkedValue("environment", "");
    form.querySelectorAll("[data-zp-conditional]").forEach((section) => {
      const condition = section.dataset.zpConditional;
      const show = condition === "indoor"
        ? environment === "indoor"
        : condition === "outdoor"
          ? environment === "outdoor" || environment === "both"
          : true;

      section.hidden = !show;
      if (!show) {
        section.querySelectorAll('input[type="radio"]').forEach((input) => {
          input.checked = false;
        });
      }
    });
  };

  updateConditionalQuestions();

  form.addEventListener("change", (event) => {
    if (event.target?.name === "environment") {
      updateConditionalQuestions();
    }

    if (!builderStarted) {
      builderStarted = true;
      track("builder_start");
    }
  });

  submitButton.addEventListener("click", () => {
    const duration = checkedValue("duration", "unknown");
    const output = recommendMobility({
      environment: checkedValue("environment"),
      supportNeed: checkedValue("supportNeed"),
      canLiftWalker: checkedValue("canLiftWalker", "unknown"),
      handBrakes: checkedValue("handBrakes", "unknown"),
      seatNeeded: isChecked("seatNeeded"),
      transportNeed: isChecked("transportNeed"),
      homeSpace: isChecked("tightSpace") ? "tight" : "standard",
      duration
    });

    const recommendations = output.recommendations.map((item) => `
      <article>
        <h3>${escapeHtml(item.label)}</h3>
        <p>${escapeHtml(item.reason)}</p>
        <h4>Co ověřit před výběrem</h4>
        <ul>${item.parameters.map((parameter) => `<li>${escapeHtml(parameter)}</li>`).join("")}</ul>
      </article>
    `).join("");

    const ids = output.recommendations.flatMap((item) => item.productCandidateIds ?? []);
    const products = getMobilityProducts(ids);

    if (!["needs_more_info", "invalid_input"].includes(output.status)) {
      track("builder_complete");
    }
    if (output.recommendations.length > 0) {
      track("recommendation_view");
    }

    const hasSpecificAcquisition = getReimbursementGuidance(ids).length > 0 || getRentalGuidance(ids).length > 0;

    const acquisition = output.status === "candidate" && output.acquisition.length && !hasSpecificAcquisition
      ? `<section class="zp-acquisition-summary"><h3>Obecně k způsobu získání</h3>
         <div>${output.acquisition.map((item) => `
           <article>
             <h4>${escapeHtml(item.label)}</h4>
             <p>${escapeHtml(item.reason)}</p>
           </article>
         `).join("")}</div></section>`
      : "";

    result.innerHTML = `
      ${statusLabel(output.status) ? `<p class="zp-result-status">${escapeHtml(statusLabel(output.status))}</p>` : ""}
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${recommendations}
      ${renderProducts(products)}
      ${renderAcquisitionEvidence(ids, duration)}
      ${acquisition}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
