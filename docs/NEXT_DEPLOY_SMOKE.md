# Next Deploy Smoke — ZaPrazi 2.0 v0.8.19

This release supersedes 0.8.18. Deploy only 0.8.19 from `dev`.

## 1. Release integrity

Open `/`.

Expected:
- `zaprazi-release` = `0.8.19`
- `zaprazi-integrity` = `ok`
- header contains **Mobilita**, **Koupelna a WC** and **Polohovací postel**

## 2. New Slice 3 page

Open:
`/polohovaci-postel/`

Expected:
- dedicated ZaPrazi page loads,
- H1: **Polohovací postel: koupit, půjčit, nebo nejdřív řešit pojišťovnu?**
- no diagnosis request,
- no exact body-weight input,
- answers stay client-side.

## 3. Standard home bed

Choose:
- main need: **Běžné elektrické polohování doma**
- transfer: samostatně
- load fit: ano
- space fit: ano
- duration: dlouhodobě

Expected:
- **UNIZDRAV P2777 CLASSIC**
- sleeping surface 90 × 200 cm
- outer dimensions 102.5 × 212 cm
- height 38.6–80.6 cm
- max patient weight 178 kg
- mattress not included
- canonical UNIZDRAV link while affiliate slot is empty
- acquisition includes reimbursement/circulation check and purchase comparison.

## 4. Caregiver-access branch

Choose:
- **Usnadnit každodenní péči u lůžka**
- transfer: physical assistance by another person
- load fit: ano
- space fit: ano

Expected:
- P2777 CLASSIC may still be the bed candidate,
- visible warning that the bed itself does not solve safe physical transfer/lifting.

## 5. Robust branch

Choose:
- **Potřebujeme robustnější postel s vyšší nosností**
- load fit: ano
- space fit: ano

Expected:
- **UNIZDRAV P4707 Hospital**
- outer dimensions 105 × 214 cm
- height 40–70 cm
- load 250 kg
- central brake
- mattress not included.

## 6. Advanced in-bed care

Choose:
- **Náročnější péče přímo na lůžku**
- mostly in bed
- load fit: ano
- space fit: ano

Expected:
- **UNIZDRAV P4044 Multibed**
- outer dimensions 96 × 212 cm
- height 50–70 cm
- load 260 kg
- lateral turning up to 45°
- mattress included
- caution that advanced functions require correct use / caregiver training.

## 7. Fail-closed fit checks

Any branch with:
- load fit = ne / nevím, or
- space fit = ne / nevím

Expected:
- no exact product until missing fit is resolved.

Standard branch with load fit = ne:

Expected:
- no CLASSIC product,
- guidance toward robust/high-load branch,
- no raw kg question.

## 8. Short-term acquisition

Choose a valid bed branch with:
- duration = **Spíš dočasně**

Expected:
1. rental comparison first,
2. reimbursement / insurer-circulation check,
3. no claim that one local rental service is nationwide.

## 9. Affiliate admin

Open:
**Nastavení → ZaPrazi affiliate**

Expected:
- Mobility **3 / 3**
- Koupelna a WC **0 / 9**
- Polohovací postel **0 / 3**

Bed slots:
- UNIZDRAV P2777 CLASSIC
- UNIZDRAV P4707 Hospital
- UNIZDRAV P4044 Multibed

All empty slots must use exact canonical merchant URLs.

## 10. Privacy / analytics

Before analytics consent:
- no GA4 load.

After consent:
- only generic events:
  `builder_start`, `builder_complete`, `recommendation_view`, `product_click`, `merchant_click`.

Must not send:
- primaryNeed,
- transferAbility,
- loadFit,
- spaceFit,
- product ID,
- merchant ID,
- derived health profile.

## 11. Bathroom regression from 0.8.18

Expected unchanged:
- DMA EH-CMDA 4v1 branch works,
- guarded reimbursement card says **Aktuální seznam SÚKL: zatím neověřeno**,
- code 5019427 and group 07.04.03.01 are identity evidence only,
- BESCO BS008 primary bath-transfer route works,
- UNIZDRAV P2203 fallback works after rim-seat mismatch,
- assisted transfer remains fail-closed.

## After smoke

Next Slice 3 work:
1. high-intent reference page for **polohovací postel na pojišťovnu / půjčení vs koupě**,
2. exact product-level reimbursement mapping only where current SÚKL identity can be proven,
3. exact publisher deeplinks for the 3 bed slots only when generated from the approved affiliate account,
4. switch to Search Console track 2 immediately once connector/query data become available.
