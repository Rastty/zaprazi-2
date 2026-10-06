# ZaPrazi 2.0 backlog

## P0 — Slice 1 Mobility

### ZP-001 Repository bootstrap
Status: **DONE**

Source of truth, architecture, migration contract, CI, deployment path and tested rule engine are in the repository.

### ZP-002 Legacy URL inventory
Status: **PARTIAL / BLOCKED_ON_FULL_INVENTORY_AND_GSC_ACCESS**

Done:
- public first pass,
- authenticated counts/category/product evidence,
- 4,360 published posts + 4 pages confirmed,
- 1,134 published WooCommerce products confirmed,
- semantic overlap review completed for Mobility/health/bathroom/bed candidates,
- legacy-safe post/archive/WooCommerce templates,
- 359 proven-broken eHub placeholder CTAs fail-closed,
- Prometheus GSC access discovery reviewed.

Current blockers:
- the complete row-by-row URL inventory is not yet persisted as an authoritative artifact,
- ZaPrazi is absent from the stored Prometheus Search Console accessible-property list (2026-07-23).

Guardrail: do not destructively change legacy URLs yet.

### ZP-003 Mobility decision model
Status: **DONE_V1**

- practical non-diagnostic inputs,
- fail-closed ambiguity,
- professional-check boundary,
- indoor lift safety gate,
- outdoor brake safety gate,
- unit tests.

### ZP-004 Mobility reference/evidence pack
Status: **DONE_V1**

Done:
- product/manual evidence for current v1 shortlist,
- source/date display contract,
- ePoukaz/reimbursement verification boundary,
- rental example evidence,
- exact October 2026 SÚKL record for MEYRA Ideal 3061982,
- monthly validity/fail-closed expiry through 2026-10-31,
- official SÚKL monthly-source requirement in tests.

Future-slice work:
- broader evidence for products/categories beyond the current Mobility v1 shortlist.

### ZP-005 Initial merchant verification
Status: **PARTIAL**

Verified public inventory/routes:
- RehabilitačníPomůcky.cz,
- Lékárna.cz,
- MEYRA direct manufacturer route,
- RehaKomp rental example.

Still open:
- exact publisher-specific VIV deeplinks / joined-account confirmation,
- MůjZdrav.cz public inventory / affiliate verification,
- feed access credentials where applicable.

Public program terms re-verified 2026-10-06:
- RehabilitačníPomůcky.cz — 10 %, 30-day cookie, XML + S2S,
- Lékárna.cz — up to 6 %, 30-day cookie, no XML/S2S,
- MojeLékárna.cz — 3–15 %, 30-day cookie, XML + S2S, **watchlist only** until relevant inventory is verified.

### ZP-006 Curated Mobility product set v1
Status: **DONE_V1**

Production-eligible shortlist:
- BESCO WA17,
- BESCO WA21,
- MEYRA Ideal 3061982.

WA78 remains stored as an identity conflict and is excluded from runtime recommendations.

### ZP-007 Home Advisor accessible UI v1
Status: **LIVE_PRODUCTION**

Verified in Live Preview:
- indoor / cannot lift → only BESCO WA21,
- outdoor / brakes yes → MEYRA Ideal,
- privacy-safe non-submitting Advisor,
- explicit safety answers,
- product sources and checked dates.

Still to preview after latest deploy:
- professional-check branch,
- mobile layout.

### ZP-008 Acquisition choice v1
Status: **LIVE_PRODUCTION**

Verified in outdoor preview:
- direct merchant path,
- RehaKomp rental evidence,
- separate reimbursement-verification path,
- no guaranteed individual reimbursement claim.

### ZP-009 Merchant routing + tracking v1
Status: **DONE_CODE / BLOCKED_EXACT_VIV_LINKS**

- recommendation and affiliate routing are separated,
- WordPress runtime affiliate settings exist,
- safe fallback to canonical merchant URL,
- generic privacy-safe funnel events exist.

Need exact VIV deeplinks to activate affiliate tracking.

### ZP-010 WordPress integration + staged page
Status: **LIVE_PRODUCTION**

ZaPrazi 2.0 is active on production. Latest repository release is **0.8.7**, ready for a single Git-first Deployer update from `dev`.

### ZP-011 Slice 1 production smoke
Status: **PASS_CORE_PRODUCTION**

Passed:
- homepage routing,
- indoor candidate branch,
- outdoor candidate branch,
- product source display,
- direct merchant links,
- rental/reimbursement cards,
- answer URL privacy.

