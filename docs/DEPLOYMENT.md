# Zápraží 2.0 — cesta nasazení WordPress tématu

## Aktuální architektura

`GitHub Rastty/zaprazi-2 → main (schválené změny) → dev (deploy branch) → WordPress Deployer for Git → aktivní téma → přísná produkční QA`

- `main` je stabilní větev; `dev` musí být po releasu synchronizovaná se stejným commitem.
- WordPress přebírá **kořen repozitáře**, nikoliv vnořenou složku. V kořeni jsou `style.css`, `functions.php`, `header.php`, `footer.php` a ostatní WordPress šablony.
- **Deployer for Git** je primární Pull + Deploy mechanismus; WPVibe slouží nanejvýš k diagnostice a readback, nikoli jako nutná podmínka vydání.
- Ke dni 12. 10. 2026 GitHub API vrací repozitář jako **public**. Staré tvrzení „repo je private, free Deployer potřebuje Pro“ už neplatí pro aktuálně ověřený stav. Při budoucí změně viditelnosti znovu ověřit licenční podmínky pluginu.
- Neukládat GitHub tokeny, WordPress přístupové údaje ani affiliate partnerské URL obsahující tajné parametry do veřejného repozitáře.

## Postup při nové verzi

1. Implementaci připravit v PR, ověřit testy, CI a požadovanou přednasazovací kontrolu živého webu.
2. Merge do `main`; `dev` fast-forward na **stejný commit**. Očekávané číslo release je v `style.css` a PHP konstantě `ZAPRAZI_RELEASE`.
3. Správce WordPressu provede Pull + Deploy z `dev`. Git merge sám o sobě **není** nasazení.
4. Zkontrolovat přesný release, integritu a konfigurované affiliate pozice; poté spustit ruční GitHub Actions `Production Advisor Browser QA` a ověřit všech **14 poradců**.
5. Neúspěšné/částečné nasazení nepovažovat za dokončené, další vydání pozastavit do nápravy.

**Jednotný provozní checklist:** [NEXT_DEPLOY_SMOKE.md](./NEXT_DEPLOY_SMOKE.md). Tento soubor neobsahuje pevné číslo verze; testuje se vždy přesně ta, kterou skutečně vydává `main=dev`.

## Trvalé pověření vlastníka — 10. 11. 2026

Vlastník projektu v konverzaci Zápraží 2.0 dne 10. 11. 2026 schválil vydání PR #758 a výslovně pověřil další běhy **samostatným schvalováním navazujících vydání** („další si schvaluj sám a pokračuj naplno“). Toto je **podmíněné pověření ke koordinaci a sloučení běžných, bezpečně připravených PR**, nikoli automatické prohlášení, že WordPress už byl nasazen.

- Pro rutinní, nedestruktivní změnu není nutné pokaždé znovu žádat o slovo „schvaluji“. Agent smí po kontrole aktuálního `main`, otevřených PR, přesného head SHA, čisté mergeability, kompletního zeleného latest-head CI a všech relevantních legacy/přednasazovacích QA **samostatně dokončit merge** a fast-forward `dev` na identický commit.
- WordPress **Pull + Deploy** zůstává samostatný správcovský krok přes Deployer for Git, pokud neexistuje ověřená, samostatně autorizovaná bezpečná cesta. Git merge ani push `dev` nejsou publikací. Po nasazení vyžadovat přesné live release + `integrity=ok`, platnou konfiguraci affiliate a plnou postdeploy Chrome QA; při nesouladu STOP, ne automatické pokračování.
- Toto pověření **neobchází** zdravotní/product-fit a privacy gate, přesné výrobní zdroje, pravidla pro úhrady, kontrolu změn affiliate routingu, nevratné mazání/přesměrování obsahu ani zálohování databáze. Rizikové, destruktivní, právně/medicínsky sporné nebo nevratné změny nad rámec současně schváleného bezpečného vydávacího procesu vyžadují samostatné rozhodnutí vlastníka.
- Před každým merge znovu ověřit, že výchozí větev a PR head se nezměnily, a použít `expected_head_sha`; nikdy nemergovat červené/neúplné kontroly či obcházet fail-closed bariéry. Nezapisovat `safety_qa.verifiedRelease`, GSC uplift ani provize bez skutečného nezávislého důkazu. Po projektu nevyžadovat další schválení pouze z důvodu historického textu starého PR.
- Pokud vlastník pověření odvolá nebo vydá užší instrukci, ta má přednost. Rozpracované produkční nasazení vždy dokončit/ověřit dříve než další konfliktní runtime release.

## Bezpečnost změn

- Automatické změny databáze, přesměrování starého obsahu a přemapování affiliate nejsou součástí obyčejného Pull + Deploy.
- Je-li potřeba zásah do WordPress administrace, záloha a návratový plán jsou odděleným úkolem; neničit původní obsah kvůli deploymentu tématu.
- Technická produkční QA není prohlášení o lékařské vhodnosti výrobků ani o schváleném affiliate příjmu.
