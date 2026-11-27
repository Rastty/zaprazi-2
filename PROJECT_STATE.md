# Zápraží 2.0 — PROJECT_STATE

**Stav 27. 11. 2026: WordPress 0.8.248 je poslední ověřený live release. 0.8.249 je pouze GIT RELEASE KANDIDÁT; NENASAZENO.**

## CÍL
Bezpečně a samostatně doma: problém → poradce → typ řešení → koupit / půjčit / prověřit úhradu → bezpečný další krok. Obchodní milník = připsaná **schválená affiliate provize** (stále UNKNOWN).

## HOTOVO / PŘIPRAVENO
- **Live 0.8.248:** [Chrome QA 9/9 PASS](https://github.com/Rastty/zaprazi-2/actions/runs/45048858868); 14 poradců, 25/25 nakonfigurovaných affiliate slotů, bezpečnost a privacy. To není schválená objednávka.
- 27. 11.: [Independent Production Acceptance PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46015196089), [affiliate parity PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46005771626).
- **Release kandidát 0.8.249:** homepage hero přidává přímý odkaz na `#poradce` s existujícím consent-safe `guide_advisor_click`; krizový CTA a ostatní situace zůstávají. Cíl focusovatelný, 100/100 integritních markerů a kritické SHA připraveny, nový test. Žádná nová diagnóza, produkt či merchant URL. Po CI musí následovat merge main, fast-forward dev, majitelův Deployer Pull + Deploy a exact-release QA.

## OVĚŘENO
- 23. 11. bot-scoped Googlebot SEO parser + 8 testů [#934](https://github.com/Rastty/zaprazi-2/pull/934); bez WordPress runtime změn.
- Starší GSC 23. 10.–19. 11.: 16 kliků / 1 529 impresí. GA4 24. 10.–20. 11.: 19 Organic sessions / 8 engaged, 5 zahájení / 5 dokončení a 1 merchant click bez Organic atribuce. Uplift ani příjem **neověřeny**. [Evidence](docs/MEASUREMENT_BASELINE_2026-11-20.md).

## BLOKACE
- CJ: nepotvrzená ACTIVE publisher property `zaprazi.cz` a PID/21 deeplinků; schválené/pending/rejected provize UNKNOWN. [#857](https://github.com/Rastty/zaprazi-2/issues/857).
- eHUB: 4 veřejné seller SKU karty ověřeny, ale publisher deeplinky, přesné varianty a sklady ne. [#914](https://github.com/Rastty/zaprazi-2/issues/914). Bez odemykání CTA.
- **Windsor.ai 27. 11.: nové čtení GA4/CJ zamítnuto:** tarif Free 1 účet, připojeno 5; neodpojovat jiné weby naslepo. Potřebná změna tarifu nebo přímý read-only export z GA4/CJ.
- WordPress release nelze prohlásit za nasazený samotným GitHub merge; existující autorizovaná cesta je pouze majitelův Deployer for Git. WPVibe nepoužívat.
- Nedoložené hromadné 301/noindex/mazání historických 4 359 URL zůstává HOLD [#461](https://github.com/Rastty/zaprazi-2/issues/461).

## DALŠÍ PRIORITA
1. Uzavřít CI/release 0.8.249, samostatný Pull + Deploy, exact live integrity a 14-advisor Chrome QA.
2. V CJ aktivovat/ověřit property a PID, získat read-only publisher provizní evidenci; výsledek odlišit od readiness.
3. Po obnovení analytiky porovnat kvalifikované organické vstupy → consented `guide_advisor_click` → `builder_start` → merchant klik, bez odvozování objednávek z kliků.
