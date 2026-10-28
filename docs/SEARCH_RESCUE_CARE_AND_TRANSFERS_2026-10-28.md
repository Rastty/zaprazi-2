# Zápraží – bezpečnější interní vyhledávání (28. 10. 2026)

## Problém
Nové redakční sekce s vysokou praktickou hodnotou již existují ve verzi 0.8.182, ale interní vyhledávání explicitní dotazy pečujících na přesun z postele na vozík a domácí zdravotní/pečovatelské služby nerozpoznávalo. Obyčejné hledání `vozík` nebo `postel` směrovalo k produktovým kategoriím před upozorněním na nebezpečné zvedání.

## Změna bez dalšího release bumpu
Před obecné kategorie jsou přidány tři deterministické sady (přesun, domácí péče, hůl vs. berle vs. chodítko), vždy vedou jen na přesné interní odkazy s ověřenými fragmenty. Žádný individuální zdravotní závěr, parametry z dotazu se neposílají do URL, žádné merchant deeplinky, žádné ukládání hledaného dotazu. Zachována stará navigace, filtrování a stránkování.
Změna upravuje pouze `src/seo/search-guidance.php` (mimo manifest 96 chráněných release souborů) a `tests/search-guidance.php`. Nasadit současně s připravenou verzí 0.8.182; její PHP/CSS release marker zůstane beze změny.

## Negativní kontroly
`zvedaci postel` a `zvedaci kreslo` nejsou obcházením běžných relevantních stránek, `peceni doma` a `fotovoltaika` nesmějí dostat falešného senior poradce. Testujte také `presun z postele na vozik`, `pecovatelska sluzba` a `hul nebo choditko`. Produkční kontrola je read-only; nespouštět přímo merchant/affiliate akce.

## Měření
Tato změna zlepšuje uživatelskou orientaci uvnitř webu. Zatím neprokazuje růst SEO organického dosahu, provize ani návštěvnost; ty vyžadují samostatné údaje.
