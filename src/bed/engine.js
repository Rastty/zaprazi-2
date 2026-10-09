const PRIMARY_NEEDS = new Set([
  "home_positioning",
  "caregiver_access",
  "robust_high_load",
  "advanced_in_bed_care",
  "unknown"
]);

const TRANSFER = new Set([
  "independent",
  "steadying",
  "person_assist",
  "mostly_in_bed",
  "unknown"
]);

const FIT = new Set(["yes", "no", "unknown"]);
const DURATION = new Set(["short_term", "long_term", "unknown"]);

function invalid(field) {
  return {
    status: "invalid_input",
    headline: "Zkontrolujte odpovědi.",
    nextStep: `Neplatná hodnota pole: ${field}`,
    missing: [field],
    recommendations: [],
    acquisition: []
  };
}

function needsMoreInfo(field, headline, nextStep) {
  return {
    status: "needs_more_info",
    headline,
    nextStep,
    missing: [field],
    recommendations: [],
    acquisition: []
  };
}

function acquisitionFor(duration) {
  const reimbursement = {
    id: "check_reimbursement_or_circulation",
    label: "Prověřit úhradu nebo zapůjčení přes pojišťovnu",
    reason: "Polohovací lůžka mohou být při splnění podmínek předepsána a schválena pojišťovnou; ZaPrazi ale neurčuje individuální nárok. U některých lůžek se používá režim cirkulace."
  };

  if (duration === "short_term") {
    return [
      {
        id: "rent_first",
        label: "Nejdřív porovnat půjčení",
        reason: "U dočasné potřeby může být místní půjčovna rychlejší a výrazně levnější než nákup celé elektrické postele."
      },
      reimbursement
    ];
  }

  if (duration === "long_term") {
    return [
      reimbursement,
      {
        id: "compare_purchase",
        label: "Porovnat dlouhodobý nákup",
        reason: "U dlouhodobé potřeby má smysl porovnat vlastnictví, servis, matraci, dopravu a montáž s úhradovou nebo půjčovní cestou."
      }
    ];
  }

  return [
    {
      id: "compare_acquisition",
      label: "Porovnat půjčení, úhradu a nákup",
      reason: "Bez odhadu délky používání zatím neupřednostňujeme jeden způsob pořízení."
    },
    reimbursement
  ];
}

function candidate({ headline, nextStep, id, label, reason, parameters, productId, duration, disclaimer }) {
  return {
    status: "candidate",
    headline,
    nextStep,
    missing: [],
    recommendations: [{
      id,
      label,
      reason,
      parameters,
      productCandidateIds: [productId]
    }],
    acquisition: acquisitionFor(duration),
    disclaimer
  };
}

