// ZP_RELEASE_0_8_100
import { isVerifiedProductionProduct } from "../decision/product-identity-gate.js";
export const MOBILITY_PRODUCTS = Object.freeze([
  {
    id: "besco-wa17",
    name: "BESCO WA17 – čtyřbodové skládací chodítko",
    solutionFamily: "fixed_walker",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      heightCm: "80–98",
      widthCm: 59,
      depthCm: 47,
      innerWidthCm: 43,
      foldedCm: "80 × 59 × 10",
      weightKg: 2.3,
      maxUserWeightKg: 110,
      wheels: 0
    },
    selectionNotes: [
      "čtyři pevné opěrné body",
      "při chůzi se celé chodítko mírně nadzvedává a posouvá",
      "vhodnost a nastavení výšky je podle návodu potřeba konzultovat s odborníkem"
    ],
    evidence: [
      {
        type: "instruction_manual",
        url: "https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_ctyrbodove.pdf",
        checkedAt: "2026-10-06"
      }
    ],
    offers: [
      {
        merchantId: "rehabilitacni-pomucky-cz",
        merchantName: "RehabilitačníPomůcky.cz",
        affiliateKey: "rehabilitacni-pomucky-cz:besco-wa17",
        url: "https://www.rehabilitacnipomucky.cz/besco-ctyrbodove-choditko-skladaci/",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        note: "Obchod uvádí, že nespolupracuje se zdravotními pojišťovnami a nákup je plně hrazen zákazníkem.",
        checkedAt: "2026-10-06"
      }
    ]
  },
  {
    id: "besco-wa21",
    name: "BESCO WA21 – dvoukolové skládací chodítko",
    solutionFamily: "front_wheel_walker",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      heightCm: "81–99",
      widthCm: 60,
      depthCm: 50,
      innerWidthCm: 43,
      weightKg: 2.8,
      maxUserWeightKg: 110,
      frontWheelDiameterCm: 12.5,
      wheels: 2
    },
    selectionNotes: [
      "dvě přední kolečka a dvě zadní nohy s protiskluzovými nástavci",
      "při nastavení musí být výška shodná na všech nohách",
      "vhodnost a nastavení výšky je podle návodu potřeba konzultovat s odborníkem"
    ],
    evidence: [
      {
        type: "instruction_manual",
        url: "https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_dvoukolove.pdf",
        checkedAt: "2026-10-06"
      }
    ],
    offers: [
      {
        merchantId: "rehabilitacni-pomucky-cz",
        merchantName: "RehabilitačníPomůcky.cz",
        affiliateKey: "rehabilitacni-pomucky-cz:besco-wa21",
        url: "https://www.rehabilitacnipomucky.cz/besco-dvoukolove-choditko-skladaci/",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        note: "Obchod uvádí, že nespolupracuje se zdravotními pojišťovnami a nákup je plně hrazen zákazníkem.",
        checkedAt: "2026-10-06"
      }
    ]
  },
  {
    id: "besco-wa78",
    name: "WA78 – čtyřkolové chodítko (identity conflict)",
    solutionFamily: "rollator",
    productionEligible: false,
    identityStatus: "conflict",
    identityNote: "Merchant listing calls the product BESCO WA78, while the linked instruction manual is branded REHABIQ. Keep out of production recommendations until exact OEM/variant identity is reconciled.",
    facts: {
      heightCm: "79–92",
      widthCm: 61,
      depthCm: 65,
      seatHeightCm: 54,
      seatCm: "45 × 25",
      weightKg: 7.8,
      maxUserWeightKg: 136,
      wheelDiameterCm: 19,
      wheels: 4,
      brakes: "two_locking_hand_brakes"
    },
    selectionNotes: [
      "linked manual states two locking hand brakes",
      "linked manual requires brakes to be locked when standing up, leaning on or sitting down",
      "linked manual states the walker is not intended to transport a seated user"
    ],
    evidence: [
      {
        type: "linked_instruction_manual_identity_conflict",
        url: "https://www.rehabilitacnipomucky.cz/user/documents/upload/Navody/Rehabiq_choditko_ctyrkolove_s_brasnou_wa78.pdf",
        checkedAt: "2026-10-06"
      },
      {
        type: "merchant_identity",
        url: "https://www.rehabilitacnipomucky.cz/besco-ctyrkolove-choditko-odlehcene-skladaci/",
        checkedAt: "2026-10-06"
      }
    ],
    offers: []
  },
  {
    id: "meyra-ideal-3061982",
    name: "MEYRA Ideal Rollator 3061982",
    solutionFamily: "rollator",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      heightCm: "79–97",
      widthCm: 61.5,
      maxUserWeightKg: 130,
      wheelCm: "19 × 5",
      suklCode: "07-5005963"
    },
    selectionNotes: [
      "výrobce uvádí použití v interiéru i exteriéru",
      "nastavitelná výška madel",
      "sedátko, podnos a košík",
      "uvedení SÚKL kódu neznamená automaticky potvrzený individuální nárok na úhradu",
      "u rozměrů, které se mezi oficiálním návodem a produktovou stránkou liší, ZaPrazi zatím přesnou hodnotu nezobrazuje"
    ],
    evidence: [
      {
        type: "manufacturer_manual",
        url: "https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/navod-k-pouziti-ideal-rollator.pdf",
        checkedAt: "2026-10-06"
      },
      {
        type: "manufacturer_product_page",
        url: "https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-ideal-rollator-/191",
        checkedAt: "2026-10-06"
      }
    ],
    offers: [
      {
        merchantId: "lekarna-cz",
        merchantName: "Lékárna.cz",
        affiliateKey: "lekarna-cz:meyra-ideal-3061982",
        url: "https://www.lekarna.cz/meyra-ideal-rollator-ctyrkolove-choditko/",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        note: "Lékárna.cz uvádí, že u tohoto nákupu nelze uplatnit poukaz na zdravotnické pomůcky a produkt je za plnou úhradu.",
        checkedAt: "2026-10-06"
      },
      {
        merchantId: "meyra-cz",
        merchantName: "MEYRA e-shop",
        url: "https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-ideal-rollator-/191",
        affiliateUrl: null,
        acquisitionMode: "merchant_page",
        note: "Aktuální možnost úhrady je nutné prověřit podle platného seznamu SÚKL a správného preskripčního postupu před nákupem.",
        checkedAt: "2026-10-06"
      }
    ]
  }
]);

const PRODUCT_INDEX = new Map(MOBILITY_PRODUCTS.map((product) => [product.id, product]));

export function getMobilityProducts(ids = []) {
  return ids
    .map((id) => PRODUCT_INDEX.get(id))
    .filter(isVerifiedProductionProduct);
}
