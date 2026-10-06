# Legacy ZaPrazi migration audit

## Purpose

Preserve real search/link/user value from the old site without allowing legacy information architecture to define ZaPrazi 2.0.

No destructive migration happens during inventory.

## Required URL verdicts

- **KEEP** — current page has genuine user/search value and remains strategically valid.
- **MERGE** — intent belongs inside a stronger new page; redirect only after replacement exists.
- **REPURPOSE** — update the same URL while preserving its original search intent.
- **REMOVE** — no meaningful value; use 404/410 unless a genuinely equivalent replacement exists.

Never redirect unrelated removed URLs to homepage.

## Inventory fields

Minimum CSV/JSON fields:

```text
url
title
post_type
category
published_at
modified_at
status
canonical
indexable
word_count_or_content_size
new_intent_candidate
verdict
target_url
reason
gsc_clicks
gsc_impressions
gsc_period
backlink_signal
notes
```

Unknown values stay unknown.

## Decision order

1. Does the URL have a distinct useful intent?
2. Does it have measurable search traffic or valuable links?
3. Does the intent fit the new ZaPrazi mission?
4. Is there a stronger new page with the same intent?
5. Only then choose KEEP/MERGE/REPURPOSE/REMOVE.

## Slice 1 filter

Prioritize old URLs related to:
- mobility,
- walking aids,
- fall prevention in practical home context,
- home accessibility,
- aids for seniors/limited mobility,
- reimbursement/prescription/acquisition.

Unrelated legacy categories are inventoried but not allowed to distract the first slice.

## Safety

Migration is reversible until redirect/removal rollout.
Create redirect map before changes.
Replacement pages must be live before redirect.
After rollout, smoke:
- HTTP status,
- redirect target,
- canonical,
- sitemap,
- internal links,
- major historical URLs.
