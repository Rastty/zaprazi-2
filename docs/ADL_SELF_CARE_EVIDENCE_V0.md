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
3. jídlo / příprava jednou rukou,
4. otevírání běžných obalů a uzávěrů.

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
- Source: https://www.rehavita.cz/theomatik-multifunkcni-jidelni-podnos-pro-obsluhu-jednou-rukou-moves/

Exact product page re-verified 2026-10-07. RehaVita lists dimensions 36.5 × 18.8 × 3 cm, weight 900 g, foldable design and dishwasher suitability.

### Guardrail

Automatic candidate status requires that the practical problem is genuinely one-hand meal setup/use. If that is unknown, return **needs_fit_check** rather than guessing.

Before purchase, verify that a 36.5 × 18.8 cm tray fits the intended working surface.

## Candidate 4 — MVS Open-It 5 v 1

- Product: MVS Open-It - multifunkční otevírací pomůcka 5 v 1
- SKU: **15-050105**
- Merchant: RehaVita.cz
- Availability at check: **Skladem**
- Listed price at check: **495 Kč**
- Source: https://www.rehavita.cz/mvs-open-it-multifunkcni-oteviraci-pomucka-5-v-1/

Exact product page checked 2026-10-07. RehaVita lists:
- screw-cap bottle opening,
- lifting can pull-tabs,
- zipper-pull assistance,
- opening packaging,
- weight 60 g.

The merchant also mentions tablet blisters, but Zápraží intentionally does **not** use medication/blister handling as a decision trigger.

### Guardrail

Automatic candidate status requires a practical packaging/closure problem: insufficient grip, twisting or pulling for a normal household package, bottle cap, can tab or zipper.

The branch must not:
- choose medication,
- identify medication,
- advise dosage,
- infer medication safety,
- turn medicine packaging difficulty into medical advice.

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

The UI can now expose isolated affiliate slots. Until a publisher-specific deeplink is supplied, each slot must fall back to the verified canonical RehaVita product URL.

## Affiliate generation path

Approved network context:
- network: **eHUB**,
- advertiser: **RehaVita.cz**,
- campaign ID: **18119967**.

For each of the four products:
1. open the exact canonical RehaVita product URL,
2. generate the publisher-specific deeplink in the approved eHUB account,
3. paste the generated URL into the matching WordPress affiliate slot,
4. do not manually construct tracking parameters,
5. keep canonical fallback active until the exact generated link is available.

Public eHUB program information also advertises domain tracking, but Zápraží treats that only as a supplementary measurement path, not as a replacement for the exact publisher deeplink.

The four slots remain:
- `rehavita-cz:upcup-15-050101`,
- `rehavita-cz:beat-it-15-050102`,
- `rehavita-cz:theomatik-15-050103`,
- `rehavita-cz:open-it-15-050105`.

## Next step

Fill the four slots with exact generated eHUB deeplinks when available.
