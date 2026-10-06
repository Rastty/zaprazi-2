<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function zaprazi_2_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', array('search-form','gallery','caption','style','script'));
  add_theme_support('woocommerce');
  add_theme_support('wc-product-gallery-zoom');
  add_theme_support('wc-product-gallery-lightbox');
  add_theme_support('wc-product-gallery-slider');
  register_nav_menus(array(
    'primary' => __('Hlavní menu', 'zaprazi-2'),
  ));
}
add_action('after_setup_theme', 'zaprazi_2_setup');

function zaprazi_2_affiliate_fields() {
  return array(
    'rehabilitacni-pomucky-cz:besco-wa17' => 'RehabilitačníPomůcky.cz — BESCO WA17',
    'rehabilitacni-pomucky-cz:besco-wa21' => 'RehabilitačníPomůcky.cz — BESCO WA21',
    'lekarna-cz:meyra-ideal-3061982' => 'Lékárna.cz — MEYRA Ideal 3061982',
  );
}

function zaprazi_2_sanitize_affiliate_map( $value ) {
  $allowed = zaprazi_2_affiliate_fields();
  $clean = array();

  if ( ! is_array( $value ) ) {
    return $clean;
  }

  foreach ( $allowed as $key => $label ) {
    if ( empty( $value[ $key ] ) ) {
      continue;
    }

    $url = esc_url_raw( trim( $value[ $key ] ), array( 'https' ) );
    if ( $url && 0 === strpos( $url, 'https://' ) ) {
      $clean[ $key ] = $url;
    }
  }

  return $clean;
}

function zaprazi_2_register_settings() {
  register_setting(
    'zaprazi_affiliate',
    'zaprazi_affiliate_map',
    array(
      'type' => 'array',
      'sanitize_callback' => 'zaprazi_2_sanitize_affiliate_map',
      'default' => array(),
    )
  );
}
add_action('admin_init', 'zaprazi_2_register_settings');

function zaprazi_2_add_settings_page() {
  add_options_page(
    'ZaPrazi affiliate routing',
    'ZaPrazi affiliate',
    'manage_options',
    'zaprazi-affiliate',
    'zaprazi_2_render_settings_page'
  );
}
add_action('admin_menu', 'zaprazi_2_add_settings_page');

function zaprazi_2_render_settings_page() {
  if ( ! current_user_can( 'manage_options' ) ) {
    return;
  }

  $values = get_option( 'zaprazi_affiliate_map', array() );
  if ( ! is_array( $values ) ) {
    $values = array();
  }

  $fields = zaprazi_2_affiliate_fields();
  ?>
  <div class="wrap">
    <h1>ZaPrazi affiliate routing</h1>
    <p>Vkládejte pouze přesné, ověřené partnerské deeplinky vygenerované schváleným affiliate účtem. Prázdné pole znamená bezpečný fallback na běžný produktový odkaz.</p>
    <form method="post" action="options.php">
      <?php settings_fields( 'zaprazi_affiliate' ); ?>
      <table class="form-table" role="presentation">
        <tbody>
        <?php foreach ( $fields as $key => $label ) : ?>
          <tr>
            <th scope="row"><label for="<?php echo esc_attr( 'zp-aff-' . md5( $key ) ); ?>"><?php echo esc_html( $label ); ?></label></th>
            <td>
              <input
                type="url"
                class="regular-text code"
                id="<?php echo esc_attr( 'zp-aff-' . md5( $key ) ); ?>"
                name="zaprazi_affiliate_map[<?php echo esc_attr( $key ); ?>]"
                value="<?php echo esc_attr( isset( $values[ $key ] ) ? $values[ $key ] : '' ); ?>"
                placeholder="https://..."
                inputmode="url"
                autocomplete="off"
              />
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
      <?php submit_button( 'Uložit affiliate odkazy' ); ?>
    </form>
  </div>
  <?php
}

