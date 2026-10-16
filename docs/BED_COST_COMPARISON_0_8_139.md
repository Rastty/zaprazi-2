# Zápraží 0.8.139 — půjčení vs nákup polohovací postele

16. 10. 2026 · Obsahová a produktová úprava existující URL, žádná nová indexační stránka.

## Proč
Web řeší rozdíl koupit/půjčit/pojišťovna, ale návštěvník nedokáže porovnat dvě nabídky, které reálně dostane od půjčovny a e-shopu. V českých SERP tuto otázku pokrývají půjčovny a redakční články (např. Invira, Repom, Symetrie). Skutečná hledanost a současný GSC výkon Zápraží zatím nejsou dostupné; nejsou předpokládány.

## Co přesně obsahuje
- Existující `/polohovaci-postel-na-pojistovnu/#porovnani-pujceni-postele`, přímá kotva z poradenské stránky.
- Volitelný kalkulátor se čtyřmi lokálními číselnými hodnotami: měsíce, cena půjčení měsíčně, nevratné vedlejší náklady půjčení a úplná cena koupě včetně nezbytných služeb.
- Návštěvník vkládá **své ověřené nabídky**, nula vymyšlených či automaticky garantovaných cen.
- Srovnání počítá `půjčení = měsíce × měsíční sazba + nevratné jednorázové náklady`, proti úplnému nákupu. Při neplatných číslech fail closed.
- Žádný odesílaný formulář, API, cookies, osobní/zdravotní data, analytika ani cena v URL. No-JS fallback obsahuje ruční vzorec.

## Hranice
Čistě finanční srovnání. Neřeší vhodnost lůžka, úhradu, možné budoucí servisní výdaje, zůstatkovou hodnotu, vratnou kauci (cash-flow, ne konečný náklad) nebo změny cen. Před nákupem či půjčením je nutné ověřit nosnost, transport, matraci, zábrany, přesuny a konkrétního dodavatele. Úhrada pojišťovnou zůstává samostatná cesta.

## QA
`npm test` a release integrita všech 71 chráněných souborů. Po nasazení ověřit produkční 0.8.139 integrity OK + 25/25 + 14 poradců, kalkulátor myší i klávesnicí, validaci a dostupnost odkazů; žádné osobní údaje nikam neodchází. Statický SEO audit všech 27 hlavních URL. Nevyvozovat pozice Google ani konverzní efekt bez měření.
