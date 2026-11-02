// ZP_RELEASE_0_8_185
const ACQUISITION_DESTINATIONS = Object.freeze({
  compare_rent_buy: { href: "/pujceni-choditka/#rozpocet-pujceni-choditka", action: "Spočítat orientační půjčovné" },
  compare_buy_rent: { href: "/pujceni-choditka/#rozpocet-pujceni-choditka", action: "Porovnat orientační půjčovné" },
  compare_acquisition: { href: "/pujceni-choditka/#rozpocet-pujceni-choditka", action: "Spočítat půjčovné a ověřit podmínky" },
  check_reimbursement: { href: "/choditko-na-pojistovnu/", action: "Ověřit cestu přes pojišťovnu" }
});

/**
 * Non-commercial follow-up paths, drawn exclusively from the mobility engine.
 * Never expose acquisition CTAs unless safety gates returned a valid candidate.
 */
export function getMobilityNextSteps(result) {
  if (!result || result.status !== "candidate" || !Array.isArray(result.acquisition)) {
    return { canCompareAcquisition: false, items: [] };
  }

  const seen = new Set();
  const items = [];
  for (const item of result.acquisition) {
    const mapped = item && ACQUISITION_DESTINATIONS[item.id];
    if (!mapped || seen.has(mapped.href)) continue;
    seen.add(mapped.href);
    items.push({
      id: item.id,
      label: item.label,
      reason: item.reason,
      href: mapped.href,
      action: mapped.action
    });
  }

  return { canCompareAcquisition: true, items };
}


/**
 * A blocked Mobility Advisor result must not become a dead end.
 * Safe recovery is informational only: never create a product recommendation,
 * affiliate URL, rent/buy CTA or insurance entitlement from an unsafe branch.
 * The decision engine remains the sole authority for candidate status.
 */
export function getMobilitySafeRecovery(result, answers = {}) {
  if (!result || result.status === "candidate" || result.status === "invalid_input") return null;
  if (result.status === "professional_check") {
    return {
      href: "/jak-vybrat-pecovatelskou-sluzbu/#vyber-pecovatelske-sluzby-kroky",
      action: "Jak zajistit praktickou pomoc doma",
      reason: "Pokud je pravidelně nutná pomoc další osoby, lze mezitím ověřit dostupné sociální služby. To ale nenahrazuje posouzení bezpečné chůze fyzioterapeutem nebo příslušným zdravotníkem."
    };
  }
  if (result.status !== "needs_more_info" || !Array.isArray(result.missing)) return null;
  if (result.missing.includes("supportNeed")) return null; // Existing safe-home route is already shown.
  if (result.missing.includes("handBrakes") ||
    (result.missing.length === 0 && answers.handBrakes === "no")) {
    return {
      href: "/rollator-pro-seniory/#bezpecne-pouziti-rollatoru",
      action: "Co bezpečně ověřit u brzd rollátoru",
      reason: "Neověřené nebo nezvládnuté brzdy nejsou důvodem k nákupu. Projděte bezpečné používání a případný jiný typ opory nejdříve konzultujte s odborníkem."
    };
  }
  if (result.missing.includes("canLiftWalker")) {
    return {
      href: "/choditka-pro-seniory/#vyber-typu",
      action: "Jak se liší čtyřbodové a dvoukolové chodítko",
      reason: "Podívejte se, jak se jednotlivé konstrukce používají. Zda člověk bezpečně zvládne nadzvednout rám při každém kroku, ověřte v praxi s odpovídající odbornou pomocí."
    };
  }
  return null;
}
