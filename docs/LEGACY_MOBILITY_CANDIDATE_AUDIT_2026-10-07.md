# Legacy Mobility candidate audit — 2026-10-07

## Scope

Source universe:
- `data/legacy-url-inventory.csv`
- 4,367 unique published URLs
- 4,360 posts + 7 pages

Purpose:
Identify obvious legacy URLs that could support Slice 1 Mobility before any redirect, merge or removal work.

## Method

Lexical scan across legacy URL, slug and title fields.

Direct walking-aid terms:
- chodítko / choditko
- rollátor / rollator
- berle
- hůl
- vozík
- kompenzační pomůcka

Weak adjacent terms were reviewed separately:
- bezbariérový
- senior

The two new ZaPrazi 2.0 pages were excluded from legacy-candidate counts:
- `/choditko-na-pojistovnu/`
- `/pujceni-choditka/`

## Result

### Direct Mobility legacy candidates

**0 URLs**

There is no obvious pre-existing article/page whose title or slug directly targets walkers, rollators, crutches, canes, wheelchairs or compensatory aids.

### Weak adjacent matches

1. `/designovy-nabytek-jako-soucast-bezbarierovych-zdravotnickych-zarizeni/`
   - title: *Designový nábytek jako součást bezbariérových zdravotnických zařízení*
   - verdict: **NO AUTOMATIC MIGRATION**
   - reason: accessibility-related wording, but the intent is furniture / healthcare-facility design rather than a household walking-aid decision.

2. `/stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu/`
   - title: *Stoly bezpečné pro děti a seniory: Jaké jsou kritéria výběru?*
   - verdict: **NO AUTOMATIC MIGRATION**
   - reason: senior-adjacent wording, but the intent is furniture safety rather than Mobility.

## Decision

Do **not** create redirect mappings from unrelated legacy content into the new Mobility pages merely to manufacture migration volume.

The current safe position is:
- keep the two new high-intent Mobility pages as clean new URLs,
- keep legacy URLs untouched unless search/backlink evidence shows a real relationship,
- use Search Console / backlink evidence to discover non-obvious high-value legacy candidates.

## Remaining blocker

Row inventory is no longer the blocker.

For destructive migration decisions the blocker is now **traffic/link evidence**, primarily:
- Google Search Console clicks and impressions by URL/query,
- backlink/value review for candidate URLs,
- intent equivalence before any MERGE / REPURPOSE / REMOVE decision.
