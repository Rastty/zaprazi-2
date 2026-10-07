# Next Deploy Smoke — ZaPrazi 2.0 v0.8.12

Run after deploying release 0.8.12 from `dev`.

## 1. Release integrity

Open `/`.

Expected:
- `zaprazi-release` = `0.8.12`,
- `zaprazi-integrity` = `ok`,
- homepage and `/koupelna-a-wc/` load without errors.

## 2. Affiliate admin readiness

Open:
**Nastavení → ZaPrazi affiliate**

Expected:
- **Mobility 3 / 3**
- **Koupelna a WC 0 / 5**
- existing three Mobility partner links remain populated,
- five UNIZDRAV Bathroom/WC slots are visible with exact canonical product targets.

Expected Bathroom/WC targets:
- P2868 — raised WC seat,
- P2015 — toilet support,
- P2807 — static commode,
- P2062 — shower chair,
- P2131 — fixed grab rail.

Research-only P2085 must not have an affiliate slot.

## 3. Safe fallback

Without entering any UNIZDRAV affiliate link:

Run the Bathroom/WC Advisor through one eligible branch.

Expected:
- exact UNIZDRAV product still opens via canonical merchant URL,
- no dead end,
- no `sponsored` label unless a partner URL is actually configured.

## 4. Mobility regression

Expected:
- existing 3 Mobility affiliate deeplinks still work,
- recommendation ranking is unchanged.

## 5. Bathroom/WC regression

Quick checks:
- raised WC safe-fit branch → P2868,
- toilet support with unverified wall fixing → P2015 only,
- shower chair safe-fit branch → P2062,
- assisted transfer / bath transfer / combined hygiene wheelchair → professional-check only.

## After smoke

Next monetization step:
1. generate exact publisher deeplinks for the five UNIZDRAV targets,
2. paste them into **Nastavení → ZaPrazi affiliate**,
3. test each deeplink,
4. then Bathroom/WC readiness moves from 0/5 toward 5/5.

RehaVita stays reserved for later ADL / return-from-hospital because its currently verified inventory does not improve Bathroom/WC v1.
