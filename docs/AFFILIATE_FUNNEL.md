# Affiliate funnel measurement (ZaPrazi)
## Definitions
- `builder_start`: first interaction with Advisor form (after explicit GA4 consent)
- `builder_complete`: valid form completion
- `recommendation_view`: output/recommendation shown according to that Advisor's safe gates
- `product_click`: product offer clicked (may be ordinary merchant URL)
- `merchant_click`: outbound merchant link click, tracked or untracked
- `affiliate_click`: specifically a click on a generated Advisor result offer marked `rel=sponsored`, only when approved affiliate mapping is actually active and prior consent allows analytics

All custom events are **event name only**, with no product ID, network, merchant ID, questionnaire answers or destination URI. Consent denial or revocation suppresses custom events. GA4 automatic enhanced measurement (e.g. outbound link clicks and link_url) is a **separate** setting in GA4 and must be reviewed for privacy.

## Reading data and making decisions
A customer visit from an affiliate link is **not** a conversion. Affiliate program reporting is authoritative for confirmed sales, reversals and commissions. Some visitors do not consent to GA, so event totals describe only a consented sample; use careful trends, not absolute conversion claims.
Review last 7/28 days in GA4 Events: `builder_start`, `builder_complete`, `recommendation_view`, `merchant_click`, `affiliate_click`. Check the relation of starts, completions, and outbound clicks on high-intent pages; do not compute a purchase conversion rate from GA4 clicks alone.
Cross-check network dashboards for credited and approved orders by campaign. Empty or invalid affiliate slots should be tracked in WP admin readiness first, not inferred from GA4 events.
Review safety-gate and SEO changes separately before attributing a changed funnel rate to a particular release.

## Privacy gate
Never attach questionnaire fields, a derived health state, recommendation ID, or raw links to funnel events. Do not add storage, URL query parameters or server analytics for Advisor answers.
