# Canary 001 – přesně vymezená první kohorta starého obsahu

Datum: 27. 10. 2026 · pouze **PREVIEW**, ne produkční změna

## Zdroj a filtr
Produkční databáze WordPress přes read-only WP-CLI (dotaz je v ARCHIVE_AUDIT_READONLY_SQL_2026-10-27.md). Pozitivní podmínky:
- post_type = post, status = publish
- kategorie term_id = 1161 (Tepelná čerpadla a fotovoltaika)
- tělo obsahuje starý promo shortcode `[su_button`
- tělo obsahuje vnořený `<!DOCTYPE html`
- řazení ID DESC, LIMIT 200

**Celkem 2 000** příspěvků v dané kategorii splňuje tento vysokorizikový kombinovaný filtr. První konkrétní kohorta má 200 publikovaných příspěvků: WordPress **post ID 8106 až 7907**, souvislá sestupná sekvence. Všechny mají rok publikace 2024 (13. 2. až 14. 3. 2024). Kontrolní příklady: ID 8106 `solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu`, ID 8105 `solarni-panely-v-praxi-inspirace-pro-zemedelce`, ID 7907 `top-5-solarnich-elektraren-v-ceske-republice`.

## Proč zatím nic hromadně nepřepisovat

Jejich obsah je sice zjevně mimo novou misi Zápraží a technicky podezřelý, ale nelze potvrdit nulový historický přínos: nejsou dostupné GSC kliky/zobrazení pro stará URL, referery ani externí backlinks. Ovlivnění staré URL není neškodné jen proto, že jde o `noindex`. Dnešní verze 0.8.177 je produkčně zdravá; záchrana starých URL nemá ohrozit nové stránky.

## Gate před jakoukoli publikací změn

1. **Předběžný snapshot** pro každé přesné ID: slug, title, status, původní robots/Yoast nastavení a datum, plus evidovat výjimky. Nevyvozovat nulovou návštěvnost z absence v exportu GSC.
2. **HOLD** pro každou URL s návštěvou, relevantním externím odkazem, komerčním výkonem nebo nejasným původem; držet zvlášť mimo automatizované ID intervaly.
3. **Reversible canary**: po odfiltrování HOLD nastavit `noindex,follow` pouze explicitní allowlist vybraných ID, současně odstranit z Yoast sitemap. Nezměnit slug, obsah ani status.
4. **QA**: náhodný vzorek minimálně 10 URL, post-sitemap a sitemap-index, zachování 53 moderních pages, 25/25 affiliate slotů, manifest rollback. Žádné robots.txt Disallow, které by zabránilo Google číst noindex.
5. **Rollback** při chybném rozsahu, poklesu prokazatelně cenných URL, překryvu s moderními poradci nebo nedostupnosti sitemap.
6. **Škálování** dalších kandidátů po samostatných vlnách 250–500 jen s opakovaným zjištěním přesných ID; **nikdy slepý UPDATE všech postů v kategorii**.
7. Redirect 301 pouze na tematicky ekvivalentní cílovou stránku. Bez ekvivalentu po ukončení obsahu pravdivá 404/410. Žádné hromadné homepage redirecty.

## Očekávaný cíl
Postupné snížení podílu dlouhodobě neužitečného a nerelevantního starého obsahu; více tematické soudržnosti a důvěry pro lidi. Žádná garance algoritmického „resetu“ Google nebo vyšších pozic.

**Status:** kandidátní filtr a 200 ID jsou ověřené, produkční SEO stav se touto dokumentací NEMĚNÍ.
