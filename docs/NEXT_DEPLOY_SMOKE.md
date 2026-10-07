# Next Deploy Smoke — ZaPrazi 2.0 v0.8.18

This release supersedes 0.8.17. Deploy only 0.8.18 from `dev`.

## 1. Release integrity
Expected on `/`:
- `zaprazi-release` = `0.8.18`
- `zaprazi-integrity` = `ok`

## 2. Multifunction WC + shower branch
Open `/koupelna-a-wc/`.

Choose:
- **Jedna stabilní židle pro WC i sprchu**
- transfer: samostatně or s oporou
- load fit: ano
- stable floor: ano
- space fit: ano

Expected:
- **DMA EH-CMDA – toaletní židle 4v1**
- merchant **Dr.Max**
- canonical merchant URL while affiliate slot is empty
- 51 cm width / 40 cm depth / seat height 39–54 cm / load 150 kg

## 3. New guarded reimbursement card on EH-CMDA

Expected inside the product card:
- heading **Úhradová identita**
- **Aktuální seznam SÚKL: zatím neověřeno**
- code **5019427**
- group **07.04.03.01**
- manufacturer-stated insurer approval
- manufacturer-stated 10-year service life
- visible warning that this is not confirmation of current reimbursement or individual entitlement
- link **Ověřit aktuální seznam SÚKL**

Must NOT say:
- current SÚKL reimbursement is verified,
- EH-CMDA is currently fully reimbursed,
- the user qualifies for reimbursement.

## 4. Bath-transfer primary route
Choose:
- bath transfer problem
- transfer independent
- load fit yes
- bath-specific independent transfer yes
- bath rim fit yes

Expected:
- **BESCO BES-BS008**

## 5. Bath-transfer fallback
Same answers, but:
- bath rim fit = no
- transfer-bench placement fit = yes

Expected:
- **UNIZDRAV P2203**
- 81 × 61 cm footprint
- seat 68 × 41 cm
- seat height 45.5–56 cm
- load 110 kg

Choose transfer-bench fit no/unknown.

Expected:
- no exact product.

## 6. Safety regression
Expected:
- physical assistance -> professional check
- unknown load fit -> no product
- combined shower/toilet wheelchair -> professional check
- no commercial shortcut on professional-check branches

## 7. Affiliate admin
Expected:
- Mobility **3/3**
- Bathroom/WC **0/9**
- Dr.Max EH-CMDA slot present
- UNIZDRAV P2203 slot present
- empty slots use canonical fallback

## After smoke
1. exact publisher deeplinks for 9 Bathroom/WC slots
2. keep EH-CMDA monthly SÚKL state unverified until official effective-list data are directly retrieved
3. switch to Search Console track 2 as soon as the connector is actually connected
