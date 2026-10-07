<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! defined( 'ZAPRAZI_RELEASE' ) ) {
  define( 'ZAPRAZI_RELEASE', '0.8.32' );
}

function zaprazi_2_release_integrity_ok() {
  $marker = 'ZP_RELEASE_0_8_32';
  $files = array(
    'header.php',
    'footer.php',
    'front-page.php',
    'page-choditko-na-pojistovnu.php',
    'page-pujceni-choditka.php',
    'page-ochrana-soukromi.php',
    'page-koupelna-a-wc.php',
    'page-pomucky-do-koupelny-na-pojistovnu.php',
    'page-polohovaci-postel.php',
    'page-polohovaci-postel-na-pojistovnu.php',
    'page-invalidni-vozik.php',
    'page-invalidni-vozik-na-pojistovnu.php',
    'page-navrat-z-nemocnice.php',
    'page-sobestacnost.php',
    'page-kompenzacni-pomucky-pro-seniory.php',
    'page-bezpecny-byt-pro-seniora.php',
    'page-obuv-pro-seniory.php',
    'page-nastavec-na-wc-pro-seniory.php',
    'assets/js/analytics-consent.js',
    'assets/js/mobility-advisor.js',
    'assets/js/bathroom-advisor.js',
    'assets/js/bed-advisor.js',
    'assets/js/wheelchair-advisor.js',
    'assets/js/return-home-advisor.js',
    'assets/js/adl-advisor.js',
    'assets/js/footwear-advisor.js',
    'assets/js/toilet-riser-advisor.js',
    'assets/js/runtime-config.js',
    'style.css',
  );

  foreach ( $files as $relative_path ) {
    $path = get_template_directory() . '/' . $relative_path;
    if ( ! is_readable( $path ) ) {
      return false;
    }

    $contents = file_get_contents( $path );
    if ( false === $contents || false === strpos( $contents, $marker ) ) {
      return false;
    }
  }

  return true;
}

function zaprazi_2_release_meta() {
  echo '<meta name="zaprazi-release" content="' . esc_attr( ZAPRAZI_RELEASE ) . '">' . "\n";
  echo '<meta name="zaprazi-integrity" content="' . ( zaprazi_2_release_integrity_ok() ? 'ok' : 'partial' ) . '">' . "\n";
}
add_action( 'wp_head', 'zaprazi_2_release_meta', 1 );

function zaprazi_2_release_integrity_admin_notice() {
  if ( ! current_user_can( 'manage_options' ) || zaprazi_2_release_integrity_ok() ) {
    return;
  }

  echo '<div class="notice notice-error"><p><strong>Zápraží deployment partial.</strong> Některý kritický runtime soubor neodpovídá release ' . esc_html( ZAPRAZI_RELEASE ) . '. Nespouštějte další změny, dokud se neprovede úplný Deploy z větve dev.</p></div>';
}
add_action( 'admin_notices', 'zaprazi_2_release_integrity_admin_notice' );



function zaprazi_2_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('custom-logo', array(
    'height'      => 92,
    'width'       => 248,
    'flex-height' => true,
    'flex-width'  => true,
  ));
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
    'unizdrav-cz:p2868' => 'UNIZDRAV — P2868 zvyšovač WC 15 cm',
    'unizdrav-cz:p2015' => 'UNIZDRAV — P2015 toaletní opora',
    'unizdrav-cz:p2807' => 'UNIZDRAV — P2807 toaletní židle',
    'unizdrav-cz:p2062' => 'UNIZDRAV — P2062 sprchovací židle',
    'unizdrav-cz:p2131' => 'UNIZDRAV — P2131 pevné madlo',
    'rehabilitacni-pomucky-cz:besco-bs008' => 'RehabilitačníPomůcky.cz — BESCO BS008 sedačka na vanu s madlem',
    'rehabilitacni-pomucky-cz:besco-bs15' => 'RehabilitačníPomůcky.cz — BESCO BS15 nástavec na WC s madly',
    'drmax-cz:dma-eh-cmda' => 'Dr.Max — DMA EH-CMDA toaletní židle 4v1',
    'unizdrav-cz:p2203' => 'UNIZDRAV — P2203 transferová židle přes vanu',
    'unizdrav-cz:p2777' => 'UNIZDRAV — P2777 polohovací postel CLASSIC',
    'unizdrav-cz:p4707' => 'UNIZDRAV — P4707 polohovací postel Hospital',
    'unizdrav-cz:p4044' => 'UNIZDRAV — P4044 polohovací postel Multibed',
    'unizdrav-cz:p4384' => 'UNIZDRAV — P4384 invalidní vozík Basic',
    'unizdrav-cz:p3641' => 'UNIZDRAV — P3641 odlehčený mechanický vozík',
    'unizdrav-cz:p2961' => 'UNIZDRAV — P2961 elektrický invalidní vozík 46 cm',
    'rehavita-cz:upcup-15-050101' => 'RehaVita.cz (VIV 18119967) — UpCup 15-050101',
    'rehavita-cz:beat-it-15-050102' => 'RehaVita.cz (VIV 18119967) — Beat It 15-050102',
    'rehavita-cz:theomatik-15-050103' => 'RehaVita.cz (VIV 18119967) — Theomatik 15-050103',
    'rehavita-cz:open-it-15-050105' => 'RehaVita.cz (VIV 18119967) — MVS Open-It 15-050105',
    'zdrava-obuv-cz:arsene' => 'Zdravá Obuv — PodoWell ARSENE',
    'zdrava-obuv-cz:xavier' => 'Zdravá Obuv — PodoWell XAVIER',
    'zdrava-obuv-cz:altitude' => 'Zdravá Obuv — PodoWell ALTITUDE',
  );
}

