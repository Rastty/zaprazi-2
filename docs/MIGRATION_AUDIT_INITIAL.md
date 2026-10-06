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


## Authenticated inventory findings — 2026-10-06

WPVibe read-only database evidence now confirms:
- **4,360 published posts**,
- **4 published pages**,
- permalink structure `/%postname%/`,
- **1,134 published WooCommerce products**,
- 0 legacy shop orders in the classic `shop_order` post type,
- WooCommerce pages: Shop 178, Cart 179, Checkout 180, My Account 181.

Largest post categories:
- Tepelná čerpadla a fotovoltaika — 2,014,
- zařízení — 962,
- Čerpadla a domácí vodárny — 566,
- Ventilátory — 508,
- Podzemní nádrže — 93,
- Nábytek pro zdravotnictví — 89,
- Úklid — 59.

### Mobility / home-independence overlap review

A broad slug search across all published posts returned 36 keyword candidates, but most are false positives such as hospital-energy articles and electromobility.

The 89-post `Nábytek pro zdravotnictví` category is overwhelmingly B2B content about clinics, dental practices and institutional furniture, not home independence.

Sample content review:
- ID 4181, bezbariérový zdravotnický nábytek — institutional/B2B intent; do not repurpose into a home-accessibility page.
- ID 3620, bezpečný zdravotnický nábytek — institutional/B2B intent; do not repurpose as a home-safety page.
- ID 3638, bezpečné stoly pro děti a seniory — closest semantic overlap, but mixed with legacy hotel/restaurant affiliate intent; **REPURPOSE_REVIEW only**, full rewrite required.
- IDs 113 and 817, generic bed-buying articles — generic sleep/furniture intent, not adjustable-bed/home-care intent; **MERGE_REVIEW only** for a future bed slice if traffic/backlink evidence supports it.
- bathroom articles IDs 3153/3175/3195 — cleaning/minimalism intent, not accessibility; do not repurpose as safe-bathroom pages.

Conclusion:
The new Mobility slice has no meaningful pre-existing content cluster that should block launch. Legacy overlap candidates remain protected until GSC/backlink evidence exists.

### WooCommerce preservation guardrail

The 1,134 published products are a separate legacy surface. Even with no recorded classic shop orders, their URLs may carry indexation or backlinks.

Before theme activation:
- product archive must render,
- a sample product must render,
- cart/account routes must not fatal,
- no product URLs are deleted or redirected.

ZaPrazi 2.0 RC therefore includes explicit WooCommerce theme support and a compatibility wrapper.


### Legacy external-product routing

Of 1,134 published WooCommerce products:
- 1,101 are external/affiliate products,
- destination distribution currently includes eHub 359, Marimex 304, NejlevnějšíPodlahy 223, Nextwood 131, Atan 84.

All **359 eHub** product URLs contain the unresolved placeholder `nazev-webu-affilbox`, so they are objectively invalid affiliate destinations.

ZaPrazi 2.0 RC fail-closes only these proven-broken links. The remaining legacy product URLs are preserved until a broader link-health review is complete.

A public spot check also found at least one legacy Atan product page where the merchant states the product is no longer available, reinforcing the need for domain/product link-health review before treating the old catalog as active commerce.


### Legacy HTML document-wrapper defect

Authenticated counts show that whole-document markup is embedded inside the vast majority of published post bodies:
- DOCTYPE: 3,994 posts,
- HTML tag: 4,030,
- HEAD tag: 4,079,
- BODY tag: 4,037.

Because this is a rendering defect across most of the legacy corpus, correcting thousands of database rows before launch would create unnecessary migration risk.

The RC instead applies a narrow render-time sanitizer on singular legacy posts only. Stored content remains untouched for rollback and later controlled content migration.


### Generated document tails inside legacy posts

A second authenticated pass checked whether stripping only `html/head/body` wrappers would expose fake page chrome.

Observed across published posts:
- `<header>`: 1,777,
- `<nav>`: 406,
- placeholder `href="#"`: 361,
- `<footer>`: 1,524.

Sample records showed appended generated documents containing:
- fake Domů/O nás/Kontakt navigation,
- example.com placeholder links,
- generated copyright/site footers,
- duplicate article headings/content.

First-DOCTYPE position analysis across all 3,994 affected posts found zero cases in the first 100 characters and an average first position around 1,499 characters. This supports the safer render-time rule: keep the meaningful original prefix and suppress the later full generated document when its `html/head/body` signature is present.

This remains a reversible presentation rule; stored post content is untouched.
