# Post-Deploy Smoke — ZaPrazi 2.0 v0.8.8

Release 0.8.8 is deployed. Use this checklist only for regression spot-checks after future changes.

## 1. Homepage + navigation

Open `/`.

Expected:
- new ZaPrazi homepage loads,
- header links: **Poradce · Pojišťovna · Půjčení · Jak vybírat**,
- no horizontal page scroll on mobile,
- core navigation may scroll horizontally on a narrow screen.

## 2. Insurance resource

Open:
`/choditko-na-pojistovnu/`

Expected:
- page exists as a normal WordPress page,
- title covers ePoukaz / reimbursement / 2026,
- VZP warning says a self-purchased walker cannot be reimbursed retroactively,
- common-walker guidance mentions GP prescribing path and max. 1 piece / 5 years with caveats,
- October SÚKL example shows **3 408 Kč** only while the verified October record is current,
- after 2026-10-31 the amount is explicitly historical/stale, not presented as current.

## 3. Rental resource

Open:
`/pujceni-choditka/`

Expected:
- RehaKomp examples: 12 Kč/day + 360 Kč/month for four-wheel outdoor walker; 10 Kč/day + 300 Kč/month for fixed four-point walker,
- MEYRA example: 250 Kč/week + 600 Kč/month, 1 000 Kč refundable deposit,
- page clearly says these are provider examples, not a national tariff,
- after 2026-11-06 prices are labeled historical until refreshed.

## 4. Privacy page

Open:
`/ochrana-soukromi/`

Expected:
- explains that Advisor answers remain local,
- lists only the five generic funnel event names,
- explains strict opt-in GA4 and how to change consent,
- links to Google Analytics data-protection information.

## 5. Analytics — deny path

Use a fresh/incognito browser.

Before clicking consent:
- no request to `googletagmanager.com/gtag/js`,
- no GA4 request should be sent.

Choose **Bez měření** and reload.

Expected:
- consent banner stays hidden,
- Google Analytics still does not load.

## 6. Analytics — allow path

Open **Nastavení měření** in the footer and choose **Povolit měření**.

Expected:
- GA4 script loads once using `G-WM86QVXVST`,
- page view is sent,
- Google Signals and ad-personalization signals remain disabled.

Run the Advisor.

Allowed analytics event names only:
- `builder_start`
- `builder_complete`
- `recommendation_view`
- `product_click`
- `merchant_click`

Network payload must not contain:
- Advisor answers,
- environment/support choices,
- brake/lift answers,
- recommended product ID,
- merchant ID,
- derived health/mobility profile.

## 7. Existing Advisor regression

Quick checks:
- indoor + steady + cannot lift → BESCO WA21 only,
- outdoor + steady + brakes yes → MEYRA Ideal,
- frequent physical assistance → no product/commercial path.

## 8. Legacy regression

Open:
- one old article,
- one old category/archive.

Expected:
- readable content,
- no PHP fatal,
- old URL unchanged.

## Remaining non-deploy blockers

These remain separate:
- exact VIV publisher deeplinks / joined-account confirmation,
- ZaPrazi Search Console access,
- full traffic/backlink-backed legacy migration inventory.

Rollback for a critical theme issue:
**Vzhled → Šablony → Flatsome → Aktivovat**.
