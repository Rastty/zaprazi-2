# Zápraží – senior sám doma: tísňová péče a přivolání pomoci

Datum: 27.10.2026 · staging URL /senior-doma-sam-sos-pomoc/ · WordPress nasazení zatím nepotvrzeno.

## Náplň
Praktická volba mezi 1) rodinným SOS voláním, 2) profesionální tísňovou péčí (registrovaná sociální služba s nepřetržitým dispečinkem), 3) mobilními SOS hodinkami a 4) automatickou detekcí pádu/nečinnosti. Každá větev popisuje, co neřeší a co je nutné ověřit. Jádrem je reálný řetězec **signál → příjem → fyzická pomoc**, nikoliv seznam „10 nejlepších tlačítek“.

## Podklady
- MPSV Péče a služby https://mpsv.gov.cz/pece-a-sluzby
- MPSV Registrace tísňové péče https://mpsv.gov.cz/registrace-poskytovani-socialnich-sluzeb
- MPSV Registr poskytovatelů https://mpsv.gov.cz/pro-verejnost
- NHS Personal alarms / telecare https://www.nhs.uk/social-care-and-support/care-services-equipment-and-care-homes/personal-alarms-security-systems-and-keysafes/
- Praha 7 – SOS služba v praxi https://www.praha7.cz/potrebuji-zaridit/socialni-oblast/jsem-senior-ka/pomoc-pri-padu-tisnova-pece/

Popsané § 41, noční dispečink a přivolání pomoci jsou charakteristiky služby, nikoliv garance pro každý výrobek. Chybějící spojení, nereagující rodina, falešné poplachy či přehlédnuté pády, nemožnost vstoupit do bytu, cena a dostupnost poskytovatele jsou otevřeně označené jako rizika. Akutní situace vždy 155. Neexistuje nárok na místní dotaci mimo územní pravidla.

## SEO a uživatelský záměr
„senior doma sám jak přivolat pomoc“, „tísňové tlačítko pro seniory“, „SOS hodinky pro seniory jak fungují“, „tísňová péče senior cena“, „detekce pádu hodinky“, „jak vybrat SOS tlačítko“. Tržní poptávka v GSC/search volume zatím číselně neověřena. Nepřidávat neověřenou shopping affiliate nabídku; službu musí pokrýt MPSV registr. Kontextové inbound ze senior-spadl-doma, bezpečný-byt, noční cesta, homepage.

## UI vizuální směr
Vlastní první-party vektorový SVG `assets/illustrations/doma-v-bezpeci.svg`: útulný domov, senior s blízkým člověkem, jemné teplé barvy a běžný život, nikoliv nemocniční či alarmující stock fotografie. Zobrazuje se na home hero a článku. Žádné nároky na externí licence, trackery, vzdálené obrázky; statická ilustrace s title/desc, na webu smysluplný alt, předepsané rozměry a responzivní rozložení.

## Release a QA
Před release nové URL staged, chráněná PHP šablona musí mít aktuální marker. Tests: 1 H1, 4 scénáře, 9 kontrol, 6 FAQ, 3 kroky reakce, safe failure, zdroje, SEO, idempotentní publikace, design, odkazy, WCAG alt a mobile CSS. Po zeleném CI + postdeploy živé 0.8.171 vydat synchronní 0.8.172: všechny chráněné marker files, PHP constant, CSS version, main=dev; teprve uživatelské Pull/Deploy. Po nasazení ověřit live 200 + sitemap, interní odkazy, 14 poradců a 25 připravených slotů. Není to měření objednávek.
