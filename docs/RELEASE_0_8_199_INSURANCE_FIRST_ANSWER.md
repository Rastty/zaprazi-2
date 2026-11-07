# Zápraží 0.8.199 — návrh releasu pro užitečnou odpověď o ePoukazu

**Datum přípravy:** 7. 11. 2026. **Stav:** kandidát, NEPROVÁDĚT NASAZENÍ ani slučování do `main`, dokud není potvrzeno úplné nasazení a nezávislé Chrome QA `0.8.198`.

## Proč právě tato stránka

Ověřená 28denní data Google Search Console z https://github.com/Rastty/prometheus-growth-os/actions/runs/42235726854 (7. 10. – 3. 11. 2026, zpracováno 6. 11.): celý web 11 kliknutí / 884 zobrazení; sledovaná URL `/choditko-na-pojistovnu/` 2 kliknutí, 54 zobrazení, průměrná pozice 10,37. Je to drobný vzorek a **nikoli důkaz budoucího SEO zlepšení**.

## Návštěvnická změna

Nová viditelná odpověď bezprostředně za úvodem stránky a před historickou částkou:
1. Ověřit bezpečný typ pomůcky; při pádech či nejistých brzdách odborné posouzení
2. Probrat ePoukaz a konkrétní prostředek s předepisujícím lékařem
3. U oprávněného výdejce ověřit identitu, aktuální úhradu a případný doplatek

Explicitní zákaz spoléhat na dodatečné proplacení vlastního nákupu, s odkazem na oficiální [VZP](https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka), zkontrolováno 7. 11. 2026. Proces ePoukazu doložen [SÚKL](https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/). Žádný nový nárok, nepodložená úhrada, cena, produktové pořadí, affiliate zkratka ani druhý engine.

## Release a testy

- `style.css` a PHP verze `0.8.199`, 100 souborů z manifestu označeno `ZP_RELEASE_0_8_199`
- Dvě přesné Mobility blob SHA piny převedeny na nové, Bathroom piny neměněny
- PHP render regrese ověřuje tři kroky, souvislost s originálními kotvami a historickou platnost částky
- Nový `scripts/audit-live-insurance-first-199.mjs` v reálném mobilním Chrome kontroluje tři kroky, oficiální odkaz VZP, skutečný klik do existujícího poradce, verzi, integritu, 25/25, žádný obchodní klik, POST ani odpovědi
- Nový QA běží **pouze po skutečném deployi**, PR preview jej nemůže vydávat za zelené produkční přijetí

## Podmínky dalšího postupu

1. Nejdřív ověřit na produkci `0.8.198`, `integrity=ok`, 25/25 a plný postdeploy Chrome test všech 14 poradců; zdroj `config/growth-state.json` zatím stále dokládá jen `0.8.197`.
2. Teprve pak povolit merge této kandidátní `0.8.199` větve po kompletním zeleném CI; nepřepisovat nasazenou `0.8.198` nenadálým deployem návrhu.
3. Fast-forward `main → dev` po novém CI, vlastníka požádat o manuální WordPress `Deployer for Git → dev → Pull + Deploy`.
4. Povinná nezávislá `Production Advisor Browser QA` po deployi `0.8.199`, s novou scénou i všemi stávajícími 14 poradci.
5. Teprve potom označit `safety_qa` verified pro 0.8.199 a později ověřit srovnatelná GSC čísla; nevyvozovat provize z kliků.

**Žádná aktuální publikace nebo prokazatelné zvýšení návštěvnosti není součástí tohoto návrhu.**
