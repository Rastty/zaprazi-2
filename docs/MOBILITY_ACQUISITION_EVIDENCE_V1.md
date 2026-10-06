# Mobility acquisition evidence v1

Checked: **2026-10-06**

## Why this layer exists

ZaPrazi must distinguish:
- a product being technically relevant,
- a normal retail offer,
- a rental option,
- a reimbursement claim,
- an officially verified current reimbursement record.

These are separate facts and must not be collapsed into one "buy" CTA.

## MEYRA Ideal Rollator 3061982

Manufacturer current claim:
- ZP code: **07-5005963**
- manufacturer states full reimbursement,
- manufacturer states no revision-doctor approval,
- manufacturer lists eligible prescribing specialties.

Source:
https://www.meyra.cz/ctyrkolove-choditko-rollator.html

Boundary:
This is a current manufacturer claim, not an individual entitlement decision and not a substitute for the current monthly SÚKL record.

ZaPrazi therefore does **not** display an exact reimbursement amount as official until the exact current record is independently verified in the valid monthly SÚKL list.

Official list landing page:
https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/

## Rental example

RehaKomp currently lists an Ideal Rollator rental:
- 12 Kč/day,
- 360 Kč/month,
- refundable deposit 1000 Kč,
- minimum 250 Kč pickup / 500 Kč delivery.

Source:
https://www.rehakomp.cz/venkovni-a-vnitrni-choditka-berle-hole/110-ctyrkolove-choditko-rollator.html

This is shown as a **verified rental example with availability check**, not as nationwide guaranteed availability.

## Code safety gate

Any future exact reimbursement amount or copay in production data must include:
1. source type `official_sukl_monthly`,
2. exact official source URL,
3. validity period,
4. checked date.

Otherwise the test suite fails closed.