function zaprazi_2_affiliate_targets() {
  return array(
    'rehabilitacni-pomucky-cz:besco-wa17' => 'https://www.rehabilitacnipomucky.cz/besco-ctyrbodove-choditko-skladaci/',
    'rehabilitacni-pomucky-cz:besco-wa21' => 'https://www.rehabilitacnipomucky.cz/besco-dvoukolove-choditko-skladaci/',
    'lekarna-cz:meyra-ideal-3061982' => 'https://www.lekarna.cz/meyra-ideal-rollator-ctyrkolove-choditko/',
    'unizdrav-cz:p2868' => 'https://unizdrav.cz/zbozi/2868/zvysovac-wc-s-priklopem-unizdrav-15-cm',
    'unizdrav-cz:p2015' => 'https://unizdrav.cz/zbozi/2015/toaletni-opora',
    'unizdrav-cz:p2807' => 'https://unizdrav.cz/zbozi/2807/toaletni-zidle-vyskove-nastavitelna-unizdrav',
    'unizdrav-cz:p2062' => 'https://unizdrav.cz/zbozi/2062/sprchovaci-zidle-s-ruckami',
    'unizdrav-cz:p2131' => 'https://unizdrav.cz/zbozi/2131/protiskluzove-madlo-do-koupelny-a-toalety-od-30-do-45-cm',
    'rehabilitacni-pomucky-cz:besco-bs008' => 'https://www.rehabilitacnipomucky.cz/besco-sedacka-na-vanu-s-madlem/',
    'rehabilitacni-pomucky-cz:besco-bs15' => 'https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/',
    'drmax-cz:dma-eh-cmda' => 'https://www.drmax.cz/dma-eh-cmda-toaletni-zidle-4v1',
    'unizdrav-cz:p2203' => 'https://unizdrav.cz/zbozi/2203/sprchovaci-zidle-do-vany',
    'unizdrav-cz:p2777' => 'https://unizdrav.cz/zbozi/2777/elektricka-polohovaci-postel-classic',
    'unizdrav-cz:p4707' => 'https://unizdrav.cz/zbozi/4707/elektricka-polohovaci-postel-hospital',
    'unizdrav-cz:p4044' => 'https://unizdrav.cz/zbozi/4044/elektricka-polohovaci-postel-s-matraci-multibed',
    'unizdrav-cz:p4384' => 'https://unizdrav.cz/zbozi/4384/invalidni-vozik-unizdrav-basic',
    'unizdrav-cz:p3641' => 'https://unizdrav.cz/zbozi/3641/invalidni-vozik-odlehceny-s-brzdami-pro-doprovod',
    'unizdrav-cz:p2961' => 'https://unizdrav.cz/zbozi/2961/elektricky-invalidni-vozik-46-cm',
    'rehavita-cz:upcup-15-050101' => 'https://www.rehavita.cz/upcup-pomucka-pro-snadne-piti/',
    'rehavita-cz:beat-it-15-050102' => 'https://www.rehavita.cz/beat-it-drzak-pro-stabilizaci-nadob-moves/',
    'rehavita-cz:theomatik-15-050103' => 'https://www.rehavita.cz/theomatik-multifunkcni-jidelni-podnos-pro-obsluhu-jednou-rukou-moves/',
    'rehavita-cz:open-it-15-050105' => 'https://www.rehavita.cz/mvs-open-it-multifunkcni-oteviraci-pomucka-5-v-1/',
    'zdrava-obuv-cz:arsene' => 'https://www.zdrava-obuv-eshop.cz/arsene-zdravotni-sandalek-unisex-modra-podowell/',
    'zdrava-obuv-cz:xavier' => 'https://www.zdrava-obuv-eshop.cz/xavier-ortopedicka-obuv-extrasiroka-pro-otekle-nohy-unisex-cerna-podowell/',
    'zdrava-obuv-cz:altitude' => 'https://www.zdrava-obuv-eshop.cz/altitude-zdravotni-obuv-pro-extremne-otekle-nohy-unisex-cerna-podowell/',
  );
}

