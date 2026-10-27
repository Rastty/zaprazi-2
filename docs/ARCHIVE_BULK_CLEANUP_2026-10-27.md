# Produkční čistka Zápraží – 27. 10. 2026

## Provedeno
Z rozhodnutí vlastníka bylo v produkčním WordPressu hromadně přesunuto **4 359 publikovaných historických příspěvků do koše** pomocí WordPress API prostřednictvím WP-CLI `post delete` **bez `--force`**. Žádné mazání databázových řádků SQL, žádné přesměrování na nerelevantní obsah. Zásah se netýkal `page` ani současných poradců.

První vlna: **4 049** `post` ze čtyř starých kategorií čerpadla/FVE, zařízení, vodárny, ventilátory. Zachován relevantní článek ID 3638 o bezpečném nábytku pro seniory. Druhá vlna: **310** dalších off-topic `post` o retenčních nádržích, nábytku ordinací, obecném úklidu, stavebnictví, zahradě a nesouvisejících tipech. Všechny jednotlivé WordPress operace potvrdily `trashed`.

**Po operaci ověřeno SQL z aktuálního WP:** 1 publikovaný `post` (ID 3638), 53 publikovaných `page`, 4 360 postů v koši (původně 1, nově 4 359), žádný další publikovaný historický příspěvek. 25/25 affiliate slotů a aktivní release 0.8.177 byly před zásahem normální; jejich veřejné ověření řeší přiložený read-only QA.

## Původní seznamy a obnova
- `data/archive-offtopic-trash-20261027-part-01.json` až `part-03.json`: přesné ID, původní slug, title, post status a původní Yoast noindex – 4 049 článků.
- `data/archive-residual-311-review-20261027.json`: druhá vlna 310 a jediný zachovaný článek ID 3638.
- WordPress koš dovoluje obnovu; při trvalém automatickém vyprázdnění koše toto přestane platit. Seznamy **neobsahují úplný původní HTML obsah**, takže pro dlouhodobou zálohu by bylo potřeba vytvořit databázový backup.

## Omezení
Search Console pro zaprazi.cz neposkytla ověřený stav indexace po jednotlivých URL. **Netvrdíme, že všech 4 359 článků nebylo indexováno.** Byly vyřazeny pro prokázaný nesoulad s dnešní misí. Je možná ztráta historické návštěvnosti a zpětných odkazů; dopad lze zjistit teprve z externích dat. Obvyklé 404/410 je u obsahu bez obsahového ekvivalentu správnější než 301 na homepage. Uživatel zvolil rychlost a účinné vyřazení před dílčím noindex canary.

## Zbývající úkol
Smazat z patičky automatickou navigaci na „Starší archiv“, protože obsah už neexistuje; možno provést s následným theme release 0.8.178. Google nemusí dříve indexované URL odstranit okamžitě. Nevyvolávat umělé přesměrování na zdravotnické poradce.
