# Zápraží — Google indexační audit 15 URL (9. 11. 2026)

## Co je nově doloženo
Nový [Prometheus URL Inspection běh](https://github.com/Rastty/prometheus-growth-os/actions/runs/42590120773) získal přes stávající **read-only GSC OAuth** stav **verze evidované v indexu Google**, nikoli test čerstvě načtené WordPress stránky. Kontrolované URL jsou přesně 15 veřejných strategických vstupních stránek (nikoliv celý web):

- **11/15**: `PASS` – Google je eviduje jako indexované; na starších crawl verzích byly kanonické adresy shodné a procházení povolené.
- **4/15**: `NEUTRAL` – nejsou nyní indexované. Ani u jedné není doložené `noindex`, blokace robots či chybný HTTP stav. Absence hodnot u neindexovaných URL není doklad, že jsou na serveru chybné.
- **2/4** mají přesnou GSC třídu `discovered_not_indexed`: `/co-zmerit-pred-vyberem-choditka/` a `/sprchovaci-zidle-pro-seniory/`. Google URL zná, ale ve zprávě nemá datum posledního úspěšného crawl.
- **2/4** mají `coverage=other`: `/choditka-pro-seniory/` a `/choditko-do-bytu-pro-seniory/`. **Konkrétní důvod je UNKNOWN.** Nelze samovolně přeznačit jako discovered/crawled/duplicate ani tvrdit, že URL byly deindexované.
- Provozní Google crawler u indexovaných sledovaných stránek naposledy udává převážně **7.–9. 10. 2026** (homepage 4. 11.). To není důkaz, že by už Google zpracoval release 0.8.204 z 9. 11.
- **Přítomnost ve známých sitemaps podle GSC není spolehlivým úplným seznamem.** Indikátor `sitemapReported=false` u některých indexovaných URL dokazuje, že jej nesmíme interpretovat jako „stránka není v sitemapě“.

### Vymezené URL k nápravě
| URL | GSC status | GSC reason | Co ověřil živý Chrome 9. 11. | Priorita |
|---|---|---|---|---|
| `/choditka-pro-seniory/` | excluded | UNKNOWN | HTTP 200; jediný H1; canonical OK; cca 13 interních vstupů z auditovaného souboru | P0 (hlavní mobility hub) |
| `/choditko-do-bytu-pro-seniory/` | excluded | UNKNOWN | HTTP 200; H1; canonical OK; bez mobilního přetečení | P1 |
| `/co-zmerit-pred-vyberem-choditka/` | excluded | discovered_not_indexed | HTTP 200; H1; canonical OK; cca 8 interních vstupů | P0 (praktický rozhodovací obsah) |
| `/sprchovaci-zidle-pro-seniory/` | excluded | discovered_not_indexed | HTTP 200; H1; canonical OK; cca 8 interních vstupů | P1 |

Produkční [Chrome SEO auditor 0.8.204](https://github.com/Rastty/zaprazi-2/actions/runs/42587307000) ověřil **53 živých stránek, bez chyb a warningů**, pro cílové URL HTTP 200 + self-canonical; kontrola interních odkazů zaznamenala existující hrany. Public [XML sitemap audit 8. 11.](https://github.com/Rastty/zaprazi-2/actions/runs/42478196295) byl zelený na předchozí publikované verzi, tedy není sám o sobě současný Google crawl.

## Rozhodnutí effort × effect
1. **P0 – ověřovat, ne ničit.** Denní GSC index-inspection je již implementovaná v [Prometheus PR #1553](https://github.com/Rastty/prometheus-growth-os/pull/1553) a bezpečná anglická klasifikace stavů v [#1554](https://github.com/Rastty/prometheus-growth-os/pull/1554). Tím je problém měřitelný bez ownerova ručního klikání.
2. **P0 – dvě objevené, ale neprocházené URL:** prověřit skutečný datum zveřejnění, v public sitemap jen čisté HTTPS self-canonical, existující sousední obsah vs. potenciální duplicitu; následně hodnotit vhodné vyšší umístění odkazu na reálně indexované vstupní stránce. Nepropagovat prázdný výčet či spam; stránky mají reálné kontrolní seznamy a bezpečnostní hodnotu.
3. **P1 – dvě URL s neznámým důvodem:** nejprve doplnit klasifikaci GSC (nebo přesný GSC UI stav) a ověřit postdeploy veřejný robots/canonical/index. Nedělat automatický noindex/redirect/smazání ani automatické žádosti o indexaci.
4. **SEO růst teď paralelně:** využít již indexované vstupní URL `/choditko-na-pojistovnu/`, `/pujceni-choditka/`, `/rollator-pro-seniory/`, které mají první skutečné GSC impresní důkazy. Čekat na postdeploy data pro 0.8.204 před dalším přepisem těchto URL. Redakčně držet [90denní plán](SEO_CONTENT_PLAN_90D_2026-11-09.md).
5. **Ověření 14/28 dní po vydání:** audit GSC index status zvlášť od impressions/clicks a affiliate; schválené provize jsou stále UNKNOWN. Další masový obsah by nyní nemusel získat ani procházení.

**Nepředstírat, že stav `NEUTRAL` od Googlu potvrzuje technickou chybu WordPressu.** Google URL Inspection API je snapshot; absence GSC page-click řádku není prokázaná deindexace. Toto PR mění pouze důkaz a Growth Graph, ne web a jeho verzi.
