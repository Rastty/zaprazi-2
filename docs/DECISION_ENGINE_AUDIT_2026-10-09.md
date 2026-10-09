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
