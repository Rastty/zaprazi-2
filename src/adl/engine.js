// ZP_RELEASE_0_8_90
const TASKS = new Set(["drink", "stabilize_container", "one_hand_meal", "open_packaging", "other", "unknown"]);
const PROBLEMS = new Set(["grip_or_spill", "container_moves", "one_hand_setup", "grip_or_twist", "swallowing_or_medical", "other", "unknown"]);
const YES_NO_UNKNOWN = new Set(["yes", "no", "unknown"]);

const CANDIDATES = Object.freeze({
  upcup: {
    id: "rehavita-upcup-15-050101",
    product: "UpCup - pomůcka pro snadné pití MoVeS",
    sku: "15-050101",
    merchant: "RehaVita.cz",
    affiliateKey: "rehavita-cz:upcup-15-050101",
    sourceUrl: "https://www.rehavita.cz/upcup-pomucka-pro-snadne-piti/",
    checkedAt: "2026-10-07",
    facts: ["široká stabilní základna", "madla pro jistější úchop", "vhodnost konkrétního nápoje je potřeba ověřit"]
  },
  beatIt: {
    id: "rehavita-beat-it-15-050102",
    product: "Beat It - držák pro stabilizaci nádob MoVeS",
    sku: "15-050102",
    merchant: "RehaVita.cz",
    affiliateKey: "rehavita-cz:beat-it-15-050102",
    sourceUrl: "https://www.rehavita.cz/beat-it-drzak-pro-stabilizaci-nadob-moves/",
    checkedAt: "2026-10-07",
    facts: ["rozměry 22 × 11,5 × 7 cm bez držáku na stůl", "posuvný mechanismus pro stabilizaci předmětu", "vyžaduje vhodnou stabilní pracovní plochu"]
  },
  theomatik: {
    id: "rehavita-theomatik-15-050103",
    product: "Theomatik - multifunkční jídelní podnos pro obsluhu jednou rukou MoVeS",
    sku: "15-050103",
    merchant: "RehaVita.cz",
    affiliateKey: "rehavita-cz:theomatik-15-050103",
    sourceUrl: "https://www.rehavita.cz/theomatik-multifunkcni-jidelni-podnos-pro-obsluhu-jednou-rukou-moves/",
    checkedAt: "2026-10-07",
    facts: ["rozměry 36,5 × 18,8 × 3 cm", "hmotnost 900 g", "skládací provedení", "vhodné do myčky podle prodejce"]
  },
  openIt: {
    id: "rehavita-open-it-15-050105",
    product: "MVS Open-It - multifunkční otevírací pomůcka 5 v 1",
    sku: "15-050105",
    merchant: "RehaVita.cz",
    affiliateKey: "rehavita-cz:open-it-15-050105",
    sourceUrl: "https://www.rehavita.cz/mvs-open-it-multifunkcni-oteviraci-pomucka-5-v-1/",
    checkedAt: "2026-10-07",
    facts: ["5 funkcí v jedné pomůcce", "šroubovací uzávěry, jazýčky plechovek, zipy a obaly", "hmotnost 60 g"]
  }
});

function invalid(field) {
  return {
    status: "invalid_input",
    headline: "Zkontrolujte odpovědi.",
    nextStep: `Neplatná hodnota pole: ${field}`,
    candidate: null,
    checks: [],
    safetyNote: null
  };
}

function result(status, headline, nextStep, candidate = null, checks = [], safetyNote = null) {
  return { status, headline, nextStep, candidate, checks, safetyNote };
}

