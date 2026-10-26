# SEO expert problem guide — Hygiena ležícího seniora doma

Datum přípravy: 26. října 2026. Stav: staged SEO článek, nikoli potvrzená živá stránka.
Cílová URL: /hygiena-leziciho-seniora-doma/.

## Hlavní uživatelská potřeba
Pečující rodina řeší *jak zvládnout důstojnou a bezpečnou hygienu člověka, který nemůže do koupelny*. Oddělit:
- běžná dostupná ranní/večerní očista,
- hygiena při inkontinenci,
- mytí vlasů a speciální pomůcky,
- situace, kdy lze bezpečně sedět/přesunout se do koupelny,
- potřeba odborné pomoci při manipulaci či kožních komplikacích.

Nedělat druhý „mytí vlasů na lůžku“. Specializovaný existující obsah /myti-vlasu-na-luzku/ zůstane jako subtopic; nová stránka je nadřazený vstupní uzel. Vyhnout se klinické samoléčbě či improvizovanému přesunu.

## Kvalitativní SERP průzkum

Relevantní dohledané odpovědi:
- TENA: https://www.tenacz.cz/pece-o-nase-nejblizsi/inkontinence-a-zdravi/novinky_cz/jak-umyt-cele-telo-leziciho-pacienta
- Pečuji s láskou: https://www.pecujislaskou.cz/cs-cz/pece-doma/jak-pecovat-o-blizkou-osobu/jak-provadet-hygienu-u-osob-s-omezenou-hybnosti
- APEOS (hygienická péče): https://www.apeos.cz/standardy/hygienicka-pece.html
- Opora Diakonie: https://oporadiakonie.cz/media/2025/04/Osetrovatelska_prirucka-2024.pdf

Není poctivé tvrdit „nízká konkurence“; existuje silný komerční i ošetřovatelský obsah. Zápraží odlišujeme **bezpečnostním rozhodovacím vstupem, méně riskantní volbou řešení, kvalitním checklistem a návazností na již fungující 4 specializované cesty**.

Keyword hypotézy (nečíselné, bez odhadovaných měsíčních objemů): hygiena ležícího seniora; hygiena ležícího pacienta doma; mytí pacienta na lůžku; jak umýt nemohoucího člověka; jak pečovat o pokožku při inkontinenci; mytí seniora bez sprchy; jaké pomůcky na hygienu na lůžku.
GSC impression/click, KD, objem, konverze a aktuální pozice dosud nejsou ověřené pro property zaprazi.cz.

## Doložitelné autoritativní podklady

1. Opora Diakonie — Ošetřovatelská příručka: https://oporadiakonie.cz/media/2025/04/Osetrovatelska_prirucka-2024.pdf (hygiena na lůžku, pomůcky, důstojnost)
2. NHS — hygiene help: https://www.nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/how-to-help-someone-you-care-for-keep-clean/ (důstojnost, intimita, dostupné postupy)
3. NZIP — péče o pacienta s demencí / inkontinenční pomůcky: https://www.nzip.cz/clanek/1284-demence-pecujici-inkontinencni-pomucky-jak-je-pouzivat (přiléhání, vrstvení, výměna, hygiena)
4. NHS — Pressure sores: https://www.nhs.uk/conditions/pressure-sores/ (varovné známky a hranice pomoci)
5. Royal Free London — Pressure ulcer prevention: https://www.royalfree.nhs.uk/patients-and-visitors/patient-information-leaflets/pressure-ulcers-guide-prevention (přípravky, suchá kůže)

Neprohlašovat přesný dvouhodinový interval polohování pro všechny, neomezovat individuální potřebu hygieny fixním rozpisem, bez školení nenabádat k otáčení člověka. Neodvozovat diagnózu, neopírat bezpečnost o výši provize a neuvádět neověřené ceny.

## Deliverable a publish gate

- Jediná strukturovaná PHP šablona s existujícím vizuálním systémem: 4 safety gates, 4 potřeby, 7-krokový orientační postup, 3 scénáře intimní hygieny, 4 typy pomoci/pomůcek, 8 kontrol a 6 FAQ.
- Přímé relevantní interní odkazy na vlasovou hygienu, antidekubitní matraci, polohovací postel, koupelnu a návrat z nemocnice.
- Inbound z pěti živých průvodců; Yoast SEO title/meta description; fallback bez Yoast.
- Bezpečné jednorázové vložení WP stránky pouze pro neexistující slug; žádné přepisování obsahu WordPress postů.
- Nová URL zůstává v *staged*, dokud není živá HTTP 200 a zaindexovatelná. Aktualizovat exact 91/91 protected-file a 45/45 template inventory.
- V souběžném PR ověřit skutečnou živou verzi 0.8.169 přes `.github/workflows/dressing-169-postdeploy.yml` (read-only).
- Před dalším merge: npm test, PHP lint, sitemap/link/SEO kontrola. Následně oddělený release 0.8.170 s úplnou synchronizací markerů a postdeploy QA; merge nestačí k publikaci WP.

## Návaznost a výkon

Nejdříve ověřit indexaci a interní odkazy nové stránky; po 28 a 56 dnech vyhodnotit Search Console pro URL/query a skutečný poměr problémový vstup -> průvodce -> affiliate klik. Případné rozšíření rozhodnout podle impresí a CTR, ne podle dojmu, že „nikdo nehledá“.
