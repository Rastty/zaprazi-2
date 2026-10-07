# Next Deploy Smoke — Zápraží 2.0 v0.8.27

This release supersedes 0.8.26. Deploy only 0.8.27 from `dev`.

## 1. Release integrity
Open `/`.

Expected:
- `zaprazi-release` = `0.8.27`
- `zaprazi-integrity` = `ok`
- public brand text is **Zápraží** everywhere, with no remaining public ZaPrazi/ZaPrazi.cz copy
- claim is **Cesta k lepšímu životu**

## 2. Homepage scenario hub
Expected above the Mobility Advisor:
- heading **Začněte situací, ne názvem pomůcky**
- six routes:
  - Chůze a opora
  - Koupelna a WC
  - Polohovací postel
  - Invalidní vozík
  - Návrat z nemocnice
  - Každodenní soběstačnost

Expected:
- existing Mobility Advisor still works below the hub,
- homepage no longer presents the whole project as Mobility-only.

## 3. Global navigation / footer
Expected:
- header contains the six core journeys,
- footer contains **Hlavní poradci** with all six routes,
- legacy archive links remain present,
- mobile header/footer remain readable.

## 4. Self-care page
Open `/sobestacnost/`.

Expected:
- UpCup branch works for grip/spill drinking problem,
- Beat It requires stable work surface,
- Theomatik requires confirmed one-hand meal use,
- swallowing/choking concern returns professional-check with no product,
- fit-check state does not present merchant CTA as the next action,
- links to Mobility, Bathroom/WC, Bed, Wheelchair and Return-home are visible.

## 5. Return-home → self-care
Open `/navrat-z-nemocnice/`.

Expected:
- critical first-night logic stays unchanged,
- self-care appears only after the critical first-night section,
- return-home engine remains product-free,
- no RehaVita product is directly recommended on the return-home page.

## 6. RehaVita affiliate readiness
Open WordPress admin → ZaPrazi affiliate.

Expected:
- Soběstačnost readiness group exists,
- RehaVita slots identify **VIV 18119967**,
- exact canonical target URL is shown for UpCup, Beat It and Theomatik,
- empty slot safely uses canonical RehaVita URL,
- no tracking URL is manually fabricated.

If generating links:
- use CJ/VIV Deep Link Generator / current Chrome extension,
- paste each exact publisher-specific link into only its matching slot.

## 7. Logo support
With no custom logo configured:
- header shows text fallback **Zápraží**,
- claim remains **Cesta k lepšímu životu**.

After uploading the approved horizontal logo through WordPress custom logo:
- graphical logo replaces only the fallback wordmark,
- navigation and claim remain intact,
- logo fits desktop and mobile header without overflow.

## 8. Privacy / analytics
Expected:
- no GA4 before consent,
- Advisor answers are never sent to analytics,
- only generic funnel events are emitted.

## 9. Regression
Expected unchanged:
- Mobility Advisor,
- Bathroom/WC Advisor + reimbursement page,
- Adjustable Bed Advisor + acquisition page,
- Wheelchair Advisor + acquisition page,
- Return-home orchestration,
- canonical fallback behavior for all empty affiliate slots.

## After smoke
1. upload the approved horizontal logo and square Site Icon,
2. generate the 3 RehaVita VIV/CJ product deeplinks,
3. verify mobile visual layout of homepage and `/sobestacnost/`,
4. review Search Console query/page evidence before broadening the ADL catalog.


## 10. Open-It packaging branch
Open `/sobestacnost/`.

Choose:
- task = **Otevřít běžný obal nebo uzávěr**
- obstacle = **Chybí jistý úchop, otočení nebo zatažení při otevírání**

Expected:
- candidate **MVS Open-It 5 v 1**
- SKU **15-050105**
- RehaVita canonical fallback when affiliate slot is empty
- visible 60 g fact
- explicit message that Zápraží does not provide medication choice, dosage or safety advice
- no recommendation when the packaging task is paired with an unrelated problem.

Affiliate admin expected:
- Soběstačnost readiness total = **4**
- fourth slot = `rehavita-cz:open-it-15-050105`
- VIV/CJ advertiser remains **18119967**.
