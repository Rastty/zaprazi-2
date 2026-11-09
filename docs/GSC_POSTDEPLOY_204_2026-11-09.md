# Zápraží — 0.8.204 produkčně ověřeno + GSC 28d baseline (9. 11. 2026)

## Produkce je ověřená, ne pouze hlášená jako deployed
- [Automatický monitor po WP deployi](https://github.com/Rastty/zaprazi-2/actions/runs/42587263649) zjistil `source_release=0.8.204`, `live_release=0.8.204`, sedm publikovaných cest a `affiliate_slots=25`; následně vyžádal celý postdeploy Chrome QA.
- [Plný produkční Chrome suite](https://github.com/Rastty/zaprazi-2/actions/runs/42587307000) dokončil SUCCESS včetně mobility, koupelny, SEO, bezpečnosti a návazných odkazů. Je to produkční technické a UX ověření, nikoli doklad ekonomických výsledků.
- Verze 0.8.204 zlepšila existující `/pujceni-choditka/`: praktická čtyřkroková odpověď na první obrazovce, datované zdroje půjčovného a bezpečné rozdělení do poradce a ePoukazu. Změny titulku/meta popisu jsou pro `/pujceni-choditka/` a `/choditko-na-pojistovnu/`. Nasazení tohoto releasu samo nezaručuje Google indexaci ani změnu zobrazeného snippet textu.

## Ověřená organická data — přesné období
Zdroj: [Prometheus autorizovaný GSC readonly běh](https://github.com/Rastty/prometheus-growth-os/actions/runs/42587662860), property `https://zaprazi.cz/` (siteOwner), typ vyhledávání web, `dataState=final`.
- **2026-10-10 až 2026-11-06 včetně (28 dokončených dní): 9 kliknutí / 941 zobrazení**, vypočtené CTR 0,96 %, průměrná pozice 20,13.
- Předchozí baseline **2026-10-07 až 2026-11-03** byla 11 kliknutí / 884 zobrazení. Okna se překrývají v 25 dnech a obě předcházejí dnešnímu release 0.8.204. **Není to A/B test, důkaz SEO regresu, poklesu ani nárůstu způsobeného dnešním deployem.**

### GSC pozorované existující URL
| URL | Kliky | Zobrazení | CTR | Prům. pozice |
|---|---:|---:|---:|---:|
| /choditko-na-pojistovnu/ | 1 | 60 | 1,67 % | 10,43 |
| /kompenzacni-pomucky-pro-seniory/ | 0 | 23 | 0 % | 60,57 |
| /rollator-pro-seniory/ | 0 | 9 | 0 % | 6,67 |
| /koupelna-a-wc/ | 0 | 9 | 0 % | 37,22 |
| /invalidni-vozik/ | 0 | 7 | 0 % | 14,43 |
| /polohovaci-postel/ | 0 | 7 | 0 % | 58,43 |
| /pujceni-choditka/ | 0 | 5 | 0 % | 5,40 |
| /navrat-z-nemocnice/ | 0 | 3 | 0 % | 11,00 |

- Jde pouze o vybrané kanonické URL s řádkem v GSC; ostatní mají stav UNKNOWN, nikoliv prokazatelně nula či neindexováno. Page-level součty nejsou sitewide metriky.
- Nové [privacy-safe intent skupiny v Prometheovi](https://github.com/Rastty/prometheus-growth-os/pull/1552) byly skutečně vyzkoušeny, ale pro tuto malou návštěvnost nedosáhly prahu 10 impresí / 3 nezávislé dotazové řádky v jediné kategorii: `no_safe_groups_or_unavailable`. **Nevydávat to za nulový zájem.** Surové GSC vyhledávací fráze ani osobní dotazy se do GitHubu nevkládají.

## SEO prioritizace po deployi
1. **P0: Ponechat 0.8.204 v klidu a sbírat skutečné postdeploy GSC datum.** U `/choditko-na-pojistovnu/` je aktuálně nejsilnější doložený signál (60 impresí, průměr 10,43), ale verze 0.8.201/204 již stránku obsahově a meta vylepšila; další přepis bez nových page-filtered dotazů by byl guesswork.
2. **P1: Ověřit Google indexaci a sitemap coverage hlavních moderních URL.** Absence GSC řádku nebo 5 impresí není sama důkaz neindexace. Konzervativní read-only URL inspection / GSC metadata, ne falešné mass index requesty.
3. **P1: Zlepšovat konkrétní existující stránky/huby podle potřeb:** `/pujceni-choditka/`, `/rollator-pro-seniory/`, `/choditka-pro-seniory/`, případně `/navrat-z-nemocnice/`. Pro každou jednu stránku potřebujeme SERP gap, odlišný záměr, vlastní přidanou hodnotu a související odkazy. Nevytvářet duplicitní množství článků.
4. **Ověřit po 14 a 28 dnech:** příslušné page-level GSC clicks, impressions, CTR a pozici za srovnatelná dokončená období; oddělit consent-only `guide_advisor_click` od skutečného začátku poradce a komerčních kliků. Schválené affiliate provize zůstávají UNKNOWN.

## Zápis do Growth Graphu
`config/growth-state.json` má novou GSC dvojici 9/941 se zdrojem a `safety_qa.verifiedRelease=0.8.204` teprve po doloženém plném postdeploy QA. Stav `intent_evidence=in_progress`, protože bezpečně publikovatelné intent skupiny stále chybí. Žádné WordPress změny, nová URL, blogový draft ani deploy v tomto PR.
