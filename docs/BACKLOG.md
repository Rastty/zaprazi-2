# Zápraží 2.0 backlog

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

Zápraží 2.0 is active on production. Latest production release is **0.8.11**. The 0.8.11 Git-first Deployer sync was user-confirmed on 2026-10-07.

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
- public homepage serves the new Zápraží Mobility experience,
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
- simple independent bathtub-transfer evidence is now closed for one exact seat; assisted/uncertain transfer remains professional-check only,
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
Status: **LIVE_PRODUCTION_0_8_14 / BATHROOM_0_OF_9_DEEPLINKS**

Adds exact runtime affiliate slots matching production-eligible Bathroom/WC catalog products:
- UNIZDRAV P2868,
- UNIZDRAV P2015,
- UNIZDRAV P2807,
- UNIZDRAV P2062,
- UNIZDRAV P2131,
- BESCO BES-BS008 bath transfer seat,
- BESCO BES-BS15 raised toilet seat with removable arms.

Admin readiness is split by slice so Mobility stays visible as 3/3 while Bathroom/WC starts at 0/9.

Each slot:
- exposes the exact canonical product target,
- accepts only HTTPS partner URLs,
- falls back safely to the canonical merchant URL,
- does not affect recommendation ranking.

Research-only P2085 is intentionally excluded from affiliate routing.

RehaVita.cz:
- advertiser approval confirmed by user,
- currently classified for later ADL / return-from-hospital research rather than Bathroom/WC v1.


### ZP-026 Bathroom/WC reimbursement resource
Status: **DEPLOY_CONFIRMED_0_8_13 / PUBLIC_SMOKE_PARTIAL**

Adds high-intent resource page:
- `/pomucky-do-koupelny-na-pojistovnu/`

Purpose:
- explain which Bathroom/WC compensatory-aid groups VZP currently describes,
- explain prior insurer approval and prescription flow,
- explain that SÚKL reimbursement data are monthly and product-specific,
- explicitly keep current UNIZDRAV retail candidates separate from reimbursement claims unless exact identity is proven,
- route Advisor reimbursement interest through a Zápraží explanation before official VZP/SÚKL sources.

Current official evidence checked 2026-10-07:
- VZP page processed 2026-09-29 describes shower/bath seats, shower chairs, shower wheelchairs, toilet chairs, toilet wheelchairs and combined toilet/shower chairs in the relevant compensation group,
- VZP states prior insurer approval and a 1-piece / 10-year frequency for that group,
- SÚKL publishes the official reimbursed-device list monthly for the following month and may issue corrective lists.

No exact UNIZDRAV product is labelled reimbursed.


### ZP-027 Safe bath-transfer branch
Status: **LIVE_PRODUCTION_0_8_14**

Unlocks one narrow bathtub branch that was previously professional-check only.

Automatic product selection is allowed only when all of these are explicit:
- general transfer is independent,
- user can sit on a stable bath seat and move both legs over the rim without physical assistance,
- the bath inner rim width is 41–65 cm,
- the seat can be securely fixed without movement,
- the 100 kg product load limit is confirmed as sufficient.

Verified production candidate:
- BESCO BES-BS008 — bath transfer seat with handle,
- merchant: RehabilitačníPomůcky.cz,
- direct-pay canonical fallback,
- separate affiliate runtime slot prepared but left empty until an exact publisher deeplink is supplied.

Fail-closed boundaries:
- physical help / lifting -> professional check,
- unknown transfer -> no product,
- bath does not fit -> no product,
- combined shower/toilet wheelchair remains professional-check only.

Evidence:
- current merchant specifications checked 2026-10-07,
- independent public guidance supports seated bath-board style transfer only with correct fit, secure use and appropriate transfer ability.

No diagnosis question and no raw health data were added.


### ZP-028 Raised WC with arm support
Status: **LIVE_PRODUCTION_0_8_15**

Unlocks the previously incomplete low-WC scenario where the person:
- does not need physical lifting by another person,
- but does need stable hand support while sitting down or standing up.

Verified product:
- BESCO BES-BS15 — raised toilet seat with removable arms,
- height increase 11.5 cm,
- max load 100 kg,
- direct-pay merchant route via RehabilitačníPomůcky.cz,
- empty affiliate runtime slot with canonical fallback.

Decision behavior:
- independent transfer + fit gates -> UNIZDRAV P2868,
- steadying transfer + fit gates -> BESCO BS15,
- physical-assistance transfer -> professional check,
- unknown/failed toilet fit, load fit or foot support -> no exact product.

No new personal/health question was needed; existing practical answers are sufficient.


### ZP-029 One aid for WC + shower
Status: **PACKAGED_IN_0_8_18**

New scenario:
- user wants one stable aid to cover both toilet and shower use,
- no physical lifting by another person,
- stable floor and sufficient space confirmed,
- product load limit confirmed.

Verified product:
- DMA EH-CMDA 4v1,
- direct retail route via approved advertiser Dr.Max,
- 51 cm total width, 40 cm depth,
- seat height 39–54 cm,
- max load 150 kg,
- one product can act as toilet chair, shower seat or WC-over-chair.

Exact reimbursement identity candidate:
- DMA states payer code 5019427,
- group 07.04.03.01,
- full reimbursement / insurer approval / 10-year service life on the manufacturer page,
- current effective monthly SÚKL list is not yet directly verified, so production does not claim current reimbursement.

Affiliate:
- runtime slot `drmax-cz:dma-eh-cmda`,
- canonical Dr.Max fallback until an exact publisher deeplink is supplied.

Fail-closed:
- physical assistance -> professional check,
- unstable floor -> no product,
- insufficient/unknown space -> no product,
- insufficient/unknown load fit -> no product.


### ZP-030 Bath transfer bench fallback
Status: **PACKAGED_IN_0_8_18**

