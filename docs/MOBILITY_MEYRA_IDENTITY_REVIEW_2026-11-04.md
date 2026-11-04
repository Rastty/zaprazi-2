# Mobility P0 — rozdíly mezi výrobním a prodejním popisem (4. 11. 2026)

## Důvod revize

Třetí produkčně povolený kandidát pro chůzi je **MEYRA Ideal Rollator 3061982**. Původní HTTP dostupnostní audit [#41810674676](https://github.com/Rastty/zaprazi-2/actions/runs/41810674676) získal z přesné veřejné URL Lékárna.cz **403** — pouze `access_unverifiable`, nikoliv 404 nebo důkaz zrušení produktu.

Aktuální veřejně dohledatelné stránky (ověřeno 4. 11. 2026; dynamická cena/sklad se **nepřebírají**):

| Parametr | Výrobce MEYRA — 3061982 | Lékárna.cz — MEYRA Ideal rollator |
|---|---|---|
| Označení výrobku | IDEAL ROLLATOR, **model 3061982** | MEYRA Ideal Rollator, **vlastní kód produktu 473021**, modelové číslo 3061982 na veřejném detailu nevypisuje |
| Celková šířka | **61,5 cm** | **59 cm** |
| Výška madel | **79–97 cm** | **79–99 cm** |
| Nosnost | **130 kg** | **130 kg** |
| Hmotnost | **10,2 kg** s košíkem a podnosem | **11 kg** (podmínky vážení nezaručené) |
| Cesta k úhradě | kód ZP 07-5005963; pouze obecné informace, nezaručuje individuální nárok | výslovně uvedena přímá úhrada při nákupu na e-shopu bez využití poukazu |

Zdroj výrobce: https://www.meyra.cz/ctyrkolove-choditko-rollator.html ; produktový e-shop výrobce: https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-ideal-rollator-/191 ; veřejný detail prodejce: https://www.lekarna.cz/meyra-ideal-rollator-ctyrkolove-choditko/.

**Rozdíl sám o sobě neprokazuje jiný SKU ani chybnou nabídku.** Prodejce může používat jinou metodiku měření, aktuální revizi modelu nebo chybný záznam. Bez výrobně potvrzeného propojení modelu 3061982 s konkrétním SKU či EAN prodejce nelze přesnou identitu objednávané varianty prohlásit za nezávisle prokázanou.

## Dopad a rozhodnutí

1. **Nezměnit** nynější bezpečnostní rozhodovací engine, produktové pořadí nebo affiliate směrování pouze na základě stránky prodejce. Současný katalog používá při šířce **konzervativnější údaj 61,5 cm** a výšku madel výrobce **79–97 cm**. Individuální fit-gates nadále požadují ověření konkrétního modelu, šířky, nosnosti, výšky a brzd; neodemykají nabídku automaticky.
2. Pro finální komerční důkaz získat od prodejce či výrobce potvrzené **přiřazení kódu 473021/EAN k výrobnímu modelu 3061982**, případně přesný štítek zboží. Teprve pak revidovat status identity/affiliate deeplink (ne výši provize jako kritérium doporučení).
3. Přidat **týdenní nezávislý veřejný read-only audit** `scripts/audit-meyra-public-identity.mjs`. Čte pouze dva přesné neaffiliate veřejné URL, nepřechází na affiliate tracking, nezapisuje na WordPress a neposílá žádné odpovědi poradce. Pokud je prodejce nepřístupný (403/429), vrátí **unverifiable**. Pokud se podaří přečíst detail a chybí přímo výrobní kód či jsou rozdílné parametry, vrátí **review_required**. Ani shodné hodnoty nejsou potvrzenou objednávkou či provizí.
4. BESCO WA17/WA21 nadále mají vlastní monitor, který v [run #41819794305](https://github.com/Rastty/zaprazi-2/actions/runs/41819794305) zachytil rozporné **obecné** hmotnosti oproti specifické hmotnosti chodítka (WA17 2,2 vs 2,3 kg; WA21 2,7 vs 2,8 kg). Nezměnit zdrojová fakta z ověřených návodů automaticky.

## Vyhodnocení

Cíl auditu je **předcházet nepravdivému obchodnímu tvrzení a nevhodnému produktu**, nikoli generovat návštěvnost nebo provize. Případná dostupnost HTTP 200 či shoda textu není ověření skutečné affiliate URL, měření kliknutí ani schválené objednávky. `affiliate_audit` v Growth Graphu musí zůstat `in_progress`, dokud chybí nezávislé důkazy identity, publisher deep-linkingu a schválených provizí.

Dokumentace ani přidaný read-only monitoring **nevyžadují WordPress deploy**.

## První reálný běh po sloučení (4. 11. 2026)

[GitHub Actions #41831911404](https://github.com/Rastty/zaprazi-2/actions/runs/41831911404) dokončila všechny kontraktové testy **10/10 PASS** a dva samostatné public-only audity. Výsledky:

- MEYRA výrobce: `matching_public_facts` — na skutečné veřejné stránce čitelný model 3061982, šířka 61,5 cm, madla 79–97 cm. Jde o důkaz konzistence veřejných výrobních údajů, ne individuální bezpečnosti.
- MEYRA Lékárna.cz: `unverifiable`, `blocked_by_public_merchant`. Originální produktová stránka z GitHub runneru nepřístupná; stav neprokazuje chybný výrobek ani zrušený sortiment. Rozdíl v dříve veřejně indexovaných parametrech je k manuálnímu vyjasnění.
- BESCO WA17: `review_required`, obecná 2,2 kg vs specifická 2,3 kg (současný katalog vychází z návodu 2,3 kg).
- BESCO WA21: `review_required`, obecná 2,7 kg vs specifická 2,8 kg (současný katalog vychází z návodu 2,8 kg).

**Neznámé:** schválený publisher deeplink Lékárna.cz, potvrzení přesného prodejního modelu, aktuální cena/sklad, objednávky a provize. Bez externího potvrzení neměnit `affiliate_audit` na `verified`; důkaz runu slouží pouze pro `in_progress`.
