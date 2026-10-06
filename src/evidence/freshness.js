const DAY_MS = 24 * 60 * 60 * 1000;

export const EVIDENCE_FRESHNESS_DAYS = Object.freeze({
  productTechnical: 365,
  merchantOffer: 30,
  rental: 30,
  reimbursementClaim: 31
});

export function evidenceAgeDays(checkedAt, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(checkedAt || ""))) {
    return null;
  }

  const checked = new Date(`${checkedAt}T00:00:00.000Z`);
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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(validThrough))) {
      return { status: "unknown", ageDays };
    }

    const expiresAt = new Date(`${validThrough}T23:59:59.999Z`);
    if (Number.isNaN(expiresAt.getTime())) {
      return { status: "unknown", ageDays };
    }

    if (reference.getTime() > expiresAt.getTime()) {
      return { status: "stale", ageDays };
    }
  }

  return {
    status: ageDays <= maxAgeDays ? "fresh" : "stale",
    ageDays
  };
}
