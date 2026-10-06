<?php get_header(); ?>
<main class="zp-content zp-legacy-content">
  <?php while ( have_posts() ) : the_post(); ?>
    <article <?php post_class('zp-legacy-article'); ?>>
      <header class="zp-legacy-header">
        <p class="zp-kicker">Starší obsah ZaPrazi.cz</p>
        <h1><?php the_title(); ?></h1>
        <p class="zp-legacy-meta">
          Publikováno <?php echo esc_html( get_the_date() ); ?>
          <?php
          $categories = get_the_category_list(', ');
          if ( $categories ) {
            echo ' · ' . wp_kses_post( $categories );
          }
          ?>
        </p>
      </header>

      <?php if ( has_post_thumbnail() ) : ?>
        <figure class="zp-legacy-featured"><?php the_post_thumbnail('large'); ?></figure>
      <?php endif; ?>

      <div class="zp-legacy-body">
        <?php the_content(); ?>
      </div>

      <?php wp_link_pages(); ?>
    </article>

    <nav class="zp-post-nav" aria-label="Navigace mezi články">
      <div><?php previous_post_link('%link', '← %title'); ?></div>
      <div><?php next_post_link('%link', '%title →'); ?></div>
    </nav>
  <?php endwhile; ?>
</main>
<?php get_footer(); ?>
