# Zápraží release 0.8.170 — hygiena ležícího seniora doma

Dne 26. 10. 2026. Navazuje na obsahové SEO PR #437.

Rozsah: problémový průvodce /hygiena-leziciho-seniora-doma/, propojení s 5 relevantními zdroji návštěvnosti, existující bezpečnostní odkazy, praktické rozhodovací cesty, 7-krokový postup, 8 kontrol, 6 FAQ, zdroje Diakonie/NZIP/NHS.

Publikační integrita: všech **91** chráněných souborů má ZP_RELEASE_0_8_170; `functions.php` má `ZAPRAZI_RELEASE = 0.8.170`; `style.css` má `Version: 0.8.170`. Žádný přepis starého WordPress obsahu, žádné změny produktových rozhodovacích algoritmů ani affiliate připravenosti.

Před merge: npm test, PHP lint, browser regression/SEO, legacy content fidelity. Staging je v main, ale WordPress aktualizuje pouze `dev` po release a Pull + Deploy.

Po nasazení: `node scripts/audit-live-hygiene-170.mjs` proti produkci. Ověří release a integritu, 25 nakonfigurovaných slotů (nikoliv objednávky), 1 H1, unikátní description, HTTPS canonical, 4+4+3+4 bezpečnostních/rozhodovacích karet, 7-krokový postup, 8 kontrol, 6 FAQ, 5 inbound odkazy a WP XML sitemap. Doplnit kompletní produkční browser QA.

Neslibovat prokliky, indexaci či zdravotní indikaci bez skutečných důkazů. GSC monitoring URL 28/56 dnů. Důležité: dokud release není nasazen, stránku neoznačovat za živou.
