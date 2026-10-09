// ZP_RELEASE_0_8_66
/**
 * Stable, human-readable facts for the Bathroom/WC product family.
 * Keep exact catalog numbers: formatting must never calculate safety suitability.
 */
const FACT_LABELS = Object.freeze({
  heightIncreaseCm: ["Zvýšení sedu", "cm"],
  outerCm: ["Vnější rozměry", "cm"],
  openingCm: ["Rozměry otvoru", "cm"],
  widthCm: ["Šířka", "cm"],
  depthCm: ["Hloubka", "cm"],
  heightCm: ["Výška", "cm"],
  totalWidthCm: ["Celková šířka", "cm"],
  totalDepthCm: ["Celková hloubka", "cm"],
  totalHeightCm: ["Celková výška", "cm"],
  seatWidthCm: ["Šířka sedáku", "cm"],
  seatDepthCm: ["Hloubka sedáku", "cm"],
  seatHeightCm: ["Výška sedu", "cm"],
  seatCm: ["Rozměry sedáku", "cm"],
  bathInnerWidthCm: ["Vnitřní šířka vany", "cm"],
  wallDistanceCm: ["Vzdálenost od stěny", "cm"],
  maxUserWeightKg: ["Maximální nosnost", "kg"],
  weightKg: ["Hmotnost pomůcky", "kg"],
  lengthsCm: ["Dostupné délky", "cm"],
  fixingHoleSpacingCm: ["Rozteč montážních otvorů", "cm"],
  suppliedFixingScrews: ["Dodané šrouby", "ks"],
  totalCm: ["Celkové rozměry", "cm"]
});

export function formatBathroomFacts(facts = {}) {
  return Object.entries(facts)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      const entry = FACT_LABELS[key];
      // Never present an untranslated internal database property to readers.
      if (!entry) throw new Error("Unknown Bathroom fact label: " + key);
      const rendered = (Array.isArray(value) ? value.join(" / ") : String(value))
        .replace(/(\d)\.(\d)/g, "$1,$2");
      return entry[0] + ": " + rendered + " " + entry[1];
    });
}
