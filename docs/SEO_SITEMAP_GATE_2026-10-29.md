# Public SEO discovery gate — deployed decision pages (2026-10-29)

## Evidence and scope
GitHub Actions Public SEO Sitemap Audit run 40866789768 (2026-10-29 11:37 UTC) read the production public XML and readiness, with no WordPress writes. At release 0.8.183 it observed one HTTPS `page-sitemap.xml` with **54 unique HTTPS URLs**, no duplicate paths, and no missing previously required decision URLs. All 13 previously staged practical decision pages were present, including `/jak-vybrat-pecovatelskou-sluzbu/`. The independent production acceptance subsequently verified the new care-service guide and its search CTA (PR #511). This is **XML discovery, not Google indexation, traffic, rank or commissions**.

## Change
Promote those 13 already deployed routes to `requiredDecisionPaths`. Keep `stagedDecisionPaths` empty until another future release has an unverified page. The scheduled and PR Public SEO Sitemap Audit now fails closed when any required URL disappears, the advertised index is not HTTPS, HTTP locs return, or duplicate page paths appear. These failures should trigger investigation before destructive redirects or bulk indexing changes.

## Guardrails
Read-only GET on exact `zaprazi.cz` host; no GSC or analytics credentials, no affiliate actions, no WordPress writes. If production deliberately retires a page later, change the required inventory **only** with an evidence-backed SEO migration and appropriate matching replacement/redirect. No assumption that XML listing guarantees indexing or sales.

## Follow-up
Compare 28/90-day GSC page-level data to the 54 URL sitemap inventory and identify high-intent pages with real impressions but weak clicks; review one page at a time with intent evidence and approved sources.
