// ZP_RELEASE_0_8_148
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
