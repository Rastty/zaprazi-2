# Bathroom + WC evidence v1

Checked: **2026-10-07**

## Purpose

This pack supports the first fail-closed decision model for Slice 2. It intentionally covers only product families where current dimensions, load limits and critical fit questions are sufficiently clear.

It does not infer diagnosis or individual medical suitability.

## Independent decision guardrails

### Raised toilet seat

Independent occupational-therapy guidance says a raised seat must fit the toilet securely. It also warns against use where the person cannot guide themselves safely on/off the toilet, where brackets/fixtures are loose, or where the raised height leaves the feet unable to reach the floor.

Source:
- https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/raised-toilet-seat

Model consequence:
- require independent transfer for the simple raised-seat branch,
- require explicit toilet compatibility,
- require safe foot support after raising,
- fail closed before an exact product if these are unknown.

### Grab rails

Current public safety guidance states that bathroom grab rails need proper wall fixing and warns that suction-cup grab rails can fail.

Source:
- https://www.reading.gov.uk/adult-care/help-living-at-home/falls-prevention/home-safety/indoor-safety/bathroom/

Model consequence:
- a wall-mounted rail is returned only when safe wall fixing is explicitly verified,
- if fixing is unknown, a wall-independent/support-frame route is compared instead,
- product load rating must not be interpreted as proof that the wall installation can sustain the same load.

### Commode / toilet chair

NHS guidance lists a commode as a relevant category when getting to the toilet is difficult.

Source:
- https://www.nhs.uk/social-care-and-support/care-services-equipment-and-care-homes/household-gadgets-and-equipment-to-make-life-easier/

Model consequence:
- this branch is based on the practical access problem, not diagnosis,
- stable floor, space fit and non-assisted transfer must be confirmed before an exact product is returned.

## Verified product candidates

### UNIZDRAV P2868 — raised toilet seat, 15 cm

Verified:
- 15 cm raise,
- outer dimensions 36 × 40 cm,
- opening 21 × 26 cm,
- max load 100 kg,
- weight 1.5 kg,
- side-screw locking system.

Source:
- https://unizdrav.cz/zbozi/2868/zvysovac-wc-s-priklopem-unizdrav-15-cm

Status: **PRODUCTION_CANDIDATE_AFTER_FIT_GATES**

### UNIZDRAV P2015 — toilet support frame

Verified:
- adjustable width 53–63 cm,
- depth 47 cm,
- height 64–74 cm,
- max load 100 kg,
- fixing-hole spacing 14.4 cm.

Source:
- https://unizdrav.cz/zbozi/2015/toaletni-opora

Status: **PRODUCTION_CANDIDATE_AFTER_FIT_GATES**

### UNIZDRAV P2807 — height-adjustable static commode

Verified:
- total width 60 cm,
- seat width 44 cm,
- total depth 60 cm,
- seat height 36–60 cm,
- max load 100 kg,
- weight 8.5 kg.

Source:
- https://unizdrav.cz/zbozi/2807/toaletni-zidle-vyskove-nastavitelna-unizdrav

Status: **PRODUCTION_CANDIDATE_AFTER_FIT_GATES**

### UNIZDRAV P2062 — shower chair with arms

Verified:
- total width 55 cm,
- depth 48 cm,
- seat height 38–50.5 cm,
- seat 40 × 33 cm,
- max load 136 kg,
- weight 3.1 kg.

Source:
- https://unizdrav.cz/zbozi/2062/sprchovaci-zidle-s-ruckami

Status: **PRODUCTION_CANDIDATE_AFTER_FIT_GATES**

### UNIZDRAV P2131 — fixed anti-slip grab rail

Verified:
- 30 / 40 / 45 cm variants,
- merchant-stated max load 100 kg,
- wall clearance 5.5 cm,
- supplied with six mounting screws.

Source:
- https://unizdrav.cz/zbozi/2131/protiskluzove-madlo-do-koupelny-a-toalety-od-30-do-45-cm

Status: **PRODUCTION_CANDIDATE_ONLY_WITH_VERIFIED_WALL_FIXING**

### UNIZDRAV P2085 — combined shower/toilet wheelchair

Verified merchant facts:
- total size 90 × 57 × 95 cm,
- seat 41 × 40 cm,
- seat height 50 cm,
- max load 110 kg,
- weight 9.5 kg,
- flip-up armrests and removable/folding footrests.

Source:
- https://unizdrav.cz/zbozi/2085/toaletni-sprchovaci-vozik

Status: **RESEARCH_ONLY / PROFESSIONAL_CHECK**

Reason:
- this is a higher-support transfer product family,
- merchant marketing copy is not enough evidence to automate transfer/caregiver suitability,
- no exact product should be returned until transfer and caregiver safety rules are independently established.

## Deliberate exclusions from v1

- bathtub transfer products,
- suction grab rails,
- wheeled hygiene chairs as an automated recommendation,
- reimbursement claims,
- diagnosis-based rules,
- raw user weight storage,
- affiliate-driven ranking.

## Privacy note

The model asks only whether a product's published load limit safely covers the user: yes / no / unknown. It does not require storing a numeric body weight.

## Next evidence increment

1. Verify one bathtub-transfer family from independent guidance plus exact product documentation.
2. Research Czech acquisition/reimbursement or rental routes for Bathroom/WC categories.
3. Only after product evidence passes, request the small exact batch of UNIZDRAV deeplinks.
