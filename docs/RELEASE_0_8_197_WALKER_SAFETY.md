# Zápraží 0.8.197 — bezpečná cesta k chodítku a úhradě

Připraveno 6. 11. 2026. **GitHub merge neznamená WordPress deploy.**

## Změna viditelná návštěvníkovi
- [PR #679](https://github.com/Rastty/zaprazi-2/pull/679): bezpečné ovládání a zajištění brzd před rozhodnutím o venkovním rollátoru; v nejistotě odborné posouzení, nikoliv nabídka.
- [PR #680](https://github.com/Rastty/zaprazi-2/pull/680): upozornění před nákupem z vlastních peněz, že jej VZP zpětně neproplatí ani s následným doporučením lékaře; [oficiální zdroj VZP](https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka).
- Původní obsahová stránka: `/choditka-pro-seniory/`; žádná nová SEO URL ani obchodní odkaz.

## Atomický release
- 100 souborů manifestu má `ZP_RELEASE_0_8_197`.
- `style.css` a `functions.php` mají verzi `0.8.197`.
- Mobility engine a product-fit gate mají nové přesné Git SHA v `functions.php`; bathroom kritické SHA zůstávají nezměněné.
- `tests/release-integrity-manifest.test.js` ověřuje konzistenci 100 markerů, verze a čtyř kritických hashů.
- Produktová doporučení, fit gate, affiliate pořadí a privacy pravidla se funkčně nemění.

## Povinné vydávací brány
1. Zelené PR CI a hlavní CI, pak synchronizace `dev` přesným fast-forwardem na `main`.
2. Správce WordPressu provede **Deployer for Git → dev → Pull + Deploy**.
3. Poté ověřit `https://zaprazi.cz/` release `0.8.197`, integritu `ok`, `/wp-json/zaprazi/v1/affiliate-readiness`, a kompletní `Production Advisor Browser QA` všech 14 poradců.
4. V Chrome přímo na `/choditka-pro-seniory/` zkontrolovat novou kartičku venkovního rollátoru a upozornění VZP ve větvi Pojišťovna, včetně bezpečných odkazů.
5. `config/growth-state.json.nodes.safety_qa.verifiedRelease` nechat `0.8.196` až do úspěšné úplné produkční akceptace `0.8.197`.

Žádný samotný GitHub release nedokazuje novou návštěvnost, objednávku ani schválenou provizi.
