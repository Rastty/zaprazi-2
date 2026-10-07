// ZP_RELEASE_0_8_14
import { recommendBathroom } from "../../src/bathroom/engine.js";
import { getBathroomProducts } from "../../src/bathroom/catalog.js";

const form = document.querySelector("#zp-bathroom-advisor");
const result = document.querySelector("#zp-bathroom-result");
const submitButton = document.querySelector("#zp-bathroom-submit");
const errorBox = document.querySelector("#zp-bathroom-errors");
const runtime = window.ZaPraziRuntime || { affiliateMap: {} };
const affiliateMap = runtime.affiliateMap || {};
let builderStarted = false;

const track = (eventName) => {
  window.dispatchEvent(new CustomEvent("zaprazi:analytics", {
    detail: { event: eventName }
  }));
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

if (form && result && submitButton && errorBox) {
  const checkedValue = (name, fallback = null) =>
    form.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback;

  const familyLabel = (family) => ({
    raised_toilet_seat: "Nástavec na WC",
    raised_toilet_seat_with_arms: "Nástavec na WC s madly",
    toilet_support_frame: "Toaletní opora",
    static_commode: "Toaletní židle",
    shower_chair: "Sprchovací židle",
    fixed_grab_rail: "Pevné madlo",
    bath_transfer_seat: "Sedačka na vanu"
  }[family] || family);

  const statusLabel = (status) => ({
    candidate: "Vhodný směr k porovnání",
    needs_more_info: "Ještě potřebujeme jednu informaci",
    professional_check: "Nejdřív ověřit bezpečný přesun",
    invalid_input: "Zkontrolujte odpovědi"
  }[status] || "");

  const factsFor = (product) => {
    const f = product.facts || {};
    const facts = [
      f.heightIncreaseCm ? `zvýšení: ${f.heightIncreaseCm} cm` : null,
      f.widthCm ? `šířka: ${f.widthCm} cm` : null,
      f.totalWidthCm ? `celková šířka: ${f.totalWidthCm} cm` : null,
      f.depthCm ? `hloubka: ${f.depthCm} cm` : null,
      f.totalDepthCm ? `celková hloubka: ${f.totalDepthCm} cm` : null,
      f.heightCm ? `výška: ${f.heightCm} cm` : null,
      f.seatHeightCm ? `výška sedu: ${f.seatHeightCm} cm` : null,
      f.seatWidthCm ? `šířka sedu: ${f.seatWidthCm} cm` : null,
      f.seatCm ? `sedák: ${f.seatCm} cm` : null,
      f.outerCm ? `vnější rozměr: ${f.outerCm} cm` : null,
      f.openingCm ? `otvor: ${f.openingCm} cm` : null,
      f.bathInnerWidthCm ? `vnitřní šířka vany: ${f.bathInnerWidthCm} cm` : null,
      f.seatDepthCm ? `hloubka sedáku: ${f.seatDepthCm} cm` : null,
      f.maxUserWeightKg ? `max. nosnost: ${f.maxUserWeightKg} kg` : null,
      f.weightKg ? `hmotnost: ${f.weightKg} kg` : null,
      f.lengthsCm ? `délky: ${f.lengthsCm.join(" / ")} cm` : null
    ].filter(Boolean);

    return facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("");
  };

  const resolveOffer = (offer) => {
    const configured = offer.affiliateKey ? affiliateMap[offer.affiliateKey] : null;
    const affiliateUrl = typeof configured === "string" && configured.startsWith("https://")
      ? configured
      : null;

    return {
      ...offer,
      resolvedUrl: affiliateUrl || offer.url,
      isAffiliate: Boolean(affiliateUrl)
    };
  };

  const renderSources = (evidence = []) => {
    if (!evidence.length) return "";
    return `
      <details class="zp-sources">
        <summary>Zdroje a datum ověření</summary>
        <ul>
          ${evidence.map((source) => `
            <li>
              <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Ověřit zdroj</a>
              <small>ověřeno ${escapeHtml(source.checkedAt)}</small>
            </li>
          `).join("")}
        </ul>
      </details>
    `;
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
              ${offer.note ? `<p>${escapeHtml(offer.note)}</p>` : ""}
              <a class="zp-link-btn" data-zp-bath-merchant-link="1" href="${escapeHtml(offer.resolvedUrl)}" target="_blank" rel="${rel}">
                ${offer.isAffiliate ? "Přejít k obchodníkovi" : "Zobrazit produkt u obchodníka"}
              </a>
              ${offer.isAffiliate ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  };

  const renderProducts = (products) => {
    if (!products.length) return "";
    return `
      <section class="zp-product-section">
        <h3>Ověřené výrobky k porovnání</h3>
        <p class="zp-muted-copy">Výrobky se zobrazí až po splnění bezpečnostních a rozměrových podmínek. Nejde o diagnózu ani potvrzení individuální zdravotní vhodnosti.</p>
        <div class="zp-product-grid">
          ${products.map((product) => `
            <article class="zp-product-card">
              <p class="zp-product-family">${escapeHtml(familyLabel(product.solutionFamily))}</p>
              <h4>${escapeHtml(product.name)}</h4>
              <ul class="zp-facts">${factsFor(product)}</ul>
              <details>
                <summary>Co ještě ověřit</summary>
                <ul>${product.selectionNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
              </details>
              ${renderSources(product.evidence)}
              ${renderOffers(product.offers)}
            </article>
          `).join("")}
        </div>
      </section>
    `;
  };

  const renderAcquisition = (items = []) => {
    if (!items.length) return "";
    return `
      <section class="zp-acquisition-summary">
        <h3>Jak řešení získat</h3>
        <div>
          ${items.map((item) => `
            <article>
              <h4>${escapeHtml(item.label)}</h4>
              <p>${escapeHtml(item.reason)}</p>
              ${item.id === "check_reimbursement_alternative" ? `
                <p>
                  <a class="zp-link-btn" href="/pomucky-do-koupelny-na-pojistovnu/">Jak funguje úhrada koupelnových pomůcek</a>
                </p>
                <p>
                  <a class="zp-text-link" href="https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/" target="_blank" rel="noopener">Aktuální seznam SÚKL</a>
                  ·
                  <a class="zp-text-link" href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/zdravotnicke-pomucky-pro-imobilni-pacienty" target="_blank" rel="noopener">Zdroj VZP</a>
                </p>
              ` : ""}
            </article>
          `).join("")}
        </div>
      </section>
    `;
  };

  const visibleRequiredGroups = () =>
    [...form.querySelectorAll("[data-zp-bath-required]")].filter((fieldset) => !fieldset.hidden);

  const validate = () => {
    const missing = visibleRequiredGroups().filter((fieldset) => {
      const name = fieldset.dataset.zpBathRequired;
      return !checkedValue(name);
    });

    visibleRequiredGroups().forEach((fieldset) => {
      const name = fieldset.dataset.zpBathRequired;
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
    missing[0].setAttribute("tabindex", "-1");
    missing[0].focus();
    return false;
  };

  const shouldShow = (condition, need) => {
    if (condition === "simple") {
      return ["raise_toilet", "toilet_support", "toilet_nearby", "shower_seated", "bath_transfer"].includes(need);
    }
    if (condition === "floor_space") {
      return ["toilet_nearby", "shower_seated"].includes(need);
    }
    return condition === need;
  };

  const updateConditionalQuestions = () => {
    const need = checkedValue("primaryNeed", "");
    form.querySelectorAll("[data-zp-bath-conditional]").forEach((fieldset) => {
      const show = shouldShow(fieldset.dataset.zpBathConditional, need);
      fieldset.hidden = !show;

      if (!show) {
        fieldset.querySelectorAll('input[type="radio"]').forEach((input) => {
          input.checked = false;
        });
        fieldset.classList.remove("is-error");
        fieldset.removeAttribute("aria-invalid");
      }
    });
  };

  updateConditionalQuestions();

  form.addEventListener("change", (event) => {
    if (event.target?.name === "primaryNeed") {
      updateConditionalQuestions();
    }

    const group = event.target?.closest?.("[data-zp-bath-required]");
    if (group) {
      const name = group.dataset.zpBathRequired;
      if (checkedValue(name)) {
        group.classList.remove("is-error");
        group.removeAttribute("aria-invalid");
      }
    }

    if (!builderStarted) {
      builderStarted = true;
      track("builder_start");
    }
  });

  submitButton.addEventListener("click", () => {
    if (!validate()) return;

    const output = recommendBathroom({
      primaryNeed: checkedValue("primaryNeed"),
      transferAbility: checkedValue("transferAbility", "unknown"),
      loadFit: checkedValue("loadFit", "unknown"),
      toiletFit: checkedValue("toiletFit", "unknown"),
      feetFlatAtRaisedHeight: checkedValue("feetFlatAtRaisedHeight", "unknown"),
      floorStable: checkedValue("floorStable", "unknown"),
      spaceFit: checkedValue("spaceFit", "unknown"),
      wallFixing: checkedValue("wallFixing", "unknown"),
      bathTransferIndependent: checkedValue("bathTransferIndependent", "unknown"),
      bathFit: checkedValue("bathFit", "unknown"),
      duration: checkedValue("duration", "unknown")
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
    const products = getBathroomProducts(ids);

    if (!["needs_more_info", "invalid_input"].includes(output.status)) {
      track("builder_complete");
    }
    if (output.recommendations.length) {
      track("recommendation_view");
    }

    result.innerHTML = `
      ${statusLabel(output.status) ? `<p class="zp-result-status">${escapeHtml(statusLabel(output.status))}</p>` : ""}
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${recommendations}
      ${renderProducts(products)}
      ${output.status === "candidate" ? renderAcquisition(output.acquisition) : ""}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
    `;

    result.querySelectorAll("[data-zp-bath-merchant-link]").forEach((link) => {
      link.addEventListener("click", () => {
        track("product_click");
        track("merchant_click");
      }, { once: true });
    });

    result.hidden = false;
    result.focus();
  });
}
