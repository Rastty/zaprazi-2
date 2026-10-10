// ZP_RELEASE_0_8_98
import { isVerifiedProductionProduct } from "../decision/product-identity-gate.js";
export const WHEELCHAIR_PRODUCTS = Object.freeze([
  {
    id: "unizdrav-p4384",
    name: "UNIZDRAV P4384 – invalidní vozík Basic",
    solutionFamily: "manual_companion_transport",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      outerSizeCm: "100 × 65 × 89",
      foldedSizeCm: "100 × 40 × 89.5",
      seatWidthCm: 48,
      seatHeightCm: 43,
      maxUserWeightKg: 100,
      chairWeightKg: 18.4,
      rearWheelCm: 60
    },
    selectionNotes: [
      "praktický základní kandidát hlavně pro krátké přesuny s doprovodem",
      "před výběrem ověřte šířku sedu 48 cm, nosnost 100 kg a průchod pro celkovou šířku 65 cm",
      "skládací rám usnadňuje skladování a převoz autem",
      "vozík sám o sobě neřeší bezpečný přesun člověka na sedák a zpět"
    ],
    evidence: [
      {
        type: "merchant_product_page",
        url: "https://unizdrav.cz/zbozi/4384/invalidni-vozik-unizdrav-basic",
        checkedAt: "2026-10-07"
      }
    ],
    offers: [
      {
        merchantId: "unizdrav-cz",
        merchantName: "UNIZDRAV",
        affiliateKey: "unizdrav-cz:p4384",
        url: "https://unizdrav.cz/zbozi/4384/invalidni-vozik-unizdrav-basic",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  },
  {
    id: "unizdrav-p3641",
    name: "UNIZDRAV P3641 – odlehčený mechanický vozík s brzdami pro doprovod",
    solutionFamily: "manual_self_or_companion",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      totalWidthCm: "68 nebo 70",
      foldedSizeCm: "30 × 80 × 83",
      seatWidthCm: "48 nebo 51",
      totalLengthCm: 107,
      seatHeightCm: 50,
      chairWeightKg: "17–17.5",
      maxUserWeightKg: "125 kg s pneumatickými / 136 kg s bezdušovými koly",
      companionBrakes: true,
      selfPropulsionRims: true
    },
    selectionNotes: [
      "zadní kola mají hnací obruče pro samostatný pohyb uživatele a současně brzdy pro doprovod",
      "před výběrem je nutné ověřit šířku sedu 48 nebo 51 cm a celkovou šířku 68 nebo 70 cm",
      "pneumatická (nafukovací) kola: nosnost 125 kg; bezdušová kola: nosnost 136 kg; před nákupem ověřte přesné provedení",
      "odlehčená konstrukce a rychloupínací kola usnadňují převoz, ale vozík stále váží přibližně 17 kg"
    ],
    evidence: [
      {
        type: "merchant_product_page",
        url: "https://unizdrav.cz/zbozi/3641/invalidni-vozik-odlehceny-s-brzdami-pro-doprovod",
        checkedAt: "2026-10-07"
      }
    ],
    offers: [
      {
        merchantId: "unizdrav-cz",
        merchantName: "UNIZDRAV",
        affiliateKey: "unizdrav-cz:p3641",
        url: "https://unizdrav.cz/zbozi/3641/invalidni-vozik-odlehceny-s-brzdami-pro-doprovod",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  },
  {
    id: "unizdrav-p2961",
    name: "UNIZDRAV P2961 – elektrický invalidní vozík, sed 46 cm",
    solutionFamily: "powered_joystick",
    productionEligible: true,
    identityStatus: "verified",
    facts: {
      seatWidthCm: 46,
      seatDepthCm: 40,
      totalWidthCm: 63,
      foldedWidthCm: 42,
      totalLengthCm: 115,
      seatHeightCm: 50,
      chairWeightWithoutBatteryKg: 38,
      chairWeightWithBatteryKg: 62,
      maxUserWeightKg: 135,
      maxSpeedKmh: 6,
      safeSlopeDeg: 6,
      maxSlopeDeg: 12,
      turningRadiusCm: 86.5,
      rangeKm: 32,
      obstacleHeightCm: 5
    },
    selectionNotes: [
      "elektrický kandidát vyžaduje bezpečné ovládání joysticku, možnost nabíjení a dostatek prostoru pro otáčení",
      "před výběrem ověřte šířku sedu 46 cm, nosnost 135 kg a celkovou šířku 63 cm",
      "celková hmotnost s baterií je 62 kg; to je zásadní pro převoz autem nebo přenášení",
      "běžně uváděný dojezd a sklon nejsou náhradou za posouzení konkrétní trasy a povrchu"
    ],
    evidence: [
      {
        type: "merchant_product_page",
        url: "https://unizdrav.cz/zbozi/2961/elektricky-invalidni-vozik-46-cm",
        checkedAt: "2026-10-07"
      }
    ],
    offers: [
      {
        merchantId: "unizdrav-cz",
        merchantName: "UNIZDRAV",
        affiliateKey: "unizdrav-cz:p2961",
        url: "https://unizdrav.cz/zbozi/2961/elektricky-invalidni-vozik-46-cm",
        affiliateUrl: null,
        acquisitionMode: "direct_pay",
        checkedAt: "2026-10-07"
      }
    ]
  }
]);

export function getWheelchairProducts(ids = []) {
  const wanted = new Set(ids);
  return WHEELCHAIR_PRODUCTS.filter((item) => wanted.has(item.id) && isVerifiedProductionProduct(item));
}
