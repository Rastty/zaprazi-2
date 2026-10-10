// ZP_RELEASE_0_8_99
export const ADJUSTABLE_BED_PRODUCTS = Object.freeze([
  {
    id: "unizdrav-p2777",
    name: "UNIZDRAV P2777 – elektrická polohovací postel CLASSIC",
    solutionFamily: "electric_adjustable_bed_home",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      sleepingSurfaceCm: "90 × 200",
      outerSizeCm: "102.5 × 212",
      heightRangeCm: "38.6–80.6",
      backAngleDeg: 72,
      legAngleDeg: 28,
      maxUserWeightKg: 178,
      safeWorkingLoadKg: 215,
      bedWeightKg: 77,
      mattressIncluded: false,
      sideRailsIncluded: true,
      liftingPoleIncluded: true
    },
    selectionNotes: [
      "standardní domácí kandidát pro elektrické nastavení výšky, zad a nohou",
      "před pořízením je potřeba ověřit prostor alespoň pro vnější rozměr 102,5 × 212 cm",
      "matrace není součástí; musí být vybrána samostatně pro lůžko 90 × 200 cm",
      "nosnost kandidáta je potřeba ověřit bez ukládání přesné hmotnosti člověka"
    ],
    evidence: [
      {
        type: "merchant_product_page",
        url: "https://unizdrav.cz/zbozi/2777/elektricka-polohovaci-postel-classic",
        checkedAt: "2026-10-07"
      }
    ],
    offers: [
      {
        merchantId: "unizdrav-cz",
        merchantName: "UNIZDRAV",
        affiliateKey: "unizdrav-cz:p2777",
        url: "https://unizdrav.cz/zbozi/2777/elektricka-polohovaci-postel-classic",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  },
  {
    id: "unizdrav-p4707",
    name: "UNIZDRAV P4707 – elektrická polohovací postel Hospital",
    solutionFamily: "electric_adjustable_bed_robust",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      sleepingSurfaceCm: "90 × 196",
      outerSizeCm: "105 × 214",
      heightRangeCm: "40–70",
      backAngleDeg: 70,
      legAngleDeg: 30,
      maxLoadKg: 250,
      bedWeightKg: 110,
      mattressIncluded: false,
      sideRailsIncluded: true,
      centralBrake: true
    },
    selectionNotes: [
      "robustnější kandidát, když standardní domácí nosnost nestačí",
      "před pořízením je potřeba ověřit prostor alespoň pro vnější rozměr 105 × 214 cm",
      "matrace není součástí",
      "vyšší nosnost sama o sobě neřeší bezpečný přesun člověka z postele",
      "prodejce uvádí obecnou nosnost 250 kg, ale ne samostatný limit hmotnosti samotného uživatele; před nákupem jej potvrďte u výrobce nebo odborné výdejny"
    ],
    evidence: [
      {
        type: "merchant_product_page",
        url: "https://unizdrav.cz/zbozi/4707/elektricka-polohovaci-postel-hospital",
        checkedAt: "2026-10-07"
      }
    ],
    offers: [
      {
        merchantId: "unizdrav-cz",
        merchantName: "UNIZDRAV",
        affiliateKey: "unizdrav-cz:p4707",
        url: "https://unizdrav.cz/zbozi/4707/elektricka-polohovaci-postel-hospital",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  },
  {
    id: "unizdrav-p4044",
    name: "UNIZDRAV P4044 – elektrická polohovací postel s matrací Multibed",
    solutionFamily: "electric_adjustable_bed_advanced_care",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      sleepingSurfaceCm: "90 × 200",
      outerSizeCm: "96 × 212",
      heightRangeCm: "50–70",
      backAngleDeg: 80,
      legAngleDeg: "+25 až -65",
      lateralTurnDeg: 45,
      maxLoadKg: 260,
      bedWeightKg: 104,
      mattressIncluded: true,
      sideRailsIncluded: true,
      inBedToiletOpeningCm: "28 × 20"
    },
    selectionNotes: [
      "specializovaný kandidát pro náročnější každodenní péči přímo na lůžku",
      "obsahuje matraci, bočnice, hrazdu a příslušenství pro hygienu a toaletu na lůžku",
      "před doporučením je potřeba ověřit, že jsou tyto funkce skutečně prakticky potřebné a že se postel vejde do prostoru",
      "boční otáčení a hygienické funkce nenahrazují zaučení pečující osoby",
      "prodejce uvádí obecnou nosnost 260 kg bez samostatného limitu hmotnosti samotného uživatele; bezpečnou mez potvrďte u výrobce nebo odborné výdejny"
    ],
    evidence: [
      {
        type: "merchant_product_page",
        url: "https://unizdrav.cz/zbozi/4044/elektricka-polohovaci-postel-s-matraci-multibed",
        checkedAt: "2026-10-07"
      }
    ],
    offers: [
      {
        merchantId: "unizdrav-cz",
        merchantName: "UNIZDRAV",
        affiliateKey: "unizdrav-cz:p4044",
        url: "https://unizdrav.cz/zbozi/4044/elektricka-polohovaci-postel-s-matraci-multibed",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  }
]);

export function getAdjustableBedProducts(ids = []) {
  const wanted = new Set(ids);
  return ADJUSTABLE_BED_PRODUCTS.filter((item) => wanted.has(item.id) && item.productionEligible);
}
