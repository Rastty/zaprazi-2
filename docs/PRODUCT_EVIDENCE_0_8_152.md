# Zápraží 0.8.152 – zdroje a transparentnost produktů

## Opravená mezera ve výsledku

U poradců pro madlo/oporu WC a přesun přes vanu se ve výsledné produktové kartě zobrazovaly parametry a nákupní nabídka, ale ne původ parametrů a datum posledního ověření, přestože katalog tuto evidenci obsahuje. U partnerské nabídky také chybělo viditelné označení „Partnerský odkaz“ (atribut `rel=sponsored` již existoval).

## Nové chování

- Nový sdílený panel „Odkud máme parametry výrobku?“ ukazuje typ zdroje a **datum kontroly podkladu**, nikoliv tvrzení o aktuální ceně či skladovosti.
- Samostatné odkazy jsou jen na důvěryhodně označené technické a nezávislé dokumenty; produktové stránky prodejců zůstávají jako text. Jediná obchodní cesta je přes původní bezpečnostně zamčený, správně označený CTA.
- U affiliate URL je ve výsledku viditelný štítek „Partnerský odkaz“. Při přímém neaffiliate URL se nepřidává.
- Doporučovací engine, affiliate mapy, produktová data, ceny, úhrady a bezpečnostní fit gate jsou **beze změny**.

## Akceptace

- Node QA: datum a zdroj ve čtyřech odpovídajících produktech, zákaz skryté obchodní navigace, bezpečné externí linky, negativní testy neznámých URL, viditelné označení affiliate, manifest všech kritických souborů.
- GitHub predeploy CI a browser QA na aktuálním live release 0.8.151.
- **Po ručním Pull + Deploy:** ověřit 0.8.152, integrita OK, affiliate 25/25; manuální „Production Advisor Browser QA“ na 0.8.152; na výsledku madla a vany ověřit rozbalovací zdroje a odznak partnerského odkazu.

Nevkládat zdravotní osobní údaje ani nové sledování. Podklady byly naposledy ověřeny podle existujících dat z katalogu, nikoliv dnes.