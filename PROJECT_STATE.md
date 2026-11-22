# Zápraží 2.0 — PROJECT_STATE

**Stav: 22. 11. 2026.** Pravda: GitHub `main`/`dev`, skutečný WordPress, [vize](docs/ZAPRAZI_SOURCE_OF_TRUTH.md) a [Growth Graph](config/growth-state.json). Historie vydání patří do PR/Actions.

## CÍL
**Bezpečně a samostatně doma:** problém → Domácí poradce → bezpečný kandidátní typ → koupit / půjčit / ověřit úhradu → ověřená konkrétní nabídka. P0 Mobility. První obchodní milník = přiřaditelná **schválená affiliate objednávka**; stále NEOVĚŘENA. Bez diagnóz, zdravotních odpovědí v analytice a řazení podle provize.

## HOTOVO
- **Release [#916](https://github.com/Rastty/zaprazi-2/pull/916) `0.8.246` — NASAZENO a QA PASS:** schodišťový návod nově z homepage a návratu z nemocnice. [Monitor #45002451021](https://github.com/Rastty/zaprazi-2/actions/runs/45002451021) ověřil obě přesné cesty, release, 25 slotů; [kompletní postdeploy QA #45002528029](https://github.com/Rastty/zaprazi-2/actions/runs/45002528029) PASS. Bez prokázaného SEO upliftu; [#918](https://github.com/Rastty/zaprazi-2/pull/918) chrání oba vstupy.
- **eHUB mimo CJ [#913](https://github.com/Rastty/zaprazi-2/pull/913):** [read-only audit 4 RehaVita URL](https://github.com/Rastty/zaprazi-2/actions/runs/44938273027) = 4× `product_card_boundary_not_found`. Neznamená vyprodáno; nabídky, `checkedAt` a WP beze změny.
- **CJ publisher identity [Core #2435](https://github.com/Rastty/prometheus-growth-os/pull/2435):** autorizovaný read-only [CJ audit #44937340398](https://github.com/Rastty/prometheus-growth-os/actions/runs/44937340398) vrátil `PROPERTY_NOT_CONFIRMED` pro `zaprazi.cz`. Z připojeného účtu není doložena ACTIVE webová vlastnost; historická platnost odkazů ani provize tím nejsou vyvráceny.
- **P0 SKU evidence [#910](https://github.com/Rastty/zaprazi-2/pull/910):** [GET 3/3](https://github.com/Rastty/zaprazi-2/actions/runs/44904016222): P2879/P5559 prodejce označuje dostupné, P3774 vyřazený. Fyzický sklad, manuály variant a deeplinky stále UNKNOWN; MEYRA rozpor trvá, 0 nových nabídek.
- **Předchozí evidence:** [#907](https://github.com/Rastty/zaprazi-2/pull/907) SKU, [#906](https://github.com/Rastty/zaprazi-2/pull/906) GA4 kohorty.
- Poslední přijaté produkční vydání **0.8.246**: [Chrome a produkční QA PASS](https://github.com/Rastty/zaprazi-2/actions/runs/45002528029), 14 poradců; **25/25 affiliate pozic** (21 CJ + 4 eHUB). Konfigurace **není důkaz nákupu ani provize**.
- **Dříve nasazeno:** chair→Mobility [#895](https://github.com/Rastty/zaprazi-2/pull/895), [QA PASS](https://github.com/Rastty/zaprazi-2/actions/runs/44896362946), ochrana [#898](https://github.com/Rastty/zaprazi-2/pull/898).
- [#897](https://github.com/Rastty/zaprazi-2/pull/897) rozlišuje relevantní organické vstupy od historického archivu. Hotové jsou kontextové handoffy z `/senior-odmita-choditko/`, `/prahy-pro-choditko-a-vozik/` a existující Core GSC intent sběr 7/7 URL ([#888](https://github.com/Rastty/zaprazi-2/pull/888)); neopakovat.

## OVĚŘENO
- **Produkce 0.8.246:** [read-only monitor](https://github.com/Rastty/zaprazi-2/actions/runs/45002451021) vrátil `live_release=0.8.246`, obě nové schodišťové cesty `verified`, 25/25 slotů, dva readbacky bez rozporu; [postdeploy Chrome + SEO QA](https://github.com/Rastty/zaprazi-2/actions/runs/45002528029) PASS, [CI + preflight](https://github.com/Rastty/zaprazi-2/actions/runs/45002455306) PASS. Growth Graph nyní dokládá správnou přijatou verzi.
- **GSC 28 dní:** [finální zdroj](https://github.com/Rastty/prometheus-growth-os/actions/runs/44879889507): 16 kliků / 1 422 zobrazení, schody 44/0; URL Inspection 12/15 indexed, homepage crawled-not-indexed (20. 11.), 7/7 intent URL bez bezpečně publikovatelných dotazů. Malý vzorek; žádný potvrzený růst.
- [GA4 24. 10.–20. 11.](https://github.com/Rastty/zaprazi-2/issues/401#issuecomment-7059084220): **19 organických relací = 6 relevantních decision / 11 historický archiv / 2 neurčeno**, relevantní podíl 31,58 %. V omezeném GA4 vzorku bez doložené organické poradenské či merchant události. GA4 session ≠ GSC click ≠ affiliate objednávka; archivní slug ≠ nezávislé živé HTTP 404.

## BLOKACE
- **Mobility nabídky:** MEYRA Ideal 3061982 (výrobce šířka 61,5 cm vs prodejce 59 cm, přesná dodaná varianta UNKNOWN) a BESCO WA78 (nosnost 110 vs 136 kg, vyprodáno a odlišný brand PDF) HOLD. UNIZDRAV **P3774 RETIRED**; P2879 a odlišný MEGO 2 P5559 pouze prodejní kandidáti bez ověřeného přesného výrobního manuálu, fyzické skladovosti a publisher deeplinku. U existující Lékárna.cz další **dva kandidáti HOLD**: MEYRA Rollator 2 3061982-R (retail 468904, rozpor madel/hloubky) a VITEA Mobilus Lite **typ VCBK** podle návodu výrobce 05/2023 (retail 468905, rozpor šířky/výšky; dodaná revize neznámá). [P0 #857](https://github.com/Rastty/zaprazi-2/issues/857), `data/mobility-rollator-supply-review-20261121.json`; nepřidávat neověřené CTA.
- **CJ vlastnost a provize:** [audit Core #2437](https://github.com/Rastty/prometheus-growth-os/issues/2437) nenašel ACTIVE `zaprazi.cz` v připojeném publisher účtu. **Majitel:** CJ → Account → Promotional Properties, ověřit archivovaný/jiný účet nebo aktivovat/registrovat `https://zaprazi.cz/`. Potom nezávisle potvrdit **shodu PID všech 21 CJ URL** a teprve pak rozšířit publisher commission report. Provize `approved/pending/rejected` UNKNOWN; Windsor má advertiser-only chybu ([support #52608259](https://github.com/Rastty/zaprazi-2/issues/857)). Žádné přepisy linků, testovací nákupy ani odvozování příjmů z 25/25 slotů.
- **eHUB:** 4 existující ADL produkty mají neověřené aktuální SKU/stock a partnerský deeplink. [#914](https://github.com/Rastty/zaprazi-2/issues/914); bez přesného zdroje HOLD.
- **SEO:** malé anonymizované GSC intent skupiny; žádný důkaz pro hromadné 301, noindex či mazání ~4 359 starých URL. [#401](https://github.com/Rastty/zaprazi-2/issues/401), [#461](https://github.com/Rastty/zaprazi-2/issues/461).

## DALŠÍ PRIORITA (effort × effect)
1. **P0 první provize:** v CJ ověřit/aktivovat ACTIVE property `zaprazi.cz`, shodu PID s 21 sloty a až pak read-only approved/pending/rejected publisher provize; bez náhradních URL a umělých prodejů.
2. **P0 kvalifikovaná organická akvizice:** po nasazení 0.8.246 sledovat finalizované GSC/GA4 kohorty pro schodiště/Mobility; 44/0 není potvrzené CTR selhání. Neprovádět hromadné 301/noindex historických článků bez důkazu.
3. **P1 nezávislá eHUB cesta:** [#914](https://github.com/Rastty/zaprazi-2/issues/914) ověřit přesné SKU a autorizované partner deeplinky; bez zdrojů ponechat HOLD.

**Předání:** Git merge / synchronizace main/dev není WordPress deploy; aktuální 0.8.246 však má nezávisle doloženou [produkční QA](https://github.com/Rastty/zaprazi-2/actions/runs/45002528029). Další vydání opět vyžaduje nový live důkaz, nikoli převzetí staré akceptace.
