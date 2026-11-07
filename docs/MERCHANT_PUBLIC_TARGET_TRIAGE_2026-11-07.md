# Public merchant target audit — 2026-11-07

## Evidence and scope

Read-only public canonical product target probe: [Merchant Health workflow #42333076522](https://github.com/Rastty/zaprazi-2/actions/runs/42333076522), artifact `merchant-public-targets` (created 2026-11-07 03:14 UTC; main `b9b66c0`). This is **not** an affiliate redirect test, product identity verification, stock check, conversion or commission report.

| Outcome | Count |
|---|---:|
| HTTP 200, product identity unverified | 22 |
| HTTP 404, review needed | 1 |
| HTTP 403, access unverifiable | 2 |
| Unexpected redirect / non-HTML / other | 0 |
| **Total** | **25** |

## Concrete triage queue

1. **P1 — `zdrava-obuv-cz:xavier`**: `not_found_review`, HTTP 404. Check whether the exact canonical product has moved, been withdrawn, or temporarily failed. Verify identity and a replacement merchant page manually before changing any offer; do **not** automatically redirect to a category or substitute a different product.
2. **P1 — `lekarna-cz:meyra-ideal-3061982`**: `access_unverifiable`, HTTP 403. A blocked automated probe does not prove a dead product. Validate with authorized/manual browser access and exact identity, or retain UNKNOWN.
3. **P1 — `drmax-cz:dma-eh-cmda`**: `access_unverifiable`, HTTP 403. Same UNKNOWN treatment; do not bypass anti-bot controls.
4. **P2 — 22 HTTP 200 results**, including Mobility BESCO WA17 and WA21: response reachability alone does not verify product identity, availability, specifications or affiliate deeplink validity. Keep product-level evidence requirements and existing fit gates.

## Nezávislá veřejná evidence XAVIER — prověřeno 7. 11. 2026

- **Zdroj identity:** [PodoWell XAVIER u Štěpánková & C.](https://www.zdrava-obuv-eshop.cz/xavier-ortopedicka-obuv-extrasiroka-pro-otekle-nohy-unisex-cerna-podowell/). Při kontrole dne 7. 11. se zobrazila *indexovaná kopie* produktové HTML stránky; její poskytovatel uváděl poslední crawl přibližně **6 dní před kontrolou**. To není aktuální live HTTP ani prohlížečový test obchodníka.
- **Doložená identita v této kopii:** nadpis odpovídá „PodoWell XAVIER … unisex černá“, stránka uvádí kód varianty `5031/40`, šířku K+, plnou špičku a zapínání na suchý zip. Evidence svědčí pro existenci stejnojmenného modelu při posledním crawlu, **nepotvrzuje dostupnost ani platnost URL dnes**.
- **Rozpor zdrojů:** GitHub Actions #42333076522 dne 7. 11. skutečně vrátil na kanonickou URL HTTP 404. Starší indexovaná kopie nemůže vyvrátit nynější 404, ale naznačuje, že stránka v nedávné době existovala. Důvod rozdílu a současný stav zůstávají **NEOVĚŘENÉ**.
- **Rozhodnutí:** dočasně neměnit produktovou identitu, pořadí ani routing **bez aktuálního manuálního ověření** cílové stránky v běžném prohlížeči a skutečné publisher affiliate URL. Stejně tak ze staré kopie nevyvozovat, že je aktuální prodejní cesta funkční. Nenahrazovat automaticky jiným produktem ani neobcházet fit-gate.
- **Potřebný další důkaz:** aktuální reakce v běžném prohlížeči včetně přesné identity a varianty, kontrola přímé produktové a affiliate cesty bez záznamu tracking tokenů. Dvě odpovědi HTTP 403 zůstávají UNKNOWN. Pokus o lokální kontrolu přímým HTTP požadavkem nebylo možné dokončit pro nedostupné DNS v kontrolním prostředí (nikoli pro potvrzený stav obchodu).

## Acceptance for follow-up

- Record merchant-approved exact product identity, canonical URL, checked date and source before any offer routing change. Do not store signed/tracking URLs or credentials in public artifacts.
- If the 404 is confirmed, propose a narrowly scoped fix with a regression test for the affected offer, without changing recommendation order or unlocking a safety gate.
- Preserve the current WordPress deploy gate: PR + required green CI, explicit WP deployment authorization and production smoke where relevant.
- Keep `affiliate_audit` **in_progress**: this report is an audit input, not completion evidence.
- No raw Advisor answers, user-level data or health-derived analytics.

The counts are a snapshot at the probe timestamp, not a guarantee of current availability.
