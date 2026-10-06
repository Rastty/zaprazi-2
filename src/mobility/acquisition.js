import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../evidence/freshness.js";

const OFFICIAL_SUKL_LISTS_URL = "https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/";
const OFFICIAL_SUKL_OCTOBER_2026_PDF = "https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V018PP@SUKLAA/26D0TRRB@SUKLAA/ZPSCAU_20261001.pdf";

export const MOBILITY_ACQUISITION = Object.freeze({
  "meyra-ideal-3061982": {
    reimbursement: {
      status: "official_record_verified_check_conditions",
      zpCode: "07-5005963",
      sourceType: "official_sukl_monthly",
      sourceUrl: OFFICIAL_SUKL_OCTOBER_2026_PDF,
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
        status: "verified_current_month",
        sourceUrl: OFFICIAL_SUKL_OCTOBER_2026_PDF,
        listsUrl: OFFICIAL_SUKL_LISTS_URL,
        suklCode: "5005963",
        reimbursementGroup: "07.03.02.03",
        amountKc: 3408,
        copayKc: null,
        validFor: "2026-10",
        validThrough: "2026-10-31",
        intervalMonths: 60,
        prescriberCodes: ["GER", "ORP", "NEU", "ORT", "PRL", "REH", "CHI", "REV"]
      },
      userMessage: "Aktuální oficiální Seznam ZP SÚKL k 1. 10. 2026 uvádí pro IDEAL ROLLATOR 3061982 úhradu 3 408 Kč. Individuální nárok ani konečný doplatek tím nejsou potvrzeny; před pořízením je stále potřeba splnit aktuální podmínky a správný postup ePoukazu."
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
        now,
        reimbursement.officialVerification.validThrough
      );

      return {
        productId: item.productId,
        ...reimbursement,
        freshnessStatus: freshness.status,
        displayAmountKc: freshness.status === "fresh"
          ? reimbursement.officialVerification.amountKc
          : null,
        displayMessage: freshness.status === "fresh"
          ? reimbursement.userMessage
          : "Měsíční záznam SÚKL, který má ZaPrazi ověřený, už není platný pro aktuální měsíc. Ověřte současný stav v aktuálním Seznamu ZP SÚKL."
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
