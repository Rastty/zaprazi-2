# Zápraží — UX benchmark a pilot adaptivních otázek (2026-10-09)

## Konkrétní zahraniční vzor, nikoli plošné kopírování

- [AskSARA](https://equipu.livingmadeeasy.org.uk/) nabízí průchod „vybrat oblast → odpovědět → dostat radu“; [popis DLF](https://dlf.livingmadeeasy.org.uk/about-ask-sara) odděluje praktické rady od produktů. Zápraží už tento základ má. Co chybělo: v některých větvích se uživatel ve druhém kroku stále ptal na rozměry **jiné, nepoužité konstrukce**.
- [LiveUp](https://www.liveup.org.au/quiz) používá krátký srozumitelný vstup a nesaveuje odpovědi z kvízu. Zápraží přebírá pouze minimalizaci potřebných otázek a zachování privacy-by-design, nikoli jeho obecný health quiz nebo osobní profil.
- [AARP HomeFit](https://www.aarp.org/livable-communities/housing/info-2020/homefit-worksheets/) dává praktický domácí checklist včetně non-product kroků; to je inspirace až pro další validované MVP, **nepřidáváme** zde Home Scan ani nové odborné rady.

## Pilot: dvě zbytečné modelové otázky, existující engine

| Cesta | Aktuální nadbytečný dotaz | Nové chování | Bezpečnostní pojistka |
|---|---|---|---|
| Madlo k WC, kotvení do zdi potvrzené | Kompatibilita rámu P2015 | Zůstane jen ověření nosnosti konkrétního madla | Při nepotvrzeném kotvení se P2015 fit povinně ukáže; bez „ano“ jej engine neodblokuje |
| Sedátko přes vanu BESCO BS008 rozměrově pasuje | Vejde se alternativní transferová židle 81×61 cm? | Dotaz zmizí; ukáže se teprve při „sedačka nepasuje“ | Bez potvrzené vhodnosti alternativy zůstane výsledek fail-closed |

Změna je čistě prezentační: sdílený `src/bathroom/micro-staging.js` kontroluje relevance otázek až po předběžném náhledu konkrétního produktu. Žádný druhý engine. Při skrytí se odpověď smaže; změna základní situace resetuje celou druhou fázi. Rozhodnutí o výrobku i možnosti nákupu dál výhradně zajišťuje `recommendBathroom`.

## Hypotéza a měření

- **Hypotéza:** o jednu irelevantní rozměrovou otázku méně ve dvou větvích; uživatel snáz pochopí, co měřit a proč. Žádné tvrzení o zlepšené konverzi bez dat.
- **Pozorovatelné před/po:** ve větvi nástěnného madla se P2015 fit nezobrazuje; v sedátku se alternativní lavice zobrazuje jen po „ne“. U obou směrů projde potvrzená cesta na konkrétní produkt; „nevím/ne“ v relevantních blocích nesmí otevřít nabídku.
- **Metriky:** existing `builder_start` a `builder_complete` (jen agregovaně, bez odpovědí) podle veřejné cesty, délka dokončení a četnost chybějící odpovědi při anonymních moderovaných testech; případně obchodní proklik při platném souhlasu. Neposílat hodnoty `bathFit`/`wallFixing` do analytics, URL, affiliate ani logů.
- **Acceptance:** běžné Node testy, QA všech 14 poradců po deploy, dvě nové dynamické browser větve (obě hodnoty typu pomůcky), nezměněné fail-closed výsledky, žádný obchodní link v náhledu. Pokud by se zhoršila srozumitelnost nebo bezpečnost, změnu vrátit.
- **Praktické ověření:** krátce otestovat s 3–5 dospělými pečujícími: dovedou vlastními slovy říct, *co přesně* mají před nákupem změřit/ověřit? Teprve s daty rozhodnout o rozšíření na dalších 12 poradců.

Stav pilotu: implementace/CI a produkční ověření jsou samostatné kroky. Tento dokument nepotvrzuje release ani skutečný uživatelský efekt.
