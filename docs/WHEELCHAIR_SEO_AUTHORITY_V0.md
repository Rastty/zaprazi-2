# Wheelchair SEO authority — v0

Checked: **2026-10-07**

## Goal

Strengthen the existing `/invalidni-vozik/` page for broad Czech search intent around **invalidní vozík pro seniory** while preserving the existing fail-closed Wheelchair Advisor as the only suitability engine.

This is an authority and internal-linking layer, not a new product-selection system.

## Search-intent coverage

The page now answers the broad questions a family typically needs before shopping:
1. who will normally propel the wheelchair,
2. mechanical vs. powered wheelchair,
3. seat width and total-width fit,
4. rental vs. insurer vs. direct purchase,
5. when an exact product must not be recommended.

## Existing decision logic remains authoritative

The page continues to reuse:
- `src/wheelchair/engine.js`,
- `src/wheelchair/catalog.js`,
- `assets/js/wheelchair-advisor.js`.

No parallel rule engine is introduced.

Production candidates remain:
- UNIZDRAV P4384 — companion/manual transport,
- UNIZDRAV P3641 — self-propelled or mixed manual,
- UNIZDRAV P2961 — powered joystick candidate.

## Safety gates

Unchanged:
- seat fit must be confirmed,
- route/door width fit must be confirmed,
- load fit must be confirmed,
- person-assisted transfer does not produce an automatic exact product,
- powered branch requires safe joystick use and charging readiness.

## SEO / UX layer

Adds:
- head-term H1 for `invalidní vozík pro seniory`,
- dedicated title and meta description,
- five visible FAQs with exact FAQPage schema parity,
- links to:
  - `/invalidni-vozik-na-pojistovnu/`,
  - `/bezpecny-byt-pro-seniora/`,
  - `/kompenzacni-pomucky-pro-seniory/`.

## Commercial boundary

Affiliate slots, product order and acquisition logic are unchanged. The SEO layer must never cause a retail CTA to bypass an existing fit or safety gate.
