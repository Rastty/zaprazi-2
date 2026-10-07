# Bathroom SEO authority — v0

Checked: **2026-10-07**

## Goal

Strengthen the existing `/koupelna-a-wc/` page for broad Czech search intent around **pomůcky do koupelny pro seniory** while preserving the existing fail-closed Bathroom Advisor as the only suitability engine.

## Search-intent gap

Current Czech results for this head term are strongly catalog-led. Zápraží differentiates by resolving the actual job first: low WC, missing support, seated showering, nearby toilet, bath transfer or one combined chair.

## Existing decision logic remains authoritative

Reuse only:
- `src/bathroom/engine.js`,
- `src/bathroom/catalog.js`,
- `assets/js/bathroom-advisor.js`.

The narrow pages remain acquisition entrances, not parallel engines:
- `/nastavec-na-wc-pro-seniory/`
- `/sprchovaci-zidle-pro-seniory/`
- `/toaletni-zidle-pro-seniory/`
- `/madlo-k-wc-pro-seniory/`
- `/sedatko-do-vany-pro-seniory/`

## SEO / UX layer

Adds:
- head-term H1,
- dedicated title and meta description,
- five visible FAQs with exact FAQPage schema parity,
- prominent links to all five narrow decision entrances and the insurer guide.

## Safety / commercial boundary

The SEO layer does not bypass transfer, load, fit, floor or wall-fixing gates and does not alter product order, merchant selection or affiliate ranking.
