# Zápraží 2.0 — evidence-first SEO prioritizace z Google Search Console

**16. 10. 2026 · Nástroj do repozitáře, bez zásahu do WordPressu, bez nového deploye.**

## Co jsme zjistili
- ZaPraží má 27 veřejných prioritních stran, které v produkčním browser QA prošly (0.8.140). Veřejné HTML a sitemap jsou ověřené, ale **neříkají, kolik lidí přichází z Googlu**.
- Web má přes 4 tisíce historických příspěvků z odlišných témat. Bez reálných GSC dotazů/kliků se nesmí plošně mazat/noindexovat/přesměrovávat.
- Zatím není dostupné autorizované strojové čtení GSC pro `zaprazi.cz`. Instalovat Windsor.ai uživatel dříve odmítl; není to podmínka tohoto nástroje. Současný GSC výkon: **UNKNOWN**, ne nula.

## Jak získat první reálná data bez nového pluginu
1. Otevřete <https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Azaprazi.cz> (nebo přímo property `zaprazi.cz` v GSC).
2. **Výkon → Výsledky vyhledávání**, vyberte **posledních 28 dní** a zapněte Kliknutí/Zobrazení/CTR/Pozice. Klikněte **Exportovat → Stáhnout CSV**, rozbalte ZIP. Z něj budou potřeba `Pages.csv` (Stránky), volitelně `Queries.csv` (Dotazy).
3. Opakujte pro **posledních 90 dní**. Uchovejte CSV soukromě, **necommitujte je** do veřejného GitHubu.
4. Příklad lokálního zpracování:
```sh
node scripts/gsc-opportunity-report.mjs --pages /private/Pages.csv --queries /private/Queries.csv --from 2026-09-18 --to 2026-10-15 > /private/zaprazi-gsc-28d.md
```
Skutečný rozsah `--from`/`--to` přepište podle exportu; uvedená data jsou pouze ilustrací.

## Co výstup opravdu umí
- Různé jazykové CSV hlavičky EN/CZ, 1000-row omezené GSC UI exporty, desetinné čárky, BOM, číselné oddělovače a bezpečné lokální odkazy.
- Seřadí **27 nových prioritních URL** podle počtu zobrazení, přibližné pozice a orientačních signálů pro obsahovou revizi.
- Zvlášť vypíše **jiné a historické URL** pouze k manuálnímu posouzení, nikdy k automatickému zásahu.
- Zvlášť vypíše **dotazy na úrovni celé Search Console property**. Export `Queries.csv` není spárován s `Pages.csv`; pokud potřebujeme přesně „dotaz → URL“, v GSC je nutné nejprve použít filtr stránky a exportovat dotazy pro ni, nebo použít autorizované Search Analytics API s dimenzemi query/page.
- Stránky chybějící v exportu jsou **unknown**. Nejsou automaticky označeny nulovou návštěvností, neindexovanými nebo bez potenciálu.
- Výpočtové skóre znamená **prioritu lidské redakční revize**, nikoli reálnou SEO pozici, garantovaný klik nebo predikci tržeb.

## Rozhodovací kritéria pro 1. skutečnou optimalizační vlnu
1. Zobrazení + pozice 4–20 na **existující** tématicky relevantní URL.
2. Zda dotaz řeší rozhodovací nebo nákupní problém, který náš bezpečný poradce skutečně umí.
3. Lepší titulek/snippet nebo užitečný obsah na téže URL před tvorbou duplicit.
4. Kvalitní interlink přímo do vhodného poradce a bezpečných kroků, nikoliv do obchodníka bez fit kontroly.
5. Historické URL pouze KEEP/IMPROVE/HOLD podle prokázané relevance a návštěvnosti; destruktivní kroky vyžadují ještě backlink důkazy a rollback.

### Co tento nástroj nedělá
Nenačítá Google účty ani API, neodesílá CSV nikam na internet, nesahá do WordPressu, nepřepisuje SEO meta, nevytváří stránky a nenasazuje redirecty. Pokud uživatel pošle export do chatu, analýzu lze provést i bez lokálního CLI. Datové exporty nejsou uloženy v repozitáři.
