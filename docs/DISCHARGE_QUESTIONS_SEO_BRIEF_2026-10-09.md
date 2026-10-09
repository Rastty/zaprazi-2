# Zápraží — informační stránka před propuštěním z nemocnice (9. 10. 2026)

## Odlišení vyhledávacího záměru

- **Nová stránka** `/otazky-pred-propustenim-z-nemocnice/`: návštěvník před propuštěním chce vědět, *na co se zeptat nemocničního týmu*, jak získat dokumenty, koho kontaktovat a jak zajistit návaznost. Nejde o nákupní katalog a neposkytuje individualizované zdravotní pokyny.
- **Stávající** `/navrat-z-nemocnice/`: praktický domácí plán a bezpečnost první noci po propuštění v existujícím deterministickém enginu. Neměníme jej ani nepřidáváme druhý výběrový engine.
- **Stávající** `/bezpecny-byt-pro-seniora/`: audit fyzických rizik v domácnosti, nikoli otázky při propuštění.

## Inventura historického obsahu

Export `data/legacy-url-inventory.csv` ze **7. 10. 2026**, 4 360 postů a sedm stránek, byl porovnán s kandidátní URL. V historických slugách není `otazky-pred-propustenim-z-nemocnice`, žádné staré `propusteni-z-nemocnice` či obdobná přímá konkurence; přibližně 22 výskytů `nemocnic` představuje téměř výhradně výrobu energie/vytápění nemocnic, tedy jiné téma. Aktuální živá databáze se mezi exportem a nasazením může změnit; samotný create hook proto nikdy nepřepisuje existující WordPress stránku.

**Toto není potvrzení indexace nebo návštěvnosti.** GSC dotazy a indexace zatím nejsou pro tuto novou stránku doložené. Před rozšiřováním článků ověřit dotazy/kanibalizaci v GSC po nové indexaci.

## Doložené podklady pro ČR, ověřeno 9. 10. 2026

- [NZIP: Propuštění z nemocnice](https://www.nzip.cz/clanek/290-propusteni-z-nemocnice) — propouštěcí zpráva, následná péče, sociální pracovníci, povinnost koordinace. Datum NZIP 5. 10. 2020 (aktuálnost detailů vždy znovu ověřit).
- [NZIP: Domácí péče](https://www.nzip.cz/clanek/209-domaci-pece) — domluvit potřebu už při plánování propuštění; nemocniční lékař může indikovat na 14 dní a navazující péči řeší praktik. Datum NZIP 17. 4. 2023.
- [NZIP: Zdravotnická dopravní služba](https://www.nzip.cz/clanek/295-zdravotnicka-dopravni-sluzba) — o hrazené přepravě rozhoduje ošetřující lékař na základě stavu; neautomatizovat přiznání.
- [VZP, 23. 2. 2026: Kdo má nárok na hrazenou domácí péči](https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/kdo-ma-narok-na-hrazenou-domaci-peci) — orientace v institucionálním rámci, ne individuální rozhodnutí o nároku.

Žádné ceny, diagnózy, návody na léčbu, sezónní SEO přepis ani provizní produktové CTA. Redakčně důležité je odlišit **zdravotní domácí péči** od sociálních služeb a zdůraznit včasnou komunikaci s personálem.

## Implementace

- Unikátní WordPress `page-*.php` šablona se sedmi základními otázkami, čtyřmi bloky otázek pro rozhovor, zdroji, datem kontroly a jasným pokračováním do dosavadního poradce.
- Nedestruktivní publikace `init` se samostatnou idempotentní volbou; existující stránku na stejné URL nikdy neaktualizovat automatickým deployem.
- Jedinečný titul a popis přes WordPress/Yoast filtry, fallback meta description bez Yoastu.
- Obousměrné tematické odkazy přes `navrat-z-nemocnice` a `bezpecny-byt-pro-seniora` plus přirozené odkazy na chodítka/koupelnu/postel.
- Regresní testy titulů, přesnosti zdrojů, existence šablony, ochrany před kolizí starého slugu a absenci komerčního bypassu.

## Akceptace po deployi

- Nová URL HTTP 200, český obsah se zobrazí na mobilu i desktopu bez vodorovného přetékání.
- Unikátní H1/title/description, canonical na tuto URL, uvedené zdroje HTTPS a skutečné funkční interní odkazy.
- Z nové stránky lze přejít na stávající `/navrat-z-nemocnice/#plan-navratu`. Obě relevantní hub stránky obsahují zpětný odkaz.
- Produkční test všech 14 poradců a affiliate/integrity zůstává zelený. Nová stránka neobsahuje nákupní rozhodovací logiku ani zdravotní dotazník.
- GSC sitemap a skutečná indexace jsou samostatné následné kontroly. Nedeklarovat výsledky před jejich potvrzením.
