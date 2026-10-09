# Zápraží — SEO baseline and legacy risk triage (2026-10-09)

## What is evidenced today
- 4,360 historical posts and 7 historical WordPress pages were inventoried on 2026-10-07; the complete URL list is in `data/legacy-url-inventory.csv`.
- 1,134 historical WooCommerce product rows were observed; 359 known eHUB/affilbox placeholders are guarded against broken storefront CTAs. **This does not prove every invalid old hyperlink within legacy article bodies has been removed.**
- GSC ownership was verified; no authoritative query/page baseline is stored in this repository. Do not fabricate impressions, clicks, rankings, sessions or conversions.

## First read-only pass (P0)
1. Export Google Search Console performance for 28 and 90 days by page and query: clicks, impressions, CTR, average position; capture exact export date and property.
2. Join canonical URLs (normalized by scheme, hostname, trailing slash) to the legacy URL inventory. Keep *unknown / no GSC data* distinct from *zero impressions*.
3. Crawl sample legacy article bodies and WooCommerce pages for malformed affiliate placeholders, live HTTP errors and unhelpful internal links, beginning with GSC pages that have measured visits.
4. Classify each URL: KEEP (useful/relevant), IMPROVE (query has demand), MERGE (substantial true overlap with relevant target), REPURPOSE (topic relevant but weak), REVIEW (data insufficient). REMOVE only after approved evidence-based review.
5. Log any 301 redirect individually: existing URL, chosen semantically matching destination, evidence, expected SEO effect, rollback path; never mass redirect unrelated articles to homepage.

## 30 / 60 / 90 day gates
- D30: establish GSC baseline; verify indexation, 13 advisor funnels and configured partner links. Review 5 real caregiver user tests and major friction; count total and **approved** affiliate commissions separately.
- D60: compare organic impressions/clicks, validated session-to-result rate and outbound link click trends on comparable pages. Fix top proven blockers; reconsider content only where query evidence supports it.
- D90: decide KEEP / ADJUST / PAUSE for each vertical based on organic demand, useful completed decisions, tracked outbound clicks, and approved commissions. Do not treat a no-commission early period as proof of no demand without adequate sample.

## Guardrails
No fake expert guarantees, medical profiles, answer-derived analytics, fabricated rankings, or unverified payout claims. External source dates must reflect actual checks. Prefer safe cleanup of proven broken links over speculative redirect migration.
