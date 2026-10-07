# Slice 3 — Adjustable bed evidence v0

Checked: **2026-10-07**

## Goal

Build the first high-ticket ZaPrazi slice around a practical question:

**Do we need to buy an adjustable bed, rent one, or first check reimbursement / insurer circulation?**

This slice is not a diagnosis engine. It only separates practical home-care scenarios and exact product constraints.

## Official acquisition evidence

### VZP

VZP's guidance, updated 2024-01-10, states that an adjustable bed for home care can be prescribed and reimbursed when the applicable conditions are met.

Operationally important points from VZP:
- prescription by listed medical specialties including practical doctor,
- prior insurer approval,
- maximum frequency described as once per 10 years,
- beds may be supplied in a circulation regime owned by the insurer and loaned to the insured person,
- a refurbished bed may therefore be supplied instead of a new one,
- transport to the home is not automatically reimbursed.

Source:
- https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/jake-jsou-podminky-predepsani-a-uhrady-polohovaciho-luzka

ZaPrazi guardrail:
- explain the route,
- do not decide individual eligibility,
- do not equate a retail bed with a reimbursed bed without exact SÚKL identity.

### SÚKL

The authoritative product-level source remains the monthly Seznam ZP.

Source:
- https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/

## Rental evidence

Current Czech rental examples show that electric adjustable beds are a real alternative for temporary or uncertain-duration needs.

Examples:
- Charita Studénka: electric adjustable bed 25 Kč/day or 750 Kč/month, refundable deposit 2,000 Kč.
- Charita sv. Martina: electric adjustable bed 900 Kč/month; transport including assembly 500 Kč.
- Charita Třebíč: electric adjustable bed with mattress/accessories 40 Kč/day + 130 Kč one-time fee.

Sources:
- https://studenka.charita.cz/jak-pomahame/pujcovna-kompenzacnich-pomucek/
- https://www.svmartin.charita.cz/jak-pomahame/pujcovna-kompenzacnich-a-zdravotnickych-pomucek/
- https://trebic.charita.cz/nase-sluzby/domaci-zdravotni-pece-trebic/pujcovani-pomucek/

Rental caveat:
- these are local services, not nationwide guarantees,
- availability, transport and assembly vary by provider.

## Exact retail candidates

### UNIZDRAV P2777 — CLASSIC

Role: **standard home candidate**

Verified:
- electric back, leg and height adjustment,
- sleeping surface 90 × 200 cm,
- outer dimensions 102.5 × 212 cm,
- height 38.6–80.6 cm,
- max patient weight 178 kg,
- safe working load 215 kg,
- side rails and lifting pole,
- mattress not included.

Source:
- https://unizdrav.cz/zbozi/2777/elektricka-polohovaci-postel-classic

### UNIZDRAV P4707 — Hospital

Role: **robust / higher-load candidate**

Verified:
- outer dimensions 105 × 214 cm,
- sleeping surface 90 × 196 cm,
- height 40–70 cm,
- back up to 70°,
- legs up to 30°,
- load 250 kg,
- side rails,
- central brake,
- mattress not included.

Source:
- https://unizdrav.cz/zbozi/4707/elektricka-polohovaci-postel-hospital

### UNIZDRAV P4044 — Multibed

Role: **advanced in-bed care candidate**

Verified:
- sleeping surface 90 × 200 cm,
- outer dimensions 96 × 212 cm,
- height 50–70 cm,
- back up to 80°,
- leg section +25° to -65°,
- lateral turning up to 45°,
- load 260 kg,
- mattress included,
- side rails and lifting pole,
- in-bed toilet opening and hair-washing accessories.

Source:
- https://unizdrav.cz/zbozi/4044/elektricka-polohovaci-postel-s-matraci-multibed

## Decision model v0

Practical primary need:
1. standard electric positioning at home,
2. height adjustment mainly to make caregiving easier,
3. robust / higher-load bed,
4. advanced in-bed care functions.

Mandatory product gates:
- load fit,
- room / installation-space fit.

Transfer ability is collected only as a practical caution:
- independent,
- steadying,
- physical assistance,
- mostly in bed,
- unknown.

A bed recommendation must not imply that the bed alone solves a physical-transfer problem.

## Acquisition rules

### Short-term
Prefer:
1. local rental comparison,
2. reimbursement / insurer-circulation check,
3. purchase only if it remains the better practical option.

### Long-term
Prefer:
1. reimbursement / insurer-circulation check,
2. compare purchase and service/logistics,
3. local rental only where it remains economically/practically sensible.

## Affiliate

UNIZDRAV is an approved advertiser.

Prepare exact runtime slots only after the Slice 3 UI is ready:
- `unizdrav-cz:p2777`
- `unizdrav-cz:p4707`
- `unizdrav-cz:p4044`

Do not fabricate deeplinks.
Canonical merchant URLs are the safe fallback.
