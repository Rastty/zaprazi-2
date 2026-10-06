# ZaPrazi 2.0 backlog

## P0 — Slice 1 Mobility

### ZP-001 Repository bootstrap
Status: IN PROGRESS

- canonical source of truth
- architecture boundaries
- development rules
- migration-audit contract
- runnable first rule-engine prototype
- tests

Definition of done: green tests + reviewable PR.

### ZP-002 Legacy URL inventory
Status: READY

Build a machine-readable inventory from the current WordPress site.

For each URL capture where available:
- URL,
- title,
- content type/category,
- published/modified date,
- indexability/canonical,
- candidate new intent,
- migration verdict placeholder,
- evidence notes.

Do not change live URLs yet.

### ZP-003 Mobility decision model
Status: READY

Define the minimum practical questions and explainable candidate outcomes.

Requirements:
- no diagnosis,
- no unnecessary identifying data,
- ambiguity fails closed,
- professional-fit boundary explicit,
- rule versioning,
- unit tests.

### ZP-004 Mobility reference/evidence pack
Status: READY

Collect authoritative evidence for:
- walking-aid categories/selection parameters,
- Czech reimbursement verification path,
- ePoukaz/prescription process where relevant,
- safety-critical product parameters.

Each claim needs source, scope and checked date.

### ZP-005 Initial merchant verification
Status: READY

Verify project-brief merchant candidates:
- RehabilitačníPomůcky.cz
- Lékárna.cz
- MůjZdrav.cz

For each:
- active affiliate relationship,
- usable relevant inventory,
- product/deeplink behavior,
- feed/data availability and conditions,
- affiliate-link smoke.

Do not infer feed availability from program approval.

### ZP-006 Curated Mobility product set v1
Status: BLOCKED_BY_ZP_004_ZP_005

Start small. Manually verify enough real products to make the first journey useful.
No invented specs/prices/availability.

### ZP-007 Home Advisor accessible UI v1
Status: READY_AFTER_ZP_003

Build Czech mobile-first questionnaire/results experience:
- keyboard support,
- visible focus,
- explicit labels,
- large targets,
- simple language,
- no persistent answers.

### ZP-008 Acquisition choice v1
Status: READY_AFTER_ZP_004

For supported solution families show:
- buy,
- rent,
- check reimbursement.

Explain uncertainty and verification steps.

### ZP-009 Merchant routing + tracking v1
Status: BLOCKED_BY_ZP_005_ZP_006

Recommendation first, merchant routing second.
Track only safe generic events.

### ZP-010 WordPress integration + staged page
Status: READY_AFTER_ZP_007

Embed the Advisor on a new/non-destructive page.
Do not replace old homepage until smoke is green.

### ZP-011 Slice 1 production smoke
Status: BLOCKED_BY_ZP_010

Verify:
- mobile,
- keyboard,
- no dead ends,
- answer privacy,
- product source display,
- outbound merchant links,
- analytics payload,
- performance/basic SEO.

### ZP-012 Slice-related migration
Status: BLOCKED_BY_ZP_002_ZP_011

Only migrate URLs with a logical relationship to the new Mobility content.

## P1 — Acquisition for Mobility

- one strong Mobility hub,
- high-intent decision pages only,
- internal linking from relevant retained legacy URLs,
- sitemap/canonical checks,
- Search Console measurement.

## P2 — Expansion gate

Do not start Slice 2 until Slice 1 is usable in production and early evidence is reviewed.

Next slices:
1. Bathroom + WC
2. Adjustable beds
3. Wheelchairs
4. Return from hospital

## Reporting

Progress percentage counts completed production outcomes, not documents or opened issues.

Primary current indicator:
**Can a real user complete problem → Advisor → recommendation → acquisition choice → real offer → outbound click?**
