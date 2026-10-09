# Decision engine / sales UX audit — Zápraží 2.0 (2026-10-09)

## What was checked
- All 14 interactive Advisor entrypoints: main mobility/bathroom/bed/wheelchair, indoor walker, rollator, five Bathroom/WC micro advisors, ADL, footwear and return-home planning.
- The corresponding pure JS decision engines and two-stage product preview helpers.
- Input validation, hard safety gates, real product catalog ID-to-product mapping, source presence and offer fallback.
- Preview vs actual-fit decision separation, immediate result invalidation on answer changes, per-model affiliate CTA gating.
- WordPress production: 0.8.60 release and integrity OK; 25/25 partner slots configured, not evidence of paid orders.

## Priority findings and actions
1. **P0 stale result CTAs**: past merchant links remained visible after someone modified the answer they were based on. Fixed across all 14 UI forms: on every input change remove/hide previous recommendation and outbound links.
2. **P0 inconsistent wheelchair safety**: unknown transfer ability was blocked by preview UI but not by underlying engine when technical answers were artificially all "yes". Added explicit fail-closed branch directly to wheelchair engine.
3. **P1 ambiguous bathroom WC support models**: "verified wall fixing" used to return two different products from a single load-fit confirmation. Enforced exactly one construction by scenario; wall rail only with verified fixing, otherwise freestanding toilet support.
4. **P0 mobility last-mile fit**: general ability to use walker/brakes did not prove a *specific* product's capacity, width, and safe handle-height fit; merchant offers visible too early. Each actual product card now starts with facts and requires three model-specific checkboxes before enabling offer display; revoking any checkbox locks it again. Never send fit responses to GA4 or affiliate networks.
5. **P1 model-variant clarity**: refined wheelchair size/load questions, bed maximum user weight vs whole frame capacity, and bathtub BESCO 100kg vs transfer bench 110kg.

## Automated coverage
- Safety decision matrices: wheelchair unknown/assisted transfer, powered joystick, bed load and space, bathroom assistance/load/floor safety, rollator brakes, swallowing risk.
- Every Advisor has a change listener invalidating old retailer buttons.
- Product-specific merchant locks: three checks required independently per product; revocation locks; no pre-approval commerce.
- At least 20 major candidate scenarios checked against their production-eligible model, real source evidence/date and merchant destination.
- Existing tests cover stage-1/2 actual event flow, and no health answer or link payload in custom GA events.
- CI runs node test suite, syntax check of all JS, PHP lint, release-integrity contracts.

## Important limitations and follow-up
- Checkbox confirmation is *self-reported*: it cannot prove real physical fit; users must measure and check manufacturer instructions. Individual seating, transfer, mounting and regulatory suitability may require professional assessment.
- Some products offer size/width/wheel variants within a catalog model; buyer must select exact matching variant at merchant. A future dedicated variant selector could improve this if usage data justifies it.
- Verified product source check dates are not promises of current availability, price or brand-new technical certification. Refresh aged manufacturer/manual evidence before making stronger claims.
- End-to-end real mobile/desktop browser tests and usability with family caregivers remain necessary; DOM contract tests alone do not prove flawless UX.
- Affiliate URLs are configured 25/25 in WordPress, but affiliate-network attribution and confirmed commission data are unverified. Do not interpret a click as an order.
- Test on production after deploy: candidate with changed answers, unknown wheelchair transfer, WC rail based on fixing, each locked mobility offer, keyboard use and sticky/mobile layout.


## Second-pass audit after 0.8.61

The first audit removed the obvious unsafe/stale paths. A second adversarial pass then checked whether a visitor could still reach commerce with a logically incomplete fit, or whether a requested feature could be ignored by the shortlist.

### Additional findings and fixes

6. **P0 hidden commerce bypass through evidence links**: on several candidate/preview cards the visible purchase CTA was locked, but the exact same merchant product page could still appear as an evidence/source link. Added a shared evidence-link commerce gate. Merchant URLs that duplicate an offer are not clickable until the relevant fit decision is complete; independent manuals/manufacturer evidence remain usable.
7. **P1 seat requirement did not constrain the indoor mobility shortlist**: selecting “I need a place to sit/rest” could still return WA17/WA21 walkers without a seat. A seat requirement now routes only to a verified rollator with a seat and requires safe hand-brake use/locking. The irrelevant “can the person lift the whole walker?” question disappears in this branch.
8. **P1 transport intent was advisory text only**: frequent car transport did not change the offer gate. It now adds a model-specific confirmation that folded dimensions and weight were checked against the actual vehicle/loading ability before an offer can unlock.
9. **P0/P1 manual wheelchair control was weaker than powered control**: electric chairs required practical joystick steering/stopping confirmation, while self-propelled/mixed manual chairs relied only on the declared propulsion mode. Manual propulsion now requires explicit confirmation that the person can propel, steer, slow/stop and use the parking brake; “no” routes to professional review and “unknown” blocks even exact-model preview.
10. **P1 P2015 toilet-support frame lacked its own fit gate**: the catalog already states that space around the WC and fixing compatibility must be checked, and current product data includes 53–63 cm adjustable width, 47 cm depth and 14.4 cm fixing-hole spacing. The frame now requires its own product-specific fit confirmation. A wall-mounted rail remains a separate construction with its own verified-wall-fixing branch, so one answer no longer approves both constructions.
11. **P2 irrelevant conditional question**: indoor mobility with a seat requirement no longer asks whether the user can lift a fixed walker, because that answer cannot affect the rollator branch.

### Second-pass conclusion

After these fixes, no further P0/P1 decision-logic gap was found in the 14 Advisor entrypoints during the repository-level audit. Footwear deliberately stops at a candidate model and instructs the visitor to compare measured feet with the merchant's model-specific size table before ordering; adding another binary gate there would duplicate the merchant sizing step rather than close a safety-critical construction fit. ADL remaining checks are task/comfort checks rather than hard structural-fit gates.

Remaining work is therefore practical QA rather than another known engine rewrite: real mobile/desktop walkthroughs, keyboard/touch behavior, and production verification after deployment. The engines still rely on self-reported confirmations and cannot physically measure the home, user or installation.


## Release target
The second-pass fixes are packaged as **0.8.62**. If 0.8.61 has not been deployed yet, deploy 0.8.62 directly rather than deploying both releases in sequence.
