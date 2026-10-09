const PRIMARY_NEEDS = new Set([
  "raise_toilet",
  "toilet_support",
  "toilet_nearby",
  "shower_seated",
  "bath_transfer",
  "multifunction_toilet_shower",
  "combined_shower_toilet",
  "unknown"
]);
const TRANSFER = new Set(["independent", "steadying", "person_assist", "unknown"]);
const FIT = new Set(["yes", "no", "unknown"]);
const WALL_FIXING = new Set(["verified", "unverified", "not_possible", "unknown"]);
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
    acquisition: []
  };
}

function reimbursementAlternative() {
  return {
    id: "check_reimbursement_alternative",
    label: "Prověřit hrazenou alternativu",
    reason: "V aktuálním Seznamu SÚKL mohou být hrazené některé nástavce na WC a prostředky s kompenzační funkcí pro koupelnu/WC. Úhrada závisí na konkrétním prostředku, podmínkách a případném schválení; aktuální maloobchodní kandidát není automaticky hrazený."
  };
}

function acquisitionFor(duration) {
  if (duration === "short_term") {
    return [
      {
        id: "compare_rent_buy",
        label: "Porovnat půjčení a koupi",
        reason: "U krátkodobé potřeby má smysl před nákupem ověřit, zda není dostupné vhodné půjčení."
      },
      reimbursementAlternative()
    ];
  }

  if (duration === "long_term") {
    return [
      {
        id: "compare_buy_rent",
        label: "Porovnat koupi a případné půjčení",
        reason: "U dlouhodobé potřeby může dávat smysl nákup, ale dostupnost půjčení se ověřuje zvlášť."
      },
      reimbursementAlternative()
    ];
  }

  return [
    {
      id: "compare_acquisition",
      label: "Ověřit způsob pořízení",
      reason: "Bez znalosti délky používání zatím neupřednostňujeme koupi ani půjčení."
    },
    reimbursementAlternative()
  ];
}

/**
 * Practical, non-diagnostic Bathroom + WC Slice v1 rules.
 * Critical fit/transfer questions fail closed before exact products are returned.
 */
