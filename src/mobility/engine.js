// ZP_RELEASE_0_8_141
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
      label: "Porovnat půjčení a koupi",
      reason: "Bez informace o délce používání zatím nedává smysl jednu cestu upřednostnit. Kalkulačka ukáže orientační půjčovné; nákup i půjčení vyžadují ověření konkrétního výrobku."
    },
    {
      id: "check_reimbursement",
      label: "Prověřit možnost úhrady",
      reason: "Možnost úhrady přes pojišťovnu závisí na konkrétním zdravotnickém prostředku a platných pravidlech, ne na tom, zda už víme délku používání."
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
      nextStep: "Pokud nedokážete bezpečně rozlišit lehkou oporu, stabilní oporu nebo potřebu fyzické pomoci, nezkoušejte volit chodítko podle fotografie. Zkontrolujte místo, kde se chodí, a vhodný typ opory ověřte s fyzioterapeutem nebo jiným příslušným odborníkem.",
      missing: ["supportNeed"],
      recommendations: [],
      acquisition: []
    };
  }

  if (supportNeed === "person_assist") {
    return {
      status: "professional_check",
      headline: "Samotný online výběr pomůcky tady nemusí být bezpečný.",
      nextStep: "Pokud je při chůzi běžně potřeba fyzická pomoc druhé osoby, online poradce tady nemá vybírat konkrétní chodítko. Nejdřív ověřte bezpečný způsob pohybu a vhodný typ pomůcky se zdravotníkem nebo odbornou výdejnou zdravotnických prostředků.",
      missing: [],
      recommendations: [],
      acquisition: []
    };
  }

  if (supportNeed === "light") {
    return {
      status: "outside_current_slice",
      headline: "Lehká opora neznamená automaticky potřebu chodítka.",
      nextStep: "Začněte kontrolou bezpečnosti tras, na kterých člověk chodí: světlo, kluzké plochy, volné koberce a překážky. Pokud potřebuje pomůcku k chůzi, její typ, správnou výšku a způsob používání ověřte s fyzioterapeutem nebo odbornou výdejnou. Bez toho nebudeme doporučovat konkrétní model.",
      missing: [],
      recommendations: [],
      acquisition: []
    };
  }

  const needsBrakedRollator = seatNeeded || environment === "outdoor" || environment === "both";

  if (needsBrakedRollator && handBrakes !== "yes") {
    return {
      status: "needs_more_info",
      headline: handBrakes === "no"
        ? "Ruční brzdy nelze bezpečně ovládat: brzděný rollátor teď nevybírejte."
        : seatNeeded
          ? "Pro řešení se sedátkem potřebujeme ověřit bezpečné ovládání brzd."
          : "Pro venkovní řešení potřebujeme ověřit bezpečné ovládání brzd.",
      nextStep: handBrakes === "no"
        ? "Když člověk ruční brzdy bezpečně nezvládá, nevybírejte brzděný rollátor jen podle obrázku nebo ceny. Jinou možnost bezpečné opory ověřte s fyzioterapeutem nebo odbornou výdejnou."
        : "Zjistěte, zda člověk bezpečně zvládne stisknout, použít a zajistit ruční brzdy.",
      missing: handBrakes === "unknown" ? ["handBrakes"] : [],
      recommendations: [],
      acquisition: []
    };
  }

  if (environment === "indoor" && !seatNeeded && canLiftWalker === "unknown") {
    return {
      status: "needs_more_info",
      headline: "Pro výběr chodítka domů potřebujeme ještě jednu praktickou informaci.",
      nextStep: "Zjistěte, zda člověk při každém kroku zvládne lehce nadzvednout a posunout celé chodítko. Čtyřbodové chodítko s pevnými nohami tento pohyb vyžaduje.",
      missing: ["canLiftWalker"],
      recommendations: [],
      acquisition: []
    };
  }

  const parameters = [
    "správná výška a možnost nastavení",
    "celková šířka a průchodnost v místě použití",
    "nosnost výrobku",
    "hmotnost a manipulace"
  ];

  if (needsBrakedRollator) {
    parameters.push("stabilita a způsob bezpečného používání i zajištění brzd");
  } else {
    parameters.push("stabilita a způsob posouvání chodítka při chůzi");
  }

  if (seatNeeded) parameters.push("sedátko a bezpečné použití při odpočinku");
  if (transportNeed) parameters.push("skládání a rozměry pro převoz");
  if (homeSpace === "tight") parameters.push("šířka v nejužším místě domácnosti");

  let id;
  let label;
  let reason;
  let productCandidateIds;

  if (seatNeeded) {
    id = "rollator_candidate";
    label = "Rollátor se sedátkem jako kandidátní typ řešení";
    reason = environment === "indoor"
      ? "Je požadovaná stabilní opora doma i možnost bezpečně si během chůze sednout; ovládání a zajištění ručních brzd je potvrzené."
      : "Je požadovaná stabilní opora se sedátkem a bezpečné používání ručních brzd je potvrzené.";
    productCandidateIds = ["meyra-ideal-3061982"];
  } else if (environment === "indoor" && canLiftWalker === "no") {
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
    productCandidateIds = ["meyra-ideal-3061982"];
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
