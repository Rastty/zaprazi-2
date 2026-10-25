# Zápraží 0.8.135 — kompletní read-only prověrka první etapy

Tato kontrola je dalším bezpečnostním stupněm po nasazení 0.8.135. Neprochází jen několik posledních postů, ale celý veřejný WordPress REST soupis publikovaných článků (původně 4 360) a testuje všechny posty, které jsou způsobilé pro opravu vykreslování: ID dělitelné 8 nebo ID 6801, 8105, 8106.

Skript stahuje pouze veřejný REST GET. Vytváří výsledný HTML fragment pomocí přesné produkční PHP čisticí funkce, poté ho vykreslí v izolovaném Chromium se zakázaným JavaScriptem i síťovými požadavky. Porovnává viditelná slova (min. 95 %), skutečné cíle všech odkazů a obrázků a zda v článku nezůstaly vnořené HTML dokumentové obálky. Pokud se některá položka odchýlí, celý QA job je označen jako neúspěšný a vypíše nejvýše 18 prvních příkladů k analýze.

**Záměrné limity:** Nezjišťuje indexaci Google, úspěšnost v SERPu, provoz affiliate, přístupové logy ani reálný obsah všech stránek prostřednictvím HTTP GET. Nepřepisuje data, nemění kanonické URL, stav publikace nebo SEO metadata. Výsledek je vhodný pro rozhodnutí o dalším postupném rozšíření, ne jako povolení k mazání nebo přesměrování.
