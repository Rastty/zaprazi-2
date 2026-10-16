# Zápraží 0.8.140 — kalkulátor postele zneplatní starý výsledek při změně vstupu

**Zdroj:** produkční browser QA verze 0.8.139 (16. 10. 2026), [neúspěšný run #38876301503](https://github.com/Rastty/zaprazi-2/actions/runs/38876301503) a [QA PR #369](https://github.com/Rastty/zaprazi-2/pull/369), který zůstal správně nesloučen.

## Problém a přesná oprava
Po výpočtu dvou cen návštěvník změnil délku na 0 měsíců. Nativní HTML5 validace zabránila spuštění `submit` handleru; stránka ale stále ukazovala **předchozí platný výsledek**. Aritmetika samotná byla správná.

Nyní `input` a `change` okamžitě přepíšou oblast výsledku bezpečným informačním textem: při neplatném vstupu výzva k opravě, při platném vstupu výzva k přepočtu. Původní výsledek se nikdy nezobrazuje jako výsledek již změněných hodnot. Přístupnost živé oblasti a nativní validace zůstávají.

## Hranice
Žádná změna výpočtu, ukázkových cen, zdravotních podmínek, schématu analytiky, affiliate URL, doporučovacích pravidel, ceníků ani uložených dat; všechny hodnoty dál zůstávají pouze v prohlížeči. Release 0.8.140 obsahuje všech **71** ochranných markerů.

## Akceptace
- `npm test` – invalidace starého výsledku, obnovení platného výsledku, soukromí a aritmetika.
- Stávající historická predeploy fidelity.
- Po Pull + Deploy test skutečného DOM kalkulátoru v Chrome: zplatnění / zneplatnění / přepočítání, plus 14/14 poradců, 27/27 SEO URL, affiliate 25/25 a historické canary. Přepsat starý 0.8.139 QA script na 0.8.140, nikoliv označit červený QA PR za úspěšný.
