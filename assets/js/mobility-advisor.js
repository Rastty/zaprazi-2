import { recommendMobility } from "../../src/mobility/engine.js";

const form = document.querySelector("#zp-mobility-advisor");
const result = document.querySelector("#zp-mobility-result");

if (form && result) {
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const output = recommendMobility({
      environment: data.get("environment"),
      supportNeed: data.get("supportNeed"),
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
      ${acquisition}
      ${output.disclaimer ? `<p class="zp-disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
      <p class="zp-privacy-note">Odpovědi z tohoto formuláře zůstávají pouze v této otevřené stránce a nejsou tímto prototypem odesílány na server.</p>
    `;

    result.hidden = false;
    result.focus();
  });
}