Improves the bath-transfer branch when BESCO BS008 cannot be safely fitted to the bath rim.

New fallback:
- UNIZDRAV P2203,
- total footprint 81 × 61 cm,
- seat 68 × 41 cm,
- seat height 45.5–56 cm,
- max load 110 kg,
- one side stands inside the bath and the other on the stable floor outside.

Decision behavior:
- BS008 fits -> BS008,
- BS008 does not fit -> ask one additional placement-fit question,
- P2203 placement fits -> P2203,
- neither solution fits -> no exact product,
- physical-assistance transfer remains professional-check only.

Affiliate:
- runtime slot `unizdrav-cz:p2203`,
- canonical UNIZDRAV fallback until an exact publisher deeplink is supplied.

No diagnosis or raw health data added.


### ZP-031 Guarded product-level reimbursement evidence UI
Status: **PACKAGED_IN_0_8_19**

Adds a product-card reimbursement evidence block for products that have an exact payer identity candidate.

Current exact candidate:
- DMA EH-CMDA,
- manufacturer-stated code 5019427,
- manufacturer-stated reimbursement group 07.04.03.01,
- manufacturer states insurer approval and 10-year service life.

Production guardrail:
- current effective monthly SÚKL list remains unverified,
- UI must say **Aktuální seznam SÚKL: zatím neověřeno**,
- code/group information is shown as identity evidence, not as confirmation of current reimbursement or individual entitlement,
- direct link to the official SÚKL list is provided.

Verification attempt 2026-10-07:
- official SÚKL confirms that the public reimbursed-device list is the authoritative monthly source,
- ISZP public search exposes code filtering but its JS-dependent result table could not be safely retrieved by the available crawler,
- therefore `monthlySuklListVerified` remains false.

This converts an opaque internal evidence object into a useful user-facing next step without relaxing trust rules.


### ZP-032 Slice 3 Adjustable bed evidence + decision engine v0
Status: **DONE_CODE / UI_WIRED**

New Slice 3 foundation:
- exact product catalog for UNIZDRAV P2777 CLASSIC, P4707 Hospital and P4044 Multibed,
- practical decision branches for standard home positioning, caregiver access, robust/high-load use and advanced in-bed care,
- mandatory load-fit and space-fit gates,
- no raw body-weight entry,
- transfer ability used only as a practical caution, not diagnosis,
- short-term acquisition leads with local rental comparison,
- long-term acquisition leads with reimbursement / insurer-circulation check plus purchase comparison.

Current public evidence:
- VZP guidance updated 2024-01-10 describes prescription, prior insurer approval, max once per 10 years and possible circulation/loan regime for adjustable beds,
- current Czech charity rental examples show electric adjustable beds around 750–900 Kč/month, with transport/assembly varying locally,
- exact UNIZDRAV specs verified 2026-10-07.

Pre-UI affiliate slots planned:
- unizdrav-cz:p2777
- unizdrav-cz:p4707
- unizdrav-cz:p4044

Canonical merchant URLs remain the safe fallback; no deeplinks are fabricated.

See `docs/ADJUSTABLE_BED_EVIDENCE_V0.md`.


### ZP-033 Adjustable bed Advisor UI v1
Status: **PACKAGED_IN_0_8_20**

Adds:
- dedicated `/polohovaci-postel/` Home Advisor page,
- client-side adjustable-bed decision flow,
- practical branches for standard home positioning, caregiver access, robust/high-load and advanced in-bed care,
- exact fit guidance for load and room dimensions without collecting raw body weight,
- exact canonical product candidates:
  - UNIZDRAV P2777 CLASSIC,
  - UNIZDRAV P4707 Hospital,
  - UNIZDRAV P4044 Multibed,
- buy / rent / reimbursement-or-circulation acquisition paths,
- homepage and core-navigation entry points,
- non-destructive resource registry v6,
- separate affiliate readiness group for three bed slots.

Planned affiliate readiness after deploy:
- Mobility 3/3,
- Bathroom/WC 0/9,
- Polohovací postel 0/3.

No bed deeplinks are fabricated; canonical UNIZDRAV product URLs remain the safe fallback.


### ZP-034 Release 0.8.19 — Slice 3 first end-to-end high-ticket journey
Status: **SUPERSEDED_BY_0_8_20**

Release 0.8.19 supersedes 0.8.18.

It packages:
- all Bathroom/WC additions from 0.8.18,
- guarded EH-CMDA reimbursement identity card,
- Slice 3 adjustable-bed engine and evidence,
- live `/polohovaci-postel/` Advisor UI,
- three exact UNIZDRAV bed candidates,
- buy / rent / reimbursement-or-circulation acquisition paths,
- separate affiliate readiness group for beds,
- release-integrity coverage for `page-polohovaci-postel.php` and `assets/js/bed-advisor.js`.

Expected affiliate readiness after deployment:
- Mobility 3/3,
- Bathroom/WC 0/9,
- Polohovací postel 0/3.

No new affiliate deeplinks are generated in code. Empty bed slots use exact canonical UNIZDRAV fallbacks.


### ZP-035 Adjustable bed high-intent acquisition page
Status: **PACKAGED_IN_0_8_21**

Adds:
- `/polohovaci-postel-na-pojistovnu/`,
- one combined decision page for insurer reimbursement/circulation, local rental and direct purchase,
- current VZP process evidence,
- current SÚKL monthly-list boundary,
- current public rental examples checked 2026-10-07:
  - Charita Studénka: 750 Kč/month, 2,000 Kč deposit,
  - Charita sv. Martina: 900 Kč/month, 500 Kč bed transport including assembly,
  - Oblastní charita Třebíč: 40 Kč/day + 130 Kč one-time fee; assembly 600 Kč; transport 19 Kč/km,
