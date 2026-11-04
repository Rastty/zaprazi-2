# První read-only kontrola 25 veřejných merchant product URL (4. 11. 2026)

## Skutečný důkaz
GitHub Actions [#41810674676](https://github.com/Rastty/zaprazi-2/actions/runs/41810674676) vykonala nový `Zápraží public merchant product health` na produkčně synchronizovaném zdrojovém repozitáři, dokončeno 4. 11. 2026 09:55 UTC. JSON artefakt `merchant-public-targets` potvrzuje přesně 25 kontrolovaných **veřejných kanonických produktových cílů** (bez publisher affiliate URL, uživatelských odpovědí, cookies a následování redirectů).

Výsledek:
- **23 × HTTP 200:** veřejná stránka je dosažitelná z GitHub runneru. Neprokazuje správný SKU, dostupnost na skladě, cenu, funkční partnerský deeplink ani atribuci.
- **2 × HTTP 403:** `lekarna-cz:meyra-ideal-3061982` a `drmax-cz:dma-eh-cmda`. Stav **access_unverifiable**, nikoliv zmizelý produkt nebo neplatný affiliate odkaz. Vyhledávačem dohledatelné katalogové stránky existují, ale nejsou náhradou aktuálního browser/deeplink důkazu.
- **0 × 301/302/307/308**, **0 × 404/410**, **0 × 5xx** z kontrolovaných produktových URL.

Původní evidence BESCO hmotností z read-only auditu [#41633028098](https://github.com/Rastty/zaprazi-2/actions/runs/41633028098) zůstává samostatně relevantní; veřejná dostupnost URL nenahrazuje kontrolu návodu a SKU.

## Co dále s největším poměrem přínos/náklad
1. Dva HTTP 403 ověřit běžným skutečným prohlížečem, bez automatických affiliate kliků; nejdřív odlišit ochranu proti botům od chybného cíle.
2. Pro úspěšných 23 prověřit konkrétní produktovou identitu podle manuálu nebo ověřeného veřejného údaje, nejdřív tři komerční Mobility kandidáty.
3. **Skutečné partnerské URL, atribuci kliků a schválené provize** ověřit jen s autorizovanou síťovou evidencí; 25/25 configured není důkaz těchto obchodních kroků. Nevynucovat síťové tracking requesty z GitHub Actions.

## Bezpečnost a interpretace
Nový workflow běží jen 1× týdně, max 3 veřejné GET současně, má `redirect: manual`, žádné WP zápisy a žádné dotazy na affiliate tracking hosty. Výstupy jsou stavové agregáty, nikoliv statistika návštěvnosti. Growth Graph affiliate audit má stále `in_progress`; GSC/GA4 a schválené provize zůstávají UNKNOWN. Tento soubor ani evidence-only PR nevyžadují WordPress deploy.
