const DAY_MS = 24 * 60 * 60 * 1000;

// Reject impossible calendar days: JS otherwise normalizes February 30 into March.
const parseCalendarDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? date : null;
};

export const EVIDENCE_FRESHNESS_DAYS = Object.freeze({
  productTechnical: 365,
  merchantOffer: 30,
  rental: 30,
  reimbursementClaim: 31
});

export function evidenceAgeDays(checkedAt, now = new Date()) {
  const checked = parseCalendarDate(checkedAt);
  if (!checked) return null;
  const reference = now instanceof Date ? now : new Date(now);

  if (Number.isNaN(checked.getTime()) || Number.isNaN(reference.getTime())) {
    return null;
  }

  const diff = reference.getTime() - checked.getTime();
  if (diff < 0) {
    return null;
  }

  return Math.floor(diff / DAY_MS);
}

export function evidenceFreshness(checkedAt, maxAgeDays, now = new Date(), validThrough = null) {
  const ageDays = evidenceAgeDays(checkedAt, now);
  const reference = now instanceof Date ? now : new Date(now);

  if (ageDays === null || !Number.isFinite(maxAgeDays) || maxAgeDays < 0 || Number.isNaN(reference.getTime())) {
    return { status: "unknown", ageDays: null };
  }

  if (validThrough !== null) {
    const validityDate = parseCalendarDate(validThrough);
    const checkedDate = parseCalendarDate(checkedAt);
    // Inconsistent evidence must never justify a precise current claim.
    if (!validityDate || !checkedDate || validityDate < checkedDate) {
      return { status: "unknown", ageDays };
    }
    const expiresAt = new Date(validityDate.getTime() + DAY_MS - 1);

    if (reference.getTime() > expiresAt.getTime()) {
      return { status: "stale", ageDays };
    }
  }

  return {
    status: ageDays <= maxAgeDays ? "fresh" : "stale",
    ageDays
  };
}
