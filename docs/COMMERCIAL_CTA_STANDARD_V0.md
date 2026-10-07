# Commercial CTA standard — v0

Checked: **2026-10-07**

## Goal

Increase outbound click clarity across all product-recommending Zápraží Advisors without changing suitability, product ranking or merchant selection.

## CTA copy

Affiliate-configured offer:
- **Zobrazit cenu a dostupnost**

Canonical merchant fallback:
- **Zobrazit produkt a dostupnost**

This wording describes the next action without claiming that Zápraží itself knows the current merchant price or stock.

## Trust

Every offer visibly states:

**Výběr produktu se neřídí výší provize.**

The existing `nofollow sponsored` relationship remains on configured affiliate links.

## Measurement

The existing anonymous analytics event vocabulary is retained:
- `product_click`
- `merchant_click`

Indoor-walker and rollator now emit the same outbound events as the other product Advisors.

## Boundary

This change does not alter:
- decision-engine outputs,
- safety gates,
- product order,
- merchant order,
- affiliate destination URLs,
- reimbursement guidance.
