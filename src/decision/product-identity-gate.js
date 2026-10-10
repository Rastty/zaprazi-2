// ZP_RELEASE_0_8_97
/**
 * Every selectable product must satisfy both editorial approvals:
 * production eligibility AND separately verified exact identity.
 * Supporting dated evidence is required, not a replacement for actual verification.
 * This guard protects against accidentally flipping an unresolved/research record
 * to productionEligible in the catalog. No user answers are inspected or stored.
 */
export function isVerifiedProductionProduct(product) {
  return Boolean(
    product &&
    product.productionEligible === true &&
    product.identityStatus === "verified" &&
    typeof product.id === "string" &&
    product.id.trim() &&
    typeof product.name === "string" &&
    product.name.trim() &&
    Array.isArray(product.evidence) &&
    product.evidence.some(source =>
      source &&
      typeof source.url === "string" &&
      source.url.startsWith("https://") &&
      typeof source.checkedAt === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt)
    )
  );
}
