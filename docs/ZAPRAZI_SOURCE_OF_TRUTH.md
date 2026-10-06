# ZaPrazi 2.0 — Source of Truth

## Mission

ZaPrazi.cz helps people create a safer home in which they or their loved ones can remain independent for as long as possible.

ZaPrazi is not a classic senior magazine and not a health-aid catalog. It is a **decision engine for safe and independent living at home**.

Primary user need is not "find product X" but "What should we do?"

Core journey:

`problem → understand the situation → solution options → suitable aid/home modification type → acquisition path → concrete products/services`

## Brand

Positioning: **Bezpečně a samostatně doma.**

The brand should feel human, practical, calm, trustworthy and modern. It should visually feel like a website about home and life, not illness, hospital or pharmacy.

## Primary user

Often a daughter or son roughly 40–60 who is solving a parent's practical home situation under stress and without specialist vocabulary.

The experience must therefore use plain Czech and explain unfamiliar product categories and parameters.

## Main product — Domácí poradce

The Home Advisor is the center of the product, not the blog.

Questions are practical, not diagnostic. It asks about:
- who the solution is for at a non-identifying level,
- how the person moves in practical terms,
- where the main home problem is,
- bathroom/WC/getting up/stairs/outdoor movement/car transfer,
- short-term vs long-term need.

The output is not a diagnosis. It identifies areas worth addressing, explains why, gives selection parameters and only then offers concrete products/services.

## Critical differentiator — how to obtain the solution

For important aids, ZaPrazi must not assume "need aid = buy aid".

The decision layer must support:
- buy,
- rent,
- check health-insurance reimbursement,
- check social support/contribution where relevant.

Trust is more important than maximizing a single affiliate sale.

## Content architecture

Useful entry paths may be organized by:
- life situation,
- room/place at home,
- practical problem,
- product category,
- finance/acquisition.

Every page must still provide useful value without requiring questionnaire completion.

Every new URL must be at least one of:
- Decision page,
- Problem page,
- Reference page.

No mass production of generic AI SEO articles.

## Product and affiliate layer

Affiliate links are not hard-coded into editorial logic.

Separate:
- product facts,
- use cases / suitability evidence,
- category,
- merchant offers,
- price,
- availability,
- affiliate URL,
- checked date.

Product order comes from suitability and evidenced parameters, not commission.

Initial merchant candidates from the project brief are RehabilitačníPomůcky.cz, Lékárna.cz and MůjZdrav.cz. Their current partnership, relevant inventory, data-use conditions and affiliate links must be verified before activation.

## Trust

Trust is systemic:
- official sources,
- insurer/state references,
- transparent recommendation methodology,
- update dates,
- fact vs recommendation separation,
- affiliate disclosure,
- product-ranking explanation.

ZaPrazi does not diagnose or promise individual medical suitability.

If decisive data is missing or professional assessment is required, the Advisor says so instead of producing false certainty.

Reimbursement content explains how to verify eligibility; it does not confirm an individual's legal/medical entitlement.

## Privacy

The MVP Home Advisor does not create a persistent health profile.

No name, address, birth number or identifying account is required.

Advisor answers remain only in temporary browser memory. They are not written to URL, server logs, accounts or persistent storage.

Analytics/ad/affiliate systems must not receive answer combinations or derived health profiles.

Minimum funnel events:
- `builder_start`
- `builder_complete`
- `recommendation_view`
- `product_click`
- `merchant_click`

Event parameters, automatically sent URLs and identifiers must also be checked for leakage.

## Accessibility

Target WCAG 2.2 AA from the beginning: contrast, readable text, touch targets, keyboard control, visible focus, labels, understandable errors and simple Czech.

## Old ZaPrazi migration

Inventory every old URL and classify:
- KEEP,
- MERGE,
- REPURPOSE,
- REMOVE.

Redirect only to logically matching replacement content.
Do not redirect hundreds of unrelated pages to homepage.
Do not remove/redirect before replacement and evidence review are ready.

## Vertical slices

### Slice 1 — Mobility
`Homepage → Home Advisor → walking problem → solution type → walker/rollator path → buy/rent/check reimbursement → recommended products → merchant → measurable click`

This must work end-to-end before expansion.

### Slice 2 — Bathroom + WC
Seats, grab bars, raised toilet solutions, anti-slip, transfer.

### Slice 3 — Adjustable bed
First strong high-ticket intent test: buy/rent/check reimbursement.

### Slice 4 — Wheelchairs
Transport/manual and later possibly powered mobility.

### Slice 5 — Return from hospital
Combines completed earlier modules into a life-situation flow.

## Reusable engine

Build only what Slice 1 needs, behind clean boundaries:
- Questionnaire,
- Recommendation Engine,
- Product Card,
- Comparison,
- Merchant Router,
- Buy/Rent/Reimbursement,
- Trust Block,
- Source Block,
- Affiliate Tracking.

Do not delay launch with speculative generalization.

## Data moat

Long-term sequence:
1. normalized product database,
2. recommendation rules,
3. multi-merchant price/availability,
4. reimbursement/prescription/official rules,
5. rental options and alternative acquisition paths.

## SEO

Focus on high-intent long-tail tied to decision support, not article count.

Examples:
- jaké chodítko pro seniora,
- chodítko do bytu,
- chodítko na ven,
- chodítko se sedátkem,
- polohovací postel půjčit nebo koupit,
- co připravit po návratu z nemocnice,
- jak upravit koupelnu pro seniora,
- jak zvýšit wc pro seniora,
- co hradí pojišťovna.

Every SERP entry should connect to a useful tool or decision path.

## Measurement

Leading:
- Advisor start rate,
- completion rate,
- recommendation engagement,
- merchant CTR,
- organic impressions,
- non-brand clicks.

Business:
- approved affiliate revenue,
- revenue per attributable organic session,
- EPC = approved commission / comparable-period outbound affiliate clicks,
- revenue by segment.

Keep pending/rejected/approved commissions separate.

## Stage gates

Review after 14, 30 and 60 days with a defined sample and decision:
continue / adjust / pause.

Evaluate:
1. product journey works,
2. people use it,
3. search responds,
4. monetization produces orders/approved revenue,
5. only then scale.

## Explicit non-goals

Do not:
- generate hundreds of generic AI articles,
- diagnose,
- persist unnecessary health/personal data,
- architect around a single affiliate partner,
- rank by commission,
- hire an expert as a launch dependency,
- run manual phone advice,
- build many large systems at once,
- clone a competitor 1:1,
- wait for perfection before testing monetization.

## Milestones

First product milestone:
A real user describes a practical problem, receives a useful recommendation, chooses a sensible acquisition path and reaches a concrete solution/product.

First business milestone:
**first approved affiliate order from that journey.**

## Long-term vision

ZaPrazi becomes a Czech decision platform for home independence:

`what to change → what is needed → how to choose → buy/rent/check reimbursement → where to get it`

Potential monetization:
`affiliate → marketplace routing → high-ticket CPL → direct partnerships`.

Any new idea must pass one question:

**Does it help the user get faster from a real problem to a safe practical solution while increasing the long-term value of the asset?**
