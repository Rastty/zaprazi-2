# Zápraží 2.0 — release 0.8.186: Human UX (DRAFT)

## Změny

- PR #595 + #598: na stránce /pujceni-choditka/ lze spočítat místní orientační násobek vlastní měsíční ceny přímo ověřené půjčovnou. Po 6. 11. 2026 se původní ověřovací ceník zobrazí jen historicky a jeho stará kalkulačka zmizí; nová kalkulačka nikdy nenabízí falešné aktuální ceny a neodesílá údaje.
- PR #596 + #599: /navrat-z-nemocnice/ zobrazuje přehled „Co víme / Co ověřit / Co udělat“ pod všemi kritickými varováními a nad úplným akčním seznamem. Rozhodovací engine, bezpečnost, produkty a affiliate ranking zůstávají beze změny.

## Release integrita

Verze style.css, ZAPRAZI_RELEASE a přesně 100 runtime manifest souborů: 0.8.186. Dvě kritické mobility SHA revidovány pro nové verzi odpovídající soubory; dvě kritické koupelnové SHA zůstávají beze změny.

## Brány

Zůstává DRAFT a není na WordPressu: nejdřív PASS kompletní CI/PHP, produkční kontrola živé 0.8.185 (nesmí být zaměňována za test 0.8.186), schválený merge main, main/dev synchronizace a preflight, teprve pak autorizovaný manuální WordPress Pull + Deploy. Po deployi read-only Chrome QA všech 14 poradců, verzí, integrity, 25/25 affiliate, bezpečnostních a privátních stavů, tiskového plánu a nové lokální kalkulačky. Při selhání STOP/rollback dle docs/NEXT_DEPLOY_SMOKE.md. Bez potvrzených GSC a schválených provizí netvrdíme růst ani příjmy.
