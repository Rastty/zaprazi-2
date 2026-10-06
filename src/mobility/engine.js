const ENVIRONMENTS = new Set(["indoor", "outdoor", "both"]);
const SUPPORT_NEEDS = new Set(["light", "steady", "person_assist", "unknown"]);
const BRAKE_USE = new Set(["yes", "no", "unknown"]);
const LIFT_WALKER = new Set(["yes", "no", "unknown"]);
const SPACE = new Set(["tight", "standard", "unknown"]);
const DURATION = new Set(["short_term", "long_term", "unknown"]);

function invalid(field) {
  return {
    status: "invalid_input",
    headline: "Některá odpověď není platná.",
    nextStep: "Vraťte se o krok zpět a odpověď upravte.",
    missing: [field],
    recommendations: [],
    acquisition: []
  };
}

function acquisitionFor(duration) {
  if (duration === "short_term") {
    return [
      {
        id: "compare_rent_buy",
        label: "Porovnat půjčení a koupi",
        reason: "U dočasné potřeby může být půjčení praktičtější než nákup. Porovnejte cenu, délku použití a dostupnost."
      },
      {
        id: "check_reimbursement",
        label: "Prověřit možnost úhrady",
        reason: "Možnost a podmínky úhrady je potřeba ověřit podle aktuálních pravidel a konkrétního prostředku před nákupem."
      }
    ];
  }

  if (duration === "long_term") {
    return [
      {
        id: "compare_buy_rent",
        label: "Porovnat koupi a půjčení",
        reason: "U delšího používání může dávat větší smysl nákup, ale záleží na ceně, servisu a dostupnosti půjčovny."
      },
      {
        id: "check_reimbursement",
        label: "Prověřit možnost úhrady",
        reason: "Nejdříve ověřte, zda konkrétní typ prostředku může být hrazen a jaký je správný postup."
      }
    ];
  }

  return [
    {
      id: "compare_acquisition",
      label: "Porovnat koupi, půjčení a možnost úhrady",
      reason: "Bez informace o délce používání zatím nedává smysl jednu cestu upřednostnit."
    }
  ];
}

/**
 * Practical, non-diagnostic Mobility Slice v1 rules.
 * Returns candidate solution families and evidence-backed product IDs,
 * never individual medical suitability.
 */
