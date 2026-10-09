// ZP_RELEASE_0_8_84
const PROPULSION = new Set([
  "companion",
  "self_manual",
  "mixed_manual",
  "powered",
  "unknown"
]);

const TRANSFER = new Set([
  "independent",
  "steadying",
  "person_assist",
  "unknown"
]);

const FIT = new Set(["yes", "no", "unknown"]);
const WHEEL_TYPES = new Set(["pneumatic", "tubeless", "unknown"]);
const SEAT_WIDTH_VARIANTS = new Set(["48", "51", "unknown"]);
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

function professionalCheck(headline, nextStep) {
  return {
    status: "professional_check",
    headline,
    nextStep,
    missing: [],
    recommendations: [],
    acquisition: [{
      id: "check_insurer_or_specialist",
      label: "Prověřit odborný výběr a pojišťovnu",
      reason: "U složitějšího přesunu nebo neověřeného bezpečného ovládání vozíku je vhodné řešit současně vhodnost, nastavení, případné příslušenství a úhradovou cestu."
    }]
  };
}

function acquisitionFor(duration, powered = false) {
  const insurer = {
    id: "check_insurer",
    label: "Prověřit zdravotní pojišťovnu",
    reason: powered
      ? "Elektrický vozík má přísnější podmínky a žádost vyžaduje další podklady; nezačínejte nákupem."
      : "Mechanické vozíky mohou být při splnění podmínek hrazené. VZP zároveň uvádí, že většina vozíků zůstává majetkem pojišťovny a pacientovi se půjčuje."
  };

  if (duration === "short_term") {
    return [
      {
        id: "rent_first",
        label: "Nejdřív porovnat půjčení",
        reason: "U dočasné potřeby může být místní půjčovna rychlejší než nákup nebo schvalování."
      },
      insurer
    ];
  }

  if (duration === "long_term") {
    return [
      insurer,
      {
        id: "compare_purchase",
        label: "Porovnat přímý nákup",
        reason: "Pokud úhradová nebo půjčovní cesta nevyhovuje, porovnejte přesný rozměr, ovládání, servis a dopravu konkrétního vozíku."
      }
    ];
  }

  return [
    insurer,
    {
      id: "compare_rental_and_purchase",
      label: "Porovnat půjčení a nákup",
      reason: "Bez jisté délky používání zatím neupřednostňujeme jednu komerční cestu."
    }
  ];
}

