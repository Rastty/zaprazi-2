<?php
/* Standalone, no WordPress or network writes. Run: php tests/legacy-document-shell.php */
define( 'ABSPATH', __DIR__ );
$GLOBALS['zp_canary_post_id'] = 8106;
$GLOBALS['zp_canary_main'] = true;
function is_singular( $type ) { return 'post' === $type; }
function in_the_loop() { return true; }
function is_main_query() { return $GLOBALS['zp_canary_main']; }
function get_the_ID() { return $GLOBALS['zp_canary_post_id']; }
require_once __DIR__ . '/../src/seo/legacy-document-shell.php';

function eq( $a, $b, $label ) {
  if ( $a !== $b ) { throw new RuntimeException( 'FAIL ' . $label ); }
}
function yes( $condition, $label ) {
  if ( ! $condition ) { throw new RuntimeException( 'FAIL ' . $label ); }
}

$raw = '<p>Článek o péči a pomůckách.</p>'
  . '<p><!DOCTYPE html><br /><html lang="cs"><head>'
  . '<meta charset="UTF-8"><title>Přebytečný titulek</title></head>'
  . '<body></p><article id="old-article">'
  . '<h2>Praktický návod</h2><a href="https://zaprazi.cz/fotovoltaika">'
  . 'Fotovoltaika v AKCI</a><img src="https://zaprazi.cz/media.jpg" alt="obrazek">'
  . '</article><p></body></html></p>'
  . '<!doctype html><head><title>Další titulek</title></head>';
$clean = zaprazi_2_strip_legacy_document_shell( $raw );
yes( $clean !== $raw, 'Canary document shell actually cleaned' );
yes( ! preg_match( '/<!doctype|<\/?(?:html|head|body|meta|title)\b/i', $clean ),
  'No duplicate HTML document scaffolding remains' );
yes( strpos( $clean, 'Článek o péči' ) !== false, 'Visible content retained' );
yes( strpos( $clean, 'Fotovoltaika v AKCI' ) !== false, 'Existing CTA text retained' );
yes( strpos( $clean, 'https://zaprazi.cz/fotovoltaika' ) !== false, 'Legacy merchant route retained' );
yes( strpos( $clean, 'https://zaprazi.cz/media.jpg' ) !== false, 'Media target retained' );
yes( strpos( $clean, 'id="old-article"' ) !== false, 'Article anchor retained' );
yes( zaprazi_2_legacy_document_canary_active(), 'Canary 8106 must bypass earlier truncation' );
eq( zaprazi_2_legacy_document_canary( $raw ), $clean, 'Canary ID 8106 transforms' );
$GLOBALS['zp_canary_post_id'] = 8105;
eq( zaprazi_2_legacy_document_canary( $raw ), $clean, 'Canary ID 8105 transforms' );
$GLOBALS['zp_canary_post_id'] = 42;
yes( ! zaprazi_2_legacy_document_canary_active(), 'Noncanary not bypassed' );
eq( zaprazi_2_legacy_document_canary( $raw ), $raw, 'Other posts untouched' );
$GLOBALS['zp_canary_post_id'] = 8106;
$GLOBALS['zp_canary_main'] = false;
yes( ! zaprazi_2_legacy_document_canary_active(), 'Other queries not bypassed' );
eq( zaprazi_2_legacy_document_canary( $raw ), $raw, 'Non-main queries untouched' );
eq( zaprazi_2_strip_legacy_document_shell( '<p>Platný návod</p>' ),
  '<p>Platný návod</p>', 'Normal article left unchanged' );
$unsafe = '<body id="hero"><p>Počkejte</p></body>';
eq( zaprazi_2_strip_legacy_document_shell( $unsafe ), $unsafe,
  'Unknown ID on shell must not be stripped' );
echo "PASS: canary-only reversible legacy HTML shell normalizer\n";
