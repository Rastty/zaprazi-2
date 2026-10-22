# Zápraží 0.8.150 — senior nemůže vstát z křesla

Datum 22. října 2026. Nový problémový vstup `/vstavani-z-kresla-pro-seniora/`, nikoliv katalog nebo druhý rozhodovací engine.

Samostatná WP page pro slug neexistovala. Český SERP pro zvedací křesla je převážně obchodní; odlišení Zápraží spočívá v rozpoznání, jestli je potřeba pevné křeslo, upravený sed, zvedací mechanismus či odborné posouzení přesunu. Data o hledanosti z GSC jsou UNKNOWN — neodhadovat pozice ani konverze.

Čtyři situace, čtyři druhy řešení, sedm konkrétních kontrol, FAQ, vysvětlení zvedacího mechanismu vs. běžného polohování. Hranice: nepřesvědčovat člověka s nebezpečným transferem ke koupi bez odborného posouzení; žádná univerzální výška/nosnost, neověřený polštář nebo improvizovaný zvyšovač, žádný nárok pojišťovny bez konkrétního prostředku.

Primární zdroje, ověřeno 2026-10-22:
- NHS Kingston and Richmond OT, chair raisers, rev. 2026-02-24: https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/chair-raisers
- Cambridge University Hospitals, seating and ergonomics: https://www.cuh.nhs.uk/patient-information/seating-and-ergonomics/
- Opora Diakonie, rizika pádů: https://oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru-prevence-a-privolani-pomoci-po-padu/

Non-destructive `init` pro absent slug, originální WP články nezměněny. Inbound ze stávajícího bezpečného bytu a přehledu kompenzačních pomůcek plus search intent. Outbound do prvního bezpečného kroku, plánu návratu a metody zdrojů. No affiliate offer bypass, no persisted patient input.

Release token 0.8.150, 76 protected assets, CSS/functions and regression tests aligned. Po Pull + Deploy ověřit status 200, H1, canonical, Yoast popis, sitemap, search `kreslo`/`polohovaci kreslo` a safety 14 poradců; 25/25 merchant slots nejsou doloženou objednávkou.