function zaprazi_2_affiliate_groups() {
  return array(
    'mobility' => array(
      'label' => 'Mobility',
      'keys' => array(
        'rehabilitacni-pomucky-cz:besco-wa17',
        'rehabilitacni-pomucky-cz:besco-wa21',
        'lekarna-cz:meyra-ideal-3061982',
      ),
    ),
    'bathroom' => array(
      'label' => 'Koupelna a WC',
      'keys' => array(
        'unizdrav-cz:p2868',
        'unizdrav-cz:p2015',
        'unizdrav-cz:p2807',
        'unizdrav-cz:p2062',
        'unizdrav-cz:p2131',
        'rehabilitacni-pomucky-cz:besco-bs008',
        'rehabilitacni-pomucky-cz:besco-bs15',
        'drmax-cz:dma-eh-cmda',
        'unizdrav-cz:p2203',
      ),
    ),
    'bed' => array(
      'label' => 'Polohovací postel',
      'keys' => array(
        'unizdrav-cz:p2777',
        'unizdrav-cz:p4707',
        'unizdrav-cz:p4044',
      ),
    ),
    'wheelchair' => array(
      'label' => 'Invalidní vozík',
      'keys' => array(
        'unizdrav-cz:p4384',
        'unizdrav-cz:p3641',
        'unizdrav-cz:p2961',
      ),
    ),
    'adl' => array(
      'label' => 'Soběstačnost',
      'keys' => array(
        'rehavita-cz:upcup-15-050101',
        'rehavita-cz:beat-it-15-050102',
        'rehavita-cz:theomatik-15-050103',
        'rehavita-cz:open-it-15-050105',
      ),
    ),
    'footwear' => array(
      'label' => 'Obuv pro seniory',
      'keys' => array(
        'zdrava-obuv-cz:arsene',
        'zdrava-obuv-cz:xavier',
        'zdrava-obuv-cz:altitude',
      ),
    ),
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
    'Zápraží affiliate routing',
    'Zápraží affiliate',
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
  $targets = zaprazi_2_affiliate_targets();
  $groups = zaprazi_2_affiliate_groups();
  $readiness = array();

  foreach ( $groups as $group_id => $group ) {
    $configured = 0;
    foreach ( $group['keys'] as $key ) {
      if ( ! empty( $values[ $key ] ) ) {
        $configured++;
      }
    }

    $readiness[ $group_id ] = array(
      'label'      => $group['label'],
      'configured' => $configured,
      'total'      => count( $group['keys'] ),
    );
  }
  ?>
  <div class="wrap">
    <h1>Zápraží affiliate routing</h1>
    <p>Vkládejte pouze přesné, ověřené partnerské deeplinky vygenerované schváleným affiliate účtem. Prázdné pole znamená bezpečný fallback na běžný produktový odkaz.</p>

    <div class="notice notice-info inline" style="margin:16px 0 18px">
      <p><strong>Jak získat přesný deeplink:</strong> v affiliate účtu otevřete správného inzerenta. Pokud síť nabízí deeplink nástroj (např. VIV/CJ Deep Link Generator), vložte níže uvedenou cílovou produktovou URL a vygenerovaný partnerský odkaz vložte do příslušného pole. Tracking URL ručně neskládejte.</p>
    </div>

    <div class="notice notice-info inline" style="margin:16px 0 18px">
      <p><strong>RehaVita.cz:</strong> schválený program je vedený přes VIVnetworks/CJ jako advertiser <strong>18119967</strong>. Pro UpCup, Beat It, Theomatik a Open-It otevřete níže uvedenou přesnou produktovou URL a použijte CJ Deep Link Generator / jeho Chrome rozšíření. Vygenerovaný odkaz patří vždy jen do odpovídajícího slotu.</p>
    </div>

    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:18px 0 22px">
      <?php foreach ( $readiness as $item ) : ?>
        <div style="padding:14px 16px;background:#fff;border:1px solid #dcdcde;border-radius:8px;min-width:180px">
          <strong><?php echo esc_html( $item['label'] ); ?></strong><br>
          <span style="font-size:24px;font-weight:700"><?php echo esc_html( $item['configured'] . ' / ' . $item['total'] ); ?></span>
        </div>
      <?php endforeach; ?>
      <div style="padding:14px 16px;background:#fff;border:1px solid #dcdcde;border-radius:8px;min-width:300px">
        <strong>Produkční chování</strong><br>
        <span>Prázdný slot vždy bezpečně používá ověřený běžný produktový odkaz. Affiliate readiness nemění doporučení ani pořadí výrobků.</span>
      </div>
    </div>

    <form method="post" action="options.php">
      <?php settings_fields( 'zaprazi_affiliate' ); ?>
      <table class="form-table" role="presentation">
        <tbody>
        <?php foreach ( $fields as $key => $label ) : ?>
          <tr>
            <th scope="row"><label for="<?php echo esc_attr( 'zp-aff-' . md5( $key ) ); ?>"><?php echo esc_html( $label ); ?></label></th>
            <td>
              <?php
              $current_url = isset( $values[ $key ] ) ? $values[ $key ] : '';
              $target_url = isset( $targets[ $key ] ) ? $targets[ $key ] : '';
              ?>
              <input
                type="url"
                class="regular-text code"
                id="<?php echo esc_attr( 'zp-aff-' . md5( $key ) ); ?>"
                name="zaprazi_affiliate_map[<?php echo esc_attr( $key ); ?>]"
                value="<?php echo esc_attr( $current_url ); ?>"
                placeholder="https://..."
                inputmode="url"
                autocomplete="off"
              />
              <?php if ( $target_url ) : ?>
                <p style="margin:6px 0 0">
                  <strong>Cílová URL pro Deep Link Generator:</strong><br>
                  <code style="word-break:break-all"><?php echo esc_html( $target_url ); ?></code>
                  · <a href="<?php echo esc_url( $target_url ); ?>" target="_blank" rel="noopener noreferrer">Otevřít produkt ↗</a>
                </p>
              <?php endif; ?>
              <p style="margin:6px 0 0">
                <?php if ( $current_url ) : ?>
                  <strong style="color:#008a20">Partnerský odkaz aktivní</strong>
                  · <a href="<?php echo esc_url( $current_url ); ?>" target="_blank" rel="noopener noreferrer">Otestovat deeplink ↗</a>
                <?php else : ?>
                  <strong>Fallback</strong> — poradce používá běžný ověřený produktový odkaz.
                <?php endif; ?>
              </p>
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

function zaprazi_2_is_bathroom_page() {
  return is_page( 'koupelna-a-wc' );
}

function zaprazi_2_is_bed_page() {
  return is_page( 'polohovaci-postel' );
}

function zaprazi_2_is_wheelchair_page() {
  return is_page( 'invalidni-vozik' );
}

function zaprazi_2_is_return_home_page() {
  return is_page( 'navrat-z-nemocnice' );
}

function zaprazi_2_is_adl_page() {
  return is_page( 'sobestacnost' );
}

function zaprazi_2_is_compensatory_aids_page() {
  return is_page( 'kompenzacni-pomucky-pro-seniory' );
}

function zaprazi_2_is_safe_home_page() {
  return is_page( 'bezpecny-byt-pro-seniora' );
}

function zaprazi_2_is_footwear_page() {
  return is_page( 'obuv-pro-seniory' );
}

function zaprazi_2_is_toilet_riser_page() {
  return is_page( 'nastavec-na-wc-pro-seniory' );
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

  if ( is_front_page() || zaprazi_2_is_bathroom_page() || zaprazi_2_is_bed_page() || zaprazi_2_is_wheelchair_page() || zaprazi_2_is_return_home_page() || zaprazi_2_is_adl_page() || zaprazi_2_is_footwear_page() || zaprazi_2_is_toilet_riser_page() ) {
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
      if ( is_front_page() ) {
        wp_enqueue_script_module(
          'zaprazi-mobility-advisor',
          $uri . '/assets/js/mobility-advisor.js',
          array(),
          file_exists($dir . '/assets/js/mobility-advisor.js') ? filemtime($dir . '/assets/js/mobility-advisor.js') : null
        );
      } elseif ( zaprazi_2_is_bathroom_page() ) {
        wp_enqueue_script_module(
          'zaprazi-bathroom-advisor',
          $uri . '/assets/js/bathroom-advisor.js',
          array(),
          file_exists($dir . '/assets/js/bathroom-advisor.js') ? filemtime($dir . '/assets/js/bathroom-advisor.js') : null
        );
      } elseif ( zaprazi_2_is_bed_page() ) {
        wp_enqueue_script_module(
          'zaprazi-bed-advisor',
          $uri . '/assets/js/bed-advisor.js',
          array(),
          file_exists($dir . '/assets/js/bed-advisor.js') ? filemtime($dir . '/assets/js/bed-advisor.js') : null
        );
      } elseif ( zaprazi_2_is_wheelchair_page() ) {
        wp_enqueue_script_module(
          'zaprazi-wheelchair-advisor',
          $uri . '/assets/js/wheelchair-advisor.js',
          array(),
          file_exists($dir . '/assets/js/wheelchair-advisor.js') ? filemtime($dir . '/assets/js/wheelchair-advisor.js') : null
        );
      } elseif ( zaprazi_2_is_return_home_page() ) {
        wp_enqueue_script_module(
          'zaprazi-return-home-advisor',
          $uri . '/assets/js/return-home-advisor.js',
          array(),
          file_exists($dir . '/assets/js/return-home-advisor.js') ? filemtime($dir . '/assets/js/return-home-advisor.js') : null
        );
      } elseif ( zaprazi_2_is_toilet_riser_page() ) {
    $faq = array(
      array(
        'question' => 'Jak vysoký nástavec na WC vybrat?',
        'answer'   => 'Ne podle toho, který je nejvyšší. Výsledná výška musí umožnit bezpečné sednutí a vstávání a po zvýšení musí zůstat stabilní opora chodidel o podlahu.',
      ),
      array(
        'question' => 'Kdy má smysl nástavec s madly?',
        'answer'   => 'Když člověk přesedá bez fyzické pomoci druhé osoby, ale při sedání nebo vstávání potřebuje stabilní oporu rukama. Pokud je běžně potřeba zvedání nebo výrazné jištění druhou osobou, online poradce konkrétní nástavec nevybírá.',
      ),
      array(
        'question' => 'Pasuje nástavec na každý záchod?',
        'answer'   => 'Ne. Je potřeba ověřit tvar a rozměry konkrétní WC mísy i způsob upevnění. Nástavec musí po instalaci zůstat pevný a bez posunu.',
      ),
      array(
        'question' => 'Hradí nástavec na WC zdravotní pojišťovna?',
        'answer'   => 'Některé konkrétní zdravotnické prostředky hrazené být mohou, ale nelze to určit jen podle názvu kategorie. Před tvrzením o úhradě je potřeba ověřit přesný prostředek a aktuální záznam v seznamu SÚKL.',
      ),
    );
  } elseif ( zaprazi_2_is_adl_page() ) {
        wp_enqueue_script_module(
          'zaprazi-adl-advisor',
          $uri . '/assets/js/adl-advisor.js',
          array(),
          file_exists($dir . '/assets/js/adl-advisor.js') ? filemtime($dir . '/assets/js/adl-advisor.js') : null
        );
      } elseif ( zaprazi_2_is_footwear_page() ) {
        wp_enqueue_script_module(
          'zaprazi-footwear-advisor',
          $uri . '/assets/js/footwear-advisor.js',
          array(),
          file_exists($dir . '/assets/js/footwear-advisor.js') ? filemtime($dir . '/assets/js/footwear-advisor.js') : null
        );
      } elseif ( zaprazi_2_is_toilet_riser_page() ) {
        wp_enqueue_script_module(
          'zaprazi-toilet-riser-advisor',
          $uri . '/assets/js/toilet-riser-advisor.js',
          array(),
          file_exists($dir . '/assets/js/toilet-riser-advisor.js') ? filemtime($dir . '/assets/js/toilet-riser-advisor.js') : null
        );
      }
    }
  }
}
add_action('wp_enqueue_scripts', 'zaprazi_2_assets');


function zaprazi_2_front_title( $title ) {
  if ( is_front_page() ) {
    return 'Zápraží: domácí poradce pro bezpečný a samostatný život doma';
  }
  if ( zaprazi_2_is_bathroom_page() ) {
    return 'Koupelna a WC: bezpečnější řešení doma | Zápraží';
  }
  if ( zaprazi_2_is_bed_page() ) {
    return 'Polohovací postel: koupit, půjčit nebo pojišťovna | Zápraží';
  }
  if ( zaprazi_2_is_wheelchair_page() ) {
    return 'Invalidní vozík: jak vybrat, půjčit nebo řešit pojišťovnu | Zápraží';
  }
  if ( zaprazi_2_is_return_home_page() ) {
    return 'Návrat z nemocnice domů: co připravit první noc | Zápraží';
  }
  if ( zaprazi_2_is_adl_page() ) {
    return 'Pomůcky pro soběstačnost seniorů: jak vybrat | Zápraží';
  }
  if ( zaprazi_2_is_compensatory_aids_page() ) {
    return 'Kompenzační pomůcky pro seniory: jak vybrat | Zápraží';
  }
  if ( zaprazi_2_is_safe_home_page() ) {
    return 'Jak upravit byt pro seniora: bezpečný domov krok za krokem | Zápraží';
  }
  if ( zaprazi_2_is_footwear_page() ) {
    return 'Boty pro seniory na suchý zip: široká a snadno obouvatelná obuv | Zápraží';
  }
  if ( zaprazi_2_is_toilet_riser_page() ) {
    return 'Nástavec na WC pro seniory: jak vybrat výšku a madla | Zápraží';
  }
  return $title;
}
add_filter( 'pre_get_document_title', 'zaprazi_2_front_title', 20 );

function zaprazi_2_wpseo_title( $title ) {
  if ( is_front_page() ) {
    return 'Zápraží: domácí poradce pro bezpečný a samostatný život doma';
  }
  if ( zaprazi_2_is_bathroom_page() ) {
    return 'Koupelna a WC: bezpečnější řešení doma | Zápraží';
  }
  if ( zaprazi_2_is_bed_page() ) {
    return 'Polohovací postel: koupit, půjčit nebo pojišťovna | Zápraží';
  }
  if ( zaprazi_2_is_wheelchair_page() ) {
    return 'Invalidní vozík: jak vybrat, půjčit nebo řešit pojišťovnu | Zápraží';
  }
  if ( zaprazi_2_is_return_home_page() ) {
    return 'Návrat z nemocnice domů: co připravit první noc | Zápraží';
  }
  if ( zaprazi_2_is_adl_page() ) {
    return 'Pomůcky pro soběstačnost seniorů: jak vybrat | Zápraží';
  }
  if ( zaprazi_2_is_compensatory_aids_page() ) {
    return 'Kompenzační pomůcky pro seniory: jak vybrat | Zápraží';
  }
  if ( zaprazi_2_is_safe_home_page() ) {
    return 'Jak upravit byt pro seniora: bezpečný domov krok za krokem | Zápraží';
  }
  if ( zaprazi_2_is_footwear_page() ) {
    return 'Boty pro seniory na suchý zip: široká a snadno obouvatelná obuv | Zápraží';
  }
  if ( zaprazi_2_is_toilet_riser_page() ) {
    return 'Nástavec na WC pro seniory: jak vybrat výšku a madla | Zápraží';
  }

  return str_replace( 'Rady a tipy pro Váš dům', 'Zápraží', $title );
}
add_filter( 'wpseo_title', 'zaprazi_2_wpseo_title', 20 );

function zaprazi_2_wpseo_description( $description ) {
  if ( is_front_page() ) {
    return 'Praktický domácí poradce pro chůzi, koupelnu a WC, polohovací postel, invalidní vozík, návrat z nemocnice a každodenní soběstačnost.';
  }
  if ( zaprazi_2_is_bathroom_page() ) {
    return 'Praktický poradce pro bezpečnější WC a koupelnu: zvýšení WC, opory, toaletní a sprchovací židle, koupě, půjčení a prověření hrazené alternativy.';
  }
  if ( zaprazi_2_is_bed_page() ) {
    return 'Praktický poradce pro polohovací postel: vhodný typ, rozměry a nosnost, půjčení, koupě a prověření úhrady nebo cirkulace přes pojišťovnu.';
  }
  if ( zaprazi_2_is_wheelchair_page() ) {
    return 'Praktický poradce pro invalidní vozík: doprovod, samostatný ruční nebo elektrický pohon, správný sed, průchody, nosnost, půjčení a pojišťovna.';
  }
  if ( zaprazi_2_is_return_home_page() ) {
    return 'Praktický plán návratu z nemocnice: vstup domů, přesuny, chůze, WC, postel, koupelna a návazná domácí péče pro první noc doma.';
  }
  if ( zaprazi_2_is_adl_page() ) {
    return 'Jak vybrat pomůcky pro soběstačnost seniorů podle konkrétního úkonu: pití, stabilizace nádoby, jídlo jednou rukou a otevírání běžných obalů.';
  }
  if ( zaprazi_2_is_compensatory_aids_page() ) {
    return 'Praktický průvodce kompenzačními pomůckami pro seniory: chůze, koupelna a WC, postel, vozík, soběstačnost a rozdíl mezi koupí, půjčením a pojišťovnou.';
  }
  if ( zaprazi_2_is_safe_home_page() ) {
    return 'Jak upravit byt pro seniora: praktický audit vstupu, trasy postel–WC, koupelny, osvětlení, překážek a návazných kompenzačních pomůcek.';
  }
  if ( zaprazi_2_is_footwear_page() ) {
    return 'Praktický poradce pro boty pro seniory na suchý zip: širší otevření, extra široká obuv, plná nebo otevřená špička a kontrola velikosti před nákupem.';
  }
  if ( zaprazi_2_is_toilet_riser_page() ) {
    return 'Jak vybrat nástavec na WC pro seniora: výška zvýšení, madla, kompatibilita s WC, nosnost a bezpečná opora chodidel po zvýšení.';
  }
  return $description;
}
add_filter( 'wpseo_metadesc', 'zaprazi_2_wpseo_description', 20 );

function zaprazi_2_front_meta_fallback() {
  if ( ! is_front_page() || defined( 'WPSEO_VERSION' ) ) {
    return;
  }

  $description = 'Praktický domácí poradce pro chůzi, koupelnu a WC, polohovací postel, invalidní vozík, návrat z nemocnice a každodenní soběstačnost.';
  echo '<meta name="description" content="' . esc_attr( $description ) . '">' . "\n";

  $schema = array(
    '@context' => 'https://schema.org',
    '@type' => 'WebPage',
    'name' => 'Zápraží: domácí poradce pro bezpečný a samostatný život doma',
    'description' => $description,
    'url' => home_url( '/' ),
    'isPartOf' => array(
      '@type' => 'WebSite',
      'name' => 'Zápraží',
      'url' => home_url( '/' ),
    ),
  );

  echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'zaprazi_2_front_meta_fallback', 5 );

function zaprazi_2_front_faq_schema() {
  if ( ! is_front_page() ) {
    return;
  }

  $faq = array(
    array(
      'question' => 'Jaké chodítko pro seniora do bytu?',
      'answer'   => 'Nejdřív je potřeba řešit, kolik opory člověk potřebuje, zda zvládne chodítko lehce nadzvednout a jak široké jsou průchody doma. Zápraží proto nerozhoduje jen podle věku nebo označení „pro seniora“.',
    ),
    array(
      'question' => 'Jaké chodítko nebo rollátor na ven?',
      'answer'   => 'U venkovní větve je zásadní ovládání brzd a praktické parametry konkrétního rollátoru. Pokud člověk ruční brzdy bezpečně nezvládá, poradce brzděný rollátor automaticky nedoporučí.',
    ),
    array(
      'question' => 'Je lepší chodítko půjčit, nebo koupit?',
      'answer'   => 'Záleží hlavně na očekávané délce používání, ceně, dostupnosti půjčovny a servisu. U dočasné potřeby proto Zápraží porovnává půjčení s koupí místo automatického nákupu.',
    ),
    array(
      'question' => 'Hradí chodítko zdravotní pojišťovna?',
      'answer'   => 'Některé zdravotnické prostředky mohou mít úhradu při splnění podmínek a správném postupu. Zápraží ukazuje ověřovací cestu a zdroje, ale nepotvrzuje individuální nárok konkrétního člověka.',
    ),
  );

  $schema = array(
    '@context'   => 'https://schema.org',
    '@type'      => 'FAQPage',
    'mainEntity' => array_map(
      static function ( $item ) {
        return array(
          '@type'          => 'Question',
          'name'           => $item['question'],
          'acceptedAnswer' => array(
            '@type' => 'Answer',
            'text'  => $item['answer'],
          ),
        );
      },
      $faq
    ),
  );

  echo '<script type="application/ld+json" data-zaprazi-schema="faq">' .
    wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) .
    '</script>' . "\n";
}
add_action( 'wp_head', 'zaprazi_2_front_faq_schema', 6 );

