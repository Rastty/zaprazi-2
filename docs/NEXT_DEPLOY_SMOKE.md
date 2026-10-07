# Next Deploy Smoke — ZaPrazi 2.0 v0.8.24

This release supersedes 0.8.23. Deploy only 0.8.24 from `dev`.

## 1. Release integrity
Open `/`.

Expected:
- `zaprazi-release` = `0.8.24`
- `zaprazi-integrity` = `ok`
- header contains **Soběstačnost**
- homepage contains **Řeším pití nebo jídlo jednou rukou**

## 2. Self-care page
Open:
`/sobestacnost/`

Expected H1:
**Malé pomůcky, které mohou vrátit kus samostatnosti.**

Expected:
- no diagnosis question,
- no operation type,
- no medication list,
- no raw body-weight input,
- answers stay client-side,
- no health answers are sent to analytics.

## 3. UpCup branch
Choose:
- task = samostatné pití
- obstacle = držení / naklánění / rozlévání

Expected:
- UpCup 15-050101 candidate,
- canonical RehaVita fallback when affiliate slot is empty,
- merchant CTA only after the branch qualifies,
- visible source and checked date.

## 4. Swallowing safety boundary
Choose:
- obstacle = polykání / zakuckávání / zdravotní obtíž

Expected:
- professional-check result,
- no product candidate,
- no merchant CTA,
- explicit instruction not to solve swallowing safety by choosing a retail product.

## 5. Beat It branch
Choose:
- task = stabilize container
- obstacle = container moves
- stable surface = yes

Expected:
- Beat It 15-050102 candidate,
- practical fit checks visible.

Repeat with:
- stable surface = unknown

Expected:
- needs-fit-check state,
- candidate context may be shown,
- merchant CTA is not presented as the next action.

Repeat with:
- stable surface = no

Expected:
- no exact product.

## 6. Theomatik branch
Choose:
- task = one-hand meal
- obstacle = one-hand setup
- one-hand use = yes

Expected:
- Theomatik 15-050103 candidate,
- dimensions **36.5 × 18.8 × 3 cm** visible,
- canonical RehaVita fallback when affiliate slot is empty.

Repeat with:
- one-hand use = unknown

Expected:
- needs-fit-check state,
- no shopping-first CTA.

## 7. Affiliate readiness
In WordPress admin → ZaPrazi affiliate:

Expected:
- new group **Soběstačnost**
- readiness starts at **0 / 3** unless exact publisher-specific deeplinks have already been entered,
- three exact targets:
  - UpCup 15-050101
  - Beat It 15-050102
  - Theomatik 15-050103
- empty slot falls back to canonical RehaVita product URL,
- configured affiliate URL does not change recommendation logic.

## 8. Analytics/privacy
Expected:
- no GA4 before consent,
- only generic events such as `builder_start`, `builder_complete`, `recommendation_view`, `product_click`, `merchant_click`,
- no task / obstacle / stable-surface / one-hand-use answer is sent.

## 9. Regression
Expected unchanged:
- Mobility Advisor,
- Bathroom/WC Advisor,
- Adjustable Bed Advisor + acquisition page,
- Wheelchair Advisor + acquisition page,
- Return-home orchestration,
- existing affiliate readiness groups and canonical fallbacks.

## After smoke
1. verify mobile visual layout of `/sobestacnost/`,
2. add exact RehaVita publisher deeplinks only when available,
3. review early Search Console query/CTR evidence before expanding ADL beyond the three narrow jobs,
4. prepare the approved Zápraží logo as a clean production asset in a separate brand-only change.
