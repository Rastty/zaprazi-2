# Zápraží 2.0 – audit historického archivu (27. 10. 2026)

**Status: read-only audit skutečné produkční WordPress databáze. Žádný článek zatím nebyl smazán, přesměrován, skryt ani přepnut na noindex.**

## Kontext a rozhodnutí

Zápraží má novou misi **Bezpečně a samostatně doma** pro seniory a jejich pečující rodiny. Vedle nových bezpečnostních a produktových poradců zůstává rozsáhlý historický obsah energetiky a stavebnictví. Pro obchodní a obsahový fokus je to zjevný nesoulad. Není však doložena „Google penalizace“ ani počet příspěvků indexovaných Googlem; nelze slibovat zlepšení pořadí pouhým smazáním.

**Verdikt:** historický archiv předat do řízeného obsahového útlumu s pozitivními výjimkami pro doložené hodnotné URL. První krok je evidence, klasifikace a řízený malý reverzibilní canary, potom větší kohorty. Nevydávat 4 360 příspěvků za 4 360 „thin“ stránek: průměrný zdrojový HTML obsah má 8 036 znaků a žádný nemá méně než 800 HTML znaků.

## Ověřené produkční údaje

Zdroj: WP-CLI read-only SQL ve WordPressu https://zaprazi.cz, skutečná produkční databáze, 27. 10. 2026.

| Zjištění | Počet | Interpretace |
|---|---:|---|
| Publikované legacy příspěvky | 4 360 | WordPress post_type=post, status=publish |
| Publikované samostatné stránky | 53 | včetně moderních poradců; není to počet unikátních šablon |
| Nepublikované legacy příspěvky ve stavu pending | 135 | nepublikovat automaticky |
| Publikované články 2023 | 3 691 | těžiště hromadné produkce |
| Publikované články 2024 | 575 | další vlna historického obsahu |
| Kategorie „Tepelná čerpadla a fotovoltaika“ | 2 014 | mimo novou misi |
| Kategorie „zařízení“ | 962 | převážně technické vybavení budov; vyžaduje podvzorek |
| Kategorie „Čerpadla a domácí vodárny“ | 566 | mimo novou misi |
| Kategorie „Ventilátory“ | 508 | mimo novou misi |
| **Unikátní příspěvky ve čtyřech kategoriích výše** | **4 050 = 92,9 %** | deduplikováno COUNT DISTINCT |
| Příspěvky mimo tyto čtyři kategorie | 310 | neznamená automaticky relevantní; voda, úklid, kancelářské zdravotnické vybavení aj. |
| Obsah s historickým Shortcodes Ultimate [su_button] | 4 266 = 97,8 % | masově vložená promo CTA |
| Příspěvky obsahující celý vložený <!DOCTYPE html> | 3 994 = 91,6 % | silná známka nekvalitního/nesprávně vloženého HTML |
| Příspěvky s iframe | 4 274 = 98,0 % | auditovat, není to samo o sobě chyba |
| Příspěvky s odkazem na /fotovoltaika | 1 162 | bývalá obchodní cesta |
| Příspěvky s odkazem na /tepelna-cerpadla-w | 852 | bývalá obchodní cesta |
| Příspěvky s http:// ve zdrojovém obsahu | 322 | prověřit odkazy a původ |
| Příspěvky s Yoast metadescription | 4 271 | strojově vyplněná metadata neznamenají hodnotný text |
| Příspěvky s vlastním Yoast noindex meta | 0 | absence per-post noindex neprokazuje, že Google všechny indexoval |
| Články s odkazem v post_content na nové vybrané /senior-*, /choditk* či /koupelna-a-wc | 0 | audit pouze těchto řetězců; další odkazy nevylučuje |
| Průměr délky post_content (HTML znaky) | 8 036 | nejde o délku čistého textu ani důkaz originality |
| Doslova duplicitní post_content podle MD5 | 0 | neodhalí podobné/přeformulované články |

Přesnou kvalitu 4 360 článků nelze odvodit jen z SQL znaků, data publikace a kategorie.

### Extrémní publikační tempo

2023-06-09: **367** zveřejněných příspěvků; 2023-06-10: **296**; 2023-06-08: **238**. Hromadná produkce vyvolává důvod k detailní kontrole originality a užitečnosti, nikoli automatický důkaz AI původu či spamu.

### Příklad ověřený přímo na živém HTML

URL: https://zaprazi.cz/solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu/

- V Yoast/HTML hlavičce je `robots=index, follow`, canonical na samotný článek a starý solární titulek; značka webu v `og:site_name` je nové „Zápraží“.
- V obsahu je opakovaná výzva `Fotovoltaika v AKCI` směrem na historickou /fotovoltaika, starší fotovoltaické obrázky a obecný text.
- Ve strukturovaných datech je autor s popiskem zkušeností ve stavebnictví, nikoli odbornou specializací na seniory.
- Jiný ověřený vzorek (ID 7529) obsahuje do WordPress post_content vložené `<!DOCTYPE html><html><head>...`, tzn. chybně strukturálně zabalený dokument.
- Tento vzorek není důkazem rankingu, backlinků, ani stejné vady na každém jednotlivém URL.

