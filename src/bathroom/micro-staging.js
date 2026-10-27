// ZP_RELEASE_0_8_175
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

  // All links are fixed editorial destinations, never constructed from answers.
  // The user may need these checklists even when we have no safe product match.
  const measurementGuides = {
    "toilet-riser": ["/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc", "Jak ověřit WC a výšku sedu"],
    "shower-chair": ["/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha", "Jak změřit sprchový prostor"],
    "toilet-chair": ["/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel", "Jak připravit místo pro židli"],
    "toilet-support": ["/madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton", "Jak ověřit podklad a možnosti opory"],
    "bath-transfer": ["/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana", "Jak změřit vanu a místo vedle ní"]
  };
  const [guidePath, guideLabel] = measurementGuides[key] || [
    "/co-zmerit-v-koupelne-pred-vyberem-pomucky/", "Připravit rozměry"
  ];

  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  // Shared, privacy-preserving progress overview for all five narrow advisors.
  // These labels are generated from the currently VISIBLE required fields only.
  const supportsProgress = typeof document.createElement === "function" &&
    typeof form.insertBefore === "function";
  const progress = supportsProgress ? document.createElement("section") : null;
  if (progress) {
    progress.className = "zp-micro-progress";
    progress.setAttribute("aria-label", "Postup poradcem");
    progress.innerHTML = `
    <p class="zp-micro-progress__kicker">Dva kroky k bezpečnějšímu rozhodnutí</p>
    <ol class="zp-micro-progress__steps" aria-label="Fáze výběru">
      <li data-zp-progress-phase="situation" aria-current="step"><span>1</span><strong>Co člověk potřebuje</strong></li>
      <li data-zp-progress-phase="fit"><span>2</span><strong>Pasuje konkrétní pomůcka?</strong></li>
    </ol>
    <p class="zp-micro-progress__count" data-zp-progress-label>Začněte popisem situace.</p>
    <div class="zp-micro-progress__bar" role="progressbar" aria-label="Vyplněné povinné otázky této fáze" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <span></span>
    </div>
    <p class="zp-micro-progress__help" data-zp-progress-help>Nevíte-li odpověď, zvolte Nevím. Poradce vás nezavede k neověřenému nákupu.</p>
  `;
    form.insertBefore(progress, form.firstChild);
  }
  const phaseItems = progress ? [...progress.querySelectorAll("[data-zp-progress-phase]")] : [];
  const progressText = progress?.querySelector("[data-zp-progress-label]");
  const progressHelp = progress?.querySelector("[data-zp-progress-help]");
  const progressBar = progress?.querySelector('[role="progressbar"]');

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

  const phaseRequiredGroups = phase => phase === "fit"
    ? [...fitGroups.values()].filter(group => !group.hidden && !group.closest("[hidden]"))
    : initialRequiredGroups();

  const updateProgress = (phase = previewReady ? "fit" : "situation") => {
    // Do not alter or block fit-gate behavior in limited DOM test/fallback hosts.
    if (!progressBar) return;
    const required = phase === "finished" ? [] : phaseRequiredGroups(phase);
    const answered = required.filter(group => !!group.querySelector('input[type="radio"]:checked')).length;
    const percent = phase === "finished" ? 100 : required.length ? Math.round(100 * answered / required.length) : 0;
    progressBar.setAttribute("aria-valuenow", String(percent));
    progressBar.style.setProperty("--zp-progress", percent + "%");
    progressText.textContent = phase === "paused"
      ? "Bezpečný výběr je pozastaven. Níže najdete konkrétní další krok."
      : phase === "finished"
        ? "Výsledek je připravený níže. Podívejte se, co udělat dál."
        : "Zodpovězeno " + answered + " z " + required.length + " potřebných otázek v " +
        (phase === "fit" ? "druhém" : "prvním") + " kroku.";
    progressHelp.textContent = phase === "paused"
      ? "V nejisté situaci je pomoc odborníka nebo měření důležitější než nákup."
      : phase === "finished"
        ? "Změníte-li odpověď, dřívější doporučení a nabídka se z bezpečnostních důvodů odstraní."
      : phase === "fit"
        ? "Porovnejte fakta u uvedeného modelu se skutečným prostorem a nosností. Nevím je bezpečná odpověď."
        : "Rozhodujeme podle situace a způsobu přesunu, ne podle diagnózy. Nevím je platná odpověď.";
    phaseItems.forEach(item => {
      const current = item.getAttribute("data-zp-progress-phase") === (phase === "finished" ? "fit" : phase);
      if (current && phase !== "finished") item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
      item.classList.toggle("is-current", current);
      item.classList.toggle("is-complete", phase === "finished" ||
        ((phase === "fit" || phase === "paused") && item.getAttribute("data-zp-progress-phase") === "situation"));
    });
  };
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

  updateProgress("situation");

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
    result.innerHTML = '<p class="zp-result-status">Nejdřív bezpečný další krok</p><h2>' +
      esc(outcome.headline) + '</h2><p>' + esc(outcome.nextStep) +
      '</p><div class="zp-micro-next"><h3>Co můžete udělat teď?</h3>' +
      '<ol><li>Pokud je přesun nejistý nebo vyžaduje fyzické zvedání, ověřte bezpečný postup s odborníkem.</li>' +
      '<li>Projděte rozměry, nosnost a podmínky instalace. Při nejistotě nezkoušejte rizikový přesun.</li></ol>' +
      '<p><strong>Co si připravit:</strong> ' + esc(guideLabel) +
      '. Kontrolní návod najdete nad tímto poradcem v odkazech k měření.</p></div>' +
      '<p class="zp-disclaimer">Bez splnění bezpečnostních podmínek nevypisujeme konkrétní nákupní nabídku.</p>';
    updateProgress("paused");
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
    updateProgress("situation");
  };

  form.addEventListener("change", event => {
    // A corrected answer must remove its error immediately, without another submit.
    // Do not mark untouched fields before the user first tries to continue.
    if (!previewReady) {
      if (firstStepAttempted) updateInitialErrors();
      updateProgress("situation");
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
    updateProgress("fit");
  });

  // capture listener blocks the pre-existing final handler only during stage 1.
  // On stage 2 the original fail-closed engine is the sole source of offers.
  submit.addEventListener("click", event => {
    if (previewReady) {
      // Let the original fit-gated Advisor handler render first. Never infer
      // suitability or success from form values in this presentational layer.
      queueMicrotask(() => {
        if (!result.hidden && result.innerHTML.trim()) updateProgress("finished");
        else updateProgress("fit");
      });
      return;
    }
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
      '</div><div class="zp-micro-next"><h3>Jak pokračovat bez hádání?</h3>' +
      '<ol><li>Projděte uvedené rozměry a nosnost konkrétního modelu.</li>' +
      '<li>Změřte doma skutečný prostor a ověřte bezpečný způsob přesunu.</li>' +
      '<li>Teprve pak v kroku 2 potvrďte, co opravdu víte. Jinak zvolte Nevím.</li></ol>' +
      '<p><strong>Co si připravit:</strong> ' + esc(guideLabel) +
      '. Praktický kontrolní návod je dostupný v druhém kroku nad otázkami k rozměrům.</p></div>' +
      '<p class="zp-disclaimer">Toto je jen předběžný výběr. Bez ověření v kroku 2 nezobrazujeme žádný odkaz k nákupu.</p>';
    previewReady = true;
    updateConditionalFit();
    updateProgress("fit");
    preview.hidden = false;
    fitStage.hidden = false;
    result.hidden = true;
    submit.textContent = "2. Vyhodnotit parametry";
    preview.focus();
  }, true);

  return true;
}
