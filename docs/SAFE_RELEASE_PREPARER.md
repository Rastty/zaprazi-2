# Bezpečná příprava dalšího release Zápraží (lokální helper)

## Proč

Příprava verze 0.8.198 zahrnovala ruční synchronizaci 100 release markerů, CSS/PHP verze a čtyř přesných Git blob pinů. Chyba v jediném souboru blokuje integritu nasazeného WordPressu. Tento helper zkracuje opakované lokální kroky, nemění způsob schvalování ani nasazení.

## Použití

Na čisté samostatné Git větvi release/... vytvořené pro další patch release:

    node scripts/prepare-theme-release.mjs --to 0.8.199

Výchozí režim je výhradně dry run: ověří aktuální verzi, všech 100 souborů v kanonickém PHP manifestu, staré markery a přesné čtyři kritické Git SHA. Vypíše pouze agregovaný plán. Nezapisuje žádný soubor.

Teprve po kontrolovaném načtení a schválení dalších zdrojových změn:

    node scripts/prepare-theme-release.mjs --to 0.8.199 --apply

Režim --apply odmítne main, dev, jinou než release/* větev, nečistý checkout, skok verze, změněný počet nebo obsah manifestu, staré markery a nesoulad kritických Git hashů. Úpravy všech 100 souborů se nejdřív sestaví a ověří v paměti; v případě chyby zápisu se provede pokus vrátit již zapsané soubory.

## Povinné kroky i po --apply

- git diff --check, npm test, lint PHP a kontrola skutečného diffu. Pomocník nevytváří PR.
- PR + úplné zelené CI + explicitní schválení vydání. Nejde o náhradu lidské revize bezpečnostních a produktových změn.
- Ověřený fast-forward main → dev, předepsaný WP Deployer for Git Pull + Deploy a kompletní Production Advisor Browser QA v živém Chromu.
- growth-state.json safety_qa.verifiedRelease aktualizovat jen po doloženém úspěšném testu skutečně nasazené verze.

## Bezpečnostní hranice

- Žádný síťový přístup, API tokeny, WordPress zápisy, Git ref update ani automatický deploy.
- Ověřování hashů chrání přesnou byte-identitu. Samotná správná verze neznamená, že nové produktové či medicínské pravidlo je správné.
- Release 0.8.198 musí nejprve projít produkční akceptací. Tento helper není nové vydání a nemění WordPress runtime. Cílová verze 0.8.199 je pouze příklad pro navazující řízené vydání.
