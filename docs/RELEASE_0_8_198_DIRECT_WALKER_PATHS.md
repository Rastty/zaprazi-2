# Zápraží 0.8.198 — přímé bezpečné cesty z rozcestníku chodítek

**Připraveno 7. 11. 2026.** Tento dokument ani GitHub merge nejsou důkaz WordPress deploye.

## Doložený problém a řešení

Na produkční `/choditka-pro-seniory/` byly před změnou na prvním displeji odkazy do hlavního poradce a obsahu; přímé specializované vstupy do bezpečných průvodců pro chodítko do bytu a rollátor byly až výrazně níže v článku.

Nově jsou hned u hlavního tlačítka dvě jednoznačné interní odkazy:
- **Hlavně doma: poradce pro chodítko** → `/choditko-do-bytu-pro-seniory/#poradce-choditko-byt`
- **Venku: poradce pro rollátor a brzdy** → `/rollator-pro-seniory/#poradce-rollator`

Jediné hlavní CTA „Ověřit vhodný typ v poradci“ dál vede do `/#poradce`, takže nerozhodný návštěvník nezačíná automaticky výběrem produktu. Sekundární odkazy nejsou označené jako primární `guide_advisor_click` a nenesou žádné odpovědi ani parametry. Úvod vysvětluje, že přechod neznamená ověřenou individuální vhodnost. Odkazy na srovnání typů, měření a koupit/půjčit/úhrada zůstávají.

## Release integrita

- `style.css Version: 0.8.198` a `functions.php ZAPRAZI_RELEASE=0.8.198`.
- Všech 100 ne-kritických souborů z runtime manifestu má marker `ZP_RELEASE_0_8_198`. Kontrolní Git blob piny obou kritických Mobility souborů jsou přepočítané po změně release markeru; piny dvou Bathroom souborů zůstávají stejné. Rozhodovací logika se nemění.
- Nová statická regrese kontroluje dva skutečné interní cíle, existující kotvy, jedinou hlavní cestu a žádné merchant ani health parametry.
- Nový `scripts/audit-live-walker-hero-198.mjs` po skutečném deployi v mobilním Chromu odmítne volitelné měření, klikne obě cesty, ověří správné kotvy, verzi 0.8.198 a integrity `ok`. Blokuje externí a non-GET requests, nemá nákupní interakce.

## Povinný release gate

1. Sloučit PR pouze po zeleném celém CI, bez nových nevyřešených blokací.
2. Synchronizovat `dev` přesně fast-forward na schválený commit `main` a nechat proběhnout read-only deploy-ref-preflight.
3. Správce WordPressu provede **Deployer for Git → dev → Pull + Deploy**. GitHub sám WordPress nezmění.
4. Zkontrolovat živou `0.8.198` a `integrity=ok` na readiness API, plus 25/25 nakonfigurovaných pozic.
5. Spustit **Production Advisor Browser QA** na správné revizi po deployi, včetně nového Chromu a všech 14 poradců. Pokud není možné spustit ručně, nevydávat samotné zelené CI za postdeploy QA.
6. Až po úspěšné kompletní produkční akceptaci aktualizovat `config/growth-state.json` z `0.8.197` na `0.8.198` s přesným URL QA důkazu.

## Měření

Hypotéza: méně navigačních kroků na správný bezpečný poradce. Později vyhodnotit privacy-safe agregáty před/po, pokud je dostatek srovnatelných návštěv, a kvalitativní feedback. Přímé sekundární cesty nejsou samostatně trackované, proto z obecné události `guide_advisor_click` nelze odvozovat jejich CTR. Žádná skutečná SEO změna, affiliate objednávka nebo uplift nejsou v době PR potvrzené.
