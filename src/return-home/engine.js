// ZP_RELEASE_0_8_146
const READINESS = new Set(["yes", "no", "unknown"]);
const TRANSFER = new Set(["independent", "steadying", "person_assist", "unknown"]);
const WALKING = new Set(["independent", "needs_support", "wheelchair_or_no_walk", "unknown"]);
const HOME_CARE = new Set(["arranged", "not_needed", "needed_not_arranged", "unknown"]);
const TIMING = new Set(["today_or_tomorrow", "within_week", "later", "unknown"]);

function invalid(field) {
  return {
    status: "invalid_input",
    headline: "Zkontrolujte odpovědi.",
    nextStep: `Neplatná hodnota pole: ${field}`,
    blockers: [],
    priorities: [],
    routes: [],
    dischargeActions: []
  };
}

function route(id, label, reason, href, priority = 2) {
  return { id, label, reason, href, priority };
}

function action(id, label, reason, priority = 2) {
  return { id, label, reason, priority };
}

function sortByPriority(items) {
  return [...items].sort((a, b) => a.priority - b.priority);
}

export function buildReturnHomePlan(input = {}) {
  const {
    timing = "unknown",
    entranceReady = "unknown",
    transferAbility = "unknown",
    walking = "unknown",
    toiletReady = "unknown",
    bathroomReady = "unknown",
    bedReady = "unknown",
    wheelchairReady = "unknown",
    homeCare = "unknown"
  } = input;

  if (!TIMING.has(timing)) return invalid("timing");
  for (const [name, value] of Object.entries({
    entranceReady,
    toiletReady,
    bathroomReady,
    bedReady,
    wheelchairReady
  })) {
    if (!READINESS.has(value)) return invalid(name);
  }
  if (!TRANSFER.has(transferAbility)) return invalid("transferAbility");
  if (!WALKING.has(walking)) return invalid("walking");
  if (!HOME_CARE.has(homeCare)) return invalid("homeCare");

  const blockers = [];
  const priorities = [];
  const routes = [];
  const dischargeActions = [];

  if (entranceReady === "no") {
    blockers.push({
      id: "entrance_not_ready",
      label: "Vstup do domu/bytu není bezpečně vyřešený.",
      reason: "Než člověk odjede z nemocnice, musí být prakticky vyřešené schody, dveře, prahy nebo jiná bariéra při samotném vstupu.",
      priority: 1
    });
    dischargeActions.push(action(
      "resolve_entrance_before_discharge",
      "Vyřešit vstup domů ještě před propuštěním",
      "Pokud člověk nedokáže bezpečně projít vstupní trasu, další pomůcky uvnitř domu tento problém neřeší.",
      1
    ));
  } else if (entranceReady === "unknown") {
    priorities.push({
      id: "measure_entrance",
      label: "Ověřit vstupní trasu domů",
      reason: "Zkontrolujte schody, nejužší dveře, prahy a prostor pro doprovod nebo vozík.",
      priority: 1
    });
  }

  if (transferAbility === "person_assist") {
    blockers.push({
      id: "assisted_transfer",
      label: "Přesun běžně vyžaduje fyzickou pomoc druhé osoby.",
      reason: "Samotné zakoupení postele, vozíku nebo WC pomůcky neřeší bezpečný transfer. Je potřeba konkrétně vyřešit způsob přesunu a roli pečující osoby.",
      priority: 1
    });
    dischargeActions.push(action(
      "transfer_plan",
      "Před propuštěním si nechat vysvětlit bezpečný způsob přesunu",
      "Ověřte přesun postel–židle–WC, potřebnou pomoc druhé osoby a případnou potřebu další pomůcky nebo zaučení.",
      1
    ));
  } else if (transferAbility === "unknown") {
    priorities.push({
      id: "verify_transfer",
      label: "Prakticky ověřit přesun postel–židle–WC",
      reason: "Pokud si rodina není jistá, jak bude přesun doma fungovat, je lepší to vyjasnit před odjezdem z nemocnice.",
      priority: 1
    });
  } else if (transferAbility === "steadying") {
    dischargeActions.push(action(
      "confirm_transfer_support",
      "Ověřit dostupnou oporu nebo dohled při přesunech",
      "Projděte s nemocničním týmem, jak bude doma bezpečně probíhat přesun mezi postelí, židlí a WC. Ověřte, že potřebná stabilní opora nebo osoba pro dohled bude skutečně dostupná. Samotný nákup pomůcky bezpečný přesun nepotvrzuje.",
      1
    ));
  }

  if (walking === "needs_support") {
    dischargeActions.push(action(
      "confirm_walking_support",
      "Ověřit oporu pro krátké domácí přesuny",
      "Před odjezdem ověřte s nemocničním týmem, jak se člověk bezpečně dostane mezi postelí, židlí a WC a zda potřebná opora nebo pomoc bude doma k dispozici. Konkrétní pomůcka vyžaduje vlastní kontrolu vhodnosti.",
      1
    ));
    routes.push(route(
      "mobility",
      "Vyřešit chůzi a oporu",
      "Člověk chodí, ale potřebuje oporu nebo větší jistotu.",
      "/#poradce",
      2
    ));
  } else if (walking === "wheelchair_or_no_walk") {
    if (wheelchairReady === "yes") {
      priorities.push({
        id: "wheelchair_verify",
        label: "Ověřit, že dostupný vozík skutečně sedí",
        reason: "Zkontrolujte šířku sedu, průchody, brzdy, stupačky a způsob přesunu na vozík.",
        priority: 2
      });
    } else {
      // A person who cannot cover necessary home distances on foot and
      // explicitly has no usable wheelchair has an unresolved first-night
      // mobility dependency. An unanswered readiness check remains a task
      // to verify, never an individual medical verdict or forced product purchase.
      if (wheelchairReady === "no") {
        blockers.push({
          id: "required_wheelchair_not_ready",
          label: "Pro potřebné přesuny doma zatím není zajištěný bezpečný způsob pohybu.",
          reason: "Člověk nezvládne potřebné přesuny chůzí a připravený vozík chybí. Před odjezdem s nemocničním týmem ověřte bezpečný způsob přesunů, pomoc druhé osoby a skutečně dostupné řešení pro první noc.",
          priority: 1
        });
        dischargeActions.push(action(
          "resolve_wheelchair_mobility_before_discharge",
          "Ještě před odjezdem vyřešit bezpečné domácí přesuny",
          "Spolu s nemocničním týmem ověřte cestu od vstupu domů k posteli a WC, vhodnou pomoc a potřebné pomůcky. Samotný výběr vozíku na webu bezpečné používání nepotvrzuje.",
          1
        ));
      } else {
        priorities.push({
          id: "verify_wheelchair_availability",
          label: "Ověřit dostupnost a použití vozíku pro první noc",
          reason: "Není potvrzené, že existuje bezpečný způsob přesunů doma. Před návratem zkontrolujte s nemocničním týmem skutečnou dostupnost vozíku a případné pomoci.",
          priority: 1
        });
      }
      routes.push(route(
        "wheelchair",
        "Vyřešit invalidní vozík",
        "Chůze nestačí pro potřebné domácí přesuny a vozík není potvrzený jako připravený.",
        "/invalidni-vozik/#poradce-vozik",
        1
      ));
    }
  } else if (walking === "unknown") {
    priorities.push({
      id: "walking_trial",
      label: "Ověřit, jak bude člověk doma zvládat krátké přesuny",
      reason: "Neřešte jen cestu z auta. Ověřte typický přesun postel–WC–židle.",
      priority: 2
    });
  }

  // Explicitly unusable WC is a first-night readiness blocker, not just
  // another advisor link. Unknown availability still requires verification.
  if (toiletReady === "no") {
    blockers.push({
      id: "toilet_not_ready",
      label: "WC zatím není bezpečně použitelné pro první dny doma.",
      reason: "Než člověk odjede z nemocnice, ověřte s nemocničním týmem bezpečný způsob použití WC, přesun, dostupnou pomoc nebo vhodnou alternativu. Samotný nákup pomůcky bezpečné použití nepotvrzuje.",
      priority: 1
    });
    dischargeActions.push(action(
      "resolve_toilet_before_discharge",
      "Před odjezdem vyřešit bezpečný přístup a použití WC",
      "Projděte s nemocničním týmem reálnou cestu na WC, vstávání, potřebnou oporu a dostupnou pomoc pro první noc doma.",
      1
    ));
  }

  if (toiletReady !== "yes") {
    routes.push(route(
      "toilet",
      "Vyřešit WC",
      toiletReady === "no"
        ? "WC není pro první dny doma bezpečně použitelné."
        : "Není potvrzené, že člověk zvládne WC doma bezpečně.",
      "/koupelna-a-wc/#poradce-koupelna",
      1
    ));
  }

  if (bathroomReady === "no") {
    routes.push(route(
      "bathroom",
      "Vyřešit sprchu nebo vanu",
      "Koupelna není bezpečně připravená.",
      "/koupelna-a-wc/#poradce-koupelna",
      3
    ));
  } else if (bathroomReady === "unknown") {
    priorities.push({
      id: "bathroom_check",
      label: "Zkontrolovat koupelnu",
      reason: "Ověřte vstup do sprchy/vany, možnost sedu, opory a prostor pro případný doprovod.",
      priority: 3
    });
  }

  // A bed confirmed unsafe for lying down, getting up or necessary care
  // cannot be deferred to a generic equipment-shopping follow-up.
  if (bedReady === "no") {
    blockers.push({
      id: "bed_not_ready",
      label: "Postel není připravená pro bezpečné uléhání nebo vstávání.",
      reason: "Před návratem domů je potřeba vyřešit bezpečné místo pro spaní, přesun z postele a případnou potřebnou pomoc s nemocničním týmem. Výběr elektrické postele sám o sobě tuto kontrolu nenahrazuje.",
      priority: 1
    });
    dischargeActions.push(action(
      "resolve_bed_before_discharge",
      "Před odjezdem ověřit bezpečné uléhání, vstávání a pomoc u postele",
      "S nemocničním týmem ověřte způsob přesunu u lůžka, dostupnou pomoc a praktické řešení první noci. Samotný odkaz na poradce není potvrzení bezpečného zajištění.",
      1
    ));
  }

  if (bedReady !== "yes") {
    routes.push(route(
      "bed",
      "Vyřešit postel",
      bedReady === "no"
        ? "Současná postel nevyhovuje pro bezpečný přesun nebo každodenní péči."
        : "Není potvrzené, že současná postel bude prakticky použitelná.",
      "/polohovaci-postel/#poradce-postel",
      1
    ));
  }

  if (homeCare === "needed_not_arranged") {
    // A family reporting necessary but unarranged home health care has a
    // real first-night dependency. A checklist task alone must not imply the
    // discharge plan is ready. Clinical discharge decisions stay with staff.
    blockers.push({
      id: "required_home_care_not_arranged",
      label: "Potřebná domácí zdravotní péče zatím není zajištěná.",
      reason: "Před odjezdem z nemocnice sdělte týmu, že domluvená péče chybí. Požádejte o konkrétní plán návaznosti, odpovědnost a kontakt pro první dny. Samotný seznam pomůcek tuto mezeru nevyřeší.",
      priority: 1
    });
    dischargeActions.push(action(
      "arrange_home_health",
      "Ještě před propuštěním řešit domácí zdravotní péči",
      "NZIP uvádí, že nemocniční lékař může po hospitalizaci indikovat domácí zdravotní péči na 14 dní. Pokud je péče potřeba a není domluvená, řešte ji před odjezdem.",
      1
    ));
  } else if (homeCare === "unknown") {
    dischargeActions.push(action(
      "ask_home_health",
      "Zeptat se nemocničního týmu, zda je potřeba domácí zdravotní péče",
      "NZIP doporučuje plánovat návaznou domácí zdravotní péči při propuštění. Nemocniční lékař ji může po hospitalizaci indikovat na 14 dní.",
      2
    ));
  }

  if (timing === "today_or_tomorrow") {
    priorities.push({
      id: "first_night_only",
      label: "Prioritizovat první noc, ne dokonalé vybavení celého domu",
      reason: "Nejdřív musí fungovat vstup, bezpečný přesun, WC, spaní a nezbytná domácí péče. Ostatní lze řešit následně.",
      priority: 1
    });
  }

  if (timing === "within_week") {
    priorities.push({
      id: "one_week_plan",
      label: "Rozdělit přípravu na kritické a následné kroky",
      reason: "Kritické jsou vstup, přesun, WC, postel a potřebná návazná péče; koupelna a komfortní úpravy mohou následovat podle situace.",
      priority: 2
    });
  }

  const hasBlocker = blockers.length > 0;
  const hasAnyWork = priorities.length > 0 || routes.length > 0 || dischargeActions.length > 0;
  // Having a plan is not proof that the home is ready for a safe first night.
  // Preserve the existing status contract and Advisor routes, but explicitly
  // distinguish unresolved essential arrangements from ordinary follow-ups.
  const hasUnresolvedEssentials =
    entranceReady !== "yes" ||
    transferAbility !== "independent" ||
    walking === "unknown" ||
    walking === "needs_support" ||
    (walking === "wheelchair_or_no_walk" && wheelchairReady !== "yes") ||
    toiletReady !== "yes" ||
    bedReady !== "yes" ||
    homeCare === "unknown" ||
    homeCare === "needed_not_arranged";

  return {
    status: hasBlocker ? "blocked_before_discharge" : hasAnyWork ? "action_plan" : "ready_basic",
    headline: hasBlocker
      ? "Před návratem domů je potřeba vyřešit několik kritických bodů."
      : hasUnresolvedEssentials
        ? "Před návratem domů zbývá ověřit nebo zajistit důležité věci."
        : hasAnyWork
          ? "Máte plán dalších kroků pro návrat domů."
          : "Podle zadaných praktických bodů je základní domácí připravenost potvrzená.",
    nextStep: hasBlocker
      ? "Nezačínejte nákupem dalších produktů. Nejdřív s nemocničním týmem vyřešte uvedené kritické překážky pro první noc doma. Samotná nabídka pomůcky nepotvrzuje bezpečný návrat."
      : hasUnresolvedEssentials
        ? "Tento plán není potvrzení bezpečného návratu. Nejasné nebo nezajištěné důležité body projděte s nemocničním týmem ještě před odjezdem. Odkazy níže slouží k orientaci, ne k posouzení vhodnosti propuštění."
        : hasAnyWork
          ? "Postupujte od nejvyšší priority. Odkazy vedou do samostatných poradců s vlastními bezpečnostními kontrolami."
          : "Toto je orientační kontrola praktické připravenosti domácnosti podle zadaných bodů, nikoli posouzení zdravotní způsobilosti k propuštění.",
    blockers: sortByPriority(blockers),
    priorities: sortByPriority(priorities),
    routes: sortByPriority(routes),
    dischargeActions: sortByPriority(dischargeActions),
    acquisitionNote: "Od 1. 1. 2026 se zdravotnické prostředky standardně předepisují elektronickým ePoukazem. Retail nákup, půjčovna a hrazený výdej jsou oddělené cesty."
  };
}
