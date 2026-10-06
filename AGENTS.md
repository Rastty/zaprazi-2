# ZaPrazi 2.0 repository instructions

## Canonical direction

Before product or architecture work, read `docs/ZAPRAZI_SOURCE_OF_TRUTH.md`.
It is authoritative. If implementation, old content or a later proposal conflicts with it, surface the conflict instead of silently changing direction.

ZaPrazi is a **decision engine for safer and more independent living at home**, not a generic senior magazine, medical diagnosis service or affiliate catalog.

Core flow:

`PROBLEM → PRACTICAL SITUATION → SOLUTION OPTIONS → AID / HOME MODIFICATION TYPE → BUY / RENT / CHECK REIMBURSEMENT → PRODUCT / SERVICE → ACTION`

Current P0 vertical slice: **Mobility**.

Launch-ready for Slice 1 means a real user can complete:

`entry → Home Advisor → walking/mobility problem → useful candidate solution → acquisition path → verified product/merchant option → measurable outbound click`

## Priority discipline

Until Slice 1 works end-to-end:

1. P0 — complete the Mobility user journey safely.
2. P1 — migration/SEO for only the URLs that support this slice.
3. P2 — minimum privacy-safe measurement.
4. Everything else waits unless it directly unblocks P0.

Do not start Bathroom/WC, beds, wheelchairs, hospital-return flows, broad content production or reusable platform abstractions while an actionable Slice 1 blocker exists.

## Safety and trust boundaries

- Do not diagnose disease, injury or functional status.
- Do not state that a specific aid is medically suitable for an individual.
- Prefer wording such as "stojí za zvážení" and explain what must be checked.
- If a critical input is missing or professional assessment is needed, fail closed and tell the user the next step.
- Do not fabricate reimbursement eligibility, product specifications, prices, availability, stock or official rules.
- Every reimbursement/reference claim must carry source + validity scope + checked date.
- Recommendation rules must be explainable and versioned.
- Affiliate payout, EPC or merchant preference must never alter solution suitability or product fit/ranking.

## Privacy by design

MVP Home Advisor:
- no name, address, birth number or login,
- answers stay in temporary browser state,
- no answers in URL,
- no persistent server storage of answer combinations,
- no answer payloads or derived health profile in analytics, ad systems or affiliate parameters,
- no session replay/remarketing based on Home Advisor answers.

Allowed analytics are general funnel events only, with parameters audited for leakage.

## Architecture boundaries

Keep separate:
1. practical questionnaire / answer state,
2. deterministic recommendation rules,
3. product facts,
4. merchant offers,
5. acquisition options (buy/rent/reimbursement),
6. rendering/UI,
7. analytics.

Product truth is not merchant truth. Stable product facts must not contain current affiliate economics. Current price/availability belongs to merchant offers.

## Product data rules

- No invented specs.
- Curated facts require traceable evidence.
- Keep source URL, source type and checked date.
- Missing critical facts remain missing.
- Pilot may use a small manually verified product set; feed automation is not a launch prerequisite.
- "Lowest known price" is allowed only across actually monitored offers and must say so.

## Accessibility

Target WCAG 2.2 AA:
- keyboard operable,
- visible focus,
- labels and errors,
- sufficient contrast,
- large touch targets,
- simple Czech,
- no meaning conveyed only by color.

## Development workflow

1. Inspect current `main` and open PRs.
2. Work on a dedicated branch; do not push implementation directly to `main`.
3. Keep the current vertical slice bounded.
4. Add/update tests for behavioral rules.
5. Run required checks before calling work ready.
6. Open a PR explaining behavior, safety boundaries, tests and known gaps.
7. Do not merge failing work.

## Migration rules

Old ZaPrazi URLs receive one verdict: KEEP / MERGE / REPURPOSE / REMOVE.
Do not mass-redirect unrelated URLs to homepage.
Do not remove or redirect until replacement content exists and traffic/link evidence has been reviewed where available.

## Definition of progress

Documentation alone is not launch progress.

The default delivery unit is a safe vertical slice:
`evidence/data → implementation → tests → review → deploy → production smoke`.

First product milestone: user completes the full Mobility path without a dead end.
First business milestone: first approved affiliate order attributable to that path.
