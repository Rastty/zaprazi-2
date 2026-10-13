<?php
/* ZP_RELEASE_0_8_133 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Strip nested HTML document scaffolding from a *rendered* legacy post.
 * This is not a DB migration. Fail closed if linked media, anchors or
 * displayed article text could change unexpectedly.
 */
function zaprazi_2_strip_legacy_document_shell( $html ) {
  if ( ! is_string( $html ) || strlen( $html ) > 2500000 ||
       ! preg_match( '/<!doctype\b|<\/?(?:html|head|body)\b/i', $html ) ) {
    return $html;
  }

  // Do not discard an unusual wrapper carrying its own link, image or ID.
  if ( preg_match( '/<\/?(?:html|head|body)\b[^>]*\b(?:href|src|id)\s*=/i', $html ) ) {
    return $html;
  }

  $clean = preg_replace(
    array(
      '/<!doctype\b[^>]*>/i',
      '/<\/?(?:html|head|body)\b[^>]*>/i',
      '/<meta\b[^>]*>/i',
      '/<title\b[^>]*>[\s\S]*?<\/title\s*>/i',
    ),
    ' ',
    $html
  );
  if ( ! is_string( $clean ) || $clean === $html ) {
    return $html;
  }

  // No checkout, media or in-page anchor may be silently changed.
  preg_match_all( '/\b(?:href|src|id)\s*=\s*(["\'])(.*?)\1/is', $html, $before );
  preg_match_all( '/\b(?:href|src|id)\s*=\s*(["\'])(.*?)\1/is', $clean, $after );
  if ( $before[0] !== $after[0] ) {
    return $html;
  }

  $visible = static function ( $markup ) {
    $markup = preg_replace(
      array( '/<title\b[^>]*>[\s\S]*?<\/title\s*>/i', '/<meta\b[^>]*>/i' ),
      ' ', $markup
    );
    $markup = preg_replace( '/<[^>]*>/s', ' ', $markup );
    return trim( preg_replace( '/\s+/u', ' ', $markup ) );
  };
  if ( $visible( $html ) !== $visible( $clean ) ) {
    return $html;
  }

  return $clean;
}

/**
 * Carefully scoped live canary only. Expand after public before/after QA;
 * 4,360 legacy post bodies remain unmodified in WordPress.
 */
function zaprazi_2_legacy_document_canary( $html ) {
  if ( ! is_singular( 'post' ) || ! in_the_loop() || ! is_main_query() ||
       ! in_array( get_the_ID(), array( 8105, 8106 ), true ) ) {
    return $html;
  }
  return zaprazi_2_strip_legacy_document_shell( $html );
}

if ( function_exists( 'add_filter' ) ) {
  add_filter( 'the_content', 'zaprazi_2_legacy_document_canary', 99 );
}
