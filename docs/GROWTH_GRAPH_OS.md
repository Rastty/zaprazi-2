# Zápraží 2.0 — Growth Graph Operating System

**Datum:** 2026-10-29. **Autorita:** docs/ZAPRAZI_SOURCE_OF_TRUTH.md a AGENTS.md; tento graf je provozní plánování, ne nový zdravotní či obchodní rozhodovací engine.

## Smysl
Neřídit projekt dávkami promptů. Řídit konkrétní hodnotové řetězce a jejich měřitelnou zpětnou vazbu:
potřeba seniora/rodiny → GSC, uživatelská otázka nebo obsahová evidence → unikátní užitečný landing/poradce → bezpečný další krok → případná ověřená nabídka → měření → učení → další prioritizace.

**North star 1:** relevantní organické kliky za 28 dní (nikoli počet článků).
**North star 2:** schválené affiliate provize za srovnatelné období (nikoli outbound kliky ani configured sloty).
Sekundárně měřit relevantní zobrazení, dokončení bezpečného poradce, navazující akci, schválené objednávky a případně EPC pouze s kompatibilními intervaly a sítí. Neslibovat multiplikátor ani revenue bez reálných dat.

## Jak funguje graf
- config/growth-graph.json = DAG závislostí v rámci jedné iterace. Každý uzel obsahuje akci, důvod a podmínku dokončení.
- feedbackEdges = **smyčka učení mezi iteracemi**, záměrně není totéž jako requires/dependsOn; zacyklené prerequisite jsou chyba.
- config/growth-state.json = strojově čitelný stav + pouze agregovaná doložená data. Výchozí metriky jsou prázdné = UNKNOWN, nikdy ne 0. Evidence musí mít HTTPS zdroj.
- node scripts/growth-graph.mjs = read-only plán tří nejbližších proveditelných uzlů + blokací a transparentních agregátů.
- GitHub Actions growth-graph.yml = 2× týdně + manuálně vypíše výstup v job summary a jako artefakt; bez WordPress zápisů, kliků na obchodníky, SEO zásahů, přístupu do GSC nebo publikace.
- Tests: node --test tests/growth-graph.test.js tests/bathroom-safety-fuzz.test.js.
- Při absenci výkonnostních dat se dál dělá bezpečnostní QA, technické SEO a validace záměrů, **nečeká** se pasivně na indexaci.

## Priorita a bezpečnost
1. Vysoká závažnost safety/privacy problému okamžitě přebíjí obchodní optimalizaci.
2. Paralelně je vždy možné dělat ověřené, neškodné SEO práce na existujících URL, mobilní výkon a skutečný audit.
3. K vytvoření nové indexovatelné URL vyžadovat vlastní intent, kvalitní aktuální faktickou evidenci, kontrolu překryvu starého archivu, interní odkazy a reálnou další akci.
4. Affiliate použít jen pro prokazatelně relevantní pomůcku, po stávajícím fit-gate; affiliate payout nesmí ovlivnit pořadí doporučení. Rozlišit partner link readiness, skutečné odchozí kliky a schválené provize.
5. Všechny změny přes PR → CI PASS → potřebný deploy → skutečný produkční smoke. Žádné produkční nebo destruktivní zásahy řízené samotným skóre.

## Přijetí open-source
- **Teď:** už využívané vlastní Node testy + existující produkční Chrome QA; nový deterministický seedovaný 3 000-kombinační bezpečnostní test koupelny (bez dalšího závislostního balíku).
- **Příští malý pilot:** fast-check (MIT) pro property-based shrunk failures a axe-core (MPL-2.0) v existujícím Playwright flow na chybový a výsledkový stav. Účel je doplnit stávající testy, ne je duplikovat. Před integrací prověřit verze/licence, CI rychlost, reprodukovatelnost a minimální regresní přínos.
- **UX benchmark:** NHS.UK / GOV.UK frontend (MIT) pouze pro srozumitelné výzvy, otázky a shrnutí; převzít principy a případně malou kompatibilní komponentu, nikoliv celý styl, branding nebo nový engine.
- **Odloženo:** SurveyJS a nový rules engine; přepis současných poradců by zvětšil riziko.

## Jak přidat skutečné výkonnostní signály
Pouze ručně či konektorem **s ověřitelným agregovaným zdrojem** zapiš do state.metrics:
- organic_clicks_28d a organic_impressions_28d z jednoho potvrzeného GSC období;
- advisor_starts_28d, advisor_completes_28d a merchant_clicks_28d z GA4 agregátů s platným souhlasem (není kompletní populace);
- approved_affiliate_commission_28d ze schválených síťových provizí (pending/rejected oddělit).

Každá číselná hodnota musí mít state.metricSources odpovídajícího klíče s HTTPS linkem na skutečný důkaz. Nevkládej zdravotní údaje, syrové odpovědi, kombinace uživatelských odpovědí, merchant deeplink tokeny ani osobní data. Při nedostupných zdrojích nech metriky prázdné. Globální GSC dotazy a URL řádky **nelze** spojovat podle pořadí; stávající scripts/gsc-opportunity-report.mjs zůstává autoritou pro lokální GSC CSV.

Hodnoty ovlivňují pouze prioritu prověrky, nikoli automatické změny indexace. Při úpravě uzlu na verified je povinný evidenceUrl (např. CI/produkční smoke/GSC report). Po nasazení znovu změř za srovnatelné 14/30/60denní období; výsledek může být continue, adjust nebo rollback.

## Co graf nyní nedělá
Nevytváří sám nový kód, nečte aktuální GSC/GA4/affiliate účty, neslibuje běh osobního AI agenta 24/7. Předává auditovatelný plán a umožňuje navazujícímu autorizovanému runneru jednat; opakované kontroly běží v GitHub Actions. Je záměrně bezpečný, reprodukovatelný a pravdivý.
