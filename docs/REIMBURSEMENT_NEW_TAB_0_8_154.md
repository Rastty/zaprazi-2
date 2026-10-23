# Zápraží 0.8.154 — úhrada pomůcky bez ztráty odpovědí

## Nález

Předchozí release 0.8.153 již chrání odpovědi při otevření měřicího průvodce. Ve společném komponentu `renderBathroomAcquisition` ovšem odkaz na stránku `/pomucky-do-koupelny-na-pojistovnu/` otevíral navigaci v téže kartě. Po vyplnění dvoufázového poradce mohl návštěvník přijít o odpovědi i potvrzenou vhodnost výrobku. Původní odpovědi se záměrně neukládají.

## Oprava

- Společný výsledkový odkaz pro hlavní koupelnový poradce a pět specialistů otevírá interní stránku úhrady do **nové karty**.
- Má `target="_blank" rel="noopener noreferrer"`, srozumitelný doprovodný text a žádné parametry odpovědí v URL.
- SÚKL a VZP externí odborné odkazy zůstávají nezměněny.
- Nezasahuje do doporučovacího enginu, pravidel úhrady, nákupního fit gate, katalogu ani affiliate URL.

## Akceptace

- Node jednotkové testy všech pěti specialistů a bezpečnostních hranic renderovacího modulu.
- GitHub predeploy CI, SEO QA, legacy fidelity, 14 advisor browser smoke proti dosavadní produkci 0.8.153.
- Read-only browser QA pěti skutečných kandidátních výsledků po nasazení 0.8.154: otevřít úhradu v nové kartě a ověřit původní odpovědi z obou fází, zobrazený výsledek i korektní nabídky. Bez obchodních kliknutí nebo POST.
- Integrity marker 0.8.154 ve všech 78 původních runtime souborech; po ručním Pull + Deploy ověřit 0.8.154, integrita ok, 25/25 affiliate.

Soukromé odpovědi zůstávají výlučně ve formuláři původní karty.