# ADL / každodenní soběstačnost — evidence v0

Checked: **2026-10-07**

## Purpose

První úzký ADL micro-slice pro ZaPrazi má řešit konkrétní každodenní činnost, ne diagnózu.

Decision order:

problem → praktická překážka → fit/safety gate → přesný produkt → merchant route.

Affiliate schválení RehaVita.cz nesmí ovlivnit pořadí doporučení.

## Why RehaVita now

RehaVita.cz má samostatnou kategorii **Pomůcky pro soběstačnost**. Při kontrole 2026-10-07 kategorie zobrazovala 6 produktů a tři přesné MVS produkty tvoří jasný, ne-překrývající se začátek:

1. samostatné pití,
2. stabilizace nádoby,
3. jídlo / příprava jednou rukou.

Source:
- https://www.rehavita.cz/pomucky-pro-sobestacnost/

## Candidate 1 — UpCup

- Product: UpCup - pomůcka pro snadné pití MoVeS
- SKU: **15-050101**
- Merchant: RehaVita.cz
- Availability at check: **Skladem**
- Listed price at check: **529 Kč**
- Source: https://www.rehavita.cz/upcup-pomucka-pro-snadne-piti/

Verified practical properties from merchant page:
- wide stable base,
- supportive handles,
- grip-oriented design,
- reduced need to tilt the cup,
- dishwasher-safe according to the merchant description.

### Guardrail

ZaPrazi may recommend UpCup only when the stated problem is primarily holding, tilting or spilling the drinking vessel.

If the user's main problem is swallowing, choking/coughing during drinking or another medical issue, the engine must return **professional_check** and show no product candidate.

## Candidate 2 — Beat It

- Product: Beat It - držák pro stabilizaci nádob MoVeS
- SKU: **15-050102**
- Merchant: RehaVita.cz
- Availability at check: **Skladem**
- Listed price at check: **1 659 Kč**
- Source: https://www.rehavita.cz/beat-it-drzak-pro-stabilizaci-nadob-moves/

Verified practical properties from merchant page:
- stabilizes containers/objects,
- sliding locking mechanism,
- merchant-listed dimensions 22 × 11.5 × 7 cm without table mount,
- intended for use on a suitable work surface.

### Guardrail

Automatic candidate status requires a confirmed stable work surface.

Unknown work-surface fit returns **needs_fit_check**. An unsuitable surface returns **no_match**.

## Candidate 3 — Theomatik

- Product: Theomatik - multifunkční jídelní podnos pro obsluhu jednou rukou MoVeS
- SKU: **15-050103**
- Merchant: RehaVita.cz
- Availability at check: **Skladem**
- Listed price at check: **1 599 Kč**
- Current evidence source: https://www.rehavita.cz/pomucky-pro-sobestacnost/

The category description and product listing explicitly position Theomatik for meal handling with one hand.

### Guardrail

Automatic candidate status requires that the practical problem is genuinely one-hand meal setup/use. If that is unknown, return **needs_fit_check** rather than guessing.

Before product routing reaches production, capture the exact product-detail URL and re-check physical dimensions / table-space requirements.

## Explicit exclusions from v0

Do not add to the first ADL engine:
- weighted blankets,
- hearing protection,
- generic writing grips,
- exercise/rehabilitation products,
- diagnosis-based routing,
- questions about operation type, wound, medication or exact body weight.

These may be useful products, but they do not belong in the first narrow decision problem.

## Privacy / health boundary

The v0 engine uses only practical local inputs:
- task,
- main functional problem,
- stable work surface yes/no/unknown,
- one-hand use yes/no/unknown.

No answer needs to be stored or sent to the server.

## Commercial boundary

RehaVita is an approved advertiser, but this foundation intentionally contains:
- no affiliate deeplink,
- no commission-based ranking,
- no fabricated product URL,
- no claim of reimbursement.

The affiliate route is added only after the product and UI path are production-ready.

## Next step

Build the ADL Advisor UI around the three narrow branches, capture the exact Theomatik product URL/specs, then add three separate affiliate runtime slots with canonical fallbacks.
