# Next Deploy Smoke — ZaPrazi 2.0 v0.8.11

Run after deploying release 0.8.11 from `dev`.

## 1. Release integrity

Open `/`.

Expected:
- `zaprazi-release` = `0.8.11`,
- `zaprazi-integrity` = `ok`,
- homepage loads without PHP/JS errors.

## 2. Core navigation

Expected header links:
- **Mobilita**
- **Koupelna a WC**
- **Pojišťovna**
- **Půjčení**
- **Jak vybírat**

Homepage hero also links to **Řeším koupelnu nebo WC**.

## 3. New Bathroom/WC page

Open:
`/koupelna-a-wc/`

Expected:
- page exists and uses the dedicated template,
- title/meta describe Bathroom + WC decision support,
- no diagnosis or identifying data is requested,
- answers stay client-side.

## 4. Bathroom/WC decision smoke

### Raised WC
Choose:
- WC is too low,
- transfer independently,
- load fit yes,
- toilet fit yes,
- feet safely reach floor yes.

Expected:
- candidate: UNIZDRAV P2868,
- canonical merchant link,
- separate **Prověřit hrazenou alternativu** path,
- no claim that P2868 itself is reimbursed.

### Toilet support
Choose:
- missing support at WC,
- steadying,
- load fit yes,
- wall fixing unverified.

Expected:
- P2015 toilet support only,
- fixed wall grab rail is not returned.

Repeat with verified wall fixing.

Expected:
- P2131 fixed rail may be compared with P2015.

### Shower chair
Choose:
- difficult to stand while showering,
- independent transfer,
- load fit yes,
- stable floor yes,
- space fit yes.

Expected:
- P2062 shower chair candidate.

### High-support safety gate
Choose either:
- regular physical assistance by another person, or
- combined shower/toilet wheelchair, or
- bath transfer.

Expected:
- professional-check result,
- no exact product and no commercial acquisition shortcut.

## 5. Privacy + analytics regression

Before analytics consent:
- no GA4 load.

After consent:
- only generic event names may be sent:
  `builder_start`, `builder_complete`, `recommendation_view`, `product_click`, `merchant_click`.

Must not send Bathroom/WC answers, product IDs, merchant IDs or derived profile.

## 6. Mobility regression

Quick checks:
- indoor + steady + cannot lift → BESCO WA21 only,
- outdoor + steady + brakes yes → MEYRA Ideal,
- frequent physical assistance → no product/commercial path,
- existing 3/3 affiliate routes remain active.

## 7. Resource + legacy regression

Open:
- `/choditko-na-pojistovnu/`,
- `/pujceni-choditka/`,
- `/ochrana-soukromi/`,
- one old article,
- one old archive/category.

Expected:
- readable, no fatal error, URLs unchanged.

## After smoke

Next Bathroom/WC steps:
1. generate only the exact UNIZDRAV deeplinks for production-eligible candidates,
2. add them to runtime affiliate routing,
3. then improve Bathroom/WC SEO/reference pages from real query data when Search Console retrieval becomes available.

Search Console ownership is verified; destructive legacy migration still waits for query/page evidence.