export function recommendBathroom(input = {}) {
  const {
    primaryNeed,
    transferAbility = "unknown",
    loadFit = "unknown",
    toiletFit = "unknown",
    feetFlatAtRaisedHeight = "unknown",
    floorStable = "unknown",
    spaceFit = "unknown",
    wallFixing = "unknown",
    supportFrameFit = "unknown",
    bathTransferIndependent = "unknown",
    bathFit = "unknown",
    bathBenchFit = "unknown",
    duration = "unknown"
  } = input;

  if (!PRIMARY_NEEDS.has(primaryNeed)) return invalid("primaryNeed");
  if (!TRANSFER.has(transferAbility)) return invalid("transferAbility");
  if (!FIT.has(loadFit)) return invalid("loadFit");
  if (!FIT.has(toiletFit)) return invalid("toiletFit");
  if (!FIT.has(feetFlatAtRaisedHeight)) return invalid("feetFlatAtRaisedHeight");
  if (!FIT.has(floorStable)) return invalid("floorStable");
  if (!FIT.has(spaceFit)) return invalid("spaceFit");
  if (!WALL_FIXING.has(wallFixing)) return invalid("wallFixing");
  if (!FIT.has(supportFrameFit)) return invalid("supportFrameFit");
  if (!FIT.has(bathTransferIndependent)) return invalid("bathTransferIndependent");
  if (!FIT.has(bathFit)) return invalid("bathFit");
  if (!FIT.has(bathBenchFit)) return invalid("bathBenchFit");
  if (!DURATION.has(duration)) return invalid("duration");

  if (primaryNeed === "unknown") {
    return needsMoreInfo(
      "primaryNeed",
      "Potřebujeme upřesnit, co je v koupelně nebo na WC hlavní problém.",
      "Vyberte, zda jde hlavně o nízké WC, potřebu opory, obtížnou cestu na WC, sprchování vsedě nebo složitější přesun."
    );
  }

  if (transferAbility === "unknown") {
    return needsMoreInfo(
      "transferAbility",
      "Před výběrem pomůcky potřebujeme vědět, jak probíhá přesun na sedadlo nebo toaletu.",
      "Upřesněte, zda člověk přesedá samostatně, potřebuje jen stabilní oporu, nebo běžně fyzickou pomoc druhé osoby."
    );
  }

  if (transferAbility === "person_assist") {
    return professionalCheck(
      "Při pravidelné fyzické pomoci druhé osoby nechceme vybírat konkrétní koupelnovou pomůcku jen online.",
      "Nejdřív ověřte bezpečný způsob přesunu a potřebný typ pomůcky s odborníkem nebo odbornou výdejnou. ZaPrazi pak může pomoci porovnat konkrétní parametry."
    );
  }

  if (primaryNeed === "combined_shower_toilet") {
    return professionalCheck(
      "Kombinovaný sprchovací/toaletní vozík je vyšší-support řešení.",
      "Před konkrétním výrobkem je potřeba ověřit způsob přesunu, šířky průchodů, brzdy, práci pečující osoby a kompatibilitu s koupelnou/WC."
    );
  }

  if (loadFit === "unknown") {
    return needsMoreInfo(
      "loadFit",
      "Ještě potřebujeme ověřit nosnost konkrétního řešení.",
      "U vybraného typu zkontrolujte, že jeho uvedená maximální nosnost bezpečně pokrývá uživatele. ZaPrazi nepotřebuje ukládat jeho hmotnost."
    );
  }

  if (loadFit === "no") {
    return professionalCheck(
      "Současný shortlist nemá potvrzenou dostatečnou nosnost.",
      "Nevybírejte slabší výrobek jen podle ceny. Potřebujeme najít variantu s odpovídající nosností a rozměry."
    );
  }

  if (primaryNeed === "multifunction_toilet_shower") {
    if (floorStable !== "yes") {
      return needsMoreInfo(
        "floorStable",
        "Multifunkční židle potřebuje rovný a stabilní podklad.",
        floorStable === "no"
          ? "Na nestabilním nebo nerovném podkladu tento kandidát nepoužívejte."
          : "Ověřte rovný a stabilní podklad v místě použití u WC i ve sprše."
      );
    }

    if (spaceFit !== "yes") {
      return needsMoreInfo(
        "spaceFit",
        "Jedna pomůcka pro WC i sprchu musí bezpečně projít a vejít se do obou míst.",
        spaceFit === "no"
          ? "Tento kandidát se do prostoru nevejde; potřebujeme menší nebo oddělené řešení."
          : "Ověřte alespoň celkovou šířku 51 cm, hloubku 40 cm a prostor pro bezpečné přesednutí."
      );
    }

    return {
      status: "candidate",
      headline: "Jedna stabilní židle pro WC i sprchu může být kandidátní řešení.",
      nextStep: "Ověřte rozměry obou míst, výšku sedu, stabilní podklad, způsob použití nad WC a bezpečný přesun bez fyzického zvedání druhou osobou.",
      missing: [],
      recommendations: [{
        id: "multifunction_toilet_shower_candidate",
        label: "Multifunkční toaletní/sprchovací židle 4v1 jako kandidátní řešení",
        reason: "Jedna pomůcka má řešit toaletu i sprchování a přesun nevyžaduje fyzické zvedání druhou osobou.",
        parameters: ["celková šířka 51 cm", "hloubka 40 cm", "výška sedu 39–54 cm", "nosnost 150 kg", "stabilní podklad", "prostor pro přesednutí", "správné použití podle návodu"],
        productCandidateIds: ["dma-eh-cmda"]
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: "Výrobce DMA u tohoto modelu uvádí kód pojišťovny 5019427, ale ZaPrazi před konkrétním tvrzením o aktuální úhradě vyžaduje kontrolu účinného měsíčního seznamu SÚKL."
    };
  }

  if (primaryNeed === "bath_transfer") {
    if (transferAbility !== "independent") {
      return professionalCheck(
        "Přesun přes okraj vany má smysl řešit automaticky jen tehdy, když člověk nepotřebuje fyzické zvedání nebo jištění druhou osobou.",
        "Pokud je při přesunu potřeba opora člověka, zvedání nebo nejisté balancování, nejdřív ověřte postup s ergoterapeutem, fyzioterapeutem nebo odbornou výdejnou."
      );
    }

    if (bathTransferIndependent !== "yes") {
      if (bathTransferIndependent === "no") {
        return professionalCheck(
          "Sedačka přes okraj vany není bezpečný automatický kandidát, pokud člověk nezvládne samostatně usednout a přenést nohy přes okraj.",
          "Nevybírejte výrobek jen podle rozměru. Potřebujeme jiný typ řešení nebo odborné posouzení přesunu."
        );
      }

      return needsMoreInfo(
        "bathTransferIndependent",
        "Potřebujeme ještě ověřit samotný pohyb přes okraj vany.",
        "Zjistěte, zda člověk dokáže bezpečně usednout na stabilní sedačku přes vanu a přenést obě nohy přes okraj bez fyzické pomoci druhé osoby."
      );
    }

    if (bathFit === "unknown") {
      return needsMoreInfo(
        "bathFit",
        "Sedačka přes vanu musí přesně pasovat a jít pevně zajistit.",
        "Změřte vnitřní šířku okrajů vany a ověřte, zda je v rozsahu 41–65 cm a zda lze sedačku podle návodu bezpečně upevnit bez posunu."
      );
    }

    if (bathFit === "no") {
      if (bathBenchFit !== "yes") {
        return needsMoreInfo(
          "bathBenchFit",
          "Klasická sedačka na okraj vany nepasuje. Můžeme ještě prověřit transferovou židli přes vanu.",
          bathBenchFit === "no"
            ? "Současný shortlist nemá bezpečně ověřený kandidát pro tuto vanu a prostor. Potřebujeme jiný typ řešení nebo odborné posouzení."
            : "Ověřte, zda je možné bezpečně umístit konstrukci 81 × 61 cm tak, aby jedna část stála ve vaně a druhá na rovné stabilní podlaze mimo vanu."
        );
      }

      return {
        status: "candidate",
        headline: "Transferová židle přes vanu může být kandidátní řešení, když sedačka na okraj vany nepasuje.",
        nextStep: "Před nákupem ověřte půdorys 81 × 61 cm, stabilní opření konstrukce ve vaně i na podlaze, nosnost 110 kg a bezpečný samostatný přesun.",
        missing: [],
        recommendations: [{
          id: "bath_transfer_bench_candidate",
          label: "Transferová židle přes vanu jako kandidátní řešení",
          reason: "Klasická sedačka na okraj vany nepasuje, ale je potvrzený prostor a stabilní umístění transferové konstrukce přes vanu.",
          parameters: ["půdorys 81 × 61 cm", "sedák 68 × 41 cm", "výška sedu 45,5–56 cm", "nosnost 110 kg", "stabilní opření ve vaně i na podlaze", "samostatný přesun"],
          productCandidateIds: ["unizdrav-p2203"]
        }],
        acquisition: acquisitionFor(duration),
        disclaimer: "Tato větev platí jen pro jednoduchý samostatný přesun. Pokud je potřeba fyzická pomoc, zvedání nebo je stabilita konstrukce nejistá, konkrétní výrobek online nevybíráme."
      };
    }

    return {
      status: "candidate",
      headline: "Sedačka přes okraj vany může být kandidátní řešení pro samostatný přesun.",
      nextStep: "Před nákupem znovu ověřte šířku vany, pevnost uchycení, nosnost a to, že člověk zvládne přesun nohou přes okraj bez fyzické pomoci.",
      missing: [],
      recommendations: [{
        id: "bath_transfer_seat_candidate",
        label: "Sedačka na vanu s madlem jako kandidátní řešení",
        reason: "Samostatný přesun je potvrzený a vana odpovídá rozměrovému a montážnímu rozsahu ověřeného výrobku.",
        parameters: ["vnitřní šířka vany 41–65 cm", "pevné uchycení bez posunu", "nosnost 100 kg", "samostatný přesun nohou přes okraj", "neklouzavé a bezpečné okolí vany"],
        productCandidateIds: ["besco-bs008"]
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: "Tato větev platí jen pro jednoduchý samostatný přesun. Pokud je potřeba fyzická pomoc, zvedání nebo je přesun nejistý, konkrétní výrobek online nevybíráme."
    };
  }

  if (primaryNeed === "raise_toilet") {
    if (toiletFit !== "yes") {
      return needsMoreInfo(
        "toiletFit",
        "Nástavec musí bezpečně pasovat na konkrétní WC.",
        toiletFit === "no"
          ? "Tento typ nástavce nepoužívejte na nekompatibilní mísu; zvolte jiné rozměry nebo jiný typ řešení."
          : "Ověřte rozměry mísy a způsob upevnění konkrétního nástavce."
      );
    }

    if (feetFlatAtRaisedHeight !== "yes") {
      return needsMoreInfo(
        "feetFlatAtRaisedHeight",
        "Po zvýšení sedu musí zůstat bezpečná poloha při sezení.",
        feetFlatAtRaisedHeight === "no"
          ? "Tuto výšku nástavce nepoužívejte, pokud po zvýšení člověk nedosáhne chodidly bezpečně na podlahu."
          : "Před nákupem ověřte výslednou výšku WC a bezpečnou oporu chodidel."
      );
    }

    const needsArmSupport = transferAbility === "steadying";

    return {
      status: "candidate",
      headline: needsArmSupport
        ? "Zvýšené WC s vlastními madly může být kandidátní řešení."
        : "Zvýšení stávajícího WC může být kandidátní řešení.",
      nextStep: needsArmSupport
        ? "Porovnejte výšku zvýšení, kompatibilitu s WC, pevné uchycení a to, zda madla poskytují potřebnou stabilní oporu bez fyzické pomoci další osoby."
        : "Porovnejte výšku zvýšení, kompatibilitu s WC, způsob upevnění a nosnost.",
      missing: [],
      recommendations: [{
        id: needsArmSupport ? "raised_toilet_seat_with_arms_candidate" : "raised_toilet_seat_candidate",
        label: needsArmSupport
          ? "Nástavec na WC s odnímatelnými madly jako kandidátní řešení"
          : "Nástavec na WC jako kandidátní řešení",
        reason: needsArmSupport
          ? "Hlavním problémem je nízký sed a člověk potřebuje stabilní oporu rukama, ale ne fyzické zvedání druhou osobou."
          : "Hlavním problémem je nízký sed a samostatný přesun je potvrzený.",
        parameters: needsArmSupport
          ? ["výška zvýšení", "kompatibilita s WC", "pevnost uchycení", "nosnost", "stabilita madel", "opora chodidel po zvýšení"]
          : ["výška zvýšení", "kompatibilita s WC", "pevnost uchycení", "nosnost", "opora chodidel po zvýšení"],
        productCandidateIds: needsArmSupport ? ["besco-bs15"] : ["unizdrav-p2868"]
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: "Výsledek není diagnóza ani potvrzení individuální zdravotní vhodnosti."
    };
  }

  if (primaryNeed === "toilet_support") {
    // The two constructions have different critical fit gates. A confirmed
    // wall fixing selects the rail; otherwise the toilet-support frame must
    // itself be checked against the concrete toilet and surrounding space.
    if (wallFixing !== "verified" && supportFrameFit !== "yes") {
      return needsMoreInfo(
        "supportFrameFit",
        "Toaletní opora musí pasovat kolem konkrétního WC a způsobem upevnění.",
        supportFrameFit === "no"
          ? "Tento rám nepoužívejte. Potřebujeme jiný rozměr nebo jiný způsob opory."
          : "U zobrazeného rámu ověřte nastavitelnou šířku 53–63 cm, hloubku 47 cm, prostor pro bezpečné sedání/vstávání a kompatibilitu upevnění včetně rozteče otvorů 14,4 cm."
      );
    }

    const wallMounted = wallFixing === "verified";
    const productCandidateIds = [wallMounted ? "unizdrav-p2131" : "unizdrav-p2015"];

    return {
      status: "candidate",
      headline: "Má smysl porovnat oporu u WC podle prostoru a způsobu uchycení.",
      nextStep: wallMounted
        ? "Pro ověřené nástěnné kotvení posuzujte konkrétní madlo a jeho nosnost i upevnění do stěny."
        : "U rámu je potvrzený prostor i kompatibilita upevnění; před nákupem ještě zkontrolujte nastavení výšky a bezpečný úchop.",
      missing: [],
      recommendations: [{
        id: "toilet_support_candidate",
        label: wallMounted ? "Pevné madlo u WC jako kandidátní řešení" : "Toaletní opora kolem WC jako kandidátní řešení",
        reason: wallMounted
          ? "Člověk potřebuje při sedání nebo vstávání stabilní úchop. Nástěnné kotvení do vhodného podkladu bylo ověřeno, proto má smysl porovnat pevné madlo."
          : "Člověk potřebuje při sedání nebo vstávání stabilní úchop. Nástěnné kotvení není potvrzené, ale rozměry, prostor a způsob upevnění konkrétního toaletního rámu byly ověřeny.",
        parameters: wallMounted
          ? ["místo úchopu", "délka madla", "nosnost konkrétního madla", "bezpečné kotvení do nosného podkladu"]
          : ["šířka 53–63 cm", "hloubka 47 cm", "výška 64–74 cm", "rozteč otvorů pro upevnění 14,4 cm", "nosnost 100 kg", "prostor pro sedání a vstávání"],
        productCandidateIds
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: wallMounted
        ? "Nosnost samotného madla nenahrazuje ověření nosnosti konkrétní montáže ve zdi."
        : "Potvrzení rozměrů a upevnění se vztahuje jen na konkrétní zobrazený rám P2015."
    };
  }

  if (primaryNeed === "toilet_nearby") {
    if (floorStable !== "yes") {
      return needsMoreInfo(
        "floorStable",
        "Samostatná toaletní židle potřebuje stabilní podklad.",
        floorStable === "no"
          ? "Na nestabilním nebo nerovném podkladu tento shortlist nepoužívejte."
          : "Ověřte rovný, pevný podklad v místě, kde bude židle stát."
      );
    }
    if (spaceFit !== "yes") {
      return needsMoreInfo(
        "spaceFit",
        "Potřebujeme ověřit, že se toaletní židle bezpečně vejde do prostoru.",
        spaceFit === "no"
          ? "Tento kandidát se do prostoru nevejde; potřebujeme kompaktnější řešení."
          : "Ověřte celkovou šířku a hloubku i prostor pro bezpečné přesednutí."
      );
    }

    return {
      status: "candidate",
      headline: "Samostatná toaletní židle může být kandidátní řešení, pokud je cesta na WC hlavní problém.",
      nextStep: "Porovnejte výšku sedu, šířku, stabilitu podkladu, prostor pro přesun a nosnost.",
      missing: [],
      recommendations: [{
        id: "static_commode_candidate",
        label: "Výškově nastavitelná toaletní židle jako kandidátní řešení",
        reason: "Běžné WC je obtížně dostupné, ale přesun na stabilní židli nevyžaduje fyzickou pomoc druhé osoby.",
        parameters: ["výška sedu", "šířka sedáku", "celkové rozměry", "stabilní podklad", "nosnost"],
        productCandidateIds: ["unizdrav-p2807"]
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: "Výsledek nehodnotí zdravotní stav ani schopnost bezpečného přesunu mimo zadané praktické informace."
    };
  }

  if (primaryNeed === "shower_seated") {
    if (floorStable !== "yes") {
      return needsMoreInfo(
        "floorStable",
        "Sprchovací židle potřebuje stabilní podklad.",
        floorStable === "no"
          ? "Na nestabilním podkladu tento shortlist nepoužívejte."
          : "Ověřte rovný a stabilní podklad v místě použití."
      );
    }
    if (spaceFit !== "yes") {
      return needsMoreInfo(
        "spaceFit",
        "Sprchovací židle se musí bezpečně vejít do sprchového prostoru.",
        spaceFit === "no"
          ? "Tento kandidát je pro daný prostor příliš velký; potřebujeme jiný rozměr nebo typ."
          : "Ověřte šířku a hloubku sprchového prostoru proti celkovým rozměrům židle."
      );
    }

    return {
      status: "candidate",
      headline: "Sprchovací židle s oporami může být kandidátní řešení.",
      nextStep: "Porovnejte rozměry, výšku sedu, boční opory, stabilitu podkladu a nosnost.",
      missing: [],
      recommendations: [{
        id: "shower_chair_candidate",
        label: "Sprchovací židle s ručkami jako kandidátní řešení",
        reason: "Hlavní problém je dlouhé stání při sprchování a přesun nevyžaduje fyzickou pomoc druhé osoby.",
        parameters: ["celková šířka a hloubka", "výška sedu", "boční opory", "stabilní podklad", "nosnost"],
        productCandidateIds: ["unizdrav-p2062"]
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: "Výsledek není potvrzení bezpečnosti konkrétního přesunu."
    };
  }

  return professionalCheck(
    "Pro tuto situaci zatím nemáme bezpečně uzavřený rozhodovací model.",
    "Nevybírejte konkrétní pomůcku jen podle ceny nebo obrázku. Nejdřív potřebujeme doplnit ověřené rozhodovací parametry."
  );
}
