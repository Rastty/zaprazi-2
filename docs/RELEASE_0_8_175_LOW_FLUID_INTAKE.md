# Zápraží 0.8.175 — Senior málo pije

27. 10. 2026. Navazuje na ověřenou živou 0.8.174 a obsahový PR #450.

## Nový obsah
Nová stránka /senior-malo-pije/ vysvětluje čtyři rizikové situace, čtyři příčiny, sedm praktických kroků, čtyři varianty další pomoci, osm kontrol pro rodinu a šest FAQ. Zdroje NZIP a NHS. Striktní omezení proti nucenému pití při poruchách polykání a proti univerzální tekutinové normě při omezení příjmu lékařem. Bez zdravotních dat v analytice. Tři interní inbound cesty z homepage, soběstačnosti a nočního WC; odborný poradce až po safety rozhodnutí.

## Technická integrita
96/96 chráněných runtime PHP/JS/CSS souborů s označením ZP_RELEASE_0_8_175; functions.php ZAPRAZI_RELEASE = 0.8.175 a style.css Version 0.8.175. Související SEO a bezpečnostní testy plus původní poradce beze změn. Nový WP slug se založí pouze při absenci, existující článek se nikdy nepřepisuje.

## Gates a produkce
CI, PHP lint, legacy fidelity, SEO/link browser QA povinně zelené. Po sloučení bez force fast-forward main=dev. WordPress se nemění při GitHub merge. Produčkně Deployer for Git: Pull → Deploy z dev. Pak read-only ověření release 0.8.175, integrita, affiliate 25 nakonfigurovaných slotů, HTML title/canonical/sitemap a 3 live inbound. Sitemap ≠ Google indexace; keyword objem a CTR zatím neověřené.