function zaprazi_2_assets() {
  $dir = get_template_directory();
  $uri = get_template_directory_uri();

  wp_enqueue_style(
    'zaprazi-2-style',
    get_stylesheet_uri(),
    array(),
    file_exists($dir . '/style.css') ? filemtime($dir . '/style.css') : null
  );

  wp_enqueue_script(
    'zaprazi-analytics-consent',
    $uri . '/assets/js/analytics-consent.js',
    array(),
    file_exists($dir . '/assets/js/analytics-consent.js') ? filemtime($dir . '/assets/js/analytics-consent.js') : null,
    false
  );

  wp_add_inline_script(
    'zaprazi-analytics-consent',
    'window.ZaPraziAnalyticsConfig=' . wp_json_encode(
      array(
        'measurementId' => 'G-WM86QVXVST',
        'storageKey'    => 'zaprazi_analytics_consent_v1',
      )
    ) . ';',
    'before'
  );

  if ( is_front_page() ) {
    wp_enqueue_script(
      'zaprazi-runtime-config',
      $uri . '/assets/js/runtime-config.js',
      array(),
      file_exists($dir . '/assets/js/runtime-config.js') ? filemtime($dir . '/assets/js/runtime-config.js') : null,
      false
    );

    $affiliate_map = get_option( 'zaprazi_affiliate_map', array() );
    if ( ! is_array( $affiliate_map ) ) {
      $affiliate_map = array();
    }

    wp_add_inline_script(
      'zaprazi-runtime-config',
      'window.ZaPraziRuntime = Object.assign({}, window.ZaPraziRuntime || {}, {affiliateMap:' . wp_json_encode( $affiliate_map ) . '});',
      'after'
    );

    if ( function_exists('wp_enqueue_script_module') ) {
      wp_enqueue_script_module(
        'zaprazi-mobility-advisor',
        $uri . '/assets/js/mobility-advisor.js',
        array(),
        file_exists($dir . '/assets/js/mobility-advisor.js') ? filemtime($dir . '/assets/js/mobility-advisor.js') : null
      );
    }
  }
}
add_action('wp_enqueue_scripts', 'zaprazi_2_assets');


function zaprazi_2_front_title( $title ) {
  if ( is_front_page() ) {
    return 'Chodítko a rollátor: jak vybrat, půjčit nebo řešit úhradu | ZaPrazi';
  }
  return $title;
}
add_filter( 'pre_get_document_title', 'zaprazi_2_front_title', 20 );

function zaprazi_2_wpseo_title( $title ) {
  if ( is_front_page() ) {
    return 'Chodítko a rollátor: jak vybrat, půjčit nebo řešit úhradu | ZaPrazi';
  }

  return str_replace( 'Rady a tipy pro Váš dům', 'ZaPrazi.cz', $title );
}
add_filter( 'wpseo_title', 'zaprazi_2_wpseo_title', 20 );

function zaprazi_2_wpseo_description( $description ) {
  return is_front_page()
    ? 'Praktický poradce pro výběr chodítka nebo rollátoru: použití doma či venku, důležité parametry, koupě, půjčení a prověření možnosti úhrady.'
    : $description;
}
add_filter( 'wpseo_metadesc', 'zaprazi_2_wpseo_description', 20 );

function zaprazi_2_front_meta_fallback() {
  if ( ! is_front_page() || defined( 'WPSEO_VERSION' ) ) {
    return;
  }

  $description = 'Praktický poradce pro výběr chodítka nebo rollátoru: použití doma či venku, důležité parametry, koupě, půjčení a prověření možnosti úhrady.';
  echo '<meta name="description" content="' . esc_attr( $description ) . '">' . "\n";

  $schema = array(
    '@context' => 'https://schema.org',
    '@type' => 'WebPage',
    'name' => 'Chodítko a rollátor: jak vybrat, půjčit nebo řešit úhradu',
    'description' => $description,
    'url' => home_url( '/' ),
    'isPartOf' => array(
      '@type' => 'WebSite',
      'name' => 'ZaPrazi.cz',
      'url' => home_url( '/' ),
    ),
  );

  echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'zaprazi_2_front_meta_fallback', 5 );


