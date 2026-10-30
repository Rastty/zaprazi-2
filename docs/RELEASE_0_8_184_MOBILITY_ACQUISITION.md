# Release 0.8.184 — bezpečnější cesta k pořízení chodítka

Připraveno 30. 10. 2026. **Pouze Git release kandidát. WordPress Pull + Deploy nebyl proveden.**

## Co se mění pro návštěvníka

- `/choditka-pro-seniory/`: bezpečný přechod od srovnání typů k poradci, měření a volbě koupit / půjčit / prověřit úhradu (PR #541).
- Stejná stránka: praktický checklist pro rozhovor s prodejcem, půjčovnou nebo výdejcem bez nátlaku na nákup (PR #543).
- `/choditko-na-pojistovnu/`: postup při čekání na ePoukaz s odkazy na půjčení a měření, bez příslibu nároku či úhrady (PR #545).

## Integrita

- `style.css` a `ZAPRAZI_RELEASE` jsou `0.8.184`.
- Přeznačeno všech **99** položek runtime integrity listu v `functions.php`.
- Git blob SHA pro `src/mobility/engine.js` a `src/mobility/offer-fit-gate.js` aktualizovány podle přesných souborů release; bathroom kritické SHA beze změny.
- Bez změn affiliate mapování, pořadí produktů, diagnostiky, analytiky, databáze a přesměrování.

## Přijetí vydání (deploy gate)

1. Před merge zelené CI včetně `npm test`, PHP lint, integrity markerů a bezpečnostních kontrol. Pokud selže, neslučovat.
2. Po merge `main` a `dev` musí ukazovat na stejný release commit, bez násilného resetu historie.
3. Až potom oprávněný správce WordPressu provede Pull + Deploy z `dev` podle `docs/NEXT_DEPLOY_SMOKE.md`.
4. Na živém webu potvrdit `zaprazi-release=0.8.184`, `zaprazi-integrity=ok` a read-only affiliate readiness 25/25 bez chyb.
5. **Po deployi**, nikoli před ním, spustit ruční Production Advisor Browser QA: 14 poradců, fit-gates, soukromí, mobilní ovládání a nové chodítkové cesty. Nové sekce vizuálně ověřit na `/choditka-pro-seniory/`, `/choditko-na-pojistovnu/` a odkazy na `/pujceni-choditka/` a `/co-zmerit-pred-vyberem-choditka/`.
6. Při neshodě vydání nepřijmout, zastavit další deploy a postupovat podle rollback runbooku.

Bez doložených GSC a schválených affiliate provizí netvrdíme růst návštěvnosti ani výnosů.
