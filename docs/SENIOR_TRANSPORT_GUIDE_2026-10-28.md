# Nový problémový SEO průvodce: Převoz seniora k lékaři

Kontrola zdrojů: 28. 10. 2026

## Uživatelská potřeba
„Maminka potřebuje na kontrolu, ale neumí bezpečně nastoupit do auta. Jak ji tam dostat a zaplatí to pojišťovna?“
To není dotaz na produkt ani recept. Má jasné varianty řešení a vysoké riziko matoucích rad.

## Implementace
- Nová plnohodnotná stránka `/prevoz-seniora-k-lekari/` se srozumitelným triagem: akutní 155 versus plánovaný transport; čtyři větve podle schopnosti přesunu, role lékaře a možnosti náhrady soukromé dopravy.
- Správný proces pro Příkaz ke zdravotnímu transportu na cestu tam i zpět, výjimky u vozíku, doprovod, možné doplatky a placený transport, plus konkrétní otázky pro ošetřujícího lékaře.
- Praktický seznam osmi kontrol před cestou a šest odpovědí na rodinné FAQ; žádné citlivé odpovědi se neukládají do URL ani do analytiky.
- Odkazy na oficiální primární zdroje NZIP/Ministerstvo zdravotnictví a VZP.
- Automatické, idempotentní založení WordPress stránky přes `init`, pouze není-li stránka již vytvořená; skutečný přechod z dvou existujících relevantních stránek.
- Přidáno jako `stagedDecisionPaths` v sitemap auditu; po nasazení a skutečném sitemap úspěchu lze povýšit do povinných živých stránek.

## QA a limity
Test kontroluje publikaci, interní kotvy, oficiální zdroje, existující návazné kotvy, bezpečnostní upozornění, strukturu a žádné merchant/affiliate směrování. V provozu je stále stejná verze 0.8.183 a 25/25 affiliate konfigurací.

V žádném případě netvrdit, že transport je automaticky hrazený pro každého seniora. Rozhoduje lékař podle aktuálního zdravotního stavu; pravidla se mohou měnit. Článek není klinicky nebo právně nezávisle revidovaný.

## Podklady
- https://www.nzip.cz/clanek/295-zdravotnicka-dopravni-sluzba
- https://www.nzip.cz/clanek/1072-zakladni-informace-k-cerpani-zdravotni-pece
- https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/mam-narok-na-proplaceni-dopravy-k-lekari
- https://www.vzp.cz/poskytovatele/informace-pro-praxi/poradna/preprava-pacienta-vozidlem-zdravotnicke-dopravni-sluzby
