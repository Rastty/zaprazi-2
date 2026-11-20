# Zápraží — cílené ověření indexace tří vstupních URL, 20. 11. 2026

## Proč teď

Nejnovější dostupný finalizovaný [Prometheus Core GSC snapshot](https://github.com/Rastty/prometheus-growth-os/actions/runs/44341902238) je **19. 10. – 15. 11. 2026**: 10 kliků / 1 163 impresí v Google Search. Export artefaktu `prometheus-zaprazi-gsc-28d-sanitized` zahrnuje 15 vybraných URL Inspection výsledků: **12 indexed / 3 excluded**. Jde o omezený sledovaný vzorek, nikoli o podíl indexovaných URL celého webu. URL Inspection je snapshot Google evidence, ne živé zobrazení nově nasazeného WordPressu.

| Přesná URL | Poslední exportovaný GSC stav | Bezprostřední další krok |
|---|---|---|
| `/choditka-pro-seniory/` | `discovered_not_indexed`, bez evidovaného Google crawlu | V GSC **URL Inspection → Test live URL**; jen pokud stále vyloučeno a live test je způsobilý, požádat o indexaci |
| `/choditko-do-bytu-pro-seniory/` | `other`, bez bližšího bezpečně ověřeného důvodu | Nejprve přečíst aktuální důvod v detailu URL Inspection; neodvozovat z `other` automaticky řešení |
| `/sprchovaci-zidle-pro-seniory/` | `discovered_not_indexed`, bez evidovaného Google crawlu | Stejný individuální URL Inspection / live test; teprve potom případná žádost |

## Aktuální veřejná technická brána

Po přijetí **produkčního WordPress 0.8.239** proběhl bez přihlášení read-only GET auditu všech tří URL. Každá:

- vrací **HTTP 200** s `zaprazi-release=0.8.239`, `meta robots="index, follow"`, bez `X-Robots-Tag` blokace;
- má **jediný vlastní HTTPS canonical** se správným přesným URL a je v živém Yoast `/page-sitemap.xml` (HTTP 200);
- je prolinkována z homepage a dalších tematických hubů; stránka pro vnitřní chodítka má navíc přímý odkaz z `/choditka-pro-seniory/`. Webový `/robots.txt` odpovídá HTTP 200 bez root-wide `Disallow: /`.

Tyto signály **nenacházejí na právě nasazeném webu zjevnou technickou blokaci indexace**. Neprokazují, že Google URL již indexoval nebo že nemůže existovat jiná technická / kvalitativní příčina. Sitemapa ani interní odkazy indexaci negarantují. V této fázi **nepřidávat hromadné redirecty, nové články, `noindex`, duplicitní SEO titulky ani umělé datum poslední změny**.

Nezávislý existující `node scripts/audit-public-sitemap.mjs` na produkci 0.8.239 ověřil **54 unikátních kanonických URL**, všech **52 povinných rozhodovacích cest** přítomných, bez duplicit, bez root-wide blokace a bez specifických Googlebot `Disallow` pravidel pro rozhodovací URL. Ani tento výsledek není důkazem indexace Googlem.

## Bezpečná akce vlastníka a následné měření

1. Otevřít [Google Search Console](https://search.google.com/search-console/) pro přesnou vlastnost `https://zaprazi.cz/`. Každou výše uvedenou plnou URL zkontrolovat ve vrchním poli *Kontrola adresy URL* a zapsat aktuální důvod vyloučení, Google canonical a datum crawlu.
2. Použít *Otestovat živou adresu URL*. Pokud je stránka způsobilá a Google ji stále neindexoval, lze zvolit *Požádat o indexování*. Dle [oficiálního návodu Googlu](https://support.google.com/webmasters/answer/9012289?hl=en) **žádost není zárukou indexace**.
3. Po konečném 7–14denním GSC okně vyhodnotit **jednotlivé URL a jejich relevantní dotazy**, odděleně od 4 359 historických archivních URL a od Direct/AI Assistant provozu v GA4. Pokud bude důvod `Crawled - currently not indexed`, posoudit relevanci a unikátní užitek stránky před jakoukoli cílenou změnou.

**Přístup:** Windsor.ai přímý Search Console konektor momentálně uváděl jen `klix.cz`; Zápraží GSC důkaz pochází z již propojeného Prometheus Core. Neznamená to, že vlastnost Zápraží v Google Search Console neexistuje. Žádná žádost o indexaci ani změna nastavení Googlu touto prací provedena nebyla.

**Rozhodnutí:** V tuto chvíli není doložený důvod měnit WordPress runtime. Následující zásah určí nová GSC URL Inspection evidence, nikoli spekulace nad nízkým organickým trafficem.
