<?php /* ZP_RELEASE_0_8_74 */ ?>
<?php
$zaprazi_editorial_advisor_pages = array(
  'koupelna-a-wc',
  'polohovaci-postel',
  'invalidni-vozik',
  'navrat-z-nemocnice',
  'sobestacnost',
  'obuv-pro-seniory',
  'nastavec-na-wc-pro-seniory',
  'sprchovaci-zidle-pro-seniory',
  'toaletni-zidle-pro-seniory',
  'madlo-k-wc-pro-seniory',
  'sedatko-do-vany-pro-seniory',
  'choditko-do-bytu-pro-seniory',
  'rollator-pro-seniory',
);
if ( is_front_page() || is_page( $zaprazi_editorial_advisor_pages ) ) :
?>
<section class="zp-editorial-trust" aria-labelledby="zp-editorial-trust-title">
  <div class="zp-wrap zp-editorial-trust-inner">
    <div>
      <h2 id="zp-editorial-trust-title">Jak ověřujeme doporučení?</h2>
      <p>Za metodiku odpovídá redakce projektu Zápraží. Vycházíme z praktických bezpečnostních pravidel, technických podkladů výrobců a dostupných oficiálních zdrojů. <strong>Externí odborná revize dosud není doložená.</strong> Doporučené výrobky jsou pouze kandidáti a nenahrazují individuální posouzení.</p>
    </div>
    <a class="zp-link-btn" href="<?php echo esc_url( home_url( '/jak-vznika-doporuceni/' ) ); ?>">Přečíst metodiku a omezení</a>
  </div>
</section>
<?php endif; ?>
<footer class="zp-footer">
  <div class="zp-wrap zp-footer-inner zp-footer-grid">
    <div>
      <strong>Zápraží</strong>
      <p>Praktická cesta k bezpečnějšímu a samostatnějšímu životu doma.</p>
    </div>

    <nav class="zp-footer-core" aria-label="Hlavní poradci Zápraží">
      <strong>Hlavní poradci</strong>
      <ul>
        <li><a href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">Chůze a opora</a></li>
        <li><a href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Koupelna a WC</a></li>
        <li><a href="<?php echo esc_url( home_url( '/polohovaci-postel/' ) ); ?>">Polohovací postel</a></li>
        <li><a href="<?php echo esc_url( home_url( '/invalidni-vozik/' ) ); ?>">Invalidní vozík</a></li>
        <li><a href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Návrat z nemocnice</a></li>
        <li><a href="<?php echo esc_url( home_url( '/sobestacnost/' ) ); ?>">Každodenní soběstačnost</a></li>
        <li><a href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/' ) ); ?>">Přehled kompenzačních pomůcek</a></li>
        <li><a href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/#pojistovna' ) ); ?>">Pomůcky na pojišťovnu</a></li>
        <li><a href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Bezpečný byt pro seniora</a></li>
        <li><a href="<?php echo esc_url( home_url( '/obuv-pro-seniory/' ) ); ?>">Obuv pro seniory</a></li>
        <li><a href="<?php echo esc_url( home_url( '/toaletni-zidle-pro-seniory/' ) ); ?>">Toaletní židle pro seniory</a></li>
        <li><a href="<?php echo esc_url( home_url( '/madlo-k-wc-pro-seniory/' ) ); ?>">Madlo a opora k WC</a></li>
        <li><a href="<?php echo esc_url( home_url( '/sedatko-do-vany-pro-seniory/' ) ); ?>">Sedátko do vany</a></li>
        <li><a href="<?php echo esc_url( home_url( '/choditko-do-bytu-pro-seniory/' ) ); ?>">Chodítko do bytu</a></li>
        <li><a href="<?php echo esc_url( home_url( '/rollator-pro-seniory/' ) ); ?>">Rollátor pro seniory</a></li>
      </ul>
    </nav>

    <nav class="zp-footer-legacy" aria-label="Starší obsah Zápraží">
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
      <p><strong>Transparentnost:</strong> Zápraží neposkytuje diagnózu ani individuální zdravotní posouzení. U proměnlivých pravidel a úhrad uvádíme zdroj a datum ověření, pokud je máme.</p>
      <p>Některé odkazy na obchodníky mohou být partnerské. Pokud přes ně nakoupíte, Zápraží může získat provizi. Provize nemění doporučený typ řešení ani pořadí podle vhodnosti.</p>
      <p>
        <a href="<?php echo esc_url( home_url( '/jak-vznika-doporuceni/' ) ); ?>">Metodika doporučení</a>
        · <a href="<?php echo esc_url( home_url( '/ochrana-soukromi/' ) ); ?>">Ochrana soukromí</a>
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