- direct CTA into the Slice 3 Advisor,
- visible FAQ + matching FAQPage structured data,
- non-destructive resource registry v7.

Trust boundary:
- does not determine medical indication,
- does not confirm individual reimbursement entitlement,
- does not claim any current retail UNIZDRAV candidate is reimbursed until exact current SÚKL identity is proven,
- rental examples are explicitly local and time-sensitive.


### ZP-036 Release 0.8.20 — Slice 3 acquisition SEO path
Status: **SUPERSEDED_BY_0_8_21**

Release 0.8.20 supersedes 0.8.19 and adds:
- `/polohovaci-postel-na-pojistovnu/`,
- combined insurer / circulation / rental / purchase decision page,
- current rental examples with explicit locality and date boundaries,
- VZP/SÚKL source routing,
- FAQPage schema matching visible FAQs,
- direct internal link from the adjustable-bed Advisor,
- deployment-integrity coverage for the new resource page.

No retail bed is labelled reimbursed without exact current SÚKL identity.


### ZP-037 Slice 4 Wheelchair evidence + decision engine v0
Status: **DONE_CODE / UI_WIRED**

New Slice 4 foundation:
- practical first split by who normally propels the wheelchair:
  - companion,
  - self-propelled manual,
  - mixed self + companion,
  - powered joystick,
- no diagnosis-based routing,
- mandatory seat-fit, route-width and load-fit gates,
- powered branch additionally requires safe joystick use and charging/parking readiness,
- person-assisted transfer remains professional-check only because wheelchair choice alone does not solve transfer safety.

Verified production candidates:
- UNIZDRAV P4384 Basic — companion / simple transport,
- UNIZDRAV P3641 lightweight manual with self-propulsion rims + companion brakes,
- UNIZDRAV P2961 powered wheelchair, seat 46 cm.

Acquisition:
- short-term -> rental comparison first,
- long-term -> insurer route first,
- VZP evidence records that most wheelchairs remain insurer property and are loaned to the insured person,
- electric-wheelchair reimbursement remains a higher-complexity insurer/professional path.

Planned affiliate slots after UI exists:
- `unizdrav-cz:p4384`
- `unizdrav-cz:p3641`
- `unizdrav-cz:p2961`

No deeplinks fabricated; canonical merchant URLs remain the safe fallback.

See `docs/WHEELCHAIR_EVIDENCE_V0.md`.


### ZP-038 Wheelchair Advisor UI v1
Status: **PACKAGED_IN_0_8_22**

Adds:
- dedicated `/invalidni-vozik/` Home Advisor page,
- client-side propulsion-first decision flow,
- branches for companion transport, self-propelled/mixed manual and powered joystick,
- mandatory seat-fit, route-width and load-fit checks without collecting raw body weight,
- powered-only joystick-safety and charging-readiness questions,
- exact candidates:
  - UNIZDRAV P4384 Basic,
  - UNIZDRAV P3641 lightweight manual,
  - UNIZDRAV P2961 powered wheelchair,
- insurer / rental / purchase acquisition paths,
- homepage and core-navigation entry points,
- non-destructive resource registry v8,
- separate affiliate readiness group for three wheelchair slots.

Planned affiliate readiness after deploy:
- Mobility 3/3,
- Bathroom/WC 0/9,
- Polohovací postel 0/3,
- Invalidní vozík 0/3.

No wheelchair deeplinks are fabricated; canonical UNIZDRAV URLs remain the safe fallback.


### ZP-039 Release 0.8.21 — Slice 4 first end-to-end wheelchair journey
Status: **SUPERSEDED_BY_0_8_22**

Release 0.8.21 supersedes 0.8.20.

It packages:
- all 0.8.20 Slice 3 acquisition content,
- Slice 4 wheelchair evidence and engine,
- live `/invalidni-vozik/` Advisor UI,
- three exact UNIZDRAV wheelchair candidates,
- companion / self-manual / mixed-manual / powered routing,
- powered-only joystick and charging gates,
- insurer / rental / purchase acquisition logic,
- separate affiliate readiness group for wheelchairs,
- deployment-integrity coverage for `page-invalidni-vozik.php` and `assets/js/wheelchair-advisor.js`.

Expected affiliate readiness after deployment:
- Mobility 3/3,
- Bathroom/WC 0/9,
- Polohovací postel 0/3,
- Invalidní vozík 0/3.

No wheelchair deeplinks are generated in code. Empty slots use exact canonical UNIZDRAV fallbacks.


### ZP-040 Wheelchair high-intent acquisition page
Status: **PACKAGED_IN_0_8_23**

Adds:
- `/invalidni-vozik-na-pojistovnu/`,
- one combined decision page for insurer / circulation, local rental and direct purchase,
- VZP mechanical-wheelchair application evidence,
- VZP electric-wheelchair extra-documentation boundary,
- SÚKL monthly-list boundary,
- current public rental examples checked 2026-10-07:
  - Charita sv. Martina: mechanical wheelchair 300 Kč/month,
  - Charita Odry: mechanical wheelchair 360 Kč,
  - Charita Veselí nad Moravou: mechanical wheelchair 420 Kč/month,
- direct CTA into the Slice 4 Advisor,
- visible FAQ + matching FAQPage structured data,
- non-destructive resource registry v9.

Trust boundary:
- does not determine medical indication,
- does not confirm individual reimbursement entitlement,
- does not label P4384, P3641 or P2961 reimbursed without exact current SÚKL identity,
- rental examples are explicitly local and time-sensitive.


### ZP-041 Release 0.8.22 — Slice 4 acquisition SEO path
Status: **SUPERSEDED_BY_0_8_23**

Release 0.8.22 supersedes 0.8.21.

