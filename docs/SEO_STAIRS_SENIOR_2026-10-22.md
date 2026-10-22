# Zápraží 0.8.149 — senior nezvládá schody doma

**22. 10. 2026 — SEO problem-page / resource.** Cílová URL: \`/schody-pro-seniora-doma/\`.

## Důvod / důkaz
- Přímá kontrola WordPressu \`/wp/v2/pages?slug=schody-pro-seniora-doma\`: žádná existující page.
- Existující \`/bezpecny-byt-pro-seniora/\` řeší vstup v jednom obecném bloku, nikoli specifickou orientaci mezi schody, odborně instalovaným řešením a příspěvkem.
- Český SERP obsahuje primárně obchodníky schodišťových sedaček/schodolezů a obecný domácí audit; konkrétní rozlišení **co udělat bez koupě → co měřit → jaký způsob přístupu → úřad místo pojišťovny** je využitelná hodnotová hypotéza, nikoliv doložená mezera v počtech dotazů nebo predikce rankingu.
- GSC impresní/kliková data pro Zápraží nejsou v repo doložena. Poptávka a konverze: **UNKNOWN**.

## Proč nová URL
Jiný hlavní dotaz než „jak upravit celý byt“, „projede vozík dveřmi“ nebo „co připravit první noc po propuštění“. Nezavádí nového poradce ani spekulativní produktový engine. Pomáhá lidem vybrat další bezpečný krok a teprve potom odbornou technickou konzultaci. Vstupy z bezpečného bytu a z otázek před propuštěním; cesta zpět do příbuzných poradců. Deterministický pomocný search-link pro \`schody\`, \`schodolez\` bez uložení vyhledávacího dotazu.

## Ověřené primární autority
- MPSV: https://mpsv.gov.cz/prispevek-na-zvlastni-pomucku (příspěvek na zvláštní pomůcku / žádost)
- IPZS: https://www.ipzs.gov.cz/pomucka-kdy-mohu-ziskat (podmínky individuálního posouzení)
- MMR: https://mmr.gov.cz/cs/ministerstvo/stavebni-pravo/informace-a-aktuality/stavebni-rad/informace-z-oblasti-bezbarieroveho-uzivani-sta-%281%29/vyuziti-schodolezu (schodolez není univerzální bezbariérová úprava)
Přístup a obsahy zkontrolovány 22. 10. 2026. Stránka obsahuje faktové limity, neobsahuje částky příspěvků, právní nárok ani smyšlené parametry konkrétních zařízení.

## WordPress release + bezpečnost
Nová \`page-schody-pro-seniora-doma.php\` s šablonou a 7 krokovým checklistem, externími zdroji a oddělenými variantami. Jednorázová publikace při \`init\` jen při neexistujícím slugu; záměrně nesahá na historické URL ani cizí stránky. \`style.css\` + \`functions.php\` + protected markers 0.8.149; nová stránka přidána do inventáře integrity, takže po nasazení bude chráněno 75 souborů. Bez ukládání dat, bez merchant odkazu, bez přímého nákupu nebo individuálního zdravotního závěru.

## Po deployi
1. Živá \`release:0.8.149\`, \`integrity:ok\`, 25/25 affiliate slots.
2. HTTP 200 na \`/schody-pro-seniora-doma/\`, jediná H1, SEO title/description, self-canonical a index/follow, link v sitemapě.
3. Uživatel se z \`/bezpecny-byt-pro-seniora/\` a \`/otazky-pred-propustenim-z-nemocnice/\` dostane na stránku; fungují interní odkazy a 7 bodů.
4. Testem 14/14 poradců potvrdit, že není žádný obchodní bypass.
5. GSC 28/90 dní: sledovat zobrazení a dotazy \`senior schody\`, \`schodišťová sedačka příspěvek\`; jejich objemy nejsou predikce ani měřená data. Žádné plošné zásahy do 4 360 historických příspěvků.
