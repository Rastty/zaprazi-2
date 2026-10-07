# Sedátko do vany / bath transfer — evidence v0

Checked: **2026-10-07**

## Search intent

Target cluster:
- sedátko do vany pro seniory
- sedačka na vanu s madlem
- transferová lavice přes vanu
- židle do vany pro seniory

Observed SERP is mainly product-led. Zápraží differentiates by deciding **seat-over-bath vs transfer bench** from transfer ability and exact fit.

## Exact candidate 1 — BESCO BES-BS008

Source:
https://www.rehabilitacnipomucky.cz/besco-sedacka-na-vanu-s-madlem/

Existing verified production facts:
- seat: **69 × 31 cm**
- compatible bath inner width: **41–65 cm**
- max user weight: **100 kg**
- fixed with four adjustable expansion legs.

Use only when:
- transfer is fully independent,
- user can sit and move both legs over the bath edge without physical help,
- bath inner width and secure fixing are confirmed,
- load fit is confirmed.

## Exact candidate 2 — UNIZDRAV P2203

Source:
https://unizdrav.cz/zbozi/2203/sprchovaci-zidle-do-vany

Rechecked 2026-10-07:
- listed price: **2 118 Kč**
- merchant showed **Skladem >10 ks**
- total footprint: **81 × 61 cm**
- seat: **68 × 41 cm**
- seat height: **45.5–56 cm**
- max user weight: **110 kg**
- product weight: **4.4 kg**
- one side stands inside the bath, the other on the floor outside.

Use when:
- classic seat-over-bath does not fit,
- transfer remains independent,
- stable placement of all legs is possible,
- full 81 × 61 cm footprint and transfer space are available,
- load fit is confirmed.

## Safety boundary

No automatic candidate when:
- physical person-assist is required,
- leg transfer over the bath edge is not independent,
- load fit is unverified or insufficient,
- neither exact installation path fits the bath / room.

## Architecture

Page:
- `/sedatko-do-vany-pro-seniory/`

Reuses:
- `src/bathroom/engine.js` with `primaryNeed = bath_transfer`
- `src/bathroom/catalog.js`
- existing affiliate slots:
  - `rehabilitacni-pomucky-cz:besco-bs008`
  - `unizdrav-cz:p2203`

No parallel suitability engine.

## Next checkpoint

After deployment:
- verify both candidate paths,
- verify no merchant CTA on professional-check / needs-more-info states,
- inspect Search Console before adding more Bathroom micro-pages.