Post-launch verified:
- public homepage serves the new ZaPrazi Mobility experience,
- legacy category archive renders under the new theme with one H1 and H2 article cards,
- legacy single post renders under the new theme,
- production title/brand are updated,
- Flatsome remains installed as rollback.

Still open after launch:
- manual mobile visual pass,
- Search Console access,
- exact VIV publisher deeplinks.

### ZP-012 Slice-related migration
Status: **BLOCKED_BY_ZP_002_ZP_011**

Only migrate URLs with a logical relationship to the new Mobility content.

## P1 — Acquisition for Mobility

Current next steps after smoke:
- exact VIV affiliate deeplinks,
- connect consent-aware analytics to the existing GA4 stream rather than creating a duplicate,
- establish ZaPrazi Search Console access,
- broader legacy product link-health review,
- relevant legacy internal links and redirects only after traffic/backlink evidence.

## P2 — Expansion gate

Do not start Slice 2 until Slice 1 is usable in production and early evidence is reviewed.

Next slices:
1. Bathroom + WC
2. Adjustable beds
3. Wheelchairs
4. Return from hospital

## Primary current indicator

**Can a real user complete problem → Advisor → recommendation → acquisition choice → real offer → outbound click without a dead end or unsafe claim?**


### ZP-013 Legacy commerce preservation
Status: **DORMANT_LEGACY / NOT_LAUNCH_BLOCKER**

Authenticated evidence:
- 1,134 historical WooCommerce product rows remain in the database,
- 1,101 are external/affiliate rows,
- 359 eHub destinations contain unresolved `nazev-webu-affilbox` placeholder,
- WooCommerce is currently not installed/active,
- WordPress does not currently register the `product` post type,
- `/obchod/` is an ordinary legacy page, not an active shop.

RC behavior:
- do **not** reinstall WooCommerce for Slice 1 launch,
- preserve all historical product data for later traffic/backlink due diligence,
- keep conditional compatibility + broken-link guards ready if WooCommerce is intentionally reactivated later.

### ZP-014 Analytics transition
Status: **READY_DEPLOY_0_8_7**

Evidence:
- existing GA4 stream `G-WM86QVXVST` is reused,
- no duplicate GA4 property is created,
- GA4 script is not loaded before explicit user consent,
- denial keeps analytics completely unloaded,
- consent can be changed later from the footer,
- only generic pageviews and whitelisted Advisor funnel event names are forwarded,
- questionnaire answers, recommendation/product IDs, merchant IDs and derived profiles are excluded from the analytics adapter.

Transparency layer:
- dedicated `/ochrana-soukromi/` page explains the strict opt-in model,
- consent banner and footer link to the detailed explanation,
- the page documents allowed generic events and prohibited Advisor data.

Post-deploy:
- smoke both consent choices,
- verify no Google request before consent,
- verify one page_view after consent,
- verify generic Advisor events in GA4 DebugView/Realtime when account access is available.


### ZP-015 High-intent SEO acquisition pages
Status: **READY_DEPLOY_0_8_7**

First page:
- `/choditko-na-pojistovnu/`
- intent: reimbursement / ePoukaz / current SÚKL evidence,
- Git-first template plus one-time non-destructive WordPress page creation,
- internal link from the homepage acquisition section,
- Yoast title/meta override,
- expected automatic inclusion in the normal page sitemap after creation,
- monthly reimbursement amount fails closed after 2026-10-31 until refreshed.

Second page:
- `/pujceni-choditka/`
- intent: short-term need / rental price / deposit / delivery,
- current examples from RehaKomp and MEYRA,
- prices become explicitly historical after 2026-11-06,
- linked from the homepage acquisition section.

Insurance page v2:
- adds official VZP warning that retroactive reimbursement after self-purchase is not available,
- adds VZP guidance for common walkers: practical-doctor prescriber path and max. 1 piece / 5 years,
- keeps exceptions and product-specific conditions explicit.

Next candidate after deploy/indexation:
- rollátor na ven vs. chodítko domů,
- BESCO WA21 / MEYRA Ideal evidence pages only if query/CTR data justify them.


### ZP-016 Core navigation
Status: **READY_DEPLOY_0_8_7**

Header now links the core user journeys on every page:
- Advisor,
- walker reimbursement / ePoukaz,
- walker rental,
- selection guidance.

Implementation is JavaScript-free, keyboard-accessible and horizontally scrollable on small screens.
