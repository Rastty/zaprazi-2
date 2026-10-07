# ZaPrazi 2.0 backlog

## P0 — Slice 1 Mobility

### ZP-001 Repository bootstrap
Status: **DONE**

Source of truth, architecture, migration contract, CI, deployment path and tested rule engine are in the repository.

### ZP-002 Legacy URL inventory
Status: **ROW_INVENTORY_DONE / BLOCKED_ON_GSC_EVIDENCE_FOR_DESTRUCTIVE_MIGRATION**

Done:
- public first pass,
- authenticated counts/category/product evidence,
- authoritative public row inventory persisted: **4,360 published posts + 7 published pages = 4,367 unique URLs** (2026-10-07),
- machine-readable snapshot: `data/legacy-url-inventory.csv` + summary JSON,
- 1,134 published WooCommerce products confirmed,
- semantic overlap review completed for Mobility/health/bathroom/bed candidates,
- legacy-safe post/archive/WooCommerce templates,
- 359 proven-broken eHub placeholder CTAs fail-closed,
- Prometheus GSC access discovery reviewed.

Search Console status:
- site ownership was verified by the user on 2026-10-07 using the Yoast-rendered Google verification meta tag,
- the remaining blocker is programmatic retrieval of per-URL/query Search Console evidence for KEEP/MERGE/REPURPOSE/REMOVE decisions.

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
Status: **CORE_ACTIVE / EXPANSION_PORTFOLIO_VERIFIED**

Verified public inventory/routes:
- RehabilitačníPomůcky.cz,
- Lékárna.cz,
- MEYRA direct manufacturer route,
- RehaKomp rental example.

Current state:
- exact publisher-specific deeplinks are active for all 3 Mobility v1 production slots,
- approved expansion portfolio now includes Dr.Max, UNIZDRAV and Zdravá Obuv Štěpánková & C.,
- UNIZDRAV is the priority merchant for Bathroom/WC, adjustable beds and wheelchairs,
- feed/API credentials remain optional future work where they create clear value.

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
Status: **LIVE_PRODUCTION / 3_OF_3_AFFILIATE_ACTIVE**

- recommendation and affiliate routing are separated,
- WordPress runtime affiliate settings exist,
- safe fallback to canonical merchant URL,
- generic privacy-safe funnel events exist,
- admin shows the exact canonical destination URL for each of the 3 supported slots so the publisher can paste it into VIV/CJ Deep Link Generator without manually composing tracking parameters.

All 3 supported Mobility v1 slots now contain exact publisher-specific CJ/VIV deeplinks in WordPress runtime configuration.

### ZP-010 WordPress integration + staged page
Status: **LIVE_PRODUCTION**

ZaPrazi 2.0 is active on production. Latest production release is **0.8.11**. The 0.8.11 Git-first Deployer sync was user-confirmed on 2026-10-07.

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
- programmatic Search Console data retrieval / query-page evidence.

### ZP-012 Slice-related migration
Status: **BLOCKED_ON_GSC_AND_LINK_EVIDENCE**

Only migrate URLs with a logical relationship to the new Mobility content.

Legacy candidate audit 2026-10-07:
- lexical scan of all 4,367 published URLs found **0 direct pre-existing walking-aid Mobility candidates** after excluding the two new Mobility pages,
- two weak adjacent matches (accessibility furniture / senior-safe tables) do not share the same intent and must not be auto-redirected,
- therefore no migration redirect map should be manufactured without Search Console/backlink evidence.

See `docs/LEGACY_MOBILITY_CANDIDATE_AUDIT_2026-10-07.md`.

## P1 — Acquisition for Mobility

Current next steps after smoke:
- retrieve Search Console query/page evidence now that site ownership is verified,
- build the Bathroom + WC candidate/evidence pack using UNIZDRAV first and RehabilitačníPomůcky.cz / Dr.Max as supporting merchants,
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
Status: **LIVE_PRODUCTION**

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
Status: **LIVE_PRODUCTION**

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
Status: **LIVE_PRODUCTION**

Header now links the core user journeys on every page:
- Advisor,
- walker reimbursement / ePoukaz,
- walker rental,
- selection guidance.

Implementation is JavaScript-free, keyboard-accessible and horizontally scrollable on small screens.


### ZP-017 Deployment integrity
Status: **LIVE_PRODUCTION**

Release 0.8.8 introduced a deploy-integrity contract after a partial Deployer sync was detected.

Production confirmation:
- header core navigation is visible,
- privacy/footer controls are visible,
- critical runtime files were forced into one squash release commit,
- public release/integrity markers are part of the runtime contract.

Future deploys should treat a version bump without matching runtime markers as a failed/partial deployment.


### ZP-018 Affiliate readiness + deploy operations
Status: **LIVE_PRODUCTION**

Adds:
- affiliate readiness count for the 3 supported Mobility deeplink slots,
- per-slot Fallback / Partnerský odkaz aktivní state,
- direct admin test link for configured deeplinks,
- admin warning when the deployment-integrity contract detects a partial runtime sync.

This remains operational visibility only; recommendation ranking is unchanged.

Deployment note 2026-10-07:
- user confirmed the 0.8.10 Deployer sync,
- public homepage remained reachable after deploy,
- all 3 Mobility affiliate slots now contain verified publisher-specific CJ/VIV deeplinks.


### ZP-019 Resource FAQ schema + release integrity 0.8.10
Status: **LIVE_PRODUCTION**

