# Decision UX audit — Zápraží 2.0 (2026-10-09)

## Mandatory funnel invariant

Situation & safe transfer → exact model + source-backed measurements (unverified preview) → validate this model's fit → original fail-closed engine → merchant action if safe.

An unverified preview is **not** approval of a medical aid. Hypothetical fit values are used only to determine which technical model facts to show; never for final purchase eligibility. No answers or personal profile are transmitted in analytics or appended to affiliate URLs.

## Reviewed advisors

| Advisor | Before | After / Decision |
|---|---|---|
| Main Bathroom/WC | Asked capacity, WC/mounting and dimensions for unidentified aid | Staged in 0.8.59; included in release 0.8.60 |
| Adjustable beds | Asked capacity and floor-space fit before exact product | Staged in 0.8.60; previews model details then confirms actual user needs |
| Wheelchairs | Asked seat width, door fit and capacity before specific model | Staged in 0.8.60; unknown or assisted transfer and unsafe powered controls never unlock a preview |
| WC riser | Asked WC compatibility, feet on floor and load before model | Staged in 0.8.60 |
| Shower chair | Asked capacity and exact chair space | Staged in 0.8.60 |
| Toilet chair | Asked model space and load | Staged in 0.8.60 |
| Grab rail/toilet support | Asked specific aid capacity | Staged in 0.8.60; general wall anchoring remains a practical precondition |
| Bath seat/transfer bench | Asked bathtub/model fit and load before model | Staged in 0.8.60; shows both rim seat and possible bench alternative |
| Main Mobility, indoor walker and rollator | Asks practical walking/ability to lift walker or operate brakes | Existing order acceptable; no required unknown specific model size |
| Self-care | Asks practical task, stability of table and one-handed operation | Existing order acceptable; not product-specific capacity |
| Footwear | Asks opening preference, closure use and whether feet have been measured | Existing order acceptable; measuring feet is a necessary general preparation, not a claim that an unknown shoe size fits |

## Live smoke required after 0.8.60 deployment

Verify release integrity, all previews render factual model specifications and **no** merchant click target; stage 2 unknown/no fit prevents product offers; actual yes answers can show eligible product; changing stage-1 answer clears prior fit confirmations; physically assisted transfers block precise selection; keyboard focus and mobile spacing remain usable.

## Open operational follow-up

Real browser testing with caregivers, GSC traffic baseline, sales/network attribution, and verification of individual product fact freshness remain pending. Never treat Node tests as equivalent to end-user usability or verified commissions.
