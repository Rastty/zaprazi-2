# Zápraží — doložená SEO a akviziční kontrola 15. 11. 2026

## Zdroje a hranice měření

- **Primární důkaz:** [Prometheus Zápraží GSC readonly, běh 43601642375](https://github.com/Rastty/prometheus-growth-os/actions/runs/43601642375), dokončeno 14. 11. 2026; artefakty `prometheus-zaprazi-gsc-28d-sanitized`, `prometheus-zaprazi-gsc-review-priorities` a `prometheus-zaprazi-growth-graph-gsc-plan`.
- Property `https://zaprazi.cz/`, oprávnění `siteOwner`, Google Search Analytics `web`, finalizovaných **28 dní 15. 10.–11. 11. 2026**: **7 organických kliků, 918 zobrazení, CTR 0,76 %, průměrná pozice 20,12**. To je součet celé property, nikoli pouze vypsaných URL nebo odhad měsíční hledanosti.
- Předchozí stav Growth Graphu k 10. 11. byl 8 kliků / 928 zobrazení v posunutém 28denním intervalu. Rozdíl **není prokázaný růst ani propad způsobený nasazením**.
- GSC page export obsahuje pouze **18 řádků pro 53 schválených hlavních URL**. Chybějící řádek má význam UNKNOWN, nikoli 0 či neindexováno. Šest page-filtered query pokusů nenašlo bezpečně publikovatelné intent skupiny (prahy 10 impresí + 3 různé dotazové řádky), nikoliv důkaz nulové poptávky.

## Konkrétní existující stránky podle reálných impresí

| URL | Kliky | Imprese | Průměrná pozice | Další rozhodnutí |
|---|---:|---:|---:|---|
| `/choditko-na-pojistovnu/` | 1 | 56 | 10,32 | Zachovat nedávné doložené změny; další text pouze po identifikaci dotazového záměru. |
| `/prevoz-seniora-k-lekari/` | 1 | 43 | 10,14 | Revidovat SERP intent a první odpověď před dalším zásahem; neodvozovat CTR z malého vzorku. |
| `/senior-nemuze-vstat-z-postele/` | 0 | 23 | 5,48 | Zkontrolovat snippet vs. dotaz; 23 impresí není důkaz špatného titulku. |
| `/otazky-pred-propustenim-z-nemocnice/` | 0 | 13 | 6,69 | Pouze sledovat nebo jednorázově prověřit intent. |

## Pokrytí Google indexem a živá technická kontrola

GSC URL Inspection ve **verzi, kterou Google naposledy eviduje**, vrátila u 15 pevně sledovaných URL 12 `indexed`, 3 `excluded`, 0 chyb a 0 UNKNOWN. Tři kontrolní kandidáti:

1. `/choditka-pro-seniory/`: `discovered_not_indexed`, bez doloženého prvního crawlu.
2. `/choditko-do-bytu-pro-seniory/`: `other`, důvod vyžaduje podrobnější kontrolu GSC; `sitemapReported=false` je starší informace z Google, ne stav živé sitemapy.
3. `/sprchovaci-zidle-pro-seniory/`: `discovered_not_indexed`, bez doloženého prvního crawlu.

**Živé read-only ověření 15. 11. 2026:** všechny tři URL jsou ve `https://zaprazi.cz/page-sitemap.xml`; stránky chodítek a sprchovací židle vrátily HTTP 200 a vlastní kanonickou URL. Stránka chodítka do bytu při jednom požadavku vrátila HTTP 503, při opakovaném čtení za několik sekund HTTP 200; jde o jediný zachycený přechodný případ, **nikoli prokázanou trvalou nedostupnost**. Projekt již má [cílenou read-only technickou bránu](../scripts/audit-index-watch-live.mjs) přes všechny čtyři relevantní URL, která 15. 11. prošla na 0.8.221.

Není zde podklad k hromadnému přepisu, `noindex`, mazání, redirectům, manipulaci s canonical ani automatickému odesílání žádostí o indexaci. Sledujeme, zda Google provede první crawl a zda se případné HTTP 5xx opakují.

## Affiliate dostupnost není prokázaná provize

- Živé `affiliate-readiness` na 0.8.221 má `integrity=ok`, **25/25 nakonfigurovaných slotů**.
- `node scripts/audit-live-affiliate-runtime-25.mjs` 15. 11. prošel: 21 CJ + 4 eHub viditelných konfigurací, bez odeslání osobních nebo zdravotních údajů.
- `node scripts/audit-canonical-merchant-targets.mjs` 15. 11. prověřil 25 veřejných kanonických cílů: **25 HTTP 200**, žádná 404, ale u všech identita přesné varianty zůstává bez nového ručního potvrzení. Tyto testy **neklikají na affiliate odkazy a nedokazují sledování prokliků, dostupnost, cenu, objednávku ani schválené provize**.
- GA4 starty/dokončení poradců, merchant kliky a síťově schválené provize zůstávají UNKNOWN. Nepřepisovat je na nulu ani je nevyrábět ze GSC.

## Nejbližší efektivní pokračování

1. **P0 Mobility:** cíleně ověřit přesnou identitu a provizní deeplink BESCO WA17 / WA21 / MEYRA Ideal v CJ/eHub, včetně transakčních reportů, bez změny pořadí vhodnosti produktů.
2. **P1 SEO:** po získání bezpečného page-filtered intent důkazu provést nanejvýš jednu revizi existující URL; před úpravou si uložit výchozí 28denní GSC interval a porovnávat až dokončená období.
3. **P1 index watch:** sledovat tři Google `excluded` URL a případné opakované 5xx. Živá HTTP dostupnost ani sitemap sama indexaci nezaručuje.

**Dopad tohoto zápisu:** aktualizace důkazů a řídicího grafu; **žádná změna WordPressu, nový článek, produktové doporučení nebo produkční deploy**.