export function recommendMobility(input = {}) {
  const {
    environment,
    supportNeed,
    seatNeeded = false,
    handBrakes = "unknown",
    canLiftWalker = "unknown",
    homeSpace = "unknown",
    transportNeed = false,
    duration = "unknown"
  } = input;

  if (!ENVIRONMENTS.has(environment)) return invalid("environment");
  if (!SUPPORT_NEEDS.has(supportNeed)) return invalid("supportNeed");
  if (!BRAKE_USE.has(handBrakes)) return invalid("handBrakes");
  if (!LIFT_WALKER.has(canLiftWalker)) return invalid("canLiftWalker");
  if (!SPACE.has(homeSpace)) return invalid("homeSpace");
  if (!DURATION.has(duration)) return invalid("duration");

  if (supportNeed === "unknown") {
    return {
      status: "needs_more_info",
      headline: "Potřebujeme ještě upřesnit, jak velkou oporu při chůzi člověk potřebuje.",
      nextStep: "Vyberte, zda jde spíš o lehkou oporu, stabilní oporu při většině kroků, nebo fyzickou pomoc další osoby.",
      missing: ["supportNeed"],
      recommendations: [],
      acquisition: acquisitionFor(duration)
    };
  }

  if (supportNeed === "person_assist") {
    return {
      status: "professional_check",
      headline: "Samotný online výběr pomůcky tady nemusí být bezpečný.",
      nextStep: "Pokud člověku při chůzi často fyzicky pomáhá další osoba, je vhodné nejprve ověřit typ a nastavení pomůcky se zdravotníkem nebo výdejnou zdravotnických prostředků.",
      missing: [],
      recommendations: [],
      acquisition: acquisitionFor(duration)
    };
  }

  if (supportNeed === "light") {
    return {
      status: "outside_current_slice",
      headline: "Lehká opora může vyžadovat jiný typ řešení než chodítko nebo rollátor.",
      nextStep: "V první verzi ZaPrazi nebudeme předstírat přesný výběr. Rozšíříme poradce o lehčí opory až s ověřenými pravidly.",
      missing: [],
      recommendations: [],
      acquisition: acquisitionFor(duration)
    };
  }

  if ((environment === "outdoor" || environment === "both") && handBrakes !== "yes") {
    return {
      status: "needs_more_info",
      headline: "Pro venkovní řešení potřebujeme ověřit bezpečné ovládání brzdy.",
      nextStep: handBrakes === "no"
        ? "Nevolte brzděný rollátor jen podle obrázku nebo ceny. Je potřeba hledat řešení, které člověk dokáže bezpečně ovládat."
        : "Zjistěte, zda člověk bezpečně zvládne stisknout a používat ruční brzdy.",
      missing: handBrakes === "unknown" ? ["handBrakes"] : [],
      recommendations: [],
      acquisition: acquisitionFor(duration)
    };
  }

  if (environment === "indoor" && canLiftWalker === "unknown") {
    return {
      status: "needs_more_info",
      headline: "Pro výběr chodítka domů potřebujeme ještě jednu praktickou informaci.",
      nextStep: "Zjistěte, zda člověk při každém kroku zvládne lehce nadzvednout a posunout celé chodítko. Čtyřbodové chodítko s pevnými nohami tento pohyb vyžaduje.",
      missing: ["canLiftWalker"],
      recommendations: [],
      acquisition: acquisitionFor(duration)
    };
  }

  const parameters = [
    "správná výška a možnost nastavení",
    "celková šířka vzhledem k průchodům doma",
    "nosnost výrobku",
    "hmotnost a manipulace",
    "stabilita a způsob brzdění podle konkrétního typu"
  ];

  if (seatNeeded) parameters.push("sedátko a bezpečné použití při odpočinku");
  if (transportNeed) parameters.push("skládání a rozměry pro převoz");
  if (homeSpace === "tight") parameters.push("šířka v nejužším místě domácnosti");

  let id;
  let label;
  let reason;
  let productCandidateIds;

  if (environment === "indoor" && canLiftWalker === "no") {
    id = "indoor_front_wheel_walker_candidate";
    label = "Dvoukolové chodítko jako kandidátní typ řešení";
    reason = "Zadaná situace vyžaduje stabilní oporu doma, ale bez nutnosti zvedat celé chodítko při každém kroku.";
    productCandidateIds = ["besco-wa21"];
  } else if (environment === "indoor") {
    id = homeSpace === "tight"
      ? "indoor_compact_walker_candidate"
      : "indoor_walker_candidate";
    label = "Chodítko pro použití doma jako kandidátní typ řešení";
    reason = "Zadaná situace je zaměřená na stabilní oporu při pohybu doma a člověk zvládne chodítko při kroku lehce nadzvednout.";
    productCandidateIds = ["besco-wa17", "besco-wa21"];
  } else {
    id = "rollator_candidate";
    label = "Rollátor jako kandidátní typ řešení";
    reason = "Zadaná situace zahrnuje stabilní oporu při pohybu venku nebo doma i venku a bezpečné používání ručních brzd je potvrzené.";
    productCandidateIds = ["besco-wa78", "meyra-ideal-3061982"];
  }

  return {
    status: "candidate",
    headline: "Má smysl porovnat několik konkrétních řešení podle prostředí a praktických parametrů.",
    nextStep: "Níže jsou ověřené kandidátní výrobky. Před nákupem vždy zkontrolujte výšku, šířku, nosnost a způsob bezpečného používání.",
    missing: [],
    recommendations: [
      {
        id,
        label,
        reason,
        parameters,
        productCandidateIds
      }
    ],
    acquisition: acquisitionFor(duration),
    disclaimer: "Výsledek není diagnóza ani potvrzení individuální zdravotní vhodnosti konkrétní pomůcky."
  };
}
