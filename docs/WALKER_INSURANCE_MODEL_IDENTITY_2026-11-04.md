# Zápraží 0.8.196 — stejný kód ZP ≠ ověřená přesná varianta chodítka

**Datum ověření:** 4. 11. 2026. **Směr:** vylepšení existující a první reálně měřitelné GSC landing page, nikoliv další obecný SEO článek.

## Konkrétní důvod

Skutečná Search Console property (Prometheus [run #41849781731](https://github.com/Rastty/prometheus-growth-os/actions/runs/41849781731)) vykazuje za 5. 10. – 1. 11. 2026 **50 zobrazení / 1 klik / průměrnou pozici 10,78** na existující `/choditko-na-pojistovnu/`. Je to zatím malá vzorková evidence; nenutí nás hned měnit titulky nebo vytvářet nové URL.

Při aktualizaci zdrojů byla zjištěna důležitá možnost **záměny výrobního modelu na základě jediného kódu ZP**:
- MEYRA [IDEAL ROLLATOR](https://www.meyra.cz/ctyrkolove-choditko-rollator.html): kód výrobce **3061982**, kód ZP **07-5005963**, šířka **61,5 cm**, madla **79–97 cm**.
- MEYRA [ROLLATOR 2](https://www.meyra.cz/ctyrkolove-choditko-rollator2.html): kód výrobce **3061982-R**, kód ZP také **07-5005963**, šířka **59 cm**, madla **79–95 cm**.

Tyto informace na oficiálních veřejných stránkách výrobce **neprokazují**, že mají obě označení shodné úhradové nebo preskripční podmínky a ani že se jedná o totožnou variantu. Konkrétní listopadová položka SÚKL **nebyla nezávisle ověřena**: nepřebírat historickou říjnovou částku 3 408 Kč jako platnou pro listopad, ani cenu prodejce jako evidenci pojišťovny. SÚKL potvrzuje [existenci finálního seznamu od 1. 11. 2026](https://eud.sukl.gov.cz/pub/deska/40000001/athena/?kategorie_id=11) zveřejněného 23. 10. 2026.

## Změna pro návštěvníka

Na již existující stránce `/choditko-na-pojistovnu/` přibyla viditelná sekce vysvětlující rozdíl mezi kódem pojišťovny a přesným výrobním modelem. Obsahuje oba nezávislé produktové zdroje a praktickou kontrolu: přesné označení vydávané varianty, šířka průchodu, výška madel, nosnost, ovládání brzd, aktuální úhradový záznam a potvrzení od oprávněného výdejce. Doplněna stručná FAQ pro tento konkrétní dotaz. **Žádný nový nákupní odkaz, affiliate nabídka ani změna pořadí modelů**; hlavní CTA zůstává do existujícího rozhodovacího poradce na `/#poradce`.

## Ověření / release gate

- Theme `0.8.196` je atomické vydání všech 100 manifestových souborů s konzistentním release markerem a aktualizovanými čtyřmi kritickými Git blob SHA. Bez úplného Deployer for Git `dev → Pull + Deploy` není změna na webu.
- Kromě již zavedených QA přidán test `tests/walker-sukl-model-identity-196.test.js`, který na třech simulovaných datech renderuje skutečnou PHP stránku a ověřuje dva odlišné modely, historickou částku, měsíční fail-closed režim, bezpečné odkazy a absenci merchant tracking bez fit gate.
- Nový read-only Chrome acceptance `scripts/audit-live-insurance-model-identity-196.mjs` v `Production Advisor Browser QA` je spuštěn jen **po nasazení nové verze**; ověří veřejné HTML, viditelné vysvětlení pro uživatele, dva výrobní zdroje, historický říjnový údaj, užitečnou FAQ, funkční CTA a nulové odeslání odpovědí/merchant kliků.
- **Až po skutečně zeleném kompletním postdeploy Chrome runu** lze aktualizovat `config/growth-state.json.nodes.safety_qa.verifiedRelease` na `0.8.196`. Do té doby ponechat evidenci ověřené 0.8.195.
- GSC baseline 13 / 893 za celou property, ostatní poradenské metriky a schválené provize zůstávají beze změny; žádný slib růstu SEO či provize.

## Nasazení a měření

Po PR CI PASS a sloučení synchronizovat main→dev. Potom vlastník provede standardní WordPress **Deployer for Git → dev → Pull + Deploy**. Následně spustit/ověřit kompletní browser QA. Dopad hodnotit až v srovnatelném GSC intervalu s přirozeným zpožděním vyhledávání, nikoli jako okamžitý uplift.
