<!doctype html>
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
    <span class="zp-tagline">Bezpečně a samostatně doma.</span>
  </div>
</header>
