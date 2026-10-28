# Zápraží — domácí zdravotní péče vs. pečovatelská služba vs. osobní asistence

28. 10. 2026. Rozšířena existující kanonická URL `/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba`, ne nový podprůměrný článek ani nový rozhodovací engine.

## Pomoc uživateli
Při propuštění z nemocnice rozlišit (1) zdravotní úkony předepsané lékařem a při splnění podmínek hrazené zdravotním pojištěním, (2) praktickou pomoc terénní pečovatelské služby ve smluvené časy, (3) individuálně dohodnutou osobní asistenci. Odlišit kontakt od potvrzené kapacity a nepřisuzovat zdravotním pojišťovnám úhradu sociální péče. Šest praktických organizačních kroků a 3 FAQ, žádné zdravotní údaje, žádné produktové CTA bypassy. Kontextové odkazy z homepage, nemocničního seznamu a bezpečných přesunů. Zdravotní plán přednostně stanoví zdravotníci.

## Ověřené veřejné zdroje (28. 10. 2026)
- MPSV: https://mpsv.gov.cz/pece-a-sluzby
- NZIP: https://www.nzip.cz/clanek/209-domaci-pece
- VZP: https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/kdo-ma-narok-na-hrazenou-domaci-peci
- Úřad práce: https://mpsv.gov.cz/up-cz/prispevek-na-peci
- MPSV registr: https://mpsv.gov.cz/pro-verejnost
Nezaručovat konkrétní čas, cenu, kapacitu, schválení příspěvku nebo hrazený výkon bez individuálního ověření. Nezávislá odborná revize redakce není doložena.

## QA & deploy
`node --test tests/home-care-service-triage-seo.test.js` a celé CI v GitHubu. Včetně 96 release markerů 0.8.182, stylu a konstanty; produkční Deployer for Git z dev a následně kontrola HTML, anchorů, release/integrity a affiliate readiness. Není zde automatické nasazení.
