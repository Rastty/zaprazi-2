# Zápraží 2.0 — PROJECT_STATE

**Stav k 21. 11. 2026.** Zdroj pravdy: [vize a bezpečnost](docs/ZAPRAZI_SOURCE_OF_TRUTH.md), [Growth Graph](config/growth-state.json), aktuální GitHub `main`/`dev` a veřejná produkce. Historie vydání patří do GitHub PR/Actions, ne sem.

## CÍL
Pomoci rodině od problému k bezpečnému konkrétnímu kroku: **situace → Domácí poradce → ověřit vhodný typ a podmínky → koupit / půjčit / prověřit úhradu**. P0 = **Mobility**. Obchodní milník = první **schválená affiliate objednávka** přiřaditelná k této cestě; dosud nepotvrzena. Bez diagnóz, zdravotních odpovědí v analytice a pořadí podle provizí.

## HOTOVO
- Poslední přijaté produkční vydání **0.8.244**; owner provedl WordPress `dev` Pull + Deploy po [#890](https://github.com/Rastty/zaprazi-2/pull/890). [#892](https://github.com/Rastty/zaprazi-2/pull/892) ověřil stejný zdrojový SHA `717ca358f55404e340f332a5310740c0e361f71e`. [#893](https://github.com/Rastty/zaprazi-2/pull/893) přijal důkazy do Growth Graphu bez nového WordPress vydání.
- **14 poradců**, existující bezpečné fit-gates a consent-only anonymní měření; nakonfigurováno **25/25 affiliate pozic** (21 CJ + 4 eHub). To není důkaz nákupu ani provize.
- P0 editorial handoff na `/senior-odmita-choditko/` a `/prahy-pro-choditko-a-vozik/` je v 0.8.244; **neopakovat**. Sedmistránkový GSC read-only intent sběr v Prometheus Core a kompatibilní parser [#888](https://github.com/Rastty/zaprazi-2/pull/888) jsou dokončeny.

## OVĚŘENO
- [Chrome postdeploy QA](https://github.com/Rastty/zaprazi-2/actions/runs/44886259216): **9/9 PASS** včetně 14 poradců, consent, privacy a product-fit; [SEO/sitemap](https://github.com/Rastty/zaprazi-2/actions/runs/44886259223), [CI](https://github.com/Rastty/zaprazi-2/actions/runs/44886259354), [preflight](https://github.com/Rastty/zaprazi-2/actions/runs/44886262923) **PASS**. Read-only live coherence: **release=0.8.244; integrity=ok; affiliate 25/25**. Technická akceptace ≠ růst ani schválený příjem.
- [Finální GSC, 22. 10.–18. 11.](https://github.com/Rastty/prometheus-growth-os/actions/runs/44879889507): **16 kliků / 1 422 impresí** za 28 dní; `/schody-pro-seniora-doma/` **44 impresí / 0 kliků, průměrná pozice 5,05** (malý vzorek). Přesný query-intent sběr **7/7 URL, 0 skupin nad bezpečným publikačním prahem**; není dovolené domýšlet hledané dotazy. URL Inspection vzorek **12/15 indexed, 3 excluded**; homepage `crawled_not_indexed`; žádost o indexaci již byla podána.
- [GA4, 24. 10.–20. 11.](https://github.com/Rastty/zaprazi-2/issues/401#issuecomment-7059084220): **19 Organic Search sessions**, z toho **11 historický archiv / 6 současné relevantní stránky / 2 (not set)**. **0 pozorovaných organických poradenských/merchant událostí** v consent-limited přehledu; neznamená to nulu všech uživatelů ani srovnatelný SEO růst. **Growth Graph nyní eviduje 4 samostatné GA4 kohorty (19/6/11/2, rozhodovací vstupy 31,58 % pozorovaných organických relací), se shodným 28denním oknem, datem a zdrojem.** Neoznačovat zbývající návštěvy z archivního manifestu automaticky jako živé 404; neporovnávat GA4 relace s GSC kliky jako stejné osoby.
- K zahájení tohoto běhu `main=dev=8991a987b2dcaed46ca04da2161e308e1171a672`, **0 otevřených PR**. Tento údaj je snapshot, znovu číst před zápisem/merge.

## BLOKACE
- Není dost anonymizovaných GSC query-intent řádků pro bezpečnou změnu titulku/obsahu; nepublikovat generické články, neopakovat žádost o indexaci a nehromadně přesměrovávat ~4 359 starých URL. [SEO #401](https://github.com/Rastty/zaprazi-2/issues/401), [legacy #461](https://github.com/Rastty/zaprazi-2/issues/461).
- **MEYRA Ideal 3061982**: výrobce uvádí **61,5 cm**, retail Lékárna.cz **59 cm** a přesná dodaná varianta není doložená. Ponechat **fail-closed model-fit gate**; nepotvrzovat prodejní vhodnost. [Affiliate #857](https://github.com/Rastty/zaprazi-2/issues/857).
- Majitel hlásí dosud **žádné provize**, ale nezávislý CJ publisher report je **UNKNOWN** (Windsor support **#52449496**); nezapisovat měřenou nulu či hypotetický EPC. Žádný nákup netestovat falešným affiliate klikem.
- Runtime změny lze sloučit až po latest-head CI, bezpečnostních a release kontrolách. **Git merge / synchronizace `dev` není WordPress deploy**: produkční Pull + Deploy provádí správce, potom exact-release Chrome/sitemap QA. [Postup](docs/DEPLOYMENT.md).

## DALŠÍ PRIORITA (effort × effect)
1. **P0 akvizice:** na existujících Mobility rozhodovacích URL sledovat finalizovaná GSC page/query + indexační fakta; opravit **jen prokazatelnou** technickou či intent chybu. Nedělat novou duplicitní GSC integraci, Core již sbírá 7/7 URL.
2. **P0 cesta a kvalita návštěv:** posuzovat zvlášť relevantní organické přístupy (dnes 6/19), zachovat funkční kontextové přechody do poradce a vyhodnotit srovnatelné další okno. Nekládat nízký počet eventů za UX chybu.
3. **P1 monetizace:** doložit identitu a parametry přesné MEYRA varianty a publisher-side approved/rejected/pending provize; do té doby nepovolovat neověřené nabídky.

**ZDROJ 0.8.245 MERGED, WordPress NENASAZENO:** [release PR #895](https://github.com/Rastty/zaprazi-2/pull/895) přidal z GA4 doložené vstupní stránky `/vstavani-z-kresla-pro-seniora/` jediný bezpečný kontextový přechod do stávajícího Mobility poradce; bez změny produktů nebo fit-gates. Před merge na přesném head SHA `0a1c5167` prošly [CI](https://github.com/Rastty/zaprazi-2/actions/runs/44889030443), [legacy](https://github.com/Rastty/zaprazi-2/actions/runs/44889030498), [Mobility safety](https://github.com/Rastty/zaprazi-2/actions/runs/44889030485) a [Chrome predeploy](https://github.com/Rastty/zaprazi-2/actions/runs/44889030465). Merged source SHA `e6109d5aa999c18f662b6c52c8588a3d6e93122a`, `main=dev` ověřeno před tímto evidenčním PR. **Dále správce WordPressu provede z `dev` Pull + Deploy 0.8.245; potom nezávislé exact-release Chrome/sitemap QA a live readback nového handoffu.** Do té doby poslední přijatá produkce **0.8.244**. Tento evidenční PR sám WordPress release nespouští.

**Předávací zásada:** každý další běh nejprve čte živou produkci, nejnovější `main`/`dev`, PR a Growth Graph; dokumentuje jen nové prokázané změny. Evidence-only commit **nevyžaduje WordPress deploy**.
