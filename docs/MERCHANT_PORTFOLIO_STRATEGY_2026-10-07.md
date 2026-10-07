# Merchant portfolio strategy — 2026-10-07

## Purpose

Turn the approved affiliate portfolio into a merchant layer for ZaPrazi without letting commission influence recommendation ranking.

The merchant decision remains downstream from:
problem → solution type → product/category suitability → acquisition path → merchant offer.

## Approved portfolio

### 1. RehabilitačníPomůcky.cz — PRIMARY CORE

Role:
- anchor merchant for Mobility,
- likely strong merchant for Bathroom/WC, transfer and broader compensatory aids.

Program:
- 10% commission,
- 30-day cookie,
- CZ / SK / PL coverage,
- brand SEM prohibited.

Production:
- BESCO WA17 affiliate deeplink active,
- BESCO WA21 affiliate deeplink active.

Strategic use:
- prefer as a merchant offer where exact product identity and current stock are verified,
- do not treat direct retail as insurer reimbursement/redemption.

### 2. Lékárna.cz — PRIMARY SUPPORTING RETAIL

Role:
- broad trusted retail layer,
- current direct-pay merchant for MEYRA Ideal,
- useful supporting merchant where exact relevant product inventory exists.

Program:
- 6% first order,
- 4% lapsed customer according to the supplied program definition,
- 2% repeat purchase within the supplied repeat window,
- 0% selected excluded/benefit-payment transactions,
- 30-day cookie.

Production:
- MEYRA Ideal 3061982 affiliate deeplink active.

Strategic use:
- second-offer / retail route where product identity is verified,
- reimbursement remains a separate route.

### 3. UNIZDRAV — HIGHEST-PRIORITY EXPANSION MERCHANT

Role:
- strongest currently identified merchant for ZaPrazi expansion beyond the first Mobility slice.

Program:
- 4–8% commission,
- 14-day cookie,
- CZ / SK / HU / RO coverage.

Current public inventory evidence includes:
- raised toilet seats,
- toilet supports,
- shower chairs,
- shower/toilet wheelchairs,
- grab bars,
- electric patient lifts,
- positioning/adjustable beds,
- bedside aids,
- manual/electric wheelchairs,
- walking aids.

Strategic consequence:
- make UNIZDRAV the first merchant researched for Slice 2 Bathroom + WC,
- continue with Slice 3 Adjustable beds and Slice 4 Wheelchairs,
- reuse the same evidence/merchant-routing model rather than creating separate commerce logic.

Guardrail:
- commission range must not make UNIZDRAV rank above a more suitable product/merchant.

### 4. Dr.Max — SECONDARY RETAIL / TRUST MERCHANT

Role:
- broad consumer-health retailer,
- useful supporting offer for selected low/mid-ticket aids,
- likely useful for Bathroom/WC and post-hospital consumables/supporting products.

Program:
- 3–10% depending on eligible/private-brand rules,
- 30-day cookie,
- brand SEM prohibited,
- newsletter promotion requires prior approval according to supplied terms.

Current public evidence:
- active raised-WC-seat product exists.

Strategic use:
- verify exact products before adding,
- treat partner-supplied marketplace stock carefully,
- use as complementary merchant rather than the core decision engine merchant.

### 5. RehaVita.cz — LATER ADL / RETURN-FROM-HOSPITAL SUPPORT

Approval:
- user-confirmed approved advertiser on 2026-10-07.

Role:
- not a Bathroom/WC anchor,
- promising merchant for daily-living/self-care aids and later return-from-hospital support.

Current public inventory evidence:
- dedicated "Pomůcky pro soběstačnost" category currently exposes 6 products focused on eating, drinking, opening and one-hand use,
- current examples include UpCup, Beat It, Theomatik and Open-It,
- antidecubitus category currently exposes one seating cushion,
- no verified toilet/shower product depth that would justify displacing UNIZDRAV in Slice 2.

Public direct-affiliate page:
- advertises commission up to 3%,
- says orders within 1 month of click are eligible,
- monthly payout after reaching CZK 300.

Caveat:
- these are public direct-program terms and must not be assumed to be identical to the user's approved network campaign unless the advertiser dashboard confirms them.

Strategic use:
- keep out of Bathroom/WC v1 recommendation ranking,
- research first for a later ADL / return-from-hospital micro-slice,
- good candidates are one-hand eating/drinking/opening aids where product suitability can be defined with practical, non-diagnostic questions.

### 6. Zdravá Obuv Štěpánková & C. — LATER NICHE

Role:
- possible later decision vertical around easier footwear, swollen/wide feet, fastening and practical daily mobility.

Program:
- 1.5–7% commission.

Current public inventory:
- broad specialist footwear assortment,
- categories for swollen/wide/problematic feet,
- adjustable / easy-fastening models,
- substantial specialist inventory.

Decision:
- do not pull this into Slice 1–4 merely because the program is approved,
- keep for a later evidence-led “safe/easy footwear” problem slice,
- avoid medical suitability claims; recommendations should be parameter-based.

## Merchant priority by slice

| Slice | Primary merchant | Supporting merchants |
| --- | --- | --- |
| Mobility | RehabilitačníPomůcky.cz | Lékárna.cz, UNIZDRAV after product-level verification |
| Bathroom + WC | UNIZDRAV | RehabilitačníPomůcky.cz, Dr.Max |
| Adjustable beds | UNIZDRAV | additional rental/specialist providers to research |
| Wheelchairs | UNIZDRAV | RehabilitačníPomůcky.cz / specialist merchants after verification |
| Return from hospital | multi-merchant | UNIZDRAV, Dr.Max, RehaVita.cz, RehabilitačníPomůcky.cz, Lékárna.cz |
| ADL / daily self-care | RehaVita.cz candidate | other merchants after evidence review |
| Easy/specialist footwear | Zdravá Obuv | later research |

## Next merchant work

1. Build a product-level candidate pack for Bathroom + WC.
2. Prioritize 5–10 solution types, not 100 products.
3. For each solution type verify:
   - exact product identity,
   - dimensions / load / fit parameters relevant to the decision,
   - availability and checked date,
   - merchant route,
   - affiliate deeplink only after the product qualifies.
4. Then repeat for adjustable beds.
5. Keep RehaVita out of Bathroom/WC v1 unless exact relevant stock changes; research it later for ADL / return-from-hospital.
6. Do not expose new merchants in production until the recommendation/evidence layer is ready.

## Current production monetization

Mobility v1 affiliate routing is active for all 3 exact production slots:
- RehabilitačníPomůcky.cz — BESCO WA17,
- RehabilitačníPomůcky.cz — BESCO WA21,
- Lékárna.cz — MEYRA Ideal 3061982.

Affiliate URLs only replace the final outbound destination. They do not alter recommendation order.