It packages:
- full Slice 4 wheelchair Advisor,
- `/invalidni-vozik-na-pojistovnu/`,
- VZP mechanical-wheelchair process,
- electric-wheelchair extra-documentation boundary,
- current local rental examples,
- SÚKL monthly-list boundary,
- FAQPage schema,
- direct internal link from wheelchair Advisor,
- deployment-integrity coverage for the new acquisition page.

No retail wheelchair is labelled reimbursed without exact current SÚKL identity.


### ZP-042 Slice 5 Return home after hospital foundation
Status: **DONE_CODE / UI_WIRED**

New orchestration layer:
- question: what must be solved before the first night at home after hospital discharge,
- reuses existing Mobility, Bathroom/WC, Adjustable Bed and Wheelchair Advisors,
- no new product catalog,
- no diagnosis / operation / wound / medication / exact-weight collection.

Practical inputs:
- discharge timing,
- entrance readiness,
- transfer ability,
- walking mode,
- WC readiness,
- bathroom readiness,
- bed readiness,
- wheelchair readiness when walking is insufficient,
- whether home health care is arranged / needed / unknown.

Hard blockers:
- unsafe entrance route,
- physical person-assisted transfer without a resolved transfer plan.

Official evidence:
- NZIP: hospital treating physician can indicate home health care for 14 days after hospitalization; continuation after that is handled by the registering GP,
- SÚKL: ePoukaz is standard from 1 Jan 2026,
- SÚKL monthly Seznam ZP remains the product-level reimbursement authority.

First-night priority:
1. entrance,
2. transfer,
3. WC,
4. bed,
5. required home health care.

The engine never decides medical fitness for discharge and never converts a shopping problem into a medical recommendation.

See `docs/RETURN_HOME_EVIDENCE_V0.md`.


### ZP-043 Return-home Advisor UI v1
Status: **READY_DEPLOY_0_8_23**

Adds:
- dedicated `/navrat-z-nemocnice/` orchestration page,
- nine practical questions only,
- client-side first-night readiness plan,
- hard-blocker presentation for unsafe entrance and physical person-assisted transfer,
- links into existing Mobility, Bathroom/WC, Adjustable Bed and Wheelchair Advisors,
- official NZIP explanation that hospital physician can indicate home health care for 14 days after hospitalization,
- SÚKL 2026 ePoukaz boundary,
- homepage and core-navigation entry points,
- non-destructive resource registry v10.

Commercial behavior:
- no products rendered directly,
- no affiliate links,
- no merchant ranking,
- blocked cases show the safety/discharge action before any category routing.

Privacy:
- no diagnosis,
- no operation type,
- no wound details,
- no medication list,
- no exact body weight,
- only generic analytics events.


### ZP-044 Release 0.8.23 — Return-home orchestration
Status: **READY_DEPLOY**

Release 0.8.23 supersedes 0.8.22.

It packages:
- all Slice 4 Advisor + acquisition content,
- Slice 5 return-home evidence and engine,
- live `/navrat-z-nemocnice/` first-night orchestration UI,
- hard blockers for unsafe entrance and unresolved physical person-assisted transfer,
- routing into Mobility, Bathroom/WC, Adjustable Bed and Wheelchair Advisors,
- NZIP 14-day post-discharge home-health-care guidance,
- 2026 ePoukaz acquisition boundary,
- homepage/core-navigation entry points,
- deployment-integrity coverage for `page-navrat-z-nemocnice.php` and `assets/js/return-home-advisor.js`.

Commercial rule:
- the return-home page contains no product cards, merchant links or affiliate ranking.


### ZP-045 ADL / daily self-care micro-slice foundation
Status: **DONE_CODE / UI_WIRED**

First RehaVita-backed ADL foundation:
- narrow practical scope only: drinking, stabilizing a container and one-hand meal setup,
- exact RehaVita candidates:
  - UpCup 15-050101,
  - Beat It 15-050102,
  - Theomatik 15-050103,
- no diagnosis-based routing,
- no operation / wound / medication / exact-body-weight collection,
- swallowing/medical concern fails closed to professional check with no product,
- Beat It requires a stable work surface,
- Theomatik requires one-hand use to be confirmed before automatic candidate status,
- affiliate approval never forces a recommendation.

Current evidence checked 2026-10-07:
- RehaVita self-care category exposes all three candidates as in stock,
- exact UpCup and Beat It product pages verified,
- Theomatik exact product page re-verified; dimensions 36.5 × 18.8 × 3 cm, weight 900 g, foldable design and dishwasher suitability recorded.

Commercial state:
- no affiliate deeplink yet,
- no commission-based ranking,
- no reimbursement claim,
- canonical/product routing is added only after UI and exact product evidence are complete.

See `docs/ADL_SELF_CARE_EVIDENCE_V0.md`.

Next:
- deploy and smoke ADL Advisor UI v1,
- fill three isolated affiliate runtime slots only with exact publisher-specific deeplinks,
- review early query/CTR evidence before expanding the ADL catalog.


### ZP-046 ADL self-care Advisor UI v1
Status: **READY_DEPLOY_NEXT_RELEASE**

Adds:
- dedicated `/sobestacnost/` Advisor page,
- four practical inputs only: task, main obstacle, stable work surface when relevant, one-hand use when relevant,
- exact RehaVita candidates:
  - UpCup 15-050101,
  - Beat It 15-050102,
  - Theomatik 15-050103,
- exact canonical merchant fallbacks,
- three isolated affiliate runtime slots,
- no affiliate ranking influence,
- no diagnosis / operation / medication / exact-weight collection,
- swallowing or choking concern fails closed with no product and a professional-check message,
- fit-check states do not expose the merchant CTA as the next action,
- homepage and core-navigation entry points,
- non-destructive resource registry v11.

