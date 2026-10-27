# Read-only WP-CLI SQL evidence pack — no mutations

Run with WPVibe WP CLI `db query "..." --limit=...`. WPVibe supports `{prefix}` instead of a hard-coded DB prefix.

## Published post/page inventory

```sql
SELECT post_type,post_status,COUNT(*) AS n FROM {prefix}posts
WHERE post_type IN ('post','page')
GROUP BY post_type,post_status ORDER BY post_type,post_status;
```

## Repeated malformed historical markup and promo CTA

```sql
SELECT COUNT(*) AS posts,
 SUM(CASE WHEN post_content LIKE '%[su_button%' THEN 1 ELSE 0 END) AS promo_shortcode,
 SUM(CASE WHEN post_content LIKE '%<!DOCTYPE html%' THEN 1 ELSE 0 END) AS full_document_embedded,
 SUM(CASE WHEN post_content LIKE '%<iframe%' THEN 1 ELSE 0 END) AS iframe_posts,
 SUM(CASE WHEN post_content LIKE '%zaprazi.cz/fotovoltaika%' THEN 1 ELSE 0 END) AS old_solar_links
FROM {prefix}posts WHERE post_type='post' AND post_status='publish';
```

## Four large off-topic categories — deduplicated count

```sql
SELECT COUNT(DISTINCT p.ID) AS posts_in_four
FROM {prefix}posts p
JOIN {prefix}term_relationships tr ON tr.object_id=p.ID
JOIN {prefix}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id
JOIN {prefix}terms t ON t.term_id=tt.term_id
WHERE p.post_type='post' AND p.post_status='publish'
  AND t.slug IN ('tepelna-cerpadla-a-fotovoltaika','zarizeni','cerpadla-a-domaci-vodarny','ventilatory')
  AND tt.taxonomy='category';
```

## Existing per-post Yoast noindex metadata

```sql
SELECT COALESCE(pm.meta_value,'(none)') AS noindex,COUNT(*) AS n
FROM {prefix}posts p
LEFT JOIN {prefix}postmeta pm ON pm.post_id=p.ID
 AND pm.meta_key='_yoast_wpseo_meta-robots-noindex'
WHERE p.post_type='post' AND p.post_status='publish'
GROUP BY COALESCE(pm.meta_value,'(none)');
```

## Bounded canary candidate preview, never execute write through this query

```sql
SELECT p.ID, p.post_name, LEFT(p.post_title,120) AS title,
  DATE(p.post_date) AS created
FROM {prefix}posts p
JOIN {prefix}term_relationships r ON r.object_id=p.ID
JOIN {prefix}term_taxonomy tt ON tt.term_taxonomy_id=r.term_taxonomy_id
JOIN {prefix}terms t ON t.term_id=tt.term_id
WHERE p.post_type='post' AND p.post_status='publish'
 AND t.slug='tepelna-cerpadla-a-fotovoltaika'
 AND tt.taxonomy='category'
 AND p.post_content LIKE '%[su_button%'
 AND p.post_content LIKE '%<!DOCTYPE html%'
ORDER BY p.ID DESC LIMIT 200;
```

Read-only scope. **No mutating SQL or automatic metadata writes**, backups and GSC/backlink holdouts are required before P2.
