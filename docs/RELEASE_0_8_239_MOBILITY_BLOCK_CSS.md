# Zápraží 0.8.239 — menší blokující CSS na prvních sedmi vstupních stránkách Mobility

## Přednasazovací důkaz (20. 11. 2026)

Přímo na veřejném release **0.8.238** vrací homepage a šest níže uvedených stránek HTTP 200. Každá načítá render-blocking `wp-block-library-css`, přestože jejich živé HTML neobsahuje `class="wp-block-…"` a kontrola šablon nepotvrdila volání `the_content()`, `do_blocks()` ani `render_block()`.

Jedna stejná instalační kopie souboru `https://zaprazi.cz/wp-includes/css/dist/block-library/style.min.css?ver=6.5.15` měla při kontrole `Content-Length: 113381` bajtů a u `curl --compressed` síťový přenos přibližně **14 991 bajtů**. Nejde o naměřenou úsporu LCP/INP, nýbrž o velikost nepotřebného stylesheetu na uvedených stránkách. Soubor se do té doby přenášel na každý první nenacachovaný přístup; při cache hitu nelze tvrdit stejnou přenosovou úsporu.

## Přesný zásah

`functions.php`: Po obvyklém WordPress enqueue (priority 1000) odebrat **pouze** handle `wp-block-library`, a to na:

1. homepage `/` — přímá šablona `front-page.php`;
2. `/choditka-pro-seniory/`;
3. `/choditko-do-bytu-pro-seniory/`;
4. `/rollator-pro-seniory/`;
5. `/co-zmerit-pred-vyberem-choditka/`;
6. `/choditko-na-pojistovnu/`;
7. `/pujceni-choditka/`.

U šesti stránek musí WordPress stále hlásit přesně očekávanou přiřazenou PHP šablonu. Pokud správce přepne stránku na běžný editor, není to bezpečný případ a CSS se **nesmí odstranit**. Stejně tak se nic neodstraňuje z jiných stránek, historického článku, archivů, WordPress adminu, náhledů a feedů. Žádný zásah do `style.css` pravidel, doporučovacího engine, fit-gates, produktů, affiliate URL, SÚKL, analytiky nebo SEO metadat.

Verzování: `scripts/prepare-theme-release.mjs` vytvořil **0.8.239** s přesně 100 runtime markery, aktualizací PHP release verze a přepočtem pěti Git blob hash pinů. Tento mechanický diff sám není změnou obsahu stránek.

## QA a přijetí

- `tests/mobility-block-css-239.test.js` a `.php`: přesné template pinování, frontend/příspěvky/náhledy a zachování core block stylesheetu na jiných stránkách.
- Kompletní GitHub CI, zelené source integrity a přednasazovací live QA na **0.8.238**, PR merge jen při čistém expected-head stavu.
- Přednasazovací read-only kontrola aktuálního **0.8.238**: homepage → Mobility CTA **PASS** a přesné produkční affiliate konfigurace **25/25** (21 CJ + 4 eHub). Při kontrole před vydáním byl explicitně použit očekávaný *živý* predecessor 0.8.238; kontrola zdrojové verze 0.8.239 proti ještě nenasazenému WordPressu by správně hlásila nesoulad a nesmí být interpretována jako chyba affiliate routingu.
- **WordPress Pull + Deploy z `dev` je zvláštní krok vlastníka.** Po něm: `zaprazi-release=0.8.239`, `zaprazi-integrity=ok`, 25/25 affiliate slotů, 7× HTML bez `wp-block-library-css`, jedna kontrolní ne-Mobility URL se zachovaným CSS, desktop/mobile a keyboard/axe kompletní Advisor QA.
- Naměřit srovnatelný Lighthouse mobilní profil *před a po* na stejné sadě URL bez tvrzení zlepšení z pouhé nepřítomnosti stylesheetu. Pokles LCP je hypotéza, nikoli předem daný výsledek.
- Pokud WordPress začne renderovat na některé cílové stránce Gutenberg nebo plugin přidá závislost na block library, vrátit selective dequeue na předchozí 0.8.238 / source-bound změnu, ne potichu upravit obsah.

**Stav tohoto dokumentu:** implementace a testovací plán; žádné potvrzení nového produkčního release až do samostatného WP Deploy a readbacku.
