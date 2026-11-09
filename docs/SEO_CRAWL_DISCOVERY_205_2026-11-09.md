# Zápraží 0.8.205 — crawl and sitemap truthful freshness

**Jediný SEO záměr:** pomoci Googlu i pečujícím najít kvalitní existující stránky, které již známe z index inspection, ale ještě nemají organické imprese. Nepřidáváme URL ani nestimulujeme umělé datum všech stránek.

## Evidence před vydáním
- [GSC index inspection z 9. 11. 2026](https://github.com/Rastty/prometheus-growth-os/actions/runs/42590120773): 11/15 strategických URL indexováno. `/co-zmerit-pred-vyberem-choditka/` a `/sprchovaci-zidle-pro-seniory/` označeny `discovered_not_indexed`; `/choditka-pro-seniory/` a `/choditko-do-bytu-pro-seniory/` jsou mimo index s důvodem `other`, nikoliv doloženým noindex/robots.
- [Produkční Chrome SEO 0.8.204](https://github.com/Rastty/zaprazi-2/actions/runs/42587307000): všechny 4 stránky HTTP 200, unikátní H1 a self-canonical; existují interní odkazy. Nezakládat novou stránku, nepřesměrovávat ani mazat.
- [GSC final 28d](https://github.com/Rastty/prometheus-growth-os/actions/runs/42587662860): 9 kliků / 941 zobrazení, 10. 10.–6. 11. Žádné postdeploy organic výsledky 0.8.204 zatím neexistují.

## Realizace
1. Homepage: na dvou existujících tematických kartách přímé obyčejné `<a>` odkazy na sedm kontrol před výběrem chodítka a poradce pro sprchovací židli. Oba odkazy jsou užitečné před nákupem a nepřeskakují fit-gate.
2. Dvě již indexované tematické stránky: v úvodní části koupelny přímý odkaz na sprchovací židli; v rozcestníku kompenzačních pomůcek měření pro chodítko. Žádný sitewide link farm, žádné externí obchodní odkazy.
3. Yoast sitemap: WordPress `post_modified` často nevidí změnu obsahu generovaného GitHub šablonou. V rámci existujícího HTTPS filter callbacku pouze čtyři skutečně materiálně změněné `page` slugs mají minimální `lastmod=2026-11-09T00:00:00+00:00`: půjčení (0.8.204), pojišťovna (0.8.204 metadata), koupelna a rozcestník (0.8.205 nové odkazy). Novější WP změnu necháme nedotčenou. Na ostatních zhruba 50 moderních stránkách včetně těchto dvou zatím pouze objevených URL metadata **nezměníme bez významné vlastní změny**.
4. Tests: živá PHP funkce v izolaci, Yoast accepted_args 3, max(actual modified date, material date), publisher guard, same-domain guard, neměnné canonical a nepřenášení zdravotních údajů. Kompletní release marker a kritické blob SHA, safety QA.

## Vyhodnocení
- Po merge a **skutečném WordPress Pull/Deploy** bude release 0.8.205; GitHub merge sám není nasazení.
- Před uznáním účinku: live Chrome QA hlavních stránek + public XML sitemap podle skutečného Yoast outputu. Nesmíme tvrdit, že lastmod se propsal, dokud to produkce neprokáže.
- GSC URL Inspection 15 konkrétních URL a Search Analytics 28d v Prometheovi porovnat až po crawl; datum indexu ≠ datum nasazení.
- Jde o **technicko-navigační zásah**, ne garanci indexace, pozic ani provizí. Schválené affiliate provize zůstávají UNKNOWN.
