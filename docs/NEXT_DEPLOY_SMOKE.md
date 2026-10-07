# Next Deploy Smoke — ZaPrazi 2.0 v0.8.15

Run after deploying release 0.8.15 from `dev`.

## 1. Release integrity

Open `/`.

Expected:
- `zaprazi-release` = `0.8.15`,
- `zaprazi-integrity` = `ok`,
- homepage and `/koupelna-a-wc/` load without errors.

## 2. Raised WC — independent transfer

Choose:
- problem: **WC je příliš nízké**
- transfer: **Samostatně**
- load fit: **Ano**
- toilet fit: **Ano**
- feet safely reach floor after raising: **Ano**

Expected:
- exact candidate: **UNIZDRAV P2868**
- simple raised-seat path,
- canonical merchant URL while Bathroom affiliate slot is empty.

## 3. Raised WC — needs steady hand support

Choose:
- problem: **WC je příliš nízké**
- transfer: **S oporou, ale bez zvedání druhou osobou**
- load fit: **Ano**
- toilet fit: **Ano**
- feet safely reach floor after raising: **Ano**

Expected:
- exact candidate: **BESCO BES-BS15 — nástavec na WC s odnímatelnými madly**
- height increase 11.5 cm,
- max load 100 kg,
- merchant: RehabilitačníPomůcky.cz,
- canonical merchant URL while affiliate slot is empty.

## 4. Raised WC fail-closed

Repeat either raised-WC path with:
- load fit = **Ne/Nevím**, or
- toilet fit = **Ne/Nevím**, or
- feet safely reach floor = **Ne/Nevím**.

Expected:
- no exact product.

Choose:
- transfer = **Běžně pomáhá druhá osoba**

Expected:
- professional-check only,
- no exact product,
- no commercial shortcut.

## 5. Bath-transfer regression

Safe independent bath-transfer case must still return:
- **BESCO BES-BS008**

Any assisted/unknown transfer or failed bath fit must return no exact product.

## 6. Affiliate admin

Open:
**Nastavení → ZaPrazi affiliate**

Expected:
- Mobility: **3 / 3**
- Koupelna a WC: **0 / 7** until exact Bathroom deeplinks are supplied,
- BS008 slot present,
- new BS15 slot present,
- BS15 exact target:
  `https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/`,
- empty slots use canonical fallbacks.

## 7. Reimbursement separation

Expected:
- BS15 is presented as a direct-pay retail candidate,
- no claim that BS15 is reimbursed,
- reimbursement alternative remains separate.

## After smoke

Next Slice 2 work:
1. exact publisher deeplinks for the seven Bathroom/WC runtime slots,
2. expand only where a new scenario is unlocked,
3. switch to Search Console track 2 as soon as query/page data become accessible.
