# Zápraží 0.8.157 — Rollátor se sedátkem: růst bez kanibalizace

**Datum:** 25. 10. 2026. Cíl: zvýšit relevanci existující /rollator-pro-seniory/ k konkrétnímu nákupnímu dotazu „chodítko/rollátor se sedátkem“, dokončit cestu k bezpečně vhodnému produktu a způsobu pořízení.

## Důkaz a nejistoty
- Ve veřejném českém SERPu jsou pro rollátor/chodítko se sedátkem současně výrobci a poradenské články (např. MEYRA, Penzista, seniorinfo, Helpmedikal); nevyvozujeme objem hledání, pozici Zápraží ani slabou konkurenci.
- **GSC property Zápraží:** ověřená ve WordPressu, ale aktuální číselný export URL×query pro 28/90 dní není přístupný. Žádné domyšlené nuly, konverze nebo odhady hledanosti.
- Existující /rollator-pro-seniory/ se samostatným bezpečnostním poradcem a ověřenou položkou MEYRA Ideal 3061982 je přirozený kanonický cíl. **Nevytvářet novou URL** „chodítko se sedátkem“, která by kanibalizovala tu starou.
- Výrobce MEYRA (https://www.meyra.cz/ctyrkolove-choditko-rollator.html), kontrola 25. 10. 2026, uvádí šířku zařízení 61,5 cm, šířku sedu 42 cm, výšku sedátka 61 cm, nastavitelné madla 79–97 cm a nosnost 130 kg. Rozměry nejsou individuálním posouzením bezpečné výšky sedu.

## Konkrétní změna
1. Přidat na existující URL jednu situaci specifickou pro hledající sedátko: možnost přestávek, riziko používat jej jako vozík, neschopnost používat brzdný mechanismus.
2. Před produktovým blokem explicitně poslat člověka do /rollator-pro-seniory/#poradce-rollator, změřit parametry a případně zjistit předběžný rozpočet v existujícím kalkulátoru /pujceni-choditka/#rozpocet-pujceni-choditka.
3. Doplnit technická fakta pro sedátko podložená výrobcem, ale nepředpokládat, že uživatel podle čísel automaticky bezpečně usedne.
4. SEO title / description nově reflektují nákupní long-tail „rollátor se sedátkem“, bez změny URL nebo kanonické adresy.
5. Interní vyhledávání pro „choditko se sedatkem“ vede nejdřív na tuto praktickou sekci, ne na obecný katalog. Zůstávají původní výsledky archivních článků, žádné odpovědi z poradců nejdou do URL/GA.
6. Sdílený motor, produktové fit-gates, ověřené affiliate linky i pojišťovna zůstávají nedotčeny. Žádné nové výrobky nebo placené umístění.

## Akceptace
- CI a PHP testy musí pokrýt hledání „rollator se sedatkem“, cestu k poradci a půjčení, negativní kontrolu „sedatko do vany“.
- Rollator H1 zůstává jediný, kanonická URL beze změny, no merchant bypass, existující bezpečné `handBrakes` otázky zachovány.
- Po GitHub merge provést WordPress Pull + Deploy 0.8.157 a ověřit live release/integrity, jeden H1, unikátní title/description, existující a nové kotvy, CTA a mobilní vzhled.
- Za 14/28 dní porovnat skutečné dotazy/CTR v GSC, jen pokud budou data. Měřit anonymní start/completion poradců a schválené provize, nikoli jen konfiguraci 25 pozic.

**Komunikace:** technická optimalizace může zlepšit relevanci a užitečnost, ale není zárukou indexace nebo prodeje.
