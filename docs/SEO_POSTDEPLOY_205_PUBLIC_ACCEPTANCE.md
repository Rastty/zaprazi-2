# Zápraží 0.8.205 postdeploy SEO verification — readonly

This is a narrow production acceptance, **not** a new WordPress release.
- Homepage: requires a visible, crawlable standard link from the "Chůze a opora" card to the walker measuring checklist and from "Koupelna a WC" to the shower chair guide.
- Yoast page XML sitemap: requires the four source-grounded materially revised pages to have \`lastmod\` dates at least 2026-11-09 but not beyond the run date. Other pages are deliberately not stamped.
- Reads only \`https://zaprazi.cz/\` and \`https://zaprazi.cz/page-sitemap.xml\`, with no cookies, user input, writes, cross-host redirects, indexing requests or merchant tracking.
- Failing this test means the **public signal is not verified**; it is not an SEO ranking prediction. GSC's indexed-version state may lag deployment.
- Production version 0.8.205 itself is independently verified by [Zápraží Production Acceptance](https://github.com/Rastty/zaprazi-2/actions/runs/42596595266).

## Postdeploy correction — release 0.8.206

The 0.8.205 production audit proved both new homepage links visible, but four XML <lastmod> dates remain October 2026. Root cause: the 0.8.205 filter wrote internal `lastmod` while the Yoast post/page renderer uses `mod`. [PR #731](https://github.com/Rastty/zaprazi-2/pull/731) corrects this as release **0.8.206**. The read-only public gate intentionally remains red until the owner deploys 0.8.206. This PR changes only CI/scripts/docs and never requires a WordPress deploy on its own.
