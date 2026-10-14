// ZP_RELEASE_0_8_135
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
