<?php get_header(); ?>
<main class="zp-content">
  <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <article <?php post_class(); ?>>
      <h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
      <?php the_excerpt(); ?>
    </article>
  <?php endwhile; the_posts_pagination(); else : ?>
    <p>Nic nebylo nalezeno.</p>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
