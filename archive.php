<?php get_header(); ?>
<main class="zp-wrap zp-archive">
  <header class="zp-archive-header">
    <p class="zp-kicker">Archiv</p>
    <h1><?php the_archive_title(); ?></h1>
    <?php the_archive_description('<div class="zp-archive-description">', '</div>'); ?>
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
