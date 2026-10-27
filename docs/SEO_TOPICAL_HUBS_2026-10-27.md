# Zápraží — SEO interní propojování, wave 0.8.176
27. 10. 2026

## Problém
Série nových a produkčně ověřených redakčních článků byla dostupná z homepage a specializované oblasti, ale širší obsahové rozcestníky (Návrat z nemocnice, Bezpečný byt, Kompenzační pomůcky) neměly dostatečné kontextové cesty k problémům rodin. Současně read-only průběžné audity procházely hlavně původní coreDecisionPaths a nejnovější ověřené stránky do nich nebyly přidány.

## Řešení
Tři relevantní tematické huby získají sekce s praktickými situacemi a přirozeným textovým odkazem na odpovídající část článku, žádný produktový tlak. Navazující témata: senior odmítá chodítko, odmítá koupání, málo pije; v navratu a přehledu také SOS pro seniora, který žije sám. Nové cesty posílí uživatelskou dohledatelnost a souvislosti obsahu, nikoli garantované pořadí Googlu.

Trvalé read-only SEO/link audity zahrnou čtyři již živě ověřené stránky: SOS, odmítání chodítka, odmítání koupání, nízký příjem tekutin. Do seznamu se nesmějí automaticky dostat nenapublikované staged stránky. Kontroly zůstanou čistě GET/DOM, žádné externí požadavky s osobními daty.

## Validace
Node test kontroluje relevanci, úplnost a nulové affiliate CTA; core static QA ověřuje reálné anchory a souborové cesty, živé browser audity indexability a interní cíle. Po úspěšném PR vydat atomický 0.8.176 integrity release a po WP deployment nový read-only acceptance. Organická hledanost je neověřená bez GSC dat.
