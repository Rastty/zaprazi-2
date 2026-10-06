<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();
?>
<main id="main-content" class="zp-wrap zp-woocommerce-shell" tabindex="-1">
  <?php if ( function_exists( 'woocommerce_content' ) ) : ?>
    <?php woocommerce_content(); ?>
  <?php else : ?>
    <p>Obsah obchodu se nepodařilo načíst.</p>
  <?php endif; ?>
</main>
<?php
get_footer();
