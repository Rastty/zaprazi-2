# Release 0.8.192 — původ technických údajů BESCO WA17 a WA21

## Doložený důvod
Read-only kontrola reálných produktových stránek [#41633028098](https://github.com/Rastty/zaprazi-2/actions/runs/41633028098) zachytila rozdílné obecné a specifické údaje o hmotnosti. Výrobní návody stejného prodejce potvrzují katalog Zápraží: **WA17 = 2,3 kg**, **WA21 = 2,8 kg**. Obecné pole e-shopu současně uvádí 2,2 a 2,7 kg. Nesprávné by bylo automaticky přepsat ověřené katalogové hodnoty podle obecného pole.

Podklady:
- [Návod BESCO čtyřbodové (PDF)](https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_ctyrbodove.pdf).
- [Návod BESCO dvoukolové (PDF)](https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_dvoukolove.pdf).
- [WA17](https://www.rehabilitacnipomucky.cz/besco-ctyrbodove-choditko-skladaci/) a [WA21](https://www.rehabilitacnipomucky.cz/besco-dvoukolove-choditko-skladaci/) — odlišná obecná vs. specifická hmotnost.
- Kontrola obsahu podkladů: **3. 11. 2026**. Neznamená potvrzení dostupnosti, ceny, objednávky či doporučení konkrétního modelu.

## Změna pro uživatele
Na existující [srovnávací stránce chodítko do bytu](https://zaprazi.cz/choditko-do-bytu-pro-seniory/) je přímo za porovnáním WA17/WA21 srozumitelná poznámka o původu hmotnosti, rozporu v e-shopu a nutnosti ověřit konkrétní provedení před pořízením, pokud rozhoduje manipulace nebo převoz. Jsou dostupné přesné dva zdrojové návody jako bezpečné odkazy. Žádný nový affiliate odkaz, cena, produkt nebo změna rozhodovacího pravidla.

## Integrita a deploy
- Verze: `style.css` + `ZAPRAZI_RELEASE` = **0.8.192**.
- Všech 100 manifestových runtime souborů má `ZP_RELEASE_0_8_192`. Čtyři kritické rozhodovací Git blob identity zůstávají pinned (Mobility engine a offer gate přepočítány po marker update).
- Regresní test `tests/indoor-walker-weight-provenance.test.js` kontroluje zdrojové manuály, přesný obsah a bezpečnost HTML bez affiliate cesty; původní safety/privacy a PHP lint testy musí být zelené.
- Po merge musí být `main=dev`, před deployem `npm run deploy:preflight`.
- **WordPress Pull + Deploy provádí správce**, GitHub merge není živé nasazení.
- Až poté potvrdit veřejnou verzi `0.8.192`, `integrity=ok`, všech 25 affiliate slotů, porovnání na živé stránce, 14/14 Advisor Chrome QA a mobile.
- Dokud web běží na `0.8.191`, PR/CI je pouze přednasazovací kontrola. Změny nemají prokázaný dopad na návštěvnost nebo tržby.
