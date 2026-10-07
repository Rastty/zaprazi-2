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

### Bath transfer seat over the tub rim

Independent public guidance supports seated transfer over the bath as a possible way to reduce slipping risk, but repeatedly places emphasis on assessment, correct sizing/fit and learning the transfer.

Sources:
- https://www.guysandstthomas.nhs.uk/health-information/daily-tasks-using-1-hand
- https://www.northerncarealliance.nhs.uk/patient-information/patient-leaflets/orthopaedic-surgery-therapy-information-following-hip-surgery

Model consequence:
- automated selection is allowed only for a simple **independent** seated transfer,
- any physical lifting/assistance or uncertain balance routes to professional check,
- exact bath fit and secure installation must be confirmed before a product is returned,
- the product load limit must be explicitly checked,
- higher-support bath transfer remains outside the automated route.

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

### BESCO BES-BS15 — raised toilet seat with removable arms

Verified:
- raises the toilet by 11.5 cm,
- max load 100 kg,
- removable arm supports,
- tool-free assembly,
- merchant describes an improved locking mechanism and compatibility with most standard toilet bowls,
- merchant explicitly sells this product as direct-pay rather than through health insurance.

Source:
- https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/

Status: **PRODUCTION_CANDIDATE_FOR_STEADYING_TRANSFER_AFTER_WC_FIT_AND_FEET_SUPPORT_GATES**

Model consequence:
- independent transfer continues to use the simpler raised-seat candidate,
- steadying transfer may use BS15 when stable hand support is needed but no physical lifting by another person is required,
- person-assisted transfer remains professional-check only,
- toilet compatibility, secure fixation, load fit and safe foot support after raising remain mandatory.

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

### BESCO BES-BS008 — bath transfer seat with handle

Verified:
- seat width 69 cm,
- seat depth 31 cm,
- compatible inner bath width 41–65 cm,
- max load 100 kg,
- four adjustable spacer feet for secure positioning.

Source:
- https://www.rehabilitacnipomucky.cz/besco-sedacka-na-vanu-s-madlem/

Status: **PRODUCTION_CANDIDATE_ONLY_AFTER_INDEPENDENT_TRANSFER_AND_EXACT_BATH_FIT_GATES**

Important:
- RehabilitačníPomůcky.cz explicitly states that it does not process health-insurance reimbursement; this offer is a direct-pay route only,
- the existence of a reimbursed bath-seat category does not make this exact retail product reimbursed.

### UNIZDRAV P2203 — bath transfer bench / shower chair over bath

Verified:
- total dimensions 81 × 61 × 81.5–91.5 cm,
- seat 68 × 41 cm,
- seat height 45.5–56 cm,
- max load 110 kg,
- weight 4.4 kg,
- one side of the frame is positioned in the bath and the other on the floor outside the bath.

Source:
- https://unizdrav.cz/zbozi/2203/sprchovaci-zidle-do-vany
- independent bathing guidance: https://www.uhcw.nhs.uk/download/clientfiles/files/Patient%20Information%20Leaflets/Clinical%20Support%20Services/Therapies/Occupational%20Therapy/Bathing%20and%20showering%20advice%20and%20information.pdf

Status: **PRODUCTION_CANDIDATE_AS_FALLBACK_WHEN_RIM_SEAT_DOES_NOT_FIT**

Decision consequence:
- only considered after a standard bath-rim seat fails the 41–65 cm fit gate,
- independent transfer remains mandatory,
- user must confirm enough space for the 81 × 61 cm footprint and stable support both inside and outside the bath,
- insufficient or unknown placement fit returns no exact product.

### DMA EH-CMDA — multifunction toilet/shower chair 4v1

Verified functional identity:
- manufacturer: K DESIGN / Czech supplier DMA Praha,
- approved retail merchant: Dr.Max,
- can be used as a toilet chair, shower seat or raised seat over the WC,
- total dimensions: 51 × 40 cm footprint, 59–77 cm total height,
- seat: 50 × 40 cm,
- seat height: 39–54 cm,
- max load: 150 kg,
- weight: 3 kg,
- removable arm supports.

Sources:
- manufacturer product page: https://www.dmapraha.cz/eh-cmda_z35658/
- manufacturer IFU: https://www.dmapraha.cz/data/files/manual/KD_IFU_EH-CMDA_ToaletniZidle_cs.pdf
- approved merchant: https://www.drmax.cz/dma-eh-cmda-toaletni-zidle-4v1

Status: **PRODUCTION_CANDIDATE_FOR_ONE_AID_ACROSS_WC_AND_SHOWER**

Decision consequence:
- use only when the user explicitly wants one stable aid for both toilet and shower,
- stable floor and sufficient space are mandatory,
- independent or steadying transfer may qualify,
- person-assisted transfer remains professional-check only.

Reimbursement identity evidence:
- DMA currently states payer code **5019427**,
- reimbursement group **07.04.03.01**,
- manufacturer page states full reimbursement, insurer approval required and 10-year service life.

Guardrail:
- the exact identity is strong enough to track as an exact reimbursement candidate,
- but `monthlySuklListVerified` remains **false** until the effective monthly SÚKL list is directly checked,
- therefore production copy must not claim current reimbursement merely from the manufacturer page.

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

- assisted or uncertain bathtub transfers,
- bath seats/boards that do not have exact fit and secure-installation evidence,
- suction grab rails,
- wheeled hygiene chairs as an automated recommendation,
- reimbursement claims,
- diagnosis-based rules,
- raw user weight storage,
- affiliate-driven ranking.

## Privacy note

The model asks only whether a product's published load limit safely covers the user: yes / no / unknown. It does not require storing a numeric body weight.

## Next evidence increment

1. Keep the newly verified independent bath-transfer branch narrow; do not generalize it to assisted transfer.
2. Verify exact product-level SÚKL identity only where a retail product can be matched without ambiguity.
3. Generate only the exact affiliate deeplinks for production-eligible Bathroom/WC slots after deployment smoke.
