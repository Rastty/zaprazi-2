# Zápraží – provozní záznam masové čistky starého archivu

**Datum:** 28. 10. 2026 · **produkce:** https://zaprazi.cz

## Skutečně provedeno (WP-CLI `post delete`, bez `--force`)

- Výchozí stav: **4 360 publikovaných příspěvků** (`post_type=post`), **53 publikovaných samostatných stránek**.
- Výběr: unikátních **4 050** publikovaných postů v kategoriích 1161, 11, 1159, 1162 (fotovoltaika/tepelná čerpadla, zařízení, čerpadla/vodárny, ventilátory).
- **ID 3638** („Stoly bezpečné pro děti a seniory…“) bylo z operace vyňato jako možná relevantní výjimka.
- **4 049** přesných ID je zapsáno v souborech `data/archive-offtopic-trash-20261027-part-{01,02,03}.json` včetně původního slugu, názvu, data a statusu. Soubory dohromady obsahují právě 4 049 unikátních ID a jsou záznamem pro případné selektivní obnovení.
- Pomocí připojeného WordPress WP-CLI bylo odesláno **12 hromadných operací bez `--force`** v dávkách 20, 300, 340×9 a 329 příspěvků; všechny dávky vrátily 100% úspěšnost, žádné selhání.
- Následné **živé SQL read-only ověření**: **311 publikovaných příspěvků, 4 050 příspěvků v koši** (z toho jeden starší již byl v koši před akcí), **53 publikovaných pages**, **1** publikovaný post z uvedených čtyř kategorií — chráněné ID **3638**.
- Jeden typický starý solární článek s původní URL `/solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu/` po přesunu vrací HTTP 404 (ověřeno veřejným fetch).
- Nedělali jsme žádné 301/302 přesměrování na nesouvisející seniorské stránky. WP přesun do koše je vratný, nikoli fyzické smazání `--force`.

## Důležitá upřesnění

Z aktuálních dat nevíme, které staré URL Google dříve indexoval, která měla organické návštěvy či zpětné odkazy. Hromadná čistka proběhla podle zjevné tematické nesourodosti na výslovný pokyn vlastníka. Smazání a 404 **nejsou SEO garancí** a zpětné obnovení URL může po recrawlu vyžadovat čas.

Zachovat možnosti obnovy: **nevyprazdňovat koš a neprovádět `post delete --force`** bez dalších kontrol. Některé WP instalace automaticky čistí koš po určité době — po operaci ověřit `EMPTY_TRASH_DAYS` a v případě potřeby předcházet ztrátě rollbacku (ideálně samostatnou zálohou DB). JSON manifest obsahuje původní metadata, **nikoli celé texty**.

## Další akce

1. Read-only audit zbývajících **311** publikovaných postů podle kategorie/relevance, včetně zachování užitečných starých URL.
2. Ověřit živou sitemapu po velké změně, robots a přístupnost hlavních poradců. **Sitemap ≠ Google indexace**.
3. U zbývajících off-topic příspěvků pokračovat jen explicitně klasifikovanou skupinou s evidence manifestem a vratným trash.
4. Následně audit interních odkazů a starých navigačních menu/widgetů odkazujících na odstraněné URL; neuvádět neexistující destinace.
5. Při později dostupné GSC pro zaprazi.cz zkontrolovat změny ve výkonu archivu a ochranu výjimek.

**Deploy:** tento záznam ani auditní skripty nemění WordPress theme runtime; není potřeba nový deploy.
