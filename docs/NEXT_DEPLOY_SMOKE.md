# Next Deploy Smoke — ZaPrazi 2.0 v0.8.20

This release supersedes 0.8.19. Deploy only 0.8.20 from `dev`.

## 1. Release integrity
Open `/`.

Expected:
- `zaprazi-release` = `0.8.20`
- `zaprazi-integrity` = `ok`
- header contains **Polohovací postel**

## 2. Slice 3 Advisor
Open:
`/polohovaci-postel/`

Expected:
- Advisor loads,
- CLASSIC / Hospital / Multibed branches still work,
- new link **Podrobně: pojišťovna, půjčení a kdy koupit** is visible.

## 3. New acquisition page
Open:
`/polohovaci-postel-na-pojistovnu/`

Expected H1:
**Polohovací postel na pojišťovnu 2026: půjčit, koupit, nebo řešit úhradu?**

Expected sections:
- insurer / circulation,
- local rental examples,
- purchase decision,
- SÚKL monthly-list boundary,
- FAQ,
- CTA back to the bed Advisor.

## 4. VZP guardrails
Expected visible:
- practical doctor among listed specialties,
- prior insurer approval,
- max. 1x per 10 years,
- circulation / loan possibility,
- 30-day voucher statement from VZP source,
- delivery home not automatically reimbursed.

Must NOT say:
- every user qualifies,
- every adjustable bed is reimbursed,
- the three UNIZDRAV retail beds are currently reimbursed.

## 5. Rental evidence
Expected examples:
- Studénka: 750 Kč/month; 2,000 Kč deposit,
- Charita sv. Martina: 900 Kč/month; 500 Kč bed transport incl. assembly,
- Třebíč: 40 Kč/day + 130 Kč one-time; assembly 600 Kč; transport 19 Kč/km.

Must say these are local/time-sensitive examples.

## 6. FAQ schema
Visible questions and structured FAQ must include:
- Hradí pojišťovna polohovací postel?
- Může polohovací postel předepsat praktický lékař?
- Kolik stojí půjčení elektrické polohovací postele?
- Je lepší postel půjčit, nebo koupit?
- Dostanu od pojišťovny novou postel?

## 7. Affiliate readiness
Expected unchanged:
- Mobility 3/3
- Bathroom/WC 0/9
- Polohovací postel 0/3

No new tracking URLs are created by this release.

## 8. Bathroom regression
Expected unchanged:
- DMA EH-CMDA 4v1,
- guarded reimbursement identity,
- BESCO BS008,
- UNIZDRAV P2203 fallback.

## After smoke
1. add exact bed deeplinks only from approved affiliate tooling,
2. pursue exact product-level SÚKL mapping,
3. switch immediately to Search Console track 2 once query/page data becomes accessible.