Verified 2026-10-07:
- RehaVita lists all three products in stock,
- exact Theomatik product page is live,
- Theomatik dimensions are 36.5 × 18.8 × 3 cm and weight 900 g according to RehaVita.

Affiliate readiness after deploy:
- Soběstačnost starts at 0/3 unless exact publisher deeplinks are entered in WordPress admin.
- Empty slots use verified canonical RehaVita product URLs.


### ZP-047 Release 0.8.24 — ADL self-care journey
Status: **SUPERSEDED_BY_0_8_25**

Release 0.8.24 supersedes 0.8.23.

It packages:
- dedicated `/sobestacnost/` Advisor UI,
- UpCup / Beat It / Theomatik exact candidate identities,
- exact Theomatik product URL and verified fit dimensions,
- fail-closed swallowing / choking professional-check boundary,
- stable-surface gate for Beat It,
- one-hand-use gate for Theomatik,
- three separate RehaVita affiliate runtime slots with canonical fallbacks,
- homepage and core-navigation entry points,
- non-destructive resource registry v11,
- deployment-integrity coverage for `page-sobestacnost.php` and `assets/js/adl-advisor.js`.

Expected affiliate readiness after deployment:
- Soběstačnost 0/3 until exact publisher deeplinks are entered.

Commercial rule:
- affiliate availability never changes product suitability or ranking,
- fit-check and professional-check states must not become shopping-first flows.


### ZP-048 Core scenario internal-link architecture
Status: **DONE_CODE**

Adds navigational cross-links without mixing decision logic:
- Return-home page points to Soběstačnost only after the critical first-night section.
- Soběstačnost links back to Mobility, Bathroom/WC, Adjustable Bed, Wheelchair and Return-home.
- Return-home engine remains product-free and contains no RehaVita candidate logic.
- The goal is to reduce dead ends and strengthen topical relationships between the six core user scenarios.

No new affiliate ranking or health-data collection is introduced.


### ZP-049 Homepage core-scenario hub
Status: **DONE_CODE**

Repositions the homepage from a Mobility-only entry point into the six-scenario Zápraží hub:
- Chůze a opora,
- Koupelna a WC,
- Polohovací postel,
- Invalidní vozík,
- Návrat z nemocnice,
- Každodenní soběstačnost.

The existing Mobility Advisor remains fully on the homepage below the hub, preserving the original end-to-end walking-aid journey and content.

Brand text is aligned with the approved direction:
- public wordmark text: **Zápraží**,
- claim: **Cesta k lepšímu životu**,
- homepage SEO now describes the broader decision platform instead of only chodítka/rollátory.

The graphical logo asset remains a separate brand-only implementation step.


### ZP-050 Global core-advisor footer navigation
Status: **DONE_CODE**

Adds all six core Zápraží decision journeys to the global footer:
- Mobility,
- Bathroom/WC,
- Adjustable Bed,
- Wheelchair,
- Return from hospital,
- Daily self-care.

This makes the new decision architecture reachable from legacy posts, archives and other non-core pages without replacing the low-prominence legacy crawl paths.

Footer brand text is aligned to **Zápraží**. The legacy archive links remain preserved.


### ZP-051 RehaVita VIV deeplink readiness
Status: **READY_FOR_PUBLISHER_LINKS**

Confirmed account context:
- RehaVita.cz is approved through VIVnetworks/CJ,
- advertiser ID **18119967**,
- three exact ADL target URLs are already mapped.

Admin now shows the VIV advertiser identity next to each RehaVita slot and explains the safe generation path:
- open the exact product,
- use CJ Deep Link Generator / current Chrome extension,
- paste only the generated publisher-specific link,
- never manually compose tracking parameters.

No affiliate URL has been fabricated. Canonical RehaVita fallbacks remain active until the exact links are supplied.


### ZP-052 Production logo support
Status: **DONE_CODE / ASSET_UPLOAD_PENDING**

Theme now supports WordPress custom logos:
- custom-logo theme support enabled,
- header renders the configured logo when present,
- text fallback remains **Zápraží**,
- responsive size limits are defined for desktop and mobile,
- the approved claim remains separate text: **Cesta k lepšímu životu**.

Prepared from the approved brand board:
- light horizontal logo crop,
- dark horizontal logo crop,
- square icon crop.

The graphical files are intentionally not embedded as base64 or fabricated in code. A clean WordPress media/custom-logo upload is the final asset step.


### ZP-053 Release 0.8.25 — Brand + core scenario hub
Status: **READY_DEPLOY**

Release 0.8.25 supersedes 0.8.24 and packages all ADL work plus the next structural layer:
- six-scenario homepage hub while retaining the full Mobility Advisor,
- public brand text **Zápraží**,
- claim **Cesta k lepšímu životu**,
- self-care ↔ return-home/core-advisor internal links,
- global footer links to all six core journeys,
- RehaVita VIV/CJ advertiser helper for advertiser **18119967**,
- native WordPress custom-logo support with text fallback,
- deployment-integrity coverage bumped to 0.8.25,
- updated deployment smoke checklist.

Commercial rules remain unchanged:
- suitability before merchant,
- canonical fallback when affiliate slot is empty,
- no manually fabricated tracking links,
- no affiliate influence on recommendation ranking.

Post-deploy manual asset step:
- upload the approved horizontal logo as WordPress custom logo,
- upload the prepared square icon as Site Icon.


### ZP-054 Release 0.8.26 — Public brand consistency
Status: **SUPERSEDED_BY_0_8_27**

Release 0.8.26 supersedes 0.8.25.

Adds:
- all public-facing ZaPrazi / ZaPrazi.cz copy normalized to **Zápraží**,
- SEO titles, FAQ/schema answers, disclosure text and admin labels aligned,
- WordPress database blog name already changed to **Zápraží**,
- WordPress tagline already changed to **Cesta k lepšímu životu**.