export function chooseAdlSelfCareAid(input = {}) {
  const {
    task = "unknown",
    mainProblem = "unknown",
    stableSurface = "unknown",
    oneHandUse = "unknown",
    productFit = "unknown"
  } = input;

  if (!TASKS.has(task)) return invalid("task");
  if (!PROBLEMS.has(mainProblem)) return invalid("mainProblem");
  if (!YES_NO_UNKNOWN.has(stableSurface)) return invalid("stableSurface");
  if (!YES_NO_UNKNOWN.has(oneHandUse)) return invalid("oneHandUse");
  if (!YES_NO_UNKNOWN.has(productFit)) return invalid("productFit");

  // Knowing a matching product category does not verify the exact real-world fit.
  // Merchant routes must remain closed until the specific checks are confirmed.
  const verifiedCandidate = (headline, nextStep, candidate, checks, safetyNote = null) => {
    if (productFit === "yes") return { ...result("candidate", headline, nextStep, candidate, checks, safetyNote), requiresProductFit: true };
    return { ...result(
      "needs_fit_check",
      productFit === "no"
        ? "Tato pomůcka zatím nesplňuje ověřené podmínky."
        : "Našli jsme konkrétní pomůcku, ale její použití ještě není ověřené.",
      productFit === "no"
        ? "Pokud některá důležitá podmínka nevyhovuje, tento výrobek nekupujte. Vyberte jiné řešení nebo se poraďte s odborníkem."
        : "Než zobrazíme nákupní nabídku, ověřte níže uvedené praktické podmínky přímo pro vybraný výrobek. Pokud si nejste jistí, odpovězte Nevím.",
      candidate,
      checks,
      safetyNote
    ), requiresProductFit: true };
  };


  if (mainProblem === "swallowing_or_medical") {
    return result(
      "professional_check",
      "Tady není bezpečné vybírat pomůcku jen podle e-shopu.",
      "Pokud je hlavní problém samotné polykání, zakuckávání nebo jiná zdravotní obtíž při jídle či pití, nejdřív řešte bezpečný postup s odborníkem.",
      null,
      [],
      "ZaPrazi v této větvi nedoporučuje konkrétní produkt a nevyhodnocuje diagnózu."
    );
  }

  if (task === "drink" && mainProblem === "grip_or_spill") {
    return verifiedCandidate(
      "Pro snazší samostatné pití dává smysl ověřit UpCup.",
      "Ověřte, že problém je hlavně v držení, naklánění nebo rozlévání. Pokud je problém v samotném polykání, produkt nevybírejte tímto poradcem.",
      CANDIDATES.upcup,
      ["ověřit pohodlný úchop", "ověřit vhodnost pro používaný nápoj"]
    );
  }

  if (task === "stabilize_container" && mainProblem === "container_moves") {
    if (stableSurface === "no") {
      return result(
        "no_match",
        "Pro Beat It chybí stabilní pracovní plocha.",
        "Nejdřív vyřešte stabilní plochu nebo jiný způsob fixace; samotný držák není bezpečné doporučit bez vhodného podkladu."
      );
    }

    if (stableSurface === "unknown") {
      return result(
        "needs_fit_check",
        "Beat It může dávat smysl, ale nejdřív je potřeba ověřit pracovní plochu.",
        "Ověřte stabilní stůl nebo pracovní desku a zda lze nádobu bezpečně upevnit.",
        CANDIDATES.beatIt,
        ["stabilní pracovní plocha", "rozměr a tvar nádoby"]
      );
    }

    return verifiedCandidate(
      "Pro stabilizaci nádoby dává smysl ověřit Beat It.",
      "Před nákupem ověřte, že používaná nádoba a pracovní plocha odpovídají způsobu upevnění.",
      CANDIDATES.beatIt,
      ["rozměr a tvar nádoby", "bezpečné upevnění na stabilní ploše"]
    );
  }

  if (task === "open_packaging" && mainProblem === "grip_or_twist") {
    return verifiedCandidate(
      "Pro běžné otevírání lahví, plechovek, zipů a obalů dává smysl ověřit MVS Open-It.",
      "Ověřte, že problém je opravdu v úchopu, otočení nebo zatažení při otevírání běžného obalu. Tato větev neslouží k rozhodování o lécích ani dávkování.",
      CANDIDATES.openIt,
      ["ověřit konkrétní typ uzávěru nebo obalu", "nepoužívat poradce k rozhodování o lécích"],
      "Zápraží hodnotí pouze praktický úkon otevírání; neřeší výběr, dávkování ani bezpečnost léků."
    );
  }

  if (task === "one_hand_meal" && mainProblem === "one_hand_setup") {
    if (oneHandUse === "no") {
      return result(
        "no_match",
        "Theomatik je cílený hlavně na obsluhu jídla jednou rukou.",
        "Pokud problém není v obsluze jednou rukou, tento konkrétní produkt není dostatečně přesná shoda."
      );
    }

    if (oneHandUse === "unknown") {
      return result(
        "needs_fit_check",
        "Theomatik může být vhodný, ale nejdřív ověřte skutečný způsob použití.",
        "Ověřte, že hlavní potřeba je stabilní příprava a jídlo s využitím jedné ruky.",
        CANDIDATES.theomatik,
        ["potvrdit obsluhu jednou rukou", "ověřit dostatek místa na stole"]
      );
    }

    return verifiedCandidate(
      "Pro jídlo a přípravu jednou rukou dává smysl ověřit Theomatik.",
      "Před nákupem ověřte rozměry pracovní plochy a zda podnos řeší právě konkrétní činnost, která doma nejvíc omezuje samostatnost.",
      CANDIDATES.theomatik,
      ["dostatek místa na stole", "konkrétní domácí činnost"]
    );
  }

  if (task === "unknown" || mainProblem === "unknown") {
    return result(
      "needs_more_context",
      "Ještě chybí jeden praktický údaj.",
      "Vyberte konkrétní činnost a hlavní překážku; poradce nemá hádat podle věku nebo diagnózy."
    );
  }

  return result(
    "no_match",
    "Pro tuto kombinaci zatím nemáme ověřený přesný produkt.",
    "Nevynucujeme doporučení jen proto, že je produkt v affiliate programu. Zvolte jinou činnost nebo pokračujte bez produktového doporučení."
  );
}

export const adlSelfCareCandidates = CANDIDATES;
