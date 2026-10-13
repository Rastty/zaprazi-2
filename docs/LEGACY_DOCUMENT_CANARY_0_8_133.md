# Zápraží 0.8.133 — první canary oprava zobrazení starého HTML

**Důvod:** Úplný čtecí audit (13. 10. 2026, 4 360 postů) prokázal vložené dokumentové značky u 4 037 článků a více doctype u 3 276; viz `docs/LEGACY_CONTENT_BODY_AUDIT_2026-10-13.md`.

**Rozsah první změny:** Pouze publikované WP posts s ID **8105** a **8106**. Ostatních 4 358 příspěvků ani 26 moderních SEO stránek se netýká. WordPress `post_content` zůstává beze změny, původní URL / canonical / SEO metadata zůstávají zachována.

Při **zobrazování** se z vnořeného historického HTML odstraní pouze technické dokumentové obálky (`DOCTYPE`, `html`, `head`, `body`) a nepotřebné vnitřní `meta/title`. Důležité: odkazy, obrázky, `id` kotvy a viditelný text jsou chráněny fail-closed kontrolou: pokud se liší, vrací se původní HTML. Historická CTA (i pokud zastaralá) **zatím zůstávají**, protože je nutné nejdřív ověřit jejich cíle a přínos jednotlivých URL.

**Ověřovací podmínky:**
1. `php tests/legacy-document-shell.php` projde bez WordPressu; `npm test` a běžný PHP lint beze změny.
2. Před deployem všechny 14 live Advisor QA zůstanou zelené (běží proti 0.8.132).
3. Po Pull+Deploy verze 0.8.133 production browser QA pro obě canary URL musí ověřit HTTP 200, zachovaný text a komerční odkazy, žádnou sekundární HTML obálku.
4. Případná chyba = okamžitý návrat na `dev` před touto verzí. Žádná úprava WP databáze není potřebná.
5. **Nerozšiřovat automaticky na celý archiv**, dokud není doložen postdeploy výsledek a vizuální kontrola.

Čísla z auditu nejsou GSC indexace ani tvrzení o penalizaci Google. Neprovádět hromadný noindex, mazání nebo redirect.
