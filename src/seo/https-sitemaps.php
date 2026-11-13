<?php
/* ZP_RELEASE_0_8_218 */
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Temporary, output-only HTTPS canonical for the exact ZaPrazi host.
 *
 * Yoast currently produces http://zaprazi.cz URLs because WordPress still
 * reports an HTTP site address. Do not change WP_HOME/siteurl, admin URLs,
 * customer URLs, WooCommerce, or external merchant links from this shim.
 * Once the WordPress URL/SSL configuration is corrected and checked, remove
 * the shim in a separate versioned release.
 */
function zaprazi_2_https_sitemap_url( $url ) {
  if ( ! is_string( $url ) ) {
    return $url;
  }
  return preg_replace( '~^http://zaprazi\.cz(?=/|$|[?#])~i', 'https://zaprazi.cz', $url, 1 );
}

/**
 * Yoast page canonical and og:url are sometimes HTTP due to upstream
 * WordPress site address configuration. Repair only exact own host.
 * Keep permanent cross-domain canonicals and false/empty values untouched.
 */
add_filter( 'wpseo_canonical', 'zaprazi_2_https_sitemap_url', PHP_INT_MAX );
add_filter( 'wpseo_opengraph_url', 'zaprazi_2_https_sitemap_url', PHP_INT_MAX );

/** Yoast root sitemap index: retain providers, entries, metadata and order. */
function zaprazi_2_https_sitemap_index_links( $links ) {
  if ( ! is_array( $links ) ) {
    return $links;
  }
  foreach ( $links as $index => $link ) {
    if ( is_array( $link ) && isset( $link['loc'] ) ) {
      $links[ $index ]['loc'] = zaprazi_2_https_sitemap_url( $link['loc'] );
    }
  }
  return $links;
}
add_filter( 'wpseo_sitemap_index_links', 'zaprazi_2_https_sitemap_index_links', 20 );

/** Yoast post, taxonomy and author sitemap entries. */
/**
 * Dates below are evidence-backed significant template/content revisions.
 * Theme deploys do not update WP post_modified, so Yoast would otherwise
 * advertise obsolete lastmod values. Do not stamp arbitrary pages or bump the
 * timestamp for deploys that only change release markers.
 *
 * 2026-11-09: rental first-answer + tariff source, insurance SEO copy;
 * bathroom and aid hub: substantive new contextual navigation in 0.8.205.
 * 2026-11-08: walker measurement guide gained safe acquisition paths in PR #718.
 * 2026-11-09: walker hub gained explicit first-screen safety guidance in PR #734.
 * 2026-11-10: workday-care guidance materially expanded and reciprocal
 * hospital-return entry added in PR #753, with caregiver employment rights
 * source clarification in release #754.
 * 2026-11-10: rollator 60cm doorway evidence, model-variant clarification
 * and contextual entries from the walker hub and insurance page in release
 * 0.8.213. Material edits on exactly those three existing canonical pages.
 */
function zaprazi_2_material_sitemap_page_dates() {
  return array(
    'pujceni-choditka' => '2026-11-09T00:00:00+00:00',
    'choditko-na-pojistovnu' => '2026-11-10T00:00:00+00:00',
    'koupelna-a-wc' => '2026-11-09T00:00:00+00:00',
    'kompenzacni-pomucky-pro-seniory' => '2026-11-09T00:00:00+00:00',
    'co-zmerit-pred-vyberem-choditka' => '2026-11-08T00:00:00+00:00',
    'choditka-pro-seniory' => '2026-11-10T00:00:00+00:00',
    'rollator-pro-seniory' => '2026-11-10T00:00:00+00:00',
    'senior-nemuze-vstat-z-postele' => '2026-11-09T00:00:00+00:00',
    'jak-vybrat-pecovatelskou-sluzbu' => '2026-11-10T00:00:00+00:00',
    'navrat-z-nemocnice' => '2026-11-10T00:00:00+00:00',
    'otazky-pred-propustenim-z-nemocnice' => '2026-11-10T00:00:00+00:00',
  );
}

