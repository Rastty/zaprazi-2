# Zápraží 0.8.176 — tematické SEO rozcestníky

27. 10. 2026 · navazuje na 0.8.175 a SEO PR #453.

## Pro návštěvníka
Na třech nejvýznamnějších rozcestnících přibylo 11 kontextových interních odkazů: bezpečný byt, návrat z nemocnice, kompenzační pomůcky. Problematické situace: odmítání chodítka, odmítání koupání, malý příjem tekutin a SOS pomoc. Vedou na konkrétní bezpečnostní sekce a užitečný další krok. Žádná přidaná affiliate CTA a žádný nový produktový slib.

## SEO kvalita
Trvalé read-only testy interních odkazů a SEO metadata nyní procházejí i čtyři naposledy publikované a produkčně ověřené průvodce (SOS, chodítko, koupání, pitný režim), které byly mimo původní seznam requiredDecisionPaths. Žádné nepřipravené staged URL se do přísných živých kontrol automaticky nezařazují.

## Integrita
96/96 chráněných PHP/JS/CSS souborů s označením ZP_RELEASE_0_8_176. Konstanta ZAPRAZI_RELEASE v functions.php a hlavička style.css Version také 0.8.176. WP admin a produkční poradci zůstávají funkčně beze změny.

## Kontroly a deploy
Povinná zelená CI, legacy-fidelity a produkční browser QA. Merge release do main a fast-forward dev bez force. Pak ve WordPress Deployer for Git z větve dev: Pull → Deploy. GitHub merge sám nic na živém WP nepřepíše.

## Měření výsledků
Přítomnost v sitemapě, indexovatelnost a počet interních odkazů nejsou Google indexace, kliknutí ani objednávka. Vyhodnotit reálné dojmy, kliknutí, CTR a dotazy v Google Search Console po získání dat.
