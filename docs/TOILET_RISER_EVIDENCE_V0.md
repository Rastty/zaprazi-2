# Nástavec na WC pro seniory — evidence v0

Checked: **2026-10-07**

## Search intent

Target cluster:
- nástavec na WC pro seniory
- zvýšený nástavec na WC
- nástavec na WC s madly
- nástavec na WC na pojišťovnu

Observed SERP:
- price-comparison/catalog pages,
- specialist medical-aid retailers,
- product detail pages,
- scattered reimbursement claims.

Zápraží differentiator:
- transfer first,
- fit and feet-on-floor check,
- plain riser vs riser-with-arms distinction,
- exact product identity,
- direct-pay vs insurer route kept separate.

## Exact candidate 1 — UNIZDRAV P2868

Source:
https://unizdrav.cz/zbozi/2868/zvysovac-wc-s-priklopem-unizdrav-15-cm

Existing production evidence:
- height increase: **15 cm**,
- outer dimensions: **36 × 40 cm**,
- opening: **21 × 26 cm**,
- weight: **1.5 kg**,
- max user weight: **100 kg**,
- fixed to a compatible bowl with side screws.

Use only when:
- transfer is independent,
- toilet fit is confirmed,
- load fit is confirmed,
- feet remain safely supported on the floor after raising.

## Exact candidate 2 — BESCO BES-BS15

Source:
https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/

Existing production evidence:
- height increase: **11.5 cm**,
- removable arm supports,
- weight: **3.26 kg**,
- max user weight: **100 kg**.

Use only when:
- the main issue is low seat + need for stable hand support,
- the person does not normally require physical lifting by another person,
- toilet fit is confirmed,
- load fit is confirmed,
- feet remain safely supported after raising.

## Insurance boundary

The high-intent page must not infer reimbursement from:
- product category name,
- merchant wording,
- visual similarity to a reimbursed aid.

Current production rule:
- retail candidates remain direct-pay candidates,
- reimbursement is verified separately against exact medical-device identity and current SÚKL evidence,
- users are routed to `/pomucky-do-koupelny-na-pojistovnu/` for the insurer workflow.

## Architecture

Page:
- `/nastavec-na-wc-pro-seniory/`

Reuses:
- `src/bathroom/engine.js`
- `src/bathroom/catalog.js`
- existing affiliate slots:
  - `unizdrav-cz:p2868`
  - `rehabilitacni-pomucky-cz:besco-bs15`

No second eligibility engine is introduced.

## Next checkpoint

After deployment:
- verify indexability/canonical,
- inspect Search Console impressions/query variants,
- compare completion rate for plain riser vs arms branch,
- only then consider a separate sprchovací-židle high-intent micro-page.
