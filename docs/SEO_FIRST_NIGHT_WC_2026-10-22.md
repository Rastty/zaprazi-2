# Zápraží 2.0 — první noc po propuštění: WC a bezpečný přesun

Datum: 22. 10. 2026. Release 0.8.145.

## Hypotéza (nikoliv doložená poptávka v GSC)

Návštěvník stránky „Na co se zeptat před propuštěním z nemocnice“ potřebuje
rychle zjistit, jak ověřit první noční cestu na WC. Před úpravou tato stránka
vedla jen na obecný koupelnový rozcestník, přestože už existuje specializovaná
kontrola /nocni-cesta-z-postele-na-wc/ i poradce /toaletni-zidle-pro-seniory/.
Nezakládáme duplicitní SEO stránku, rozvíjíme existující autoritu.

## Konkrétní změna

- Na stránce otázek před propuštěním je čtvrtý problémový scénář WC v noci
  (`#wc-prvni-noc`), s odkazem na sedmibodovou kontrolu a pouze podmíněnou
  cestou na specializovaný výběr toaletní židle.
- Stránka návratu z nemocnice vede z prioritní karty WC a postel přímo
  na tento problém; noční kontrola vrací návštěvníka do nemocničních otázek,
  pokud se propuštění teprve plánuje.
- Žádný nový produkt, úhradové číslo, zdravotnický nárok, affiliate odkaz,
  obchodní zkratka nebo další engine.

## Safety a privacy

Pokud je potřeba fyzické zvedání nebo bezpečný přesun není potvrzen,
karta doporučuje nejprve probrat postup s nemocničním týmem. Praktický
obsah sám o sobě neodemyká nákupní CTA. Odpovědi se nikde neukládají.
Dokument nepřináší další zdravotní radu nad rámec již schválených vstupů.

## Akceptace a měření

- CI testuje tři kontextové směry, existence cílových anchorů, jednu H1
  a nepřítomnost obchodních odkazů v novém bloku.
- Po deployi: ověřit na mobilu render karty, prokliky, bezpečnostní průchod
  a 14/14 poradců + 25/25 affiliate pozic.
- GSC impressions/CTR a query-to-page relace jsou zatím UNKNOWN, ne nula.
  První reálné vyhodnocení preferuje **existující** URL a nevytváří
  návštěvnostní ani konverzní tvrzení bez dat.
- Případné úpravy podle rozhovoru s rodinami rozlišovat od analytiky GA4.
