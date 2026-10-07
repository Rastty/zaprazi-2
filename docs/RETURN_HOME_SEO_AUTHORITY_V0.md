# Return-home SEO authority — v0

Checked: **2026-10-07**

## Goal

Strengthen `/navrat-z-nemocnice/` for the high-pressure search intent around **návrat z nemocnice domů** and **co zařídit po propuštění**, then route users into the existing commercial decision journeys.

## Why this page matters

A family preparing a discharge may need several categories at once: mobility support, bathroom/WC aids, a bed or a wheelchair. The return-home page should triage urgency and then send each need to the dedicated category engine rather than rank products itself.

## Existing planning logic remains authoritative

Reuse only:
- `src/return-home/engine.js`,
- `assets/js/return-home-advisor.js`.

Downstream suitability remains in:
- Mobility,
- Bathroom,
- Adjustable bed,
- Wheelchair.

## SEO / UX layer

Adds:
- stronger H1/title/meta around discharge preparation,
- five visible FAQs with exact FAQPage schema parity,
- prominent links into the four main product-category journeys,
- link to the compensatory-aids hub.

## Evidence

NZIP, `Domácí péče`: need for home health/nursing care should be discussed during discharge planning; a hospital physician can indicate it for 14 days after hospitalization.

## Safety / commercial boundary

The page does not collect diagnoses, surgery type, medication list or exact body weight. It does not introduce product ranking or override any downstream safety gate.
