# Zápraží 0.8.172 — SOS pomoc a přívětivý vizuál

27. 10. 2026. Navazuje na SEO/UX PR #442.

## Co je vydáno
- /senior-doma-sam-sos-pomoc/ — problém-first průvodce 4 typy bezpečné pomoci, 3-kroková reakce, 9 kontrol, 6 FAQ, MPSV/NHS/municipální zdroje
- homepage hero a nový průvodce s originální verzovanou ilustrací `assets/illustrations/doma-v-bezpeci.svg`; teplé barvy, lidský motiv, alt texty, formát 720×510 proti posunu layoutu a responzivní CSS
- čtyři interní vstupy: homepage, senior spadl, bezpečný byt a noční cesta na WC
- žádný affiliate product shortcut, nekontrolované URL, sledování zdravotních údajů ani falešná zdravotní/úhradová tvrzení

## Integrita
93/93 chráněných souborů má `ZP_RELEASE_0_8_172`. Konstanty `functions.php` a `style.css` mají verzi 0.8.172. SVG ilustrace je lokální originální statický asset, není externě načítaná a nepotřebuje runtime release marker.

Nová WP stránka se založí jen pokud slug neexistuje, nic stávajícího se nepřepisuje.

## Gates
- Nejprve nezávislé live 0.8.171 postdeploy QA (průvodce nastupováním do auta, sitemap a čtyři inbound)
- Node CI, PHP lint, legacy #5448 fidelity a produkční browser QA
- main/dev fast-forward až po sloučení release
- produkční nasazení vyžaduje Deployer for Git → Pull → Deploy z `dev`
- až po nasazení `node scripts/audit-live-sos-172.mjs` pro živé SEO, HTTPS canonical, lokální SVG z theme, domovskou stránku, novou stránku, 9+6, interní odkazy, sitemap a konfigurované 25 affiliate sloty

25 slotů ≠ prodeje. SEO hledanosti a výsledky nejsou zatím ověřeny. Otestovat skutečné mobilní UX i Core Web Vitals a po 28/56 dnech GSC dotazy.
