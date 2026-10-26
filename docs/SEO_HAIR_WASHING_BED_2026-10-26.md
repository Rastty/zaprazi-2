# Zápraží — SEO problémový průvodce: mytí vlasů na lůžku

Datum výzkumu: 26. 10. 2026.
Stav: předpublikační staging ve větvi seo/hair-washing-bed-guide-20261026, nikoli potvrzené nasazení.
Cílová URL: /myti-vlasu-na-luzku/

## Proč toto téma

Repozitář již má hotové průvodce /vstavani-z-kresla-pro-seniora/ a /schody-pro-seniora-doma/. PR #431 navíc připravil antidekubitní matraci. Žádný z těchto obsahů neduplikovat.

Hlavní uživatelská otázka: jak bezpečně umýt vlasy člověku na lůžku bez přemístění do koupelny? Nová URL není náhrada individuálního ošetřovatelského protokolu.

## Keyword hypotézy (bez vymyšlených metrik)

- mytí vlasů na lůžku
- jak umýt vlasy ležícímu člověku
- nafukovací umyvadlo na mytí vlasů
- mytí hlavy seniorovi na posteli
- bezoplachová čepice na mytí vlasů
- jak umýt hlavu bez sprchy / bez mokré postele

Skutečné GSC URL×query imprese, objemy vyhledávání, KD a konverze nejsou ověřené. Žádné sliby první pozice ani výdělku.

## Kvalitativní SERP zjištění

- Opora Diakonie popisuje mytí na lůžku, nafukovací vaničku a bezoplachovou čepici.
- Nartis.cz již má aktuální praktický konkurenční článek: https://www.nartis.cz/blog/myti-vlasu-na-luzku-nafukovaci-umyvadlo/ . Nemůžeme tedy tvrdit, že je téma neobsazené.
- Pomuckyseniorum.cz má konkrétní produkt, ale jeho měnící se cena/sklad ani individuální vhodnost se neodvozují: https://www.pomuckyseniorum.cz/nafukovaci-umyvadlo-na-myti-vlasu-s-prenosnou-sprchou/

Odlišení Zápraží: čtyři bezpečnostní situace, čtyři varianty potřeby, srovnání tří řešení, sedm kroků, sedm kontrol, šest FAQ a navázání na stávající poradce. Nikoli obecný seznam pomůcek.

## Zdroje, kontrola 26. 10. 2026

1. https://oporadiakonie.cz/media/2025/04/Osetrovatelska_prirucka-2024.pdf
2. https://www.nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/how-to-help-someone-you-care-for-keep-clean/
3. https://www.nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/how-to-move-lift-and-handle-someone-else/
4. https://dementiaconnect.alzheimers.org.uk/get-support/living-with-dementia/washing-bathing-showering-tips

Bez klinické externí revize se text neprezentuje jako individuální zdravotní rada. Bez ověření konkrétní pomůcky a správného affiliate deeplinku nezveřejňovat produktový prodejní odkaz.

## WordPress a QA kontrakt

- Šablona page-myti-vlasu-na-luzku.php používá již nasazený vizuální systém.
- functions.php vytvoří WordPress stránku jen když slug neexistuje. Žádný přepis historických příspěvků.
- Jedinečný title a Yoast meta description. Bez Yoast jediný fallback description.
- Tři inbound odkazy: návrat z nemocnice, koupelna, polohovací postel.
- URL je staged v sitemap testu, nikoliv vyžadována před nasazením (nevyvolá falešný 404 gate).
- Protected runtime soubor je v úplném seznamu i testech.
- Při vydání musí být aktualizována verze v CSS, PHP i všech runtime markerech současně; tento staging je stále 0.8.167.
- Po merge a kompletním release provést Pull + Deploy dev větve, poté HTTP 200, 1 H1, SEO title, meta, HTTPS canonical, noindex, sitemap, dostupnost všech kotev, inbound odkazy, 14/14 poradců a integrita ok.
- GSC výsledky hodnotit až po 28/56 dnech; chybějící záznam neprohlašovat za nula návštěv.

## Další neduplicitní témata

1. Oblékání ponožek a kalhot bez ohýbání — ověřit kontraindikace a dotazy.
2. Hygiena ležícího seniora — širší odborně revidovaný klastr, interně propojit s mytím vlasů.
3. Nastupování seniora do auta — jiný intent než invalidní vozík do kufru, bezpečný přesun.
4. Senior sám doma a SOS tlačítko — pouze ověřené služby, limity signálu a použití.
5. Přesun z postele na vozík — vysoké riziko, potřebné odborné posouzení; nevydávat DIY zvedání.

Nezveřejňovat mechanicky; další pořadí podle skutečných vyhledávacích dat a SERP kvality.