function zaprazi_2_is_broken_legacy_external_url( $url ) {
  $decoded = html_entity_decode( (string) $url, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
  $decoded = rawurldecode( $decoded );
  return false !== stripos( $decoded, 'nazev-webu-affilbox' );
}

function zaprazi_2_guard_legacy_loop_external_cta( $html, $product, $args ) {
  if ( ! is_a( $product, 'WC_Product_External' ) ) {
    return $html;
  }

  if ( ! zaprazi_2_is_broken_legacy_external_url( $product->get_product_url() ) ) {
    return $html;
  }

  return '<span class="button zp-legacy-offer-unverified" aria-disabled="true">Původní nabídka se ověřuje</span>';
}
add_filter( 'woocommerce_loop_add_to_cart_link', 'zaprazi_2_guard_legacy_loop_external_cta', 20, 3 );


function zaprazi_2_wpseo_schema_website( $data ) {
  if ( is_array( $data ) ) {
    $data['name'] = 'ZaPrazi.cz';
    $data['description'] = 'Bezpečně a samostatně doma.';
  }
  return $data;
}
add_filter( 'wpseo_schema_website', 'zaprazi_2_wpseo_schema_website', 20 );

function zaprazi_2_wpseo_og_site_name( $name ) {
  return 'ZaPrazi.cz';
}
add_filter( 'wpseo_opengraph_site_name', 'zaprazi_2_wpseo_og_site_name', 20 );


/**
 * Legacy posts were imported with generated whole HTML documents appended to
 * otherwise useful post_content. Clean only at render time; never mutate storage.
 */
function zaprazi_2_sanitize_legacy_document_markup( $content ) {
  if ( is_admin() || ! is_singular( 'post' ) ) {
    return $content;
  }

  if (
    false === stripos( $content, '<!doctype' ) &&
    false === stripos( $content, '<html' ) &&
    false === stripos( $content, '<head' ) &&
    false === stripos( $content, '<body' )
  ) {
    return $content;
  }

  $original = $content;
  $doctype_position = stripos( $content, '<!doctype html' );

  if ( false !== $doctype_position && $doctype_position > 0 ) {
    $prefix = substr( $content, 0, $doctype_position );
    $tail = substr( $content, $doctype_position );

    $looks_like_appended_document =
      false !== stripos( $tail, '<html' ) &&
      false !== stripos( $tail, '<head' ) &&
      false !== stripos( $tail, '<body' );

    $prefix_text = trim( wp_strip_all_tags( $prefix ) );

    if ( $looks_like_appended_document && strlen( $prefix_text ) >= 40 ) {
      return rtrim( $prefix );
    }
  }

  $content = preg_replace( '/<!doctype\b[^>]*>/i', '', $content );
  $content = preg_replace( '/<head\b[^>]*>.*?<\/head\s*>/is', '', $content );
  $content = preg_replace( '/<\/?html\b[^>]*>/i', '', $content );
  $content = preg_replace( '/<\/?body\b[^>]*>/i', '', $content );

  return null === $content ? $original : $content;
}
add_filter( 'the_content', 'zaprazi_2_sanitize_legacy_document_markup', 3 );


/**
 * Create high-intent ZaPrazi resource pages once, without overwriting existing content.
 */
function zaprazi_2_ensure_resource_pages() {
  if ( '1' === get_option( 'zaprazi_resource_pages_v3' ) ) {
    return;
  }

  $pages = array(
    'choditko-na-pojistovnu' => array(
      'title'    => 'Chodítko na pojišťovnu 2026: ePoukaz, úhrada a postup',
      'excerpt'  => 'Jak v roce 2026 funguje ePoukaz na chodítko, co skutečně znamená úhrada a jak postupovat před nákupem.',
      'template' => 'page-choditko-na-pojistovnu.php',
    ),
    'pujceni-choditka' => array(
      'title'    => 'Půjčení chodítka a rollátoru 2026: ceny, kauce a kdy se vyplatí',
      'excerpt'  => 'Aktuální příklady cen pronájmu chodítek, kauce, doprava a praktické rozhodnutí, kdy půjčit a kdy raději koupit.',
      'template' => 'page-pujceni-choditka.php',
    ),
    'ochrana-soukromi' => array(
      'title'    => 'Ochrana soukromí a měření návštěvnosti',
      'excerpt'  => 'Jak ZaPrazi pracuje s odpověďmi z poradce, volitelným Google Analytics a nastavením souhlasu.',
      'template' => 'page-ochrana-soukromi.php',
    ),
  );

  $all_ready = true;

  foreach ( $pages as $slug => $page ) {
    $existing = get_page_by_path( $slug, OBJECT, 'page' );

    if ( $existing ) {
      continue;
    }

    $page_id = wp_insert_post(
      array(
        'post_type'    => 'page',
        'post_status'  => 'publish',
        'post_title'   => $page['title'],
        'post_name'    => $slug,
        'post_content' => '',
        'post_excerpt' => $page['excerpt'],
        'meta_input'   => array(
          '_wp_page_template' => $page['template'],
        ),
      ),
      true
    );

    if ( is_wp_error( $page_id ) || ! $page_id ) {
      $all_ready = false;
    }
  }

  if ( $all_ready ) {
    update_option( 'zaprazi_resource_pages_v3', '1', false );
  }
}
add_action( 'init', 'zaprazi_2_ensure_resource_pages', 30 );

function zaprazi_2_is_insurance_walker_page() {
  return is_page( 'choditko-na-pojistovnu' );
}

function zaprazi_2_is_rental_walker_page() {
  return is_page( 'pujceni-choditka' );
}

function zaprazi_2_is_privacy_page() {
  return is_page( 'ochrana-soukromi' );
}

function zaprazi_2_resource_title( $title ) {
  if ( zaprazi_2_is_insurance_walker_page() ) {
    return 'Chodítko na pojišťovnu 2026: ePoukaz, úhrada a postup | ZaPrazi';
  }

  if ( zaprazi_2_is_rental_walker_page() ) {
    return 'Půjčení chodítka a rollátoru 2026: ceny a kdy se vyplatí | ZaPrazi';
  }

  if ( zaprazi_2_is_privacy_page() ) {
    return 'Ochrana soukromí a měření návštěvnosti | ZaPrazi';
  }

  return $title;
}
add_filter( 'pre_get_document_title', 'zaprazi_2_resource_title', 30 );
add_filter( 'wpseo_title', 'zaprazi_2_resource_title', 30 );

function zaprazi_2_resource_description( $description ) {
  if ( zaprazi_2_is_insurance_walker_page() ) {
    return 'Jak v roce 2026 funguje chodítko na pojišťovnu: ePoukaz, podmínky úhrady, platnost poukazu a měsíčně ověřovaný příklad MEYRA Ideal podle SÚKL.';
  }

  if ( zaprazi_2_is_rental_walker_page() ) {
    return 'Půjčení chodítka nebo rollátoru: aktuální příklady cen, kauce a dopravy a praktický návod, kdy se vyplatí pronájem oproti koupi.';
  }

  if ( zaprazi_2_is_privacy_page() ) {
    return 'Jak ZaPrazi chrání odpovědi z Domácího poradce a kdy se načítá volitelné Google Analytics. Souhlas s měřením lze kdykoli změnit.';
  }

  return $description;
}
add_filter( 'wpseo_metadesc', 'zaprazi_2_resource_description', 30 );
