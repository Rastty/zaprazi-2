# Zápraží 0.8.173 — Senior odmítá chodítko

27. 10. 2026. Navazuje na SEO PR #444 a produkční verzi 0.8.172.

## Obsah a UX
- Nový redakční průvodce `/senior-odmita-choditko/` s 4 důvody odmítání, 7 kroky bez nátlaku, 6 FAQ, zdroji a s vazbou na existující poradce.
- Tři interní cesty: úvodní stránka, poradce pro chodítka a návod při pádu.
- Lidský tón, lokální obrázek bez trackerů, přístupné popisky a mobilní layout.
- WP nový slug zakládá idempotentně; existující stránky ani affiliate pozice nepřepisuje.

## Integrita a release gate
- **94/94** chráněných runtime PHP/JS/CSS souborů obsahuje `ZP_RELEASE_0_8_173`; `functions.php` definuje 0.8.173 a `style.css` Version 0.8.173.
- Před merge požadujeme zelené CI a read-only SEO / link / browser audity.
- Main a dev synchronizovat bez force až po úspěchu.
- Git merge nestačí k publikaci: na WordPressu použít **Deployer for Git → Pull → Deploy**, větev `dev`.
- Po deploy ověřit stav stránky HTTP 200, canonical HTTPS, title, meta description, sitemap, funkční interní odkazy a přívětivý mobilní layout.

## Měření a hranice
Hledanost low-competition není doložená, neodvozovat návštěvnost ani konverze z pouhé publikace. Ověřit skutečné dotazy a CTR z Google Search Console. Obsah nenahrazuje individuální lékařské ani fyzioterapeutické posouzení.
