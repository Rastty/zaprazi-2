# Toaletní židle pro seniory — evidence v0

Checked: **2026-10-07**

## Search intent

Target cluster:
- toaletní židle pro seniory
- toaletní křeslo pro seniory
- přenosná toaleta pro seniory
- toaletní židle 4v1
- toaletní židle na pojišťovnu

Observed SERP is dominated by product/category pages.

Zápraží differentiator:
- distinguishes a static nearby toilet chair from a multifunction 4v1 chair,
- uses transfer / floor / space / load gates,
- keeps retail and insurer routes separate,
- does not infer diagnosis or individual reimbursement eligibility.

## Exact candidate 1 — UNIZDRAV P2807

Source:
https://unizdrav.cz/zbozi/2807/toaletni-zidle-vyskove-nastavitelna-unizdrav

Rechecked 2026-10-07:
- listed price: **2 300 Kč**,
- merchant showed **Skladem >10 ks**,
- total width: **60 cm**,
- total depth/length: **60 cm**,
- seat width: **44 cm**,
- seat height: **36–60 cm**,
- max user weight: **100 kg**,
- product weight: **8.5 kg**,
- removable toilet container,
- height-adjustable chair intended as a nearby WC replacement.

Use only when:
- main need is shortening the trip to the regular toilet,
- transfer does not require physical lifting by another person,
- stable floor is confirmed,
- enough room exists for the full chair and transfer,
- load fit is confirmed.

## Exact candidate 2 — DMA EH-CMDA 4v1

Approved merchant source:
https://www.drmax.cz/dma-eh-cmda-toaletni-zidle-4v1

Rechecked 2026-10-07:
- listed price: **3 050 Kč**,
- Dr.Max showed **Skladem u partnera**,
- usable as chair, toilet chair, shower seat or over-toilet riser,
- removable armrests,
- adjustable seat height,
- exact catalog facts already used in production:
  - total width **51 cm**,
  - depth **40 cm**,
  - seat height **39–54 cm**,
  - max user weight **150 kg**.

Use only when:
- one chair really needs to cover toilet + shower use,
- transfer does not require physical lifting by another person,
- stable floor is confirmed,
- both spaces fit the chair and transfer,
- load fit is confirmed.

## Insurance boundary

The broad category can include reimbursable medical devices, but:
- retail purchase is not the same as insurer dispensing,
- a product category name does not prove reimbursement,
- current production evidence for EH-CMDA contains manufacturer payer identity, but the current monthly SÚKL list is not yet marked verified,
- no page may present retail P2807 or EH-CMDA as automatically reimbursed.

Users are routed to:
- `/pomucky-do-koupelny-na-pojistovnu/`

## Architecture

Page:
- `/toaletni-zidle-pro-seniory/`

Reuses:
- `src/bathroom/engine.js`
- `src/bathroom/catalog.js`
- existing affiliate slots:
  - `unizdrav-cz:p2807`
  - `drmax-cz:dma-eh-cmda`

No parallel eligibility engine.

## Regression note

During this slice, a previous structural regression was found:
- FAQ branches for toilet-riser / shower-chair had been inserted into `zaprazi_2_assets()`,
- PHP syntax remained valid, so lint alone did not catch it.

Fix:
- replace the full asset-loader block with an explicit deterministic enqueue chain,
- move micro-page FAQ data into the resource FAQ schema function,
- test that the asset loader contains no `$faq` assignment or FAQ question payload.

## Next checkpoint

After deployment:
- verify all Advisor JS bundles load on their own pages,
- verify new toilet-chair page works for both static and 4v1 paths,
- inspect Search Console impressions before adding more micro-pages.
