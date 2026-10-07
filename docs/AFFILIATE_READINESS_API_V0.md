# Affiliate readiness API — v0

Checked: **2026-10-07**

## Goal

Allow production monetization readiness to be checked without WordPress admin access and without exposing publisher tracking URLs.

## Endpoint

`/wp-json/zaprazi/v1/affiliate-readiness`

## Response contract

Returns:
- current release,
- release integrity state,
- configured affiliate slot count,
- total slot count,
- per-slice configured / total counts,
- missing slot key,
- public slot label,
- canonical merchant target for generating the missing deeplink.

## Never returned

The endpoint does not return:
- configured affiliate URLs,
- publisher IDs or private credentials,
- Advisor answers,
- selected recommendation/product IDs,
- diagnosis or health data,
- analytics identifiers.

## Cache

The response uses:

`Cache-Control: no-store, max-age=0`

because WordPress affiliate settings can change independently from theme releases.

## Commercial boundary

Readiness state never affects suitability, recommendation order or merchant ranking.