Adds:
- FAQPage structured data for the two visible high-intent Mobility resource pages,
- exact copy parity between visible FAQ content and JSON-LD,
- full 0.8.10 release-marker bump across critical PHP/JS/CSS runtime files.

No recommendation logic, health-suitability rules or affiliate ranking changed.


### ZP-020 Merchant portfolio expansion
Status: **READY_FOR_SLICE_2_RESEARCH**

Approved advertiser portfolio supplied 2026-10-07:
- RehabilitačníPomůcky.cz,
- Lékárna.cz,
- Dr.Max,
- UNIZDRAV,
- RehaVita.cz,
- Zdravá Obuv Štěpánková & C.

Priority:
1. RehabilitačníPomůcky.cz remains the Mobility anchor.
2. UNIZDRAV remains the primary merchant for Bathroom/WC, adjustable beds and wheelchairs.
3. Dr.Max is a supporting retail/trust merchant for selected exact products.
4. RehaVita is reserved for later ADL / return-from-hospital research; its currently verified inventory is not deep enough for Bathroom/WC v1.
5. Zdravá Obuv stays a later niche until a dedicated decision slice is justified.

See `docs/MERCHANT_PORTFOLIO_STRATEGY_2026-10-07.md`.


### ZP-021 Slice 2 Bathroom + WC candidate pack
Status: **DONE_V1**

Initial decision set is intentionally limited to five branches:
1. raise existing WC,
2. static toilet chair,
3. grab bar / toilet support,
4. shower / bath seating,
5. combined shower/toilet wheelchair.

UNIZDRAV is the primary evidence merchant; RehabilitačníPomůcky.cz and Dr.Max are supporting routes.

No new affiliate deeplinks should be generated until exact product parameters and safety gates are verified.

See `docs/BATHROOM_WC_CANDIDATE_PACK_V0.md`.


### ZP-022 Bathroom + WC decision engine v1
Status: **DONE_CODE / UI_WIRED**

Implemented:
- fail-closed decision engine for raised WC, toilet support, static commode and shower-chair branches,
- verified product catalog for UNIZDRAV P2868, P2015, P2807, P2062 and P2131,
- P2085 combined shower/toilet wheelchair kept research-only,
- independent safety gates for toilet fit, foot support after raising, wall fixing, stable floor, space fit, transfer mode and load fit,
- no raw body-weight storage and no diagnosis-based routing,
- unit tests for safety branches and catalog eligibility.

Still open after first UI:
- bathtub-transfer evidence remains professional-check only,
- exact product-level SÚKL mapping where identity can be proven,
- exact UNIZDRAV affiliate deeplinks after production smoke.

Acquisition research v0 is complete:
- direct purchase, local rental and reimbursement-alternative paths are separated,
- current official SÚKL/VZP rules are documented,
- current UNIZDRAV products remain direct-pay candidates until exact reimbursement identity is proven.

See docs/BATHROOM_WC_EVIDENCE_V1.md.


### ZP-023 Bathroom + WC acquisition evidence v0
Status: **DONE_RESEARCH / UI_WIRED**

Implemented:
- separate buy / rental / reimbursement-alternative paths,
- current SÚKL monthly-list contract documented,
- current VZP reimbursement route documented without claiming individual eligibility,
- local rental evidence documented as an example rather than nationwide availability,
- candidate outputs now include `check_reimbursement_alternative`,
- exact affiliate products are never labelled reimbursed without exact SÚKL identity,
- professional-check branches expose no acquisition shortcut.

See `docs/BATHROOM_WC_ACQUISITION_V0.md`.


### ZP-024 Bathroom + WC Advisor UI + release 0.8.11
Status: **LIVE_PRODUCTION / CORE_SMOKE_PASS**

Adds:
- dedicated `/koupelna-a-wc/` Home Advisor page,
- client-side fail-closed Bathroom/WC flow,
- verified canonical product candidates for WC raiser, toilet support, static commode, shower chair and fixed grab rail,
- explicit professional-check boundary for bath transfer, assisted transfer and combined shower/toilet wheelchair,
- separate buy/rental/reimbursement-alternative acquisition presentation,
- homepage and core-navigation entry point,
- WordPress non-destructive resource-page registry v4,
- 0.8.11 deployment-integrity markers covering the new Bathroom/WC page and frontend JS.

Production smoke 2026-10-07:
- WordPress page `/koupelna-a-wc/` exists with the dedicated template,
- public mobile Lighthouse: Accessibility 100 / Best Practices 100 / SEO 100,
- canonical UNIZDRAV product URLs remain the safe fallback until exact affiliate deeplinks are supplied.


### ZP-025 Bathroom + WC affiliate readiness
Status: **READY_DEPLOY_0_8_12 / 0_OF_5_DEEPLINKS**

Adds five exact runtime affiliate slots matching production-eligible Bathroom/WC catalog products:
- UNIZDRAV P2868,
- UNIZDRAV P2015,
- UNIZDRAV P2807,
- UNIZDRAV P2062,
- UNIZDRAV P2131.

Admin readiness is split by slice so Mobility stays visible as 3/3 while Bathroom/WC starts at 0/5.

Each slot:
- exposes the exact canonical product target,
- accepts only HTTPS partner URLs,
- falls back safely to the canonical merchant URL,
- does not affect recommendation ranking.

Research-only P2085 is intentionally excluded from affiliate routing.

RehaVita.cz:
- advertiser approval confirmed by user,
- currently classified for later ADL / return-from-hospital research rather than Bathroom/WC v1.
