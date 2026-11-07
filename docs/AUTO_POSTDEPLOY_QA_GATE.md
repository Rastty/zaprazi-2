# Automatický hlídač postdeploy QA — Zápraží

## Problém, který řeší

Po bezpečném merge release do `main` a fast-forward `dev` zůstává skutečný WordPress běžet na starší verzi, dokud správce neprovede `Deployer for Git → dev → Pull + Deploy`. Scheduled Production Advisor Browser QA potom zcela správně odmítá starou produkci, ale nový release není sám po nasazení automaticky vyzkoušen.

Tento hlídač zkracuje poslední část smyčky **pouze po skutečném WordPress deployi**: příprava → ruční Pull + Deploy → nezávislé ověření veřejných stránek → spuštění plné QA. WordPress se nikdy nemění pomocí tohoto nástroje.

## Workflow a explicitní stavy

`.github/workflows/auto-postdeploy-qa.yml` každou hodinu (31. minuta UTC), po změně monitoru v `main` a při ručním spuštění provede `node scripts/auto-postdeploy-qa.mjs`.

1. **pending_wp_pull_and_deploy:** veřejný `affiliate-readiness` stále vrací dřívější správně integrovaný release, 25/25 nakonfigurovaných slotů. Zelený běh hlídače znamená pouze „čekáme na WP deploy“; není produkční akceptací.
2. **blocked_*:** veřejná data jsou neúplná, nedostupná, nestabilní, části stránky smíšené, nebo je integrita `partial`. Nic se nespouští; hlídač odmítne předstírat úspěch.
3. **ready_for_full_qa:** release veřejného API odpovídá přesně `style.css` zdrojové verzi; přesně `25/25`, kompletní skupiny; dvě samostatné kontroly veřejného readiness API kolem čtyř průřezových HTML stránek se stejnými metadaty `zaprazi-release` a `zaprazi-integrity=ok`. **Pro vydání 0.8.199 navíc** prověří pátou stránku `/choditko-na-pojistovnu/`: stejnou verzi a integritu, skutečně vyrenderovanou sekci `rychla-cesta-na-epoukaz`, všechny tři bezpečné kroky, zákaz očekávání zpětného proplacení, odkaz na původní poradce a oficiální VZP. Pouhé zvýšení čísla verze bez této návštěvnické změny nesmí vyvolat finální QA.
4. Teprve poté se přečte aktuální `main` SHA. Historie `workflow_dispatch` existující `Production Advisor Browser QA` zamezí duplicitnímu spuštění. Při první shodě se **jednou** vyvolá celý původní Workflow, který teprve může splnit safety gate pro 14 poradců. Při chybném běhu lze povolit nejvýše jeden automatický opakovaný pokus na stejný SHA; následně vyžaduje rozhodnutí správce.
5. **Zelená kontrola hlídače `ready_for_full_qa` NEZNAMENÁ, že prošlo Chrome QA.** Platným důkazem je pouze samostatný kompletní postdeploy run s výsledkem `completed/success`. `config/growth-state.json` zůstává beze změny, dokud není doložena akceptace.

## Bezpečnost a limity

- Jen anonymní veřejné GET bez parametrů, bez obchodních prokliků, odpovědí z poradce, osobních dat nebo zápisu do WordPressu.
- GitHub token `actions: write` slouží **výhradně** k dispatch existujícího read-only QA na `main`; `contents: read`; žádný commit, merge, nasazení, SSH, WordPress API nebo dodatečné síťové endpointy.
- Ověřuje výhradně `Rastty/zaprazi-2`, `refs/heads/main`, přesný současný commit a běžný strukturovaný JSON. Veřejný obsah ani API chyby se do logů nevypisují.
- Neúspěch nebo nedostupnost veřejných zdrojů neodemyká žádný nákup, produkt ani release. Falešnou zelenou „postdeploy QA“ nelze získat přepsáním `ZAPRAZI_RELEASE` v repozitáři.
- Bez souhlasu správce automat **nikdy nenasazuje**. Ten musí i nadále kliknout `Pull + Deploy`. Právě spouštění následné QA se tím automatizuje.

## Dnešní příklad

Zdrojová verze v GitHubu: `0.8.199`. Dokladovaný live web: `0.8.198` (z produkčního běhu 2026-11-07, https://github.com/Rastty/zaprazi-2/actions/runs/42365019603). Proto správný výstup monitoru do nového WordPress deploye je **pending_wp_pull_and_deploy**, nikoli nová potvrzená akceptace. 