function zaprazi_2_resource_faq_schema() {
  $faq = array();

  if ( zaprazi_2_is_insurance_walker_page() ) {
    $faq = array(
      array(
        'question' => 'Je každé chodítko hrazené pojišťovnou?',
        'answer'   => 'Ne. Rozhoduje konkrétní zdravotnický prostředek, jeho zařazení a úhradové podmínky. Nestačí, že se výrobek obecně jmenuje chodítko nebo rollátor.',
      ),
      array(
        'question' => 'Musím mít od roku 2026 papírový poukaz?',
        'answer'   => 'Standardně ne. Od 1. ledna 2026 je běžnou formou ePoukaz. Papírový poukaz zůstává jen pro stanovené výjimky.',
      ),
      array(
        'question' => 'Mohu chodítko s ePoukazem koupit v libovolném e-shopu?',
        'answer'   => 'Ne automaticky. Maloobchodní prodej a výdej prostředku na poukaz jsou odlišné cesty. Před objednáním ověřte, zda konkrétní výdejce ePoukaz pro daný prostředek zpracuje.',
      ),
      array(
        'question' => 'Je úhrada 3 408 Kč u MEYRA Ideal garantovaná i v listopadu?',
        'answer'   => 'Ne. Částka 3 408 Kč je ověřená v oficiálním seznamu platném pro říjen 2026. Od 1. listopadu Zápraží tento údaj nepovažuje za aktuální, dokud neověří nový měsíční seznam.',
      ),
    );
  } elseif ( zaprazi_2_is_rental_walker_page() ) {
    $faq = array(
      array(
        'question' => 'Kolik stojí půjčení rollátoru na měsíc?',
        'answer'   => 'V ověřeném ceníku RehaKomp bylo 6. 10. 2026 čtyřkolové venkovní chodítko za 360 Kč měsíčně. MEYRA uváděla kategorii chodítek za 600 Kč měsíčně. Ceny a dostupnost se mohou změnit.',
      ),
      array(
        'question' => 'Platí se při půjčení chodítka kauce?',
        'answer'   => 'U ověřených příkladů RehaKomp i MEYRA byla vratná kauce 1 000 Kč. Vždy ověřte podmínky konkrétní půjčovny a modelu.',
      ),
      array(
        'question' => 'Vyplatí se půjčení po operaci?',
        'answer'   => 'Často může být praktické, pokud je potřeba dočasná. Nejdřív ale musí sedět typ pomůcky; cena pronájmu sama o sobě není důvod používat nevhodné chodítko.',
      ),
      array(
        'question' => 'Mohu si půjčit chodítko, než vyřídím ePoukaz?',
        'answer'   => 'Ano, půjčení může sloužit jako dočasná cesta. Podmínky konkrétní půjčovny a případný vztah půjčovného k následnému nákupu nebo výdeji se ale liší.',
      ),
    );
  } elseif ( zaprazi_2_is_bathroom_insurance_page() ) {
    $faq = array(
      array(
        'question' => 'Hradí pojišťovna sprchovací nebo toaletní židli?',
        'answer'   => 'Některé zdravotnické prostředky tohoto typu mohou být hrazené při splnění indikačních a úhradových podmínek. VZP tuto skupinu aktuálně popisuje, ale konkrétní výrobek musí být ověřen v aktuálním seznamu SÚKL a předpis podléhá schválení pojišťovny.',
      ),
      array(
        'question' => 'Mohu si koupit pomůcku a potom požádat pojišťovnu o proplacení?',
        'answer'   => 'Na takový postup se nespoléhejte. Hrazená cesta začíná správným předpisem, případným schválením a výdejem přes oprávněného výdejce; běžný maloobchodní nákup je jiná cesta.',
      ),
      array(
        'question' => 'Může pomůcku do koupelny předepsat praktický lékař?',
        'answer'   => 'U skupiny kompenzačních prostředků popsané VZP je praktický lékař mezi uvedenými odbornostmi. Přesto musí být splněny konkrétní podmínky a u této skupiny je vyžadováno schválení zdravotní pojišťovny.',
      ),
      array(
        'question' => 'Je nástavec na WC automaticky hrazený?',
        'answer'   => 'Ne. Zápraží neodvozuje úhradu jen z názvu kategorie. Pro konkrétní nástavec je potřeba ověřit přesný prostředek, jeho kód a aktuální úhradový záznam v seznamu SÚKL.',
      ),
    );
  } elseif ( zaprazi_2_is_bed_acquisition_page() ) {
    $faq = array(
      array(
        'question' => 'Hradí pojišťovna polohovací postel?',
        'answer'   => 'Může, pokud jsou splněny podmínky pro konkrétního člověka a konkrétní zdravotnický prostředek. VZP popisuje předpis lékařem a předchozí schválení pojišťovnou. Zápraží individuální nárok nepotvrzuje.',
      ),
      array(
        'question' => 'Může polohovací postel předepsat praktický lékař?',
        'answer'   => 'VZP mezi uvedenými odbornostmi zmiňuje také praktického lékaře. Samotný předpis ale nestačí: u popsané cesty je potřeba předchozí schválení zdravotní pojišťovnou.',
      ),
      array(
        'question' => 'Kolik stojí půjčení elektrické polohovací postele?',
        'answer'   => 'Ve veřejných cenících ověřených 7. 10. 2026 jsme našli například 750 Kč za měsíc, 900 Kč za měsíc nebo 40 Kč za den. K ceně se může přidat kauce, doprava, montáž nebo jednorázový poplatek.',
      ),
      array(
        'question' => 'Je lepší postel půjčit, nebo koupit?',
        'answer'   => 'U krátkodobé nebo nejisté potřeby bývá rozumné nejdřív prověřit půjčení. U dlouhodobé potřeby má smysl nejdřív prověřit pojišťovnu a teprve potom porovnat přímý nákup. Vždy musí sedět technické parametry konkrétní postele.',
      ),
      array(
        'question' => 'Dostanu od pojišťovny novou postel?',
        'answer'   => 'Ne nutně. VZP popisuje možnost cirkulace, kdy postel zůstává ve vlastnictví pojišťovny a pojištěnci je zapůjčena; může proto jít i o repasované lůžko.',
      ),
    );
  } elseif ( zaprazi_2_is_wheelchair_acquisition_page() ) {
    $faq = array(
      array(
        'question' => 'Hradí pojišťovna mechanický invalidní vozík?',
        'answer'   => 'Může, pokud jsou splněny zákonné indikační podmínky a schvalovací postup. VZP uvádí, že žádost často řeší praktický lékař nebo příslušný specialista. Zápraží individuální nárok nepotvrzuje.',
      ),
      array(
        'question' => 'Dostanu hrazený vozík do vlastnictví?',
        'answer'   => 'Ne nutně. VZP uvádí, že většina invalidních vozíků zůstává majetkem zdravotní pojišťovny a pacientovi je zapůjčena.',
      ),
      array(
        'question' => 'Kolik stojí půjčení mechanického invalidního vozíku?',
        'answer'   => 'Ve veřejných cenících ověřených 7. 10. 2026 jsme našli například 300 Kč, 360 Kč nebo 420 Kč za měsíc. Ceny, zálohy a dostupnost se liší podle půjčovny.',
      ),
      array(
        'question' => 'Je elektrický vozík na pojišťovnu složitější?',
        'answer'   => 'Ano. VZP u žádosti o elektrický vozík uvádí další podklady včetně zaměřovacího protokolu s datem a podpisem pacienta a technika.',
      ),
      array(
        'question' => 'Mohu si nejdřív koupit vozík a potom chtít proplacení?',
        'answer'   => 'Na takový postup se nespoléhejte. Retail nákup a hrazená cesta přes předpis, schválení a výdej zdravotnického prostředku jsou odlišné procesy.',
      ),
    );
  } elseif ( zaprazi_2_is_adl_page() ) {
    $faq = array(
      array(
        'question' => 'Jak vybrat pomůcku pro soběstačnost seniora?',
        'answer'   => 'Začněte konkrétní činností, která je obtížná: pití, stabilizace nádoby, jídlo jednou rukou nebo otevírání běžného obalu. Zápraží nevybírá podle věku nebo diagnózy, ale podle praktického úkonu a ověřitelných podmínek použití.',
      ),
      array(
        'question' => 'Co může pomoci při jídle jednou rukou?',
        'answer'   => 'Pokud je hlavní problém opravdu obsluha jídla jednou rukou, může dávat smysl stabilní multifunkční podnos. Před nákupem je potřeba ověřit pracovní plochu a zda pomůcka řeší konkrétní činnost, která doma omezuje samostatnost.',
      ),
      array(
        'question' => 'Co dělat, když se člověk při pití zakuckává nebo má problém polykat?',
        'answer'   => 'To už není běžný problém s úchopem nádoby. Zápraží v této větvi konkrétní produkt nedoporučí. Poruchu polykání je potřeba odborně posoudit; NZIP uvádí, že příčiny dysfagie má objasnit lékař.',
      ),
      array(
        'question' => 'Existuje pomůcka na otevírání lahví a obalů při slabším úchopu?',
        'answer'   => 'Ano, existují multifunkční otevírací pomůcky pro běžné uzávěry, jazýčky plechovek, zipy a obaly. Zápraží tuto větev používá pouze pro praktický úkon otevírání a neposkytuje rady k výběru, dávkování ani bezpečnosti léků.',
      ),
    );
  } elseif ( zaprazi_2_is_compensatory_aids_page() ) {
    $faq = array(
      array(
        'question' => 'Co jsou kompenzační pomůcky pro seniory?',
        'answer'   => 'Jsou to pomůcky, které pomáhají podpořit omezenou schopnost zvládat konkrétní každodenní činnost, například chůzi, přesun, hygienu, sezení, ležení nebo sebeobsluhu. Prakticky je důležitější konkrétní problém než samotný název kategorie.',
      ),
      array(
        'question' => 'Jak vybrat správnou kompenzační pomůcku?',
        'answer'   => 'Začněte konkrétním úkonem, prostředím a rozměry. Teprve potom vybírejte typ pomůcky a konkrétní výrobek. Zápraží proto nejprve rozděluje situaci a až následně vede k vhodnému dalšímu kroku.',
      ),
      array(
        'question' => 'Hradí kompenzační pomůcky zdravotní pojišťovna?',
        'answer'   => 'Některé ano, ale ne automaticky. Záleží na konkrétním zdravotnickém prostředku, indikačních a úhradových podmínkách, předpisu a někdy i předchozím schválení pojišťovny. Maloobchodní produkt nelze považovat za hrazený jen podle názvu kategorie.',
      ),
      array(
        'question' => 'Znamená ePoukaz automaticky, že pomůcku pojišťovna zaplatí?',
        'answer'   => 'Ne. SÚKL uvádí, že zavedení ePoukazu nemá vliv na výši cen ani úhrad. ePoukaz je způsob elektronického předpisu a výdeje, nikoli automatické potvrzení nároku na úhradu.',
      ),
      array(
        'question' => 'Je lepší pomůcku půjčit, nebo koupit?',
        'answer'   => 'U krátkodobé nebo nejisté potřeby může být půjčení praktičtější. U dlouhodobé potřeby je rozumné nejdřív prověřit pojišťovnu a pak porovnat přímý nákup. Vždy ale musí sedět typ a technické parametry pomůcky.',
      ),
    );
  } elseif ( zaprazi_2_is_safe_home_page() ) {
    $faq = array(
      array(
        'question' => 'Co upravit v bytě pro seniora jako první?',
        'answer'   => 'Začněte trasami, které používá denně: vstup, postel k WC a koupelna. Odstraňte překážky na zemi, ověřte osvětlení a sledujte, kde se člověk přidržuje nábytku nebo potřebuje pomoc.',
      ),
      array(
        'question' => 'Jak snížit riziko pádu doma?',
        'answer'   => 'NZIP doporučuje mimo jiné odstranit překážky a volné kabely, použít protiskluzové prvky v koupelně, zajistit dostatečné osvětlení a podle potřeby používat vhodnou pomůcku při chůzi.',
      ),
      array(
        'question' => 'Je lepší přidat madla, nebo koupit chodítko?',
        'answer'   => 'Řeší jiný problém. Madlo pomáhá v konkrétním místě, zatímco chodítko poskytuje oporu při pohybu. Nejprve zjistěte, kdy a kde člověk oporu skutečně potřebuje.',
      ),
      array(
        'question' => 'Kdy má smysl polohovací postel?',
        'answer'   => 'Pokud je problém s bezpečným vstáváním, polohováním nebo péčí u lůžka, má smysl prověřit technické požadavky a způsob pořízení. Samotný věk není důvodem pro výběr polohovací postele.',
      ),
      array(
        'question' => 'Co řešit před návratem seniora z nemocnice?',
        'answer'   => 'Nejdřív bezpečný vstup, přesun, toaletu, postel a návaznou péči. Zápraží má pro první noc doma samostatný plán, aby rodina nezačínala náhodným nákupním seznamem.',
      ),
    );
  }

  if ( ! $faq ) {
    return;
  }

  $schema = array(
    '@context'   => 'https://schema.org',
    '@type'      => 'FAQPage',
    'mainEntity' => array_map(
      static function ( $item ) {
        return array(
          '@type'          => 'Question',
          'name'           => $item['question'],
          'acceptedAnswer' => array(
            '@type' => 'Answer',
            'text'  => $item['answer'],
          ),
        );
      },
      $faq
    ),
  );

  echo '<script type="application/ld+json" data-zaprazi-schema="resource-faq">' .
    wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) .
    '</script>' . "\n";
}
add_action( 'wp_head', 'zaprazi_2_resource_faq_schema', 7 );


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
    $data['name'] = 'Zápraží';
    $data['description'] = 'Bezpečně a samostatně doma.';
  }
  return $data;
}
add_filter( 'wpseo_schema_website', 'zaprazi_2_wpseo_schema_website', 20 );

