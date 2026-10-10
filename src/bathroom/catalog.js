// ZP_RELEASE_0_8_96
import { isVerifiedProductionProduct } from "../decision/product-identity-gate.js";
export const BATHROOM_PRODUCTS = Object.freeze([
  {
    id: "unizdrav-p2868",
    name: "UNIZDRAV P2868 – zvyšovač WC s příklopem, 15 cm",
    solutionFamily: "raised_toilet_seat",
    productionEligible: true,
    identityStatus: "verified",
    facts: { heightIncreaseCm: 15, outerCm: "36 × 40", openingCm: "21 × 26", weightKg: 1.5, maxUserWeightKg: 100 },
    selectionNotes: [
      "upevnění bočními šrouby k vhodné WC míse",
      "před použitím je potřeba ověřit stabilní uchycení",
      "po zvýšení sedu musí být možné bezpečně sedět s chodidly opřenými o podlahu"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://unizdrav.cz/zbozi/2868/zvysovac-wc-s-priklopem-unizdrav-15-cm", checkedAt: "2026-10-07" },
      { type: "independent_setup_guidance", url: "https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/raised-toilet-seat", checkedAt: "2026-10-07" }
    ],
    offers: [
      { merchantId: "unizdrav-cz", merchantName: "UNIZDRAV", affiliateKey: "unizdrav-cz:p2868", url: "https://unizdrav.cz/zbozi/2868/zvysovac-wc-s-priklopem-unizdrav-15-cm", affiliateUrl: null, acquisitionMode: "direct_pay", checkedAt: "2026-10-07" }
    ]
  },
  {
    id: "besco-bs15",
    name: "BESCO BES-BS15 – nástavec na WC s odnímatelnými madly",
    solutionFamily: "raised_toilet_seat_with_arms",
    productionEligible: true,
    identityStatus: "verified",
    facts: { heightIncreaseCm: 11.5, maxUserWeightKg: 100, weightKg: 3.26 },
    selectionNotes: [
      "určený pro člověka, který potřebuje při sedání nebo vstávání stabilní oporu rukama, ale ne fyzické zvedání druhou osobou",
      "před nákupem je potřeba ověřit kompatibilitu s konkrétní WC mísou a pevné uchycení",
      "po zvýšení sedu musí být možné bezpečně sedět s chodidly opřenými o podlahu",
      "odnímatelná madla nenahrazují odborné posouzení, pokud je přesun nejistý nebo vyžaduje fyzickou pomoc"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/", checkedAt: "2026-10-07" },
      { type: "independent_setup_guidance", url: "https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/raised-toilet-seat", checkedAt: "2026-10-07" }
    ],
    offers: [
      { merchantId: "rehabilitacni-pomucky-cz", merchantName: "RehabilitačníPomůcky.cz", affiliateKey: "rehabilitacni-pomucky-cz:besco-bs15", url: "https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/", affiliateUrl: null, acquisitionMode: "direct_pay", checkedAt: "2026-10-07" }
    ]
  },
  {
    id: "unizdrav-p2015",
    name: "UNIZDRAV P2015 – toaletní opora",
    solutionFamily: "toilet_support_frame",
    productionEligible: true,
    identityStatus: "verified",
    facts: { widthCm: "53–63", depthCm: 47, heightCm: "64–74", maxUserWeightKg: 100, fixingHoleSpacingCm: 14.4 },
    selectionNotes: [
      "výškově i šířkově nastavitelné řešení",
      "před doporučením je potřeba ověřit prostor kolem WC a kompatibilitu upevnění",
      "nejde o náhradu odborného posouzení, pokud člověk potřebuje fyzickou pomoc druhé osoby"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://unizdrav.cz/zbozi/2015/toaletni-opora", checkedAt: "2026-10-07" }
    ],
    offers: [
      { merchantId: "unizdrav-cz", merchantName: "UNIZDRAV", affiliateKey: "unizdrav-cz:p2015", url: "https://unizdrav.cz/zbozi/2015/toaletni-opora", affiliateUrl: null, acquisitionMode: "direct_pay", checkedAt: "2026-10-07" }
    ]
  },
  {
    id: "unizdrav-p2807",
    name: "UNIZDRAV P2807 – toaletní židle výškově nastavitelná",
    solutionFamily: "static_commode",
    productionEligible: true,
    identityStatus: "verified",
    facts: { totalWidthCm: 60, seatWidthCm: 44, totalDepthCm: 60, seatHeightCm: "36–60", maxUserWeightKg: 100, weightKg: 8.5 },
    selectionNotes: [
      "určeno jako samostatná toaletní židle tam, kde je běžné WC obtížně dostupné",
      "před použitím je potřeba ověřit stabilní podlahu, dostatek prostoru a bezpečný přesun na sedadlo",
      "pokud je k přesunu běžně potřeba fyzická pomoc druhé osoby, online poradce nemá vybírat konkrétní výrobek"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://unizdrav.cz/zbozi/2807/toaletni-zidle-vyskove-nastavitelna-unizdrav", checkedAt: "2026-10-07" },
      { type: "independent_use_case_guidance", url: "https://www.nhs.uk/social-care-and-support/care-services-equipment-and-care-homes/household-gadgets-and-equipment-to-make-life-easier/", checkedAt: "2026-10-07" }
    ],
    offers: [
      { merchantId: "unizdrav-cz", merchantName: "UNIZDRAV", affiliateKey: "unizdrav-cz:p2807", url: "https://unizdrav.cz/zbozi/2807/toaletni-zidle-vyskove-nastavitelna-unizdrav", affiliateUrl: null, acquisitionMode: "direct_pay", checkedAt: "2026-10-07" }
    ]
  },
  {
    id: "unizdrav-p2062",
    name: "UNIZDRAV P2062 – sprchovací židle s ručkami",
    solutionFamily: "shower_chair",
    productionEligible: true,
    identityStatus: "verified",
    facts: { totalWidthCm: 55, totalDepthCm: 48, totalHeightCm: "67.5–80", seatHeightCm: "38–50.5", seatCm: "40 × 33", maxUserWeightKg: 136, weightKg: 3.1 },
    selectionNotes: [
      "výškově nastavitelné sedadlo a boční opory",
      "před doporučením je potřeba ověřit rozměr sprchového prostoru, nosnost a stabilní podklad",
      "nejde o řešení pro nejasný nebo asistovaný přesun bez dalšího odborného posouzení"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://unizdrav.cz/zbozi/2062/sprchovaci-zidle-s-ruckami", checkedAt: "2026-10-07" }
    ],
    offers: [
      { merchantId: "unizdrav-cz", merchantName: "UNIZDRAV", affiliateKey: "unizdrav-cz:p2062", url: "https://unizdrav.cz/zbozi/2062/sprchovaci-zidle-s-ruckami", affiliateUrl: null, acquisitionMode: "direct_pay", checkedAt: "2026-10-07" }
    ]
  },
  {
    id: "unizdrav-p2131",
    name: "UNIZDRAV P2131 – protiskluzové madlo 30–45 cm",
    solutionFamily: "fixed_grab_rail",
    productionEligible: true,
    identityStatus: "verified",
    facts: { lengthsCm: [30, 40, 45], wallDistanceCm: 5.5, maxUserWeightKg: 100, suppliedFixingScrews: 6 },
    selectionNotes: [
      "pevné nástěnné madlo, nikoli přísavné řešení",
      "před doporučením musí být ověřeno vhodné a bezpečné ukotvení do podkladu",
      "nosnost produktu neznamená automaticky nosnost konkrétní montáže ve zdi"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://unizdrav.cz/zbozi/2131/protiskluzove-madlo-do-koupelny-a-toalety-od-30-do-45-cm", checkedAt: "2026-10-07" },
      { type: "independent_installation_guidance", url: "https://www.reading.gov.uk/adult-care/help-living-at-home/falls-prevention/home-safety/indoor-safety/bathroom/", checkedAt: "2026-10-07" }
    ],
    offers: [
      { merchantId: "unizdrav-cz", merchantName: "UNIZDRAV", affiliateKey: "unizdrav-cz:p2131", url: "https://unizdrav.cz/zbozi/2131/protiskluzove-madlo-do-koupelny-a-toalety-od-30-do-45-cm", affiliateUrl: null, acquisitionMode: "direct_pay", checkedAt: "2026-10-07" }
    ]
  },
  {
    id: "besco-bs008",
    name: "BESCO BES-BS008 – sedačka na vanu s madlem",
    solutionFamily: "bath_transfer_seat",
    productionEligible: true,
    identityStatus: "verified",
    facts: { seatWidthCm: 69, seatDepthCm: 31, bathInnerWidthCm: "41–65", maxUserWeightKg: 100 },
    selectionNotes: [
      "před nákupem změřit vnitřní šířku okrajů vany; tento model je určen pro 41–65 cm",
      "upevnění čtyřmi nastavitelnými rozpěrnými nožičkami musí být před použitím pevné a bez posunu",
      "automatický výběr je určen jen pro člověka, který zvládne bezpečně usednout na sedačku a přesunout nohy přes okraj vany bez fyzického zvedání druhou osobou"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://www.rehabilitacnipomucky.cz/besco-sedacka-na-vanu-s-madlem/", checkedAt: "2026-10-07" },
      { type: "independent_bathing_guidance", url: "https://www.guysandstthomas.nhs.uk/health-information/daily-tasks-using-1-hand", checkedAt: "2026-10-07" },
      { type: "independent_transfer_guidance", url: "https://www.northerncarealliance.nhs.uk/patient-information/patient-leaflets/orthopaedic-surgery-therapy-information-following-hip-surgery", checkedAt: "2026-10-07" }
    ],
    offers: [
      { merchantId: "rehabilitacni-pomucky-cz", merchantName: "RehabilitačníPomůcky.cz", affiliateKey: "rehabilitacni-pomucky-cz:besco-bs008", url: "https://www.rehabilitacnipomucky.cz/besco-sedacka-na-vanu-s-madlem/", affiliateUrl: null, acquisitionMode: "direct_pay", checkedAt: "2026-10-07" }
    ]
  },
  {
    id: "unizdrav-p2203",
    name: "UNIZDRAV P2203 – sprchovací židle do vany",
    solutionFamily: "bath_transfer_bench",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      totalWidthCm: 81,
      totalDepthCm: 61,
      totalHeightCm: "81.5–91.5",
      seatWidthCm: 68,
      seatDepthCm: 41,
      seatHeightCm: "45.5–56",
      maxUserWeightKg: 110,
      weightKg: 4.4
    },
    selectionNotes: [
      "jedna strana konstrukce stojí ve vaně a druhá na podlaze mimo vanu",
      "před použitím je potřeba ověřit dostatek prostoru pro celkový půdorys 81 × 61 cm",
      "vnitřek vany i podlaha mimo vanu musí umožnit stabilní opření všech nohou konstrukce",
      "použití je určené jen pro samostatný přesun bez fyzického zvedání druhou osobou"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://unizdrav.cz/zbozi/2203/sprchovaci-zidle-do-vany", checkedAt: "2026-10-07" },
      { type: "independent_bathing_guidance", url: "https://www.uhcw.nhs.uk/download/clientfiles/files/Patient%20Information%20Leaflets/Clinical%20Support%20Services/Therapies/Occupational%20Therapy/Bathing%20and%20showering%20advice%20and%20information.pdf", checkedAt: "2026-10-07" }
    ],
    offers: [
      {
        merchantId: "unizdrav-cz",
        merchantName: "UNIZDRAV",
        affiliateKey: "unizdrav-cz:p2203",
        url: "https://unizdrav.cz/zbozi/2203/sprchovaci-zidle-do-vany",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  },
  {
    id: "dma-eh-cmda",
    name: "DMA EH-CMDA – toaletní židle 4v1",
    solutionFamily: "multifunction_toilet_shower_chair",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      totalWidthCm: 51,
      totalDepthCm: 40,
      totalHeightCm: "59–77",
      seatWidthCm: 50,
      seatDepthCm: 40,
      seatHeightCm: "39–54",
      maxUserWeightKg: 150,
      weightKg: 3
    },
    selectionNotes: [
      "jedna stabilní pomůcka může sloužit jako toaletní židle, sprchovací sedačka nebo nástavec nad WC",
      "před použitím je potřeba ověřit rovný stabilní podklad, prostor alespoň pro celkovou šířku 51 cm a bezpečný přesun bez fyzického zvedání druhou osobou",
      "odnímatelná madla mohou pomoci při vstávání, ale nenahrazují odborné posouzení asistovaného přesunu",
      "při použití nad WC nebo ve sprše je nutné dodržet návod výrobce a zkontrolovat správné zajištění rámu"
    ],
    reimbursementEvidence: {
      payerCode: "5019427",
      reimbursementGroup: "07.04.03.01",
      manufacturerStatesFullyReimbursed: true,
      approvalRequired: true,
      serviceLifeYears: 10,
      monthlySuklListVerified: false,
      checkedAt: "2026-10-07"
    },
    evidence: [
      { type: "manufacturer_product_page", url: "https://www.dmapraha.cz/eh-cmda_z35658/", checkedAt: "2026-10-07" },
      { type: "manufacturer_manual", url: "https://www.dmapraha.cz/data/files/manual/KD_IFU_EH-CMDA_ToaletniZidle_cs.pdf", checkedAt: "2026-10-07" },
      { type: "approved_merchant_product_page", url: "https://www.drmax.cz/dma-eh-cmda-toaletni-zidle-4v1", checkedAt: "2026-10-07" }
    ],
    offers: [
      {
        merchantId: "drmax-cz",
        merchantName: "Dr.Max",
        affiliateKey: "drmax-cz:dma-eh-cmda",
        url: "https://www.drmax.cz/dma-eh-cmda-toaletni-zidle-4v1",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  },
  {
    id: "unizdrav-p2085",
    name: "UNIZDRAV P2085 – toaletní sprchovací vozík",
    solutionFamily: "combined_shower_toilet_wheelchair",
    productionEligible: false,
    identityStatus: "verified_research_only",
    facts: { totalCm: "90 × 57 × 95", seatCm: "41 × 40", seatHeightCm: 50, maxUserWeightKg: 110, weightKg: 9.5 },
    selectionNotes: [
      "kombinovaná sprchovací a toaletní funkce",
      "výklopné područky a odnímatelné nebo sklopné opěrky nohou",
      "vyšší-support větev zůstává mimo automatický produktový výběr, dokud není bezpečně definován přesun a práce pečující osoby"
    ],
    evidence: [
      { type: "merchant_product_page", url: "https://unizdrav.cz/zbozi/2085/toaletni-sprchovaci-vozik", checkedAt: "2026-10-07" }
    ],
    offers: []
  }
]);

const PRODUCT_INDEX = new Map(BATHROOM_PRODUCTS.map((product) => [product.id, product]));

export function getBathroomProducts(ids = []) {
  return ids
    .map((id) => PRODUCT_INDEX.get(id))
    .filter(isVerifiedProductionProduct);
}
