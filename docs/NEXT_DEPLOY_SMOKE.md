# Next Deploy Smoke — ZaPrazi 2.0 v0.8.14

Run after deploying release 0.8.14 from `dev`.

## 1. Release integrity

Open `/`.

Expected:
- `zaprazi-release` = `0.8.14`,
- `zaprazi-integrity` = `ok`,
- homepage, `/koupelna-a-wc/` and `/pomucky-do-koupelny-na-pojistovnu/` load without errors.

## 2. Bathroom/WC — new bath-transfer branch

Open:
`/koupelna-a-wc/`

Choose:
- problem: **Je problém dostat se přes okraj vany**
- general transfer: **Samostatně**
- load fit: **Ano**
- can sit and move both legs over the bath rim without physical assistance: **Ano**
- bath inner rim width 41–65 cm and secure fixing possible: **Ano**

Expected:
- candidate result,
- exact product: **BESCO BES-BS008 — sedačka na vanu s madlem**,
- merchant: RehabilitačníPomůcky.cz,
- canonical merchant link while affiliate slot is empty,
- separate reimbursement-alternative explanation remains visible.

## 3. Bath-transfer fail-closed checks

Repeat with any one of:
- regular physical assistance,
- bath-specific transfer = **Ne**,
- bath-specific transfer = **Nevím**,
- bath fit = **Ne**,
- bath fit = **Nevím**,
- load fit = **Ne/Nevím**.

Expected:
- no exact bath product where critical safety/fit information is missing or unsafe,
- physical help routes to professional check.

## 4. Higher-support regression

Choose:
- combined shower/toilet wheelchair.

Expected:
- professional-check result,
- no exact product,
- no commercial shortcut.

## 5. Affiliate admin

Open:
**Nastavení → ZaPrazi affiliate**

Expected:
- Mobility: **3 / 3**
- Koupelna a WC: **0 / 6** until Bathroom deeplinks are supplied,
- new slot: **RehabilitačníPomůcky.cz — BESCO BS008 sedačka na vanu s madlem**,
- exact target: `https://www.rehabilitacnipomucky.cz/besco-sedacka-na-vanu-s-madlem/`,
- empty slot uses canonical fallback.

## 6. Existing Bathroom regression

Expected:
- raised WC safe-fit → P2868,
- toilet support with unverified wall fixing → P2015 only,
- shower seated safe-fit → P2062,
- toilet nearby safe-fit → P2807.

## 7. Reimbursement separation

Expected:
- direct retail BESCO BS008 is not labelled as reimbursed,
- reimbursement route still points to the explanatory page and official VZP/SÚKL sources.

## After smoke

Next:
1. exact publisher deeplink for BESCO BS008 plus the five UNIZDRAV Bathroom slots,
2. then expand only where a new decision scenario is unlocked,
3. switch to Search Console track 2 as soon as query/page data become accessible.
