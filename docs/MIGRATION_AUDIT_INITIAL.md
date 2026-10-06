# ZaPrazi legacy audit — initial public findings

Checked: **2026-10-06**

This is a non-destructive first pass from public web evidence only. It is not the final URL inventory.

## Current public shape

The current homepage is a legacy WordPress magazine about house/garden topics. Visible top-level categories include:
- tipy,
- zařízení,
- stavba,
- zahrada,
- úspora.

The homepage pagination currently exposes **436 archive pages**, which confirms that the legacy corpus is very large and must not be migrated manually or destructively one page at a time.

Recent visible content is dominated by solar/house topics rather than the new home-independence mission.

Public evidence:
- https://zaprazi.cz/

## Search pass for Mobility overlap

Public site-search queries for terms around walkers, rollators, senior mobility, accessible bathroom/WC and wheelchairs did not surface a clear cluster of high-value legacy Mobility pages in this pass.

This is **not proof that no such URLs exist**. Search indexes are incomplete and the site has a very large corpus.

## Important legacy content smell

Public search results expose old product/tag pages with very broad keyword stuffing and legacy product catalog structures. This increases the likelihood that a large part of the old index should be REMOVE or MERGE rather than preserved as-is.

No verdict will be assigned solely from this observation.

## Analytics finding from portfolio repository

Prometheus already contains a GA4 web-stream mapping for ZaPrazi (`__ZAPRAZI - GA4`, measurement ID `G-WM86QVXVST`) but it is recorded as `unmapped` / `portfolioConfigured: false` in the current portfolio mapping files.

Consequence:
- do not create a duplicate GA4 property by default,
- first reconcile the existing property/stream and wire the new privacy-safe funnel events into it if access/current ownership is confirmed.

## What is still needed for the real inventory

Preferred machine-readable inputs:
1. full WordPress post/page/product URL inventory,
2. status/canonical/indexability,
3. GSC clicks + impressions for a defined period,
4. backlink/referring-domain signal if available,
5. current sitemap membership.

Then classify every URL:
`KEEP / MERGE / REPURPOSE / REMOVE`.

## Current blocker

ZaPrazi.cz is not currently connected in the available WPVibe site list, so the authenticated WordPress inventory cannot yet be pulled through that connector.

Until it is connected, continue with public evidence, product/merchant work and non-destructive repo implementation.
