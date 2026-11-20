<?php
/** Standalone WordPress conditional test; no WP install or network needed. */
$source = file_get_contents( __DIR__ . '/../functions.php' );
if ( ! preg_match(
  '/(function zaprazi_2_dequeue_unused_mobility_block_css\(\) \{[\s\S]*?\n\})\nadd_action\(/',
  $source,
  $match
) ) {
  fwrite( STDERR, "FAIL: exact block CSS callback missing\n" );
  exit( 1 );
}

$GLOBALS['zp_test_ctx'] = array();
$GLOBALS['zp_dequeued_styles'] = array();
function is_admin() { return ! empty( $GLOBALS['zp_test_ctx']['admin'] ); }
function is_preview() { return ! empty( $GLOBALS['zp_test_ctx']['preview'] ); }
function is_customize_preview() { return ! empty( $GLOBALS['zp_test_ctx']['customizer'] ); }
function is_feed() { return ! empty( $GLOBALS['zp_test_ctx']['feed'] ); }
function is_front_page() { return ! empty( $GLOBALS['zp_test_ctx']['front'] ); }
function is_page() { return ! empty( $GLOBALS['zp_test_ctx']['page'] ); }
function get_queried_object_id() { return 8251; }
function get_post_field( $key, $post_id ) {
  if ( $key !== 'post_name' || $post_id !== 8251 ) {
    throw new RuntimeException( 'Unexpected WordPress field lookup' );
  }
  return $GLOBALS['zp_test_ctx']['slug'] ?? '';
}
function get_page_template_slug( $post_id ) {
  if ( $post_id !== 8251 ) throw new RuntimeException( 'Unexpected template lookup' );
  return $GLOBALS['zp_test_ctx']['template'] ?? '';
}
function wp_dequeue_style( $handle ) { $GLOBALS['zp_dequeued_styles'][] = $handle; }

// Evaluating an exactly named callback isolated from the checked-in source
// exercises its real PHP branches; no WordPress code, credentials or writes.
eval( $match[1] );

function check_case( $context, $expect ) {
  $GLOBALS['zp_test_ctx'] = $context;
  $GLOBALS['zp_dequeued_styles'] = array();
  zaprazi_2_dequeue_unused_mobility_block_css();
  $actual = $GLOBALS['zp_dequeued_styles'];
  $wanted = $expect ? array( 'wp-block-library' ) : array();
  if ( $actual !== $wanted ) {
    fwrite( STDERR, 'FAIL: unexpected block library change for ' .
      json_encode( $context ) . "\n" );
    exit( 1 );
  }
}

check_case( array( 'front' => true, 'page' => true ), true );
$routes = array(
  'choditka-pro-seniory' => 'page-choditka-pro-seniory.php',
  'choditko-do-bytu-pro-seniory' => 'page-choditko-do-bytu-pro-seniory.php',
  'rollator-pro-seniory' => 'page-rollator-pro-seniory.php',
  'co-zmerit-pred-vyberem-choditka' => 'page-co-zmerit-pred-vyberem-choditka.php',
  'choditko-na-pojistovnu' => 'page-choditko-na-pojistovnu.php',
  'pujceni-choditka' => 'page-pujceni-choditka.php',
);
foreach ( $routes as $slug => $template ) {
  check_case( array( 'page' => true, 'slug' => $slug, 'template' => $template ), true );
  check_case( array( 'page' => true, 'slug' => $slug, 'template' => 'default' ), false );
  check_case( array( 'page' => false, 'slug' => $slug, 'template' => $template ), false );
  foreach ( array( 'preview', 'customizer', 'admin', 'feed' ) as $guard ) {
    check_case( array( 'page' => true, 'slug' => $slug, 'template' => $template, $guard => true ), false );
  }
}
check_case( array( 'page' => true, 'slug' => 'koupelna-a-wc', 'template' => 'page-koupelna-a-wc.php' ), false );
check_case( array( 'page' => true, 'slug' => 'stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu' ), false );
check_case( array( 'front' => true, 'preview' => true ), false );
check_case( array( 'front' => true, 'admin' => true ), false );
echo "PASS: bounded block stylesheet dequeue\n";
