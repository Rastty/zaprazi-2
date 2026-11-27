import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../evidence/freshness.js";

const OFFICIAL_SUKL_LISTS_URL = "https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/";
const OFFICIAL_SUKL_NOVEMBER_2026_PDF = "https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01973@SUKLAA/26D0TU21@SUKLAA/ZPSCAU_20261101.pdf";

const OFFICIAL_SUKL_DECEMBER_2026_PDF = "https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01BJW@SUKLAA/26D0VOL8@SUKLAA/ZPSCAU_20261201.pdf";
const DECEMBER_2026 = Object.freeze({
  checkedAt: "2026-11-27",
  sourceUrl: OFFICIAL_SUKL_DECEMBER_2026_PDF,
  officialVerification: Object.freeze({
    status: "verified_current_month",
    sourceUrl: OFFICIAL_SUKL_DECEMBER_2026_PDF,
    listsUrl: OFFICIAL_SUKL_LISTS_URL,
    suklCode: "5005963",
    reimbursementGroup: "07.03.02.03",
    amountKc: 3408,
    copayKc: null,
    validFor: "2026-12",
    validThrough: "2026-12-31",
    intervalMonths: 60,
    prescriberCodes: ["GER", "ORP", "NEU", "ORT", "PRL", "REH", "CHI", "REV"]
  }),
  userMessage: "Oficiální finální Seznam ZP SÚKL k 1. 12. 2026 (strana 11, kód 5005963) uvádí pro IDEAL ROLLATOR 3061982 úhradu 3 408 Kč platnou pro prosinec 2026. Individuální nárok ani konečný doplatek tím nejsou potvrzeny; před pořízením je stále potřeba splnit aktuální podmínky a správný postup ePoukazu."
});

function pragueDay(now) {
  const instant = now instanceof Date ? now : new Date(now);
  if (!Number.isFinite(instant.getTime())) return null;
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(instant).map(({type,value}) => [type,value]));
  return parts.year+"-"+parts.month+"-"+parts.day;
}

export const MOBILITY_ACQUISITION = Object.freeze({
  "meyra-ideal-3061982": {
    reimbursement: {
      status: "official_record_verified_check_conditions",
      zpCode: "07-5005963",
      sourceType: "official_sukl_monthly",
      sourceUrl: OFFICIAL_SUKL_NOVEMBER_2026_PDF,
      checkedAt: "2026-11-10",
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
        sourceUrl: OFFICIAL_SUKL_NOVEMBER_2026_PDF,
        listsUrl: OFFICIAL_SUKL_LISTS_URL,
        suklCode: "5005963",
        reimbursementGroup: "07.03.02.03",
        amountKc: 3408,
        copayKc: null,
        validFor: "2026-11",
        validThrough: "2026-11-30",
        intervalMonths: 60,
        prescriberCodes: ["GER", "ORP", "NEU", "ORT", "PRL", "REH", "CHI", "REV"]
      },
      userMessage: "Oficiální finální Seznam ZP SÚKL k 1. 11. 2026 (strana 10, kód 5005963) uvádí pro IDEAL ROLLATOR 3061982 úhradu 3 408 Kč platnou pro listopad 2026. Individuální nárok ani konečný doplatek tím nejsou potvrzeny; před pořízením je stále potřeba splnit aktuální podmínky a správný postup ePoukazu."
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
      const day = pragueDay(now);
      const base = item.evidence.reimbursement;
      // Keep November authoritative until the Prague calendar reaches December.
      // The final December list was published before its effective month.
      const reimbursement = item.productId === "meyra-ideal-3061982" && day && day >= "2026-12-01"
        ? { ...base, ...DECEMBER_2026 } : base;
      const official = reimbursement.officialVerification;
      const ageWindow = Math.max(EVIDENCE_FRESHNESS_DAYS.reimbursementClaim,
        (Date.parse(official.validThrough) - Date.parse(reimbursement.checkedAt)) / 86400000);
      const freshness = evidenceFreshness(reimbursement.checkedAt, ageWindow,
        day ? new Date(day+"T00:00:00Z") : new Date(NaN), official.validThrough);
      if (freshness.status === "fresh" && day?.slice(0,7) !== official.validFor)
        freshness.status = "stale";

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