function zaprazi_2_https_sitemap_entry( $entry, $type = '', $post = null ) {
  if ( ! is_array( $entry ) || ! isset( $entry['loc'] ) ) {
    return $entry;
  }
  $entry['loc'] = zaprazi_2_https_sitemap_url( $entry['loc'] );

  // Yoast uses type "post" for both WP posts and pages. Never change
  // archive, taxonomy, author or unapproved/orphan URL metadata.
  if ( 'post' !== $type || ! is_object( $post ) ||
      ! isset( $post->post_type, $post->post_status, $post->post_name ) ||
      'page' !== $post->post_type || 'publish' !== $post->post_status ) {
    return $entry;
  }
  $dates = zaprazi_2_material_sitemap_page_dates();
  $slug = $post->post_name;
  if ( ! is_string( $slug ) || ! isset( $dates[ $slug ] ) ||
      $entry['loc'] !== 'https://zaprazi.cz/' . $slug . '/' ) {
    return $entry;
  }
  // Yoast's POST/PAGE sitemap uses the internal 'mod' entry key, which
  // its renderer turns into the public XML <lastmod> element. Setting an
  // internal 'lastmod' key is ignored: that was the 0.8.205 production bug.
  // WordPress may contain a newer substantive edit; never overwrite it.
  $recorded = isset( $entry['mod'] ) && is_string( $entry['mod'] )
    ? strtotime( $entry['mod'] ) : false;
  $verified = strtotime( $dates[ $slug ] );
  if ( false !== $verified && ( false === $recorded || $recorded < $verified ) ) {
    $entry['mod'] = $dates[ $slug ];
  }
  return $entry;
}
add_filter( 'wpseo_sitemap_entry', 'zaprazi_2_https_sitemap_entry', 20, 3 );

/**
 * Align Yoast WebPage dateModified with the SAME 10 evidence-backed material
 * page revisions used by the public XML sitemap. PHP template edits do not
 * update WordPress post_modified, so its default schema timestamp can be stale.
 * Never rewrite publication dates or arbitrary pages, and never move a more
 * recent genuine WordPress modification backwards. This is not a freshness
 * stamp for routine deployment/version changes.
 */
function zaprazi_2_yoast_material_webpage_date( $data ) {
  if ( ! is_array( $data ) || ! is_page() ) {
    return $data;
  }
  $post = get_queried_object();
  if ( ! is_object( $post ) ||
       ! isset( $post->post_type, $post->post_status, $post->post_name ) ||
       'page' !== $post->post_type || 'publish' !== $post->post_status ) {
    return $data;
  }
  $dates = zaprazi_2_material_sitemap_page_dates();
  $slug = $post->post_name;
  if ( ! is_string( $slug ) || ! isset( $dates[ $slug ] ) ) {
    return $data;
  }
  // The canonical WebPage identity, not a similar path, is authoritative.
  $canonical = 'https://zaprazi.cz/' . $slug . '/';
  if ( ! isset( $data['url'], $data['@id'] ) ||
       $data['url'] !== $canonical || $data['@id'] !== $canonical ) {
    return $data;
  }
  $verified = strtotime( $dates[ $slug ] );
  if ( false === $verified || $verified > time() ) {
    return $data;
  }
  $published = isset( $data['datePublished'] ) && is_string( $data['datePublished'] )
    ? strtotime( $data['datePublished'] ) : false;
  if ( false !== $published && $verified < $published ) {
    return $data;
  }
  $existing = isset( $data['dateModified'] ) && is_string( $data['dateModified'] )
    ? strtotime( $data['dateModified'] ) : false;
  if ( false === $existing || $existing < $verified ) {
    $data['dateModified'] = $dates[ $slug ];
  }
  return $data;
}
add_filter( 'wpseo_schema_webpage', 'zaprazi_2_yoast_material_webpage_date', 20 );

/** WordPress / Yoast virtual robots.txt: only rewrite our exact Sitemap URL. */
function zaprazi_2_https_robots_sitemap( $output ) {
  if ( ! is_string( $output ) ) {
    return $output;
  }
  return preg_replace(
    '~^([ \t]*Sitemap:[ \t]*)http://zaprazi\.cz(?=/|$|[?#])~im',
    '$1https://zaprazi.cz',
    $output
  );
}
add_filter( 'robots_txt', 'zaprazi_2_https_robots_sitemap', PHP_INT_MAX, 2 );
