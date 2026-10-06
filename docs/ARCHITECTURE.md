# ZaPrazi 2.0 architecture

## Product flow

```text
SEO / homepage / old relevant URL
  -> practical problem
  -> Home Advisor questionnaire
  -> deterministic recommendation rules
  -> candidate solution type(s)
  -> acquisition options
       -> buy
       -> rent
       -> check reimbursement / contribution
  -> verified product facts
  -> eligible merchant offers
  -> outbound action
```

## Hard separation

### 1. Questionnaire layer
Owns temporary answers and validation only.
It must not persist health-like answer combinations in MVP.

### 2. Recommendation layer
Owns practical rules and explainable outcomes.
It does not know affiliate commission or preferred merchant.

### 3. Product facts
Stable, evidence-backed facts:
- category,
- dimensions/specs,
- functional features,
- manufacturer/model identity,
- evidence references,
- checked date.

### 4. Merchant offers
Volatile commercial facts:
- merchant,
- market,
- merchant URL,
- affiliate URL,
- current price,
- availability,
- checked date.

### 5. Acquisition layer
Explains buy/rent/check-reimbursement choices independently of product ranking.

### 6. Presentation layer
Accessible UI, plain Czech, trust blocks and sources.

### 7. Measurement
Privacy-safe funnel events only.

## Fail-closed rules

Do not produce false certainty.

Examples:
- missing critical product spec → product cannot be asserted suitable,
- missing/unclear reimbursement rule → show verification path, not entitlement,
- unclear practical answer → ask a follow-up or return "needs more information",
- potential professional-fit dependency → explain that professional assessment may be appropriate.

## Data model v1

### Recommendation rule
```json
{
  "id": "mobility.example",
  "version": 1,
  "inputs": ["environment", "support_need"],
  "outcome": "solution_candidate",
  "reason": "plain-language explanation",
  "safety_gate": null,
  "evidence_refs": []
}
```

### Product
```json
{
  "id": "stable-product-id",
  "category": "rollator",
  "brand": null,
  "model": null,
  "facts": {},
  "evidence": [
    {
      "url": "https://...",
      "source_type": "manufacturer",
      "checked_at": "YYYY-MM-DD"
    }
  ]
}
```

### Offer
```json
{
  "product_id": "stable-product-id",
  "merchant": "merchant-id",
  "market": "CZ",
  "url": "https://...",
  "affiliate_url": null,
  "price": null,
  "currency": "CZK",
  "availability": "unknown",
  "checked_at": null
}
```

Product and offer are intentionally separate.

## WordPress boundary

Existing ZaPrazi remains the SEO/content frontend during migration.

Preferred boundary:
- decision engine source/tests/data in GitHub,
- a thin WordPress integration/embedding layer,
- staged rollout to new pages,
- migration/redirects only when replacements are ready.

Do not rewrite the entire live WordPress site before Slice 1 proves itself.

## Mobility Slice v1

Initial questionnaire dimensions should stay practical:
- indoor / outdoor / both,
- degree of support expressed in plain language,
- need to rest/sit,
- ability/comfort using hand brakes,
- tight home spaces,
- transport/folding need,
- temporary vs longer-term situation.

Avoid collecting diagnoses.

Initial outcomes are candidate solution families, not medical prescriptions.

## Measurement contract

Allowed event names:
- `builder_start`
- `builder_complete`
- `recommendation_view`
- `product_click`
- `merchant_click`

Do not attach raw answers, answer combinations, diagnosis-like categories or derived health profiles.

## Migration architecture

Legacy URL inventory should eventually combine:
- WordPress URL inventory,
- Search Console clicks/impressions where available,
- backlink/referring-domain data if available,
- current indexability/canonical status,
- topical fit with new architecture.

Verdicts: KEEP / MERGE / REPURPOSE / REMOVE.

## Deployment principle

A bounded vertical slice is done only after:
`implementation → tests → deploy → production smoke`.

Documentation or a merged PR alone is not a live product outcome.
