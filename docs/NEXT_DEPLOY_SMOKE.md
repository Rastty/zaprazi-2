# Next Deploy Smoke — ZaPrazi 2.0 v0.8.23

This release supersedes 0.8.22. Deploy only 0.8.23 from `dev`.

## 1. Release integrity
Open `/`.

Expected:
- `zaprazi-release` = `0.8.23`
- `zaprazi-integrity` = `ok`
- header contains **Návrat domů**
- homepage contains **Vracíme se z nemocnice domů**

## 2. Return-home page
Open:
`/navrat-z-nemocnice/`

Expected H1:
**Návrat z nemocnice domů: co musí fungovat první noc?**

Expected:
- no diagnosis question,
- no operation type,
- no medication list,
- no raw body-weight input,
- no product or merchant cards directly on this page,
- answers stay client-side.

## 3. Fully ready scenario
Choose:
- timing later
- entrance yes
- transfer independent
- walking independent
- WC yes
- bed yes
- bathroom yes
- home health care not needed

Expected:
- basic readiness confirmed,
- no hard blocker,
- no forced commercial CTA.

## 4. Unsafe entrance blocker
Choose:
- discharge today/tomorrow
- entrance no
- other basic areas yes

Expected:
- status says critical points must be solved before return,
- **Vstup do domu/bytu není bezpečně vyřešený**
- instruction explicitly says not to start by buying more products.

## 5. Physical transfer blocker
Choose:
- transfer = physical help by another person

Expected:
- hard blocker,
- action to clarify safe bed/chair/WC transfer with the discharge team,
- no claim that bed, wheelchair or toilet aid alone solves the transfer.

## 6. Walking support route
Choose:
- walking = needs support
- no blockers

Expected:
- route **Vyřešit chůzi a oporu**
- link to Mobility Advisor.

## 7. Wheelchair route
Choose:
- walking cannot rely on walking
- wheelchair ready = no
- no transfer blocker

Expected:
- route **Vyřešit invalidní vozík**
- link to `/invalidni-vozik/#poradce-vozik`.

## 8. WC + bed route
Choose:
- toilet ready = no
- bed ready = no

Expected:
- WC route into Bathroom/WC Advisor,
- bed route into Adjustable Bed Advisor,
- both shown in priority order.

## 9. Home health care
Choose:
- home care = needed but not arranged

Expected:
- discharge action says to solve home health care before discharge,
- visible explanation that NZIP says hospital treating physician can indicate it for 14 days after hospitalization.

Choose:
- home care = unknown

Expected:
- action to ask the hospital team whether home health care is needed.

## 10. Acquisition boundary
Expected visible:
- from 1 Jan 2026 ePoukaz is standard,
- retail purchase, rental and reimbursed dispensing remain separate paths,
- no suggestion that retail purchase can simply be reimbursed afterwards.

## 11. Analytics/privacy
Expected:
- no GA4 before consent,
- only generic `builder_start`, `builder_complete`, `recommendation_view`,
- no timing / entrance / transfer / walking / WC / bed / bathroom / home-care answers sent.

## 12. Regression
Expected unchanged:
- Mobility Advisor,
- Bathroom/WC Advisor,
- Adjustable Bed Advisor + acquisition page,
- Wheelchair Advisor + acquisition page,
- affiliate readiness:
  - Mobility 3/3
  - Bathroom/WC 0/9
  - Polohovací postel 0/3
  - Invalidní vozík 0/3

## After smoke
1. add a concise printable/checklist-style pre-discharge page only if it adds SEO/user value beyond the Advisor,
2. improve internal-link architecture around the five core scenarios,
3. pursue exact SÚKL mapping and affiliate deeplinks where available,
4. switch immediately to Search Console track 2 once query/page data become accessible.
