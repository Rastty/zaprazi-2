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
  return is_front_page()
    ? 'Chodítko a rollátor: jak vybrat, půjčit nebo řešit úhradu | ZaPrazi'
    : $title;
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
