# Slice 4 — Wheelchair evidence v0

Checked: **2026-10-07**

## Goal

Create a narrow first decision engine for wheelchairs that answers one practical question first:

**Who will normally propel the wheelchair?**

The first split is intentionally not diagnosis-based.

Branches:
1. companion-propelled manual wheelchair,
2. self-propelled or mixed manual wheelchair,
3. powered joystick wheelchair.

## Official acquisition evidence

### VZP — mechanical wheelchairs

VZP describes mechanical wheelchairs as reimbursable when statutory indication conditions are met and simpler walking aids are insufficient.

VZP also states:
- applications are commonly made by practical doctors or relevant specialists,
- approval uses insurer documentation,
- most wheelchairs remain insurer property and are loaned to the insured person rather than becoming patient property automatically,
- seat width and physical dimensions are important application parameters.

Source:
- https://www.vzp.cz/poskytovatele/informace-pro-praxi/poradna/ziskani-invalidniho-voziku-a-mozne-chyby-pri-zpracovani-zadosti-o-nej

### VZP — application quality and electric wheelchair complexity

VZP notes that applications can fail when:
- body dimensions / seat width are missing,
- functional justification is missing,
- required forms are incomplete,
- electric wheelchairs require additional specific documentation.

Source:
- https://www.vzp.cz/poskytovatele/informace-pro-praxi/poradna/nejcastejsi-nedostatky-zadosti-o-uhradu-zdravotnickych-prostredku-pro-zajisteni-pohybu-pacienta

ZaPrazi consequence:
- show acquisition route,
- do not decide eligibility,
- keep electric-wheelchair reimbursement as a professional/insurer pathway,
- do not ask users to store exact body weight; ask only whether the published load limit safely fits.

### SÚKL

The authoritative product-level reimbursement source is the monthly Seznam ZP.

Sources:
- https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/
- https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/seznamy-zp-doplnujici-informace/

Current SÚKL policy:
- list contains all reimbursed prescription medical devices, max manufacturer prices, reimbursement amounts and conditions,
- list is issued monthly for the following calendar month,
- CSV data are available in the public ISZP interface.

## Exact retail candidates

### UNIZDRAV P4384 — Basic

Role: **companion-propelled / simple transport candidate**

Verified:
- overall 100 × 65 × 89 cm,
- folded 100 × 40 × 89.5 cm,
- seat width 48 cm,
- seat height 43 cm,
- load 100 kg,
- chair weight 18.4 kg,
- folding steel frame.

Source:
- https://unizdrav.cz/zbozi/4384/invalidni-vozik-unizdrav-basic

### UNIZDRAV P3641 — lightweight manual with companion brakes

Role: **self-propelled or mixed self + companion candidate**

Verified:
- rear wheels have self-propulsion rims,
- companion brakes,
- seat widths 48 or 51 cm,
- total width 68 or 70 cm,
- folded 30 × 80 × 83 cm,
- chair weight 17–17.5 kg,
- load 125 kg with pneumatic / 136 kg with solid tyres.

Source:
- https://unizdrav.cz/zbozi/3641/invalidni-vozik-odlehceny-s-brzdami-pro-doprovod

### UNIZDRAV P2961 — powered wheelchair, seat 46 cm

Role: **powered joystick candidate**

Verified:
- seat 46 × 40 cm,
- total width 63 cm,
- folded width 42 cm,
- total length 115 cm,
- chair weight 62 kg with batteries,
- load 135 kg,
- max speed 6 km/h,
- safe slope 6°,
- turning radius 86.5 cm,
- stated range 32 km,
- obstacle height up to 5 cm,
- joystick control.

Source:
- https://unizdrav.cz/zbozi/2961/elektricky-invalidni-vozik-46-cm

## Decision gates

Mandatory all branches:
- seat fit,
- total-width / route fit,
- load fit,
- transfer ability.

Powered branch also requires:
- safe practical joystick control,
- safe parking / charging setup.

Physical person-assisted transfer:
- no automatic exact product,
- route to professional check because wheelchair selection alone does not solve transfer safety.

## Acquisition logic

Short term:
1. compare local rental,
2. check insurer if useful,
3. direct purchase only after fit.

Long term:
1. insurer / reimbursement route,
2. direct purchase comparison if the insurer path is unsuitable,
3. retain distinction between retail ownership and insurer-owned circulated/loaned wheelchairs.

## Affiliate

UNIZDRAV is approved.

Planned runtime slots after UI exists:
- `unizdrav-cz:p4384`
- `unizdrav-cz:p3641`
- `unizdrav-cz:p2961`

Do not fabricate deeplinks.
Use exact canonical product URLs until publisher-specific links are supplied.
