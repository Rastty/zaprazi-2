# Zápraží — recovery UX po archivní čistce (28. 10. 2026)

## Problém
Po přesunu 4 359 starých off-topic článků do koše mohou návštěvníci přes Google, záložky a staré externí odkazy přicházet na legitimní 404. Stará stránka 404 nabízela jen homepage a obecný poradce. Vyhledávání stále slibovalo „starší archiv“, který již veřejně neexistuje.

## Změna
- `404.php` transparentně vysvětlí možnou neplatnost adresy a změnu zaměření; zachovává skutečný HTTP 404, žádné 301/302, soft-404 ani auto-redirect.
- Nabízí čtyři konkrétní existující aktuální cesty: chůze, koupelna/WC, bezpečný byt, návrat z nemocnice. Nejde o náhradu původního technického obsahu, ale o jasně označenou aktuální nabídku.
- `search.php` už neslibuje výsledky ze zrušeného archivu a srozumitelně vysvětluje prázdné výsledky. Zachovává existující dotazové mapování na praktické návody a escapování dotazu.
- Nevytváří volný formulář ke sdílení osobních nebo zdravotních údajů. Žádné změny affiliate, produktových doporučení ani poradců.

## Ověření
`node --test tests/legacy-archive-recovery-ux.test.js`, `php -l 404.php`, `php -l search.php` a standardní GitHub CI. Na produkci až po Pull + Deploy z `dev`: HTTP 404 u vyřazené adresy, čtyři živé cíle, žádné staré sliby na vyhledávání. Google indexaci a dopad na SEO zatím neprokazujeme.
