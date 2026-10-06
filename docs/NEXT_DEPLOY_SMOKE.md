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
- readable original article prefix,
- generated/fake appended HTML document chrome is not rendered,
- images do not overflow,
- no PHP error,
- URL unchanged.

## 3. Legacy category/archive

Open:
`/category/nabytek-pro-zdravotnictvi/`

Expected:
- one archive H1,
- article cards use H2 titles,
- pagination works,
- no old URL is redirected.

## 4. Legacy page

Open:
`/obchod/`

Expected:
- renders as the existing ordinary legacy page,
- no WooCommerce grid is expected,
- no fatal/error.

Important:
WooCommerce is currently not installed/active and the historical product rows are dormant. **Do not reinstall WooCommerce for this launch smoke.**

## 5. Mobile homepage

Use the Customizer mobile preview or a narrow browser width.

Expected:
- no horizontal scroll,
- Advisor choices remain tappable,
- missing required answers produce a visible/announced error,
- result/product cards stack to one column,
- footer "Starší archiv" is readable.

## 6. Outdoor SÚKL branch

Choose:
- mainly outdoor,
- steady support,
- hand brakes: yes.

Expected:
- MEYRA Ideal 3061982,
- official SÚKL reimbursement amount **3 408 Kč**,
- source links to the official October 2026 SÚKL record,
- text explicitly says individual entitlement/final copay is not guaranteed.

## 7. Activation decision

Activate ZaPrazi 2.0 only if steps 1–6 pass.

Immediately after activation repeat:
1. homepage,
2. indoor WA21 branch,
3. outdoor MEYRA branch,
4. one legacy post,
5. one legacy category,
6. one merchant outbound link.

Rollback if critical:
**Vzhled → Šablony → Flatsome → Aktivovat**.

## Not launch blockers

These may remain open after RC activation:
- exact VIVnetworks publisher deeplinks,
- ZaPrazi Search Console property access,
- full KEEP/MERGE/REPURPOSE/REMOVE lifecycle decisions for legacy content,
- broader historical product link-health / WooCommerce due diligence.
