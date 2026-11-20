# Zápraží 2.0 — projektový stav

**Aktualizováno:** 20. 11. 2026. **Zdroj pravdy:** [vize a bezpečnostní pravidla](docs/ZAPRAZI_SOURCE_OF_TRUTH.md), [Growth Graph](config/growth-state.json), produkce `zaprazi.cz` a aktuální `main`/`dev`. Toto je krátký předávací stav, nikoli náhrada měřicích důkazů.

## Cíl a fáze

Pomáhat lidem řešit praktické problémy bezpečného domova cestou **problém → Domácí poradce → vhodné možnosti → koupit / půjčit / ověřit úhradu → konkrétní bezpečná akce**. První obchodní důkaz: **schválená affiliate objednávka** přiřaditelná k relevantní návštěvě. P0 zůstává Mobility; web není obecný katalog ani medicínské doporučení.

**Stav:** funkční technický Mobility průchod; komerční validace ještě neproběhla. Dosavadní orientační odhad celkové cesty k vizi ~**35 %** je subjektivní, nikoli měřená metrika.

## Hotovo a ověřeno

- **Produkce 0.8.239:** `integrity=ok`; [postdeploy browser QA](https://github.com/Rastty/zaprazi-2/actions/runs/44706686072) SUCCESS na přesné 0.8.239 včetně **14/14 poradců**, keyboard/mobile/URL privacy a výběrových fit-gates. Samostatný `workflow_dispatch`-only Basic Consent krok není tímto PR rerunem nově dokázán; consent kód nebyl změněn.
- Affiliate runtime **25/25 nakonfigurovaných slotů** (21 CJ + 4 eHub); to **neprokazuje** skutečný redirect, objednávku, atribuci nebo provizi.
- **Pasivní ověření obchodních cílů 20. 11.:** u všech **25/25** veřejně vložených affiliate URL byl bez kliknutí a bez přístupu do sítí nalezen přesný shodný `url` (CJ) nebo `desturl` (eHub) s kanonickým produktovým URL v repozitáři. Nová ochrana v `scripts/audit-live-affiliate-runtime-25.mjs` odmítá záměnu výrobku, chybějící, duplicitní nebo cizí cíl. **To potvrzuje pouze vložený cíl, ne finální redirect, publisher atribuci, objednávku či provizi.** WordPress release se nemění.
- Sedm vstupních Mobility šablon neodesílá nepotřebný core Gutenberg stylesheet, kontrolní ne-Mobility šablona jej zachovala. Dopad na reálné LCP dosud nezměřen.
- **TURBO monitor indexovatelnosti 20. 11.:** read-only GitHub SEO gate nyní kontroluje i homepage `/` spolu se čtyřmi sledovanými URL; hlídá přesnou Yoast page-sitemap položku, samotnou homepage blokovanou v `robots.txt` pro Googlebot, HTTP 200, self-canonical, `noindex` a přesný release/integritu. **5/5 živých HTTP kontrol** prošlo na 0.8.239; tento gate **nenahrazuje GSC a nemění obsah ani WordPress produkci**.
- Veřejný XML audit: **54 unikátních URL / 52 povinných rozhodovacích cest**, bez Googlebot blokace a s interními odkazy. [Indexační triage](docs/SEO_INDEXATION_TRIAGE_2026_11_20.md).
- Stav 0.8.239 a GSC rizika uložen v [PR #863](https://github.com/Rastty/zaprazi-2/pull/863); `main` a `dev` synchronizované. **Žádný další WordPress deploy není kvůli dokumentaci potřeba.**

## Výsledek versus chybějící důkazy

- [Prometheus GSC, nový finalizovaný sběr 20. 11.](https://github.com/Rastty/prometheus-growth-os/actions/runs/44341902238): **14 kliků / 1 295 impresí** za 28 dní do **17. 11.** (předchozí okno do 15. 11.: 10 / 1 163). Nová URL Inspection evidence pro **15 vybraných URL**: **10 indexed / 2 excluded / 3 unknown**. Nově **homepage `/` = `crawled_not_indexed`**, `/sprchovaci-zidle-pro-seniory/` = excluded/other; tři další URL měly `inspection_unavailable`, **neprokazuje to odindexování**. Detail a předchozí snímek: [indexační triage](docs/SEO_INDEXATION_TRIAGE_2026_11_20.md). Webové HTML 0.8.239 neukazuje zjevnou technickou indexační blokaci.
- [GA4, 23. 10. – 19. 11.](docs/MEASUREMENT_BASELINE_2026-11-20.md): **17 Organic Search sessions**, z toho 11 na starých archivních sluzích, 4 na tematických současných stránkách, 2 `(not set)`; **5 startů a 5 dokončení poradce**, **1 merchant/affiliate klik** v celé vlastnosti, neprokázané jako nákupy či kvalifikovaný organický funnel.
- **Nový průřez GA4 podle kanálu (20. 11.):** všech 5 `builder_start` i 5 `builder_complete` připadá na Direct (2/2), Referral (1/1) a AI Assistant (2/2); **Organic Search má 17 relací, ale žádnou pozorovanou funnel událost**. Jediný `merchant_click`/`affiliate_click` spadá pod **Direct**. To nejsou párované relace ani důkaz nákupu, viz [anonymní rozklad](docs/MEASUREMENT_BASELINE_2026-11-20.md).
- **Schválené affiliate provize = UNKNOWN** (uživatel dosud žádné nepotvrdil). Windsor CJ publisher účet vrací chybu advertiser-only komise; při řešení používat publisher reporting, nikoli odhad z kliků.

## Blokace a další priorita podle dopadu

1. **Sledovat reakci GSC na homepage `/`:** vlastník 20. 11. ukázal způsobilý *živý test* (indexovatelná, jedna platná navigační struktura) a potvrdil, že **požádal o indexaci**. Původní inspekční stav zůstává `crawled_not_indexed`, dokud nový GSC snapshot neprokáže změnu; žádost se **neopakuje**, neznamená indexaci. Individuálně ověřit také `/choditka-pro-seniory/`, `/choditko-do-bytu-pro-seniory/` (`inspection_unavailable`) a `/sprchovaci-zidle-pro-seniory/` (excluded/other) při další návštěvě GSC; živá HTML brána u všech 5 URL na 0.8.239 prošla.
2. **Podle page/query evidence** prověřit existující relevantní Mobility vstupní URL (nyní `/choditko-na-pojistovnu/`: jen 50 impresí, 1 klik za 28 dní do 17. 11.; záměr dotazů zatím není bezpečně dostupný) a vybrat jedinou opodstatněnou SEO/UX změnu. Nepřepisovat texty bez nového poznatku.
3. **Doložit affiliate obchodní smyčku:** vložený produktový cíl 25/25 je nyní ověřen, ale skutečný **publisher redirect/atribuce**, přesný model/EAN (zejména rozpor retail MEYRA), privacy-safe funnel a síťový stav pending/approved zůstávají neověřeny. Windsor CJ konektor nabízí jen advertiser komise a publisher účet odmítá; nehlásit výnos ani konverzní uplift.

**Provozní hranice:** lokální odpovědi poradce se nesmějí posílat do analytiky ani affiliate parametrů; vhodnost řešení nikdy neřadit podle provize. Rutinní změny přes dedikovanou větev → CI → PR → bezpečný merge; runtime až po odděleném WordPress Pull + Deploy a postdeploy readbacku.
