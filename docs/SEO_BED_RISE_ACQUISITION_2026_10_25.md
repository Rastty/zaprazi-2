# SEO acquisition – Senior nemůže vstát z postele

**Připraveno 25. 10. 2026.** Nejde o tvrzení o hledanosti či pozici. Search Console performance pro zaprazi.cz zatím nemáme k dispozici.

## Odlišení search intent
- Nová stránka: `/senior-nemuze-vstat-z-postele/` (posazení vs postavení, madlo vs hrazda vs zábrana vs lůžko).
- Existing `/polohovaci-postel/` řeší až výběr konkrétního lůžka, použití, nosnost a pořízení.
- `/nocni-cesta-z-postele-na-wc/` řeší cestu po vstání; `/vstavani-z-kresla-pro-seniora/` řeší jiný kus nábytku.
- Nová URL nevytváří neověřený product slot na madlo ani nepřesměrovává historický nábytkový obsah.

## Co dělá z obsahu něco užitečného
- Odděluje čtyři odlišné typy obtíží a čtyři kategorie řešení.
- Sedm praktických podkladů pro ověření a rozhodování; FAQ pro long-tail.
- Primární zdroj MHRA a další dvě aktuálně přístupné NHS stránky s bezpečnostními omezeními; explicitní upozornění na zaklínění.
- Čtyři kontextové vstupní cesty: homepage, bed advisor, kompenzační hub, noční WC; návaznost na pojišťovnu/půjčení pouze v existujícím poradci.
- Jednorázová nedestruktivní auto-publikace jen tohoto slugu, zvláštní title/meta a test 7/7.

## Po deploy
1. Přiřadit (auto) WordPress page k šabloně. Ověřit 200, jeden H1, canonical HTTPS, správný title a Yoast meta, index/follow, RSS/sitemap.
2. Ověřit živé odkazy ze čtyř vstupních stránek, všechna CTA pouze do odpovídajících poradců.
3. Po nasazení spuštěním production-advisor-qa zkontrolovat novou stránku včetně anchorů, 7 karet a no merchant bypass; proti starému live release test bezpečně skipuje.
4. Zatím neprohlašovat page za zaindexovanou. Po 14/28 dnech zkontrolovat GSC URL Inspection, pages+queries a dohodnout revizi snippetů / obsahu podle zobrazení, CTR a pozic.
5. Až jsou data, přidat další problémové témata na základě skutečné poptávky a nízkého překryvu. 4 360 starých off-topic URL bez důkazů nemažeme.

Zdrojové bezpečnostní podklady MHRA / Kent NHS / Kingston NHS uvedeny přímo v textu a prověřeny 25. 10. 2026.