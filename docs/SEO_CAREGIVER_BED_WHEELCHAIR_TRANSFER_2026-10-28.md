# Zápraží: Pečující nezvládá přesun z postele na vozík – 28. 10. 2026

Zpřesnění existujícího pilíře `/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik`. Zachovává jedinou kanonickou URL a nevyžaduje novou WP Page. Směr: dotazy pečujících (přesun/zvedání), hlubší rozhodování před pořízením zvedáku, desky, postele či vozíku. Není doložená kvantitativní hledanost ani záruka organické návštěvnosti.

## UX / bezpečnost
Rozlišení nebezpečného fyzického zvedání, asistovaného stoje, chybějícího posazení a úvah o pomůcce. Žádný postup ručního zvedání bez výuky, žádná univerzální pomůcka, žádný prodejní zkrat. Sedm otázek pro fyzioterapeuta/ergoterapeuta nebo zdravotnický tým, včetně opory, personálu, prostoru, kompatibility závěsu, údržby a nouzových kroků. Přirozené interní odkazy z vozíku, návratu z nemocnice, otázkového checklistu a homepage. Odpovědi se nezadávají do webu ani neukládají; medicínská konzultace má přednost.

## Zdroje
HSE moving-handling-equipment: https://www.hse.gov.uk/healthservices/moving-handling/moving-handling-equipment.htm
HSE manage-the-risk: https://www.hse.gov.uk/healthservices/moving-handling/manage-the-risk.htm
NHS carers handling: https://www.nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/how-to-move-lift-and-handle-someone-else/
Zdroje byly ověřeny 28. 10. 2026. Britská doporučení slouží pro obecné bezpečnostní hranice, ne jako tvrzení o českých úhradách a právech. Nezávislá odborná revize zatím není doložena.

## QA
`node --test tests/caregiver-transfer-safety-seo.test.js`, existující 14 poradenských scénářů a produkční browser smoke QA, 96/96 release markers. Po merge main=dev, WordPress Pull+Deploy, live integrity a link checks.
