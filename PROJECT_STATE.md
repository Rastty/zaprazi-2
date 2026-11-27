# Zápraží 2.0 — PROJECT_STATE

**Stav 27. 11. 2026: WordPress 0.8.250 LIVE a ACCEPTED; main=dev.**

## CÍL
Bezpečně a samostatně doma: problém → poradce → řešení → koupit / půjčit / prověřit úhradu → bezpečný další krok. Obchodní milník = připsaná **schválená affiliate provize** (UNKNOWN).

## HOTOVO / PŘIPRAVENO
- Poslední přijaté produkční vydání **0.8.250**: [Chrome QA PASS (9/9 jobs)](https://github.com/Rastty/zaprazi-2/actions/runs/46051479218), [sitemap PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46051479240), 14 poradců, integrity=ok, 25/25 nakonfigurovaných slotů. **25/25 affiliate pozic není důkaz nákupu ani provize.** [Exact acceptance](https://github.com/Rastty/zaprazi-2/actions/runs/46019498998), [affiliate parity](https://github.com/Rastty/zaprazi-2/actions/runs/46005771626).
- 0.8.249 [PR #936](https://github.com/Rastty/zaprazi-2/pull/936): přímý homepage CTA na poradce s consent-safe `guide_advisor_click`; krizové CTA zachováno. [#938](https://github.com/Rastty/zaprazi-2/pull/938) + [#939](https://github.com/Rastty/zaprazi-2/pull/939) = trvalá produkční kontrola a automatika.
- **0.8.250 LIVE, ACCEPTED** [#941](https://github.com/Rastty/zaprazi-2/pull/941): [finální prosincový seznam SÚKL, s. 11](https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01BJW@SUKLAA/26D0VOL8@SUKLAA/ZPSCAU_20261201.pdf), kód 5005963 / IDEAL ROLLATOR 3061982 / 3 408 Kč pouze 1.–31. 12. 2026; listopad zůstává aktivní do pražské půlnoci, leden UNKNOWN. Žádné tvrzení o individuální úhradě/doplatku. [CI 1368/1368](https://github.com/Rastty/zaprazi-2/actions/runs/46026446800), [predeploy browser QA](https://github.com/Rastty/zaprazi-2/actions/runs/46026446727), [ref preflight](https://github.com/Rastty/zaprazi-2/actions/runs/46027226413) PASS. [Exact public probe 27. 11. 18:40 UTC](https://github.com/Rastty/zaprazi-2/actions/runs/46051217987): source/live 0.8.250, 10 stránek, 25/25, 2 readiness checks, správný listopadový důkaz SÚKL; bez zápisu či redeploye. [#944](https://github.com/Rastty/zaprazi-2/pull/944) kontroluje měsíční důkaz i pražské datum.
- [#945 MERGED](https://github.com/Rastty/zaprazi-2/pull/945): součty affiliate skupin přesně odpovídají globálnímu počtu před/po veřejném probe; [1374/1374 CI](https://github.com/Rastty/zaprazi-2/actions/runs/46046509119) + [browser/SEO](https://github.com/Rastty/zaprazi-2/actions/runs/46046509159) PASS. QA pouze v GitHubu, bez změny tématu.

## OVĚŘENO
- **GSC final 28d 28. 10.–24. 11.: 22 kliků / 1 896 impresí** ([Core snapshot](https://github.com/Rastty/prometheus-growth-os/actions/runs/45954642166), 29/53 URL, 0 nových bezpečných query skupin). Starší překrývající se okno 16/1 529, ne kauzální uplift. Index Inspection 12/15; homepage crawled-not-indexed (crawl 20. 11.), bytové chodítko a sprchovací židle discovered-not-indexed, 3/3 sitemap reported; obě URL již mají 9 dalších interních zdrojů a self-canonical. Dopravní návod 149/4, ePoukaz 58/1, schody 55/1.
- **GA4 27d 25. 10.–20. 11.:** 18 Organic sessions / 7 engaged; **GA4 28d 24. 10.–20. 11.:** 19 Organic sessions / 8 engaged; 5 startů, 5 dokončení a 1 merchant click bez Organic atribuce. [Měřicí baseline](docs/MEASUREMENT_BASELINE_2026-11-20.md). Uplift i příjem neověřeny.

## BLOKACE
- CJ: nepotvrzená ACTIVE property `zaprazi.cz` a PID/21 deeplinků; provize UNKNOWN. [#857](https://github.com/Rastty/zaprazi-2/issues/857). Dr.Max WA17 shodné EAN, Mediskont 100 WHD variantní rozpor; [kandidáti HOLD](https://github.com/Rastty/zaprazi-2/issues/857#issuecomment-7225291402).
- eHUB: [27. 11. runner](https://github.com/Rastty/zaprazi-2/actions/runs/46027220415) 4/4 seller karty se skladovým štítkem; 4/4 shodné MVS kódy (Open-It dvě REF; seller 15-050105 Ice Blue), [#943](https://github.com/Rastty/zaprazi-2/pull/943). Skutečná dodávka/sklad, registrovaná doména, publisher deeplinky a provize UNKNOWN. [#914](https://github.com/Rastty/zaprazi-2/issues/914), [export + Core Commercial Data Spine](https://github.com/Rastty/zaprazi-2/issues/914#issuecomment-7224926028). Bez odemykání CTA.
- Windsor 27. 11. GA4/CJ čtení odmítnuto (Free 1 účet, 5 připojeno). Neodpojovat jiné weby naslepo; tarif nebo autorizovaný read-only export. GA4 property 364504169, stream G-WM86QVXVST; GSC token pouze webmasters.readonly, BQ dataset Zápraží není v allowlistu.
- **Git merge / synchronizace není WordPress deploy**; pouze ověřený majitelův Deployer for Git. WPVibe nepoužívat.
- Nedoložené hromadné 301/noindex/mazání 4 359 historických URL HOLD [#461](https://github.com/Rastty/zaprazi-2/issues/461).

## DALŠÍ PRIORITA
1. 0.8.250 full QA PASS; další obsahový release podle prokazatelné uživatelské hodnoty a existující evidence. Prosincová platnost nesmí začít před 1. 12. Bez dalších spekulativních přepisů či index requests. [#948](https://github.com/Rastty/zaprazi-2/issues/948) má otestovaný read-only DFG canary preflight (#949/#950); nový deploy transport neautorizován, bez volání endpointu.
2. Aktivovat/ověřit CJ property/PID a eHUB doménu, získat autorizovanou provizní evidenci; readiness není provize.
3. Paralelní kandidát [NOANO #946](https://github.com/Rastty/zaprazi-2/issues/946): veřejná odměňovaná spolupráce pro poskytovatele sociálních služeb; způsobilost Zápraží a podmínky UNKNOWN. Poptávka připravena, neodeslána. Pilot jen stávající `/pujceni-choditka/` po schválení a release acceptance, bez zdravotních dat a bez nových slotů. Přednost CJ/eHUB.
4. Po obnovení analytiky měřit kvalifikované organické vstupy → consented guide_advisor_click → builder_start → merchant klik → skutečné schválené provize.
