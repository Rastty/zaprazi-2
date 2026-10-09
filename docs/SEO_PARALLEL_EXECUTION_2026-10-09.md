# Zápraží 2.0 — souběžná SEO a obsahová realizace (9. 10. 2026)

## Rozsah a stav

Tento dokument nepřepisuje Master Vision ani P0. V repozitáři existuje 14 poradenských cest, skupiny odborných resource/decision pages, samostatný plán `/navrat-z-nemocnice/`, FAQ a interní odkazy. Archiv obsahuje přibližně **4 360 historických příspěvků** a inventuru `data/legacy-url-inventory.csv`. Některé staré stránky mohou kanibalizovat nová témata. GSC je podle repo dokumentace ověřené, **ale konkrétní počty zobrazení/kliků a indexované URL nejsou v repozitáři doložené**. Nedeklarovat indexaci či Core Web Vitals bez měření.

## Dva souběžné proudy

- **Proud A (kritický):** dokončení správnosti a mobilního UX 14 poradců → majitel projde scénáře → konkrétní feedback → opravy/regrese → opakované ověření. Každý feedback uvádí URL, otázku/varianty, co se očekávalo a co se skutečně stalo, ideálně screenshot; **bez osobních nebo zdravotních údajů**.
- **Proud B (SEO bez bezpečnostních regresí):** číst GSC a archiv, mapovat vyhledávací záměry, zkvalitnit již existující landingy, doplnit kvalitní informační obsah a v kontextu jej navázat na poradce. Nové stránky publikuje až kontrola faktů, jedinečného účelu, odkazu na konkrétní akci, accessibility a kanibalizace. Editace poradenského enginu nejsou SEO úkol.

## První tematické clustery — nenásobit podobné stránky

| Cluster / hlavní existující cíl | První doporučená užitečná informační podstránka | Samostatná potřeba návštěvníka | Kontextové odkazy |
|---|---|---|---|
| **Návrat z nemocnice** `/navrat-z-nemocnice/` | „Na co se zeptat v nemocnici před propuštěním domů“ (připravit unikátní redakční obsah, ne duplikát první noci) | rodina potřebuje seznam otázek pro ošetřující tým, bezpečné přesuny, péči a dopravu | obousměrně na průvodce návratem, bezpečný byt, chůzi, WC a lůžko podle tématu |
| **Bezpečný domov** `/bezpecny-byt-pro-seniora/` | „Bezpečná cesta z postele na WC: co ověřit v bytě“ | noční osvětlení, trasa, překážky, opora a odborná kontrola při rizikovém přesunu | bezbariérový vstup, koupelna/WC, lůžko, mobilita, návrat z nemocnice |
| **Pomůcky a získání** `/kompenzacni-pomucky-pro-seniory/` | nejprve **zkvalitnit existující** `/pujceni-choditka/`, `/choditko-na-pojistovnu/` a příslušné odborné stránky; nevytvářet novou obecnou „pomůcky pro seniory“ | půjčit/koupit/ověřit úhradu konkrétní pomůcky | příslušný poradce, oficiální pravidla SÚKL / pojišťovny a aktuální zdroje |

Ještě **nepublikovat stejné fráze na více URL**. Konkrétní názvy a cíle potvrdit až po kontrole inventury a GSC. Při nedostupných datech být konzervativní a nejprve zlepšit existující URL.

## Každá publikovaná stránka musí mít

1. Jasně definovaný vyhledávací záměr a odpověď čitelnou hned na začátku.
2. Praktické kroky v jednoduché češtině, bez diagnózy a bez nákupního tlaku.
3. Oficiální zdroje, rozsah platnosti a datum ověření u proměnlivých údajů; přiznané limity externí odborné revize.
4. Kontextové interní odkazy **z článku do příslušného poradce**, zpět ze souvisejícího hubu a přirozeně i na další tematicky související obsah. Žádné automaticky generované linkové patičky do stovek článků.
5. Unikátní titulek, H1, výstižný meta popis, přirozené anchor texty, smysluplné kanonické URL a kontrolu indexovatelnosti; FAQ schema jen pokud odpovídá viditelnému obsahu a platným podmínkám Googlu.
6. Reálný další krok i bez affiliate odkazu; CTA komerční až tehdy, když odpovídá podložené potřebě a projde produktem vyžadovaným bezpečnostním gate.

## SEO a indexace — ověřovací brána

- GSC: export 28/90 dní po URL a dotazu; udržovat datum exportu, property a rozsah. `unknown/no data` není `zero`. Sleduj indexaci, skutečné kliky a dotazy, ne falešné záruky rankingu.
- Sitemap/robots/canonical: ověřit veřejné odpovědi a sitemap property přímo v Search Console; špatně indexované archivy a duplicitní adresy řešit **až po** posouzení významu starých 4 360 URL. Neprovádět masové 301 na homepage ani plošné noindex bez dat.
- Interní linking: evidovat přinejmenším odkaz `hub → obsah → poradce → další krok` a zpětný související odkaz. Zkontrolovat nefunkční interní URL v katalogu i archivu podle návštěvnosti.
- Externí autorita: získávat doporučení přirozeně užitečnými zdroji vhodnými ke sdílení; případné redakční zmínky přijmout, **nezakládat nyní outreach a nekupovat zpětné odkazy**.

## Výkon — bez vymyšleného výsledku

- Před změnami pořídit reálnou mobilní a desktopovou baseline pro hlavní stránku, návrat z nemocnice, jednu produktovou decision page a jeden dlouhý článek. Oddělit laboratorní PSI/Lighthouse skóre od reálných CrUX dat; žádná data = žádný naměřený výsledek.
- Cílové dobré CWV na 75. percentilu návštěv: **LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1** (web.dev). Dále sledovat TTFB, JS payload, cache/CDN a obrázky.
- Kandidát: nepovinný consent adaptér není kritický obsah a nemá blokovat parsování v hlavičce; konkrétní optimalizace je v samostatném PR a musí projít CI + produkčním smoke. Nezasahovat do pořadí inicializace poradců a jejich privacy gate bez důkazu.

## Co je hotovo versus otevřené

- Hotovo: tento plán a mapování prvních existujících clusterů; doplnění schválené vize.
- Otevřené: GSC data, ověření indexace/robots/sitemap na produkci, PageSpeed baseline, kanibalizace starého archivu, editorial draft a faktické schválení nové podstránky, skutečně publikované URL, pozdější česká→slovenská lokalizace. Slovenský obsah nesmí být pouhý strojový překlad českých úhrad a institucí.

## Metodické zdroje

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google: užitečný obsah](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: procházení interních odkazů](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [web.dev: Core Web Vitals](https://web.dev/articles/vitals)
- [NZIP: Domácí péče](https://www.nzip.cz/clanek/209-domaci-pece)
- [NZIP: Zdravotnická doprava](https://www.nzip.cz/clanek/1072-zakladni-informace-k-cerpani-zdravotni-pece)
