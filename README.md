# ZaPrazi 2.0

**ZaPrazi = decision engine pro bezpečnější a samostatnější život doma.**

ZaPrazi není magazín pro seniory ani katalog zdravotnických pomůcek. Uživatel přichází s praktickým problémem a web ho vede k pochopení situace, typu řešení, způsobu získání a teprve potom ke konkrétním produktům nebo službám.

Core flow:

`PROBLÉM → SITUACE → MOŽNOSTI ŘEŠENÍ → TYP POMŮCKY / ÚPRAVY → KOUPIT / PŮJČIT / PROVĚŘIT ÚHRADU → PRODUKT / SLUŽBA → AKCE`

## Aktuální priorita

První vertikální řez je **Mobilita**:

`Homepage → Domácí poradce → problém s chůzí → typ řešení → chodítko / rollátor → způsob získání → doporučení → merchant → měřitelný outbound click`

Nejdříve musí fungovat tato cesta end-to-end. Teprve potom rozšiřujeme koupelnu/WC, polohovací postele, vozíky a návrat z nemocnice.

## Zásady

- bezpečné a praktické doporučení před monetizací,
- žádná diagnostika ani předstírání individuálního zdravotního posouzení,
- minimum osobních dat; v MVP se odpovědi poradce trvale neukládají,
- doporučovací logika je oddělená od merchant/affiliate vrstvy,
- fakta, úhrady a produktové parametry musí mít dohledatelný zdroj,
- chybějící kritický údaj se nesmí domýšlet,
- affiliate provize nesmí měnit vhodnost nebo pořadí doporučení,
- WCAG 2.2 AA je produktový požadavek, ne kosmetika,
- staré URL se migrují pouze podle inventury a skutečného vyhledávacího záměru.

## Dokumentace

Po bootstrap PR budou autoritativní směr a implementační pravidla v:

- `docs/ZAPRAZI_SOURCE_OF_TRUTH.md`
- `docs/ARCHITECTURE.md`
- `docs/BACKLOG.md`
- `docs/MIGRATION_AUDIT.md`
- `AGENTS.md`

## První business milestone

**První schválená affiliate objednávka z kompletní poradenské cesty.**
