<?php
/* ZP_RELEASE_0_8_139 */
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
function zaprazi_2_https_sitemap_entry( $entry ) {
  if ( is_array( $entry ) && isset( $entry['loc'] ) ) {
    $entry['loc'] = zaprazi_2_https_sitemap_url( $entry['loc'] );
  }
  return $entry;
}
add_filter( 'wpseo_sitemap_entry', 'zaprazi_2_https_sitemap_entry', 20 );

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
