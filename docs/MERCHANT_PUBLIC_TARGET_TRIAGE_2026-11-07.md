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

## Druhá vrstva důkazů — veřejná produktová identita (7. 11. 2026)

Veřejné produktové stránky byly znovu dohledány nezávislou veřejnou webovou vrstvou, nikoli živým autentizovaným proklikem publisher affiliate URL. Původní GitHub HTTP audit s výsledky **22 × 200 / 1 × 404 / 2 × 403** zůstává skutečnou historickou evidencí svého runneru a není tímto záznamem zpětně „opraven“. Nezaměňovat načtené/indexované produktové HTML s důkazem aktuální skladovosti, plně funkčního checkoutu nebo připsané provize.

### XAVIER — P1, veřejný produkt existuje, konflikt 404 NEUZAVŘEN

- Veřejná produktová stránka [PodoWell XAVIER — Štěpánková & C.](https://www.zdrava-obuv-eshop.cz/xavier-ortopedicka-obuv-extrasiroka-pro-otekle-nohy-unisex-cerna-podowell/) byla 7. 11. 2026 načtena s identitou **PodoWell XAVIER**, variantami řady **5031**, šířkou **K+**, černým provedením, širokým otevíráním a suchými zipy. Aktuálně zobrazený katalog uváděl u velikostí možnost objednat dodání, nikoliv jistou okamžitou dostupnost; nesmí se přepisovat do trvalé cenové či skladové evidence.
- Tentýž kanonický cíl v předchozím read-only GitHub probe #42333076522 vrátil **HTTP 404**. Jde o **rozpor dvou pozorování**, nikoli automaticky vyvrácenou závadu. Příští kontrola: přesná produktová cesta a požadovaná velikost v běžném autorizovaném prohlížeči, následně pravý publisher deeplink, bez změny produktové identity nebo nahrazení kategorií.

### MEYRA Ideal — P1, pozor na variantu a technické údaje

- Produktový cíl [Lékárna.cz MEYRA Ideal Rollator](https://www.lekarna.cz/meyra-ideal-rollator-ctyrkolove-choditko/) je veřejně dohledatelný jako čtyřkolové chodítko. Současně [výrobce MEYRA](https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-ideal-rollator-/191) uvádí katalogové číslo **3061982**. Nezaměňovat za **ROLLATOR 2, 3061982-R**.
- Mezi různými materiály k modelu a merchant listingy přetrvávají rozdíly v rozměrech, které mohou souviset s generací / provedením. Automatické potvrzení modelu pouze z názvu by bylo nebezpečné. Dřívější **HTTP 403** znamená jen neověřitelnou dostupnost z daného automatického běhu; potřebujeme vizuální identitu přesného produktu, skutečné rozměry z odpovídajícího návodu a ověření publisher deeplinku.
- Lékárna.cz výslovně sděluje, že online nákup tohoto výrobku nelze uhradit poukazem na zdravotnické pomůcky. Nadále oddělovat přímý nákup od ověření možnosti úhrady jiným postupem.

### DMA EH-CMDA — P1, produktová identita bez potvrzené obchodní cesty

- Veřejný katalog [Dr.Max — DMA EH-CMDA toaletní židle 4v1](https://www.drmax.cz/dma-eh-cmda-toaletni-zidle-4v1) uvádí přesně model **EH-CMDA** a EAN **8034055107553**. Jde o indexovaný záznam, jehož dostupnost pro běžného kupujícího při této kontrole nebyla autorizovaným prohlížečem samostatně ověřena.
- Dřívější HTTP **403** je stále `access_unverifiable`; bez obcházení ochranných mechanismů zkontrolovat skutečný retail cíl a skutečnou partnerskou cestu. Neodemykat nabídku na základě pouhé shody EAN.

### Operacionalizace

- `data/merchant-identity-watchlist.json` udržuje **3 přesné P1 sloty**, jejich kanonické URL, veřejné produktové indicie a požadavek na lidské ověření. **Neobsahuje** publisher tracking URL, přihlašovací údaje ani osobní data.
- `scripts/audit-canonical-merchant-targets.mjs` přidává do týdenního reportu strukturovanou `identity_review_queue`. Způsobí-li další read-only GET i HTTP 200, výsledek zůstává `reachable_not_identity_or_affiliate_verified`, **ne** obchodní aktivací. HTTP 403/404 zůstávají předmětem kontroly. Žádné další síťové requesty se neposílají.
- Regresní testy zablokují nechtěné přesměrování na kategorii, jinou variantu, cizí doménu nebo URL s tracking query, pokud není aktualizována evidence a výslovně prověřena identita.
- `affiliate_audit` zůstává **in_progress**. Nelze z této aktualizace odvodit skutečné návštěvnické prokliky, vyplacené provize ani nárůst návštěvnosti. Úprava je pouze evidence + read-only monitor; nevyžaduje WordPress Pull + Deploy.

## Nová produkční veřejná evidence — audit 7. 11. 2026, 14:08 UTC

Bezprostředně po sloučení [PR #707](https://github.com/Rastty/zaprazi-2/pull/707) proběhl celý [public merchant target workflow #42380167071](https://github.com/Rastty/zaprazi-2/actions/runs/42380167071) na `main` commit `f2dfb880696162fd0b2c60598ee71ef6aec4697b`. `contract` i `public-target-probe` skončily **success**. Strukturovaný JSON artefakt `merchant-public-targets` má kontrolní čas **2026-11-07T14:08:40.967Z**, přesně 25 klíčů a následující výsledek:

| Výsledek (aktuální GitHub runner) | Počet |
|---|---:|
| HTTP 200 — identita/partnerská cesta dosud neověřena | **23** |
| HTTP 404/410 | **0** |
| HTTP 403 — access_unverifiable | **2** |
| Přesměrování/5xx/síťové chyby | **0** |
| **Celkem** | **25** |

**XAVIER:** slot `zdrava-obuv-cz:xavier` tentokrát vrátil **HTTP 200** (`reachable_not_identity_or_affiliate_verified`). Dřívější **404** z workflow #42333076522 se tedy při novém měření **neopakovala**; nezměnila se však automaticky jistota konkrétní velikosti, skladovosti ani skutečného publisher deeplinku. To je odlišné od tvrzení, že původní chyba nikdy neexistovala. Priority P1 ponechány pro business ověření.

**MEYRA Ideal:** `lekarna-cz:meyra-ideal-3061982` stále **HTTP 403**, `automated_access_blocked_manual_recheck`. Nezaměnit 3061982 a 3061982-R; bez přímého ověření rozměrů, varianty a partnerské cesty neměnit obchodní směrování ani kompatibilitu.

**DMA EH-CMDA:** `drmax-cz:dma-eh-cmda` stále **HTTP 403**, `automated_access_blocked_manual_recheck`. Veřejný indexovaný produktový listing neprokazuje přístup z návštěvnického browseru ani správný publisher redirect.

Nová `identity_review_queue` v artefaktu pro všechna tři P1 místa výslovně uvádí `identity_evidence=public_listing_only`, `publisher_deeplink=unverified` a `approved_commission=unverified`. **Žádný** počet v tabulce nepředstavuje ověřený affiliate prodej či připsanou provizi. Kvůli jednomu 200 nevypínat fit-gate ani nezaměňovat přesný produkt.

**Následující praktický postup:** provést uživatelský prohlížečový smoke s oprávněným přístupem pro oba HTTP 403 a publisher deeplinky všech tří cílů, bez ukládání identifikátorů či zkoušení nákupů. Teprve pak uvažovat o úpravě kanonické či partnerské cesty. Tento zápis je evidence-only a **nevyžaduje WordPress nasazení**.
