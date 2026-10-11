# Zápraží 2.0 — první úplný veřejný sitemap baseline (11. 10. 2026)

## Zdroj a hranice tvrzení

- Přímé čtení **živého webu** `https://zaprazi.cz` v GitHub Actions **Public SEO Sitemap Audit**, run [#38148759123](https://github.com/Rastty/zaprazi-2/actions/runs/38148759123).
- UTC čas sběru: **2026-10-11 14:50**.
- Kontrolováno: veřejný `robots.txt`, Yoast `sitemap_index.xml`, **všech devět** dílčích XML sitemap. Samostatný JavaScript nástroj `scripts/audit-public-sitemap.mjs` nic nemění v produkční databázi ani v administraci.
- **Nejde o Google Search Console:** přítomnost v XML sitemapě neprokazuje indexaci, Google rank, reálné kliky, impressions, schválené provize ani obsahovou kvalitu článků.

## Naměřený inventář

| Dílčí sitemap | URL | Protokol jednotlivých `<loc>` |
|---|---:|---|
| `post-sitemap.xml` | 1 000 | HTTPS |
| `post-sitemap2.xml` | 1 000 | HTTPS |
| `post-sitemap3.xml` | 1 000 | HTTPS |
| `post-sitemap4.xml` | 1 000 | HTTPS |
| `post-sitemap5.xml` | 360 | HTTPS |
| `page-sitemap.xml` | 31 | HTTPS |
| `category-sitemap.xml` | 11 | HTTPS |
| `post_tag-sitemap.xml` | 32 | HTTPS |
| `author-sitemap.xml` | 1 | HTTPS |
| **Celkem** | **4 435** | **4 435 HTTPS** |

Zkontrolováno 26 existujících prioritních URL Zápraží (hlavní poradci, praktické návody, nákup/půjčení/úhrada, metodika): **26/26 nalezeno**, žádné chybějící. **4 435 unikátních cest**; v tomto crawl snapshotu nezjištěna duplicita mezi uvedenými XML položkami. Číselně souhlasí starší inventura 4 360 starých postů, ale to samo není důkaz, že se původní obsah od exportu nijak nezměnil.

## Jedna konkrétní technická závada

- `robots.txt` vrací `Sitemap: http://zaprazi.cz/sitemap_index.xml`.
- Hlavní index obsahuje **9/9** dílčích `<loc>` s `http://`.
- **Dílčí XML jsou již všechna správně na HTTPS**, proto hlavní problém není 4 435 obsahových odkazů, ale vstupní router sitemap indexu / robots.
- Oprava jen veřejného výstupu připravena v release **0.8.109** ([PR #305](https://github.com/Rastty/zaprazi-2/pull/305)); zatím není doložený produkční deploy 0.8.109. Po deployi vyžaduje test v `tests/production-advisor-smoke.mjs` pouze HTTPS v robots, indexu i page sitemapě.
- Základní WordPress `home/siteurl`/reverse proxy řešit až bezpečně po admin záloze (GitHub issue [#304](https://github.com/Rastty/zaprazi-2/issues/304)). Nezměnit naslepo přihlašovací URL.

## Opakovatelnost a akce

```bash
node scripts/audit-public-sitemap.mjs
node --test tests/public-sitemap-audit.test.js
```

GitHub Action `Public SEO Sitemap Audit` spouštět po každém větším vydání a při SEO incidentu. Díky pevnému seznamu 26 URL ihned ukáže případné vypadnutí nové důležité stránky ze sitemapy; nenahrazuje test live HTTP statusu těchto stránek, který kryje samostatný Advisor QA smoke.

**Další SEO brána:** export výkonu z Google Search Console za 28 a 90 dní (po stránkách a dotazech), včetně datumového rozsahu a property; spojit s `data/legacy-url-inventory.csv`. Žádný hromadný noindex, redirect ani mazání 4 360 historických URL bez GSC evidence a posouzení skutečného záměru.
