# Mobility Slice v1 — merchant evidence

Checked: **2026-10-06**

This register separates public merchant/product evidence from affiliate-account status. The master brief states that RehabilitačníPomůcky.cz, Lékárna.cz and MůjZdrav.cz are approved program candidates, but live partnership status, deeplinks and feed permissions still require account-level verification before production activation.

## RehabilitačníPomůcky.cz

Public evidence:
- relevant Mobility inventory exists now, including four-point, two-wheel and four-wheel walkers,
- product pages expose dimensions, weight, load limit and product/manual references,
- the shop explicitly states that it does **not** cooperate with health insurers and products are paid fully by the customer.

Product examples found:
- Besco four-point folding walker WA17,
- Besco two-wheel folding walker WA21,
- Besco lightweight four-wheel walker WA78.

Routing consequence:
- candidate merchant for the **buy/direct-pay** branch,
- do not present it as a place to redeem insurer reimbursement/prescription unless the merchant changes its stated policy and that is re-verified.

Sources:
- https://www.rehabilitacnipomucky.cz/kompenzacni-pomucky/
- https://www.rehabilitacnipomucky.cz/besco-ctyrbodove-choditko-skladaci/

## Lékárna.cz

Public evidence:
- active category with multiple walking aids/rollators,
- MEYRA Ideal rollator is listed as a health device with price, stock state and technical data,
- the tested MEYRA Ideal product page explicitly says that health-aid vouchers cannot be used for that purchase on Lékárna.cz and the product is sold for full payment.

Routing consequence:
- candidate direct-retail merchant,
- reimbursement/prescription must remain a separate acquisition path and cannot be inferred from normal retail availability.

Sources:
- https://www.lekarna.cz/berle-hole-choditka/
- https://www.lekarna.cz/meyra-ideal-rollator-ctyrkolove-choditko/

## MůjZdrav.cz

Status: `RESEARCH_REQUIRED`.

A fresh public-web check on 2026-10-06 did not surface indexed Mobility inventory for MůjZdrav.cz and the site itself was not reachable through the current public verification layer.

Consequence:
- do not use MůjZdrav.cz in production recommendations yet,
- do not infer inventory, feed, deeplink or checkout behavior from affiliate-program approval,
- next acceptable evidence is a live account/feed record or a directly verifiable product page.

## Product identity conflict — MEYRA Ideal

The Lékárna.cz page describes a MEYRA Ideal rollator but some dimensions differ from current official MEYRA model 3061982 pages/documentation.

Current official MEYRA evidence identifies **Ideal Rollator 3061982** and provides manufacturer documentation and technical data.

Consequence:
- do not merge merchant listing facts into the canonical product record until exact product identity/variant is reconciled,
- manufacturer facts win for stable product truth after identity is established,
- merchant page remains authoritative only for that merchant's price/availability/retail conditions.

Official manufacturer sources:
- https://www.meyra.cz/ctyrkolove-choditko-rollator.html
- https://www.meyra.com/products/rehab-aid/rehab-aid/reha-wheelchair-details/ideal-rollator
- https://kisss-by-meyra.de/ALLdokuarchiv.php?suche=Ideal

## Production activation gate

Before any affiliate CTA goes live, verify per merchant:
1. active partnership in the affiliate account,
2. exact deeplink behavior,
3. whether a feed/API exists and permitted fields/refresh rules,
4. real product identity mapping,
5. outbound-link smoke,
6. disclosure and tracking behavior,
7. no recommendation-ranking dependence on commission.
