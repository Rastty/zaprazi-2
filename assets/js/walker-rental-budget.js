// ZP_RELEASE_0_8_252
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


// Compare actual user-confirmed quotes, even after published tariff expiry.
// No network or storage; no personal details; never select a medical aid by price.
const costComparison = document.querySelector("#zp-walker-cost-comparison");
if (costComparison) {
  const fields = ["buy-total","rent-month","cost-months","rent-fees","rent-deposit"]
    .map(key => costComparison.querySelector("#zp-walker-"+key));
  const result = costComparison.querySelector("#zp-walker-cost-result");
  const currency = amount => new Intl.NumberFormat("cs-CZ",{
    style:"currency",currency:"CZK",maximumFractionDigits:0
  }).format(amount);
  const hint = message => result.replaceChildren(document.createTextNode(message));
  const render = () => {
    const raw = fields.map(field => String(field.value).trim());
    const [buy,monthly,months,fees,deposit] = raw.map(Number);
    const valid = raw.every(s => /^\d{1,7}$/.test(s))
      && [buy,monthly,months,fees,deposit].every(Number.isSafeInteger)
      && buy>=1 && buy<=1000000 && monthly>=1 && monthly<=100000
      && months>=1 && months<=36 && fees>=0 && fees<=1000000
      && deposit>=0 && deposit<=1000000;
    if (!valid) {
      hint("Vyplňte všechny částky v celých korunách a dobu 1–36 měsíců. Nulu u poplatků či kauce zadejte pouze tehdy, pokud ji máte potvrzenou.");
      return;
    }
    const rent = monthly*months+fees;
    const gross = rent+deposit;
    const breakEven = Math.max(1,Math.ceil((buy-fees)/monthly));
    const delta = Math.abs(buy-rent);
    const heading = document.createElement("strong");
    heading.textContent = rent===buy ? "Za zvolenou dobu vycházejí náklady stejně."
      : (rent<buy?"Půjčení":"Koupě")+" vychází o "+currency(delta)+" levněji.";
    const rows = document.createElement("dl");
    for (const [label,amount] of [
      ["Koupě celkem",buy],["Pronájem po plném vrácení kauce",rent],
      ["Pronájem včetně dočasně vázané kauce",gross],["Samostatná vratná kauce",deposit]
    ]) {
      const row=document.createElement("div");
      const term=document.createElement("dt"); term.textContent=label;
      const value=document.createElement("dd"); value.textContent=currency(amount);
      row.append(term,value); rows.append(row);
    }
    const note = document.createElement("p");
    note.textContent = breakEven<=36
      ? "Od "+breakEven+". celého měsíce je při stejné sazbě a poplatcích koupě stejně drahá nebo levnější než pronájem."
      : "Při zadané sazbě a poplatcích nastává vyrovnání nákladů až po 36 měsících.";
    const caveat = document.createElement("p");
    caveat.textContent = "Jde pouze o porovnání nákladů při plném vrácení kauce, nikoli nabídku nebo doporučení konkrétní pomůcky. Ověřte splatnost jednotlivých částek a případný odlišný dlouhodobý tarif.";
    result.replaceChildren(heading,rows,note,caveat);
  };
  if(fields.every(Boolean)&&result){
    costComparison.hidden=false;
    hint("Zadejte potvrzené ceny obou možností.");
    for(const field of fields) field.addEventListener("input",()=>hint("Údaje se změnily. Pro nový výsledek stiskněte Porovnat náklady."));
    costComparison.addEventListener("submit",event=>{event.preventDefault();render();});
  }
}
