# Next Deploy Smoke — ZaPrazi 2.0 v0.8.17

This release supersedes 0.8.16. Deploy only 0.8.17 from `dev`.

## 1. Release integrity
Expected on `/`:
- `zaprazi-release` = `0.8.17`
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
- reimbursement alternative stays separate
- no claim that code 5019427 is currently verified in the effective monthly SÚKL list

## 3. Bath-transfer primary route
Choose:
- bath transfer problem
- transfer independent
- load fit yes
- bath-specific independent transfer yes
- bath rim fit yes

Expected:
- **BESCO BES-BS008**

## 4. Bath-transfer fallback
Same answers, but:
- bath rim fit = no

Expected:
- one extra question appears only now:
  **vejde se transferová židle 81 × 61 cm with one side in the bath and one on stable floor outside?**

Choose yes.

Expected:
- **UNIZDRAV P2203 – sprchovací židle do vany**
- 81 × 61 cm footprint
- seat 68 × 41 cm
- seat height 45.5–56 cm
- load 110 kg
- canonical UNIZDRAV link while affiliate slot is empty

Choose no or unknown.

Expected:
- no exact product.

## 5. Safety regression
Expected:
- physical assistance by another person -> professional check
- unknown load fit -> no product
- combined shower/toilet wheelchair -> professional check
- no commercial shortcut on professional-check branches

## 6. Affiliate admin
Expected:
- Mobility **3/3**
- Bathroom/WC **0/9** until exact deeplinks are supplied
- slots include:
  - Dr.Max DMA EH-CMDA
  - UNIZDRAV P2203
- all empty slots use canonical fallback

## 7. Existing Bathroom regression
Expected unchanged:
- P2868 independent raised WC
- BS15 steadying raised WC
- P2015 toilet support
- P2807 static commode
- P2062 shower chair
- P2131 fixed rail only with verified fixing

## After smoke
1. exact publisher deeplinks for 9 Bathroom/WC slots
2. direct monthly SÚKL verification for EH-CMDA code 5019427
3. switch to Search Console track 2 as soon as the connector is actually connected
