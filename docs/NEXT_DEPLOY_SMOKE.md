# Next Deploy Smoke — ZaPrazi 2.0 v0.8.16

Run after deploying release 0.8.16 from `dev`.

## 1. Release integrity
Expected on `/`:
- `zaprazi-release` = `0.8.16`
- `zaprazi-integrity` = `ok`

## 2. New multifunction WC + shower branch
Open `/koupelna-a-wc/`.

Choose:
- **Jedna stabilní židle pro WC i sprchu**
- transfer: samostatně or s oporou
- load fit: ano
- stable floor: ano
- space fit: ano

Expected:
- candidate **DMA EH-CMDA – toaletní židle 4v1**
- merchant **Dr.Max**
- canonical merchant URL while affiliate slot is empty
- dimensions shown: 51 cm width, 40 cm depth, seat height 39–54 cm
- load 150 kg
- separate reimbursement-alternative path remains visible

## 3. Fail-closed
Any of:
- physical assistance by another person
- unstable/unknown floor
- insufficient/unknown space
- insufficient/unknown load fit

Expected:
- no exact EH-CMDA product.

## 4. Reimbursement boundary
Expected:
- product may mention that manufacturer DMA identifies payer code 5019427 only in guarded copy
- site must NOT state current monthly reimbursement as verified
- monthly SÚKL verification is still required before a current exact reimbursement claim

## 5. Affiliate admin
Expected:
- Mobility 3/3
- Bathroom/WC 0/8 until exact deeplinks are supplied
- new slot: **Dr.Max — DMA EH-CMDA toaletní židle 4v1**
- target: `https://www.drmax.cz/dma-eh-cmda-toaletni-zidle-4v1`

## 6. Regression
Expected unchanged:
- P2868 independent raised WC
- BS15 steadying raised WC
- P2015 toilet support
- P2807 static commode
- P2062 shower chair
- BS008 safe bath transfer
- combined shower/toilet wheelchair remains professional-check only

## After smoke
1. exact publisher deeplinks for the 8 Bathroom/WC slots
2. direct SÚKL monthly-list verification for EH-CMDA code 5019427
3. switch to Search Console track 2 immediately once the connector is actually connected
