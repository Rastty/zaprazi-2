# Zápraží 0.8.185 — koordinované UX vydání Mobility (kandidát)

Připraveno 1. 11. 2026. **Pouze release kandidát v GitHub PR; není to WordPress deploy ani potvrzení produkčního smoke.**

## Co uživatel získá
- `/pujceni-choditka/`: pět praktických otázek pro půjčovnu, přístupná kotva, bezpečné převzetí a postup při nedostupném typu; po 6. 11. 2026 se starší sazby a kauce označí jako historické a kalkulačka starých sazeb se nevykreslí. Zdroj: PR #549.
- `/co-zmerit-pred-vyberem-choditka/`: sedm kontrol včetně prahů a kluzké podlahy; bezpečný přechod na stávající návod měření prahu. Zdroj: PR #565.
- Žádný nový doporučovací engine, změna pořadí produktů, obchodní CTA, analytika odpovědí, přesměrování ani tvrzení o aktuálních cenách.

## Integrace a integrita
- Výchozí main commit `3638ae45a67f4352994d6fa4a63a37199523f21a` (po PR #578).
- Verze `style.css` a `ZAPRAZI_RELEASE`: `0.8.185`.
- Všech 100 položek runtime integrity manifestu přeznačeno na `ZP_RELEASE_0_8_185`; u čtyř kritických rozhodovacích souborů zůstává přesná Git blob kontrola. Mobility blob SHA aktualizovány pouze kvůli release markeru; žádná změna rozhodovací logiky.
- Převzaty relevantní testy z PR #549 a #565. Změny zdrojových šablon se nesmějí slučovat samostatně do staršího vydání.

## Před sloučením a WordPress deploy
1. Ověřit, že produkce `0.8.184` má `zaprazi-integrity=ok` a kompletní affiliate readiness; předchozí CI ani kontrola staré produkce nepotvrzují nové vydání.
2. Zkontrolovat PR diff a všechna CI včetně PHP lint, Node testů, manifestu a blob SHA. Při selhání zůstat DRAFT.
3. Po schválení koordinovaného release sloučit do `main`, fast-forward `dev` na identické SHA bez force/reset, ověřit `npm run deploy:preflight`.
4. **Pouze oprávněný správce** provede manuální WordPress Pull + Deploy z `dev`.

## Postdeploy acceptance (nenahrazovat predeploy CI)
- `zaprazi-release=0.8.185`, `zaprazi-integrity=ok`, affiliate-readiness úplná, všech 14 poradců PASS v manuálně spuštěném Production Advisor Browser QA.
- V mobilním Chromu 390 px ověřit sedm bodů, interní odkaz na měření prahu, pět otázek půjčovně, klávesnicový fokus kotvy a absenci sběru osobních údajů.
- Ověřit před/po 6. 11. 2026 bezpečné označení cen a zablokování starého kalkulátoru; nepřijmout zastaralé sazby jako aktuální.
- Ověřit bezpečné uzamčení obchodních nabídek při změně kritické odpovědi a při `nevím`, absenci zdravotních odpovědí v URL, analytics a storage.
- Při jakémkoliv failu **STOP/rollback** dle `docs/NEXT_DEPLOY_SMOKE.md`; nezaměňovat zelené CI za produkční akceptaci.

GSC, GA4 a schválené affiliate provize: **UNKNOWN**, dokud není ověřitelná agregovaná evidence.