## Proč nesmazat 4 360 příspěvků dnes

1. Není strojový přístup k historickým datům **Search Console pro zaprazi.cz**; nový obsah je příliš čerstvý pro jeho výkon, ale **historická data starých článků** jsou už nyní relevantní k ochraně jejich případné návštěvnosti.
2. Nejsou vyhodnoceny externí odkazy, přímé návštěvy, Googlebot crawl logy ani jiné hodnoty starých URL.
3. Hromadný redirect všech nesouvisejících témat na homepage by mohl být vyhodnocen jako soft 404. 301 používat pouze pro přesný nebo velmi blízký odpovídající cíl.
4. Smazání všeho by bylo obtížněji vratné a mohlo by zrušit užitečný obsah. Neprovádět plošné destruktivní SQL operace ani „robots.txt Disallow“ místo noindex.

## Operativní rozhodovací matice

| Skupina | Kritéria | Zamýšlená akce |
|---|---|---|
| KEEP / PROTECT | doložená návštěvnost, kvalitní zpětné odkazy, jinak hodnotná původní URL | zachovat nebo smysluplně přesunout; žádné plošné přepisy |
| IMPROVE / MIGRATE | obsah skutečně pomáhá rodinám/seniorům, ale zpracování je slabé | odborně upravit na existující URL; případně jednotlivé přesné 301 |
| QUARANTINE / CANARY | stará nerelevantní technická témata, templated promo + vadný HTML document, po kontrole bez doložených kladných signálů | první kohorta 100–250 kusů: vratné `noindex,follow`, zkontrolovat sitemap/live HTML, zpětné odkazy a případný dopad |
| RETIRE | po delším sledování bez hodnoty, bez užitečné náhrady | 404/410 u skutečně odstraněných URL; žádný falešný redirect |
| EXCEPTION | nejasná relevance, riziko historické hodnoty nebo rozdílné odborné téma („nábytek pro ordinace“) | manuální evidence, dočasně HOLD |

### Konkrétní realizace

1. **P0 – hotovo:** inventura rozsahu, kategorie, kvalita starého HTML, typové promo, verifikace indexovatelného vzorku. Výsledek tento soubor.
2. **P1 – preview:** přiřadit klasifikaci čtyřem off-topic kategoriím a zbývajícím 310 příspěvkům; vyexportovat snapshot ID+slug+status+term ID+existující Yoast robots bez osobních údajů. Zkontrolovat případné návštěvy/backlinky, především články s vysokou historií.
3. **P2 – canary s rollbackem:** neodstraňovat URL ani článek; podle výsledků P1 aplikovat `noindex,follow` pouze na přesně vybranou první kohortu 100–250, a ověřit správnou změnu na veřejném HTML i v sitemapě. Uchovat manifest předchozího stavu k bezpečnému vrácení.
4. **P3 – velké vlny:** pokud P2 neodhalí rizika, po 250–500 článcích pokračovat v oddělených kohortách s QA. Nenechávat interní odkazy a staré redirekty do prázdna.
5. **P4 – odstranění či migrace:** až po posouzení dlouhodobé hodnoty jednotlivých URL; nesouvisející obsahy nepřesměrovávat na poradce seniorů bez shody záměru.
6. **P5 – hlídání budoucna:** zastavit další publikaci mimo témata bezpečného a samostatného života doma, změny auditovat po každé vlně.

### Nepřekročitelné kontrolní brány

- Žádný zásah do 53 stránek nebo moderních poradců; vybírat výhradně `post_type='post'`, `post_status='publish'`, přesně zdokumentované kategorie / ID.
- Žádné hromadné `DELETE` nebo `UPDATE` přes SQL bez předem vytvořeného rollbacku.
- Vyhodnocovat `indexability` z HTML a GSC zvlášť. Meta `noindex` nesmí být schovaná za `robots.txt Disallow`.
- Ověřit Yoast sitemap, canonical, SEO metadata a e-commerce safe gates po každé vlně.
- Pořadí je kvalita a relevance → bezpečné vyřazení → případná konsolidace. Žádná garance růstu Googlu.

## Oficiální podklad

- Google Search Central: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google: https://developers.google.com/search/docs/appearance/core-updates
- Google: https://developers.google.com/search/docs/crawling-indexing/control-what-you-share
- Google: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

Google výslovně rozlišuje odstranění neužitečného obsahu od odstranění starého obsahu „kvůli čerstvosti“. Odstranění není automatický ranking hack, změny se vyhodnocují v čase.
