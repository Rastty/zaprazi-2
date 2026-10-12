# Zápraží 2.0 — aktuální Pull + Deploy a kontrola produkce

**Tento checklist je platný pro každé další vydání.** Číslo očekávané verze je vždy v `style.css` (`Version:`) a `functions.php` (`ZAPRAZI_RELEASE`) na větvi `dev`. Číslo verze v Gitu **není důkaz**, že už běží na veřejném webu.

## 1. Před Pull + Deploy

- Zkontrolovat, že release PR je sloučený, `main` a `dev` ukazují na stejný commit a `CI` je zelená.
- Porovnat verzi v `style.css` a `functions.php` a ověřit integritní markery.
- Zelená **predeploy** `Production Advisor Browser QA` znamená pouze úspěšnou kontrolu *dosud živé* verze. Nemá se vydávat za potvrzení budoucího nasazení.
- Nevydávat release při nevyřešeném bezpečnostním nálezu nebo částečné integritě.

## 2. WordPress

1. V **Deployer for Git** ověřit `Rastty/zaprazi-2`, větev `dev` a kořen repozitáře jako kořen tématu.
2. Provedení **Pull + Deploy** je manuální krok správce WordPressu. Není potřeba měnit databázi, affiliate přiřazení ani šablonu stránek.
3. Otevřít `https://zaprazi.cz/` a ověřit funkční HTTPS.

## 3. Přísné ověření po nasazení

1. Ve zdroji homepage ověřit `meta name="zaprazi-release"`: musí se rovnat aktuálnímu číslu z `style.css`. `meta name="zaprazi-integrity"` musí být `ok`, nikoliv `partial`.
2. Na read-only `https://zaprazi.cz/wp-json/zaprazi/v1/affiliate-readiness` ověřit stejný `release`, `integrity=ok`, `configured_total=slot_total`, všechny skupiny bez `missing`. Konfigurovaná pozice affiliate není ověřený prodej.
3. V GitHub **Actions → Production Advisor Browser QA → Run workflow** spustit ruční běh na `main` **až po deployi**. Běh vyžaduje shodu živé a zdrojové verze; predeploy QA za něj nelze zaměnit.
4. Přijmout jen zelené testy všech **14 poradců**, relevantních bezpečnostních a product-fit bran, internal navigation, HTTPS sitemap, affiliate integrity a změn specifických pro daný release.
5. Na mobilu provést cestu `problém → odpovědi → vysvětlení → kontrola kompatibility → bezpečný další krok`. Změna odpovědi musí okamžitě zavřít dřívější obchodní CTA; odpověď „nevím“ nesmí otevřít nákup, vyžaduje-li se kritické potvrzení.
6. Vizuálně zkontrolovat logo **Zápraží — Cesta k lepšímu životu**, klávesnicový fokus, čitelnost a lokální soukromé zpracování odpovědí.

## 4. Co přesně testovat v novém vydání

Aktuální změny určují sloučený **release PR**, jeho regresní testy a verzi podmíněné kontroly v `tests/production-advisor-smoke.mjs`. U nových redakčních částí zkontrolovat přímo dotčené veřejné URL. Neopakovat historické verze z tohoto checklistu.

## 5. Při chybě

Neshodná verze, `integrity=partial`, nesplněné affiliate sloty nebo selhání produkční QA znamenají **nepřijaté nasazení**. Zastavit další release, prověřit Pull + Deploy a při bezpečnostní regresi obnovit poslední ověřené vydání. Neměnit kvůli tomu trvale odpovědi uživatelů ani produktové/affiliate mapování.

Automatické testy nedokazují individuální zdravotní vhodnost pomůcky, skutečné affiliate objednávky ani použitelnost s rodinou.

Související: `docs/DEPLOYMENT.md`, `docs/ADVISOR_QUALITY_GATE_2026-10-09.md`, `.github/workflows/production-advisor-qa.yml`. Historické check-listy lze dohledat v Git historii.
