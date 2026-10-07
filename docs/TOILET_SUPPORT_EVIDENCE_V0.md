# Madlo / opora k WC — evidence v0

Checked: **2026-10-07**

## Search intent

Target cluster:
- madlo k WC pro seniory
- madlo do koupelny pro seniory
- toaletní opora pro seniory
- opora k WC bez vrtání

Observed SERP is dominated by category/product pages. Zápraží differentiates by deciding **wall-mounted rail vs support frame** before showing a product.

## Exact candidate 1 — UNIZDRAV P2015

Source context:
- https://unizdrav.cz/madla-a-opory
- historical/detail evidence retained in production catalog.

Rechecked 2026-10-07:
- listed price: **1 123 Kč**
- merchant showed **Skladem >10 ks**
- width: **53–63 cm**
- depth: **47 cm**
- height: **64–74 cm**
- max user weight: **100 kg**

Use when:
- stable hand support is needed at the toilet,
- wall fixing is not verified or not possible,
- available space and fixing compatibility are confirmed,
- transfer does not require physical lifting by another person,
- load fit is confirmed.

## Exact candidate 2 — UNIZDRAV P2131

Source:
- https://unizdrav.cz/zbozi/2131/protiskluzove-madlo-do-koupelny-a-toalety-od-30-do-45-cm

Rechecked 2026-10-07 through current UNIZDRAV category:
- listed from **343 Kč**
- variants: **30 / 40 / 45 cm**
- wall offset: **5.5 cm**
- max product load: **100 kg**

Critical boundary:
- product load does **not** prove the capacity of the actual wall installation,
- wall material, anchors, screw selection and mounting position must be appropriate,
- no automatic rail recommendation when wall fixing is unverified.

## Architecture

Page:
- `/madlo-k-wc-pro-seniory/`

Reuses:
- `src/bathroom/engine.js` with `primaryNeed = toilet_support`
- `src/bathroom/catalog.js`
- existing affiliate slots:
  - `unizdrav-cz:p2015`
  - `unizdrav-cz:p2131`

No parallel suitability engine.

## Safety boundary

Automatic product path is blocked when:
- transfer requires physical person-assist,
- load fit is not confirmed.

Wall rail is shown only when `wallFixing = verified`.

## Next checkpoint

After deployment:
- verify indexability/canonical,
- compare clicks to P2015 vs P2131,
- only expand to broader bathroom-rail content if Search Console shows distinct demand.
