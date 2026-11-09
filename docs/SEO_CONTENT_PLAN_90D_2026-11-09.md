# Zápraží.cz — evidence-first SEO/content plan na 90 dní
**Připraveno:** 2026-11-09 · **Horizont:** 9. 11. 2026 – 7. 2. 2027 · **Režim:** redakční plán, žádná automatická publikace.
**Autority:** `docs/ZAPRAZI_SOURCE_OF_TRUTH.md`, `AGENTS.md`, `docs/GROWTH_GRAPH_OS.md`. Obsah musí podporovat stávající Domácí poradce, nikdy nenahrazovat jeho rozhodovací logiku.

## 1. Strategická teze
**Bezpečně a samostatně doma:** vyhledávací dotaz o konkrétní situaci → nejlepší praktická odpověď → checklist → existující vhodný poradce → bezpečný krok (úprava domácnosti / ověřená služba / půjčení / pojišťovna / koupě). Užitečnost i bez nákupu. Ne obecný senior-magazín a ne masová generace článků.

Primární publikum: děti seniorů a další pečující, kteří řeší akutní nebo postupně se zhoršující soběstačnost. Sekundárně samotní senioři. Primární geografická oblast Česko.

**North star:** nebrandové organické kliky do tematicky relevantních URL, nikoli objem článků. Druhá obchodní metrika jsou skutečně *schválené* affiliate provize z odpovídajícího období, bez ovlivnění vhodnosti doporučení.

