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
yes( zaprazi_2_legacy_document_repair_active(), '8106 must bypass earlier truncation' );
eq( zaprazi_2_legacy_document_repair( $raw ), $clean, '8106 transforms' );
$GLOBALS['zp_canary_post_id'] = 8105;
eq( zaprazi_2_legacy_document_repair( $raw ), $clean, '8105 transforms' );
$GLOBALS['zp_canary_post_id'] = 6801;
yes( zaprazi_2_legacy_document_repair_active(), 'Previously severely truncated post 6801 selected' );
eq( zaprazi_2_legacy_document_repair( $raw ), $clean, '6801 transforms' );
$GLOBALS['zp_canary_post_id'] = 8000;
yes( zaprazi_2_legacy_document_repair_active(), 'One-eighth cohort included' );
eq( zaprazi_2_legacy_document_repair( $raw ), $clean, 'Cohort post transforms' );
$GLOBALS['zp_canary_post_id'] = 8001;
yes( ! zaprazi_2_legacy_document_repair_active(), 'Adjacent id excluded' );
eq( zaprazi_2_legacy_document_repair( $raw ), $raw, 'Adjacent id left unchanged' );
$GLOBALS['zp_canary_post_id'] = 42;
yes( ! zaprazi_2_legacy_document_repair_active(), 'Noncanary not bypassed' );
eq( zaprazi_2_legacy_document_repair( $raw ), $raw, 'Other posts untouched' );
$GLOBALS['zp_canary_post_id'] = 8106;
$GLOBALS['zp_canary_main'] = false;
yes( ! zaprazi_2_legacy_document_repair_active(), 'Other queries not bypassed' );
eq( zaprazi_2_legacy_document_repair( $raw ), $raw, 'Non-main queries untouched' );
eq( zaprazi_2_strip_legacy_document_shell( '<p>Platný návod</p>' ),
  '<p>Platný návod</p>', 'Normal article left unchanged' );
$unsafe = '<body id="hero"><p>Počkejte</p></body>';
eq( zaprazi_2_strip_legacy_document_shell( $unsafe ), $unsafe,
  'Unknown ID on shell must not be stripped' );

// Real source-bound regression: unclosed English editorial note hides the
// second valid article; restore text, original media and link but not the note.
$GLOBALS['zp_canary_main'] = true;
$GLOBALS['zp_canary_post_id'] = 5448;
yes( zaprazi_2_legacy_document_repair_active(), '5448 belongs to stable cohort' );
$generated_note = '<!-- The above HTML code represents a blog post in Czech about the influence of pump performance on the efficiency of garden irrigation. It includes H2 and H3 headings according to the given instructions. The SEO rules are followed by using semantic HTML tags.';
$broken = '<p>Začátek článku o čerpadlech.</p>'
  . '<!DOCTYPE html><html><head><title>Duplikát</title></head><body><p>První část.</p></body></html>'
  . $generated_note . "\n\n"
  . '<img class="aligncenter" src="https://zaprazi.cz/wp-content/uploads/2023/06/Screenshot_878.png" alt="zahrada" />'
  . '<!DOCTYPE html><html><head><title>Druhý dokument</title></head><body>'
  . '<h2>Druhá část</h2><p>Skutečný konec celého článku.</p>'
  . '<a href="https://zaprazi.cz/category/zahrada/cerpadla-a-domaci-vodarny/">Kategorie</a></body></html>';
$repaired = zaprazi_2_legacy_document_repair( $broken );
yes( false === strpos( $repaired, $generated_note ), 'Never render generated editorial note' );
yes( false === stripos( $repaired, '<!doctype' ), 'No nested document shell after repair' );
yes( false === stripos( $repaired, '<html' ), 'No nested html after repair' );
yes( false !== strpos( $repaired, 'První část.' ), 'Earlier genuine text retained' );
yes( false !== strpos( $repaired, 'Skutečný konec celého článku.' ), 'Later genuine text retained' );
yes( false !== strpos( $repaired, 'Screenshot_878.png' ), 'Original image retained' );
yes( false !== strpos( $repaired, '/category/zahrada/cerpadla-a-domaci-vodarny/' ), 'Original link retained' );
yes( false !== strpos( $repaired, '<h2>Druhá část</h2>' ), 'Heading retained' );
$unsafe_note = str_replace( 'It includes H2 and H3 headings',
  '<a href="https://example.com">Important</a> It includes H2 and H3 headings', $broken );
eq( zaprazi_2_remove_5448_unclosed_editor_note( $unsafe_note ), $unsafe_note,
  'Fail closed on any anchor inside note' );
$unexpected = str_replace( 'Screenshot_878.png', 'different-image.png', $broken );
eq( zaprazi_2_remove_5448_unclosed_editor_note( $unexpected ), $unexpected,
  'Fail closed on unrecognized media boundary' );
$GLOBALS['zp_canary_post_id'] = 5449;
eq( zaprazi_2_legacy_document_repair( $broken ), $broken,
  'Other historical post untouched by targeted editorial note handling' );

echo "PASS: canary-only reversible legacy HTML shell normalizer\n";
