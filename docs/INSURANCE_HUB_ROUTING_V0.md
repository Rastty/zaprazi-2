# Insurance hub routing — v0

Checked: **2026-10-07**

## Goal

Use the existing `/kompenzacni-pomucky-pro-seniory/` page as the single broad entry point for **pomůcky na pojišťovnu**, instead of creating another overlapping URL.

## Architecture

Hub:
- `/kompenzacni-pomucky-pro-seniory/#pojistovna`

Detail routes:
- `/choditko-na-pojistovnu/`
- `/pomucky-do-koupelny-na-pojistovnu/`
- `/polohovaci-postel-na-pojistovnu/`
- `/invalidni-vozik-na-pojistovnu/`

Every detail route links back to the hub.

## Why

The broad query is not one reimbursement rule. Different categories have different prescribers, approval steps, frequencies and exact product conditions. The hub explains that distinction and then routes to the category-specific evidence page.

## Current official context

- Since January 2026, ePoukaz is the standard electronic prescription form for medical devices.
- ePoukaz itself does not prove entitlement or reimbursement.
- Some categories require prior insurer approval; others may not.

## Boundary

Zápraží does not infer individual entitlement, diagnose the user or label a retail product as reimbursed without exact current evidence.
