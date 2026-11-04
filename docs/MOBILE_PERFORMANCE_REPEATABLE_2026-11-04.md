# Zápraží 2.0 — opakovatelné mobilní laboratorní měření po 0.8.195

**Datum návrhu:** 2026-11-04. **Důvod:** měřit dopad nové verze na mobilní zkušenost bez domýšlení zvýšení rychlosti nebo organického výkonu.

## Zjištěný výchozí stav

- **Živá verze 0.8.195 bezpečnostně ověřena**, celý postdeploy Chrome běh 9/9 úspěšný: https://github.com/Rastty/zaprazi-2/actions/runs/41842091964. Pouze to potvrzuje funkčnost a integritu, nikoli zrychlení.
- **Historická baseline 11. 10. 2026:** laboratorní Lighthouse 13.5.0, po jediném běhu každé ze tří URL: homepage 100/100, `/koupelna-a-wc/` 100/100, `/nocni-cesta-z-postele-na-wc/` 100/100. Zdroj: https://github.com/Rastty/zaprazi-2/actions/runs/38154470010 a `docs/LIGHTHOUSE_MOBILE_BASELINE_2026-10-11.md`.
- Historické a nové URL a podmínky nejsou všechny identické. Není dovoleno vykreslovat rozdíl skóre jako kauzální efekt změny 0.8.195. Především **neznáme skutečný terénní p75 LCP/INP/CLS**, GSC organické kliky, GA4 funnel a schválené affiliate provize.

## Nyní implementované měření

`.github/workflows/mobile-lighthouse-baseline.yml` je read-only workflow v GitHub Actions. Trigger: PR při změně měření, push do main při změně měření, ruční dispatch, **1× týdně v úterý 05:37 UTC**. Má pouze právo `contents: read`, bez WordPress přihlášení nebo cookies se souhlasem.

Před měřením provádí **pouze veřejný GET** do `/wp-json/zaprazi/v1/affiliate-readiness` a ověřuje `integrity=ok`, očekávaných `25/25` nakonfigurovaných slotů a přesnou hodnotu vydání. Nevkládá do úložiště odpovědi poradců, nikomu neodesílá žádná data z formulářů. Historická doména není dotazována.

Následně měří Lighthouse CLI **13.5.0** za explicitního mobilního form factoru a pevné konfigurace:
1. `/` — primární vstup k domácímu poradci;
2. `/choditka-pro-seniory/` — rozhodovací mobilitní hub s hlavní CTA do poradce;
3. `/koupelna-a-wc/` — druhý důležitý vstupní poradce.

Každou stránku 3× nezávisle; celkem 9 Lighthouse JSON reportů. `scripts/audit-lighthouse-series.mjs` odmítá jiné domény, jiné URL, desktopový profil, chybějící metriky, neúplná data, drift verze Lighthouse a interní varování auditu. Výstup zahrnuje Lighthouse score, FCP/LCP, TBT, CLS a velikost přenesených first-party assetů **jako medián, minimum a maximum**, ne jako jeden nepřesný údaj. U skóre s rozptylem alespoň 10 bodů varuje. Souhrn je v job summary a v `summary.json` spolu se všemi surovými reporty jako GitHub Action artefakt s uchováním 14 dní.

**Nejde o terénní měření:** Lighthouse FCP/LCP/CLS/TBT jsou laboratorní simulace, ne hodnota skutečných mobilních návštěvníků. INP nelze stanovit tímto jednoduchým testem. První běh po nasazení musí teprve dodat výsledky; před jeho dokončením nevymýšlet hodnoty. Žádné skutečné obchody, provize nebo návštěvy se z Lighthouse neodvozují.

## Rozhodování Effort × Effect

- Jestliže jsou všechny tři URL rychlé a stabilní a nejsou velké first-party assety, **nedělat další preventivní úpravy** v render path; prioritu mají GSC intent evidence a obchodní funnel.
- Při opakovatelné slabší mobilitní stránce porovnat konkrétní waterfall, text/obrázky/JS, až poté vytvořit jediný cílený PR s testem.
- Pokud mezi dvěma týdenními běhy roste LCP, ověřit shodnou konfiguraci a několik běhů; jeden výkyv sám o sobě neznamená regresi.
- Pokud zůstávají GSC/GA4/síťové provize nedostupné, hodnoty `config/growth-state.json.metrics` musí zůstat prázdné (`UNKNOWN`), nikoliv nula.

**Deploy:** tento PR mění **pouze read-only reportovací skript, test, workflow a dokumentaci**. Nenese novou WordPress verzi, není potřeba Pull + Deploy. Po sloučení `main` i `dev` lze audit spouštět na současném produkčním 0.8.195.
