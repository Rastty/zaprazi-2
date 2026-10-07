<!doctype html>
<?php /* ZP_RELEASE_0_8_13 */ ?>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="zp-skip-link" href="#main-content">Přeskočit na hlavní obsah</a>
<header class="zp-header">
  <div class="zp-wrap zp-nav">
    <a class="zp-brand" href="<?php echo esc_url(home_url('/')); ?>">ZaPrazi.cz</a>

    <nav class="zp-core-nav" aria-label="Hlavní navigace">
      <a href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Mobilita</a>
      <a href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Koupelna a WC</a>
      <a href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">Pojišťovna</a>
      <a href="<?php echo esc_url( home_url( '/pujceni-choditka/' ) ); ?>">Půjčení</a>
      <a href="<?php echo esc_url( home_url( '/#jak-vybrat' ) ); ?>">Jak vybírat</a>
    </nav>

    <span class="zp-tagline">Bezpečně a samostatně doma.</span>
  </div>
</header>
