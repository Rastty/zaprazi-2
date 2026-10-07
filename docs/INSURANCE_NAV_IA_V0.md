# Insurance navigation information architecture — v0

Checked: **2026-10-07**

## Goal

Make broad insurance navigation lead to the broad insurance hub, while category-specific insurance pages remain detail destinations.

## Global route

**Pojišťovna** → `/kompenzacni-pomucky-pro-seniory/#pojistovna`

This route is now exposed from:
- primary navigation,
- homepage,
- footer.

## Category route

The walker insurance page still exists at:
- `/choditko-na-pojistovnu/`

Its primary **Nejdřív vybrat vhodný typ** CTA now routes to:
- `/choditka-pro-seniory/`

instead of the homepage mobility anchor.

## Why

A broad navigation label should not silently imply that insurance guidance only applies to walking aids. The central hub separates walking aids, bathroom/WC, adjustable beds and wheelchairs into category-specific evidence pages.

## Boundary

This change affects navigation only. Reimbursement evidence, approval rules, product ranking and individual eligibility boundaries remain unchanged.
