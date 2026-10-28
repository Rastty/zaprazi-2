# Zápraží – Hůl, francouzská berle, chodítko nebo rollátor (28. 10. 2026)

## Proč
Cílená otázka rodin před rozhodnutím o chodítku: zda je menší opora (hůl/berle) vhodná, nebo již nestačí. Rozšiřujeme jednu existující kanonickou URL `/choditka-pro-seniory/#hul-nebo-choditko` a nevytváříme konkurující landing page. Výsledky českého vyhledávání ukazují existující konkurenci (Zdravotnický deník, Medstore, iZDRAV), nikoliv doloženou hledanost nebo nízké CPC. GSC data/CTR UNKNOWN.

## Rozhodovací UX
Čtyři srozumitelné typy opory, žádná univerzální klasifikace jednotlivce. Včasné bezpečnostní varování; individuální posouzení u nestability, fyzické asistence, akutních obtíží a po operaci. Šest kontrol, tři akviziční cesty, bez neověřených produktů, bez zadání zdravotních údajů, bez nového enginu. Navigace z kompenzačních pomůcek, měřicího checklistu a článku o odmítání chodítka. Rozšiřuje existující prodejní cestu bez obejití fit-gates.

## Zdroje ověřené 28. 10. 2026
- NHS Walking aids: https://www.nhs.uk/social-care-and-support/care-services-equipment-and-care-homes/walking-aids-wheelchairs-and-mobility-scooters/
- VZP: https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/zdravotnicke-pomucky-pro-imobilni-pacienty
- MPSV: https://mpsv.gov.cz/pece-a-sluzby
Pravidla úhrad se mohou měnit; nové konkrétní hodnoty úhrad/produktů netvrdíme. Externí individuální odborná revize zatím není doložena.

## QA a deploy
`node --test tests/mobility-support-comparison.test.js`, full CI, production browser QA, release integrity marker 96/96. Poté GitHub PR, main=dev, Deployer for Git Pull+Deploy, live content and readiness readback.
