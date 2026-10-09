# Zápraží 2.0 — Quality gate pro 14 poradců (2026-10-09)

## Schválené pořadí práce

1. **Dokončit všech 14 existujících poradců**: správné praktické otázky, větvení bez zbytečných odpovědí, bezpečné pravidlo pro „nevím“/„ne“, konkrétní produkty s doloženými parametry, srozumitelné „proč“ a další krok, přístupné mobilní UX. Nezavádět nový rozhodovací engine ani Home Scan.
2. **Až po uzavření kritických a významných závad** připravit novou značku pro web: snadno zapamatovatelné logo „Zápraží“ se schváleným směrem „Cesta k lepšímu životu“ a odpovídající jednoduchý favicon. Ověřit čitelnost na mobilu, výšku hlavičky, kontrast, favicon v malé velikosti a konzistenci web/metadata.
3. Teprve pak pokračovat ve schválené vizi: další UX benchmarky, SEO, monetizace, měření a podmíněný Home Scan. Windsor.ai není závislost, nepřipojovat.

## Doložený bezpečnostní nález P0: vana, nesdílet potvrzení nosnosti

- BESCO BS008 má doložený limit **100 kg** a UNIZDRAV P2203 **110 kg**. Zdroj: produktové stránky obou obchodníků; 9. 10. 2026 znovu ověřen P2203 na https://unizdrav.cz/zbozi/2203/sprchovaci-zidle-do-vany a BS008 přes produkt https://www.rehabilitacnepomocky.sk/besco-sedacka-na-vanu-s-madlom/ (stejné označení BES-BS008). Není důvod ukládat hmotnost člověka.
- Před opravou mohlo potvrzení `loadFit=yes` z P2203 (110 kg) zůstat vybrané při přepnutí `bathFit=no → yes`, tedy předběžně otevřít nabídku BESCO BS008 (100 kg) bez nového ověření. Obě větve jsou různá konstrukce a jeden souhlas pro ně **nesmí** platit.
- Oprava: `dependentFitResets: { bathFit: ["loadFit"] }` ve sdílené Bathroom micro-staging vrstvě; každé přepnutí varianty zruší potvrzení nosnosti. Finální doporučení stále uděluje pouze `recommendBathroom()` při reálně ověřených údajích. Žádné parametry ani odpovědi do analytics, URL či persistentního stavu.
- Automatický test: obě změny variant, „unknown“ nesmí odemknout nabídku, opětovné „yes“ smí odemknout pouze příslušný model; regresi opakovat v produkčním Chrome QA **až po deployi nové verze**.

## Akceptační brány pro dalších 14 poradců

| Oblast | Důkaz požadovaný před označením za hotové |
|---|---|
| Vstupní otázky | Každá otázka má kauzální vliv na bezpečnost, výběr modelu nebo získání; nerelevantní otázka se skryje a předchozí odpověď se vymaže |
| Přepnutí větve | Změna osoby/účelu/konstrukce/parametrů zneplatní související potvrzení a všechny předchozí obchodní odkazy |
| Bezpečnostní hranice | „Nevím“, rozpor, asistovaný přesun a fyzicky nekompatibilní model nikdy nesmějí otevřít nepodložený obchodní odkaz |
| Konkrétní model | Identita, varianty, nosnost, rozměry, umístění/uchycení a návod se musí shodovat s přesným produktem i při změně větve |
| Výstup | Co bylo vybráno, proč, co je zatím nejisté a který bezpečný další krok následuje; laik rozumí bez technického slovníku |
| Získání pomůcky | Zvážit koupit/půjčit/ověřit úhradu podle relevantnosti, nikdy jen nejvyšší affiliate provizi |
| Přístupnost | Mobil 390 px, klávesnice, fokus po chybě a výsledku, přístupné názvy, dobře viditelné sekundární informace |
| Ochrana údajů | Odpovědi pouze v paměti prohlížeče, žádný osobní/zdravotní profil v URL, GA4, affiliate nebo logu |
| Produktový obchod | Explicitní kontrola modelu a klikatelnost až po jejím splnění; evidence odkaz nesmí být obchvatem nákupního zámku |
| Praktická použitelnost | Nezávislé čtení a zkouška s běžnými uživateli; automatické CI samo o sobě nenahrazuje terénní UX ani fyzickou kontrolu vhodnosti |

## Vedení práce

- P0: bezpečnost, chybné produkty, pomíchané kapacity, odemknutí bez kontrol.
- P1: nelogické větvení, chybné pořadí otázek, nevysvětlený výsledek, slepé konce, produktové parametry bez přesného zdroje.
- P2: srozumitelnost, rozložení, přístupnost a vizuální polish.
- Status „bez kritických známých závad“ lze udělit až po kontrolách celé matice 14 poradců + produkčním ověření finální verze. „Dokonalý/bez jakékoli chyby“ neslibovat; zdroje, obchodní dostupnost i lidské situace se mohou změnit.
