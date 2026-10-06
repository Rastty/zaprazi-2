# Legacy overlap review v1

Checked: **2026-10-06**

## Decision

Do **not** broadly reuse legacy health/bathroom/bed content as ZaPrazi 2.0 content.

The old corpus was inspected with authenticated read-only WordPress data.

### REPURPOSE_REVIEW
- `/stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu/` (ID 3638)
  - real home/senior safety overlap,
  - but legacy hotel/restaurant affiliate CTA and weak generic evidence,
  - only worth reusing after traffic/backlink review and a complete rewrite.

### MERGE_REVIEW for future Adjustable Bed slice
- `/jak-vybrat-postel/` (ID 113)
- `/skvele-tipy-pro-vyber-nove-postele/` (ID 817)

Reason:
- generic bed/sleep-buying intent,
- not current home-care or adjustable-bed intent,
- old commercial links,
- may provide URL equity only if GSC/backlinks justify preserving/merging.

### KEEP_AS_LEGACY / NOT A NEW-SLICE SOURCE
- `/designovy-nabytek-jako-soucast-bezbarierovych-zdravotnickych-zarizeni/` (ID 4181)
- `/bezpecny-zdravotnicky-nabytek-pro-prevenci-urazu/` (ID 3620)

Reason:
Institutional medical-furniture intent is materially different from making a private home safer.

### DO NOT REPURPOSE TO SAFE BATHROOM
- ID 3153 — luxury bathroom cleaning,
- ID 3175 — bathroom minimalism/organization,
- ID 3195 — bathroom hygiene/cleaning.

Reason:
Search intent is maintenance/cleaning, not accessibility or fall-risk reduction.

## Guardrail

These are review labels, not redirect/delete authorization.

No URL should be merged, removed, noindexed or redirected solely from semantic review without traffic/backlink evidence.