Compatibility boundary:
- internal JS identifiers `ZaPraziAnalyticsConfig` and `ZaPraziRuntime` intentionally remain unchanged,
- no decision logic, affiliate routing or analytics payload structure changes.

Post-deploy:
- upload approved graphical logo via WordPress custom-logo control,
- set square Site Icon,
- smoke core scenarios and brand copy.


### ZP-055 ADL Open-It extension
Status: **DONE_CODE / RELEASE_NEXT**

Adds one additional narrow self-care problem instead of broadening the catalog:
- task: opening normal household packaging / closures,
- practical blocker: insufficient grip, twisting or pulling,
- exact candidate: **MVS Open-It 5 v 1**, SKU **15-050105**,
- RehaVita.cz canonical URL verified 2026-10-07,
- current merchant state at verification: in stock, 495 Kč,
- product weight 60 g.

Supported production use:
- screw-cap bottles,
- can pull-tabs,
- zipper pulls,
- normal packaging.

Explicit safety boundary:
- merchant documentation mentions medication blisters, but Zápraží does not use medication/blister handling as a recommendation trigger,
- no medication choice, identification, dosage or safety advice is generated.

Affiliate:
- new isolated slot `rehavita-cz:open-it-15-050105`,
- VIV/CJ advertiser remains 18119967,
- empty slot falls back to the exact canonical RehaVita URL,
- recommendation order remains independent of affiliate readiness.

This changes Soběstačnost from 3 to 4 exact commercial slots without adding diagnosis or health-data collection.


### ZP-056 Release 0.8.27 — Brand consistency + Open-It
Status: **SUPERSEDED_BY_0_8_28**

Release 0.8.27 supersedes 0.8.26 and is the next deployment target after production 0.8.25.

Packages:
- full public brand normalization to **Zápraží**,
- WordPress blog name/tagline already set to Zápraží / Cesta k lepšímu životu,
- ADL Open-It branch for normal household packaging and closures,
- exact candidate MVS Open-It 15-050105,
- fourth RehaVita VIV/CJ affiliate runtime slot,
- medication advice explicitly excluded,
- deployment-integrity contract and smoke checklist bumped to 0.8.27.

Expected Soběstačnost affiliate readiness:
- 0/4 until exact publisher deeplinks are supplied.


### ZP-057 Self-care SEO authority layer
Status: **DONE_CODE / RELEASE_NEXT**

Strengthens `/sobestacnost/` as the search landing page instead of creating a duplicate article.

Adds:
- SEO title focused on **pomůcky pro soběstačnost seniorů**,
- meta description covering the four current practical jobs,
- explicit selection method: task first, diagnosis/age never as the primary selector,
- visible FAQ section,
- matching FAQPage schema from the same four questions,
- official NZIP link for the dysphagia / swallowing safety boundary.

SEO intent:
- compete with catalog-heavy results by combining educational intent + decision tool + exact fit/safety logic,
- avoid a separate duplicate `/pomucky-pro-sobestacnost/` page that would cannibalize the Advisor.

Commercial boundary:
- no extra product is added by the SEO layer,
- affiliate ranking remains separate from suitability,
- swallowing difficulty remains professional-check only.


### ZP-058 Release 0.8.28 — Self-care SEO authority
Status: **SUPERSEDED_BY_0_8_29**

Release 0.8.28 supersedes 0.8.27 and is the next deployment target after production 0.8.25.

Packages:
- everything from 0.8.27,
- public brand consistency,
- Open-It ADL packaging branch,
- self-care SEO title/meta targeting `pomůcky pro soběstačnost seniorů`,
- task-first explanatory content,
- four visible FAQ items,
- matching FAQPage schema,
- official NZIP dysphagia safety source,
- release-integrity contract and smoke checklist bumped to 0.8.28.

No duplicate SEO landing page is created; `/sobestacnost/` remains the single canonical decision surface.


### ZP-059 Kompenzační pomůcky SEO hub
Status: **DONE_CODE / RELEASE_NEXT**

Adds a broad acquisition surface at `/kompenzacni-pomucky-pro-seniory/` without turning Zápraží into a generic catalog.

Purpose:
- target the broad search intent **kompenzační pomůcky pro seniory**,
- route visitors into the six existing decision journeys,
- separate buy / rent / insurer paths,
- explain the 2026 ePoukaz boundary with official SÚKL sources,
- explain that some compensatory medical devices can be reimbursed only under concrete conditions.

Official evidence checked 2026-10-07:
- SÚKL: ePoukaz is standard from 1 Jan 2026,
- SÚKL: ePoukaz itself does not change prices or reimbursement,
- VZP page processed 29 Sep 2026 describes selected compensatory aids and approval/prescription conditions.

SEO architecture:
- exact-intent title and H1,
- five visible FAQs + matching FAQPage schema,
- links from homepage and global footer,
- resource registry v12,
- no product catalog or merchant ranking on the broad page.

See `docs/COMPENSATORY_AIDS_EVIDENCE_V0.md`.


### ZP-060 Release 0.8.29 — Compensatory aids SEO hub
Status: **SUPERSEDED_BY_0_8_30**

Release 0.8.29 supersedes 0.8.28.

Packages:
- everything from 0.8.28,
- new `/kompenzacni-pomucky-pro-seniory/` broad SEO decision hub,
- six-way routing to existing Advisors,
- buy / rent / insurer separation,
- official SÚKL/VZP 2026 evidence,
- visible FAQ + matching FAQPage schema,
- homepage + footer internal links,
- resource registry v12,
- release integrity now covers the new page.

No broad product catalog, diagnosis-first routing or merchant ranking is introduced.


### ZP-061 Safe-home senior audit
Status: **DONE_CODE / RELEASE_NEXT**

Adds `/bezpecny-byt-pro-seniora/` for the distinct intent **jak upravit byt pro seniora**.

