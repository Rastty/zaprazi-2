<footer class="zp-footer">
  <div class="zp-wrap zp-footer-inner zp-footer-grid">
    <div>
      <strong>ZaPrazi.cz</strong>
      <p>Praktická cesta k bezpečnějšímu a samostatnějšímu životu doma.</p>
    </div>

    <nav class="zp-footer-legacy" aria-label="Starší obsah ZaPrazi">
      <strong>Starší archiv</strong>
      <ul>
        <?php
        $legacy_categories = get_categories(array(
          'number' => 5,
          'orderby' => 'count',
          'order' => 'DESC',
          'hide_empty' => true,
        ));
        foreach ( $legacy_categories as $legacy_category ) :
          ?>
          <li><a href="<?php echo esc_url( get_category_link( $legacy_category->term_id ) ); ?>"><?php echo esc_html( $legacy_category->name ); ?></a></li>
        <?php endforeach; ?>

        <?php if ( function_exists( 'wc_get_page_permalink' ) ) :
          $shop_url = wc_get_page_permalink( 'shop' );
          if ( $shop_url ) :
          ?>
            <li><a href="<?php echo esc_url( $shop_url ); ?>">Starší katalog produktů</a></li>
          <?php endif;
        endif; ?>
      </ul>
    </nav>

    <div class="zp-footer-note">
      <p><strong>Transparentnost:</strong> ZaPrazi neposkytuje diagnózu ani individuální zdravotní posouzení. U proměnlivých pravidel a úhrad uvádíme zdroj a datum ověření, pokud je máme.</p>
      <p>Některé odkazy na obchodníky mohou být partnerské. Pokud přes ně nakoupíte, ZaPrazi může získat provizi. Provize nemění doporučený typ řešení ani pořadí podle vhodnosti.</p>
    </div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
