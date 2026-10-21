# Produkční QA bez ruční změny verze — 21. 10. 2026

## Důvod
Po každém deployi 0.8.138–0.8.142 jsme museli vytvářet extra QA PR jen pro přepsání očekávaných release číslic v sedmi prohlížečových skriptech. Zbytečně to zpomalovalo vývoj.

Nyní každý read-only QA script čte očekávanou verzi z **checked-out WordPress `style.css` hlavičky** přes `scripts/lib/live-release.mjs`. Zatímco produkce verzi potvrzuje přes `wp-json/zaprazi/v1/affiliate-readiness`, nemůže nám ji diktovat; pokud se nová verze nestihla deployovat, strict QA správně selže. Helper nemá síťové volání.

## Postdeploy postup
Po potvrzeném Pull + Deploy spusťte **GitHub Actions → Production Advisor Browser QA → Run workflow** na větvi **main** a potom **Legacy Canary DOM Fidelity** na main. Zkontrolují 14 poradců, všechny klíčové SEO stránky, historický archiv, specializované cesty a konfiguraci affiliate. Už nebude potřeba nový PR pouze kvůli přepsání statického čísla verze. GitHub connector nemusí dovolovat workflow_dispatch přímo v chatu; pokud není přístup, nepředstírat jeho spuštění.

## Hranice
Jde pouze o skripty, testy a dokumentaci; **žádná změna WordPress runtime ani deploy**. Automatické periodické spouštění nebylo přidáno bez žádosti. Unit test chrání proti návratu hardcoded version expectations. Workflow stále musí skutečně běžet; tato změna sama o sobě není důkaz budoucí funkčnosti webu.
