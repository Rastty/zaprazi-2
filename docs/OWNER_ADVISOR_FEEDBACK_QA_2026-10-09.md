# Zápraží 2.0 — první praktické proklikání všech poradců (9. 10. 2026)

## Cíl

Najít chyby, které nemohou spolehlivě odhalit samotné automatické testy: nelogickou formulaci, chybný výrobek pro konkrétní obecný scénář, nejasný další krok či zbytečné otázky. Nejde o zdravotní diagnostiku ani o klinické testování.

**Aktuální balík pro ruční QA:** 0.8.72. Nejprve musí být skutečně nasazený a na stránce ověřený release. CI a předdeployová produkční QA ověřovaly do té doby starší nasazenou 0.8.71. Produkční 0.8.72 prohlásit za ověřenou **až po novém browser smoke**.

## Jak zadat feedback během dvou minut

Stačí poslat do projektu/chatového vlákna stručný popis:

- **Poradce / URL:** kde jste byli;
- **Obecný případ:** například „nízké WC, nevím přesnou nosnost vybraného nástavce“ — ne osobní nebo zdravotní informace;
- **Skutečnost:** která otázka, výsledek nebo odkaz nedával smysl;
- **Očekávání:** co by pomohlo a jaký další krok by měl průvodce nabídnout.

Pro delší sledování použít [GitHub formulář feedbacku](https://github.com/Rastty/zaprazi-2/issues/new?template=advisor-feedback.yml), *je veřejný*. Snímky obrazovky před vložením očistit od osobních údajů, notifikací nebo osobního profilu.

## Doporučené pořadí ručního proklikání

| Pořadí | Stránka | Jeden kritický případ, který vyzkoušet |
|---|---|---|
| 1 | [Koupelna/WC](https://zaprazi.cz/koupelna-a-wc/) | Nízké WC vs. problém s bezpečným přesednutím; po „Nevím“ nesmí vzniknout falešně přesná nabídka |
| 2 | [Nástavec na WC](https://zaprazi.cz/nastavec-na-wc-pro-seniory/) | Nesplněný rozměr sedátka či nosnost zastaví nákup |
| 3 | [Madlo u WC](https://zaprazi.cz/madlo-k-wc-pro-seniory/) | Zeď bez ověřeného upevnění není totéž jako volně stojící opora |
| 4 | [Sprchovací židle](https://zaprazi.cz/sprchovaci-zidle-pro-seniory/) | Změna rozměru nebo stability zneplatní původní produkt |
| 5 | [Sedátko do vany](https://zaprazi.cz/sedatko-do-vany-pro-seniory/) | Jiná konstrukce má jiné limity; změna varianty zruší potvrzení nosnosti |
| 6 | [Toaletní židle](https://zaprazi.cz/toaletni-zidle-pro-seniory/) | Ověřit prostor a způsob bezpečného použití před CTA |
| 7 | [Polohovací postel](https://zaprazi.cz/polohovaci-postel/) | CLASSIC nemá duplicitní otázku; Hospital/Multibed vyžadují samostatně ověřený limit pacienta |
| 8 | [Invalidní vozík](https://zaprazi.cz/invalidni-vozik/) | P3641: pneumatická vs. bezdušová kola, limit 125/136 kg a reset staré volby |
| 9 | [Soběstačnost](https://zaprazi.cz/sobestacnost/) | UpCup/Beat It/Theomatik/Open-It: zobrazit kandidáta bez CTA, potvrdit praktické kontroly, změnit odpověď |
| 10 | [Hlavní mobilita](https://zaprazi.cz/) | Opora doma vs. venku, reálné rozměry a potřeba sedět při chůzi |
| 11 | [Chodítko do bytu](https://zaprazi.cz/choditko-do-bytu-pro-seniory/) | Šířka průchodu a stabilita před nabídkou |
| 12 | [Rollátor](https://zaprazi.cz/rollator-pro-seniory/) | Bezpečné brzdy, odpočinek vsedě a změna prostředí |
| 13 | [Obuv](https://zaprazi.cz/obuv-pro-seniory/) | Náhlé obtíže nejsou důvod k náhodnému nákupu obuvi |
| 14 | [Návrat z nemocnice](https://zaprazi.cz/navrat-z-nemocnice/) | Jasný první úkon i bez nákupu a cesta do relevantních specializovaných průvodců |

## Akceptační pravidlo

1. **P0:** nesprávný výrobek, nesprávný bezpečnostní limit, nákup bez potvrzené podmínky, obchodní link při neznámém kritickém údaji → opravit hned.
2. **P1:** nelogické přepínání, uživatel neví, co dělat dál, nepřiměřené množství otázek, nejasný výsledek → opravit před uzavřením QA.
3. **P2:** formulace, pořadí sekundárních informací, kosmetika → spojit do menšího UX balíku.

Pro každý fix: konkrétní reprodukovatelný scénář → změna v samostatné větvi → regresní test → GitHub PR → CI → release → Pull/Deploy uživatelem → produkční Chrome QA. Neslibovat stoprocentní bezpečnost ani dokončení UX bez praktického feedbacku.

## Paralelní SEO

V mezidobí může běžet konzervativní inventura a SEO příprava podle `docs/SEO_PARALLEL_EXECUTION_2026-10-09.md`. Nové články musí mít jedinečný vyhledávací záměr vůči starému archivu; nepřetvářet SEO úkoly na neprověřené zdravotnické rady. Logo/favikona až po kvalitativním uzavření kritických a významných připomínek.
