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

Current manufacturer claim:
- ZP code: **07-5005963**,
- full reimbursement,
- no revision-doctor approval,
- eligible prescribing specialties are listed,
- current manufacturer page shows retail price **3 408 Kč**, reimbursement **3 408 Kč**, copay **0 Kč**.

Source:
https://www.meyra.cz/ctyrkolove-choditko-rollator.html

### Verification boundary

The SÚKL official list page confirms that the published Seznam ZP contains reimbursed devices, maximum prices and reimbursement conditions and is valid for the following calendar month.

Official list landing page:
https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/

The current ISZP list is JavaScript-driven and the exact official monthly row for code 07-5005963 was not independently retrieved in this research pass.

Therefore:
- the 3 408 / 3 408 / 0 figures remain **manufacturer-current-claim data**,
- ZaPrazi must not label them as an official current SÚKL amount,
- exact official amount/coplay remains hidden in production until the current monthly row is verified directly.

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

Any future exact reimbursement amount or copay presented as official production data must include:
1. source type `official_sukl_monthly`,
2. exact official source URL,
3. validity period,
4. checked date.

Otherwise the test suite fails closed.
