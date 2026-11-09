# Zápraží 0.8.204 — SEO návštěvnost: půjčení chodítka a ePoukaz

## Doložené vstupní signály (9. 11. 2026)
- Jediný ověřený 28denní GSC export 2026-10-07 až 2026-11-03: **11 kliknutí / 884 zobrazení** za web; důkaz: https://github.com/Rastty/prometheus-growth-os/actions/runs/42235726854.
- Existující /choditko-na-pojistovnu/: **2 kliky / 54 zobrazení / průměrná pozice 10,37**. Obsah této URL byl velmi nedávno bezpečně rozšířen v 0.8.201, proto ho nepřepisujeme podruhé bez přesných page-filtered queries.
- Starší autorizované období 2026-10-05 až 2026-11-01 u /pujceni-choditka/: **0 kliků / 5 zobrazení / průměrná pozice 5,40**. Jde o extrémně malý vzorek; nikoli důkaz, že pouze změna titulku způsobí růst. Zdroj: https://github.com/Rastty/prometheus-growth-os/actions/runs/41849781731.
- Query-level intent není k jednotlivým stránkám v agregovaném důkazu bezpečně spárovaný; neprohlašovat, že máme doložené přesné klíčové fráze.

## Jedna užitečná existující URL, žádná nová duplicita
Na /pujceni-choditka/ přidáváme nad ceníky čtyřkrokový praktický postup, který funguje i tehdy, když jsou říjnové ceníky po 6. 11. 2026 zastaralé: bezpečný typ → dostupný přesný model a rozměry → celkové náklady včetně kauce a dopravy → předání a návod. Vedeme uživatele na stávající měření, srovnání typů, vlastní nabídku půjčovny a ePoukaz. Bez nové indexovatelné URL, zdravotních vstupů, přímých affiliate CTA nebo falešných aktuálních cen.

V existujícím Yoast/fallback title adaptéru zavádíme konkrétní odlišné title pro /pujceni-choditka/ a /choditko-na-pojistovnu/ a krátké ověřitelné meta popisy. Google výslednou podobu SERP může přepsat; netvrdit, že se snippets zobrazí právě takto.

## Bezpečný release gate
- Plná synchronizace 100 značek release 0.8.204 + CSS/PHP version + 4 Git SHA pinů; substantivní návštěvnický zásah je nová první odpověď na půjčení a SEO metadata pro 2 existující landingy.
- CI, PHP lint, testy bezpečnosti a postdeploy live Chrome musí projít. WordPress změna bude dostupná až po Pull + Deploy; merge není publikace.
- Neměnit produktové fit-gates, pořadí doporučení, obchodní odkazy, ceny, skryté odpovědi či consent.
- Kontrolovat ve srovnatelném 28denním GSC okně **URL-level** impressions, clicks, CTR, position; nemoct slíbit zisk nebo růst z 5 zobrazení. Před další redakční úpravou chtít stránkově filtrované dotazy; u provizí zachovat UNKNOWN.
