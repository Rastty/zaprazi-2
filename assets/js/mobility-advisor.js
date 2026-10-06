import { recommendMobility } from "../../src/mobility/engine.js";
import { getMobilityProducts } from "../../src/mobility/catalog.js";

const form = document.querySelector("#zp-mobility-advisor");
const result = document.querySelector("#zp-mobility-result");

if (form && result) {
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

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

  const renderOffers = (offers = []) => {
    if (!offers.length) return "";

    return `
      <div class="zp-offers">
        ${offers.map((offer) => {
          const isAffiliate = Boolean(offer.affiliateUrl);
          const rel = isAffiliate ? "noopener nofollow sponsored" : "noopener nofollow";
          return `
            <div class="zp-offer">
              <strong>${escapeHtml(offer.merchantName)}</strong>
              <p>${escapeHtml(offer.note)}</p>
              <a class="zp-link-btn" href="${escapeHtml(offer.affiliateUrl || offer.url)}" target="_blank" rel="${rel}">
                ${isAffiliate ? "Přejít k obchodníkovi" : "Zobrazit produkt u obchodníka"}
              </a>
              ${isAffiliate ? '<small class="zp-affiliate-label">Partnerský odkaz</small>' : ""}
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
        <p class="zp-muted-copy">Nejde o potvrzení individuální zdravotní vhodnosti. Shortlist vychází z praktických odpovědí a ověřených technických údajů.</p>
        <div class="zp-product-grid">
          ${products.map((product) => `
            <article class="zp-product-card">
              <p class="zp-product-family">${escapeHtml(product.solutionFamily)}</p>
              <h4>${escapeHtml(product.name)}</h4>
              <ul class="zp-facts">${productFacts(product)}</ul>
              <details>
                <summary>Co ještě ověřit</summary>
                <ul>${product.selectionNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
              </details>
              ${product.facts.suklCode ? `<p class="zp-sukl">SÚKL kód uvedený výrobcem: <strong>${escapeHtml(product.facts.suklCode)}</strong>. Aktuální úhradu je nutné prověřit před nákupem.</p>` : ""}
              ${renderOffers(product.offers)}
            </article>
          `).join("")}
        </div>
      </section>
    `;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const output = recommendMobility({
      environment: data.get("environment"),
      supportNeed: data.get("supportNeed"),
      canLiftWalker: data.get("canLiftWalker") ?? "unknown",
      handBrakes: data.get("handBrakes") ?? "unknown",
      seatNeeded: data.has("seatNeeded"),
      transportNeed: data.has("transportNeed"),
      homeSpace: data.has("tightSpace") ? "tight" : "standard",
      duration: data.get("duration") ?? "unknown"
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

    const acquisition = output.acquisition.length
      ? `<h3>Jak řešení získat</h3>
         <div>${output.acquisition.map((item) => `
           <article>
             <h4>${escapeHtml(item.label)}</h4>
             <p>${escapeHtml(item.reason)}</p>
           </article>
         `).join("")}</div>`
      : "";

    result.innerHTML = `
      <p class="zp-result-status">${escapeHtml(output.status)}</p>
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${recommendations}
      ${renderProducts(products)}
      ${acquisition}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
      <p class="zp-privacy-note">Odpovědi z tohoto formuláře zůstávají pouze v této otevřené stránce a nejsou tímto poradcem odesílány na server.</p>
    `;

    result.hidden = false;
    result.focus();
  });
}
