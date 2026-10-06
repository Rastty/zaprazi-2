import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../evidence/freshness.js";

const OFFICIAL_SUKL_LISTS_URL = "https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/";

export const MOBILITY_ACQUISITION = Object.freeze({
  "meyra-ideal-3061982": {
    reimbursement: {
      status: "verify_before_purchase",
      zpCode: "07-5005963",
      sourceType: "manufacturer_current_claim",
      sourceUrl: "https://www.meyra.cz/ctyrkolove-choditko-rollator.html",
      checkedAt: "2026-10-06",
      manufacturerClaim: {
        coverage: "full",
        retailPriceKc: 3408,
        reimbursementKc: 3408,
        copayKc: 0,
        revisionDoctorApproval: false,
        prescribers: [
          "praktický lékař",
          "geriatr",
          "chirurg",
          "rehabilitační lékař",
          "ortopedický protetik",
          "ortoped",
          "revmatolog",
          "neurolog"
        ]
      },
      officialVerification: {
        status: "current_exact_record_not_verified",
        sourceUrl: OFFICIAL_SUKL_LISTS_URL,
        amountKc: null,
        copayKc: null,
        validFor: null
      },
      userMessage: "Výrobce aktuálně uvádí plnou úhradu a kód ZP 07-5005963. Před nákupem ale ověřte aktuální záznam v Seznamu ZP a správný postup ePoukazu; ZaPrazi tím nepotvrzuje váš individuální nárok."
    },
    rental: {
      status: "verified_example_check_availability",
      providerId: "rehakomp-cz",
      providerName: "RehaKomp",
      url: "https://www.rehakomp.cz/venkovni-a-vnitrni-choditka-berle-hole/110-ctyrkolove-choditko-rollator.html",
      checkedAt: "2026-10-06",
      pricing: {
        perDayKc: 12,
        perMonthKc: 360,
        refundableDepositKc: 1000,
        minimumPickupKc: 250,
        minimumDeliveryKc: 500
      },
      note: "Půjčovna aktuálně uvádí Ideal Rollator k pronájmu. Před objednáním ověřte aktuální cenu, dostupnost a možnosti dopravy pro vaši lokalitu."
    }
  }
});

export function getAcquisitionEvidence(productIds = []) {
  return productIds
    .map((productId) => ({
      productId,
      evidence: MOBILITY_ACQUISITION[productId] || null
    }))
    .filter((item) => item.evidence);
}

export function getReimbursementGuidance(productIds = [], now = new Date()) {
  return getAcquisitionEvidence(productIds)
    .filter((item) => item.evidence.reimbursement)
    .map((item) => {
      const reimbursement = item.evidence.reimbursement;
      const freshness = evidenceFreshness(
        reimbursement.checkedAt,
        EVIDENCE_FRESHNESS_DAYS.reimbursementClaim,
        now
      );

      return {
        productId: item.productId,
        ...reimbursement,
        freshnessStatus: freshness.status,
        displayMessage: freshness.status === "fresh"
          ? reimbursement.userMessage
          : "Poslední tvrzení výrobce o úhradě je starší než 31 dní, proto ho ZaPrazi už neprezentuje jako aktuální. Ověřte současný stav v oficiálním seznamu SÚKL."
      };
    });
}

export function getRentalGuidance(productIds = [], now = new Date()) {
  return getAcquisitionEvidence(productIds)
    .filter((item) => item.evidence.rental)
    .map((item) => {
      const rental = item.evidence.rental;
      const freshness = evidenceFreshness(
        rental.checkedAt,
        EVIDENCE_FRESHNESS_DAYS.rental,
        now
      );

      return {
        productId: item.productId,
        ...rental,
        freshnessStatus: freshness.status,
        displayPricing: freshness.status === "fresh" ? rental.pricing : null
      };
    });
}
