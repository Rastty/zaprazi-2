# Sprchovací židle pro seniory — evidence v0

Checked: **2026-10-07**

## Search intent

Target cluster:
- sprchovací židle pro seniory
- židle do sprchy pro seniory
- sprchovací židle s madly
- sprchovací židle na pojišťovnu

Zápraží differentiator:
- transfer first,
- stable-floor and space-fit gates,
- exact dimensions,
- insurer route kept separate from retail.

## Exact candidate — UNIZDRAV P2062

Source:
https://unizdrav.cz/zbozi/2062/sprchovaci-zidle-s-ruckami

Rechecked 2026-10-07:
- listed price: **1 618 Kč**,
- merchant showed **Skladem >10 ks**,
- total width: **55 cm**,
- total depth: **48 cm**,
- total height: **67.5–80 cm**,
- seat height: **38–50.5 cm**,
- seat: **40 × 33 cm**,
- max user weight: **136 kg**,
- product weight: **3.1 kg**,
- side arm supports,
- height-adjustable seat,
- perforated seat/back.

## Suitability gates

Automatic candidate requires:
- transfer without physical lifting by another person,
- stable floor,
- enough room for 55 × 48 cm overall footprint and transfer,
- confirmed load fit.

Physical person-assist, unstable floor or insufficient space blocks the product path.

## Insurance boundary

VZP currently describes selected shower/bathroom compensatory devices as potentially reimbursable under concrete conditions.

This page must not imply:
- UNIZDRAV P2062 itself is reimbursed,
- every shower chair is reimbursed,
- retail purchase can simply be reimbursed afterward.

Users are routed to:
- `/pomucky-do-koupelny-na-pojistovnu/`

for the insurer workflow.

## Architecture

Page:
- `/sprchovaci-zidle-pro-seniory/`

Reuses:
- `src/bathroom/engine.js`
- `src/bathroom/catalog.js`
- existing affiliate slot `unizdrav-cz:p2062`

No second shower-chair suitability engine is introduced.

## Next checkpoint

After deployment:
- verify indexability and canonical,
- inspect Search Console impressions,
- compare completion vs main Bathroom Advisor,
- only expand to shower/bath transfer micro-pages when distinct query evidence justifies it.
