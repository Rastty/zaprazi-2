# Zápraží 0.8.147 — přesné vyhledávání pomůcek u WC

**22. října 2026**. Na produkční 0.8.146 vedl dotaz „madlo k WC“ na obecný koupelnový rozcestník; názvy konkrétních pomůcek mají mít přesnější první krok. Není to důkaz o objemu dotazů z Googlu.

## Změna
- Nástavec / zvýšení WC se před obecnými výsledky nabízí přes specializovaný poradce `/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc`.
- Madlo / opora / toaletní rám u WC se před obecnými výsledky nabízí přes `/madlo-k-wc-pro-seniory/#poradce-opora-wc`.
- Obě cesty obsahují měřicí průvodce `#mereni-wc` a obecný rozcestník jako další možnost.
- Obecné „WC“ nebo samotné „madlo“ zůstává v obecné poradenské cestě; vana i toaletní židle mají vlastní vyšší prioritu.
- Pokud existují poradenská doporučení, ale WordPress nemá žádný další archivní článek, stránka již netvrdí, že „nic nenašla“.
- Historické výsledky, permalink, canonical, indexace, produkty, pravidla výběru a affiliate odkazy beze změny.

## Safety, test a nasazení
Mapování obsahuje výhradně pevné interní URL bez hledaného dotazu; nezaručuje vhodnost madla ani nástavce. Kotvení do stěny, nosnost, kompatibilitu a bezpečný přesun musí nadále ověřit poradce. CI testuje klíčová pořadí, alternativní slovosled, rozdíl výška vs. opora a obecné/negativní termíny. Při Pull + Deploy 0.8.147 ověřit živé vyhledávání, 14 poradců, 25/25 affiliate a release integritu.
