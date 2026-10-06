<?php get_header(); ?>
<main class="zp-content zp-legacy-content">
  <?php while ( have_posts() ) : the_post(); ?>
    <article <?php post_class('zp-legacy-article'); ?>>
      <header class="zp-legacy-header">
        <h1><?php the_title(); ?></h1>
      </header>
      <div class="zp-legacy-body">
        <?php the_content(); ?>
      </div>
      <?php wp_link_pages(); ?>
    </article>
  <?php endwhile; ?>
</main>
<?php get_footer(); ?>