The page is not a generic product list. It audits:
- entrance,
- bed → WC route,
- toilet,
- bathroom,
- walking paths,
- bed surroundings.

Official NZIP evidence covers:
- removable trip hazards,
- night lighting,
- anti-slip bathroom measures,
- appropriate walking aids,
- fall-risk prevention in older adults.

The page routes to all six existing Advisors and is linked from:
- compensatory aids hub,
- return-home journey,
- global footer.

Resource registry advances to v13.

See `docs/SAFE_HOME_SENIOR_EVIDENCE_V0.md`.


### ZP-062 Release 0.8.30 — Safe-home senior audit
Status: **SUPERSEDED_BY_0_8_31**

Release 0.8.30 supersedes 0.8.29.

Packages:
- everything from 0.8.29,
- new `/bezpecny-byt-pro-seniora/` audit,
- NZIP fall-prevention evidence,
- route-first audit of entrance, bed → WC, bathroom and walking paths,
- links into all six existing decision Advisors,
- visible FAQ + matching FAQPage schema,
- internal links from compensatory hub, return-home and global footer,
- resource registry v13,
- release integrity includes the new template.

No product catalog, diagnosis-first routing or merchant ranking is introduced.


### ZP-063 Easy-footwear Advisor
Status: **DONE_CODE / RELEASE_NEXT**

Adds a narrow new commercial slice at `/obuv-pro-seniory/` using the approved Zdravá Obuv merchant.

Decision inputs are practical only:
- required opening size,
- open vs closed toe,
- ability to use Velcro,
- confirmation that both feet were measured.

Exact candidates verified 2026-10-07:
- PodoWell ARSENE — width J, two Velcro straps, open toe, 1,650 Kč,
- PodoWell XAVIER — width K+, large opening, closed toe, 1,660 Kč,
- PodoWell ALTITUDE — multi-side opening, closed toe, ankle height, 1,840 Kč.

Safety boundary:
- no diagnosis, diabetes, medication or cause-of-swelling questions,
- sudden size/shape change, wound, strong pain or rapid swelling is not treated as a shopping problem,
- measurement and Velcro handling are required before merchant CTA becomes shopping-first.

Commercial:
- three isolated affiliate slots with canonical Zdravá Obuv fallbacks,
- merchant approval does not affect suitability,
- no fabricated tracking links.

Resource registry advances to v14.


### ZP-064 Release 0.8.31 — Easy-footwear Advisor
Status: **SUPERSEDED_BY_0_8_32**

Release 0.8.31 supersedes 0.8.30.

Packages:
- everything from 0.8.30,
- new `/obuv-pro-seniory/` Advisor,
- practical fit-only routing,
- exact Zdravá Obuv candidates ARSENE / XAVIER / ALTITUDE,
- measurement gate before merchant CTA,
- three canonical-fallback affiliate slots,
- links from safe-home audit and global footer,
- resource registry v14,
- release integrity includes `page-obuv-pro-seniory.php` and `assets/js/footwear-advisor.js`.

No diagnosis-first routing, treatment claims or commission-based recommendation order is introduced.


### ZP-065 Toilet-riser high-intent micro-Advisor
Status: **DONE_CODE / RELEASE_NEXT**

Adds `/nastavec-na-wc-pro-seniory/` for the high-intent query cluster around WC risers.

Architecture:
- reuses the existing Bathroom/WC decision engine with `primaryNeed = raise_toilet`,
- does not create parallel suitability logic,
- asks only transfer ability, WC fit, feet-on-floor after raising, load fit and optional duration.

Exact outcomes:
- independent transfer → UNIZDRAV P2868 candidate after fit/safety gates,
- stable arm support needed → BESCO BS15 candidate after the same gates,
- physical person-assist → no automatic product recommendation.

SEO / UX:
- dedicated title/meta,
- four visible FAQs + matching FAQPage schema,
- links from Bathroom/WC Advisor, insurer guide and compensatory-aids hub,
- resource registry v15.

Commercial:
- reuses existing affiliate slots `unizdrav-cz:p2868` and `rehabilitacni-pomucky-cz:besco-bs15`,
- no new affiliate mapping or merchant ranking,
- canonical fallbacks stay intact.


### ZP-066 Release 0.8.32 — Toilet-riser high-intent micro-Advisor
Status: **SUPERSEDED_BY_0_8_33**

Release 0.8.32 supersedes 0.8.31.

Packages:
- everything from 0.8.31,
- new `/nastavec-na-wc-pro-seniory/` high-intent micro-Advisor,
- reuse of existing Bathroom decision engine and product catalog,
- UNIZDRAV P2868 vs BESCO BS15 routing,
- fit / feet-on-floor / load / transfer gates,
- FAQ + schema + internal links,
- resource registry v15,
- release integrity includes `page-nastavec-na-wc-pro-seniory.php` and `assets/js/toilet-riser-advisor.js`.

No second suitability engine, duplicate affiliate slots or reimbursement shortcut is introduced.


### ZP-067 Shower-chair high-intent micro-Advisor
Status: **DONE_CODE / RELEASE_NEXT**

Adds `/sprchovaci-zidle-pro-seniory/` for the high-intent shower-chair query cluster.

Architecture:
- reuses the existing Bathroom/WC engine with `primaryNeed = shower_seated`,
- asks only transfer ability, stable floor, space fit, load fit and optional duration,
- does not create a second shower suitability engine.

Exact candidate:
- UNIZDRAV P2062,
- total width 55 cm,
- total depth 48 cm,
- seat height 38–50.5 cm,
- seat 40 × 33 cm,
- max user weight 136 kg,
- product page rechecked 2026-10-07: in stock >10, listed at 1,618 Kč.

