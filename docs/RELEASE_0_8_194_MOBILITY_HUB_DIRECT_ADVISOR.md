# Zápraží 0.8.194 — hlavní přehled chodítek přímo do domácího poradce

## Výchozí problém a dopad

V hlavním high-intent přehledu `/choditka-pro-seniory/` bylo první a nejvýraznější tlačítko „Vybrat typ chodítka“ pouze skokem na redakční rozcestník `#vyber-typu`; návštěvník musel pro skutečné posouzení situace udělat další volbu. Vedle toho vedl méně výrazný terciární odkaz k Domácímu poradci `/#poradce`. Uživatel přicházející s konkrétní potřebou tak neměl nejkratší cestu k našemu hlavnímu produktu.

**Jedna změna:** primární CTA v hero je nyní „Ověřit vhodný typ v poradci“ s cílem `/#poradce` a bezpečným consent-gated markerem `data-zp-journey="advisor"`. Hned vedle zůstává samostatná volba „Porovnat typy chodítek“ → `#vyber-typu`. Redundantní terciární odkaz na stejného poradce se odstranil; ostatní odkazy a sekce `#vyber-typu`, `#hul-nebo-choditko`, měření, půjčení a úhrada se zachovaly.

## Rozsah a bezpečnost

- Nemění se žádné otázky, rozhodovací pravidla, produktový katalog, nabídky, affiliate cíle ani způsob doporučování.
- Není možné obejít modelové kontroly nosnosti, šířky, výšky, brzd a sedátka.
- Není přidán dotaz na citlivé informace a nový click marker používá stávající obecnou událost `guide_advisor_click` pouze po výslovném analytickém souhlasu. Dva označené primární vstupy do stejného poradce na jedné stránce využívají již existující `oncePerPage` deduplikaci, bez URL a odpovědí.
- Úvodní volba návštěvníka je bezpečná i pro neodsouhlasenou analytiku. Test musí odmítnout volitelné měření a přesto potvrdit funkční průchod do formuláře.

## QA, release a publikace

- Kód: `page-choditka-pro-seniory.php`; release marker `0.8.194` koordinovaný ve 100 integritních runtime souborech, `style.css`, `functions.php`, se správnými kritickými git blob hash zámky.
- Testy: `tests/mobility-hub-direct-advisor-194.test.js`, upravená kontrola `tests/editorial-to-advisor-funnel.test.js` a release-scoped safety test.
- Jednorázový přípravný GitHub Actions běh [#41834709855](https://github.com/Rastty/zaprazi-2/actions/runs/41834709855) prošel všemi **963 z 963 Node testů** a PHP syntaxí. Přípravný skript i dočasný write-permission workflow musí být před merge smazané z release větve.
- Postdeploy strict real Chrome `scripts/audit-live-mobility-hub-194.mjs` v `.github/workflows/production-advisor-qa.yml` ověří přesné live `0.8.194`, integritu `ok`, 25/25 affiliate konfiguraci, jedinou mobilní primární CTA, srovnání typů jako sekundární cestu, odmítnutí analytiky a následně viditelný skutečný formulář `/#poradce`. Nevyplňuje odpovědi, nekliká na merchanty ani nespouští POSTy.
- Žádný GitHub merge ani predeploy PR QA **není** důkaz zveřejnění ve WordPressu. Po sloučení je nutné **Deployer for Git → větev dev → Pull + Deploy**, potom samostatná úplná postdeploy produkční Chrome QA. Dokud ta neprojde, `safety_qa.verifiedRelease` v Growth Graphu zůstane `0.8.193`.

## Interpretace přínosu

**Hypotéza:** méně navigačních kroků na centrální Mobility landing page → větší pravděpodobnost návštěvy/domluveného použití poradce. Nejde zatím o naměřený uplift. Pro posouzení je potřeba GSC organických kliků, GA4 s výslovným souhlasem a případně skutečné schválené affiliate provize za porovnatelné období; data jsou momentálně UNKNOWN a nesmějí se dopočítávat z počtu aktivních pozic ani z běhu testů.

**Status v okamžiku přípravy:** změny na GitHub branch, **WordPress dosud 0.8.193**. Nelze tvrdit, že jsou na webu.
