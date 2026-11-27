# Zápraží 2.0 — PROJECT_STATE

**Stav 27. 11. 2026: WordPress 0.8.249 LIVE a ACCEPTED; 0.8.250 MERGED, main=dev, čeká na WordPress Pull + Deploy.**

## CÍL
Bezpečně a samostatně doma: problém → poradce → typ řešení → koupit / půjčit / prověřit úhradu → bezpečný další krok. Obchodní milník = připsaná **schválená affiliate provize** (stále UNKNOWN).

## HOTOVO / PŘIPRAVENO
- Poslední přijaté produkční vydání **0.8.249**: [Chrome QA PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46020012104); 14 poradců, 25/25 nakonfigurovaných affiliate slotů, bezpečnost a privacy. **25/25 affiliate pozic není důkaz nákupu ani provize.**
- 27. 11.: [Independent Production Acceptance PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46015196089), [affiliate parity PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46005771626).
- **GitHub MERGED 0.8.249 — [PR #936](https://github.com/Rastty/zaprazi-2/pull/936):** homepage hero nahrazuje třetí nepřímou volbu přímým odkazem na `#poradce` s existujícím consent-safe `guide_advisor_click`; krizový CTA a ostatní situace zůstávají. Cíl focusovatelný, 100/100 integritních markerů a kritické SHA připraveny, nový test. Žádná nová diagnóza, produkt či merchant URL. PR testy 1 360/1 360 PASS, predeploy browser-qa PASS, SEO PASS, main=dev v přesném squash commitu `33230365`; [release ref preflight PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46018169428). Majitel provedl Pull + Deploy; [nezávislá exact 0.8.249 acceptance](https://github.com/Rastty/zaprazi-2/actions/runs/46019498998) potvrzuje release, integrity=ok, 25/25 a skutečný nový homepage CTA. [#938](https://github.com/Rastty/zaprazi-2/pull/938) přidal tento trvalý veřejný feature gate; [#939](https://github.com/Rastty/zaprazi-2/pull/939) zapojil stejný gate do automatiky bez dodatečných GET; plný [Chrome QA](https://github.com/Rastty/zaprazi-2/actions/runs/46020012104) přímo na 0.8.249 PASS (14 live Advisor forms, release coherence 4 pages/2 readiness checks).

- **GitHub MERGED 0.8.250 — [PR #941](https://github.com/Rastty/zaprazi-2/pull/941):** finální seznam SÚKL zveřejněn 24. 11. (č. j. sukl343339/2026), [PDF, strana 11](https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01BJW@SUKLAA/26D0VOL8@SUKLAA/ZPSCAU_20261201.pdf), kód 5005963 / IDEAL ROLLATOR 3061982 / úhrada 3 408 Kč pouze 1.–31. 12. 2026. Listopad zůstává aktivní do pražské půlnoci; lednový záznam neznámý. Žádné tvrzení o individuálním nároku/doplatku ani změna affiliate linků. Přesný blob acquisition.js přidán do integrity. [CI 1 368/1 368 PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46026446800), [predeploy Chrome QA PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46026446727), XML/SEO/legacy/properties PASS; runtime squash `2e55d179d02eed2229ab0dc9960b5cb2bea4bb11`, [ref preflight PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46027226413). Poslední live monitor [46026584565](https://github.com/Rastty/zaprazi-2/actions/runs/46026584565) 0.8.249, 25/25, nikoli acceptance 0.8.250.

## OVĚŘENO
- 23. 11. bot-scoped Googlebot SEO parser + 8 testů [#934](https://github.com/Rastty/zaprazi-2/pull/934); bez WordPress runtime změn.
- **GSC final 28d 28. 10.–24. 11.: 22 kliků / 1 896 impresí** ([Core snapshot 27. 11.](https://github.com/Rastty/prometheus-growth-os/actions/runs/45954642166), 29/53 sledovaných URL; 7/7 page-filtered queries odpovědělo, 0 bezpečných skupin). Starší překrývající se okno: 16 / 1 529; nejde o kauzální uplift. Index Inspection: 12/15 indexovaných, homepage crawled-not-indexed (crawl 20. 11. před 0.8.249), bytové chodítko a sprchovací židle discovered-not-indexed bez prvního crawl; všechny tři sitemap reported. Dopravní návod 149 impresí/4 kliky, ePoukaz 58/1, schody 55/1; bez nového safe query intent žádný přepis. **GA4 27d 25. 10.–20. 11.:** 18 Organic sessions / 7 engaged; GA4 28d 24. 10.–20. 11.: 19 / 8. Pět zahájení, pět dokončení poradce a jeden merchant click bez Organic atribuce. Uplift ani příjem **neověřeny**. [Evidence](docs/MEASUREMENT_BASELINE_2026-11-20.md).

## BLOKACE
- CJ: nepotvrzená ACTIVE publisher property `zaprazi.cz` a PID/21 deeplinků; schválené/pending/rejected provize UNKNOWN. [#857](https://github.com/Rastty/zaprazi-2/issues/857).
- eHUB: 4 veřejné seller SKU karty ověřeny, ale publisher deeplinky, přesné varianty a sklady ne. [#914](https://github.com/Rastty/zaprazi-2/issues/914). Bez odemykání CTA.
- **Windsor.ai 27. 11.: nové čtení GA4/CJ zamítnuto:** tarif Free 1 účet, připojeno 5; neodpojovat jiné weby naslepo. Potřebná změna tarifu nebo přímý read-only export z GA4/CJ.
- **Git merge / synchronizace není WordPress deploy**; existující autorizovaná cesta je pouze majitelův Deployer for Git. WPVibe nepoužívat.
- Nedoložené hromadné 301/noindex/mazání historických 4 359 URL zůstává HOLD [#461](https://github.com/Rastty/zaprazi-2/issues/461).

## DALŠÍ PRIORITA
1. Majitel: WP Deployer for Git → dev → Pull + Deploy 0.8.250. Poté ověřit přesný release + 14 poradců; prosincová platnost nesmí začít před 1. 12. Discovery audit 27. 11.: oba neindexované produkty mají 9 dalších interních zdrojů, sitemap a self canonical. Žádné další spekulativní přepisy ani index requests.
2. V CJ aktivovat/ověřit property a PID, získat read-only publisher provizní evidenci; výsledek odlišit od readiness.
3. Po obnovení analytiky porovnat kvalifikované organické vstupy → consented `guide_advisor_click` → `builder_start` → merchant klik, bez odvozování objednávek z kliků.
