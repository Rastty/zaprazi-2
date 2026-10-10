export const FOOTWEAR_CANDIDATES = Object.freeze({
  arsene: {
    id: "zdrava-obuv-arsene",
    product: "PodoWell ARSENE zdravotní sandály unisex modré",
    merchant: "Zdravá Obuv Štěpánková & C.",
    affiliateKey: "zdrava-obuv-cz:arsene",
    sourceUrl: "https://www.zdrava-obuv-eshop.cz/arsene-zdravotni-sandalek-unisex-modra-podowell/",
    checkedAt: "2026-10-07",
    listedPriceCzk: 1650,
    facts: [
      "šířka J (široká)",
      "dvě nastavitelné pásky na suchý zip",
      "otevřená špička",
      "vyjímatelná stélka",
      "merchant uvádí domácí i vycházkové použití"
    ]
  },
  xavier: {
    id: "zdrava-obuv-xavier",
    product: "PodoWell XAVIER extraširoká unisex obuv černá",
    merchant: "Zdravá Obuv Štěpánková & C.",
    affiliateKey: "zdrava-obuv-cz:xavier",
    sourceUrl: "https://www.zdrava-obuv-eshop.cz/xavier-ortopedicka-obuv-extrasiroka-pro-otekle-nohy-unisex-cerna-podowell/",
    checkedAt: "2026-10-07",
    listedPriceCzk: 1660,
    facts: [
      "šířka K+ (extra široká)",
      "velký otvor pro snadnější nazutí",
      "nastavení suchým zipem na nártu i patě",
      "plná špička",
      "nízké provedení"
    ]
  },
  altitude: {
    id: "zdrava-obuv-altitude",
    product: "PodoWell ALTITUDE unisex černá",
    merchant: "Zdravá Obuv Štěpánková & C.",
    affiliateKey: "zdrava-obuv-cz:altitude",
    sourceUrl: "https://www.zdrava-obuv-eshop.cz/altitude-zdravotni-obuv-pro-extremne-otekle-nohy-unisex-cerna-podowell/",
    checkedAt: "2026-10-07",
    listedPriceCzk: 1840,
    facts: [
      "obuv se otevírá pomocí suchých zipů z více stran",
      "výrazně velký otvor pro nazutí",
      "plná špička",
      "kotníkové provedení",
      "šířku lze výrazně přizpůsobit"
    ]
  }
});

const OPENING = new Set(["wide_opening", "extra_wide_low", "full_opening", "unknown"]);
const TOE = new Set(["open_ok", "closed_needed", "unknown"]);
const YES_NO_UNKNOWN = new Set(["yes", "no", "unknown"]);

const result = (status, headline, nextStep, candidate = null, checks = [], safetyNote = "") => ({
  status,
  headline,
  nextStep,
  candidate,
  checks,
  safetyNote
});

export function chooseEasyFootwear(input = {}) {
  const openingNeed = OPENING.has(input.openingNeed) ? input.openingNeed : "unknown";
  const toe = TOE.has(input.toe) ? input.toe : "unknown";
  const velcroUse = YES_NO_UNKNOWN.has(input.velcroUse) ? input.velcroUse : "unknown";
  const measuredFeet = YES_NO_UNKNOWN.has(input.measuredFeet) ? input.measuredFeet : "unknown";
  const sizeChartFit = YES_NO_UNKNOWN.has(input.sizeChartFit) ? input.sizeChartFit : "unknown";

  if (velcroUse === "no") {
    return result(
      "no_match",
      "Tento shortlist není vhodný.",
      "Všechny tři ověřené modely používají suchý zip. Pokud ho člověk neumí bezpečně otevřít a zavřít, je potřeba jiný typ obuvi nebo pomoc při obouvání.",
      null,
      [],
      "Zápraží nevybírá obuv podle diagnózy a neřeší léčbu příčiny otoku nebo bolesti."
    );
  }

  if (openingNeed === "unknown" || toe === "unknown") {
    return result(
      "needs_more_context",
      "Potřebujeme ještě upřesnit způsob obouvání.",
      "Doplňte, jak velké otevření boty je potřeba a zda musí mít uzavřenou špičku."
    );
  }

  let candidate = null;

  if (openingNeed === "wide_opening" && toe === "open_ok") {
    candidate = FOOTWEAR_CANDIDATES.arsene;
  } else if (openingNeed === "extra_wide_low" && toe === "closed_needed") {
    candidate = FOOTWEAR_CANDIDATES.xavier;
  } else if (openingNeed === "full_opening" && toe === "closed_needed") {
    candidate = FOOTWEAR_CANDIDATES.altitude;
  } else {
    return result(
      "no_match",
      "Pro tuto kombinaci zatím nemáme přesně ověřený model.",
      "Nevybírejte nejbližší dostupnou botu jen podle fotografie. Změřte obě chodidla a hledejte model, který odpovídá potřebnému otevření, špičce a šířce.",
      null,
      [],
      "Pokud se velikost nebo tvar chodidla náhle změnil, je přítomná rána, výrazná bolest nebo rychle vzniklý otok, neřešte to jen výběrem bot."
    );
  }

  const checks = [
    "změřit obě chodidla podle velikostní tabulky konkrétního modelu",
    "ověřit délku i šířku / objem v nejširším místě",
    "ověřit, že suchý zip lze bezpečně ovládat a dotažení nohu nestlačuje"
  ];

  if (measuredFeet !== "yes" || velcroUse !== "yes") {
    return result(
      "needs_fit_check",
      "Máme vhodný typ kandidáta, ale měření a zapínání ještě nejsou potvrzené.",
      "Nejdřív změřte obě chodidla a ověřte práci se suchým zipem. Konkrétní velikost musí odpovídat tabulce tohoto modelu.",
      candidate,
      checks,
      "Výběr je založený na konstrukci boty, ne na diagnóze. Náhlý otok, rána nebo výrazná bolest patří k odbornému posouzení."
    );
  }

  // Measured feet do not prove the *available size of this exact model*
  // fits. An explicit chart/merchant dimensional check is the final gate.
  if (sizeChartFit !== "yes") {
    return result(
      "needs_fit_check",
      sizeChartFit === "no"
        ? "Vybraný model zatím nesedí naměřeným rozměrům."
        : "Máme vhodnou konstrukci boty, ale konkrétní velikost ještě není ověřená.",
      sizeChartFit === "no"
        ? "Tento model neobjednávejte jen podle běžného čísla obuvi. Hledejte jinou dostupnou velikost nebo jiný model s odpovídající délkou a šířkou."
        : "Porovnejte naměřenou délku i šířku obou chodidel s velikostní tabulkou tohoto konkrétního modelu. Pokud tabulka chybí, ověřte rozměry u prodejce.",
      candidate,
      checks,
      "Zápraží tímto potvrzením neověřuje zdravotní vhodnost obuvi ani dostupnost velikosti."
    );
  }

  return result(
    "candidate",
    "Tento model odpovídá způsobu obouvání a vámi potvrzené velikosti.",
    "U prodejce vyberte právě ověřenou velikost a před dokončením objednávky zkontrolujte její aktuální dostupnost. Pokud velikost nesedí, změňte odpověď.",
    candidate,
    checks,
    "Zápraží neposuzuje zdravotní příčinu potíží s chodidlem a netvrdí, že obuv něco léčí."
  );
}
