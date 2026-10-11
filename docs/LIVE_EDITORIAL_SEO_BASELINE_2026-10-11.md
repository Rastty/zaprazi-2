# Zápraží — živý audit klíčových SEO stránek (11. 10. 2026)

## Jak byl audit proveden

Zdroj: read-only Chrome v [GitHub Actions #38150455035](https://github.com/Rastty/zaprazi-2/actions/runs/38150455035), aktivní verze **0.8.109**, mobilní viewport 390 px. Nový skript `scripts/audit-live-editorial-seo.mjs` prochází homepage a 26 prioritních decision/resource URL a porovnává jejich **skutečný DOM** (Yoast title/meta, self-canonical, H1, meta robots, obsahové odkazy v `main` a cílová `id` kotev). Přidává testy v `tests/editorial-seo-rules.test.js`.

Není to GSC audit ani kontrola úplně všech odkazů HTTP GET, externích zdrojů nebo obsahu 4 360 historických článků. Vztah grafu znamená tematické odkazy v obsahu (`main`), nikoli pouhé položky společné patičky.

## Výsledek auditu

- **27/27** URL HTTP 200.
- **27/27** mají právě jeden H1 a správný HTTPS self-canonical; žádná kontrolovaná stránka nemá `noindex`.
- **27/27** mají unikátní title; mezi **26 existujícími** meta descriptions nebyla duplicita.
- **1** chybějící description: `/jak-vznika-doporuceni/`; 26 zbývajících ji má.
- Zaznamenáno **200** obsahových link edges (včetně opakovaných linků); všech 26 podstránek má minimálně jedno tematické propojení z jiné stránky ve vybraném vzorku.
- Nezjištěny rozbité lokální `#fragment` odkazy mezi vzorkovanými stránkami, které skript dovedl zkontrolovat.

Nejslabší inbound ve vzorku: `/jak-zmerit-chodidlo-pro-vyber-obuvi/` (1), stránky pořízení postele a vozíku (2), `/pujceni-choditka/` (2). Nízký počet **není automaticky chyba** a nesmí vést k umělému rozmisťování patičkových odkazů.

## Konkrétní náprava

Ve verzi **0.8.110** se doplňuje jediný transparentní meta popis pro stránku metodiky. Používá existující Yoast `wpseo_metadesc` filter, a když Yoast není aktivní, zobrazí právě jeden fallback `<meta name="description">`. Nová produkční QA `tests/production-advisor-smoke.mjs` po deployi kontroluje reálnou metadata strukturu, text bezpečnostních omezení a absenci commerce zkratek.

## Další kroky

1. Po Pull+Deploy 0.8.110 spustit produktový browser QA: 14 poradců, 25/25 affiliate, 66/66 release integrita, stránka metodiky s meta popisem.
2. Získat skutečná GSC data za 28 a 90 dní (stránky a dotazy) a potvrdit indexaci; bez nich netvrdit růst či pokles návštěvnosti.
3. Zaměřit kvalitní tematické návodové rozšíření **jen** tam, kde data a vyhledávací záměr potvrzují samostatnou potřebu; nemazat staré archivy bez doložené evidence a plánu rollbacku.
