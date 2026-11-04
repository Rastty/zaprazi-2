# Zápraží — první skutečná organická GSC baseline (4. 11. 2026)

## Ověřený zdroj

- Reálný, read-only Google Search Console Search Analytics API běh: https://github.com/Rastty/prometheus-growth-os/actions/runs/41849781731
- Výsledek workflow: SUCCESS, unit a capture PASS. Exaktní autorizovaná property https://zaprazi.cz/ s oprávněním siteOwner; žádný jiný web ani www host se nedopočítával.
- Data: searchType web, dataState final, od 2026-10-05 do 2026-11-01 včetně, 28 dokončených dní; 3denní odstup kvůli finalitě.
- Sitewide bez dimenzí: **13 organických kliknutí**, **893 zobrazení**, vypočtené CTR **1,46 %**, průměrná pozice **19,95**.
- Na základě samotných údajů nelze tvrdit skutečnou indexaci všech historických URL, přínos konkrétní změny, objednávky, příjmy ani trend. Dřívější rovnocenný GSC baseline chybí.

## Evidence vybraných existujících rozhodovacích stránek

| Canonical URL | Kliky | Zobrazení | CTR | Průměrná pozice | Hodnocení |
|---|---:|---:|---:|---:|---|
| /choditko-na-pojistovnu/ | 1 | 50 | 2,0 % | 10,78 | **První kandidát pro obsahově-bezpečnostní revizi** |
| /kompenzacni-pomucky-pro-seniory/ | 0 | 16 | 0 % | 71,94 | malý vzorek, nízká viditelnost |
| /rollator-pro-seniory/ | 0 | 8 | 0 % | 7,00 | 8 zobrazení nestačí pro závěr o slabém CTR |
| /koupelna-a-wc/ | 0 | 7 | 0 % | 54,43 | malý vzorek |
| /invalidni-vozik/ | 0 | 6 | 0 % | 5,67 | malý vzorek |
| /polohovaci-postel/ | 0 | 6 | 0 % | 53,83 | malý vzorek |
| /pujceni-choditka/ | 0 | 5 | 0 % | 5,40 | malý vzorek |
| /navrat-z-nemocnice/ | 0 | 3 | 0 % | 11,00 | malý vzorek |
| /sobestacnost/ | 0 | 3 | 0 % | 84,00 | malý vzorek |
| / | 0 | 2 | 0 % | 8,00 | malý vzorek |

Jde o **deset URL skutečně obsažených v page-dimension výsledku GSC**, nikoli celý seznam v sitemapu. Tři předem sledované URL /choditka-pro-seniory/, /choditko-do-bytu-pro-seniory/ a /bezpecny-byt-pro-seniora/ **neměly v API výsledku řádek**: UNKNOWN, nikoliv 0, zákaz indexace či chyba. Dalších 159 page řádků API bylo mimo striktní whitelist rozhodovacích URL nebo nesplnilo kanonická pravidla. Jejich syrové URL a soukromé search queries se záměrně neukládají do GitHubu. Počty řádků a jejich součty **nejsou** sitewide agregáty.

## Růstový směr podle Effort × Effect

1. **Priorita P1:** ověřit skutečné stránkově filtrované GSC dotazy pro /choditko-na-pojistovnu/ a porovnat záměr se současnou existující stránkou a jejím obsahem. 50 zobrazení / průměrná pozice 10,78 je konkrétní signál, ale příliš malý pro statistickou důvěru v pouhé přepsání titulku. Přezkoumat aktualizované SÚKL podklady pro listopad, transparentní cestu koupit/půjčit/ověřit úhradu a přístup k mobilnímu poradci. Nový duplicitní článek nevytvářet.
2. **P2:** udržet čisté technické SEO a funkční primární CTA stávajících vysokointentových URL; žádné preventivní další perf úpravy po Lighthouse 9/9 100/100.
3. **P3:** přidat reálný evidence-first GA4/affiliate outcome loop až po potvrzení oprávněného datového zdroje; schválené provize stále UNKNOWN. 25/25 configured slots nejsou objednávky.

## Strojově čitelný Growth Graph

Soubor config/growth-state.json nyní záměrně obsahuje **pouze**:
- asOf = 2026-11-01 (konec skutečně dokončeného GSC období),
- metrics.organic_clicks_28d = 13,
- metrics.organic_impressions_28d = 893,
- obě metricSources směrují na shora uvedený konkrétní HTTPS GSC Actions run.

Ostatní metriky (GA4 poradců, merchant clicks, schválené affiliate provize) **zůstávají UNKNOWN**. Produkční safety_qa verified 0.8.195 a affiliate_audit in_progress se nijak nepřepisují. Tento PR nemění WordPress, doporučení ani indexaci; **žádný deploy není potřeba**.

Budoucí denní automatické GSC běhy v soukromém Prometheus repozitáři nahradí agregáty jen po ověření přesného období a zdroje; po starší baseline nepřisuzovat trendy.