export function recommendWheelchair(input = {}) {
  const {
    propulsion = "unknown",
    transferAbility = "unknown",
    seatFit = "unknown",
    widthFit = "unknown",
    loadFit = "unknown",
    wheelType = "unknown",
    seatWidthVariant = "unknown",
    manualControlSafe = "unknown",
    joystickSafe = "unknown",
    chargingReady = "unknown",
    duration = "unknown"
  } = input;

  if (!PROPULSION.has(propulsion)) return invalid("propulsion");
  if (!TRANSFER.has(transferAbility)) return invalid("transferAbility");
  for (const [name, value] of Object.entries({ seatFit, widthFit, loadFit, manualControlSafe, joystickSafe, chargingReady })) {
    if (!FIT.has(value)) return invalid(name);
  }
  if (!DURATION.has(duration)) return invalid("duration");
  if (!WHEEL_TYPES.has(wheelType)) return invalid("wheelType");
  if (!SEAT_WIDTH_VARIANTS.has(seatWidthVariant)) return invalid("seatWidthVariant");

  if (propulsion === "unknown") {
    return needsMoreInfo(
      "propulsion",
      "Nejdřív potřebujeme vědět, kdo má vozík běžně pohánět.",
      "Rozlište doprovodnou osobu, samostatný ruční pohon, kombinaci obou nebo elektrický pohon."
    );
  }

  if (transferAbility === "unknown") {
    return needsMoreInfo(
      "transferAbility",
      "Nejdřív musíme vědět, zda člověk zvládne přesun na vozík bez fyzického zvedání.",
      "Ověřte bezpečné přesednutí na vozík. Při nejistotě zatím konkrétní vozík nedoporučujeme."
    );
  }

  if (transferAbility === "person_assist") {
    return professionalCheck(
      "Při fyzicky asistovaném přesunu nevybíráme vozík jen podle šířky a ceny.",
      "Nejdřív je potřeba ověřit způsob přesunu na vozík, bočnice, stupačky, případný přesunový/zvedací prostředek a práci pečující osoby."
    );
  }

  if (["self_manual", "mixed_manual"].includes(propulsion) && manualControlSafe !== "yes") {
    if (manualControlSafe === "no") {
      return professionalCheck(
        "Samostatný ruční pohon není bezpečný automatický kandidát, pokud člověk nedokáže vozík spolehlivě řídit a zastavit.",
        "Zvažte režim s doprovodem nebo odborně ověřte jiný způsob mobility a nastavení vozíku."
      );
    }
    return needsMoreInfo(
      "manualControlSafe",
      "Před ručním pohonem potřebujeme ověřit praktické ovládání vozíku.",
      "Ověřte, zda člověk na běžné trase zvládne vozík rukama rozjet, řídit, zpomalit a zastavit a bezpečně použít parkovací brzdu."
    );
  }

  // P3641 capacity is wheel-variant dependent: 125kg pneumatic, 136kg tubeless.
  // Generic loadFit=yes cannot unlock a P3641 offer without variant identity.
  if (["self_manual", "mixed_manual"].includes(propulsion) && wheelType === "unknown") {
    return needsMoreInfo(
      "wheelType",
      "U odlehčeného vozíku musíme nejdřív určit provedení zadních kol.",
      "UNIZDRAV P3641 má podle výrobce limit 125 kg s pneumatickými koly nebo 136 kg s bezdušovými. Ověřte konkrétní nabízené provedení a potom potvrďte jeho nosnost."
    );
  }

  // The 48cm seat has a 68cm outer width; the 51cm seat has a 70cm width.
  // A generic seatFit/widthFit=yes cannot approve an unspecified P3641 size.
  if (["self_manual", "mixed_manual"].includes(propulsion) && seatWidthVariant === "unknown") {
    return needsMoreInfo(
      "seatWidthVariant",
      "Vyberte přesnou šířku sedu odlehčeného vozíku.",
      "Pro UNIZDRAV P3641 odpovídá sedu 48 cm celková šířka 68 cm a sedu 51 cm celková šířka 70 cm. Nejdřív určete skutečně nabízené provedení, potom ověřte sed i průchody."
    );
  }

  if (loadFit !== "yes") {
    return needsMoreInfo(
      "loadFit",
      "Nosnost konkrétního kandidáta musí být potvrzená před doporučením.",
      loadFit === "no"
        ? "Tento kandidát nepoužívejte; potřebujeme vozík s vyšší nosností."
        : "Ověřte technický limit kandidáta. Přesnou hmotnost člověka do poradce zadávat nemusíte."
    );
  }

  if (seatFit !== "yes") {
    return needsMoreInfo(
      "seatFit",
      "Šířka sedu je zásadní pro bezpečné a dlouhodobě použitelné sezení.",
      seatFit === "no"
        ? "Tento kandidát nemá vhodnou šířku sedu; zvolte jinou velikost nebo model."
        : "Ověřte potřebnou šířku sedu a porovnejte ji s konkrétním kandidátem."
    );
  }

  if (widthFit !== "yes") {
    return needsMoreInfo(
      "widthFit",
      "Celková šířka vozíku musí projít dveřmi a zvládnout domácí prostor.",
      widthFit === "no"
        ? "Tento kandidát se do potřebných průchodů nevejde; potřebujeme užší model nebo upravit trasu."
        : "Změřte nejužší dveře, chodbu a místo pro otáčení."
    );
  }

  if (propulsion === "powered") {
    if (joystickSafe !== "yes") {
      if (joystickSafe === "no") {
        return professionalCheck(
          "Elektrický vozík není bezpečný automatický kandidát, pokud člověk nedokáže spolehlivě ovládat joystick a zastavit.",
          "Prověřte jiný způsob mobility nebo odborně nastavené ovládání."
        );
      }
      return needsMoreInfo(
        "joystickSafe",
        "Před elektrickým vozíkem potřebujeme ověřit praktické ovládání.",
        "Ověřte, zda člověk zvládne joystickem spolehlivě rozjet, zatočit, zpomalit a zastavit v běžném prostředí."
      );
    }

    if (chargingReady !== "yes") {
      return needsMoreInfo(
        "chargingReady",
        "Elektrický vozík potřebuje bezpečné místo pro parkování a nabíjení.",
        chargingReady === "no"
          ? "Bez vhodného místa pro pravidelné nabíjení tento kandidát nedoporučujeme."
          : "Ověřte přístup k zásuvce, bezpečné parkování a také způsob převozu 62kg vozíku, pokud ho potřebujete vozit autem."
      );
    }

    return {
      status: "candidate",
      headline: "Elektrický vozík s joystickem může být kandidátní řešení.",
      nextStep: "Ověřte trasu, poloměr otáčení, průchody, sklon, nabíjení a případný převoz vozíku.",
      missing: [],
      recommendations: [{
        id: "powered_wheelchair_candidate",
        label: "Elektrický invalidní vozík s joystickem",
        reason: "Požadovaný je elektrický pohon a základní bezpečnostní, prostorové a ovládací gate jsou potvrzené.",
        parameters: ["sed 46 cm", "celková šířka 63 cm", "nosnost 135 kg", "hmotnost s baterií 62 kg", "rychlost max. 6 km/h", "poloměr otáčení 86,5 cm", "bezpečný sklon 6°", "nabíjení"],
        productCandidateIds: ["unizdrav-p2961"]
      }],
      acquisition: acquisitionFor(duration, true),
      disclaimer: "Elektrický vozík vyžaduje bezpečné ovládání a vhodnou trasu. ZaPrazi nepotvrzuje individuální zdravotní vhodnost ani nárok na úhradu."
    };
  }

  if (propulsion === "companion") {
    return {
      status: "candidate",
      headline: "Základní skládací mechanický vozík pro doprovod může být kandidátní řešení.",
      nextStep: "Ověřte sed 48 cm, celkovou šířku 65 cm, nosnost 100 kg a skutečný způsob nakládání do auta.",
      missing: [],
      recommendations: [{
        id: "companion_manual_candidate",
        label: "Mechanický vozík pro přesuny s doprovodem",
        reason: "Vozík má běžně pohánět doprovodná osoba a není požadován elektrický pohon.",
        parameters: ["sed 48 cm", "celková šířka 65 cm", "nosnost 100 kg", "hmotnost 18,4 kg", "skládací rám"],
        productCandidateIds: ["unizdrav-p4384"]
      }],
      acquisition: acquisitionFor(duration, false),
      disclaimer: "Vozík sám o sobě neřeší bezpečný přesun člověka na sedák a zpět."
    };
  }

  const variantLabel = wheelType === "pneumatic" ? "pneumatická kola – 125 kg" : "bezdušová kola – 136 kg";
  const seatWidthCm = Number(seatWidthVariant);
  const outerWidthCm = seatWidthVariant === "48" ? 68 : 70;
  const chairWeightKg = seatWidthVariant === "48" ? 17 : 17.5;
  return {
    status: "candidate",
    headline: "Odlehčený mechanický vozík pro samostatný pohon i doprovod může být kandidátní řešení.",
    nextStep: `Při nákupu požadujte sed ${seatWidthCm} cm (celková šířka ${outerWidthCm} cm) a potvrzené provedení kol. Nosnost a rozměry platí jen pro tuto variantu.`,
    missing: [],
    recommendations: [{
      id: "manual_self_or_companion_candidate",
      label: "Odlehčený mechanický vozík s hnacími obručemi a brzdami pro doprovod",
      reason: propulsion === "self_manual"
        ? "Uživatel má vozík pohánět rukama a zadní kola mají hnací obruče pro samostatný pohyb."
        : "Využití se má střídat mezi samostatným pohonem a doprovodem.",
      parameters: [`sed ${seatWidthCm} cm`, `celková šířka ${outerWidthCm} cm`, `ověřená varianta: ${variantLabel}`, `hmotnost ${chairWeightKg} kg`, "hnací obruče", "bezpečné řízení a zastavení", "parkovací brzda", "brzdy pro doprovod"],
      productCandidateIds: ["unizdrav-p3641"]
    }],
    acquisition: acquisitionFor(duration, false),
    disclaimer: "Potvrzení platí pouze pro zvolenou šířku sedu a provedení kol; nepřenášejte jej na jiné provedení. Před dlouhodobým používáním správně nastavte šířku sedu, stupačky a posed."
  };
}
