<?php get_header(); ?>
<main id="main-content" class="zp-wrap zp-archive" tabindex="-1">
  <header class="zp-archive-header">
    <p class="zp-kicker">Vyhledávání</p>
    <h1>Výsledky pro „<?php echo esc_html( get_search_query() ); ?>“</h1>
    <p>Vyhledávání prochází i starší obsah ZaPrazi.cz. Nové doporučení pro mobilitu najdete v Domácím poradci.</p>
  </header>

  <?php if ( have_posts() ) : ?>
    <div class="zp-archive-list">
      <?php while ( have_posts() ) : the_post(); ?>
        <article <?php post_class('zp-archive-card'); ?>>
          <p class="zp-archive-meta"><?php echo esc_html( get_the_date() ); ?></p>
          <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
          <?php the_excerpt(); ?>
        </article>
      <?php endwhile; ?>
    </div>
    <nav class="zp-pagination" aria-label="Stránkování výsledků"><?php the_posts_pagination(); ?></nav>
  <?php else : ?>
    <div class="zp-system-empty">
      <p>Pro tento dotaz jsme nic nenašli.</p>
      <a class="zp-btn" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Zkusit Domácí poradce</a>
    </div>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
