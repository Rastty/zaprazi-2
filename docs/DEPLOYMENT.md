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

## Bezpečnost změn

- Automatické změny databáze, přesměrování starého obsahu a přemapování affiliate nejsou součástí obyčejného Pull + Deploy.
- Je-li potřeba zásah do WordPress administrace, záloha a návratový plán jsou odděleným úkolem; neničit původní obsah kvůli deploymentu tématu.
- Technická produkční QA není prohlášení o lékařské vhodnosti výrobků ani o schváleném affiliate příjmu.
