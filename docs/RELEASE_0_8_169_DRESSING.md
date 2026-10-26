# Zápraží 0.8.169 — nové bezpečné oblékání bez předklonu

Datum: 26.10.2026. Rozsah: SEO průvodce `/oblekani-ponozek-a-kalhot-bez-ohybani/` ze schváleného PR #435.

Vydání obsahuje 90/90 chráněných tématových souborů s markerem `ZP_RELEASE_0_8_169`. `functions.php` constant a `style.css` Version jsou sjednoceny na 0.8.169. Auto-publication provede pouze insert pro dosud neexistující slug, ostatní stránky ani historický WordPress obsah nepřepisuje.

Čtyři obsahové inbound vstupy: /sobestacnost/, /obuv-pro-seniory/, /navrat-z-nemocnice/, /otazky-pred-propustenim-z-nemocnice/. Bez produktového/merchant bypassu, bez neověřených cen, úhrad či zdravotních údajů. Čtyři typy pomoci a jejich bezpečnostní limity, 4/5 praktických kroků, sedm kontrol a šest FAQ.

Gate: před mergem GitHub CI, PHP lint, exact runtime marker integrity, ochrana stávajících 14 poradců. Po mergi srovnat main=dev. Ve WordPressu správce spustí Pull + Deploy (repo merge není produkční deploy). Po nasazení spustit `node scripts/audit-live-dressing-169.mjs` a Production Advisor Browser QA. Sledovat 28/56 dní GSC impresní/click údaje; starší obsah nemazat bez dat.

V případě partial release, neúspěšného kroku v audit-live nebo chyby v nákupní bezpečnosti další release zastavit; produktové shortlisty/affiliate sloty jsou beze změny. Zaručené SEO pozice a affiliate objednávky nejsou doloženy.