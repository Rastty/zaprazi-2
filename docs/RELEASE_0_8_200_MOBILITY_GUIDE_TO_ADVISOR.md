# ZaPrazi 0.8.200 — měřitelný přechod z Mobility průvodců do poradce

## Konkrétní uživatelská změna

- `/choditko-do-bytu-pro-seniory/`: primární tlačítko z obecného „Spustit poradce“ na „Ověřit vhodný typ v poradci“, stále vede na stávající `#poradce-choditko-byt`.
- `/choditka-pro-seniory/`: dvě existující přímé cesty „Hlavně doma“ a „Venku“ získají `data-zp-journey="advisor"`; žádný přesměrovací nebo obchodní krok navíc.
- `/choditko-na-pojistovnu/`: výzva „Začít orientačním poradcem“ uvnitř tříkrokového vysvětlení ePoukazu získá stejný štítek. Oficiální zdroje, výstraha proti zpětnému proplacení a fit-gate zůstávají beze změny.

## Proč

Existující souhlasem chráněný analytický adaptér `assets/js/analytics-consent.js` měří `guide_advisor_click` **pouze na explicitně označených bezpečných interních odkazech**. Neoznačené odkazy na již existující Mobility poradce proto zkreslovaly uživatelskou cestu. Vydání neobsahuje žádný nový tracker, sběr odpovědí, GA4 identifikátor ani změnu consent mechanismu.

Tato událost znamená **klik z obsahu na poradce**, nikoli zahájení, dokončení, jedinečného uživatele, objednávku nebo provizi. Je nanejvýš jednou za načtení stránky a odesílá se pouze po výslovném souhlasu; URL cíle, parametry, diagnózy a odpovědi se do GA4 neodesílají. GA4 property nemusí mít ještě dostatečná reálná data, proto nic nevydáváme za prokázaný růst.

## Regrese a nasazení

- `tests/mobility-guide-advisor-handoff-200.test.js` chrání tři vysokointentové vstupy, existující cíle, výslovný souhlas, whitelist událostí a žádná citlivá data.
- Postdeploy gate nyní vyžaduje pro 0.8.200 a pozdější verze rovněž **doložené vyrenderované přechody** z obou stránek o chodítkách a první obrazovky ePoukazu. Předčasná/částečná/míchaná verze nesmí spustit green QA.
- 100 přesných PHP/JS/CSS integrity značek + 4 přesné Git blob piny, `style.css` a `ZAPRAZI_RELEASE` přecházejí z 0.8.199 na 0.8.200 společně v jediném release commitu.
- Po zelené CI, plné predeploy kontrole a sloučení bude potřeba `WordPress → Deployer for Git → dev → Pull + Deploy`. Teprve skutečná live 0.8.200 a plná automatická postdeploy Chrome QA dovolí povýšit `safety_qa` v Growth Graphu.
- Starší 0.8.199 na produkci je během přípravy v pořádku; předdeploy QA nesmí označit nový release jako produkční.
