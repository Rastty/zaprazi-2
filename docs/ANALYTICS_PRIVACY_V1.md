# ZaPrazi analytics privacy contract v1

Checked: **2026-10-06**

## Goal

Measure whether the decision journey works without turning the Advisor into a health-profile collection system.

Existing GA4 stream:
- measurement ID: `G-WM86QVXVST`
- reuse this stream; do not create another property for ZaPrazi 2.0.

## Consent model

Strict opt-in:
1. ZaPrazi loads only its local consent adapter initially.
2. Google Analytics JavaScript is **not requested** while preference is unknown or denied.
3. The user can choose:
   - `Povolit měření`
   - `Bez měření`
4. The choice is stored locally under `zaprazi_analytics_consent_v1`.
5. The footer always exposes `Nastavení měření` so the preference can be changed.
6. Revoking a previously granted preference clears accessible `_ga*` cookies and reloads the page without loading GA4.

## Allowed measurement

GA4 may receive:
- normal page view after consent,
- `builder_start`,
- `builder_complete`,
- `recommendation_view`,
- `product_click`,
- `merchant_click`,
- `affiliate_click`,
- `next_step_click` (přechod z výsledku poradce na jinou interní stránku, bez cílové URL jako parametru).

For Advisor funnel events the payload is the **event name only**.

## Explicitly prohibited

Do not send to Google Analytics:
- answers to Advisor questions,
- environment / support-need selections,
- brake/lifting answers,
- duration,
- health diagnoses or free text,
- recommended product ID,
- merchant ID,
- reimbursement status for the user,
- any derived mobility/health profile.

The local Advisor event contract remains independent of GA4. The analytics adapter is the only component allowed to forward whitelisted event names after consent.

## Google settings used

When consent is granted:
- `allow_google_signals: false`
- `allow_ad_personalization_signals: false`

This is measurement only, not ad personalization.

## Deployment smoke

Before considering analytics live:
1. fresh browser: confirm no request to `googletagmanager.com/gtag/js` before consent,
2. choose `Bez měření`: reload and confirm no Google Analytics script/request,
3. clear local preference or open settings and choose `Povolit měření`,
4. confirm GA4 script loads once,
5. confirm page view,
6. run Advisor and confirm only generic event names,
7. inspect network payloads to ensure no questionnaire answers/IDs appear.


## Public transparency page

ZaPrazi exposes:
`/ochrana-soukromi/`

The page explains in Czech:
- Advisor answers remain local to the page logic,
- GA4 loads only after explicit opt-in,
- the exact generic funnel event names that may be measured,
- that product/merchant IDs and derived profiles are excluded,
- that GA4 may use standard first-party identifiers and technical visit information after consent,
- how to reopen measurement settings and revoke consent.

Official Google references used for the general GA4 description:
- https://support.google.com/analytics/answer/6004245?hl=cs
- https://support.google.com/analytics/answer/11593727
- https://support.google.com/analytics/answer/11397207?hl=cs

The public page is a technical transparency explanation of the current ZaPrazi implementation, not a substitute for legal advice.

## Measurement quality, iteration 0.8.64

- `builder_start`, `builder_complete` and `recommendation_view` are measured **at most once per page load** after explicit consent. Repeated evaluations of the same answer form do not inflate funnel event counts. Other click events remain click counts.
- `next_step_click` is emitted only for a user-clicked, same-origin navigation **from a visible Advisor result to a different path** (e.g., compare loan versus purchase, check insurer procedure, visit another Advisor). It excludes on-page anchors, links with query strings, external links, downloads and sponsored merchant CTAs. The event has **no URL, answer, product, merchant or outcome parameters**.
- No catch-up: actions before consent are not replayed when consent is granted. Denial and revocation continue to block every GA4 event and script.
- Interpret `next_step_click` as an *interaction*, not proof of understanding or purchase. It is not a conversion or approved affiliate revenue. GA4 cannot alone establish approval status or commissions; reconcile those separately in the affiliate networks.
- A page path or GA4 technical/session identifiers may still be handled by GA4 after opt-in, as declared publicly. Do not add parameters that reveal answers or health profile.
- Compare consented and comparable-period funnels only. Avoid treating the first sparse weeks as causal evidence of a UX lift. Segments do not include questionnaire replies.
