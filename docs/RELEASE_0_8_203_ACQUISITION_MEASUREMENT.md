# Zápraží 0.8.203 — měřitelné a anonymní návazné kroky

## Východisko a změna (2026-11-08)

Na produkčně ověřené `0.8.202` existují tři skutečně funkční karty v `/co-zmerit-pred-vyberem-choditka/#co-po-mereni`, ale consent-only GA4 měří pouze třetí přechod do poradce jako `guide_advisor_click`. Dvě informační cesty k ePoukazu a dočasnému půjčení proto v konverzním trychtýři chyběly.

**0.8.203** rozšiřuje už existující a povolenou anonymní událost `next_step_click` na přesně tyto dvě cesty. `guide_advisor_click` zůstává samostatný; klik do poradce se nikdy nezapočítává dvakrát. Událost má **jen název**, žádnou kategorii volby, cílovou URL, zdravotní stav, parametry, identifikátory produktu nebo obchodníka. Adapter odesílá pouze po výslovném GA4 souhlasu a nikdy na WordPress vyhledávání.

## Skutečná data a omezení

- Aktivní měřicí stream veřejného webu: `G-WM86QVXVST`. **Není známé a potvrzené číselné GA4 property ID pro Zápraží ani důkaz, že je jeho BigQuery export přístupný.** Konektor Windsor.ai při kontrole 8. 11. 2026 vracel jiný GA4 účet. Nepřevzít metriky cizího webu, nedomýšlet chybějící data jako nulu.
- `scripts/ga4-bigquery-readonly.mjs` vytváří čtvrté **read-only** SQL, které může po ověření správné property a exportu počítat jen `page_view`, `next_step_click`, `guide_advisor_click` pro dvě *pevné veřejné* kohorty `walker_measurements`, `walker_insurance`. Žádné řádky uživatelů, URL parametry nebo rozměry pomůcek.
- Pozor: počty eventů jsou jen měřeným vzorkem souhlasících prohlížení, nikoliv unikátními lidmi, dokončením poradce či potvrzenými objednávkami. `next_step_click` na jiných stránkách zahrnuje i přechody z výsledku poradce; pro smysluplnou interpretaci je potřeba filtrovat na přesnou veřejnou stránku.
- Poslední doložený GSC agregát celé domény je 11 organic clicks a 884 impressions / 28 dní. **Výsledky změny z toho nyní odvodit nelze.** Stav a datum `config/growth-state.json` zůstávají beze změny.

## Bezpečné vydání

- Všechny **100/100** kontrolované source files mají synchronní marker `ZP_RELEASE_0_8_203`, `functions.php` release a `style.css` verzi; přesné Git blob piny čtyř kritických souborů přepočítány.
- Reálné změny návštěvnického chování jen v `assets/js/analytics-consent.js` a veřejné vysvětlení v `page-ochrana-soukromi.php`; poradců, fit-gate, cen ani affiliate URL se nedotýkáme. Ostatní runtime soubory jsou **marker-only**.
- Nové izolované testy ověřují explicitní souhlas, odmítnutí, vyhledávání, dva správné obecné eventy, jeden Advisor event bez dvojího započtení, blokaci externích cest a bezparametrový GA4 transport. Existující `tests/walker-measurement-acquisition-202.test.js` už neblokuje budoucí release jen kvůli starému hardcodovanému číslu.
- Po PR CI + Legacy archive fidelity + přednasazovacím Chrome QA následuje merge a safe sync `main=dev`. **Nasazení WordPressu musí provést vlastník** pomocí Deployer for Git `dev` Pull + Deploy. Bez něj nejsou nová měření aktivní.
- Po nasazení úplný produkční Chrome běh 14 Advisor + `scripts/audit-live-walker-next-step-events-203.mjs`: simuluje lokálně udělení a odmítnutí souhlasu, ale **blokuje všechny třetí strany** včetně Google, aby nevznikaly falešné analytické události v externích systémech. Kontroluje 2× `next_step_click`, 1× `guide_advisor_click` při souhlasu a nulu při zamítnutí.
- Schválené provize a organický uplift musí pocházet ze skutečných srovnatelných period a sítí, nikoli z úspěchu CI nebo klikových eventů.
