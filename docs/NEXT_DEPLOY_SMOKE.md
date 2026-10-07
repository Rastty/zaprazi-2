# Next Deploy Smoke — ZaPrazi 2.0 v0.8.21

This release supersedes 0.8.20. Deploy only 0.8.21 from `dev`.

## 1. Release integrity
Open `/`.

Expected:
- `zaprazi-release` = `0.8.21`
- `zaprazi-integrity` = `ok`
- header contains **Invalidní vozík**

## 2. New Slice 4 page
Open:
`/invalidni-vozik/`

Expected:
- dedicated Advisor page loads,
- no diagnosis request,
- no exact body-weight input,
- answers stay client-side.

## 3. Companion branch
Choose:
- propulsion: **Hlavně doprovodná osoba**
- transfer: samostatně or s oporou
- seat fit: ano
- width fit: ano
- load fit: ano

Expected:
- **UNIZDRAV P4384 Basic**
- seat 48 cm
- total width 65 cm
- load 100 kg
- chair weight 18.4 kg
- canonical UNIZDRAV link while affiliate slot is empty.

## 4. Self/manual branch
Choose:
- propulsion: **Hlavně uživatel rukama**
- transfer: samostatně
- seat fit / width fit / load fit: ano

Expected:
- **UNIZDRAV P3641**
- seat 48 or 51 cm
- total width 68 or 70 cm
- self-propulsion rims
- companion brakes
- load 125 or 136 kg depending wheel variant.

## 5. Mixed manual branch
Choose:
- propulsion: **Střídavě uživatel i doprovod**
- fit gates: ano

Expected:
- same P3641 candidate,
- rationale mentions both self propulsion and companion use.

## 6. Powered branch
Choose:
- propulsion: **Elektrický pohon**
- transfer: samostatně or s oporou
- seat / width / load fit: ano
- joystick safe: ano
- charging ready: ano

Expected:
- **UNIZDRAV P2961**
- seat 46 cm
- total width 63 cm
- load 135 kg
- total weight with battery 62 kg
- max speed 6 km/h
- turning radius 86.5 cm
- charging / route caution visible.

## 7. Powered fail-closed
Powered branch with:
- joystick safe = no / unknown, or
- charging ready = no / unknown

Expected:
- no exact powered product.

Joystick safe = no:
- professional-check result.

## 8. Transfer fail-closed
Any propulsion branch with:
- transfer = **Běžně fyzicky pomáhá druhá osoba**

Expected:
- professional-check only,
- no exact product,
- explanation that wheelchair selection alone does not solve transfer safety.

## 9. Fit gates
Any branch with:
- seat fit no/unknown,
- width fit no/unknown,
- load fit no/unknown

Expected:
- no exact product.

## 10. Affiliate admin
Open:
**Nastavení → ZaPrazi affiliate**

Expected:
- Mobility **3/3**
- Bathroom/WC **0/9**
- Polohovací postel **0/3**
- Invalidní vozík **0/3**

Wheelchair slots:
- UNIZDRAV P4384 Basic
- UNIZDRAV P3641
- UNIZDRAV P2961

Empty slots must use exact canonical product URLs.

## 11. Privacy / analytics
Expected:
- no GA4 before consent,
- only generic events after consent,
- no propulsion / transfer / seat / width / load / joystick / product ID / merchant ID values sent to analytics.

## 12. Slice 3 regression
Expected unchanged:
- `/polohovaci-postel/` works,
- `/polohovaci-postel-na-pojistovnu/` works,
- CLASSIC / Hospital / Multibed routing remains intact.

## After smoke
1. add wheelchair high-intent acquisition page: pojišťovna / půjčení / koupě,
2. add exact wheelchair deeplinks only from approved affiliate tooling,
3. pursue exact product-level SÚKL mapping where identity can be proven,
4. switch immediately to Search Console track 2 once query/page data become accessible.
