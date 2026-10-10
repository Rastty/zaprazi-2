// ZP_RELEASE_0_8_95
import { recommendMobility } from "../../src/mobility/engine.js";
import { getMobilityProducts } from "../../src/mobility/catalog.js";
import { renderMobilityProductFitGate, installMobilityProductFitGate } from "../../src/mobility/offer-fit-gate.js";
import { canLinkEvidence } from "../../src/decision/evidence-links.js";
import { getRentalGuidance, getReimbursementGuidance } from "../../src/mobility/acquisition.js";
import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../../src/evidence/freshness.js";

const form = document.querySelector("#zp-mobility-advisor");
const result = document.querySelector("#zp-mobility-result");
const submitButton = document.querySelector("#zp-mobility-submit");
const errorBox = document.querySelector("#zp-advisor-errors");
const runtime = window.ZaPraziRuntime || { affiliateMap: {} };
const affiliateMap = runtime.affiliateMap || {};
let builderStarted = false;

const track = (eventName) => {
  window.dispatchEvent(new CustomEvent("zaprazi:analytics", {
    detail: { event: eventName }
  }));
};

if (form && result && submitButton && errorBox) {

  // A result belongs to the exact answers used to produce it.
  // Hide and remove any previous outbound offer as soon as an answer changes.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  installMobilityProductFitGate(result);

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

    const freshness = evidenceFreshness(
      offer.checkedAt,
      EVIDENCE_FRESHNESS_DAYS.merchantOffer
    );

    return {
      ...offer,
      resolvedUrl: affiliateUrl || offer.url,
      isAffiliate: Boolean(affiliateUrl),
      freshnessStatus: freshness.status
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
            <div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small>
              <strong>${escapeHtml(offer.merchantName)}</strong>
              <p>${escapeHtml(offer.note)}</p>
              ${offer.freshnessStatus === "fresh" ? "" : '<p class="zp-stale-evidence">Nabídka nebyla v posledních 30 dnech znovu ověřena. Před nákupem zkontrolujte aktuální cenu a dostupnost.</p>'}
              <a class="zp-link-btn" data-zp-merchant-link="1" href="${escapeHtml(offer.resolvedUrl)}" target="_blank" rel="${rel}">
                ${offer.isAffiliate ? "Zobrazit cenu a dostupnost" : "Zobrazit produkt a dostupnost"}
              </a>
              ${offer.isAffiliate ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  };

  // Renting a named rollator is still selecting that exact physical model.
  // The specific rental-provider link belongs behind the SAME model checks
  // as a retail offer, not inside the ungated acquisition-information card.
  const renderRentalOffers = (productId, duration) => {
    if (duration === "long_term") return "";
    const rentals = getRentalGuidance([productId]);
    return rentals.map((item) => `
      <div class="zp-offer zp-rental-offer">
        <small class="zp-affiliate-policy">Půjčení konkrétního modelu</small>
        <strong>${escapeHtml(item.providerName)}</strong>
        <p>${item.displayPricing
          ? `Uváděná cena: ${escapeHtml(item.displayPricing.perDayKc)} Kč/den nebo ${escapeHtml(item.displayPricing.perMonthKc)} Kč/měsíc.`
          : "Aktuální cena a dostupnost vyžadují nové ověření."}</p>
        <p class="zp-muted-copy">${escapeHtml(item.note)}</p>
        <a class="zp-link-btn" data-zp-mobility-rental-link="1" href="${escapeHtml(item.url)}" target="_blank" rel="noopener nofollow">Ověřit dostupnost půjčení</a>
      </div>
    `).join("");
  };

  const evidenceLabel = (type) => ({
    instruction_manual: "Návod k použití",
    manufacturer_manual: "Návod výrobce",
    manufacturer_product_page: "Stránka výrobce",
    merchant_identity: "Stránka obchodníka",
    linked_instruction_manual_identity_conflict: "Připojený návod – konflikt identity"
  }[type] || "Zdroj");

  const sourceFreshnessLabel = (source) => {
    const freshness = evidenceFreshness(
      source.checkedAt,
      EVIDENCE_FRESHNESS_DAYS.productTechnical
    );
    return freshness.status === "fresh" ? "" : " · zdroj potřebuje nové ověření";
  };

  const renderSources = (evidence = [], commerceUrls = []) => {
    if (!evidence.length) return "";

    return `
      <details class="zp-sources">
        <summary>Zdroje a datum ověření</summary>
        <ul>
          ${evidence.map((source) => {
            const canLink = canLinkEvidence(source.url, commerceUrls, false);
            return `
              <li>
                ${canLink
                  ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(evidenceLabel(source.type))}</a>`
                  : `<span>${escapeHtml(evidenceLabel(source.type))} – obchodní odkaz je uzamčen do dokončení kontroly modelu</span>`}
                <small>ověřeno ${escapeHtml(formatCheckedAt(source.checkedAt))}${escapeHtml(sourceFreshnessLabel(source))}</small>
              </li>
            `;
          }).join("")}
        </ul>
      </details>
    `;
  };

  const renderProducts = (products, fitOptions = {}, duration = "unknown") => {
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
              ${renderSources(product.evidence, product.offers?.map(offer => offer.url) || [])}
              ${product.facts.suklCode ? `<p class="zp-sukl">Kód ZP: <strong>${escapeHtml(product.facts.suklCode)}</strong>. Aktuální oficiální úhradu a podmínky zobrazujeme níže, pokud máme platný měsíční záznam SÚKL.</p>` : ""}
              ${renderMobilityProductFitGate(renderOffers(product.offers) + renderRentalOffers(product.id, duration), { ...fitOptions, requireBrakeFit: product.solutionFamily === "rollator" })}
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
            ${item.displayPricing ? `<p>Aktuálně uvádí pronájem tohoto typu chodítka za <strong>${escapeHtml(item.displayPricing.perDayKc)} Kč/den</strong> nebo <strong>${escapeHtml(item.displayPricing.perMonthKc)} Kč/měsíc</strong>.</p>` : '<p class="zp-stale-evidence">Cena a dostupnost nebyly v posledních 30 dnech znovu ověřeny. Aktuální podmínky zkontrolujte přímo u půjčovny.</p>'}
            <p class="zp-muted-copy">${escapeHtml(item.note)} Ověřeno ${escapeHtml(formatCheckedAt(item.checkedAt))}.</p>
            <p class="zp-muted-copy">Odkaz na půjčení konkrétního modelu se zobrazí u výrobku až po potvrzení rozměrů, nosnosti a dalších potřebných kontrol.</p>
          </article>
        `).join("");

    const reimbursementCards = reimbursement.map((item) => {
      const official = item.officialVerification;
      const amount = item.displayAmountKc === null
        ? null
        : new Intl.NumberFormat("cs-CZ").format(item.displayAmountKc);

      return `
        <article class="zp-acquisition-card">
          <p class="zp-acquisition-label">Úhrada podle SÚKL</p>
          <h4>Kód ZP ${escapeHtml(item.zpCode)}</h4>
          <p class="${item.freshnessStatus === "fresh" ? "" : "zp-stale-evidence"}">${escapeHtml(item.displayMessage)}</p>
          ${amount ? `<p><strong>Úhrada v aktuálním oficiálním seznamu: ${escapeHtml(amount)} Kč.</strong></p>` : ""}
          <p class="zp-source-state">
            Oficiální Seznam ZP SÚKL · ${official.validFor ? `platný pro ${escapeHtml(official.validFor)}` : "ověřte aktuální měsíc"} ·
            ověřeno ${escapeHtml(formatCheckedAt(item.checkedAt))}.
            Individuální nárok ani konečný doplatek tím nejsou potvrzeny.
          </p>
          <a class="zp-link-btn" href="${escapeHtml(official.sourceUrl)}" target="_blank" rel="noopener">Otevřít oficiální záznam SÚKL</a>
        </article>
      `;
    }).join("");

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

  const validateRequiredGroups = () => {
    const visibleRequiredGroups = [...form.querySelectorAll("[data-zp-required-group]")]
      .filter((fieldset) => !fieldset.hidden);

    const missing = visibleRequiredGroups.filter((fieldset) => {
      const name = fieldset.dataset.zpRequiredGroup;
      return !checkedValue(name);
    });

    visibleRequiredGroups.forEach((fieldset) => {
      const name = fieldset.dataset.zpRequiredGroup;
      const invalid = !checkedValue(name);
      fieldset.classList.toggle("is-error", invalid);
      if (invalid) {
        fieldset.setAttribute("aria-invalid", "true");
      } else {
        fieldset.removeAttribute("aria-invalid");
      }
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

    const firstMissing = missing[0];
    firstMissing.setAttribute("tabindex", "-1");
    firstMissing.focus();
    return false;
  };

  const updateConditionalQuestions = () => {
    const environment = checkedValue("environment", "");
    const seatNeeded = isChecked("seatNeeded");
    form.querySelectorAll("[data-zp-conditional]").forEach((section) => {
      const condition = section.dataset.zpConditional;
      const show = condition === "indoor"
        ? environment === "indoor" && !seatNeeded
        : condition === "outdoor"
          ? environment === "outdoor" || environment === "both" || seatNeeded
          : true;

      section.hidden = !show;
      if (!show) {
        section.querySelectorAll('input[type="radio"]').forEach((input) => {
          input.checked = false;
        });
        section.classList.remove("is-error");
        section.removeAttribute("aria-invalid");
      }
    });
  };

  updateConditionalQuestions();

  form.addEventListener("change", (event) => {
    if (["environment", "seatNeeded"].includes(event.target?.name)) {
      updateConditionalQuestions();
    }

    const changedGroup = event.target?.closest?.("[data-zp-required-group]");
    if (changedGroup) {
      const name = changedGroup.dataset.zpRequiredGroup;
      if (checkedValue(name)) {
        changedGroup.classList.remove("is-error");
        changedGroup.removeAttribute("aria-invalid");
      }
      if (!form.querySelector(".zp-fieldset.is-error")) {
        errorBox.hidden = true;
        errorBox.textContent = "";
      }
    }

    if (!builderStarted) {
      builderStarted = true;
      track("builder_start");
    }
  });

  submitButton.addEventListener("click", () => {
    if (!validateRequiredGroups()) {
      return;
    }

    const duration = checkedValue("duration", "unknown");
    const fitOptions = {
      requireSeatFit: isChecked("seatNeeded"),
      requireTransportFit: isChecked("transportNeed")
    };
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
      ${renderProducts(products, fitOptions, duration)}
      ${renderAcquisitionEvidence(ids, duration)}
      ${acquisition}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-merchant-link], [data-zp-mobility-rental-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
