/**
 * A provisional mobility product is NOT a verified fit.
 * Render individual model-fit checks before ANY product-specific retailer CTA.
 * Inputs stay solely in the browser and are never sent to analytics or a server.
 */
export function renderMobilityProductFitGate(offersHtml) {
  if (!offersHtml) return "";
  return `
    <div class="zp-mobility-fit-gate">
      <h5>Ověření konkrétního modelu před nákupem</h5>
      <p>Výše uvedené parametry platí pro zobrazený výrobek. Potvrďte všechny tři body teprve po jejich porovnání s reálnými potřebami člověka a prostředím.</p>
      <label><input type="checkbox" data-zp-mobility-fit-confirm="load"> Maximální nosnost tohoto modelu bezpečně stačí.</label>
      <label><input type="checkbox" data-zp-mobility-fit-confirm="width"> Šířka tohoto modelu bezpečně projde všemi potřebnými místy.</label>
      <label><input type="checkbox" data-zp-mobility-fit-confirm="height"> Výšku madel lze nastavit pro bezpečné používání.</label>
      <p class="zp-muted-copy">Pokud cokoli nevíte nebo nevyhovuje, neotvírejte nabídku ke koupi. Ověřte rozměry a nastavení s prodejcem nebo odbornou výdejnou.</p>
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
    if (offers) offers.hidden = checks.length !== 3 || !checks.every(checkbox => checkbox.checked);
  });
}
