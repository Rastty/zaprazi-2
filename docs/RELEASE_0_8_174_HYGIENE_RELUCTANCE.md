# Zápraží 0.8.174 — Senior odmítá koupání

27. 10. 2026. Navazuje na produkčně ověřené 0.8.173 a obsahový PR #447.

## Publikace
Nový redakční průvodce `/senior-odmita-koupani/` s citlivým postupem bez nátlaku, 4 důvody, 4 bezpečnými alternativami, 7 kroky, 8 domácími kontrolami a 6 FAQ. Ověřené zdroje NZIP/NHS/Alzheimer's Society/NIA. Tři kontextové inbound cesty z homepage, koupelnového poradce a hygieny na lůžku. CTA teprve po ověření bezpečného přesunu, produkt není automaticky doporučen.

## Integrita
- **95/95** chráněných runtime PHP/JS/CSS souborů obsahuje `ZP_RELEASE_0_8_174`.
- `functions.php` konstanta `ZAPRAZI_RELEASE = 0.8.174` a `style.css` Version 0.8.174.
- Nový slug idempotentně založen ve WordPressu jen při jeho neexistenci; žádné hromadné přepisování cizích článků.
- Zachována afiliace: nakonfigurovaných 25 slotů ≠ realizované prodeje.

## Povinné brány a deploy
Požadujeme zelené CI + PHP lint, kontrolu původního obsahu a produkční browser QA, potom merge a fast-forward `main=dev` bez force. Produkční nasazení se provádí ručně **Deployer for Git → Pull → Deploy** ve WordPressu z `dev`. GitHub merge sám nemění aktivní WordPress téma.

## Po deploy
Nezávisle ověřit endpoint `/wp-json/zaprazi/v1/affiliate-readiness` release/integritu, živé HTTP 200 nové stránky, canonical HTTPS, title/description, přístupnou ilustraci, 4/4/7/8/6 bloky, tři reálné inbound odkazy, indexovatelný stav a sitemap. Google indexace, CTR a návštěvnost vyžadují skutečná data z GSC.
