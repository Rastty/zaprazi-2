# Production affiliate runtime parity — 2026-11-07

## Why this matters

The existing `/wp-json/zaprazi/v1/affiliate-readiness` reports 25/25 **configured** affiliate slots. That fact alone cannot establish that WordPress actually provides all 25 publisher routes to the public browser, that each route uses the expected network, that the correct product opens after a third-party redirect, or that an approved commission is earned.

The new **read-only** monitor checks a distinct missing layer:

1. Read `https://zaprazi.cz/wp-json/zaprazi/v1/affiliate-readiness` and require exact checked-out source version, `integrity=ok`, 25 configured / 25 total.
2. Read `https://zaprazi.cz/` and extract the **actual rendered** WordPress `zaprazi-runtime-config-js-after` inline `affiliateMap` object in the page HTML.
3. Match **all 25 exact keys** to `zaprazi_2_affiliate_targets()` in `functions.php`; reject missing, extra and unexpected slots.
4. Check each URL **in memory**, fail closed on non-HTTPS, nonapproved affiliate redirect host, network mismatch (RehaVita must be eHUB; others use VIV/CJ), user- or health-answer parameter names, obvious placeholder values or exposed URL fragments.
5. Output only sanitized **aggregate counts** per merchant and network and the precise result boundary. Never output any publisher URL, tracking ID, query value, cookie, browser answer or response HTML.

## Run and controls

- Script: `scripts/audit-live-affiliate-runtime-25.mjs`
- Unit regressions: `tests/live-affiliate-runtime-25.test.js`
- Actions: `.github/workflows/production-affiliate-runtime-qa.yml` (PR source tests, post-merge production smoke, scheduled four times daily, manual dispatch)
- **Network scope:** exactly **two** same-origin public GET requests, with redirects disabled and response byte caps; no merchant requests, checkout, purchase, browser clicks or affiliate tracking requests. No WordPress mutation.
- 25 source keys and redirect-host allowlist are constrained by source and existing `tests/production-advisor-smoke.mjs` conventions. A newly approved network or redirected domain requires a separately verified and reviewed code change, never silent automatic allowance.
- Regression tests reject tampered slots, extra/missing keys, redirections, unreviewed hosts, leaked answer keys, invalid source-live release coherence and large HTML/JSON.
- A FAIL should block claiming **runtime parity** until fixed. It **does not** prove a merchant or business outage; inspect the failure code and site deployment before taking action.

## Evidence boundaries and follow-up

A PASS means **all 25 configured network URLs were made available to a visitor's browser and passed basic URL/network/privacy hygiene** at the check timestamp. It does **not** prove that the real visitors reached each product, that a network forwarded a click, that a product was correctly mapped after redirect, that all 25 product CTA paths were rendered/unlocked, or that any sale/commission occurred.

Remaining controls before claiming actual affiliate conversion:
- Per-product safe unlocked-result check (actual DOM CTA matches the intended exact runtime slot; existing 14-Advisor Chrome QA covers safety gates).
- Approved and documented affiliate-network product deeplink destination check in an authorized environment, without following or generating artificial customer clicks.
- Actual **approved** commission evidence from CJ/eHUB, joined to an attributable funnel period; pending/rejected/unknown must remain separate.
- The separate merchant canonical-page monitor still tracks the 23×HTTP 200 / 2×HTTP 403 snapshot from #42380167071 and product identity watchlist. Its findings must not be conflated with publisher-runtime parity.

This is QA infrastructure only. No release version bump, WordPress Pull + Deploy, product recommendation changes, analytics consent changes or affiliate-map write is required.
