# Zápraží 2.0 — PROJECT_STATE

**28. 11. 2026: 0.8.254 LIVE, ACCEPTED; main=dev při nasazení `1696ba8`.**

## CÍL
Bezpečně a samostatně doma: problém → poradce → řešení → koupit / půjčit / prověřit úhradu → bezpečný další krok. Obchodní milník = připsaná **schválená affiliate provize** (UNKNOWN).

## HOTOVO / PŘIPRAVENO
- Poslední přijaté produkční vydání **0.8.254** — LIVE, ACCEPTED [#960](https://github.com/Rastty/zaprazi-2/pull/960), `1696ba8`, main=dev. Pět koupelnových URL: 7 produktových a 4 rental karty, responzivní rozložení, 1 381 slov. Všech pět workflow na `016c807` PASS: [CI](https://github.com/Rastty/zaprazi-2/actions/runs/46138957706), [Chrome](https://github.com/Rastty/zaprazi-2/actions/runs/46138957695), [SEO](https://github.com/Rastty/zaprazi-2/actions/runs/46138957725), legacy a safety. Bez nových affiliate slotů; [Exact sitemap/index](https://github.com/Rastty/zaprazi-2/actions/runs/46138957725), job 140965334277 v 11:35 UTC: source/live 0.8.254, integrity ok, 5 URL, 12 lastmod. Nástavce veřejně viditelné; [monitor exact](https://github.com/Rastty/zaprazi-2/actions/runs/46140698033) a [plná Chrome 9/9 PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46140726221) na přesném SHA `1696ba8` dokončeny. 25/25 affiliate pozic není důkaz nákupu ani provize. Historie [0.8.253 #958](https://github.com/Rastty/zaprazi-2/pull/958), [0.8.252 #956](https://github.com/Rastty/zaprazi-2/pull/956), [0.8.251 #952](https://github.com/Rastty/zaprazi-2/pull/952).
- **Připravený kandidát #962**: [4 toaletní židle a 2 náhradní nádoby](https://github.com/Rastty/zaprazi-2/pull/962), 777 slov, 26 parametrů, 2 existující URL; kódy ACC/5R a ACC/5A. Čtyři poradce propojeny s 5 pevnými interními cíli po candidate gate, nová karta, bez změn affiliate či tracking. 3 SEO titulky a popisy. Akceptace předchůdce dokončena; restamp a latest-head CI stále nutné.
- **Draft #964**: [dopravní průvodce](https://github.com/Rastty/zaprazi-2/pull/964), přibližně 3 002 slov v celé šabloně, šest regionálních tarifů, šest kontaktních cest, modelový rozpočet, FAQ a interní odkaz na péči. Změny `213d6bd` nejsou na webu. Začleněno do #962 (`8d8145a`); samostatně nevydávat.
- **0.8.250** [#941](https://github.com/Rastty/zaprazi-2/pull/941): prosincový seznam SÚKL, kód 5005963 / IDEAL ROLLATOR 3061982 / 3 408 Kč pouze 1.–31. 12. 2026, listopad platný do pražské půlnoci; leden UNKNOWN. [#944](https://github.com/Rastty/zaprazi-2/pull/944) kontroluje měsíční důkaz a pražské datum. [Chrome PASS](https://github.com/Rastty/zaprazi-2/actions/runs/46051479218).

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
1. Dokončit společný kandidát #962 + #964 (obsah již sloučen): restamp, materiální SEO data, standardní latest-head CI, merge a samostatný WordPress deploy. Prosincová platnost nesmí začít před 1. 12. [#948](https://github.com/Rastty/zaprazi-2/issues/948): nový deploy transport neautorizován, bez volání endpointu.
2. Aktivovat/ověřit CJ property/PID a eHUB doménu, získat autorizovanou provizní evidenci; readiness není provize.
3. Paralelní kandidát [NOANO #946](https://github.com/Rastty/zaprazi-2/issues/946): veřejná odměňovaná spolupráce pro poskytovatele sociálních služeb; způsobilost Zápraží a podmínky UNKNOWN. Poptávka připravena, neodeslána. Pilot jen stávající `/pujceni-choditka/` po schválení a release acceptance, bez zdravotních dat a bez nových slotů. Přednost CJ/eHUB.
4. Po obnovení analytiky měřit kvalifikované organické vstupy → consented guide_advisor_click → builder_start → merchant klik → skutečné schválené provize.
