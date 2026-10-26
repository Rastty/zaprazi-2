# Zápraží release 0.8.171 — nastupování seniora do auta

Připraveno 26.10.2026. Vychází z SEO PR #439. Nový samostatný poradce:
`/nastupovani-seniora-do-auta/`.

## Co přináší
- Čtyři rizikové situace, čtyři typy praktické překážky: bezpečné dosednutí; otočení; převedení nohou přes práh; bezpečný úchop.
- Srovnání otočného podsedáku, přenosného madla, pomůcky pro vedení nohy a upravené/asistované dopravy.
- Sedm kroků a sedm měření/kontrol, šest FAQ, odborné zdroje RCOT, RiDC, NHS a BESIP.
- Čtyři inbound cesty z témat návrat z nemocnice, otázek při propuštění, vstávání z křesla a invalidní vozík do kufru.
- Nepodceňovat individuální pooperační pokyny a zajištění sedícího během jízdy. Volný kluzný povrch nenechávat při jízdě.
- Bez neověřených merchant produktů, cen a úhrad. Affiliate pořadí a runtime engine beze změny. Žádné zdravotní údaje se neukládají.

## Release integrity
92 ze 92 chráněných runtime souborů obsahuje `ZP_RELEASE_0_8_171`.
`functions.php` deklaruje `ZAPRAZI_RELEASE=0.8.171`, `style.css` deklaruje `Version: 0.8.171`.
Vytváření WordPress stránky pouze pokud slug neexistuje; historický obsah se nepřepisuje.

Release je kumulativní: zahrnuje i obsah 0.8.170, tj. průvodce hygienou na lůžku. Jestli 0.8.170 nikdy nebylo skutečně nasazeno, nový release musí projít také validací předchozí hygienické stránky.

## Acceptance
- Na PR: GitHub CI, PHP lint, ochrana historického obsahu 5448 a Production Advisor Browser QA.
- Po sloučení: `main=dev`, správce WordPressu provede Deployer for Git → Pull → Deploy pro `dev`.
- Po nasazení: `node scripts/audit-live-car-access-171.mjs` ověří exact release/integrity, 25 konfigurovaných slotů (ne objednávky), H1/meta/canonical, počet karet, 7+7, FAQ, 4 inbound a obě nové URL v sitemapě.
- Úspěch produkčního auditu znamená funkční web, nikoliv Google indexaci či organickou návštěvnost. Hledanost/KD/GSC kliky neznáme bez potvrzených dat.

## Rizika
Nevydávat při partial integrity, chybách CI/legacy testu, rozbitých interních odkazech nebo safety gate.
Slíbené „nejlepší“ pomůcky ani individuální medicínská vhodnost nejsou součástí release.