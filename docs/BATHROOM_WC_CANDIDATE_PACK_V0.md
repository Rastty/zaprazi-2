# Slice 2 — Bathroom + WC candidate pack v0

Checked: **2026-10-07**

## Goal

Define the smallest useful decision set for Bathroom + WC before adding product routing.

This is not a shopping catalog. The Slice 2 journey should remain:

`problem → practical constraints → solution type → safety gate → acquisition path → exact products/merchant`

## Initial decision branches

### 1. Raise the existing toilet

Use when the main practical problem is getting down to / up from the current toilet and the user can still transfer to the toilet itself.

Candidate products:
- **UNIZDRAV P2868 — Zvyšovač WC s příklopem, 15 cm**
  - current public price observed: 785 Kč,
  - current stock observed: >10 ks,
  - height increase: 15 cm,
  - max load: 100 kg,
  - external dimensions: 36 × 40 cm.
- **Dr.Max — SUNDO Nástavec na WC vyměkčený, 5 cm**
  - supporting retail alternative with a lower height increase.

Decision parameters to capture before recommendation:
- needed height increase,
- WC-bowl compatibility / fixing method,
- max load,
- whether arm support is also needed,
- whether the user can transfer onto the toilet without a separate chair.

Safety gate:
- do not recommend by age or diagnosis,
- if safe transfer is uncertain, route to professional assessment / higher-support branch.

### 2. Independent/static toilet chair

Use when reaching the bathroom/toilet is itself difficult but the person can transfer to a stable chair with suitable support.

Primary candidate:
- **UNIZDRAV P2807 — Toaletní židle výškově nastavitelná**
  - current public price observed: 2 300 Kč,
  - current stock observed: >10 ks,
  - seat height range: 36–60 cm,
  - seat width: 44 cm,
  - max load: 100 kg,
  - product weight: 8.5 kg.

Alternative candidates for later evidence:
- UNIZDRAV P4326 — fixed toilet chair,
- UNIZDRAV P3816 — higher-load static toilet chair.

Decision parameters:
- transfer ability,
- seat height,
- seat width,
- max load,
- room/bedside space,
- need for wheels vs static support.

### 3. Grab bar / toilet support

Use when the key problem is controlled support while standing, sitting or transferring and wall/installation conditions allow it.

Candidate products:
- **UNIZDRAV P2131 — protiskluzové madlo do koupelny a toalety, 30–45 cm**
- **UNIZDRAV P4718 — sklopné madlo, 70 cm**
- **UNIZDRAV P4589 — toaletní opora**

Decision parameters:
- where support is needed,
- fixed vs folding bar,
- reach / installation height,
- wall/substrate suitability,
- load rating,
- whether drilling/installation is possible.

Safety gate:
- do not present a grab bar as safe until its mounting substrate and installation requirements are verified.
- suction / temporary solutions must never be treated as equivalent to mechanically fixed support without evidence.

### 4. Shower chair / bath seating

Use when the user can transfer into the shower/bath area but standing during washing is the main limitation.

Candidate products:
- **UNIZDRAV P2062 — sprchovací židle s ručkami**
- **UNIZDRAV P2174 — sprchovací židle s výřezem**
- **UNIZDRAV P2203 — sprchovací židle do vany**
- **UNIZDRAV P5304 — sedák do vany s otočným diskem a madlem**

Decision parameters:
- shower vs bathtub,
- available internal width,
- transfer direction,
- arm supports,
- seat dimensions,
- max load,
- floor / tub stability,
- whether a caregiver assists.

### 5. Combined shower/toilet wheelchair

Use only for users who need significantly more support and for whom a simple static chair is not enough.

Candidate products:
- **UNIZDRAV P2085 — toaletní sprchovací vozík**
- **UNIZDRAV P3633 — toaletní sprchovací vozík MASTER**
- UNIZDRAV P2858 — Akva Go.

Decision parameters:
- independent vs assisted transfer,
- caregiver presence,
- doorway/bathroom width,
- wheel/brake configuration,
- seat width,
- load,
- toilet/shower compatibility.

Safety gate:
- this is a high-support branch. If transfer ability or caregiver handling is unclear, fail closed and recommend professional assessment rather than selecting a commercial product.

## What is deliberately excluded from v0

Do not add yet:
- dozens of near-duplicate products,
- medical-condition-based routing,
- ranking by commission,
- products without stable dimensions/load/installation evidence,
- affiliate links before the product qualifies,
- reimbursement claims without an independently verified acquisition path.

## Merchant strategy for Slice 2

Primary:
1. **UNIZDRAV** — broadest current exact inventory for all five branches.
2. **RehabilitačníPomůcky.cz** — verify overlapping exact products/categories.
3. **Dr.Max** — useful supporting retail route for selected simpler aids.

Affiliate route is the last step only.

## Next evidence work

For each branch:
1. verify at least 1–2 exact products,
2. capture manufacturer/merchant dimensions, load and installation constraints,
3. define fail-closed decision rules,
4. determine buy / rent / reimbursement paths where relevant,
5. only then request/generate publisher-specific deeplinks.

## First deeplink request

Do **not** request all UNIZDRAV links yet.

First likely deeplink batch after evidence review:
- P2868 WC raiser,
- P2807 height-adjustable toilet chair,
- P2062 shower chair with arms,
- P2131 / P4718 selected grab-bar route,
- P2085 only if the high-support branch passes safety review.
