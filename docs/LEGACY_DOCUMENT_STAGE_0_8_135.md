# Zápraží 0.8.135 — řízené rozšíření opravy historických článků

**Schválený technický důkaz:** verze 0.8.134 živě prošla REST → DOM srovnáním obou canary postů 8105/8106: 537/537 a 533/533 slov, všechny původní odkazy a obrázky. Post 6801 zatím pouze 3/258 slov (kontrolní negativní vzorek). Browser QA: [run 38547681435](https://github.com/Rastty/zaprazi-2/actions/runs/38547681435).

## Staged batch

Rozšiřujeme **pouze zobrazení** historických publikovaných postů o ID dělitelném osmi, přibližně jednu osminu archivu, a o jednotlivý významně poškozený post ID 6801. Již úspěšné 8105/8106 zůstávají součástí. Ostatní posty zůstávají na původní cestě. Volba podle ID je stabilní a nedotýká se metadat, canonical ani URL. Konkrétní počet v dávce je dán aktuálními publikovanými ID, nikoli odhadnutými 545 záznamy.

Původní priorita-3 filtr je přeskočen pouze u způsobilých postů; prioritní-99 fail-closed filtr odstraní vnořené dokumentové značky pouze tehdy, když zůstanou stejné viditelné texty, všechny atributy href/src/id a HTML nemá rizikové atributy obálky.

## Akceptace

- PHP a JS unit testy + PHP lint všech šablon; chráněná release integrita 70/70.
- Před deployem všechny poradce 14/14 a SEO 27/27 kontrola proti poslední produkci.
- Po deployi 0.8.135 produkční browser QA kontroluje dvě známé canary, post 6801 a osm reprezentantů stabilní dávky z veřejného REST API. Porovnává slova, počty odkazů a obrázků s publikovaným post body. Post 6801 je zvlášť důležitý.
- Žádná změna databáze, SEO indexace, historických affiliate cílů nebo automatický rollback jiných článků. V případě selhání akceptace okamžitě nasadit zpět 0.8.134.
- Až po zelené akceptaci vzorku se rozhodne o rozšíření; **nevydávat tvrzení o zlepšení organické návštěvnosti bez GSC**.

Poznámka: technická obnova textu může zároveň zveřejnit historicky zastaralá tvrzení a reklamy. Redakční aktualizace, ověření komerčních cílů a tématická relevance jsou samostatná navazující práce.
