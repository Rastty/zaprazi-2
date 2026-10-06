# Next Deploy Smoke — ZaPrazi 2.0 RC

Run this once after deploying the latest `dev` branch. Keep the theme **inactive** until every critical item passes.

## 1. Professional-check branch

In Live Preview:

- choose any environment,
- choose **Často pomáhá další osoba**,
- run the Advisor.

Expected:
- no product,
- no merchant CTA,
- no rent/buy/reimbursement CTA,
- message says the online Advisor should not choose a specific walker and recommends professional/specialist verification.

## 2. Legacy post

Open:
`/stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu/`

Expected:
- one visible page title,
- readable text,
- images do not overflow,
- no PHP error,
- URL unchanged.

This article is only a legacy/repurpose-review candidate; do not rewrite it during this smoke.

## 3. Legacy category/archive

Open:
`/category/nabytek-pro-zdravotnictvi/`

Expected:
- one archive H1,
- article cards use H2 titles,
- pagination works,
- no old URL is redirected.

## 4. WooCommerce shop

Open:
`/obchod/`

Expected:
- product grid renders,
- cards are readable on desktop/mobile,
- no fatal/error,
- products remain accessible.

## 5. Proven-broken legacy affiliate CTA

In WordPress Products, preview product ID **3118**:
`Tempo Kondela Náplň do sedacích vaků…`

Expected:
- product page remains readable,
- no active outbound purchase button to the invalid eHub placeholder,
- visible state: **Původní nabídka se ověřuje.**

Do not edit the stored legacy URL yet.

## 6. Normal legacy external product

Open one non-eHub external product from the shop.

Expected:
- its existing merchant CTA remains present,
- the new theme has not globally disabled legacy external commerce.

## 7. Mobile homepage

Use the Customizer mobile preview or a narrow browser width.

Expected:
- no horizontal scroll,
- Advisor choices remain tappable,
- result/product cards stack to one column,
- footer "Starší archiv" is readable,
- shop/archive links remain available.

## 8. Activation decision

Activate ZaPrazi 2.0 only if steps 1–7 pass.

Immediately after activation repeat:
1. homepage,
2. indoor WA21 branch,
3. outdoor MEYRA branch,
4. one legacy post,
5. `/obchod/`,
6. one merchant outbound link.

Rollback if critical:
**Vzhled → Šablony → Flatsome → Aktivovat**.

## Not launch blockers

These may remain open after RC activation:
- exact VIVnetworks publisher deeplinks,
- exact current monthly SÚKL row/official amount,
- ZaPrazi Search Console property access,
- full KEEP/MERGE/REPURPOSE/REMOVE lifecycle decisions for legacy content,
- broader legacy external-link health beyond the proven-broken 359 eHub placeholders.
