# Zápraží 0.8.202 — průchod měření → bezpečné získání chodítka

## Konkrétní slabina a zásah (2026-11-08)

Na stávající stránce `/co-zmerit-pred-vyberem-choditka/` bylo sedm praktických měření a tři odkazy do poradců, ale chyběl rychlý, srozumitelný přechod k rozhodnutí, jak pomůcku získat. To brzdí právě návštěvníka přicházejícího z nově vylepšeného `/choditko-na-pojistovnu/`, kde odkaz na měření tvoří součást bezpečného rozhodování. Nejde o hledání nového SEO klíčového slova ani důkaz současné konverzní ztráty — je to **pozorovaný nedokončený rozhodovací krok v existujícím obsahu**.

V sekci `#co-po-mereni`, **za** třemi bezpečnými cestami do poradců, jsou nyní tři volby:
1. **ePoukaz** → `/choditko-na-pojistovnu/#priprava-pro-lekare` (praktické otázky pro lékaře a oprávněnou výdejnu).
2. **Dočasné půjčení** → `/pujceni-choditka/#rozpocet-pujceni-choditka` (rozpočet, kauce, doprava, bezpečně určený typ).
3. **Přímý nákup** → `/#poradce` (existující bezpečný typový Advisor, následné konkrétní offer-fit potvrzení).

Žádný přímý affiliate odkaz, diagnóza, nárok, nová cenovka nebo zkrácená obchodní cesta. Pouze poslední link má už používaný obecný `data-zp-journey="advisor"` pro souhlasově omezené měření `guide_advisor_click`, bez odpovědí, cílových URL a zdravotních dat v událostech.

## Evidence a zdroje

- Všechny tři existující cílové kotvy byly ověřeny v repozitáři při návrhu. Očekávaná skutečná navigace je kontrolována read-only Chrome testem po nasazení.
- Pravidla úhrady nezavádíme znova: nová sekce odkazuje na dříve ověřené [SÚKL](https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/) a [VZP](https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka) podklady přímo na navazující stránce.
- Poslední doložená GSC baseline celého Zápraží: 884 impressions / 11 organic clicks za 28 dní, zdroj https://github.com/Rastty/prometheus-growth-os/actions/runs/42235726854. To **není** baseline měřicí stránky ani důkaz změny pořadí výsledků či výnosů.

## Vydání a přijímací podmínky

- Release `0.8.202` je koordinován přes **100/100** markerů včetně `functions.php`, `style.css` a přepočítaných čtyř critical Git blob pinů. Změna chování pouze na jedné existující stránce; ostatní soubory jsou marker-only.
- Unit test hlídá původních 7 měření, pořadí bezpečné návaznosti, přesně tři správné cíle, žádný merchant bypass a integritu celé verze.
- PR CI / archivní fidelity / předběžná produkční Chrome QA musí být zelené; PR kontroluje aktuální publikovanou verzi `0.8.201` a **neprokazuje**, že 0.8.202 už běží.
- Po merge a bezpečném fast-forward `main=dev` následuje ruční `Deployer for Git → dev → Pull + Deploy`. Teprve pak se spustí nezávislý přesný `scripts/audit-live-walker-acquisition-202.mjs` a plná 14-Advisor produkční akceptace.
- Výsledky posuzovat po srovnatelném intervalu z GSC a consent-only GA4 (vstupy do poradce); affiliate provize bez výkazů schválených obchodní sítí zůstávají neověřené.
