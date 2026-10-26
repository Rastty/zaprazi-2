# Zápraží 0.8.161 — Jednotná uživatelská cesta pěti koupelnových poradců

## Problém
Pět specializovaných koupelnových poradců mělo již dobré produktové bezpečnostní podmínky a dvoufázový postup (předběžný výrobek bez obchodu → potvrzení konkrétních parametrů). Návštěvník ale **nevěděl, ve které fázi je a kolik povinných odpovědí zbývá**, a při zablokování výběru dostával jen textový výsledek bez konkrétní cesty k měření.

## Vydání
- Jeden sdílený UX modul `src/bathroom/micro-staging.js` nově generuje **přístupné dvoufázové kroky a aktuální počítadlo pouze viditelných povinných otázek**. Samostatně počítá variantní modelové kontroly vany nebo toaletní opory, takže člověk není zatížen skrytými otázkami.
- Modelové preview vysvětluje co konkrétně ověřit před potvrzením, při vyplnění `Nevím` nevyvozuje vhodnost produktu.
- Odborný stop vede na věcný pracovní list a bezpečný další krok, nikoliv na nákup.
- Výsledek má jasný stav: pozastavené rozhodnutí vs. dokončené vyhodnocení; výsledek a nabídka se při změně situace invalidují.
- Mobilní zobrazení: velké segmentované kroky, čitelný text, jasný kontrast, akcentovaný akční postup, žádná přelepující sticky lišta; respektuje reduced motion.
- Cesty na obsah pouze statické a důvěryhodné: WC, sprcha, toaletní židle u postele, madlo na předstěnu a vana. Odpovědi se neukládají na server, do URL, analytiky ani affiliate partnerům.

## Záměrně nedotčené
- Původní `recommendBathroom` bezpečnostní a variant-fit rozhodování, přesné ověřené položky katalogu, jejich nosnosti, obchodní konfigurace 25/25, povolení pouze po explicitním ověření, samostatné půjčení/nákup/úhrada. **Preliminary není doporučení**.
- Stávající WordPress slugs a kanonické SEO adresy, starší archiv postů, neveřejné odpovědi.
- Sdílený krok je progresivní vylepšení; pokud klient nebo testovací DOM neumí vytvořit UI kartu, formulář i bezpečnostní engine fungují bez ní.

## Acceptance
- Source/Node tests u všech 5 specializovaných poradců: WC nástavec, sprchová židle, toaletní židle, WC opora a sedačka přes vanu.
- Browser-event regression: modelové fit otázky až po preview, reset po změně situace, žádný merchant link při asistovaném/nejistém přesunu, seznam relevantních měření a nápověda.
- CI / skutečný read-only produkční QA (na předchozí live verzi) / WordPress 5448 fidelity všude zelené.
- Po `Pull + Deploy` 0.8.161: ověřit `release`/`integrity`, vizuální kartu na mobilech, změny mezi první/druhou fází a skutečné zablokování nákupu pro nejisté odpovědi.
- Měřit úspěšnost až s reálnými consent-approved anonymními událostmi, indexací GSC a objednávkami; technické testy samy nejsou důkazem přínosu návštěvnosti.
