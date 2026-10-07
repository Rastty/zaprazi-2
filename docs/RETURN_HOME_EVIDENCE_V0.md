# Slice 5 — Return home after hospital evidence v0

Checked: **2026-10-07**

## Goal

Create one orchestration layer for families asking:

**Co musíme vyřešit ještě před návratem z nemocnice, aby první noc doma fungovala?**

This slice deliberately does **not** become another product catalog.

It reuses existing ZaPrazi verticals:
- Mobility,
- Bathroom/WC,
- Adjustable bed,
- Wheelchair.

## Official evidence

### NZIP — domestic health care after hospital discharge

NZIP (Ministry of Health) recommends discussing the need for home health / nursing care during discharge planning.

NZIP states:
- the hospital treating physician can indicate home health care for **14 days after hospitalization**,
- after that period, continuation is recommended by the registering general practitioner,
- other physicians can also indicate home care in specified situations.

Source:
- https://www.nzip.cz/clanek/209-domaci-pece

ZaPrazi consequence:
- if the family says home health care is needed but not arranged, this is a discharge action, not a shopping problem,
- if the family does not know whether home health care is needed, the engine tells them to ask the hospital team before discharge,
- ZaPrazi does not infer nursing need from symptoms or diagnoses.

### SÚKL — ePoukaz from 2026

From 1 January 2026, ePoukaz is the standard form for prescribing and dispensing medical devices, with statutory exceptions for paper prescriptions.

Sources:
- https://sukl.gov.cz/media/tiskove-zpravy/poukaz-na-zdravotnicke-prostredky-od-1-ledna-2026-uz-jen-elektronicky/
- https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/

ZaPrazi consequence:
- reimbursement route must remain separate from direct retail purchase,
- no recommendation should imply that buying a retail product can later simply be converted to reimbursement.

### SÚKL — monthly reimbursed-device list

The authoritative product-level source remains the monthly Seznam ZP.

Source:
- https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/

## Decision model v0

The engine asks only practical questions:

1. **Timing**
   - today / tomorrow,
   - within a week,
   - later / unknown.

2. **Entrance**
   - can the person physically get through the entrance route?

3. **Transfer**
   - independent,
   - steadying only,
   - physical help by another person,
   - unknown.

4. **Walking**
   - independent,
   - needs walking support,
   - wheelchair / cannot rely on walking,
   - unknown.

5. **WC ready**
6. **Bathroom ready**
7. **Bed ready**
8. **Wheelchair ready**, only relevant if walking is insufficient.
9. **Home health care**
   - arranged,
   - not needed,
   - needed but not arranged,
   - unknown.

No diagnosis, operation type, wound details, medication list or exact body weight.

## Hard blockers

### Entrance not ready

If the person cannot safely enter the home:
- status = `blocked_before_discharge`,
- no shopping-first CTA,
- resolve stairs / thresholds / access route before discharge.

### Physical person-assisted transfer

If transfer normally requires physical help:
- status = `blocked_before_discharge`,
- direct product routing can still be listed as secondary work,
- primary action is to obtain a safe transfer plan / caregiver instruction before discharge.

This prevents false confidence from buying a wheelchair, raised toilet or adjustable bed without solving the transfer itself.

## Cross-slice routing

- walking support -> Mobility Advisor,
- wheelchair / no walking -> Wheelchair Advisor,
- WC problem -> Bathroom/WC Advisor,
- shower/bath problem -> Bathroom/WC Advisor,
- bed problem -> Adjustable Bed Advisor.

Routes reuse existing safety logic instead of duplicating product selection.

## First-night priority

For discharge today/tomorrow, the engine prioritizes:
1. safe entrance,
2. transfer,
3. WC,
4. bed,
5. required home health care.

Bathing and non-critical comfort improvements can follow later when appropriate.

## Trust boundary

ZaPrazi:
- does not decide whether the patient is medically fit for discharge,
- does not replace the discharge team,
- does not infer nursing care from diagnosis or symptoms,
- does not claim reimbursement without the proper medical-device pathway,
- does not rank products by affiliate commission.
