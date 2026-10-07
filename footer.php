<?php /* ZP_RELEASE_0_8_16 */ ?>
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
      <p>
        <a href="<?php echo esc_url( home_url( '/ochrana-soukromi/' ) ); ?>">Ochrana soukromí</a>
        · <button id="zp-analytics-settings" class="zp-footer-settings" type="button">Nastavení měření</button>
      </p>
    </div>
  </div>
</footer>

<section id="zp-analytics-consent" class="zp-consent" role="region" aria-labelledby="zp-consent-title" hidden>
  <div class="zp-consent-inner">
    <div>
      <strong id="zp-consent-title">Volitelné měření návštěvnosti</strong>
      <p>Google Analytics načteme pouze po vašem souhlasu. Měříme návštěvy a několik obecných kroků poradce. <strong>Neodesíláme odpovědi z poradce, doporučený produkt ani odvozený zdravotní profil.</strong> <a href="<?php echo esc_url( home_url( '/ochrana-soukromi/' ) ); ?>">Podrobnosti</a></p>
    </div>
    <div class="zp-consent-actions">
      <button id="zp-analytics-allow" class="zp-consent-primary" type="button">Povolit měření</button>
      <button id="zp-analytics-deny" class="zp-consent-secondary" type="button">Bez měření</button>
    </div>
  </div>
</section>

<?php wp_footer(); ?>
</body>
</html>
