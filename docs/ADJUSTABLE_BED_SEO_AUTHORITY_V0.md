# Adjustable bed SEO authority — v0

Checked: **2026-10-07**

## Goal

Strengthen the existing `/polohovaci-postel/` page for broad Czech search intent around **polohovací postel pro seniory** while preserving the existing fail-closed Bed Advisor as the only suitability engine.

## Search-intent gap

Current Czech results are dominated by product/category pages that move quickly into a purchase decision. Zápraží should differentiate by resolving practical fit first: purpose, transfer, load, room/transport fit and acquisition path.

## Existing decision logic remains authoritative

Reuse only:
- `src/adjustable-bed/engine.js`,
- `src/adjustable-bed/catalog.js`,
- `assets/js/bed-advisor.js`.

No parallel decision engine is introduced.

## SEO / UX layer

Adds:
- head-term H1 for `polohovací postel pro seniory`,
- dedicated title and meta description,
- five visible FAQs with exact FAQPage schema parity,
- links to:
  - `/polohovaci-postel-na-pojistovnu/`,
  - `/bezpecny-byt-pro-seniora/`,
  - `/navrat-z-nemocnice/`.

## Safety / commercial boundary

The SEO layer must never bypass load or space gates, does not add diagnosis inputs and does not alter affiliate ranking or product order.
