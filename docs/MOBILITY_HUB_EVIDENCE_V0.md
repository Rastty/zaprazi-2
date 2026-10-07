# Mobility hub evidence — v0

Checked: **2026-10-07**

## Target intent

Primary:
- chodítka pro seniory
- chodítko pro seniory
- jak vybrat chodítko pro seniora

Observed current SERP mixes:
- editorial comparison guides,
- specialist retailer category guides,
- manufacturer education,
- product/category pages.

The common comparison dimensions are:
- fixed vs two-wheel vs four-wheel/rollator,
- indoor vs outdoor use,
- ability to move/lift the frame,
- hand-brake control,
- width and handle height,
- purchase vs rental vs reimbursement.

## Zápraží role

`/choditka-pro-seniory/` is a **hub**, not another suitability engine.

It should:
- explain the category,
- route indoor intent to `/choditko-do-bytu-pro-seniory/`,
- route rollator intent to `/rollator-pro-seniory/`,
- route short-term acquisition to `/pujceni-choditka/`,
- route reimbursement intent to `/choditko-na-pojistovnu/`,
- keep the full Mobility Advisor on the homepage as the actual decision engine.

## Verified examples already in production

### BESCO WA17
- fixed four-point walker
- width 59 cm
- weight 2.3 kg
- max load 110 kg

### BESCO WA21
- two front wheels + two rear support legs
- width 60 cm
- weight 2.8 kg
- max load 110 kg

### MEYRA Ideal 3061982
- rollator for indoor/outdoor use
- width 61.5 cm
- handle height 79–97 cm
- max load 130 kg
- locking hand brakes
- manufacturer currently states code 07-5005963 and full reimbursement information.

## Cannibalization boundary

The broad hub targets generic comparison intent.

Narrow pages retain:
- `/choditko-do-bytu-pro-seniory/` → indoor fixed vs two-wheel decision,
- `/rollator-pro-seniory/` → rollator/brake-specific decision,
- `/choditko-na-pojistovnu/` → reimbursement intent,
- `/pujceni-choditka/` → rental intent.

The hub must not duplicate the complete questionnaire or product-routing rules.

## Internal linking target

Mobility top-level navigation should point to the hub.
The homepage keeps direct access to the full Advisor.
