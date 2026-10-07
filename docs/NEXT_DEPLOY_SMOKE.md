# Next Deploy Smoke — ZaPrazi 2.0 v0.8.22

This release supersedes 0.8.21. Deploy only 0.8.22 from `dev`.

## 1. Release integrity
Open `/`.

Expected:
- `zaprazi-release` = `0.8.22`
- `zaprazi-integrity` = `ok`
- header contains **Invalidní vozík**

## 2. Wheelchair Advisor
Open:
`/invalidni-vozik/`

Expected:
- Advisor loads,
- P4384 / P3641 / P2961 branches work,
- new link **Podrobně: pojišťovna, půjčení a kdy koupit** is visible.

## 3. New acquisition page
Open:
`/invalidni-vozik-na-pojistovnu/`

Expected H1:
**Invalidní vozík na pojišťovnu 2026: půjčit, koupit, nebo řešit úhradu?**

Expected sections:
- mechanický vozík + pojišťovna,
- electric-wheelchair extra requirements,
- local rental examples,
- SÚKL monthly-list boundary,
- FAQ,
- CTA back to wheelchair Advisor.

## 4. VZP guardrails
Expected visible:
- practical doctor or relevant specialist may be involved,
- approval/application path,
- seat width / dimensions matter,
- most wheelchairs may remain insurer property and be loaned,
- electric wheelchair requires additional documentation incl. fitting protocol.

Must NOT say:
- every wheelchair user qualifies,
- every wheelchair is reimbursed,
- P4384 / P3641 / P2961 are currently reimbursed.

## 5. Rental evidence
Expected examples:
- Charita sv. Martina: 300 Kč/month,
- Charita Odry: 360 Kč,
- Charita Veselí nad Moravou: 420 Kč/month.

Must say these are local/time-sensitive examples.

## 6. FAQ schema
Visible questions and structured FAQ must include:
- Hradí pojišťovna mechanický invalidní vozík?
- Dostanu hrazený vozík do vlastnictví?
- Kolik stojí půjčení mechanického invalidního vozíku?
- Je elektrický vozík na pojišťovnu složitější?
- Mohu si nejdřív koupit vozík a potom chtít proplacení?

## 7. Affiliate readiness
Expected unchanged:
- Mobility 3/3
- Bathroom/WC 0/9
- Polohovací postel 0/3
- Invalidní vozík 0/3

## 8. Regression
Expected unchanged:
- Bathroom/WC Advisor,
- adjustable-bed Advisor + acquisition page,
- wheelchair powered fail-closed behavior,
- GA4 consent guard.

## After smoke
1. exact wheelchair deeplinks only from approved affiliate tooling,
2. exact SÚKL product-level mapping where current identity can be proven,
3. next vertical: návrat z nemocnice / home-care bundle,
4. switch to Search Console track 2 immediately once query/page data become accessible.
