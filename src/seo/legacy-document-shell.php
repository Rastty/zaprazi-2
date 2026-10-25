<?php
/* ZP_RELEASE_0_8_157 */
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
 * Historical post 5448 has a proven unclosed AI-editor HTML comment.
 * The browser then hides the rest of a genuine second article block.
 * Remove only this known non-reader note during rendering, never from DB.
 */
function zaprazi_2_remove_5448_unclosed_editor_note( $html ) {
  $marker = '<!-- The above HTML code represents a blog post in Czech about the influence of pump performance on the efficiency of garden irrigation.';
  if ( ! is_string( $html ) || strlen( $html ) > 2500000 ||
       1 !== substr_count( $html, '<!--' ) ||
       false !== strpos( $html, '-->' ) ) {
    return $html;
  }
  $start = strpos( $html, $marker );
  if ( false === $start ) { return $html; }
  $image_start = stripos( $html, '<img', $start + strlen( $marker ) );
  if ( false === $image_start || $image_start - $start > 1500 ) {
    return $html;
  }
  $image_end = strpos( $html, '>', $image_start );
  if ( false === $image_end || $image_end - $image_start > 1200 ||
       false === strpos(
         substr( $html, $image_start, $image_end - $image_start ),
         'Screenshot_878.png'
       ) ) {
    return $html;
  }
  $note = substr( $html, $start, $image_start - $start );
  // WP may add paragraph/break tags while formatting, but no real content
  // element, anchor, media or source ID may be removed with the note.
  $plain_note = preg_replace( '/<\/?p\b[^>]*>|<br\s*\/?>/i', '', substr( $note, 4 ) );
  if ( ! is_string( $plain_note ) ||
       false !== strpos( $plain_note, '<' ) ||
       false !== strpos( $plain_note, '>' ) ||
       preg_match( '/\b(?:href|src|id)\s*=/i', $note ) ) {
    return $html;
  }
  return substr( $html, 0, $start ) . substr( $html, $image_start );
}

/**
 * Bounded stage-1 display repair for a stable 1/8 ID cohort and three
 * confirmed control posts. All WordPress post bodies remain unmodified.
 */
function zaprazi_2_legacy_document_repair_active() {
  // Stable cohort (about 1/8 of published post IDs) plus confirmed canaries.
  // No query parameter, cookie, database writes, taxonomy or SEO impact.
  if ( ! is_singular( 'post' ) || ! in_the_loop() || ! is_main_query() ) {
    return false;
  }
  $id = (int) get_the_ID();
  return in_array( $id, array( 8105, 8106, 6801 ), true ) ||
    ( $id > 0 && 0 === $id % 8 );
}

function zaprazi_2_legacy_document_repair( $html ) {
  if ( ! zaprazi_2_legacy_document_repair_active() ) {
    return $html;
  }
  if ( 5448 === (int) get_the_ID() ) {
    $html = zaprazi_2_remove_5448_unclosed_editor_note( $html );
  }
  return zaprazi_2_strip_legacy_document_shell( $html );
}

if ( function_exists( 'add_filter' ) ) {
  add_filter( 'the_content', 'zaprazi_2_legacy_document_repair', 99 );
}
