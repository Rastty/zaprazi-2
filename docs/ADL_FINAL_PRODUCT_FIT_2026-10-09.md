# Soběstačnost — závěrečné ověření pomůcky před nákupem (9. 10. 2026)

## Zjištění

Původní poradce `/sobestacnost/` vybíral přesně pojmenované produkty UpCup, Beat It, Theomatik a MVS Open-It, ale současně vypisoval kroky `Co ještě ověřit`, které nebyly v nákupní větvi explicitně potvrzené. Obchodní odkaz se přesto objevil. Tím vznikal rozdíl mezi *předběžným typovým výběrem* a *skutečně ověřeným použitím*.

Tento audit se neopírá o tvrzení o zdravotní vhodnosti a nezpracovává diagnózu. Produkty, obchodníci ani pořadí kandidátů se nemění.

## Úprava

1. Engine přijímá nový volitelný `productFit` (`yes/no/unknown`), jehož neplatná hodnota vrací `invalid_input`.
2. Čtyři pozitivní větve (UpCup; Beat It po stabilní ploše; Theomatik po potvrzení používání jednou rukou; Open-It) vrátí **kandidáta bez nákupního odkazu**, dokud není `productFit=yes`. Pro `unknown/no` engine vrací `needs_fit_check` a srozumitelný další krok.
3. Jen v těchto čtyřech připravených větvích se objeví doplňující otázka se **jménem přesného modelu a původním seznamem věcí k ověření**. Nenabízí se předčasně při neurčené pracovní ploše / nepotvrzené obsluze jednou rukou ani při profesionálním posouzení polykání.
4. Při změně jakékoli předchozí odpovědi se starý výsledek, nákupní CTA a potvrzení `productFit` ihned odstraní. Při změně výhradně `productFit` se přepočítá stav, bez opakovaného výběru jiného výrobku.
5. Odpovědi zůstávají v dočasné paměti prohlížeče; nejsou v URL, analytice ani affiliate parametrech. Neověřená evidence poskytující cestu k obchodníkovi nesmí otevřít obchodní odkaz.
6. Úspěšné unit/DOM kontraktové testy a po deployi produkční mobilní Chrome QA s kontrolou všech čtyř větví.

## Hranice ověření

Kladná odpověď je **praktické potvrzení návštěvníka**, ne certifikované posouzení odborníkem, způsobilost k použití ani garance bezpečného výsledku. Před samotným použitím je nutné přečíst návod a dodržet pokyny výrobce.

## Akceptace

- Neznámý/nevyhovující `productFit` → žádný nákupní odkaz ani obejití přes produktovou evidenci.
- Čtyři správné shody + výslovná kontrola → konkrétní nabídka dle existující affiliate mapy.
- Ostatní/nejasné a zdravotní vstupy nesmějí vyrobit komerční kandidát.
- Změna úkolu/činnosti nebo předpokladů → žádné staré potvrzení, žádné staré CTA.
- První interaktivní ověření po deployi nové verze; automatické předdeployové CI samo nenahrazuje real-world posouzení.
