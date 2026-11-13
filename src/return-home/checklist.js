// ZP_RELEASE_0_8_219
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


/**
 * Presentation-only three-question orientation for the existing discharge plan.
 * Every actionable label comes from the original deterministic engine. This
 * adapter never changes blockers, routing, fit gates or discharge readiness.
 * In particular, a single highlighted item NEVER replaces the full list.
 */
export function buildReturnHomeOverview(plan = {}) {
  if (plan.status === "invalid_input" || typeof plan.headline !== "string") return null;
  const items = key => Array.isArray(plan[key]) ? plan[key] : [];
  const blockers = items("blockers");
  const priorities = items("priorities");
  const actions = items("dischargeActions");
  const routes = items("routes");

  const nextVerification = blockers[0] || priorities[0] || actions[0];
  const nextAction = actions[0] || priorities[0] || routes[0];
  const count = blockers.length;

  const verification = count > 0
    ? "Je potřeba vyřešit " + count +
      (count === 1 ? " kritický bod" : count < 5 ? " kritické body" : " kritických bodů") +
      " před návratem. První: " + String(nextVerification.label) +
      ". Projděte všechny kritické body uvedené výše."
    : nextVerification
      ? "Ještě ověřit: " + String(nextVerification.label) +
        ". Podrobnosti a další kontroly najdete v celém seznamu níže."
      : "Z těchto odpovědí nevyplynul další konkrétní kontrolní bod. " +
        "Zdravotní i praktickou připravenost je potřeba projít s nemocničním týmem.";

  const action = nextAction
    ? String(nextAction.label) +
      ". Nejde o potvrzení zdravotní způsobilosti ani vhodnosti pomůcky."
    : count > 0
      ? "Ještě před propuštěním proberte všechny kritické body s nemocničním týmem."
      : "Před odjezdem potvrďte s nemocničním týmem návazný plán a potřebnou pomoc doma.";

  return {
    knowledge: String(plan.headline),
    verification,
    action,
    criticalCount: count
  };
}
