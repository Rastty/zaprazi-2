# Zápraží 0.8.177 – Přívětivější poradci

27. 10. 2026. Navazuje na ověřenou živou 0.8.176 a PR #457.

## Co se mění
Tři tematické, originální, teplé, výhradně lokální SVG (720 × 510): chůze s oporou, vybavení koupelny, každodenní pití a soběstačnost. Jsou nově v první obrazovce /choditka-pro-seniory/, /koupelna-a-wc/, /sobestacnost/. Responsivní existující CSS `.zp-hero-layout`, alt popisky, SVG title/desc a rozměry omezující layout shift. Žádné externí fotobanky ani cookies.

## Co se nemění
Všechny poradenské otázky, výsledky, zdravotní bezpečnostní brány, produktová data, affiliate nabídky a jejich pořadí zůstávají shodné. Obrázky jsou ilustrační, ne návod k bezpečnému přesunu či montáži. Žádné nové affiliate odkazy.

## Vydání
96/96 chráněných PHP/JS/CSS souborů má ZP_RELEASE_0_8_177; konstanta functions.php = 0.8.177, style.css Version 0.8.177. Nová SVG nejsou mezi chráněnými PHP/JS/CSS a načítají se přes `get_template_directory_uri` lokálně.

## Brány
Před merge CI, legacy fidelity a produkční poradenský browser QA. Pak bezpečný fast-forward dev bez force. Teprve ruční Deployer for Git Pull → Deploy aktivuje změny na WordPressu. Následně ověřit 0.8.177, integritu, SVG HTTP 200, alt, velikosti, H1, canonical a vizuální funkčnost na mobilní šířce. Zvýšení organické návštěvnosti z obrázků není předpokládáno jako ověřený výsledek.