Safety:
- physical person-assist blocks automatic product recommendation,
- unstable floor, insufficient space or unverified load fit prevents shopping-first CTA.

Commercial:
- reuses existing affiliate slot `unizdrav-cz:p2062`,
- canonical fallback remains active,
- insurer path stays separate.

SEO / UX:
- dedicated title/meta,
- four visible FAQs + matching FAQPage schema,
- links from Bathroom/WC, insurer guide and compensatory-aids hub,
- resource registry v16.


### ZP-068 Release 0.8.33 — Shower-chair high-intent micro-Advisor
Status: **SUPERSEDED_BY_0_8_34**

Release 0.8.33 supersedes 0.8.32.

Packages:
- everything from 0.8.32,
- new `/sprchovaci-zidle-pro-seniory/` high-intent micro-Advisor,
- reuse of existing Bathroom decision engine and product catalog,
- exact UNIZDRAV P2062 candidate,
- transfer / floor / space / load gates,
- FAQ + schema + internal links,
- resource registry v16,
- release integrity includes `page-sprchovaci-zidle-pro-seniory.php` and `assets/js/shower-chair-advisor.js`.

No second suitability engine, duplicate affiliate slot or reimbursement shortcut is introduced.


### ZP-069 Toilet-chair high-intent micro-Advisor
Status: **DONE_CODE / RELEASE_NEXT**

Adds `/toaletni-zidle-pro-seniory/` for the high-intent toilet-chair query cluster.

Decision split:
- static toilet chair nearby → existing `toilet_nearby` Bathroom branch,
- one chair for toilet + shower → existing `multifunction_toilet_shower` branch.

Exact candidates:
- UNIZDRAV P2807 — 60 cm width, 44 cm seat, 36–60 cm seat height, 100 kg max load,
- DMA EH-CMDA 4v1 — 51 cm width, 39–54 cm seat height, 150 kg max load.

Commercial:
- reuses existing `unizdrav-cz:p2807` and `drmax-cz:dma-eh-cmda` slots,
- no duplicate affiliate mapping,
- insurer route remains separate.

Regression fix bundled with this slice:
- repaired `zaprazi_2_assets()` after FAQ branches had been accidentally inserted into the module-enqueue chain,
- restored deterministic enqueue for ADL, footwear, toilet-riser and shower-chair Advisors,
- moved toilet-riser and shower-chair FAQ content into `zaprazi_2_resource_faq_schema()`,
- added structural tests that forbid FAQ payload inside the asset loader.

Resource registry advances to v17.


### ZP-070 Release 0.8.34 — Toilet-chair Advisor + asset-loader hotfix
Status: **DEPLOYED**

Release 0.8.34 supersedes 0.8.33.

Packages:
- everything from 0.8.33,
- new `/toaletni-zidle-pro-seniory/` high-intent micro-Advisor,
- static P2807 vs multifunction DMA EH-CMDA routing,
- transfer / floor / space / load gates,
- FAQ + schema + internal links,
- resource registry v17,
- release integrity includes the new toilet-chair page and JS,
- structural repair of `zaprazi_2_assets()`,
- restored explicit enqueue branches for ADL, footwear, toilet-riser and shower-chair,
- bathroom micro-page FAQs moved to `zaprazi_2_resource_faq_schema()`,
- regression tests preventing FAQ payload from re-entering the asset loader.

This release is a functional hotfix as well as a new acquisition slice and should replace production 0.8.33 as soon as practical.


### ZP-071 Toilet-support high-intent micro-Advisor
Status: **DONE_CODE / RELEASE_NEXT**

Adds `/madlo-k-wc-pro-seniory/` for the high-intent query cluster around WC grab rails and support frames.

Decision:
- confirmed safe wall fixing → compare fixed UNIZDRAV P2131 + support-frame alternative,
- wall fixing unverified / impossible → do not recommend the wall rail; keep UNIZDRAV P2015 as the structural alternative,
- person-assist or unverified load fit still fails closed through the existing Bathroom engine.

Exact candidates:
- P2015 toaletní opora — width 53–63 cm, depth 47 cm, height 64–74 cm, max load 100 kg,
- P2131 fixed anti-slip rail — 30 / 40 / 45 cm variants, 5.5 cm wall offset, max product load 100 kg.

Commercial:
- reuses existing `unizdrav-cz:p2015` and `unizdrav-cz:p2131` slots,
- no duplicate merchant logic.

SEO / UX:
- dedicated title/meta,
- four visible FAQs + matching resource FAQ schema,
- links from Bathroom/WC, insurer guide, compensatory hub and footer,
- resource registry v18.


### ZP-072 Bath-transfer high-intent micro-Advisor
Status: **DONE_CODE / RELEASE_NEXT**

Adds `/sedatko-do-vany-pro-seniory/` for the high-intent bathtub-seat query cluster.

Decision:
- confirmed independent transfer + bath fit 41–65 cm → BESCO BS008 seat-over-bath candidate,
- seat-over-bath does not fit + 81 × 61 cm transfer construction fits → UNIZDRAV P2203 transfer-bench candidate,
- person-assist or non-independent leg transfer fails closed.

Exact candidates:
- BESCO BS008 — seat 69 × 31 cm, bath inner width 41–65 cm, max load 100 kg,
- UNIZDRAV P2203 — footprint 81 × 61 cm, seat 68 × 41 cm, seat height 45.5–56 cm, max load 110 kg; rechecked 2026-10-07 at 2,118 Kč and >10 units in stock.

Commercial:
- reuses existing `rehabilitacni-pomucky-cz:besco-bs008` and `unizdrav-cz:p2203` slots.

SEO / UX:
- dedicated title/meta,
- four visible FAQs + matching resource FAQ schema,
- links from Bathroom/WC, insurer guide, compensatory hub and footer,
- resource registry v19.
