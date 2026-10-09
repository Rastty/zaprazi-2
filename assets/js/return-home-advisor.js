// ZP_RELEASE_0_8_67
import { buildReturnHomePlan } from "../../src/return-home/engine.js";

const form = document.querySelector("#zp-return-home-advisor");
const result = document.querySelector("#zp-return-home-result");
const submitButton = document.querySelector("#zp-return-home-submit");
const errorBox = document.querySelector("#zp-return-home-errors");
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

  const updateConditional = () => {
    const showWheelchair = checkedValue("walking", "unknown") === "wheelchair_or_no_walk";
    form.querySelectorAll("[data-zp-return-conditional='wheelchair']").forEach((fieldset) => {
      fieldset.hidden = !showWheelchair;
      if (!showWheelchair) {
        fieldset.querySelectorAll("input").forEach((input) => { input.checked = false; });
        fieldset.classList.remove("is-error");
        fieldset.removeAttribute("aria-invalid");
      }
    });
  };

  const visibleRequiredGroups = () =>
    [...form.querySelectorAll("[data-zp-return-required]")].filter((fieldset) => !fieldset.hidden);

  const validate = () => {
    const missing = visibleRequiredGroups().filter((fieldset) => !checkedValue(fieldset.dataset.zpReturnRequired));

    visibleRequiredGroups().forEach((fieldset) => {
      const invalid = !checkedValue(fieldset.dataset.zpReturnRequired);
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

  const renderItems = (title, items, className = "") => {
    if (!items?.length) return "";
    return `
      <section class="${className}">
        <h3>${escapeHtml(title)}</h3>
        <div class="zp-acquisition-summary">
          <div>
            ${items.map((item) => `
              <article>
                <h4>${escapeHtml(item.label)}</h4>
                <p>${escapeHtml(item.reason)}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  };

  const renderRoutes = (routes, blocked) => {
    if (!routes?.length) return "";
    return `
      <section>
        <h3>${blocked ? "Co řešit hned po odstranění blokujícího bodu" : "Navazující ZaPrazi poradci"}</h3>
        <div class="zp-product-grid">
          ${routes.map((item) => `
            <article class="zp-product-card">
              <h4>${escapeHtml(item.label)}</h4>
              <p>${escapeHtml(item.reason)}</p>
              <a class="zp-link-btn" href="${escapeHtml(item.href)}">Otevřít poradce</a>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  };

  updateConditional();

  form.addEventListener("change", (event) => {
    if (event.target?.name === "walking") updateConditional();

    const group = event.target?.closest?.("[data-zp-return-required]");
    if (group && checkedValue(group.dataset.zpReturnRequired)) {
      group.classList.remove("is-error");
      group.removeAttribute("aria-invalid");
    }

    if (!builderStarted) {
      builderStarted = true;
      track("builder_start");
    }
  });

  result.addEventListener("click", (event) => {
    if (!event.target?.closest?.("#zp-return-home-print")) return;
    if (typeof window.print !== "function") return;
    document.body.classList.add("zp-return-print-mode");
    try {
      window.print();
    } catch (error) {
      document.body.classList.remove("zp-return-print-mode");
    }
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("zp-return-print-mode");
  });

  submitButton.addEventListener("click", () => {
    if (!validate()) return;

    const output = buildReturnHomePlan({
      timing: checkedValue("timing", "unknown"),
      entranceReady: checkedValue("entranceReady", "unknown"),
      transferAbility: checkedValue("transferAbility", "unknown"),
      walking: checkedValue("walking", "unknown"),
      toiletReady: checkedValue("toiletReady", "unknown"),
      bathroomReady: checkedValue("bathroomReady", "unknown"),
      bedReady: checkedValue("bedReady", "unknown"),
      wheelchairReady: checkedValue("wheelchairReady", "unknown"),
      homeCare: checkedValue("homeCare", "unknown")
    });

    const blocked = output.status === "blocked_before_discharge";

    result.innerHTML = `
      <h2>${escapeHtml(output.headline)}</h2>
      <p>${escapeHtml(output.nextStep)}</p>
      ${renderItems("Blokuje bezpečný návrat domů", output.blockers, "zp-critical-plan")}
      ${renderItems("Co řešit s nemocničním týmem před odjezdem", output.dischargeActions)}
      ${renderItems("Další priority", output.priorities)}
      ${renderRoutes(output.routes, blocked)}
      <p class="zp-disclaimer">${escapeHtml(output.acquisitionNote)}</p>
      <p class="zp-muted-copy">ZaPrazi neposuzuje, zda je člověk zdravotně způsobilý k propuštění. Tento plán řeší jen praktickou připravenost domácnosti a návazné kroky.</p>
      <div class="zp-return-print-actions">
        <button type="button" class="zp-link-btn" id="zp-return-home-print">Vytisknout plán pro rodinu</button>
        <p class="zp-muted-copy">Tisk probíhá ve vašem prohlížeči. Odpovědi neodesíláme a plán na webu neukládáme. S výtiskem zacházejte jako se soukromým dokumentem.</p>
      </div>
    `;

    track("builder_complete");
    if (output.routes.length) track("recommendation_view");

    result.hidden = false;
    result.focus();
  });
}
