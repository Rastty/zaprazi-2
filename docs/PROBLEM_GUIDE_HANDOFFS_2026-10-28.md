# Safe guide → Advisor handoffs (28 October 2026)

Release family: 0.8.183 (content-only improvement, does not change protected marker).

## Purpose
Three practical problem pages already answer caregivers' first questions. Add a clearly visible and *conditional* next step at the point where the article has explained options, not a generic product CTA at the top.

1. `/senior-odmita-choditko/`: after the decision comparison, only if the person agrees and professional assessment supports safe walking, open the Homepage mobility Advisor. Optional rental process; no forced purchase.
2. `/senior-odmita-koupani/`: after the hygiene options, open Bathroom & WC Advisor **only after safe transfer and consent**. Secondary step measures the bathroom. When transfer is unsafe, prioritize care / professional support.
3. `/senior-malo-pije/`: after explaining that drinking aids cannot fix swallowing, offer ADL Advisor only for safe swallowing + grip/reach problems; alternative guide handles fear of the night toilet. Acute / swallowing issues require medical attention.

## Quality gates
- New `tests/problem-guide-handoffs.test.js` checks sections, visible primary and secondary links, anchored live templates, consent/clinical/safety language, no merchant routing and no query parameters.
- Existing PHP lint, source CI, advisor privacy regression and no external sensitive data.
- No change to evaluation order, product offers, prices, affiliate ranking or analytics.
- Postdeploy: verify release 0.8.183 still reports integrity=ok and affiliate 25/25; verify the three handoff sections and destination anchors in live HTML.

## Measurement and future iteration
Do not claim conversions/revenue from CTA implementation. Observe aggregate GA4 journey events only after explicit consent; new CTA adds no extra tracking. Actual business impact requires qualified organic traffic and verified affiliate network commissions over time, not internal tests.
