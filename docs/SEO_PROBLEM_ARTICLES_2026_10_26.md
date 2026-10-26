# Zápraží SEO — první cílená obsahová vlna (26. 10. 2026)

## Strategie
Bez současných GSC URL × query dat a keyword nástroje neprohlašujeme skutečnou hledanost, KD ani dosažitelné pozice. Cíl je **rozlišit konkrétní problém, mít nejlepší praktický návod a bezpečnou cestu k poradci**, ne kopírovat komerční blogy. Verifikovaná živá verze před prací: 0.8.157 v předchozím běhu; uživatel potvrzuje nasazení 0.8.158. Produkční 0.8.158 musí být samostatně potvrzena z REST, ne z GitHub merge.

## Veřejná konkurence — omezená SERP kvalitativní kontrola
1. **Vysoký práh a chodítko/vozík**: vyhledávací výsledky odkazují hlavně na rampy/lišty a obecné domácí úpravy; samostatný proces „7 měření / rozhodnutí zda upravit práh vs. nájezd vs. pomůcku“ je příležitostí na užitečné rozhodnutí. Není doložena nízká keyword obtížnost.
   - https://www.lapert.cz/najezdove-rampy-pro-invalidni-voziky
   - https://www.dmapraha.cz/clanek/91/spravny-sklon-rampy/
   - https://dev.livingmadeeasy.org.uk/dlf-factsheets/adapting-your-home-access-into-and-around-your-home
   - https://oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru-prevence-a-privolani-pomoci-po-padu/
2. **Sprchová židle do malého koutu 80 × 80**: výsledky jsou většinou o výběru sprchového koutu, ne o bezpečnosti židle v jeho skutečném prostoru. Nezaměňovat silnou konkurenci pro dotaz `sprchový kout 80x80` s (neověřenou) konkurencí pro long-tail `sprchová židle 80x80`.
   - https://www.huppe.cz/jak-vybrat-sprchovy-kout-do-male-koupelny/
   - https://www.mbkeramika.cz/poradna/odborne-clanky/jaky-sprchovy-kout-bude-nejlepsi-pro-vasi-koupelnu
   - https://www.nzip.cz/clanek/1285-demence-pecujici-osobni-hygiena
   - https://oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru-prevence-a-privolani-pomoci-po-padu/

## Práce v release 0.8.159
- /prahy-pro-choditko-a-vozik/ — problémová stránka s typy pomůcek, sedmi rozměry a kontrolami, výběrem mezi odstraněním prahu/lišty/odborným návrhem, skutečným kontrolním listem, příklady chyb a bezpečnou navigací k Mobility/Wheelchair/Return Home poradcům. Žádná domyšlená přípustná strmost ani automatická doporučení rampy.
- /sprchova-zidle-maly-kout-80x80/ — problémová stránka se sedmi měřeními, čtyřmi scénáři, rozdílem mezi šířkou sedáku a celou konstrukcí, pracovním listem a odkazem do již existujícího bezpečného sprchového poradce. Není vydávána za individuální posouzení ergoterapeutem.
- Obě stránky získají zdrojové odkazy, 5 FAQ, minimálně 3 inbound linky z existujících témat, unikátní title/meta a dvě trvale kanonické URL.
- Vytváření WP stránek je **idempotentní pouze při nepoužitém slugu**; žádný přepis legacy posts ani už existujících pages.
- 82 chráněných tématových assetů verze 0.8.159; 25 affiliate pozic, produktový engine a nákupní fit-gates se nemění.

## Po deploy
1. Ověřit REST release 0.8.159 a integrity ok. Jestliže 0.8.158 nebylo nasazené, nový Pull + Deploy přejde přímo na 0.8.159.
2. Ověřit existenci obou URL, 1 H1, kanonické HTTPS, unikátní title/meta, alespoň 3 kontextové vstupy, skutečné cílové kotvy a Yoast sitemap. Teprve pak obě URL přidat do striktniho sitemap contractu a live browser QA.
3. Následně sledovat 14/28/56 dní GSC URL × query impression/CTR, anonymní interakce s poradci a skutečné affiliate kliky/objednávky. Bez dat nepřisuzovat 0 návštěv kvalitu stránek ani slibovat 1. místo.
4. Další obsahy upřednostnit podle reálných dotazů; neopakovat existující guides ke schodům, nočnímu WC, zvýšení WC, pádu ani obecnému rollátoru. Novou stránku jen při zřetelně odlišné potřebě.
