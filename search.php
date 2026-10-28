<?php
require_once get_theme_file_path( '/src/seo/search-guidance.php' );
$zaprazi_search_query = strtolower( remove_accents( get_search_query( false ) ) );
$zaprazi_search_query = trim( preg_replace( '/[^a-z0-9]+/', ' ', $zaprazi_search_query ) );
$zaprazi_guided_results = zaprazi_2_search_guidance_for_query( $zaprazi_search_query );
get_header();
?>
<main id="main-content" class="zp-wrap zp-archive" tabindex="-1">
  <header class="zp-archive-header">
    <p class="zp-kicker">Vyhledávání</p>
    <h1>Výsledky pro „<?php echo esc_html( get_search_query() ); ?>“</h1>
    <p>Vyhledáváme v současných stránkách o bezpečném a samostatném životě doma. Historický archiv energetiky a stavebnictví byl vyřazen; pokud hledáte pomoc s chůzí, koupelnou nebo domácí péčí, použijte praktické návody.</p>
  </header>


  <?php if ( $zaprazi_guided_results ) : ?>
    <section class="zp-search-guidance" aria-labelledby="zp-search-guidance-title">
      <h2 id="zp-search-guidance-title">Praktické návody k vašemu hledání</h2>
      <p>Tyto stránky pomáhají vybrat postup, nikoli automaticky potvrdit zdravotní vhodnost pomůcky.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="<?php echo esc_url( home_url( $zaprazi_guided_results[0][0] ) ); ?>">Otevřít první praktický návod</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Všechny domácí poradce</a>
      </div>
      <div class="zp-decision-grid">
        <?php foreach ( $zaprazi_guided_results as $zaprazi_guide ) : ?>
          <article class="zp-decision-card">
            <h3><a class="zp-text-link" href="<?php echo esc_url( home_url( $zaprazi_guide[0] ) ); ?>"><?php echo esc_html( $zaprazi_guide[1] ); ?></a></h3>
            <p><?php echo esc_html( $zaprazi_guide[2] ); ?></p>
          </article>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endif; ?>

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
      <?php if ( $zaprazi_guided_results ) : ?>
        <p>Další odpovídající stránku jsme nenašli. Vyberte si z praktických návodů výše nebo přejděte do Domácího poradce.</p>
      <?php else : ?>
        <p>Pro tento dotaz jsme žádnou odpovídající stránku nenašli. Zkuste začít konkrétní domácí situací v našem poradci.</p>
        <a class="zp-btn" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Zkusit Domácí poradce</a>
      <?php endif; ?>
    </div>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
