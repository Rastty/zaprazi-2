<?php
/**
 * External product add to cart.
 *
 * ZaPrazi legacy override: broken AffilBox/eHub placeholder URLs must never be
 * exposed as active purchase buttons.
 */

defined( 'ABSPATH' ) || exit;

$decoded_url = html_entity_decode( (string) $product_url, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
$decoded_url = rawurldecode( $decoded_url );
$broken_legacy_url = false !== stripos( $decoded_url, 'nazev-webu-affilbox' );

do_action( 'woocommerce_before_add_to_cart_form' );

if ( $broken_legacy_url ) :
  ?>
  <div class="zp-legacy-offer-warning" role="note">
    <strong>Původní nabídka se ověřuje.</strong>
    <p>Tento starší produkt má neplatný partnerský odkaz. ZaPrazi proto nákupní tlačítko nezobrazuje, dokud nebude cílová nabídka znovu ověřena.</p>
  </div>
  <?php
else :
  ?>
  <form class="cart" action="<?php echo esc_url( $product_url ); ?>" method="get">
    <?php do_action( 'woocommerce_before_add_to_cart_button' ); ?>

    <button type="submit" class="single_add_to_cart_button button alt">
      <?php echo esc_html( $button_text ); ?>
    </button>

    <?php wc_query_string_form_fields( $product_url ); ?>

    <?php do_action( 'woocommerce_after_add_to_cart_button' ); ?>
  </form>
  <?php
endif;

do_action( 'woocommerce_after_add_to_cart_form' );
