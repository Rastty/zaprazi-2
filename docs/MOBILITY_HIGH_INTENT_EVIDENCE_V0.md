# Mobility high-intent evidence — v0

Checked: **2026-10-07**

## Indoor walker intent

Target cluster:
- chodítko do bytu pro seniory
- čtyřbodové chodítko
- dvoukolové chodítko
- chodítko pro seniory domů

### BESCO WA17
Source:
https://www.rehabilitacnipomucky.cz/besco-ctyrbodove-choditko-skladaci/

Rechecked 2026-10-07:
- listed price: **1 890 Kč**
- merchant showed **Skladem**
- four fixed support points
- height: **80–98 cm**
- width: **59 cm**
- weight: **2.3 kg**
- max user weight: **110 kg**

Decision use:
- stable support needed indoors,
- user can repeatedly lift and advance the whole walker,
- person-assist is not normally required.

### BESCO WA21
Source:
https://www.rehabilitacnipomucky.cz/besco-dvoukolove-choditko-skladaci/

Existing verified production facts:
- two front wheels + two rear support legs
- height: **81–99 cm**
- width: **60 cm**
- weight: **2.8 kg**
- max user weight: **110 kg**

Decision use:
- stable support needed indoors,
- user should not need to lift the entire frame every step,
- person-assist is not normally required.

Retail boundary:
- RehabilitačníPomůcky.cz states it does not cooperate with health insurers and products are fully paid by the customer.

## Rollator intent

Target cluster:
- rollátor pro seniory
- čtyřkolové chodítko pro seniory
- chodítko na ven
- rollátor na pojišťovnu

### MEYRA Ideal Rollator 3061982

Manufacturer:
https://www.meyra.cz/ctyrkolove-choditko-rollator.html

Rechecked 2026-10-07:
- manufacturer states use indoors and outdoors
- handle height: **79–97 cm**
- width: **61.5 cm**
- max user weight: **130 kg**
- locking hand brakes
- seat, tray and basket
- code: **07-5005963**
- manufacturer states:
  - price **3 408 Kč**
  - reimbursement **3 408 Kč**
  - copay **0 Kč**
  - no review-physician approval required

Safety decision:
- automatic candidate only when stable support is needed and safe hand-brake use is confirmed,
- if hand brakes cannot be used safely, no automatic rollator candidate,
- person-assist still fails closed.

Important reimbursement boundary:
- current manufacturer reimbursement information is evidence for the product, not a confirmation of an individual person's entitlement,
- retail purchase and prescribed/dispensed reimbursement paths remain separate.

## Architecture

Pages:
- `/choditko-do-bytu-pro-seniory/`
- `/rollator-pro-seniory/`

Reuse:
- `src/mobility/engine.js`
- `src/mobility/catalog.js`
- existing affiliate slots:
  - `rehabilitacni-pomucky-cz:besco-wa17`
  - `rehabilitacni-pomucky-cz:besco-wa21`
  - `lekarna-cz:meyra-ideal-3061982`

No new parallel suitability engine.

## Next checkpoint

After deployment:
- verify both page modules load,
- confirm WA21-only branch when walker cannot be lifted,
- confirm rollator candidate disappears when brakes are not safely usable,
- inspect Search Console query separation between indoor walker and rollator.
