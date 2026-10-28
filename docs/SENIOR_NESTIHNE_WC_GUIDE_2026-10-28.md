# SEO problem guide: Senior nestihne dojít na WC (28. 10. 2026)

## Why this URL
A caregiver's problem is not the product name. Search results for Czech toilet mobility queries often emphasize product types (WC frames, risers, bedside commodes). This guide explicitly distinguishes (1) urgency / possible clinical causes, (2) distance and speed, (3) sitting/rising, and (4) inability to transfer. No numeric search-volume claim or ranking forecast has been made.

## Safe user journey
Problem search → new `/senior-nestihne-dojit-na-wc/` → first safety gate → identify actual obstacle → 7-point household audit → conditional advisor or professional help. Product ranking and affiliate offers remain on the existing specialized advisors, not in the article. No questionnaires or personal data are collected.

The page draws on and links to NZIP guidance on toilet/continence caregiving, NHS urinary incontinence guidance, MPSV distinction of home care/social services and Maltézská pomoc's toilet-aids overview. Editorial review: 28.10.2026; no claim of external clinical review.

## Deployment and verification
- New WordPress page is created idempotently on `init` when slug is missing, with a dedicated page template. Existing page content is never replaced.
- New template is included in the 0.8.183 integrity inventory (97 entries).
- Inbound links: WC/bathroom hub, nighttime WC problem guide, toilet-chair advisor; conservative internal search routes.
- Tests: safety language, source links, real anchor targets, creation contract, no merchants, five intent queries, 97-file integrity uniqueness.
- After merging, WP Pull + Deploy from `dev`, verify `release=0.8.183`, `integrity=ok`, configured affiliate slots `25/25`, `/senior-nestihne-dojit-na-wc/` is HTTP 200 with relevant content, sitemap/canonical, three real inbound paths and search intent.
- Do not add this route to `scripts/lib/live-verified-problem-paths.mjs` until confirmed live; the aggregate audit is for verified URLs only.

Future improvement should be based on GSC impressions, not guessed keyword volumes. Track aggregate article→advisor navigation where consent permits, not sensitive queries.
