# Zápraží 0.8.151 – konkrétní další krok, když chybí rozměr

## Reprodukovatelný nedostatek
U pěti samostatných poradců pro koupelnu/WC bezpečnostní engine správně zablokoval doporučení při chybějícím rozměrovém nebo nosnostním ověření, ale výsledek nedal praktický odkaz na existující měřicí návod. Návštěvník musel návod hledat jinde.

## Změna
Pro stav `needs_more_info` u relevantních kontrol `loadFit`, `toiletFit`, `feetFlatAtRaisedHeight`, `spaceFit`, `supportFrameFit`, `bathFit` a `bathBenchFit` zobrazí výsledek přímý odkaz na `/co-zmerit-v-koupelne-pred-vyberem-pomucky/` do příslušné části: WC, sprcha nebo vana. Odkazy nejsou personalizované a neobsahují žádné odpovědi.

Při `professional_check`, `candidate`, nejasném bezpečném přesunu či nestabilní podlaze odkaz netvoří alternativu k odbornému posouzení. Žádné nákupní ani affiliate odkazy neodemyká a nemění typ doporučovaného výrobku.

## Akceptace
- Node testy: pozitivní scénáře v pěti poradcích, negativní scénáře s bezpečnostní blokací, existující kotvy měřicího návodu.
- Release metadata 0.8.151 ve všech 77 souborech integrity (76 původních + nový helper); žádné částečné nasazení.
- Po Pull + Deploy: readiness release 0.8.151, integrity OK, affiliate 25/25, 14 poradců v produkčním Chrome QA; ručně ověřit příklad nedokončeného měření na WC/sprše/vaně.

Kód nemění produktovou evidenci, úhrady, ceny, domény partnerů, analytiku ani osobní údaje.