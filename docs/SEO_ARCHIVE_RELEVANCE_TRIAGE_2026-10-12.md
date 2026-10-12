# Zápraží 2.0 — první ověřená inventura relevance starého obsahu
**Datum:** 12. 10. 2026 · **Režim:** read-only audit, bez změny indexace či historických URL

## Proč audit vznikl
Nový web je poradce pro bezpečnější a samostatnější život doma; historický WordPress archiv pochází z jiné obsahové éry. Lighthouse je pouze technický test stránky, nikoli důkaz relevantní návštěvnosti nebo topical authority. Zatím **neznáme GSC výkon jednotlivých starých URL**. Tento podklad **neschvaluje plošný noindex, smazání ani redirect**.

## Ověřeno přímo na živé produkci
- Živá verze při auditu: **0.8.127**, release integrity **OK**, affiliate konfigurace **25/25**; připravené 0.8.128 vyžaduje samostatný deploy.
- Mobile Lighthouse na homepage: performance **98/100**, accessibility **100/100**, best practices **100/100**, SEO **100/100**, laboratorní LCP cca **1,1 s** a CLS **0**. CrUX field data nebyla dostupná; měření nemůže potvrdit reálnou rychlost ani pozice v Googlu.
- Stejné laboratorní skóre vykazuje i `/navrat-z-nemocnice/`; před závěry o výkonu u více typů stránek nutno ověřit skutečné CrUX/Lighthouse výstupy.
- Živé homepage, `/navrat-z-nemocnice/`, `/pujceni-choditka/`, `/choditko-na-pojistovnu/` a `/nocni-cesta-z-postele-na-wc/` mají pozorovaný unikátní HTML `<title>`, meta description, self-canonical a bez `noindex`. To **neznamená**, že jsou už zaindexované.
- Stávající repo plán `docs/SEO_PARALLEL_EXECUTION_2026-10-09.md` uvádí inventuru asi **4 360 historických příspěvků**, avšak dnešní přesný počet publikovaných postů nebyl touto namátkovou kontrolou prokázán.

## Co odhalilo cílené WordPress REST vyhledávání
Read-only `/wp-json/wp/v2/posts?search=<term>&per_page=100` pro staré **příspěvky** (nikoli nové stránky). Jde o lexikální CMS výsledky včetně textu, **nikoli** Google Search Console, hledanost ani fulltextový SEO audit.

| Hledaný řetězec | Vrácené staré příspěvky | Kvalitativní signál |
|---|---:|---|
| `chodítk` | 0 | V tomto WP search nejsou pro dílčí tvar vrácené staré posts; nové specializované stránky existují samostatně |
| `rollátor` | 0 | Starý archiv patrně neobsahuje dosavadní cílené poradenské pokrytí tohoto klíčového záměru |
| `senior` | 5 | Například „Stoly bezpečné pro děti a seniory“, ale i obsah o ordinacích či obecných postelích |
| `bezbariérov` | 7 | Výrazně spíše ordinace, restaurační provozy a nábytek než bezpečné bydlení seniorů |
| `rehabilita` | 3 | Vráceny i články o vodárnách a kancelářském nábytku — shoda výrazu neznamená tematickou vhodnost |
| `koupelna` | 35 | Ve vrácených příkladech solární energie, ventilátory a technická témata, nikoli automaticky řešení bezpečného WC |

Příklad nepropojitelných historických URL: `/solarni-panely-v-nemocnicich-optimalizace-energetickeho-vykonu-a-snizeni-provoznich-nakladu/`, `/designovy-nabytek-jako-soucast-bezbarierovych-zdravotnickych-zarizeni/`. Samotná přítomnost slova „nemocnice“ či „bezbariérový“ **není** vhodný interní odkaz do poradce po propuštění pacienta. Nepropojovat obsah uměle.

## Bezpečné pořadí dalšího SEO výkonu
1. **Získat data GSC**: URL × query, posledních 28 i 90 dní, clicks, impressions, CTR, average position, index coverage. Dále seznam stránky→dotazu kolem poradenských témat a ověření sitemap/canonical. Pokud GSC není napojena, stav **unknown**, nikoli „nula kliknutí“.
2. **Prvních 50 historických URL třídit podle prokázané relevantní návštěvnosti** a životaschopnosti obsahu. Mapovat i externí odkazy a potenciální historické konverze, než se cokoliv odstraní.
3. Pro každé URL rozhodnout: `KEEP` (vlastní hledaný záměr a hodnotný obsah), `IMPROVE_AND_LINK` (skutečně související s bezpečným bydlením/pomůckami), `CONSOLIDATE` (jen prokazatelná duplicita a relevantní cílová URL), `HOLD` (neznámá data či samostatný jiný záměr).
4. **Neprovádět plošné noindex, 301 na homepage ani mazání archivu.** Při důkazu neaktuální/nebezpečné rady individuální obsah opravit nebo přiměřeně vyřadit s dokumentovaným důvodem a fallbackem.
5. **Přirozené vnitřní odkazy** budovat z opravdového rozhodovacího kontextu: užitečný článek → relevantní poradce → kontrola modelu → bezpečný další krok. Není důvod tlačit návštěvníky solárního obsahu do chodítek.
6. **Nové stránky** vytvářet až po kontrole duplicitní search intent vůči existujícím live landingům a archivu. Přednost: kvalita 14 rozhodovacích cest a unikátní kontextové informační články (příprava domácnosti, co změřit, propuštění z nemocnice).
7. Po každé malé úpravě monitorovat relevantní **dotazy → kliky → použití poradce → bezpečně provedený další krok**; affiliate slot ≠ affiliate proklik nebo příjem.

## Praktický první kandidát po GSC
Starý příspěvek `/jak-vybrat-postel/` (WP post id 113) může mít samostatný běžný nábytkový záměr. Pokud GSC a redakční revize potvrdí skutečný kontext bezpečného uléhání nebo péče, zvážit jeden užitečný textový odkaz na `/polohovaci-postel/`. **Zatím neměnit**, bez aktuálního obsahu a výkonu URL nelze odpovědně doporučit prolink.

## Akceptační podmínka před hromadnější změnou
Záznam: URL, GSC interval a datum exportu, stávající záměr, navržený cílový záměr, interní/external link impact, canonical a index status, důkaz editora, změna, před/po ověření. Bez toho ponechat historickou URL nedotčenou. `docs/ZAPRAZI_SOURCE_OF_TRUTH.md` a bezpečnostní priority poradců jsou nadřazené.
