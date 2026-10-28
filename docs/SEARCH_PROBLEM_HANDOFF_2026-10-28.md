# Vyhledávání: problém → praktický návod → poradce

**Datum:** 28. 10. 2026  
**Rozsah:** pouze `src/seo/search-guidance.php`, `search.php` a regresní testy. Nejde o změnu produktového enginu ani vydání nové verze tématu.

## Proč
Návštěvník může problém popsat jazykem rodiny, nikoliv názvem pomůcky: „maminka nechce chodítko“, „senior odmítá koupání“, „senior málo pije“ nebo „babička sama doma“. Dřívější interní hledání tyto dotazy směrovalo do obecnější kategorie nebo nemělo praktické doporučení.

## Chování
- Pořadí je **bezpečný praktický návod → další kontrolní krok → stávající specializovaný poradce / domácí audit**.
- První statický bezpečný odkaz je zvýrazněn jako hlavní CTA; ostatní odkazy zůstávají vedle něj v kartách.
- Dotazy na konkrétní produkt nebo technické téma nepřevádíme na domnělé zdravotní problémy.
- Nákup, konkrétní výrobek a affiliate odkaz jsou mimo tuto vrstvu; produktový fit-gate se nijak neobchází.
- Vyhledávací řetězec se nikdy nekopíruje do cílové URL, analytiky nebo identifikátoru.

## Testy
`php tests/search-guidance.php` v CI pokrývá nové pozitivní a negativní dotazy; `npm test` kontroluje existenci cílových HTML anchorů a první akci. Produkční read-only kontrola má nadále vyžadovat skutečný deploy na web, ne pouze merge.

## Co měřit
Uživatel: hledání → kliknutí na doporučený návod → začátek poradce → dokončení → ověřené další řešení. Zpočátku nevyvozovat konverzi z počtu PR, z affiliate slotů ani z pouhé indexace.
