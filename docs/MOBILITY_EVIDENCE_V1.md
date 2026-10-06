# Mobility Slice v1 — evidence register

Checked: **2026-10-06**

This file records evidence boundaries. It is not an individual medical recommendation and must not be used to infer entitlement for a specific person.

## Czech reimbursement data source

### SÚKL — Seznamy zdravotnických prostředků
Source: https://sukl.gov.cz/prumysl/zdravotnicke-prostredky/kategorizace-a-uhradova-regulace/seznamy-zdravotnickych-prostredku/

Supported facts:
- SÚKL publishes the list of health devices reimbursed when prescribed on a voucher.
- The list includes maximum manufacturer prices, reimbursement amounts and reimbursement conditions.
- The list is valid for the following calendar month.
- Machine-readable CSV data are available through the public ISZP interface.

Implementation consequence:
**Do not hard-code reimbursement facts into evergreen article copy when they can be derived from the current official dataset.**
Store source and validity/check date.

## ePoukaz process

### SÚKL — rules from 1 January 2026
Source: https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/

Supported fact:
From 1 January 2026, health-device prescriptions are generally issued as ePoukaz; the official page describes limited cases where a paper prescription remains possible.

Implementation consequence:
Use wording such as **"prověřit možnost úhrady / správný postup před nákupem"**, not "pojišťovna vám výrobek proplatí".

## Buying first and asking insurer later

### VZP — Proplacení chodítka
Source: https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka

Supported fact:
VZP states that a health aid already purchased directly by a patient cannot simply be reimbursed afterward to that patient; for reimbursed devices the correct route involves prescription and payment to an eligible dispensing provider under applicable rules.

Implementation consequence:
Before showing a normal retail CTA for a product family with potential reimbursement, ZaPrazi should prominently offer **"Nejdříve prověřit úhradu"** where relevant.

## Current-rule caution

Summary pages can become outdated and individual conditions differ.
For production reimbursement guidance:
1. ingest/check the current official SÚKL dataset,
2. preserve validity date,
3. show the official source,
4. never confirm individual entitlement,
5. fail closed if current data cannot be verified.

## Evidence still required before production product recommendations

- evidence-backed selection parameters for each walking-aid family,
- specific manufacturer manuals/specs for curated products,
- current merchant identity/offer verification,
- rental providers and terms,
- current SÚKL records for future products/categories beyond the verified MEYRA Ideal v1 example.

Until those are complete, the engine may return **candidate solution families**, but must not assert that a particular product is medically suitable.


## Verified current monthly record — MEYRA Ideal Rollator 3061982

Checked: **2026-10-06**

Official current source:
- SÚKL electronic board: *Seznam cen a úhrad ZP hrazených na poukaz k 1. 10. 2026*
- official PDF: https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V018PP@SUKLAA/26D0TRRB@SUKLAA/ZPSCAU_20261001.pdf

Exact record:
- SÚKL code: **5005963** (ZaPrazi display code **07-5005963**),
- device: **IDEAL ROLLATOR 3061982**,
- official reimbursement amount in the October 2026 list: **3,408 Kč**,
- reimbursement group: **07.03.02.03**,
- listed interval: **60 months**,
- prescriber codes in the record: **GER, ORP, NEU, ORT, PRL, REH, CHI, REV**.

Validity boundary:
- this evidence is valid for **October 2026**,
- ZaPrazi treats it as current only through **2026-10-31**,
- from **2026-11-01** the amount is fail-closed until the new monthly SÚKL record is verified.

Trust boundary:
- the official list confirms the reimbursement amount recorded for the device,
- it does **not** by itself confirm an individual person's entitlement,
- ZaPrazi does not infer the final individual copay from this row,
- the correct prescription/ePoukaz process and applicable conditions still need to be satisfied.
