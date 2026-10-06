<?php get_header(); ?>
<main id="main-content" class="zp-wrap zp-archive zp-system-page" tabindex="-1">
  <header class="zp-archive-header">
    <p class="zp-kicker">404</p>
    <h1>Tahle stránka tu není.</h1>
    <p>Odkaz může být starý nebo se stránka přesunula. Zkuste se vrátit na hlavní ZaPrazi nebo rovnou spustit Domácí poradce.</p>
    <div class="zp-hero-actions">
      <a class="zp-btn" href="<?php echo esc_url( home_url( '/' ) ); ?>">Na hlavní stránku</a>
      <a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Spustit poradce</a>
    </div>
  </header>
</main>
<?php get_footer(); ?>
