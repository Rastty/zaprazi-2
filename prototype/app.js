import { recommendMobility } from "../src/mobility/engine.js";

const form = document.querySelector("#advisor");
const result = document.querySelector("#result");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

  const recommendationHtml = output.recommendations.map((item) => `
    <article>
      <h3>${escapeHtml(item.label)}</h3>
      <p>${escapeHtml(item.reason)}</p>
      <h4>Co ověřit před výběrem</h4>
      <ul>${item.parameters.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
    </article>
  `).join("");

  const acquisitionHtml = output.acquisition.length
    ? `<h3>Jak řešení získat</h3>
       <div class="choices">${output.acquisition.map((item) => `
         <article>
           <h4>${escapeHtml(item.label)}</h4>
           <p>${escapeHtml(item.reason)}</p>
         </article>
       `).join("")}</div>`
    : "";

  result.innerHTML = `
    <p class="status">${escapeHtml(output.status)}</p>
    <h2>${escapeHtml(output.headline)}</h2>
    <p>${escapeHtml(output.nextStep)}</p>
    ${recommendationHtml}
    ${acquisitionHtml}
    ${output.disclaimer ? `<p class="disclaimer">${escapeHtml(output.disclaimer)}</p>` : ""}
  `;
  result.hidden = false;
  result.focus();
});
