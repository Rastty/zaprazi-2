# Zápraží 0.8.237 — doložená data významných změn v Mobility SEO

## Proč

Veřejný `https://zaprazi.cz/page-sitemap.xml` a Yoast `WebPage.dateModified`
na živé verzi **0.8.236** dne **19. 11. 2026** shodně ukazovaly:

| Kanonická cesta | Live 0.8.236 | Doložená významná změna | 0.8.237 cíl |
| --- | --- | --- | --- |
| `/choditko-na-pojistovnu/` | 2026-11-10 | PR #810, 2026-11-16 | 2026-11-16 |
| `/co-zmerit-pred-vyberem-choditka/` | 2026-11-08 | PR #812, 2026-11-16 | 2026-11-16 |
| `/choditka-pro-seniory/` | 2026-11-15 | PR #814, 2026-11-17 | 2026-11-17 |

Jde o změny první obrazovky/rozhodovacích instrukcí, nikoliv o datum
samotného releasu. Všechny ostatní datumy zůstávají beze změny; zvláště
PR #809 pouze přeorganizovalo stejný obsah na stránce
`/senior-nemuze-vstat-z-postele/` a datum nebylo spekulativně zvýšeno.

## Změna a bezpečnost

- Pouze tři hodnoty v existujícím zdroji `zaprazi_2_material_sitemap_page_dates()`.
- Stejný zdroj obsluhuje Yoast per-page `<lastmod>` a `WebPage.dateModified`.
- Nejsou změněny canonical URL, robots, přesměrování, data vydání článků,
  produktový fit, afiliace, analytika ani osobní údaje.
- `0.8.237` má kompletní runtime release markery a přepočtené integrity pins.
- Přednasazovací SEO kontrola používá přesně doložené staré hodnoty z 0.8.236;
  nová data nikdy nepředstírá jako již nasazená.

## Ověření / následný krok

1. PR: CI, PHP syntax a materiální XML/Schema kontrakty PASS; read-only
   predeploy proti skutečně živé **0.8.236**.
2. Merge `main` a fast-forward `dev` až po všech povinných branách.
3. **Pouze owner** provede WordPress Deployer Pull + Deploy; merge sám nestačí.
4. Potom přesné live `0.8.237`, `integrity=ok`, 25/25 affiliate a 14 poradců QA.
5. Znovu odečíst tři veřejné XML `<lastmod>` i JSON-LD `dateModified`:
   datum nesmí být starší než cíl a nesmí být v budoucnosti. Kontrola
   celého sitemap indexu sama tyto jednotlivé záznamy neověřuje.

Toto opravuje metadata skutečných revizí. **Nedokazuje indexaci v Googlu,
změnu pořadí, organický růst ani schválenou affiliate provizi.**
