# Zápraží 0.8.188 — anonymní přechod článek → poradce (RELEASE KANDIDÁT)

**Zatím nenasazeno.** Změny z PR #609 a integrace #610 podporují vyhodnocování hlavní uživatelské cesty z organického obsahu do poradce.

## Co se mění
- Šest existujících primárních CTA na obsahových a rozhodovacích stránkách má jen atribut `data-zp-journey="advisor"`. Viditelná nabídka, text a cíl zůstaly beze změny.
- Při výslovném analytickém souhlasu může adapter jednou za načtení stránky odeslat **pouze název události** `guide_advisor_click`; žádné odpovědi, diagnózy, produkt, zdrojová ani cílová URL, query parametr, cesta uživatele či merchant.
- Samotná událost **není dokončení poradce**, unikátní člověk, affiliate proklik ani provize. V SQL BigQuery je oddělená od `builder_start`, `builder_complete`.
- Původní rozhodovací enginy, 25 affiliate slotů, nabídky, jejich fit-gate a pořadí se nemění.

## Závislosti a QA
- 100 souborů PHP/JS/CSS v runtime manifestu, `style.css` a PHP `ZAPRAZI_RELEASE` = 0.8.188. Dva Mobility kritické Git blob hashe aktualizovány pouze kvůli markeru. Koupelnové kritické hashe bez změny.
- Zdrojové CI + bezpečnostní a consent-regrese PASS, před nasazením produkční read-only QA běžícího 0.8.187 PASS.
- Merge kandidáta do `main`, synchronizace `dev`, až potom ruční WordPress Pull + Deploy.
- Po nasazení přesná Chrome QA 0.8.188: verze/integrita, 25/25, všech 14 poradců, šest označených CTA a privátní chování bez přenosu odpovědí.
- Při nesouladu nebo neúspěchu testu STOP/rollback; nikdy nepovažovat starou produkční QA za potvrzení nového vydání.

**GSC / schválené provize:** nadále UNKNOWN do doložení agregátů.
