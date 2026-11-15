// ZP_RELEASE_0_8_219
// Voluntary, local arithmetic only: no network, cookies, storage or telemetry.
// The server suppresses this calculator when its underlying rental evidence is stale.
const form = document.querySelector("#zp-walker-rental-budget");
if (form) {
  const model = form.querySelector("#zp-rental-budget-model");
  const months = form.querySelector("#zp-rental-budget-months");
  const output = form.querySelector("#zp-rental-budget-result");
  const format = amount => new Intl.NumberFormat("cs-CZ", {
    style: "currency", currency: "CZK", maximumFractionDigits: 0
  }).format(amount);
  const render = () => {
    const option = model.selectedOptions[0];
    const rate = Number(option?.dataset.monthlyPrice);
    const duration = Number(months.value);
    // Finite, positive, offer-backed amounts only. No formula for day/week
    // prices, booking fees, insurance eligibility or an unverified buying price.
    if (!option || !Number.isFinite(rate) || rate <= 0 || ![1,3,6].includes(duration)) {
      output.replaceChildren(document.createTextNode("Přepočet není dostupný. Ověřte skutečné údaje půjčovny."));
      return;
    }
    const total = rate * duration;
    const label = duration === 1 ? "1 měsíc" : duration === 3 ? "3 měsíce" : "6 měsíců";
    const strong = document.createElement("strong");
    strong.textContent = format(total);
    output.replaceChildren(
      document.createTextNode("Příklad: "+option.dataset.provider+" · "+option.dataset.model+" · "+label+". Půjčovné orientačně "),
      strong,
      document.createTextNode(". Vratná kauce, doprava, případné minimální účtování a individuální dlouhodobé podmínky nejsou zahrnuty. Nejde o nabídku ani o potvrzení vhodnosti pomůcky.")
    );
  };
  form.hidden = false;
  form.addEventListener("submit", event => { event.preventDefault(); render(); });
  model.addEventListener("change", render);
  months.addEventListener("change", render);
  render();
}


// If editorial rental rates expire, families can still calculate from their
// own freshly verified quote. This never uses the page's old rental examples.
const ownQuoteForm = document.querySelector("#zp-walker-own-quote-budget");
if (ownQuoteForm) {
  const monthly = ownQuoteForm.querySelector("#zp-walker-own-quote-monthly");
  const duration = ownQuoteForm.querySelector("#zp-walker-own-quote-months");
  const result = ownQuoteForm.querySelector("#zp-walker-own-quote-result");
  const hint = () => result.replaceChildren(document.createTextNode(
    "Zadejte měsíční částku, kterou jste si ověřili přímo u půjčovny. Nic neodesíláme."
  ));
  ownQuoteForm.hidden = false;
  hint();
  monthly.addEventListener("input", hint);
  duration.addEventListener("change", hint);
  ownQuoteForm.addEventListener("submit", event => {
    event.preventDefault();
    const raw = String(monthly.value || "").trim();
    const rate = Number(raw);
    const months = Number(duration.value);
    // Decimal/negative/unbounded amounts and arbitrary durations are rejected.
    // Never assume an old provider's rate is current or that cost proves fit.
    if (!/^[1-9]\d{0,5}$/.test(raw) || !Number.isSafeInteger(rate)
      || rate > 100000 || ![1,3,6].includes(months)) {
      result.replaceChildren(document.createTextNode(
        "Nelze přepočítat. Zadejte celé měsíční půjčovné od 1 do 100 000 Kč a platnou dobu."
      ));
      return;
    }
    const total = rate * months;
    const formatted = new Intl.NumberFormat("cs-CZ", {
      style:"currency",currency:"CZK",maximumFractionDigits:0
    }).format(total);
    const emphasis = document.createElement("strong");
    emphasis.textContent = formatted;
    result.replaceChildren(
      document.createTextNode("Pouze orientační násobek vlastní měsíční sazby na "
        +months+" "+(months===1?"měsíc":months===3?"měsíce":"měsíců")+": "),
      emphasis,
      document.createTextNode(". Zkontrolujte u půjčovny více-měsíční tarif, kauci, dopravu a celkovou konečnou cenu. Výpočet není nabídka ani potvrzení vhodnosti pomůcky.")
    );
  });
}
