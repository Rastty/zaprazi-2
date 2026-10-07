# Next Deploy Smoke — Zápraží 2.0 v0.8.34

This release supersedes 0.8.33. Deploy only 0.8.34 from `dev`.

## 1. Release integrity
Open `/`.

Expected:
- `zaprazi-release` = `0.8.34`
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


## 11. Self-care SEO authority
Open `/sobestacnost/`.

Expected:
- document title contains **Pomůcky pro soběstačnost seniorů: jak vybrat**
- meta description mentions pití, stabilizaci nádoby, jídlo jednou rukou and otevírání běžných obalů
- visible section says **Vybírejte podle konkrétní činnosti**
- four visible FAQs are present
- FAQPage schema contains the same four questions
- swallowing FAQ links to NZIP and still results in no retail product recommendation.


## 12. Compensatory aids SEO hub
Open `/kompenzacni-pomucky-pro-seniory/`.

Expected:
- H1 contains **Kompenzační pomůcky pro seniory**
- all six core decision journeys are linked,
- page explains buy / rent / insurer as separate paths,
- SÚKL link explains ePoukaz from 1 Jan 2026,
- SÚKL boundary says ePoukaz does not itself change price or reimbursement,
- VZP source is visible,
- five visible FAQs are present,
- FAQPage schema contains the same five questions,
- no product catalog or merchant ranking appears on the page,
- homepage and footer link to this guide.


## 13. Safe-home senior audit
Open `/bezpecny-byt-pro-seniora/`.

Expected:
- H1 contains **Jak upravit byt pro seniora**
- audit covers entrance, bed → WC route, toilet, bathroom, walking paths and bed surroundings,
- NZIP fall-prevention source is visible,
- page mentions trip hazards, night lighting and anti-slip bathroom measures,
- all six core Advisor routes are linked,
- five visible FAQs are present,
- FAQPage schema contains the same five questions,
- compensatory-aids hub, return-home page and global footer link here,
- no product catalog or diagnosis-first advice appears on the page.


## 14. Easy-footwear Advisor
Open `/obuv-pro-seniory/`.

Expected:
- H1 contains **Boty pro seniory na suchý zip**
- Advisor asks only:
  - opening size,
  - open vs closed toe,
  - Velcro handling,
  - confirmation that both feet were measured
- no diagnosis / diabetes / medication / swelling-cause input exists
- ARSENE is candidate only for wide easy-opening + open-toe path
- XAVIER is candidate only for extra-wide low + closed-toe path
- ALTITUDE is candidate only for full-opening + closed-toe path
- no shopping-first merchant CTA until both feet are measured and Velcro handling is confirmed
- sudden foot-size/shape change, wound, strong pain or rapid swelling is explicitly outside the shopping flow.

Affiliate admin expected:
- group **Obuv pro seniory**
- 3 slots:
  - `zdrava-obuv-cz:arsene`
  - `zdrava-obuv-cz:xavier`
  - `zdrava-obuv-cz:altitude`
- empty slots use exact canonical Zdravá Obuv product URLs.


## 15. Toilet-riser micro-Advisor
Open `/nastavec-na-wc-pro-seniory/`.

Expected:
- H1 contains **Nástavec na WC pro seniory**
- Advisor asks only:
  - transfer ability,
  - toilet fit,
  - feet-on-floor after raising,
  - load fit,
  - optional duration
- independent transfer + all fit gates = UNIZDRAV P2868 candidate
- stable hand support + all fit gates = BESCO BS15 candidate
- person-assist transfer = no automatic product candidate
- unknown/no toilet fit, feet support or load fit = no shopping-first merchant CTA
- page links to insurer guidance.

Regression:
- Bathroom/WC Advisor still uses the same `recommendBathroom` engine
- existing affiliate slots `unizdrav-cz:p2868` and `rehabilitacni-pomucky-cz:besco-bs15` are reused
- no duplicate affiliate slot is created.


## 16. Shower-chair micro-Advisor
Open `/sprchovaci-zidle-pro-seniory/`.

Expected:
- H1 contains **Sprchovací židle pro seniory**
- Advisor asks only:
  - transfer ability,
  - stable floor,
  - space fit,
  - load fit,
  - optional duration
- independent/steadying transfer + all fit gates = UNIZDRAV P2062 candidate
- person-assist transfer = no automatic product candidate
- unstable floor, insufficient space or unverified load fit = no shopping-first merchant CTA
- visible product facts include 55 cm total width, 48 cm depth, 38–50.5 cm seat height and 136 kg max load
- insurer path remains separate.

Regression:
- Bathroom/WC Advisor still uses the same `recommendBathroom` engine
- existing affiliate slot `unizdrav-cz:p2062` is reused
- no duplicate shower-chair affiliate slot is created.


## 17. Toilet-chair micro-Advisor + asset-loader hotfix
Open `/toaletni-zidle-pro-seniory/`.

Expected:
- H1 contains **Toaletní židle pro seniory**
- Advisor distinguishes:
  - static nearby toilet chair,
  - multifunction toilet + shower 4v1
- static path + all safety gates = UNIZDRAV P2807 candidate
- 4v1 path + all safety gates = DMA EH-CMDA candidate
- person-assist transfer = no automatic product candidate
- unstable floor, insufficient space or unverified load fit = no shopping-first merchant CTA
- insurer path remains separate.

Regression checks:
- `zaprazi_2_assets()` contains no `$faq` assignment or FAQ question payload
- ADL, footwear, toilet-riser, shower-chair and toilet-chair JS modules all have explicit enqueue branches
- toilet-riser, shower-chair and toilet-chair FAQ data lives only inside `zaprazi_2_resource_faq_schema()`
- release integrity includes `page-toaletni-zidle-pro-seniory.php` and `assets/js/toilet-chair-advisor.js`.
