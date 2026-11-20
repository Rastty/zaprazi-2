# Zápraží 2.0 — projektový stav

**Aktualizováno:** 20. 11. 2026. **Zdroj pravdy:** [vize a bezpečnostní pravidla](docs/ZAPRAZI_SOURCE_OF_TRUTH.md), [Growth Graph](config/growth-state.json), produkce `zaprazi.cz` a aktuální `main`/`dev`. Toto je krátký předávací stav, nikoli náhrada měřicích důkazů.

## Cíl a fáze

Pomáhat lidem řešit praktické problémy bezpečného domova cestou **problém → Domácí poradce → vhodné možnosti → koupit / půjčit / ověřit úhradu → konkrétní bezpečná akce**. První obchodní důkaz: **schválená affiliate objednávka** přiřaditelná k relevantní návštěvě. P0 zůstává Mobility; web není obecný katalog ani medicínské doporučení.

**Stav:** funkční technický Mobility průchod; komerční validace ještě neproběhla. Dosavadní orientační odhad celkové cesty k vizi ~**35 %** je subjektivní, nikoli měřená metrika.

## Hotovo a ověřeno

- **Produkce 0.8.239:** `integrity=ok`; [postdeploy browser QA](https://github.com/Rastty/zaprazi-2/actions/runs/44706686072) SUCCESS na přesné 0.8.239 včetně **14/14 poradců**, keyboard/mobile/URL privacy a výběrových fit-gates. Samostatný `workflow_dispatch`-only Basic Consent krok není tímto PR rerunem nově dokázán; consent kód nebyl změněn.
- Affiliate runtime **25/25 nakonfigurovaných slotů** (21 CJ + 4 eHub); to **neprokazuje** skutečný redirect, objednávku, atribuci nebo provizi.
- Sedm vstupních Mobility šablon neodesílá nepotřebný core Gutenberg stylesheet, kontrolní ne-Mobility šablona jej zachovala. Dopad na reálné LCP dosud nezměřen.
- Veřejný XML audit: **54 unikátních URL / 52 povinných rozhodovacích cest**, bez Googlebot blokace a s interními odkazy. [Indexační triage](docs/SEO_INDEXATION_TRIAGE_2026_11_20.md).
- Stav 0.8.239 a GSC rizika uložen v [PR #863](https://github.com/Rastty/zaprazi-2/pull/863); `main` a `dev` synchronizované. **Žádný další WordPress deploy není kvůli dokumentaci potřeba.**

## Výsledek versus chybějící důkazy

- [Prometheus GSC, nový finalizovaný sběr 20. 11.](https://github.com/Rastty/prometheus-growth-os/actions/runs/44341902238): **14 kliků / 1 295 impresí** za 28 dní do **17. 11.** (předchozí okno do 15. 11.: 10 / 1 163). Nová URL Inspection evidence pro **15 vybraných URL**: **10 indexed / 2 excluded / 3 unknown**. Nově **homepage `/` = `crawled_not_indexed`**, `/sprchovaci-zidle-pro-seniory/` = excluded/other; tři další URL měly `inspection_unavailable`, **neprokazuje to odindexování**. Detail a předchozí snímek: [indexační triage](docs/SEO_INDEXATION_TRIAGE_2026_11_20.md). Webové HTML 0.8.239 neukazuje zjevnou technickou indexační blokaci.
- [GA4, 23. 10. – 19. 11.](docs/MEASUREMENT_BASELINE_2026-11-20.md): **17 Organic Search sessions**, z toho 11 na starých archivních sluzích, 4 na tematických současných stránkách, 2 `(not set)`; **5 startů a 5 dokončení poradce**, **1 merchant/affiliate klik** v celé vlastnosti, neprokázané jako nákupy či kvalifikovaný organický funnel.
- **Schválené affiliate provize = UNKNOWN** (uživatel dosud žádné nepotvrdil). Windsor CJ publisher účet vrací chybu advertiser-only komise; při řešení používat publisher reporting, nikoli odhad z kliků.

## Blokace a další priorita podle dopadu

1. **Prověřit aktuální stav homepage `/` jako první**: nový GSC Inspection snapshot vrací `crawled_not_indexed`, přestože veřejná 0.8.239 vrací HTTP 200, self-canonical a `index, follow`. Dále individuálně ověřit `/choditka-pro-seniory/`, `/choditko-do-bytu-pro-seniory/` (nově `inspection_unavailable`) a `/sprchovaci-zidle-pro-seniory/` (excluded/other). Vlastník v [Google Search Console](https://search.google.com/search-console/) použije *Kontrola adresy URL → Otestovat živou adresu → Požádat o indexování* jen při přetrvávajícím vyloučení a způsobilém live testu. Žádost nic negarantuje.
2. **Teprve podle page/query evidence** vybrat jednu existující relevantní Mobility vstupní URL pro konkrétní SEO/UX zlepšení; chránit proti kanibalizaci a opakovanému přepisování stejných textů. Neprodukovat hromadně nové články.
3. **Doložit affiliate obchodní smyčku:** přesný merchant/publisher deeplink a model/EAN (zejména rozpor retail MEYRA), privacy-safe funnel a síťový stav pending/approved. Dokud není důkaz, nehlásit výnos ani konverzní uplift.

**Provozní hranice:** lokální odpovědi poradce se nesmějí posílat do analytiky ani affiliate parametrů; vhodnost řešení nikdy neřadit podle provize. Rutinní změny přes dedikovanou větev → CI → PR → bezpečný merge; runtime až po odděleném WordPress Pull + Deploy a postdeploy readbacku.
