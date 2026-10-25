# SEO 0.8.156 — Senior spadl doma: první kroky a prevence opakování

**Připraveno:** 25. 10. 2026. **GSC clicks/impressions/query evidence:** zatím nemáme. Jde o ověřitelný SEO pokus, ne tvrzení o objemu hledání nebo pozicích.

## Proč nový URL
- `/senior-spadl-doma/`: **po konkrétním pádu**, co udělat hned, kdy zdravotnickou pomoc a jak se připravit po akutní fázi.
- `/bezpecny-byt-pro-seniora/`: **prevence před pádem** a audit bezpečné domácnosti.
- `/nocni-cesta-z-postele-na-wc/`: **prevence při jedné konkrétní trase**, noční světlo, překážky, opora.
- `/vstavani-z-kresla-pro-seniora/`: **vstávání z nábytku**, ne první pomoc po pádu.
- Legacy inventura historických 4360 článků má jen úzký lexikální titulkový audit, nikoli jistotu všech záměrů a návštěv; žádné staré URL nemažeme, nepřesměrováváme ani nepřepracováváme.

## Samostatná užitečná odpověď
1. Rozlišuje naléhavost a uvádí místní zdravotnické číslo **155**, nikoli britské 999; není diagnostickým rozhodovacím algoritmem.
2. Neučí rodinu násilně zvedat zraněného nebo předepisovat nevhodnou pomůcku.
3. Přináší sedm praktických bodů **až po zajištění bezpečí**.
4. Návaznost na existující chůzi, noční WC, křeslo, koupelnu, postel a bezpečný byt. Všechny produktové fit-gates zůstávají v původních poradenských enginech.
5. Redakční zdroje s kontrolou 25.10.2026: NZIP ZZS (https://www.nzip.cz/clanek/205-zdravotnicka-zachranna-sluzba), NHS falls (https://www.nhs.uk/conditions/falls/), NZIP prevence (https://www.nzip.cz/clanek/1242-zlomenina-krcku-stehenni-kosti), Opora Diakonie (https://oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru-prevence-a-privolani-pomoci-po-padu/). Redakční materiál nemá doloženou externí odbornou revizi.

## Cesta návštěvníka a SEO
- Publikace Git-first z jediné nové šablony, jednorázový WordPress init pouze při chybějícím slugu.
- Tři nové inbound odkazy: homepage, bezpečný byt, noční WC. Odkazy zpět do relevantních 6 pomocných destinací.
- Vyhledávání uvnitř Zápraží: human-context dotazy na skutečný pád (např. `senior spadl doma`), nikoli `cerpadla` nebo `spadl vykon`.
- Unikátní SEO title/meta přes Yoast + fallback v případě neaktivního Yoast, žádné duplicitní description.
- Kompletní 0.8.156 integrity markery všech chráněných souborů.
- Nové Node a PHP regresní testy; browser QA od 0.8.156 kontroluje page H1, anchors, 7 checklist karet, zdroj, 3 inbound cesty, 6 cílových stránek a bezpečnostní limity.

## Nasazení a měření
1. Po zeleném PR CI mergnout `main`, synchronizovat `dev`, poté **WordPress Pull + Deploy**. Nenasazovat před zeleným CI.
2. Po deploy ověřit `/wp-json/zaprazi/v1/affiliate-readiness` = 0.8.156, integrity OK, 25/25 konfigurace affiliate, nový slug = HTTP 200, canonical HTTPS, jeden H1, meta description, Yoast page sitemap a testy hlavních odkazů.
3. Po 14 a 28 dnech GSC: URL Inspection, impressions, queries, CTR a index status. Podle skutečných dat rozhodnout o úpravách titulku nebo rozšíření obsahu.
4. CTR poradce / odchozí affiliate akce porovnávat pouze agregovaně; do analytiky neposílat zdravotní údaje či odpovědi poradců.

**Limit:** Nová stránka nevytvoří automaticky nový affiliate slot, neslibuje zdravotní bezpečnost nebo výdělek. Bez GSC nehodnotit její relevanci čísly.