function zaprazi_2_wpseo_og_site_name( $name ) {
  return 'Zápraží';
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
 * Create high-intent Zápraží resource pages once, without overwriting existing content.
 */
function zaprazi_2_ensure_resource_pages() {
  if ( '1' === get_option( 'zaprazi_resource_pages_v15' ) ) {
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
      'excerpt'  => 'Jak Zápraží pracuje s odpověďmi z poradce, volitelným Google Analytics a nastavením souhlasu.',
      'template' => 'page-ochrana-soukromi.php',
    ),
    'koupelna-a-wc' => array(
      'title'    => 'Koupelna a WC: bezpečnější řešení doma',
      'excerpt'  => 'Praktický poradce pro zvýšení WC, opory, toaletní a sprchovací židle a bezpečné rozhodnutí mezi koupí, půjčením a hrazenou alternativou.',
      'template' => 'page-koupelna-a-wc.php',
    ),
    'pomucky-do-koupelny-na-pojistovnu' => array(
      'title'    => 'Pomůcky do koupelny a na WC na pojišťovnu 2026',
      'excerpt'  => 'Které koupelnové a toaletní pomůcky mohou být hrazené, kdy je potřeba schválení pojišťovny a jak ověřit aktuální seznam SÚKL.',
      'template' => 'page-pomucky-do-koupelny-na-pojistovnu.php',
    ),
    'polohovaci-postel' => array(
      'title'    => 'Polohovací postel: koupit, půjčit nebo řešit pojišťovnu',
      'excerpt'  => 'Praktický poradce pro výběr elektrické polohovací postele a rozhodnutí mezi koupí, půjčením a prověřením úhrady.',
      'template' => 'page-polohovaci-postel.php',
    ),
    'polohovaci-postel-na-pojistovnu' => array(
      'title'    => 'Polohovací postel na pojišťovnu 2026: půjčit, koupit nebo řešit úhradu',
      'excerpt'  => 'Praktické porovnání pojišťovny, půjčovny a přímého nákupu polohovací postele včetně aktuálních příkladů cen.',
      'template' => 'page-polohovaci-postel-na-pojistovnu.php',
    ),
    'invalidni-vozik' => array(
      'title'    => 'Invalidní vozík: jak vybrat vhodný typ',
      'excerpt'  => 'Praktický poradce pro mechanický nebo elektrický invalidní vozík podle způsobu pohonu, rozměrů, nosnosti a způsobu pořízení.',
      'template' => 'page-invalidni-vozik.php',
    ),
    'invalidni-vozik-na-pojistovnu' => array(
      'title'    => 'Invalidní vozík na pojišťovnu 2026: půjčit, koupit nebo řešit úhradu',
      'excerpt'  => 'Praktické porovnání pojišťovny, půjčovny a přímého nákupu mechanického nebo elektrického invalidního vozíku.',
      'template' => 'page-invalidni-vozik-na-pojistovnu.php',
    ),
    'navrat-z-nemocnice' => array(
      'title'    => 'Návrat z nemocnice domů: co připravit první noc',
      'excerpt'  => 'Praktický plán bezpečného návratu domů: vstup, přesuny, chůze, WC, postel, koupelna a návazná domácí péče.',
      'template' => 'page-navrat-z-nemocnice.php',
    ),
    'sobestacnost' => array(
      'title'    => 'Pomůcky pro soběstačnost: pití a jídlo jednou rukou',
      'excerpt'  => 'Praktický poradce pro samostatné pití, stabilizaci nádoby a přípravu jednoduchého jídla jednou rukou.',
      'template' => 'page-sobestacnost.php',
    ),
    'kompenzacni-pomucky-pro-seniory' => array(
      'title'    => 'Kompenzační pomůcky pro seniory: jak vybrat podle situace',
      'excerpt'  => 'Praktický rozcestník pro chůzi, koupelnu a WC, polohovací postel, invalidní vozík, návrat z nemocnice a každodenní soběstačnost.',
      'template' => 'page-kompenzacni-pomucky-pro-seniory.php',
    ),
    'bezpecny-byt-pro-seniora' => array(
      'title'    => 'Jak upravit byt pro seniora: bezpečný domov krok za krokem',
      'excerpt'  => 'Praktický audit vstupu, cesty z postele na WC, koupelny, osvětlení, překážek a návazných pomůcek.',
      'template' => 'page-bezpecny-byt-pro-seniora.php',
    ),
    'obuv-pro-seniory' => array(
      'title'    => 'Boty pro seniory na suchý zip: jak vybrat širší a snadno obouvatelnou obuv',
      'excerpt'  => 'Praktický poradce podle otevření boty, šířky, špičky, ovládání suchého zipu a změřené velikosti.',
      'template' => 'page-obuv-pro-seniory.php',
    ),
    'nastavec-na-wc-pro-seniory' => array(
      'title'    => 'Nástavec na WC pro seniory: jak vybrat výšku a madla',
      'excerpt'  => 'Praktický poradce pro výběr nástavce podle přesunu, kompatibility WC, výsledné výšky, nosnosti a potřeby madel.',
      'template' => 'page-nastavec-na-wc-pro-seniory.php',
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
    update_option( 'zaprazi_resource_pages_v15', '1', false );
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

function zaprazi_2_is_bathroom_insurance_page() {
  return is_page( 'pomucky-do-koupelny-na-pojistovnu' );
}

function zaprazi_2_is_bed_acquisition_page() {
  return is_page( 'polohovaci-postel-na-pojistovnu' );
}

function zaprazi_2_is_wheelchair_acquisition_page() {
  return is_page( 'invalidni-vozik-na-pojistovnu' );
}

function zaprazi_2_resource_title( $title ) {
  if ( zaprazi_2_is_insurance_walker_page() ) {
    return 'Chodítko na pojišťovnu 2026: ePoukaz, úhrada a postup | Zápraží';
  }

  if ( zaprazi_2_is_rental_walker_page() ) {
    return 'Půjčení chodítka a rollátoru 2026: ceny a kdy se vyplatí | Zápraží';
  }

  if ( zaprazi_2_is_privacy_page() ) {
    return 'Ochrana soukromí a měření návštěvnosti | Zápraží';
  }

  if ( zaprazi_2_is_bathroom_insurance_page() ) {
    return 'Pomůcky do koupelny a na WC na pojišťovnu 2026 | Zápraží';
  }

  if ( zaprazi_2_is_bed_acquisition_page() ) {
    return 'Polohovací postel na pojišťovnu 2026: půjčit nebo koupit | Zápraží';
  }

  if ( zaprazi_2_is_wheelchair_acquisition_page() ) {
    return 'Invalidní vozík na pojišťovnu 2026: půjčit nebo koupit | Zápraží';
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
    return 'Jak Zápraží chrání odpovědi z Domácího poradce a kdy se načítá volitelné Google Analytics. Souhlas s měřením lze kdykoli změnit.';
  }

  if ( zaprazi_2_is_bathroom_insurance_page() ) {
    return 'Pomůcky do koupelny a na WC na pojišťovnu v roce 2026: které skupiny VZP uvádí, kdy je potřeba schválení a jak ověřit aktuální seznam SÚKL.';
  }

  if ( zaprazi_2_is_bed_acquisition_page() ) {
    return 'Polohovací postel 2026: jak funguje pojišťovna a cirkulace, kolik stojí aktuální půjčovny a kdy dává smysl přímý nákup.';
  }

  if ( zaprazi_2_is_wheelchair_acquisition_page() ) {
    return 'Invalidní vozík 2026: jak funguje pojišťovna a cirkulace, aktuální příklady půjčovného a kdy dává smysl přímý nákup.';
  }

  return $description;
}
add_filter( 'wpseo_metadesc', 'zaprazi_2_resource_description', 30 );
