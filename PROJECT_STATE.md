# Zápraží 2.0 — PROJECT_STATE

**Stav: 21. 11. 2026.** Pravda: GitHub `main`/`dev`, skutečný WordPress, [vize](docs/ZAPRAZI_SOURCE_OF_TRUTH.md) a [Growth Graph](config/growth-state.json). Historie vydání patří do PR/Actions.

## CÍL
**Bezpečně a samostatně doma:** problém → Domácí poradce → bezpečný kandidátní typ → koupit / půjčit / ověřit úhradu → ověřená konkrétní nabídka. P0 Mobility. První obchodní milník = přiřaditelná **schválená affiliate objednávka**; stále NEOVĚŘENA. Bez diagnóz, zdravotních odpovědí v analytice a řazení podle provize.

## HOTOVO
- Poslední přijaté produkční vydání **0.8.245** (WordPress nasazen, skutečný readback a kompletní postdeploy). [Chrome QA 9/9 PASS](https://github.com/Rastty/zaprazi-2/actions/runs/44896362946), [SEO/sitemap PASS](https://github.com/Rastty/zaprazi-2/actions/runs/44896362924). **14 poradců** a **25/25 affiliate pozic** (21 CJ + 4 eHub); konfigurace **není důkaz nákupu ani provize**.
- [Release #895](https://github.com/Rastty/zaprazi-2/pull/895) na `/vstavani-z-kresla-pro-seniora/` přidal bezpečný přechod do existujícího Mobility poradce; jeho skutečné zobrazení, bezpečnostní text a přechod úspěšně prověřily [postdeploy QA #44896362946](https://github.com/Rastty/zaprazi-2/actions/runs/44896362946). [#898](https://github.com/Rastty/zaprazi-2/pull/898) chrání automatické ověřování tohoto přechodu.
- [#897](https://github.com/Rastty/zaprazi-2/pull/897) rozlišuje relevantní organické vstupy od historického archivu. Hotové jsou kontextové handoffy z `/senior-odmita-choditko/`, `/prahy-pro-choditko-a-vozik/` a existující Core GSC intent sběr 7/7 URL ([#888](https://github.com/Rastty/zaprazi-2/pull/888)); neopakovat.

## OVĚŘENO
- **WordPress 0.8.245:** read-only GET `/wp-json/zaprazi/v1/affiliate-readiness` skutečně vrátil `release=0.8.245`, `integrity=ok`, 25/25 nakonfigurovaných slotů a žádné chybějící skupiny. Na stejném zdrojovém SHA `b3bcd3af` dokončeny [Chrome 9/9](https://github.com/Rastty/zaprazi-2/actions/runs/44896362946) včetně všech 14 Advisorů, privacy/consent a přesného chair→Mobility handoffu; [sitemap/SEO](https://github.com/Rastty/zaprazi-2/actions/runs/44896362924), [CI](https://github.com/Rastty/zaprazi-2/actions/runs/44896362997) a [preflight](https://github.com/Rastty/zaprazi-2/actions/runs/44896374666) PASS. **Git merge / synchronizace `dev` není WordPress deploy.** Tento úspěšný live důkaz jej ale již samostatně potvrzuje; žádný další Pull+Deploy 0.8.245 není potřeba.
- [GSC 22. 10.–18. 11.](https://github.com/Rastty/prometheus-growth-os/actions/runs/44879889507): **16 kliků / 1 422 zobrazení za 28 dní**; `/schody-pro-seniora-doma/` 44/0 (malý vzorek). Intent 7/7 URL, nula veřejně publikovatelných query skupin. Inspection 12/15 indexed, 3 excluded; homepage crawled-not-indexed, žádost o indexaci již podána.
- [GA4 24. 10.–20. 11.](https://github.com/Rastty/zaprazi-2/issues/401#issuecomment-7059084220): **19 organických relací = 6 relevantních decision / 11 historický archiv / 2 neurčeno**, relevantní podíl 31,58 %. V omezeném GA4 vzorku bez doložené organické poradenské či merchant události. GA4 session ≠ GSC click ≠ affiliate objednávka; archivní slug ≠ nezávislé živé HTTP 404.

## BLOKACE
- **Mobility nabídky:** MEYRA Ideal 3061982 (výrobce šířka 61,5 cm vs prodejce 59 cm, přesná dodaná varianta UNKNOWN) a BESCO WA78 (nosnost 110 vs 136 kg, vyprodáno a odlišný brand PDF) HOLD. UNIZDRAV **P3774 RETIRED**; P2879 a odlišný MEGO 2 P5559 pouze prodejní kandidáti bez ověřeného přesného výrobního manuálu, fyzické skladovosti a publisher deeplinku. U existující Lékárna.cz další **dva kandidáti HOLD**: MEYRA Rollator 2 3061982-R (retail 468904, rozpor madel/hloubky) a VITEA Mobilus Lite **typ VCBK** podle návodu výrobce 05/2023 (retail 468905, rozpor šířky/výšky; dodaná revize neznámá). [P0 #857](https://github.com/Rastty/zaprazi-2/issues/857), `data/mobility-rollator-supply-review-20261121.json`; nepřidávat neověřené CTA.
- **Provize:** vlastník dosud hlásí žádné; publisher-side CJ approved/pending/rejected **UNKNOWN**. Windsor CJ advertiser query je bez oprávnění; Prometheus Core již má autorizací chráněný read-only publisher capture. Nevyvozovat provizi z 25 slotů či z jediného pozorovaného merchant kliku, nevytvářet falešné testovací nákupy.
- **SEO:** malé anonymizované GSC intent skupiny; žádný důkaz pro hromadné 301, noindex či mazání ~4 359 starých URL. [#401](https://github.com/Rastty/zaprazi-2/issues/401), [#461](https://github.com/Rastty/zaprazi-2/issues/461).

## DALŠÍ PRIORITA (effort × effect)
1. **P0 obchod:** doložit skutečný publisher CJ deeplink, attributed approved/pending/rejected transakce a přesnou identitu variant u stávajících Mobility partnerů; až pak nový bezpečný produktový rollout.
2. **P0 organická akvizice:** zvýšit kvalifikované vstupy na hotové Mobility decision URL a měřit srovnatelné GSC/GA4 kohorty. Opravit jen prokázaný intent/technický problém; nepublikovat generický duplicity.
3. **P1 distribuční dosah:** bezpečné a transparentní relevantní komunitní odpovědi jen podle platných pravidel a osobního publikování; žádné automatické spam odkazy.

**Předání:** první ověř GitHub, živou produkci a vydání; evidence-only commit není další WordPress deploy. Neopakovat QA už přijaté 0.8.245 bez nového důvodu.
