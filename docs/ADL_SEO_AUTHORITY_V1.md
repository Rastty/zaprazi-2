# Self-care SEO authority — v1

Checked: **2026-10-07**

## Goal

Strengthen `/sobestacnost/` for the broader search intent around **pomůcky pro sebeobsluhu seniorů** without creating a second selection engine.

## Search landscape

Current Czech results are dominated by product-category pages and comparison listings. Zápraží differentiates by starting from a concrete task and only then showing a verified candidate.

## Existing decision logic remains authoritative

Reuse only:
- `src/adl/engine.js`,
- `assets/js/adl-advisor.js`.

Verified RehaVita candidates remain unchanged:
- UpCup 15-050101,
- Beat It 15-050102,
- Theomatik 15-050103,
- MVS Open-It 15-050105.

## SEO / UX layer

Adds:
- H1 covering self-care and independence,
- title/meta for the broader **pomůcky pro sebeobsluhu seniorů** cluster,
- fifth visible FAQ with exact FAQPage schema parity,
- links to the compensatory-aids and footwear journeys.

## Safety / commercial boundary

No diagnosis-first routing, medication advice, product reordering or merchant reordering is introduced. Swallowing/choking remains outside shopping-first recommendations.
