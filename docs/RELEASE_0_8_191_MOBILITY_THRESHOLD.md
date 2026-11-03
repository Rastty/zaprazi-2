# Release 0.8.191 — bezpečný odkaz z úzkých dveří na měření prahu

## Rozsah
Koordinované vydání změny z PR #625: na existující stránce `/choditko-do-bytu-pro-seniory/` přibývá kontextový odkaz z bloku o 60cm průchodu na již existující `/prahy-pro-choditko-a-vozik/#mereni-prahu`. Původní měřicí seznam i cesta do poradce zůstávají. Odkaz není obchodní CTA a neodemyká product-fit gate.

## Bezpečnost a soukromí
Bez nového rozhodovacího pravidla, produktových faktů, affiliate rankingu, analytické události nebo odpovědí v URL. Obecné měření nesmí být vydáváno za potvrzení bezpečnosti chůze ani konkrétního výrobku.

## Verze a integrita
`style.css` a `ZAPRAZI_RELEASE` = `0.8.191`. Všech 100 souborů runtime release manifestu nese marker `ZP_RELEASE_0_8_191`; nové Git blob SHA pro kritické Mobility engine a fit gate se kontrolují v `functions.php`. Ostatní rozhodovací logika se nemění kromě release markerů.

## Ověření a WP deploy gate
1. CI: `npm test`, PHP lint, release manifest a critical blob identity, `tests/indoor-walker-threshold-handoff.test.js` a všechny stávající safety/privacy testy musí být zelené.
2. Teprve po bezpečném merge a synchronizaci `main=dev` provést `npm run deploy:preflight`.
3. WordPress **Pull + Deploy pouze autorizovaným správcem**. GitHub merge není produkční deploy.
4. Read-only release/integrity/readiness: `0.8.191`, `integrity=ok`, `configured_total=slot_total=25`, bez `missing`.
5. **Až po deployi** nezávislá `Production Advisor Browser QA` všech 14 poradců, bezpečnostních bran a kontrola nového interního odkazu v reálném Chrome. Neúspěch = stop a případný rollback podle `docs/NEXT_DEPLOY_SMOKE.md`.

GSC a schválené affiliate provize nejsou doložené; žádný růst se netvrdí.
