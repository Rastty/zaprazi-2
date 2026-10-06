<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();
?>
<main class="zp-wrap zp-woocommerce-shell">
  <?php if ( function_exists( 'woocommerce_content' ) ) : ?>
    <?php woocommerce_content(); ?>
  <?php else : ?>
    <p>Obsah obchodu se nepodařilo načíst.</p>
  <?php endif; ?>
</main>
<?php
get_footer();
