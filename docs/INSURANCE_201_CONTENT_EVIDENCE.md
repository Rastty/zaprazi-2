# Zápraží 0.8.201 — praktický obsah pro chodítko na pojišťovnu

## Evidence a volba jediné URL (2026-11-08)

Prometheus [ověřený GSC 28d export](https://github.com/Rastty/prometheus-growth-os/actions/runs/42235726854) za **2026-10-07 až 2026-11-03** uvádí `/choditko-na-pojistovnu/` **54 impressions / 2 clicks / CTR 3,7 % / prům. pozice 10,37**. Jde o **malý vzorek**, bez spolehlivého předpokladu uplifu. Sitewide souhrn: **884 impressions / 11 clicks**. Sanitizovaný důkaz **neobsahuje page-filtered konkrétní search queries**; z tohoto období tedy nelze věrohodně prohlašovat, že jsme optimalizovali přesná klíčová slova podle dotazů. Nezaměňovat URL a query data podle pořadí řádků.

## Co návštěvník reálně získá

U existující indexované stránky `/choditko-na-pojistovnu/`, bez vytváření nové URL a dalšího archivu:
- jasnější H1 a první CTA na praktickou přípravu;
- dvě čitelné varianty rozhovoru: **lékař** (bezpečná potřeba, zda může být předepsán ePoukaz) a **oprávněná výdejna** (přesný model, úhrada, doplatek);
- příklady otázek v běžné češtině, bez sběru zdravotních údajů;
- odkaz na sedm měření, původní bezpečný poradce a oficiální zdroje;
- jednoznačné varování, že dřívější nákup není automaticky zpětně proplatitelný, a že přesný model a částku musí ověřit výdejce.

Využívá současné CSS komponenty `.zp-decision-grid`, `.zp-decision-card`, žádné nové závislosti ani komerční CTA před poradcem.

## Ověřené zdroje

- SÚKL: [Pravidla pro předepisování a výdej od 1. 1. 2026](https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/) a [ePoukaz elektronicky od 1. 1. 2026](https://sukl.gov.cz/media/tiskove-zpravy/poukaz-na-zdravotnicke-prostredky-od-1-ledna-2026-uz-jen-elektronicky/).
- VZP: [Proplacení chodítka](https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka) — zpětné proplacení po soukromém zakoupení není možné.
- Žádná položková listopadová cena SÚKL nebo nový údaj o skladové dostupnosti není dovozena z předchozího říjnového zdroje.

## Akceptace a učení

1. Merge jen po CI, 100/100 release markerů a přesných kritických blob pinoch; přezkoumat ostatní 0.8.201 source checks.
2. **Manuální WordPress Pull + Deploy z `dev`**. Bez něj je nová sekce pouze v GitHub repozitáři, nikoli v produkci.
3. Nezávislá read-only produkční kontrola musí potvrdit `release=0.8.201`, `integrity=ok`, `configured_total=25/25`, nové ID `priprava-pro-lekare`, vnitřní odkazy a beze změny poradce/fit-gates.
4. Vyhodnotit **srovnatelná** GSC okna za 14 a 28 dní od deploye: impressions, organic clicks, pozice, CTR na této konkrétní URL, a při souhlasu zvlášť agregovaný `guide_advisor_click`. Před případným druhým copy edit získat **page-filtered queries**. Nehodnotit výsledek podle celkových návštěv ani podle vypočtených affiliate provizí bez síťových důkazů.
5. `growth-state.json` úmyslně neměníme před vznikem postdeploy či nových GSC dat. Schválené provize zůstávají UNKNOWN.

## Zásady

Úprava nemění pozici produktů, affiliate URL, ceny, zdravotní rozhodnutí, aktuální nároky, ochranu soukromí ani číslo úhrady. Jde o **jedno bezpečné obsahové vylepšení a jeho odpovědné vydání**, nikoliv založení dalšího SEO klastru.
