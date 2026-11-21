# Zápraží 2.0 — PROJECT_STATE

**Stav: 21. 11. 2026.** Pravda: GitHub `main`/`dev`, živý WordPress, [vize](docs/ZAPRAZI_SOURCE_OF_TRUTH.md), [Growth Graph](config/growth-state.json). Podrobná historie patří do PR/Actions.

## CÍL
**Bezpečně a samostatně doma:** problém → Domácí poradce → bezpečný kandidátní typ → koupit/půjčit/ověřit úhradu → ověřená konkrétní nabídka. P0 Mobility. Obchodní milník je první přiřaditelná **schválená affiliate objednávka**; zatím nepotvrzena. Bez diagnóz, zdravotních odpovědí v analytice a řazení podle provize.

## HOTOVO
- Poslední přijaté produkční vydání **0.8.244**; [postdeploy 9/9 PASS](https://github.com/Rastty/zaprazi-2/actions/runs/44886259216), [GSC/GA4 evidence #893](https://github.com/Rastty/zaprazi-2/pull/893). **14 poradců** a **25/25 affiliate pozic** (21 CJ + 4 eHub); konfigurace **není důkaz nákupu ani provize**.
- Release **0.8.245** [#895](https://github.com/Rastty/zaprazi-2/pull/895) přidal bezpečný přechod z `/vstavani-z-kresla-pro-seniora/` do Mobility poradce. **Zdroj MERGED, WordPress ještě nepotvrzen.**
- [#897](https://github.com/Rastty/zaprazi-2/pull/897) odděluje relevantní organické vstupy od historického archivu; [#898](https://github.com/Rastty/zaprazi-2/pull/898) doplnil automatické exact-0.8.245 QA. Žádný z těchto evidence-only kroků nenasadil WordPress.
- Dokončeny contextual handoff na `/senior-odmita-choditko/`, `/prahy-pro-choditko-a-vozik/` a existující Core GSC intent capture 7/7 URL ([#888](https://github.com/Rastty/zaprazi-2/pull/888)); neopakovat.

## OVĚŘENO
- Produkce **0.8.244**: integrity `ok`, 25/25 slotů, 14 poradenských cest, postdeploy QA [9/9 PASS](https://github.com/Rastty/zaprazi-2/actions/runs/44886259216), [SEO](https://github.com/Rastty/zaprazi-2/actions/runs/44886259223) PASS. [Live release monitor](https://github.com/Rastty/zaprazi-2/actions/runs/44892109335) správně hlásí `expected=0.8.245`, `live=0.8.244`, `pending_wp_pull_and_deploy`.
- [Finalizované GSC 22. 10.–18. 11.](https://github.com/Rastty/prometheus-growth-os/actions/runs/44879889507): **16 kliků / 1 422 impresí / 28 dní**. `/schody-pro-seniora-doma/`: 44 impresí/0 kliků (vzorek). GSC intent 7/7 stránek, 0 bezpečně publikovatelných query skupin; URL Inspection 12/15 indexed, 3 excluded. Homepage crawled-not-indexed; žádost už podána.
- [GA4 24. 10.–20. 11.](https://github.com/Rastty/zaprazi-2/issues/401#issuecomment-7059084220): **19 Organic Search sessions = 6 současných decision vstupů + 11 historický archiv + 2 neurčeno**; decision share **31,58 %**, ne obchodní konverze. V consent-limited přehledu 0 pozorovaných Organic Search poradenských/merchant eventů. GA4 relace ≠ GSC kliky, archivní manifest ≠ důkaz živého HTTP 404.

## BLOKACE
- **WordPress 0.8.245:** potřebný správce → Deployer for Git → `dev` Pull + Deploy; poté exact release, Chrome 14/14 a sitemap smoke. **Git merge / synchronizace `dev` není WordPress deploy.**
- **Mobility rollátor:** MEYRA 3061982 (výrobce 61,5 cm vs retail 59 cm, varianta UNKNOWN), BESCO WA78 (110 vs 136 kg, vyprodáno, PDF jiné značky) **HOLD**. Nově ověřená stránka UNIZDRAV **P3774 přímo uvádí „vyřazeno z nabídky“ – RETIRED**, nikoli skladem. Odlišný model **MEGO 2 P5559** je samostatný kandidát spolu s **P2879**; oba mají jen seller-listed dostupnost, ne potvrzený originální návod, sklad či publisher deeplink. [#857](https://github.com/Rastty/zaprazi-2/issues/857). Evidence `data/mobility-rollator-supply-review-20261121.json`, týdně read-only kontrola tří přesných SKU ve stávajícím merchant QA. Bez aktivace produktů.
- **Příjem:** owner hlásí žádné provize, ale publisher-side CJ approved/pending/rejected je **UNKNOWN** (Windsor support #52449496); nevykazovat nulu ani hypotetické EPC. Nevytvářet falešný affiliate klik.
- **SEO:** query-intent cohorty jsou malé, žádná důkazní opora pro hromadné 301/noindex/mazání ~4 359 archivu. [#401](https://github.com/Rastty/zaprazi-2/issues/401), [#461](https://github.com/Rastty/zaprazi-2/issues/461).

## DALŠÍ PRIORITA (effort × effect)
1. **P0 produkce:** dokončit owner deploy 0.8.245 a nechat automatický monitor ověřit skutečný chair→Mobility handoff, 14 poradců a 25/25 slotů. Nové runtime změny do té doby nemergovat.
2. **P0 monetizace:** přesný výrobní návod/štítek pro UNIZDRAV **P2879 a P5559**, aktuální stav a autorizovaný CJ/VIV deeplink. **P3774 RETIRED**, nikdy automaticky nezaměňovat s P5559. Teprve potom samostatný bezpečný release; WA78/MEYRA zůstanou HOLD.
3. **P0 kvalifikovaná akvizice:** sledovat rozhodovací vstupy (zatím 6/19), podložené GSC URL a bezpečnou cestu do poradce; nepřidávat duplicitní články ani další GSC integraci.

**Předání:** číst aktuální branch/PR/produkci a konkrétní důkazy. Zdrojový PR, commit, predeploy QA ani dokumentace nejsou produkční nasazení.
