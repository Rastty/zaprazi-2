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
- `merchant_click`.

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
