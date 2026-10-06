# ZaPrazi 2.0 backlog

## P0 — Slice 1 Mobility

### ZP-001 Repository bootstrap
Status: **DONE**

Source of truth, architecture, migration contract, CI, deployment path and tested rule engine are in the repository.

### ZP-002 Legacy URL inventory
Status: **PARTIAL / BLOCKED_ON_AUTHENTICATED_INVENTORY**

Public first pass exists. Full authenticated WordPress inventory is still pending because WPVibe hit its daily limit and public REST/sitemap retrieval was not reliable enough to replace it.

Do not change legacy URLs yet.

### ZP-003 Mobility decision model
Status: **DONE_V1**

- practical non-diagnostic inputs,
- fail-closed ambiguity,
- professional-check boundary,
- indoor lift safety gate,
- outdoor brake safety gate,
- unit tests.

### ZP-004 Mobility reference/evidence pack
Status: **IN_PROGRESS**

Done:
- product/manual evidence for current v1 shortlist,
- source/date display contract,
- ePoukaz/reimbursement verification boundary,
- rental example evidence,
- official SÚKL monthly-source requirement in tests.

Still open:
- exact current monthly SÚKL record for the active reimbursement example,
- broader evidence for future products/categories.

### ZP-005 Initial merchant verification
Status: **PARTIAL**

Verified public inventory/routes:
- RehabilitačníPomůcky.cz,
- Lékárna.cz,
- MEYRA direct manufacturer route,
- RehaKomp rental example.

Still open:
- exact publisher-specific VIV deeplinks,
- MůjZdrav.cz public inventory / affiliate verification,
- feed credentials/terms where applicable.

### ZP-006 Curated Mobility product set v1
Status: **DONE_V1**

Production-eligible shortlist:
- BESCO WA17,
- BESCO WA21,
- MEYRA Ideal 3061982.

WA78 remains stored as an identity conflict and is excluded from runtime recommendations.

### ZP-007 Home Advisor accessible UI v1
Status: **DONE_CODE / PENDING_PREVIEW_SMOKE**

Czech mobile-first questionnaire/results experience exists with conditional questions, keyboard/focus behavior and no persistent answers.

### ZP-008 Acquisition choice v1
Status: **DONE_CODE / PENDING_PREVIEW_SMOKE**

Supported:
- buy/direct merchant path,
- verified rental example where available,
- reimbursement verification path with explicit source state.

### ZP-009 Merchant routing + tracking v1
Status: **DONE_CODE / BLOCKED_EXACT_VIV_LINKS**

- recommendation and affiliate routing are separated,
- WordPress runtime affiliate settings exist,
- safe fallback to canonical merchant URL,
- generic privacy-safe funnel events exist.

Need exact VIV deeplinks to activate affiliate tracking.

### ZP-010 WordPress integration + staged page
Status: **DONE_DEPLOYED_INACTIVE_THEME**

ZaPrazi 2.0 RC theme is deployed through Deployer for Git from `dev`. It is intentionally not active yet.

### ZP-011 Slice 1 production smoke
Status: **READY_FOR_LIVE_PREVIEW**

Verify before activation:
- mobile,
- keyboard,
- no dead ends,
- conditional questions,
- answer privacy,
- product source display,
- outbound merchant links,
- acquisition cards,
- analytics payload,
- title/meta/canonical,
- legacy post/page rendering,
- rollback path.

### ZP-012 Slice-related migration
Status: **BLOCKED_BY_ZP_002_ZP_011**

Only migrate URLs with a logical relationship to the new Mobility content.

## P1 — Acquisition for Mobility

Current next steps after smoke:
- exact VIV affiliate deeplinks,
- one strong Mobility landing experience (homepage v1 now implemented),
- Search Console measurement after activation,
- relevant legacy internal links and redirects only after inventory.

## P2 — Expansion gate

Do not start Slice 2 until Slice 1 is usable in production and early evidence is reviewed.

Next slices:
1. Bathroom + WC
2. Adjustable beds
3. Wheelchairs
4. Return from hospital

## Primary current indicator

**Can a real user complete problem → Advisor → recommendation → acquisition choice → real offer → outbound click without a dead end or unsafe claim?**
