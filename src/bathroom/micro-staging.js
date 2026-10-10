// ZP_RELEASE_0_8_94
import { getBathroomProducts } from "./catalog.js";
import { formatBathroomFacts } from "./product-facts-display.js";
import { previewBathroomCandidates } from "./preview.js";

/**
 * Installs the SAME two-step product-fit gate for all narrow Bathroom Advisors.
 *
 * First submit: only situation and safe transfer questions are asked; known
 * product facts are shown with NO affiliate/merchant links.
 * Second submit: existing Advisor click handler runs with real fit answers.
 * A change in situation invalidates the preview and clears all fit answers.
 */
export function installBathroomMicroStaging({
  form, result, submit, errors, key, requiredAttr, fitNames, primaryNeed, alternativeIds = [], conditionalFit = {}, dependentFitResets = {}
}) {
  if (!form || !result || !submit || !errors) return false;
  const preview = document.querySelector("#zp-" + key + "-preview");
  const fitStage = document.querySelector("#zp-" + key + "-fit-stage");
  if (!preview || !fitStage) return false;
  let previewReady = false;
  let firstStepAttempted = false;

  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const fitGroups = new Map();
  for (const name of fitNames) {
    const radio = form.querySelector('input[name="' + name + '"]');
    const group = radio?.closest("fieldset");
    if (!group) throw new Error("Missing model-specific fit question");
    fitStage.appendChild(group);
    fitGroups.set(name, group);
  }

  const value = (name, fallback = "unknown") =>
    form.querySelector('input[name="' + name + '"]:checked')?.value ?? fallback;
  // Keep only the currently visible stage-one questions in validation.
  // Fit-stage questions are inside a hidden ancestor until a product is shown.
  const initialRequiredGroups = () =>
    [...form.querySelectorAll("[" + requiredAttr + "]")]
      .filter(group => !group.closest("[hidden]"));

  const updateInitialErrors = () => {
    const missing = [];
    initialRequiredGroups().forEach(group => {
      const invalid = !value(group.getAttribute(requiredAttr), "");
      group.classList.toggle("is-error", invalid);
      if (invalid) {
        group.setAttribute("aria-invalid", "true");
        missing.push(group);
      } else {
        group.removeAttribute("aria-invalid");
      }
    });
    if (missing.length) {
      errors.textContent = missing.length === 1
        ? "Doplňte prosím zvýrazněnou otázku."
        : `Doplňte prosím ${missing.length} zvýrazněné otázky.`;
      errors.hidden = false;
    } else {
      errors.textContent = "";
      errors.hidden = true;
    }
    return missing;
  };

  // Show only the model checks relevant to the selected construction.
  // Hidden fit answers are cleared so they cannot be reused after a branch change.
  const updateConditionalFit = () => {
    for (const [name, isRelevant] of Object.entries(conditionalFit)) {
      const group = fitGroups.get(name);
      if (!group) throw new Error("Conditional fit field not found: " + name);
      const show = isRelevant(value);
      group.hidden = !show;
      if (!show) {
        group.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
        group.classList.remove("is-error");
        group.removeAttribute("aria-invalid");
      }
    }
  };

  const input = () => ({
    primaryNeed: typeof primaryNeed === "function" ? primaryNeed(value) : primaryNeed,
    transferAbility: value("transferAbility"),
    floorStable: value("floorStable"),
    wallFixing: value("wallFixing"),
    bathTransferIndependent: value("bathTransferIndependent"),
    duration: value("duration")
  });

  const renderProduct = (product, alternative) => {
    const facts = formatBathroomFacts(product.facts).map(text => '<li>' + esc(text) + '</li>').join("");
    return '<article class="zp-product-card">' +
      '<p class="zp-product-family">' + (alternative ? "Možná alternativa" : "Předběžný kandidát") + '</p>' +
      '<h4>' + esc(product.name) + '</h4><ul class="zp-facts">' + facts + '</ul>' +
      '<details><summary>Co ověřit před pořízením</summary><ul>' +
      product.selectionNotes.map(note => '<li>' + esc(note) + '</li>').join("") +
      '</ul></details>' +
      '<p class="zp-muted-copy">Datum doložené kontroly podkladů: ' +
      esc(product.evidence?.map(e=>e.checkedAt).filter(Boolean).join(", ") || "neuvedeno") +
      '. Zatím nebyla potvrzena vhodnost pro konkrétního člověka.</p></article>';
  };

  const block = outcome => {
    previewReady = false;
    preview.hidden = true;
    fitStage.hidden = true;
    result.innerHTML = '<h2>' + esc(outcome.headline) + '</h2><p>' + esc(outcome.nextStep) +
      '</p><p class="zp-disclaimer">Bez splnění bezpečnostních podmínek nevypisujeme konkrétní nákupní nabídku.</p>';
    result.hidden = false;
    errors.hidden = true;
    result.focus();
  };

  const reset = () => {
    previewReady = false;
    preview.hidden = true;
    fitStage.hidden = true;
    result.hidden = true;
    submit.textContent = "1. Ukázat možný výrobek";
    firstStepAttempted = false;
    form.querySelectorAll("[" + requiredAttr + "]").forEach(group => {
      group.classList.remove("is-error");
      group.removeAttribute("aria-invalid");
    });
    fitStage.querySelectorAll('input[type="radio"]').forEach(radio => { radio.checked = false; });
    errors.hidden = true;
    errors.textContent = "";
  };

  form.addEventListener("change", event => {
    // A corrected answer must remove its error immediately, without another submit.
    // Do not mark untouched fields before the user first tries to continue.
    if (!previewReady) {
      if (firstStepAttempted) updateInitialErrors();
      return;
    }
    if (!event.target?.closest?.("#zp-" + key + "-fit-stage")) {
      reset();
      return;
    }
    // A confirmation for one construction must never approve a different
    // construction. In particular, the 110 kg bath bench confirmation cannot
    // silently approve a 100 kg bath seat after the user switches model.
    for (const dependentName of dependentFitResets[event.target?.name] || []) {
      const group = fitGroups.get(dependentName);
      if (!group) throw new Error("Dependent fit field not found: " + dependentName);
      group.querySelectorAll('input[type="radio"]').forEach(radio => { radio.checked = false; });
      group.classList.remove("is-error");
      group.removeAttribute("aria-invalid");
    }
    updateConditionalFit();
  });

  // capture listener blocks the pre-existing final handler only during stage 1.
  // On stage 2 the original fail-closed engine is the sole source of offers.
  submit.addEventListener("click", event => {
    if (previewReady) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    firstStepAttempted = true;
    const missing = updateInitialErrors();
    if (missing.length) {
      missing[0].setAttribute("tabindex", "-1");
      missing[0].focus();
      return;
    }
    firstStepAttempted = false;

    const p = previewBathroomCandidates(input());
    if (p.status !== "unverified_preview") {
      block(p);
      return;
    }
    const ids = [...new Set([...p.productCandidateIds, ...alternativeIds])];
    const products = getBathroomProducts(ids);
    if (!products.length) {
      block({
        headline: "Zatím nemáme doloženou konkrétní pomůcku pro tento scénář.",
        nextStep: "Upřesněte potřebu nebo požádejte o odborné posouzení."
      });
      return;
    }
    const primary = new Set(p.productCandidateIds);
    preview.innerHTML = '<p class="zp-result-status">1. Orientační výběr – vhodnost neověřena</p>' +
      '<h2>Konkrétní pomůcka a její parametry</h2>' +
      '<p>Teprve teď porovnejte nosnost a rozměry s reálnou situací.</p>' +
      '<div class="zp-product-grid">' +
      products.map(product => renderProduct(product, !primary.has(product.id))).join("") +
      '</div><p class="zp-disclaimer">Toto je jen předběžný výběr. Bez ověření v kroku 2 nezobrazujeme žádný odkaz k nákupu.</p>';
    previewReady = true;
    updateConditionalFit();
    preview.hidden = false;
    fitStage.hidden = false;
    result.hidden = true;
    submit.textContent = "2. Vyhodnotit parametry";
    preview.focus();
  }, true);

  return true;
}
