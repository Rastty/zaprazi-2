# Zápraží — interní odkazy klíčových stránek: živá kontrola (11. 10. 2026)

## Výsledek, zdroj a omezení

Zdroj: produkční read-only Chrome + HTTPS GET v [GitHub Actions #38153752318](https://github.com/Rastty/zaprazi-2/actions/runs/38153752318), workflow **Live Internal Link Health Audit**, 2026-10-11 16:02 UTC. Test zkontroloval veřejně dostupné **HTML odkazy v `<main>`** homepage a 26 prioritních poradenských / obsahových URL projektu. Klik na affiliate / obchodníka ani WordPress zápis neproběhl.

| Metrika | Zjištění |
|---|---:|
| Zdrojových stránek | **27** |
| HTML odkazů v jejich `<main>` | **260** |
| Unikátních bezpečných first-party HTML cílů | **28** |
| HTTP 200 | **28 / 28** |
| 301/302 (redirect) | **0** |
| Chybový HTTP status / síťová chyba | **0** |
| Odkazy přes nebezpečné/query/merchant cesty, které kontrola vyřadila | **0** |

Žádné prokázané rozbité interní odkazy na nových klíčových stránkách. Kromě původních 27 stránek byl kontrolovaný i cíl `/ochrana-soukromi/`. Výsledky neprokazují, že všech 260 odkazů má pro návštěvníka nejvýstižnější anchor ani že je starý archiv bez mrtvých odkazů. Předchozí [editorial audit #38150455035](https://github.com/Rastty/zaprazi-2/actions/runs/38150455035) ověřil u těchto 27 stránek self-canonical, H1 a obsahovou síť 200 propojení; to je jiná metrika než 260 HTML href (počítá i self-odkazy a opakování).

## Jak zopakovat

```bash
node --test tests/internal-link-health.test.js
node scripts/audit-live-internal-links.mjs
```

Pro prohlížečový skript je potřeba Chrome a `puppeteer-core`, které GitHub workflow dočasně instaluje. HTTPS testy deduplikují cílové stránky, GET má `redirect:manual`, vyhýbá se WP API, click/affiliate přesměrováním, dotazovým parametrům a přílohám. Žádný endpoint se nemění. Příští větší vydání může audit spustit ručně přes workflow.

## Co zůstává

- **0.8.110**: v GitHubu připravená oprava meta popisu metodické stránky; čeká na Pull + Deploy, aby šlo ověřit živý SEO výsledek.
- **GSC:** nejsou k dispozici čísla indexace, skutečných zobrazení, kliků ani ranking. Nespekulovat o organické návratnosti.
- **Historický archiv:** 4 360 původních postů nebylo v tomto bloku procházeno. Jejich případná migrace/noindex/301 vyžaduje GSC a individuální posouzení záměru a externích odkazů.
- **Výkon:** reálná PageSpeed/CrUX baseline a její dopad na konverze zůstává oddělenou prací.
