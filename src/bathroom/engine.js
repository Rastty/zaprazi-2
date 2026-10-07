const PRIMARY_NEEDS = new Set([
  "raise_toilet",
  "toilet_support",
  "toilet_nearby",
  "shower_seated",
  "bath_transfer",
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

function acquisitionFor(duration) {
  if (duration === "short_term") {
    return [{
      id: "compare_rent_buy",
      label: "Porovnat půjčení a koupi",
      reason: "U krátkodobé potřeby má smysl před nákupem ověřit, zda není dostupné vhodné půjčení."
    }];
  }

  if (duration === "long_term") {
    return [{
      id: "compare_buy_rent",
      label: "Porovnat koupi a případné půjčení",
      reason: "U dlouhodobé potřeby může dávat smysl nákup, ale dostupnost půjčení nebo příspěvku se ověřuje zvlášť."
    }];
  }

  return [{
    id: "compare_acquisition",
    label: "Ověřit způsob pořízení",
    reason: "Bez znalosti délky používání zatím neupřednostňujeme koupi ani půjčení."
  }];
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

  if (primaryNeed === "bath_transfer") {
    return professionalCheck(
      "Přesun přes okraj vany zatím ZaPrazi nebude řešit automatickým výběrem výrobku.",
      "Nejdřív je potřeba ověřit způsob přesunu a prostor vany. Až potom má smysl porovnávat vanovou sedačku, desku nebo jiné řešení."
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

  if (primaryNeed === "raise_toilet") {
    if (transferAbility !== "independent") {
      return {
        status: "needs_more_info",
        headline: "Samotné zvýšení WC nemusí být dostatečná opora.",
        nextStep: "Pokud je při sedání nebo vstávání potřeba opora, nejdřív porovnejte řešení s madlem nebo toaletním rámem; samotný nástavec zatím nedoporučujeme.",
        missing: [],
        recommendations: [],
        acquisition: acquisitionFor(duration)
      };
    }
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

    return {
      status: "candidate",
      headline: "Zvýšení stávajícího WC může být kandidátní řešení.",
      nextStep: "Porovnejte výšku zvýšení, kompatibilitu s WC, způsob upevnění a nosnost.",
      missing: [],
      recommendations: [{
        id: "raised_toilet_seat_candidate",
        label: "Nástavec na WC jako kandidátní řešení",
        reason: "Hlavním problémem je nízký sed a samostatný přesun je potvrzený.",
        parameters: ["výška zvýšení", "kompatibilita s WC", "pevnost uchycení", "nosnost", "opora chodidel po zvýšení"],
        productCandidateIds: ["unizdrav-p2868"]
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: "Výsledek není diagnóza ani potvrzení individuální zdravotní vhodnosti."
    };
  }

  if (primaryNeed === "toilet_support") {
    const productCandidateIds = ["unizdrav-p2015"];
    if (wallFixing === "verified") productCandidateIds.unshift("unizdrav-p2131");

    return {
      status: "candidate",
      headline: "Má smysl porovnat oporu u WC podle prostoru a způsobu uchycení.",
      nextStep: wallFixing === "verified"
        ? "Porovnejte pevné madlo a toaletní oporu podle místa úchopu, rozměrů, nosnosti a montáže."
        : "Dokud není ověřeno bezpečné kotvení do stěny, upřednostněte porovnání řešení, které na nástěnném madle není závislé.",
      missing: [],
      recommendations: [{
        id: "toilet_support_candidate",
        label: "Opora u WC jako kandidátní řešení",
        reason: "Člověk přesedá bez fyzické pomoci druhé osoby, ale potřebuje stabilní oporu při sedání nebo vstávání.",
        parameters: ["místo úchopu", "prostor kolem WC", "kompatibilita upevnění", "nosnost", "bezpečné kotvení u nástěnného madla"],
        productCandidateIds
      }],
      acquisition: acquisitionFor(duration),
      disclaimer: "Nosnost samotného madla nenahrazuje ověření nosnosti konkrétní montáže ve zdi."
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