## 2. Co je skutečně doloženo (neplést s hledaností trhu)
- ČSÚ: na konci 2025 **2 272 755** obyvatel 65+, **20,8 %** populace; internet používá **59,8 %** seniorů (2025): https://csu.gov.cz/seniori .
- V `config/growth-state.json` na main, `asOf=2026-11-07`: **11 organických kliků / 884 zobrazení** za dokončených 28 dní, [přesný GSC read-only run](https://github.com/Rastty/prometheus-growth-os/actions/runs/42235726854). Celé `zaprazi.cz`, ne tržní měsíční hledanost klíčových slov.
- Detail dřívějšího 28denního GSC intervalu **5. 10.–1. 11. 2026**: `/choditko-na-pojistovnu/` **50 zobrazení, 1 klik, průměrná pozice 10,78**; `/rollator-pro-seniory/` **8 zobrazení, pozice 7,0**; `/invalidni-vozik/` **6 zobrazení, pozice 5,67**; `/pujceni-choditka/` **5 zobrazení, pozice 5,40**; `/navrat-z-nemocnice/` **3 zobrazení, pozice 11,0**. Malé vzorky! Viz `docs/GSC_LIVE_BASELINE_2026-11-04.md`. Pokud URL v datech chybí, je to UNKNOWN, nikoli 0 nebo neindexováno.
- Projekt již má **53 moderních stránek** v inventuře a řadu hodnotných existujících landingů a poradenských cest. Původní WP obsah: **4 360** publikovaných legacy posts, z toho 4 050 ve čtyřech převážně nerelevantních kategoriích; `docs/ARCHIVE_AUDIT_2026-10-27.md`. Bez URL-level GSC a backlink důkazů nemazat ani plošně přesměrovávat.
- Exaktní **měsíční objem hledání** konkrétních dotazů (ČR, Google/Sklik) zde **NENÍ ověřen**. Níže značka V/S/N je **kvalitativní hypotéza relativní poptávky**, opřená o SERP charakter a uživatelskou naléhavost, **ne číselný Keyword Planner/Sklik odhad**. Cílem další validace je dostat skutečná data: GSC dimenze page+query, 28/90 dní a externí Keyword Planner/Sklik s uloženou metodikou.

## 3. Konkurence a obranné výhody
- Institucionální zdroje (MPSV, ÚP, NZIP, SÚKL) dominují právním/zdravotním tvrzením a musí být citovány a aktualizovány; nesnažit se přepisovat zákon nebo diagnostikovat.
- Oporu Diakonie, Pečuj doma, Alzheimer NF a obdobné projekty používá rodina pro poradenství a kontrolní seznamy: https://oporadiakonie.cz/prirucky-pro-pecujici/ ; https://mpsv.gov.cz/pece-a-sluzby .
- E-shopy zdravotních pomůcek, výrobci a lékárny silně pokrývají generické kategorie typu „chodítka“ či „sprchovací židle“.
- **Diferenciace Zápraží:** specifická domácí situace + rozměry + vysvětlené podmínky + konkrétní ověřené cesty **koupit / půjčit / prověřit úhradu**, často interaktivní poradce + tisknutelný seznam. Ne „top 10 pomůcek“ bez fit-gate.
- Příklady SERP konkurence k ověření: https://www.meyra.cz/clanky/choditko-pro-seniory-jak-vybrat.html ; https://www.medstore.cz/clanek.html?id=33 ; https://www.apeos.cz/propusteni-z-nemocnice--b29.html . Jednotlivé SERP nejsou náhradou měření měsíční hledanosti.
- Google people-first/YMYL guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content . Doložená kvalita a vlastní praktická hodnota před počtem publikací.

## 4. Tematické klastry a pořadí
| Klastr (hlavní záměr) | Poptávka – hypotéza | Konkurenční obtížnost – hypotéza | Priorita | Proč |
|---|---|---|---|---|
| Chůze, chodítko, rollátor, úhrada, půjčení | V | vysoká u head terms; střední u konkrétní situace | P0 | Existující poradce + první GSC impresní důkaz + akční vyústění |
| Koupelna, WC, sprcha, bezpečný transfer | V | vysoká u výrobků; střední u scénářů malého bytu | P1 | Měřitelné domácí rozhodnutí, ověřitelné fit-gates |
| Návrat z nemocnice, první dny doma, péče rodiny | V | vysoká u obecné „domácí péče“, nižší u konkrétní logistiky | P1 | Silná potřeba a přirozená návaznost na více poradců |
| Bezpečný byt, pády, schody, SOS | S–V | střední až vysoká | P1 | Praktické checklisty, užitečné bez nákupu |
| Polohovací postel a matrace: koupě/půjčení/úhrada | S | střední až vysoká | P2 | High-ticket, ale náročná faktická a bezpečnostní kontrola |
| Příspěvek na péči, služby, financování | V | velmi vysoká (MPSV/ÚP) | P2 | Trust a referral, potřeba přesné aktualizace a úzkého long-tailu |
| Výběr invalidního vozíku a průchody | S | střední až vysoká | P2 | Existující poradce; specifické praktické otázky |
| Obecné zdraví, léky, diagnózy, lifestyle „pro seniory“ | nehodnocena | velmi vysoká a YMYL | MIMO FOKUS | Neodvádět zdroje od mise |

## 5. Redakční backlog — PRVNÍ optimalizovat existující URL
Značení: **UPD** = rozšíření/revize jediné kanonické existující URL, nikoli nový článek. Pořadí určuje effort/effect + prověřený GSC; kvalifikace SERP a historických stránek stále potřebná.
| # | Priority | Intent / pracovní titulek | URL (existující) | Akce a specifická přidaná hodnota | Další krok návštěvníka |
|---|---|---|---|---|---|
| 01 | P0 | Chodítko na pojišťovnu: ePoukaz 2026, kdo předepisuje, co ověřit | /choditko-na-pojistovnu/ | UPD: SÚKL aktuální postup, výluka retail vs. výdej, praktické otázky pro lékaře/výdejnu, robustní první odpověď a link na fit | poradce mobilita + oficiální SÚKL |
| 02 | P0 | Jak vybrat chodítko: pevné, dvoukolové, rollátor | /choditka-pro-seniory/ | UPD: porovnávací rozhodovací schéma; jasně oddělit indoor/outdoor, obrázek/rozměry, ne duplikovat specializované landingy | odpovídající poradce |
| 03 | P0 | Co změřit před výběrem chodítka (7 položek) | /co-zmerit-pred-vyberem-choditka/ | UPD: tisknutelný checklist, ukázka prahu/dveří, další krok půjčení / ePoukaz / poradce; zachovat privacy tracking | akviziční rozhodnutí |
| 04 | P0 | Půjčení chodítka: kdy je výhodnější než koupě | /pujceni-choditka/ | UPD: zdroje, datované půjčovné, kauce/doprava, jednoduchý transparentní nákladový scénář bez neověřených cen | poradce → koupit/půjčit/úhrada |
| 05 | P0 | Rollátor se sedátkem: brzdy, šířka, převoz | /rollator-pro-seniory/ | UPD: fit-gate brzd, postup měření a přímá cesta ze SERP k poradci; malý GSC vzorek ≠ průkazná pozice | poradce rollátor |
| 06 | P1 | Jak upravit koupelnu pro seniora | /koupelna-a-wc/ | UPD: mapa problémů WC/sprcha/vana; levné úpravy vs výrobky; provozní bezpečnost | konkrétní koupelnový poradce |
| 07 | P1 | Sprchovací židle: co změřit, stabilita a prostor | /sprchovaci-zidle-pro-seniory/ | UPD: ověřené rozměry, 80×80 link, nosnost a vstup do sprchy; bez obecného „nejlepší“ | koupelnový poradce |
| 08 | P1 | Zvýšení WC: nástavec, opora, sed a chodidla | /nastavec-na-wc-pro-seniory/ | UPD: kontrola kompatibility, dosah chodidel, bezpečný transfer, samostatný výběrový checklist | koupelnový poradce |
| 09 | P1 | Jak zabezpečit byt seniora proti pádům | /bezpecny-byt-pro-seniora/ | UPD: 15min audit po místnostech; domácí plán bez nákupu, odkazy na 3 specifické problémy | checklist → specializovaný poradce |
| 10 | P1 | Návrat z nemocnice: první noc a týden doma | /navrat-z-nemocnice/ | UPD: jednoduchá časová osa, checklist koho kontaktovat, sladění zdravotní a sociální služby | poradce + pracovní list |
| 11 | P2 | Polohovací postel pro seniora: půjčit, koupit, úhrada | /polohovaci-postel/ | UPD: nákupní vs. pronájem scénáře, rozměry, kvalifikované riziko lůžka/matrace | existující poradce postel |
| 12 | P2 | Příspěvek na péči pro seniora | /prispevek-na-peci-pro-seniora/ | UPD: fakta MPSV/ÚP k 2026, co řešit po žádosti, co to není, propojení na službu | formulář oficiálního ÚP + rodinný plán |
| 13 | P2 | Jak vybrat pečovatelskou službu | /jak-vybrat-pecovatelskou-sluzbu/ | UPD: otázky před telefonátem, dostupnost, rozdíl proti zdravotní péči | kontakt na relevantní službu |
| 14 | P2 | Senior doma sám: SOS a tísňová péče | /senior-doma-sam-sos-pomoc/ | UPD: scénáře pro člověka bez chytrého telefonu, odpovědnost za přijetí alarmu, náklady | kontrolní seznam / poradce |

## 6. Kandidáti NOVÝCH URL — pouze po ověření samostatného intentu a neduplikace
Každý kandidát potřebuje před publikací konkrétní český SERP snapshot, filtrované GSC page+query, archivní overlap review, H1/outcome brief, zdroje a link graph. Pokud stávající URL odpovídá stejnému intentu, **sloučit jako sekci na existující URL**.
| # | Priorita | Pracovní titul / long-tail | Primární otázka | Odlišení od existujících URL | Potřebný užitek |
|---|---|---|---|---|---|
| N1 | P1 | Jak zajistit péči o rodiče doma, když musím chodit do práce | „Kdo pomůže, když u rodiče nemůžu být celý den?“ | Rodinné kapacity a plán služby, ne první noc po propuštění | rozpis rolí a možností pomoci |
| N2 | P1 | Domácí zdravotní péče, pečovatelská služba, osobní asistence: rozdíly | „Koho vlastně objednat a kdo to platí?“ | Konkrétní srovnání tří cest, ne obecný výběr pečovatelské služby | rozhodovací tabulka + kontakty na oficiální rozcestník |
| N3 | P1 | Jak upravit koupelnu pro seniora bez rekonstrukce a bez zbytečných nákupů | „Co změnit hned v malém bytě?“ | Rozpočtová/DIY bezpečnostní kontrola; ne produktový hub | checklist bezpečných kroků a věcí k odbornému ověření |
| N4 | P2 | Půjčovna kompenzačních pomůcek: jak vybrat a na co se zeptat | „Kde pomůcku půjčit a kolik stojí dovoz?“ | Cross-category půjčení napříč chodítky, postelí a vozíky, bez door-page podle měst | ověřený návod + případně skutečné poskytovatele |
| N5 | P2 | Když senior nechce přijmout pomoc doma: citlivý plán pro rodinu | „Jak se domluvit bez nátlaku?“ | Liší se od konkrétního odmítání chodítka/koupání | komunikace + bezpečný plán podpory |
| N6 | P2 | Dlouhodobé ošetřovné při péči o rodiče: co zařídit | „Můžu zůstat doma a nepřijít o příjem?“ | Samostatný administrativní intent; **nutná odborně ověřená aktuální pravidla ČSSZ** | ověřený krokový postup na oficiální instituce |
| N7 | P3 | Po propuštění z LDN domů: co se liší od běžné hospitalizace | „Převezmeme péči z LDN, co musíme mít?“ | Zveřejnit jen pokud SERP/GSC prokáže odlišný záměr od návratu z nemocnice | praktický checklist + zajištění péče |
| N8 | P3 | Jak rozdělit péči o rodiče mezi sourozence | „Kdo má co zařídit?“ | Organizační rodinná situace, nikoli výběr pomůcek | tisknutelná mapa úkolů, žádné osobní informace o zdravotním stavu |

## 7. Reálný 12týdenní publikační cyklus
- **Týdny 1–2 (9.–22. 11.):** ověřit 28/90d GSC page+query pro 01–05; změřit indexaci a existující stav; revize 01, 03 a 04 na stejné URL. Prověřit aktualizace SÚKL. Následně 14denní kontrola.
- **Týdny 3–4 (23. 11.–6. 12.):** revize 02, 05; přidat obsahové linky v pravdivé cestě homepage/hub → detail → poradce. SERP a redakční rozhodnutí pro N1/N2, nejvýše 1 nová kvalitní URL.
- **Týdny 5–6 (7.–20. 12.):** revize 06, 07, 08; případně N3, pokud má samostatný záměr. Vlastní fotografie nebo faktické schéma rozměrů s kontrolou správnosti, nikoli převzaté obrázky.
- **Týdny 7–8 (21. 12.–3. 1.):** revize 09, 10; 1 nový problémový průvodce N1/N2, pokud unikátní; propojit pracovní list a odpovídající poradce.
- **Týdny 9–10 (4.–17. 1.):** revize 11, 12, 13 (zdravotní a správní fakta na aktuální rok a audit účinnosti změn); N4 jen s ověřitelnými půjčovnami a prokazatelně samostatným intenem.
- **Týdny 11–12 (18. 1.–7. 2.):** revize 14; N5 nebo N6 po fact-check; hodnotit skutečné 28/90denní GSC dotazy a bezpečný přechod k poradci. Rozhodnout co škálovat.
**Kapacita:** zhruba 2 kvalitní redakční zásahy týdně, celkem 14 revizí + **max 4–6 nových URL** po ověření. Číslo je provozní strop, nikoli publikační KPI. Pokud GSC ukáže jiné silnější URL, roadmapu přeřadit.

## 8. Minimální specifikace každé landing page
1. Jedna jasná situace a jedna hlavní otázka; přímá odpověď v prvních 120 slovech.
2. „Co řešit dnes / doma / s odborníkem“, 3–7 konkrétních kroků, podmínky a varovné situace, žádné diagnostické závěry.
3. Vlastní přidaná hodnota: kontrolní tabulka, schéma rozměrů, rozpočet *s datovanými ověřenými vstupy*, tisknutelný list nebo 2–4 srozumitelné volby.
4. Jedna hlavní cesta do **existujícího** odpovídajícího poradce nebo služeb; nepřeskakovat bezpečnostní fit-gate. Uživatel může vyřešit situaci i bez nákupu.
5. Ověřený autor/redakce, relevantní zdroje (MPSV, NZIP, SÚKL, ČSSZ, výrobce), přesné datum kontroly proměnlivých údajů, prohlášení o metodice. Nepředstírat odbornou revizi, která neproběhla.
6. Meta/title podle reálné potřeby, jediný H1, jedinečný intent, self-canonical, 2–4 smysluplné obsahové interní odkazy a odpovídající zpětná cesta z hubu.
7. Přístupnost a mobil; doporučení nikdy neurčuje provize, produkty jen po správném ověření.
8. Bez osobních údajů a kombinací zdravotních odpovědí v URL, GA4 a affiliate parametrech; anonymní funnel jen se správným consent gate.
9. Před zveřejněním **duplication check** proti 53 moderním URL a relevantním archivním postům; pokud už pokryto, upravit původní URL.
10. CI + PR + deploy + produkční smoke podle běžného režimu, žádné „publikováno“ jen z merge.

## 9. Měření (bez falešných KPI)
- GSC pro tematické URL: **nebrandové kliky a zobrazení**, top page+query, 28/90 dní, CTR/pozice vždy s impresním kontextem; u malých vzorků netvrdit statistickou výhru.
- Funnel: klik na návazný poradce (`guide_advisor_click` ≠ skutečné zahájení či dokončení); zvlášť `builder_start`, `builder_complete`, `next_step_click` a ověřený merchant click; respektovat souhlas.
- Business: schválené affiliate provize, objednávky pokud doloženy, porovnatelné období; affiliate slot ≠ prodej.
- Governance: každá práce má URL, intent, verzi zdrojů, baseline před, datum nasazení, produkční smoke, 14/30/60denní revizi a rozhodnutí continue/adjust/rollback.
- **Při chybějícím GSC keyword-level datasetu** nenechat AI generovat přesná čísla pro „měsíční hledanost“. Nejdřív rozšířit read-only Prometheus report pro `zaprazi.cz` o společnou dimenzi `page+query` a validovat kategorie; externí planner jen s dostupným doložitelným exportem.

## 10. Implementační hranice
Tento soubor je **plán, ne souhlas k vydání nových stránek bez review**. Neřeší nedoložené znalosti medicíny, ceny ani nároky; nemění WP, doporučovací engine, affiliate routing, indexaci ani archiv. P0 safety blokace přebíjí publikaci. Zápraží growth runner má používat tento backlog jako zdroj kandidátů, nikoli jako nekonečný front-load generického obsahu. Nové priority vždy přehodnotit podle posledního GSC a skutečného stavu `main`.
