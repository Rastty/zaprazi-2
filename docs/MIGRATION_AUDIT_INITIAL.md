# ZaPrazi legacy audit — initial public findings

Checked: **2026-10-06**

This is a non-destructive first pass. It is not the final URL inventory.

## Current public shape

The current/legacy ZaPrazi corpus is a large WordPress magazine about house/garden topics. Visible top-level categories include:
- tipy,
- zařízení,
- stavba,
- zahrada,
- úspora.

The homepage pagination exposes **436 archive pages**, which confirms that the corpus is very large and must not be migrated destructively or page-by-page by hand.

Recent visible content is dominated by solar/house topics rather than the new home-independence mission.

## Search pass for Mobility overlap

Public site-search queries for terms around walkers, rollators, senior mobility, accessible bathroom/WC and health aids did not surface a clear existing Mobility cluster in this pass.

This is **not proof that no such URLs exist**. Search indexes are incomplete and the site has a very large corpus.

## Analytics / Search Console evidence

### GA4

Prometheus contains an existing GA4 mapping for ZaPrazi:
- property: `__ZAPRAZI - GA4`
- property ID: `364504169`
- measurement ID: `G-WM86QVXVST`
- recorded mapping state: `unmapped`
- recorded portfolio configuration: `false`

Consequence:
- do not create a duplicate GA4 property by default,
- reconcile the existing stream before any new analytics setup.

### Search Console

Prometheus contains a read-only Search Console site-discovery artifact generated **2026-07-23** with 28 accessible properties.

**ZaPrazi.cz is not present in that accessible-property list.**

Therefore:
- Prometheus GSC exists, but it currently does **not** provide ZaPrazi page/query data from the stored access discovery,
- no old ZaPrazi URL should be classified as low-value solely because GSC data is missing,
- before destructive migration decisions, either add/verify ZaPrazi in Search Console access or use another authoritative traffic source plus the full WordPress inventory.

Source artifact in Prometheus:
`PROMETHEUS-SEARCH-CONSOLE-SITE-ACCESS-01.json`

## WordPress access status

ZaPrazi is now connected to WPVibe and authenticated read access was verified.

However, WPVibe subsequently hit the Free-plan rolling daily limit, so the full WordPress inventory has not yet been pulled.

Deployment no longer depends on WPVibe because the new theme is delivered Git-first through Deployer for Git.

## What is still needed for the real inventory

Preferred machine-readable inputs:
1. full WordPress post/page/product URL inventory,
2. status/canonical/indexability,
3. GSC clicks + impressions for a defined period once ZaPrazi access exists,
4. backlink/referring-domain signal if available,
5. current sitemap membership.

Then classify every URL:
`KEEP / MERGE / REPURPOSE / REMOVE`.

## Migration guardrail

Until the authenticated inventory exists **and** traffic evidence is available for important URLs:

- no bulk deletes,
- no mass noindex,
- no mass redirect to homepage,
- no assumption that zero observed public-search results means zero value,
- no repurpose unless the old and new intent are genuinely aligned.

The new Mobility slice may launch without destructive migration because existing legacy URLs remain intact and readable.
