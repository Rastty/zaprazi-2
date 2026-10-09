// ZP_RELEASE_0_8_91
// Presentation-only adapter: turns existing return-home decisions into checkable actions.
// This never changes engine status, product suitability or acquisition gates.
export function buildReturnHomeChecklist(plan = {}) {
  const groups = [
    { items: plan.dischargeActions, kind: "discharge", kindLabel: "Před odjezdem", order: 0 },
    { items: plan.routes, kind: "advisor", kindLabel: "Navazující poradce", order: 1 },
    { items: plan.priorities, kind: "verify", kindLabel: "K ověření", order: 2 }
  ];
  return groups.flatMap(({ items, kind, kindLabel, order }) =>
    (Array.isArray(items) ? items : []).map((item, index) => ({
      id: `${kind}-${index}`,
      kind,
      kindLabel,
      order,
      priority: Number.isFinite(item.priority) ? item.priority : 3,
      label: item.label,
      reason: item.reason,
      href: kind === "advisor" ? item.href : null
    }))
  ).sort((a, b) => a.priority - b.priority || a.order - b.order);
}
