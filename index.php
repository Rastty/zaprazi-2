<?php get_header(); ?>
<main class="zp-wrap zp-archive">
  <header class="zp-archive-header">
    <p class="zp-kicker">ZaPrazi.cz</p>
    <h1>Starší články</h1>
    <p>Tento archiv zatím zachováváme beze změn URL. Nové ZaPrazi se postupně soustředí na praktická rozhodnutí pro bezpečný a samostatný život doma.</p>
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
    <nav class="zp-pagination" aria-label="Stránkování archivu"><?php the_posts_pagination(); ?></nav>
  <?php else : ?>
    <p>Nic nebylo nalezeno.</p>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
