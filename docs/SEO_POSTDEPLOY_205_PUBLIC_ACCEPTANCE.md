# Zápraží 0.8.205 postdeploy SEO verification — readonly

This is a narrow production acceptance, **not** a new WordPress release.
- Homepage: requires a visible, crawlable standard link from the "Chůze a opora" card to the walker measuring checklist and from "Koupelna a WC" to the shower chair guide.
- Yoast page XML sitemap: requires the four source-grounded materially revised pages to have \`lastmod\` dates at least 2026-11-09 but not beyond the run date. Other pages are deliberately not stamped.
- Reads only \`https://zaprazi.cz/\` and \`https://zaprazi.cz/page-sitemap.xml\`, with no cookies, user input, writes, cross-host redirects, indexing requests or merchant tracking.
- Failing this test means the **public signal is not verified**; it is not an SEO ranking prediction. GSC's indexed-version state may lag deployment.
- Production version 0.8.205 itself is independently verified by [Zápraží Production Acceptance](https://github.com/Rastty/zaprazi-2/actions/runs/42596595266).
