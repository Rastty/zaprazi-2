# Zápraží 2.0 — první mobilní Lighthouse baseline (11. 10. 2026)

## Metodika a důkaz

- Zdroj: [GitHub Actions run #38154470010](https://github.com/Rastty/zaprazi-2/actions/runs/38154470010), `Live Mobile Lighthouse Baseline`.
- Nástroj: **Lighthouse CLI 13.5.0**, Node 22, headless Chrome na GitHub runneru, kategorie `performance`, defaultní mobilní simulace.
- 1 běh na URL; každá analyzovaná URL má vlastní report (JSON artefakty běhu se ukládají 7 dní). Datum měření 2026-10-11 16:12 UTC.
- Zachovaný veřejný WordPress bez přihlášení, test nezadává odpovědi do poradců a nezpůsobuje merchant click.

| Stránka | Lighthouse performance | LCP (lab) | FCP (lab) | CLS (lab) | TBT (lab) | Speed Index | First-party transfer |
|---|---:|---:|---:|---:|---:|---:|---:|
| [Homepage](https://zaprazi.cz/) | **100/100** | 949 ms | 949 ms | 0 | 0 ms | 2 046 ms | 63 KiB |
| [Koupelna a WC](https://zaprazi.cz/koupelna-a-wc/) | **100/100** | 1 063 ms | 1 063 ms | 0 | 0 ms | 1 794 ms | 65 KiB |
| [Noční cesta z postele na WC](https://zaprazi.cz/nocni-cesta-z-postele-na-wc/) | **100/100** | 907 ms | 907 ms | 0 | 0 ms | 1 547 ms | 44 KiB |

U všech tří stránek Lighthouse neidentifikoval žádný first-party asset nad **80 000 přenesených bajtů**.

## Co výsledky znamenají — a neznamenají

Jedná se o **jednotlivé laboratorní simulace**, nikoli o zjištění reálného 75. percentilu návštěv, skutečné INP, CrUX či o důkaz, že všechny telefony načítají stránky za sekundu. Pro přesný trend měření opakovat se stejnou verzí nástroje, mobilní konfigurací a několika běhy v různých časech. Consent-only analytika nemusí být při čistém anonymním otevření vůbec načtena; netestujeme chování všech variant souhlasu.

**Rozhodnutí:** nedělat preventivní zásahy do render path a schválených Decision Engine skriptů, když měření zatím neukazuje rychlostní regresi ani konkrétní pomalý asset. Starší [PR #199](https://github.com/Rastty/zaprazi-2/pull/199) o odložení analytics adaptéru není měřením opodstatněn jako P0; bez potřeby ho nemergovat.

## Další práce

- Ověřit případná field Core Web Vitals data z Search Console / CrUX, pokud jsou dostupná, včetně objemu skutečných návštěv. Nedostupná data nejsou nula.
- Po nasazení budoucího frontend kódu opakovat stejné tři měřené URL v workflow `Live Mobile Lighthouse Baseline` a porovnávat několik běhů, ne jediné skóre.
- Nevracet se teď k rychlosti pouze kvůli získání vyššího Lighthouse skóre; pokračovat obsahovou kvalitou, indexací a uživatelským feedbackem k 14 poradcům.
