# Zápraží 2.0 — kontrola vnitřních odkazů v hlavních šablonách

Datum: 13. 10. 2026. Read-only audit k release 0.8.132; bez změny WordPressu a obchodních pravidel.

Kontrolováno 28 PHP šablon: homepage, 26 rozhodovacích/informačních cest v requiredDecisionPaths a stránka ochrany soukromí. Audit zjistil nulový počet neexistujících cílů u staticky zapsaných PHP home_url odkazů a fragmentových kotev v tomto souboru.

Nový automatický test tests/core-internal-link-integrity.test.js v každém npm test:
1. Potvrdí, že 26 hlavních poradenských/SEO URL má vlastní šablonu.
2. Ověří literal home_url cesty v 28 šablonách, cílové kotvy a lokální odkazy na #sekce.
3. Zabrání osiření některé hlavní informační nebo rozhodovací stránky (žádný odkaz z jiné hlavní šablony).
4. Detekuje neočekávané zmenšení rozsahu auditu.

**Omezení:** Jde pouze o kontrolu v GitHub zdrojích. Není to důkaz skutečného HTTP 200, odpovídajícího WordPress přiřazení šablony, živých JS odkazů, obsahu starého archivu, sitemap/indexace, CTR ani affiliate konverzí. Tyto kontroly patří do samostatného produkčního browser QA a GSC. Historické URL bez důkazů nemazat a nepřesměrovávat.

Tato změna se týká výhradně CI testu a dokumentace; nevyžaduje nový deploy.
