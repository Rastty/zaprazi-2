# Zápraží — release 0.8.171: bezpečné nastupování seniora do auta

Datum: 26. října 2026. Navazuje na SEO PR #439.

**Implementace:** nová odlišná stránka `/nastupovani-seniora-do-auta/` s rozlišením sedání, otáčení, vložení nohou, opory u dveří a asistovaného transferu. Srovnání kategorií pomůcek, 7 kroků, 7 kontrol auta, 6 FAQ, zdroje RCOT, RiDC, NHS, BESIP. Žádné produktově neověřené merchant nabídky ani zdravotní záruky. Čtyři inbound odkazy z nemocničního návratu, převozu vozíku, vstávání a propuštění.

**Release integrity:** 92/92 chráněných PHP/JS/CSS souborů s `ZP_RELEASE_0_8_171`; `functions.php` konstantou 0.8.171, `style.css` Version: 0.8.171. Po publikaci nový slug vznikne pouze pokud neexistuje; neprovádí se aktualizace či mazání starších příspěvků.

**Pre-deploy gates:**
- `Hygiene 0.8.170 Postdeploy Acceptance` musí předčasně ověřit skutečné předchozí vydání (právě nasazenou 0.8.170).
- CI (Node & PHP), testy integrity produktu i interních anchor odkazů, legacy #5448 fidelity, production advisors browser QA musí být zelené.
- `main=dev` až po bezpečném merged release. WordPress produkci mění pouze uživatel prostřednictvím Deployer for Git → Pull → Deploy.

**Po nasazení:** `node scripts/audit-live-car-access-171.mjs`, live 0.8.171, integrita, canonical, meta SEO, sitemap, 4 inbound HTML linky a 14 existujících poradců. 25/25 konfigurací affiliate slotů není prodej ani klik.

**Metriky:** GSC 28/56 dní reálné imprese, kliky, dotazy a konverzní návaznost na produktové cesty, bez vymyšlené hledanosti nebo předpokládaných pozic. Další obsahová vlny až při ověřeném technickém stavu.
