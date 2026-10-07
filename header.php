<!doctype html>
<?php /* ZP_RELEASE_0_8_48 */ ?>
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
    <div class="zp-brand-wrap">
      <?php if ( has_custom_logo() ) : ?>
        <?php the_custom_logo(); ?>
      <?php else : ?>
        <a class="zp-brand" href="<?php echo esc_url(home_url('/')); ?>">Zápraží</a>
      <?php endif; ?>
    </div>

    <nav class="zp-core-nav" aria-label="Hlavní navigace">
      <a href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">Mobilita</a>
      <a href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Koupelna a WC</a>
      <a href="<?php echo esc_url( home_url( '/polohovaci-postel/' ) ); ?>">Polohovací postel</a>
      <a href="<?php echo esc_url( home_url( '/invalidni-vozik/' ) ); ?>">Invalidní vozík</a>
      <a href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Návrat domů</a>
      <a href="<?php echo esc_url( home_url( '/sobestacnost/' ) ); ?>">Soběstačnost</a>
      <a href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/#pojistovna' ) ); ?>">Pojišťovna</a>
      <a href="<?php echo esc_url( home_url( '/pujceni-choditka/' ) ); ?>">Půjčení</a>
      <a href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/' ) ); ?>">Přehled pomůcek</a>
    </nav>

    <span class="zp-tagline">Cesta k lepšímu životu.</span>
  </div>
</header>
