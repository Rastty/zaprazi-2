/**
 * A provisional mobility product is NOT a verified fit.
 * Render individual model-fit checks before ANY product-specific retailer CTA.
 * Inputs stay solely in the browser and are never sent to analytics or a server.
 */
export function renderMobilityProductFitGate(offersHtml, options = {}) {
  if (!offersHtml) return "";
  const checks = [
    ["load", "Maximální nosnost tohoto modelu bezpečně stačí."],
    ["width", "Šířka tohoto modelu bezpečně projde všemi potřebnými místy."],
    ["height", "Výšku madel lze nastavit pro bezpečné používání."]
  ];
  // A generic answer about hand strength is not a check of this exact model.
  // This is required even when no seat or transport is requested.
  if (options.requireBrakeFit) {
    checks.push(["brakes", "Ruční brzdy tohoto konkrétního rollátoru spolehlivě fungují a člověk je zvládne použít při zastavení i bezpečně zajistit."]);
  }
  if (options.requireSeatFit) {
    checks.push(["seat", "Sedátko je pro člověka prakticky použitelné a před usednutím umí bezpečně zajistit brzdy."]);
  }
  if (options.requireTransportFit) {
    checks.push(["transport", "Ověřili jsme složené rozměry i hmotnost a tento model lze bezpečně naložit do konkrétního auta."]);
  }

  return `
    <div class="zp-mobility-fit-gate">
      <h5>Ověření konkrétního modelu před pořízením</h5>
      <p>Výše uvedené parametry platí pro zobrazený výrobek. Potvrďte všechny relevantní body teprve po jejich porovnání s reálnými potřebami člověka a prostředím.</p>
      ${checks.map(([key, label]) => `<label><input type="checkbox" data-zp-mobility-fit-confirm="${key}"> ${label}</label>`).join("")}
      <p class="zp-fit-progress" data-zp-fit-progress role="status" aria-live="polite" aria-atomic="true">Potvrzeno 0 z ${checks.length} kontrol. Nabídka je zatím skrytá.</p>
      <p class="zp-muted-copy">Pokud cokoli nevíte nebo nevyhovuje, neotvírejte nabídku ke koupi či půjčení. Ověřte rozměry a nastavení s prodejcem nebo odbornou výdejnou.</p>
      <div class="zp-fit-locked-offers" hidden>${offersHtml}</div>
    </div>`;
}

/**
 * One delegated listener survives replacing the results of a recommendation.
 * Every checkbox must be checked for this *same model card*; checking another
 * model's values must never unlock a different product.
 */
export function installMobilityProductFitGate(root) {
  if (!root || typeof root.addEventListener !== "function") return;
  root.addEventListener("change", event => {
    if (!event.target?.matches?.('[data-zp-mobility-fit-confirm]')) return;
    const gate = event.target.closest(".zp-mobility-fit-gate");
    if (!gate) return;
    const checks = [...gate.querySelectorAll('[data-zp-mobility-fit-confirm]')];
    const offers = gate.querySelector(".zp-fit-locked-offers");
    const completed = checks.filter(checkbox => checkbox.checked).length;
    const unlocked = checks.length >= 3 && completed === checks.length;
    if (offers) offers.hidden = !unlocked;
    const progress = gate.querySelector("[data-zp-fit-progress]");
    if (progress) progress.textContent = unlocked
      ? "Všechna ověření hotová. Nyní můžete porovnat dostupnost konkrétního modelu."
      : `Potvrzeno ${completed} z ${checks.length} kontrol. Nabídka je zatím skrytá.`;
  });
}
