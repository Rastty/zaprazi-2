# P0 Mobility: first decision directly after walker-hub hero (0.8.220)

## Observed problem and bounded change

On `/choditka-pro-seniory/`, the practical indoor/outdoor/support-choice module
was previously below the lengthy cane/crutch/walker education section. A reader
arriving for a walker choice had to scroll past that section, or notice a jump
link, before reaching the relevant decision.

Release 0.8.220 moves the **existing** `#vyber-typu` module immediately after
the hero, retains the safety stop before any CTA, makes its two advisor links
prominent, and leaves the complete `#hul-nebo-choditko` education, references,
commercial safety gates, canonical URL, existing anchors and source claims intact.
No new page, SKU, medical judgment, affiliate destination, cookie, or telemetry
is added. The current four consent-gated tracked hub actions are unchanged.

## Acceptance and observation

1. `node --test tests/mobility-support-comparison.test.js tests/walker-hub-first-decision-207.test.js tests/editorial-to-advisor-funnel.test.js` must pass.
2. Full theme CI, release-integrity, exact-head checks and predeploy QA must
   pass before merge; owner WordPress Pull + Deploy is separate from GitHub.
3. On the exact live `0.8.220`, verify the first module after the hero is the
   three-path decision; test direct indoor, rollator and safety routes on desktop
   and mobile. Confirm `#hul-nebo-choditko` and `#vyber-typu` still resolve,
   blocked advice still offers no merchant links, and privacy checks remain green.
4. Compare 28-day final GSC *page-level* clicks/impressions for the one canonical
   URL before and 14/30 days after publication, using the existing Core
   read-only GSC snapshot. Query-level gaps are **UNKNOWN**, not zero. Review
   privacy-safe GA4 advisor-start/completion aggregates if available; no claim
   of attribution or uplift from low samples. Decide keep/adjust/revert.

This is a navigation and comprehension hypothesis, **not an SEO uplift claim**.
Prometheus Core already owns shared GSC acquisition; do not create a separate
Zápraží measurement worker for this experiment.

## Follow-up release 0.8.228 — first-screen compactness

The existing walker hub still had a tall introduction ahead of the first
clickable Advisor action: the 10ch global headline constraint combined with
secondary context paragraphs, then the mandatory safety warning. This local
layout update removes the 10ch restriction **only on the walker hub**, reduces
hero spacing, keeps the safety warning directly before the primary action and
moves the nonurgent reluctance guide below the existing three Advisor routes.
The illustration, decision cards, content, canonical URL, original anchors,
tracking hooks, product rules and affiliate destinations remain unchanged.

Baseline: the completed 28-day GSC snapshot (15 Oct–11 Nov, evidence in
`docs/GSC_GROWTH_EVIDENCE_2026-11-15.md`) does **not** establish a page-filtered
query cohort for this URL; Google Inspection last reported `discovered_not_indexed`
without a demonstrated first crawl. Neither live 200 + sitemap presence nor
this layout edit proves indexation. On the exact live 0.8.228 after owner deploy:

1. Verify the new hero on desktop and mobile: headline is not constrained to
   10ch; safety warning and first Advisor button come before contextual links.
2. Confirm the three Advisor routes, `#vyber-typu`, `#hul-nebo-choditko`, fit
   safety, privacy and 25/25 merchant-slot readiness still work.
3. Recheck the GSC index status and final 28-day impressions/clicks after 14
   and 30 days; compare only like-for-like periods, report UNKNOWN where absent.
4. If a real accessibility or navigation regression appears, revert this scoped
   layout independently of the Advisor rules or historical archive.
