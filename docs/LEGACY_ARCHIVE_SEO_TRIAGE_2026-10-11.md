# Zápraží 2.0 — konzervativní SEO inventura historického archivu (11. 10. 2026)

## Co bylo skutečně analyzováno

Zdroj: `data/legacy-url-inventory.csv`, export veřejných WordPress REST položek z **7. 10. 2026**. Inventura obsahuje **4 367 unikátních URL**: 4 360 příspěvků a 7 stránek. Byly vyhodnoceny **titulek + slug** všech 4 360 příspěvků, nikoli tělo článku, Search Console, externí odkazy nebo ranking.

Pro opakování pouze číst:

```bash
node scripts/audit-legacy-seo.mjs
npm test
```

Skript nic nepublikuje, nemaže, nepřesměrovává a zapisuje pouze JSON na stdout. Záměrně používá úzké výrazy; například `pád` nesmí omylem označit tisíce výskytů slova `čerpadla`.

## Výsledek — starý archiv představuje téměř jinou tematickou doménu

| Výskyt v titulku nebo slugu starého příspěvku | Počet příspěvků |
|---|---:|
| Solární tématika (kořen `solarn`) | 1 055 |
| Čerpadla (kořen `cerpadl`) | 772 |
| Kanceláře (kořen `kancelar`) | 315 |
| Chodítka, rollátory, berle, vozíky, kompenzační pomůcky (úzký slovník) | **0** |
| Polohovací lůžka a postele pro seniory (úzký slovník) | **0** |
| Senior/důchodce (titulkové výrazy) | **1** |

Čísla jsou **počty shod**, ne vzájemně oddělené segmenty. Fotovoltaika a čerpadla se mohou v jednom titulku kombinovat. Nulový výskyt ve slovech **neprokazuje** nulový tematický překryv skutečných textů ani nulovou organickou návštěvnost.

Původní obsah se soustředí zejména kolem solárů, čerpadel, kancelářského a firemního vybavení. To je zásadně jiné jádro než nový poradce bezpečného domácího života. **Nelze ale bez GSC prohlašovat, že archiv už nyní snižuje hodnocení Google nebo že bude výhodné ho odstranit.**

## Kandidáti k ruční kontrole, bez rozhodnutí o přesměrování

| URL / ID | Proč k revizi | Zatímní verdikt |
|---|---|---|
| `/stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu/` · 3638 | Jediný titulkový výskyt seniorů; stoly nejsou poradce pro mobilitu | REVIEW; prověřit text a GSC, nevytvářet 301 |
| `/jak-vybrat-postel/` · 113 | Obecný výběr nábytku, jiný záměr než polohovací lůžko | REVIEW; možná ponechat jako samostatné téma |
| `/skvele-tipy-pro-vyber-nove-postele/` · 817 | Stejná obecná kategorie, nikoli řešení domácí péče | REVIEW; porovnat intent a případný traffic |
| `/cistota-na-prvnim-miste-jak-udrzet-koupelnu-hygienicky-cistou-a-vonici/` · 3195 | Hygiena/úklid ≠ bezpečné použití WC | KEEP/REVIEW, bez účelového redirectu |
| `/kouzlo-minimalismu-v-koupelne-snadne-tipy-na-udrzovani-a-organizaci-maleho-prostoru/` · 3175 | Organizace koupelny ≠ bezpečný přesun | KEEP/REVIEW |
| `/luxusni-koupelna-navody-na-uklid-a-udrzovani-koupelnovych-ploch-ve-skvele-kondici/` · 3153 | Luxusní úklid ≠ pomůcky pro soběstačnost | KEEP/REVIEW |

Existující ruční rozhodnutí doplňují `docs/LEGACY_OVERLAP_REVIEW_V1.md` a `docs/LEGACY_MOBILITY_CANDIDATE_AUDIT_2026-10-07.md`. Kandidátní URL **nepřepojovat** na nové řešení, pokud je vyhledávací záměr jiný.

## Další akce před jakoukoli změnou starých URL

1. V **Google Search Console** exportovat výkon za 28 a 90 dní podle **stránky i dotazu**, se specifikací property, rozsahu a data exportu. Změřených nula kliknutí ≠ chybějící data.
2. U všech starých URL s měřenými kliky/impresemi přiřadit typ záměru a tematickou relevanci; u kandidátů získat důkaz o externích odkazech. Nejprve řešit skutečné 404, toxické affiliate placeholdery a přesně doložené duplicity.
3. U nových poradenských URL ověřit indexaci a viditelnost, ne pouze přítomnost v sitemapě. Zatím je doložené publikování a HTTP 200, **nikoli** pozice ani organické konverze.
4. Seřadit kandidáty do KEEP / IMPROVE / MERGE_REVIEW / REPURPOSE_REVIEW / REMOVE_REVIEW. Pro každou škodlivou změnu požadovat cílovou URL, doklad návštěvnosti/zpětných odkazů a možnost rollbacku. Méně relevantní obsah se **automaticky nemaže**.
5. První obsahové růstové kroky soustředit na existující decision pages a obousměrné kontextové odkazy; žádné hromadné obecné AI články.

## Technická poznámka

Při produkčním QA verze **0.8.108** bylo zjištěno, že Yoast sitemap index i `robots.txt` používají `http://zaprazi.cz` pro vlastní XML odkazy. Výstupní HTTPS shim je připravený v **0.8.109** (PR #305), ale produkční kontrola po nasazení stále chybí. Správnou HTTPS konfiguraci původního WordPressu je nutné prověřit samostatně (issue #304), bez neuvážené změny přístupu do wp-admin.
