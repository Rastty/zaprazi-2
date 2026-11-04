# Zápraží 0.8.195 — volitelná analytika mimo kritickou hlavičku

## Ověřený problém

Ve zdrojovém vydání `0.8.194` načítá `functions.php` skript `assets/js/analytics-consent.js` jako pátý parametr `wp_enqueue_script(..., false)`. WordPress ho proto plánuje do `wp_head()`, přestože jde pouze o volitelné UI měření a nikoli podmínku vykreslení stránky či spuštění poradců. Tím vzniká riziko blokování parseru při úvodním vykreslení HTML napříč stránkami.

Význam parametru `in_footer` a pořadí konfigurace `wp_add_inline_script(..., 'before')` potvrzuje dokumentace WordPress Core:

- https://developer.wordpress.org/reference/functions/wp_enqueue_script/
- https://developer.wordpress.org/reference/functions/wp_add_inline_script/

**Hypotéza (nikoli změřený závěr):** přesun nekritického skriptu po HTML zmenší kritickou závislost prvního vykreslení na stažení tohoto skriptu, zejména v pomalejší mobilní síti. Neznáme změřený FCP, LCP, TBT ani reálný rozdíl rychlosti. Real user data, Search Console a Google Analytics jsou v Growth Graphu stále UNKNOWN; nemění se jejich hodnoty na základě této úpravy.

## Jediný produkční zásah

`functions.php`: u jediné registrace `zaprazi-analytics-consent` se pátý parametr mění z `false` na `true`, ostatní registrace a obsah skriptu zůstávají beze změny. Inline konfigurace zůstává před odpovídajícím skriptem.

`footer.php` už vykresluje celé nastavení souhlasu a tlačítka `Povolit měření`, `Bez měření` a `Nastavení měření` **před** `wp_footer()`. `assets/js/analytics-consent.js` obsluhuje jak `DOMContentLoaded`, tak DOM již připravený, proto nepotřebuje běžet při parsování hlavičky.

Uvolnění `0.8.195` koordinuje označení verze v 100 souborech manifestu, `functions.php`, `style.css` a kritické git blob SHA zámky. Samotná změna funkčnosti je pouze pořadí načtení analytického adaptéru.

## Bezpečnost a měření

- **Nezměněno:** žádné odpovědi poradců se neposílají do analytiky; žádné přidání event parametrů, uživatelských identifikátorů, affiliate tracking nebo změna URL. Skript stále kontroluje výslovný souhlas a při `denied` GA4 nenačítá.
- **Kontroly v Node testech:** zdrojové umístění skriptu, `wp_add_inline_script(..., 'before')`, umístění souhlasových tlačítek před `wp_footer()`, dvě cesty inicializace DOM, žádná tvrdá závislost poradce na GA4, release-scope.
- **Příprava vydání:** GitHub Actions branch-only test full `968/968 PASS`, PHP syntaxe úspěšná. Dočasný write-capable přípravný workflow a skript nejsou součástí finálního PR.
- **Povinné ověření po nasazení:** `scripts/audit-live-consent-footer-195.mjs` v produkčním Chrome QA provede skutečnou mobilní navigaci do poradce. Kontroluje viditelné tlačítko odmítnutí, opětovné otevření nastavení, pořadí konfiguračního a externího skriptu **uvnitř body**, nulové pokusy o GA4 při odmítnutí a to, že existující poradce po navigaci funguje. Není povoleno vyplňovat formuláře, klikat na obchodníky ani posílat POST/health answers.
- **Bezpečnostní stav:** původní produkční `0.8.194` je zelená (https://github.com/Rastty/zaprazi-2/actions/runs/41836928679). Dokud **všechny** postdeploy joby nové verze `0.8.195` neprojdou, `config/growth-state.json` **nesmí** přejít na `safety_qa.verifiedRelease=0.8.195`.

## Následující vyhodnocení

Po úspěšném nasazení porovnat mobilní výkon stejných URL a srovnatelných podmínek (Lighthouse/Chrome UX Report; pokud data dostupná) před/po; zvlášť sledovat reálné načítání souboru `analytics-consent.js` a přítomnost blokujících prvků. Zaměňovat přesun skriptu za jistý SEO uplift nebo příjem z affiliate by bylo nepodložené. Další redakční či marketingová optimalizace se má odvozovat z reálných GSC dotazů, nikoli jen z počtu článků.

**User deployment:** pokud bude vydání sloučeno a `main=dev`, je potřeba standardní **Deployer for Git → dev → Pull + Deploy**. Pouhé sloučení PR není publikace. Před publikací nesmazat ověřené safety QA stávajícího release.
