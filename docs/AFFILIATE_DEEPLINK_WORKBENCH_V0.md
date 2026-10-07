# Affiliate deeplink workbench — v0

Checked: **2026-10-07**

## Goal

Reduce manual work needed to turn canonical product fallbacks into verified publisher-specific affiliate deeplinks.

## Current network mapping

- RehabilitačníPomůcky.cz — VIV/CJ
- Lékárna.cz — VIV/CJ
- UNIZDRAV — VIV/CJ, public CJ program 5654758
- Dr.Max — VIV/CJ
- RehaVita.cz — eHUB campaign 18119967
- Zdravá Obuv — VIV/CJ

## Important correction

Older Zápraží admin copy called RehaVita campaign 18119967 a VIV/CJ advertiser. Current public evidence identifies 18119967 as an eHUB campaign. The workbench corrects this.

## Admin workflow

For each missing slot the admin shows:
- correct network,
- known public program/campaign ID where available,
- product label,
- exact canonical product URL,
- slot key,
- one-click **Kopírovat URL** action.

The publisher still creates the actual tracking URL in the approved network account and pastes it into the existing slot.

## API

The readiness endpoint also returns `network` and `program` for missing rows.

## Boundary

No tracking URL is fabricated, no credentials are stored in Git, and network readiness never influences recommendation suitability or order.
