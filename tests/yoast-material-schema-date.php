<?php
/**
 * Isolated, deterministic Yoast WebPage dateModified policy contract.
 * Simulates only the public filter's WordPress inputs; no WP/network writes.
 */
define( 'ABSPATH', __DIR__ . '/../' );
$GLOBALS['zp_test_is_page'] = true;
$GLOBALS['zp_test_post'] = null;
$GLOBALS['zp_test_filters'] = array();
function add_filter( $name, $callback, $priority = 10, $args = 1 ) {
  $GLOBALS['zp_test_filters'][ $name ] = $callback;
}
function is_page() {
  return $GLOBALS['zp_test_is_page'];
}
function get_queried_object() {
  return $GLOBALS['zp_test_post'];
}
require __DIR__ . '/../src/seo/https-sitemaps.php';

function zp_assert( $ok, $message ) {
  if ( ! $ok ) {
    throw new RuntimeException( $message );
  }
}
zp_assert(
  isset( $GLOBALS['zp_test_filters']['wpseo_schema_webpage'] ) &&
  'zaprazi_2_yoast_material_webpage_date' === $GLOBALS['zp_test_filters']['wpseo_schema_webpage'],
  'Expected Yoast WebPage schema filter registration'
);

function zp_set_page( $slug, $type = 'page', $status = 'publish' ) {
  $GLOBALS['zp_test_is_page'] = true;
  $GLOBALS['zp_test_post'] = (object) array(
    'post_type' => $type, 'post_status' => $status, 'post_name' => $slug
  );
}
function zp_schema( $slug, $modified ) {
  return array(
    '@type' => 'WebPage',
    '@id' => 'https://zaprazi.cz/' . $slug . '/',
    'url' => 'https://zaprazi.cz/' . $slug . '/',
    'datePublished' => '2026-10-06T20:35:01+00:00',
    'dateModified' => $modified,
    'isPartOf' => array( '@id' => 'https://zaprazi.cz/#website' )
  );
}
$dates = zaprazi_2_material_sitemap_page_dates();
zp_assert( 11 === count( $dates ), 'The schema source must be exactly the canonical eleven-page date map' );
foreach ( array( 'choditko-na-pojistovnu', 'rollator-pro-seniory', 'senior-nemuze-vstat-z-postele', 'otazky-pred-propustenim-z-nemocnice' ) as $slug ) {
  zp_set_page( $slug );
  $input = zp_schema( $slug, '2026-10-06T20:35:01+00:00' );
  $output = zaprazi_2_yoast_material_webpage_date( $input );
  zp_assert( $dates[ $slug ] === $output['dateModified'], 'Verified date not reflected: ' . $slug );
  zp_assert( $input['datePublished'] === $output['datePublished'], 'Published date unexpectedly overwritten: ' . $slug );
  zp_assert( $input['isPartOf'] === $output['isPartOf'], 'Schema graph unexpectedly rewritten: ' . $slug );
}
zp_set_page( 'rollator-pro-seniory' );
$recent = zp_schema( 'rollator-pro-seniory', '2026-11-10T07:00:00+00:00' );
zp_assert(
  $recent === zaprazi_2_yoast_material_webpage_date( $recent ),
  'A genuine more recent modification must never be moved backwards'
);
$alien = zp_schema( 'rollator-pro-seniory', '2026-10-06T20:35:01+00:00' );
$alien['url'] = 'https://other.example/rollator-pro-seniory/';
zp_assert( $alien === zaprazi_2_yoast_material_webpage_date( $alien ), 'Off-site canonical mutated' );
$alien = zp_schema( 'rollator-pro-seniory', '2026-10-06T20:35:01+00:00' );
$alien['@id'] = 'https://zaprazi.cz/other/';
zp_assert( $alien === zaprazi_2_yoast_material_webpage_date( $alien ), 'Wrong graph identity mutated' );
zp_set_page( 'neexistujici-slug' );
$unknown = zp_schema( 'neexistujici-slug', '2026-10-06T20:35:01+00:00' );
zp_assert( $unknown === zaprazi_2_yoast_material_webpage_date( $unknown ), 'Unverified URL mutated' );
zp_set_page( 'rollator-pro-seniory', 'post' );
$post = zp_schema( 'rollator-pro-seniory', '2026-10-06T20:35:01+00:00' );
zp_assert( $post === zaprazi_2_yoast_material_webpage_date( $post ), 'Post content mutated' );
zp_set_page( 'rollator-pro-seniory', 'page', 'draft' );
zp_assert( $post === zaprazi_2_yoast_material_webpage_date( $post ), 'Draft page mutated' );
zp_set_page( 'rollator-pro-seniory' );
$GLOBALS['zp_test_is_page'] = false;
zp_assert( $post === zaprazi_2_yoast_material_webpage_date( $post ), 'Non-page request mutated' );
$GLOBALS['zp_test_is_page'] = true;
$latePublished = zp_schema( 'rollator-pro-seniory', '2026-10-06T20:35:01+00:00' );
$latePublished['datePublished'] = '2026-12-01T00:00:00+00:00';
zp_assert( $latePublished === zaprazi_2_yoast_material_webpage_date( $latePublished ), 'Schema predates publication' );
echo "PASS Yoast material dateModified 11 source slugs, positive/negative scope and chronology\n";