export function recommendAdjustableBed(input = {}) {
  const {
    primaryNeed = "unknown",
    transferAbility = "unknown",
    loadFit = "unknown",
    spaceFit = "unknown",
    userCapacityVerified = "unknown",
    duration = "unknown"
  } = input;

  if (!PRIMARY_NEEDS.has(primaryNeed)) return invalid("primaryNeed");
  if (!TRANSFER.has(transferAbility)) return invalid("transferAbility");
  if (!FIT.has(loadFit)) return invalid("loadFit");
  if (!FIT.has(spaceFit)) return invalid("spaceFit");
  if (!FIT.has(userCapacityVerified)) return invalid("userCapacityVerified");
  if (!DURATION.has(duration)) return invalid("duration");

  if (primaryNeed === "unknown") {
    return needsMoreInfo(
      "primaryNeed",
      "Nejdřív potřebujeme vědět, co má nová postel prakticky vyřešit.",
      "Rozlište běžné elektrické polohování doma, snazší péči u lůžka, potřebu vyšší nosnosti nebo specializované funkce přímo na lůžku."
    );
  }

  if (loadFit !== "yes") {
    if (loadFit === "no" && ["home_positioning", "caregiver_access"].includes(primaryNeed)) {
      return needsMoreInfo(
        "primaryNeed",
        "Standardní kandidát nemá dostatečnou nosnost.",
        "Přepněte na robustnější větev s vyšší nosností; přesnou hmotnost člověka ZaPrazi ukládat nepotřebuje."
      );
    }

    return needsMoreInfo(
      "loadFit",
      "Před výběrem postele musíme potvrdit dostatečnou nosnost konkrétního kandidáta.",
      loadFit === "no"
        ? "Tento kandidát nepoužívejte; potřebujeme lůžko s vyšší nosností nebo odborně zvolenou variantu."
        : "Ověřte technickou nosnost kandidáta vůči skutečné potřebě. Přesnou hmotnost do poradce nezadávejte."
    );
  }

  if (spaceFit !== "yes") {
    return needsMoreInfo(
      "spaceFit",
      "Polohovací postel potřebuje bezpečný prostor nejen na matraci, ale na celou konstrukci.",
      spaceFit === "no"
        ? "Tento kandidát se do prostoru nevejde. Potřebujeme jiný rozměr nebo jinak upravit místnost."
        : "Změřte prostor včetně průchodu pro instalaci, celkového půdorysu postele a místa pro pečující osobu."
    );
  }

  // P4707/P4044 merchant evidence states only general bed "nosnost" (250/260 kg),
  // NOT an explicit maximum patient weight as it does for the CLASSIC model.
  // A loadFit=yes by itself must never authorize an exact offer for these models.
  if (["robust_high_load", "advanced_in_bed_care"].includes(primaryNeed) && userCapacityVerified !== "yes") {
    return needsMoreInfo(
      "userCapacityVerified",
      "Chybí zvláštní potvrzení povolené hmotnosti uživatele.",
      userCapacityVerified === "no"
        ? "Bez potvrzení od výrobce nebo odborné výdejny tento model nevybírejte ke koupi. Údaj 250/260 kg označený jako nosnost postele nesmí být automaticky považován za limit hmotnosti člověka."
        : "U modelu Hospital nebo Multibed si u výrobce či odborné výdejny ověřte maximální povolenou hmotnost samotného uživatele pro přesnou variantu, matraci a vybavení. Obecná nosnost postele 250/260 kg sama nestačí."
    );
  }

  const transferNote = transferAbility === "person_assist" || transferAbility === "mostly_in_bed"
    ? "Postel může usnadnit péči, ale sama neřeší bezpečný přesun; u fyzického zvedání je potřeba samostatně řešit transfer a případně zvedák."
    : "Výsledek vybírá typ postele podle praktické potřeby, rozměru a nosnosti; neposuzuje diagnózu.";

  if (primaryNeed === "robust_high_load") {
    return candidate({
      headline: "Robustnější elektrická polohovací postel může být vhodný směr.",
      nextStep: "Ověřte půdorys 105 × 214 cm, rozsah výšky 40–70 cm, nosnost 250 kg, matraci a reálnou cestu dopravy do pokoje.",
      id: "robust_adjustable_bed_candidate",
      label: "Robustní elektrická postel s vyšší nosností",
      reason: "Běžná domácí větev nestačí nosností a je potřeba stabilnější konstrukce.",
      parameters: ["půdorys 105 × 214 cm", "ložná plocha 90 × 196 cm", "výška 40–70 cm", "nosnost 250 kg", "boční zábrany", "centrální brzda", "matrace zvlášť"],
      productId: "unizdrav-p4707",
      duration,
      disclaimer: transferNote
    });
  }

  if (primaryNeed === "advanced_in_bed_care") {
    return candidate({
      headline: "Specializovaná postel pro náročnější péči na lůžku může být kandidátní řešení.",
      nextStep: "Ověřte, zda skutečně potřebujete boční otáčení a hygienické/toaletní funkce na lůžku, a zda se konstrukce 96 × 212 cm vejde do pokoje.",
      id: "advanced_care_bed_candidate",
      label: "Elektrická postel s funkcemi pro náročnější péči na lůžku",
      reason: "Požadavek není jen na polohování, ale i na praktické funkce pro každodenní péči přímo na lůžku.",
      parameters: ["půdorys 96 × 212 cm", "ložná plocha 90 × 200 cm", "výška 50–70 cm", "boční otáčení do 45°", "nosnost 260 kg", "matrace v ceně", "toaletní a hygienické příslušenství"],
      productId: "unizdrav-p4044",
      duration,
      disclaimer: `${transferNote} Specializované funkce vyžadují správné použití a zaučení pečující osoby.`
    });
  }

  return candidate({
    headline: primaryNeed === "caregiver_access"
      ? "Výškově nastavitelná elektrická postel může výrazně usnadnit každodenní péči."
      : "Standardní elektrická polohovací postel může být vhodný domácí směr.",
    nextStep: "Ověřte půdorys 102,5 × 212 cm, rozsah výšky 38,6–80,6 cm, nosnost kandidáta, matraci a cestu dopravy do pokoje.",
    id: primaryNeed === "caregiver_access"
      ? "caregiver_access_bed_candidate"
      : "home_adjustable_bed_candidate",
    label: "Elektrická polohovací postel pro domácí péči",
    reason: primaryNeed === "caregiver_access"
      ? "Výškové nastavení umožňuje přizpůsobit lůžko přesunu i práci pečující osoby."
      : "Hlavní potřeba je elektrické nastavení výšky, zad a nohou v domácím prostředí.",
    parameters: ["půdorys 102,5 × 212 cm", "ložná plocha 90 × 200 cm", "výška 38,6–80,6 cm", "max. hmotnost pacienta 178 kg", "boční zábrany", "hrazda", "matrace zvlášť"],
    productId: "unizdrav-p2777",
    duration,
    disclaimer: transferNote
  });
}
