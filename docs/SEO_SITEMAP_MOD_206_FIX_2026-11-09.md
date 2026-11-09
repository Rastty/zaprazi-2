# Zápraží 0.8.206 — production-verified Yoast sitemap `mod` correction

## Live failure (not hypothetical)
The owner deployed **0.8.205**; [production acceptance](https://github.com/Rastty/zaprazi-2/actions/runs/42596595266) proves the version is live. A new read-only postdeploy SEO check [PR #730](https://github.com/Rastty/zaprazi-2/pull/730) found the two new homepage links correctly rendered but all four source-grounded sitemap pages had stale timestamps:
- `/pujceni-choditka/` — `2026-10-06`
- `/choditko-na-pojistovnu/` — `2026-10-06`
- `/koupelna-a-wc/` — `2026-10-07`
- `/kompenzacni-pomucky-pro-seniory/` — `2026-10-07`

## Verified root cause and narrow fix
Yoast's [post-type sitemap provider](https://github.com/Yoast/wordpress-seo/blob/trunk/inc/sitemaps/class-post-type-sitemap-provider.php) places `post_modified_gmt` into **`$url['mod']`** and calls `wpseo_sitemap_entry` with `'post'` and the WP_Post object. Its [renderer](https://github.com/Yoast/wordpress-seo/blob/trunk/inc/sitemaps/class-sitemaps-renderer.php) converts the **`mod`** entry field into public XML `<lastmod>`. Our 0.8.205 callback instead altered the `lastmod` field internally, which the individual-page renderer ignores. This is a concrete code mismatch, **not yet evidence of a stale server cache**.

Release 0.8.206 changes the callback to set only `entry['mod']`, preserving its newer original timestamp, exact host/slug/status guards, HTML canonicals, Yoast providers and the 4 dated materially revised pages. It does **not** rewrite WordPress post_modified, sitemap dates of untouched pages, or index/canonical/robots settings. Tests exercise the actual Yoast `mod` protocol and reject accidental internal `lastmod` use. Original dated content evidence remains 9 November.

## Release and acceptance gate
This requires a new **whole-theme 0.8.206** atomic deployment: all 100 markers, PHP/CSS version and four exact Git blob pins (the 2 Mobility pins recomputed; Bathroom remains unchanged). Run all CI, legacy archive fidelity and Chrome PR acceptance before merge. **GitHub merge != WordPress deployment**: after merge the owner must Pull + Deploy again. Only after independent public production acceptance plus [read-only PR #730 sitemap check](https://github.com/Rastty/zaprazi-2/pull/730) succeeds may the current sitemap dates be called fixed. Public site indexing and traffic may respond later, and approved commissions remain UNKNOWN.

No WordPress writes, merchant route changes or user health telemetry are introduced by the fix.
