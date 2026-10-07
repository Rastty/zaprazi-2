# Bathroom + WC acquisition evidence v0

Checked: **2026-10-07**

## Purpose

Separate three different ways of obtaining a Bathroom/WC aid:

1. direct purchase,
2. local rental,
3. check whether a clinically appropriate reimbursed alternative exists.

The recommendation engine must never equate "affiliate product exists" with "this exact product is reimbursed".

## 1. Reimbursement source of truth

SÚKL publishes the official **Seznam zdravotnických prostředků hrazených na základě předepsání na poukaz**.

Operational rules:
- the list includes reimbursed devices, reimbursement amounts and conditions,
- SÚKL publishes the regular list on the 24th day of the month for the following calendar month,
- corrected lists may change the effective state,
- exact product identity / SÚKL code and the effective monthly list must therefore be checked before displaying a product-specific reimbursement claim.

Sources:
- https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/
- https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/seznamy-zp-doplnujici-informace/
- https://sukl.gov.cz/zdravotnicke-prostredky/seznamy-zdravotnickych-prostredku/platnost-a-ucinnost-seznamu-vsech-zdravotnickych-prostredku-hrazenych-na-zaklade-predepsani-na-poukaz/

### Current category evidence

The current reimbursement system includes relevant Bathroom/WC categories and individual reimbursed devices. This means "check a reimbursed alternative" is a valid acquisition path.

It does **not** mean the current UNIZDRAV shortlist is reimbursed.

Production wording:
- acceptable: **Prověřit hrazenou alternativu**
- unacceptable without exact identity proof: **Tento produkt hradí pojišťovna**

## 2. Current VZP guidance

VZP's page processed on **2026-09-29** describes reimbursement rules for aids for people with serious mobility limitations.

It specifically lists a compensation-function group that includes:
- bath / shower seats,
- shower chairs,
- shower wheelchairs,
- toilet chairs,
- toilet wheelchairs,
- combined toilet/shower chairs.

VZP states that, for this group, reimbursement depends on the defined eligibility conditions and insurer approval; the page also describes the prescriber specialties and a 10-year frequency limit for the relevant group.

VZP also warns that a self-purchased device cannot simply be reimbursed retroactively.

Source:
- https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/zdravotnicke-pomucky-pro-imobilni-pacienty

Guardrail:
- ZaPrazi may explain the route,
- ZaPrazi must not decide that an individual qualifies,
- exact current product reimbursement must still be checked against SÚKL and the correct prescription/approval process.

## 3. Rental is real but local

Rental is a useful alternative, especially for:
- short-term recovery,
- waiting for insurer/prescription processing,
- trying a type of aid before purchase,
- temporary changes in the home situation.

### Current example — Charita Šumperk

Page updated **2026-01-01** says the rental service includes:
- bath seats,
- WC chairs,
- WC raisers,
- shower chairs,
- wheelchairs and other aids.

It explicitly says rental can bridge the period before a person obtains an aid through health insurance or another route.

Important limitation:
- service is regional and availability is local,
- therefore this must never be presented as a nationwide guaranteed rental offer.

Source:
- https://www.sumperk.charita.cz/nase-sluzby/pujcovna-rehabilitacnich-a-kompenzacnich-pomucek/

## 4. Production acquisition contract

For every eligible Bathroom/WC recommendation:

### Direct purchase
Show exact merchant product only after:
- decision safety gates pass,
- exact product facts are current,
- canonical merchant route is working.

### Rental
Show:
- a generic "find/compare rental" path,
- concrete rental examples only with location, current date and availability caveat.

Never imply that one local rental provider serves the whole country.

### Reimbursement
Show:
- **Prověřit hrazenou alternativu**,
- current official SÚKL/VZP explanation.

Do not say:
- current affiliate product is reimbursed,
- user qualifies,
- reimbursement amount is current beyond its verified effective month.

## 5. Current UNIZDRAV shortlist status

These products remain **direct-pay candidates only** until exact reimbursement identity is proven:
- P2868 raised toilet seat,
- P2015 toilet support,
- P2807 static commode,
- P2062 shower chair,
- P2131 fixed grab rail.

The existence of reimbursed products in the same category is not enough to map reimbursement to them.

## 6. Next acquisition step

Before the Bathroom/WC UI goes live:
1. keep direct-pay canonical product routes,
2. show a separate reimbursement-alternative path,
3. show rental as a separate path for short-term needs,
4. map exact SÚKL codes only when product identity is proven,
5. refresh reimbursement claims against the effective monthly SÚKL list.

Affiliate commission must never alter which acquisition path or product is recommended.
