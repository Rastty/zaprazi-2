import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("theme keeps WooCommerce compatibility and legacy external-link guard", () => {
  const functions = read("functions.php");
  const woo = read("woocommerce.php");
  const external = read("woocommerce/single-product/add-to-cart/external.php");

  assert.match(functions, /add_theme_support\('woocommerce'\)/);
  assert.match(woo, /woocommerce_content\(\)/);
  assert.match(functions, /zaprazi_2_is_broken_legacy_external_url/);
  assert.match(functions, /nazev-webu-affilbox/);
  assert.match(external, /Původní nabídka se ověřuje/);
  assert.match(external, /nazev-webu-affilbox/);
});

test("theme preserves low-prominence legacy crawl paths", () => {
  const footer = read("footer.php");

  assert.match(footer, /Starší archiv/);
  assert.match(footer, /get_categories/);
  assert.match(footer, /wc_get_page_permalink/);
  assert.match(footer, /Starší katalog produktů/);
});

test("public SEO brand is Zápraží while database mutation stays unnecessary", () => {
  const functions = read("functions.php");

  assert.match(functions, /wpseo_schema_website/);
  assert.match(functions, /wpseo_opengraph_site_name/);
  assert.match(functions, /Zápraží/);
  assert.doesNotMatch(functions, /update_option\(\s*['"]blogname/);
});

test("Advisor cannot fall back to native answer submission", () => {
  const front = read("front-page.php");
  const app = read("assets/js/mobility-advisor.js");

  assert.doesNotMatch(front, /<form[^>]+id=["']zp-mobility-advisor/);
  assert.match(front, /id=["']zp-mobility-advisor["'][^>]+role=["']form/);
  assert.doesNotMatch(app, /new FormData/);
});


test("legacy post rendering strips only invalid nested document wrappers", () => {
  const functions = read("functions.php");

  assert.match(functions, /zaprazi_2_sanitize_legacy_document_markup/);
  assert.match(functions, /is_singular\( 'post' \)/);
  assert.match(functions, /<!doctype/);
  assert.match(functions, /<head/);
  assert.ok(functions.includes("$content = preg_replace( '/<\\/?html"));
  assert.ok(functions.includes("$content = preg_replace( '/<\\/?body"));
  assert.match(functions, /add_filter\( 'the_content', 'zaprazi_2_sanitize_legacy_document_markup', 3 \)/);
  assert.doesNotMatch(functions, /wp_update_post\([^;]+zaprazi_2_sanitize_legacy_document_markup/s);
});


test("Advisor analytics remain local until a consent-aware adapter is installed", () => {
  const app = read("assets/js/mobility-advisor.js");

  assert.match(app, /zaprazi:analytics/);
  assert.match(app, /CustomEvent/);
  assert.doesNotMatch(app, /window\.gtag/);
  assert.doesNotMatch(app, /gtag\(/);
});


test("Advisor has explicit accessible validation for required visible groups", () => {
  const front = read("front-page.php");
  const app = read("assets/js/mobility-advisor.js");

  assert.match(front, /id=["']zp-advisor-errors["']/);
  assert.match(front, /role=["']alert["']/);
  assert.match(front, /data-zp-required-group=["']environment["']/);
  assert.match(front, /data-zp-required-group=["']supportNeed["']/);
  assert.match(front, /data-zp-required-group=["']canLiftWalker["']/);
  assert.match(front, /data-zp-required-group=["']handBrakes["']/);

  assert.match(app, /validateRequiredGroups/);
  assert.match(app, /aria-invalid/);
  assert.match(app, /firstMissing\.focus\(\)/);
  assert.match(app, /if \(!validateRequiredGroups\(\)\)/);
});


test("all primary theme surfaces expose the global skip-link target", () => {
  const header = read("header.php");
  assert.match(header, /href=["']#main-content["']/);
  assert.match(header, /Přeskočit na hlavní obsah/);

  for (const path of [
    "front-page.php",
    "page-koupelna-a-wc.php",
    "page-polohovaci-postel.php",
    "page-invalidni-vozik.php",
    "page-navrat-z-nemocnice.php",
    "single.php",
    "page.php",
    "index.php",
    "archive.php",
    "search.php",
    "404.php",
    "woocommerce.php"
  ]) {
    const template = read(path);
    assert.match(template, /<main[^>]+id=["']main-content["']/);
    assert.match(template, /tabindex=["']-1["']/);
  }
});


test("Advisor renders freshness-aware evidence states", () => {
  const app = read("assets/js/mobility-advisor.js");
  const acquisition = read("src/mobility/acquisition.js");

  assert.match(app, /EVIDENCE_FRESHNESS_DAYS/);
  assert.match(app, /zp-stale-evidence/);
  assert.match(app, /displayPricing/);
  assert.match(app, /displayMessage/);
  assert.match(acquisition, /freshnessStatus/);
});


test("404 and search use dedicated user-facing templates", () => {
  const notFound = read("404.php");
  const search = read("search.php");

  assert.match(notFound, /Tahle stránka tu není/);
  assert.match(notFound, /#poradce/);
  assert.match(search, /get_search_query/);
  assert.match(search, /have_posts/);
  assert.match(search, /Domácí poradce/);
});


test("legacy sanitizer prefers the original prefix over appended generated documents", () => {
  const functions = read("functions.php");

  assert.match(functions, /doctype_position/);
  assert.match(functions, /looks_like_appended_document/);
  assert.match(functions, /wp_strip_all_tags/);
  assert.match(functions, /strlen\( \$prefix_text \) >= 40/);
  assert.match(functions, /return rtrim\( \$prefix \)/);
});


test("insurance-walker resource page is created once and never overwrites existing content", () => {
  const functions = read("functions.php");
  const page = read("page-choditko-na-pojistovnu.php");
  const front = read("front-page.php");

  assert.match(functions, /zaprazi_2_ensure_resource_pages/);
  assert.match(functions, /'choditko-na-pojistovnu' => array/);
  assert.match(functions, /get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(functions, /wp_insert_post/);
  assert.doesNotMatch(functions, /wp_update_post\(/);
  assert.match(functions, /'_wp_page_template' => \$page\['template'\]/);
  assert.match(functions, /'template' => 'page-choditko-na-pojistovnu\.php'/);
  assert.match(functions, /Chodítko na pojišťovnu 2026: ePoukaz, úhrada a postup/);
  assert.match(page, /Kód SÚKL/);
  assert.match(page, /3 408 Kč/);
  assert.match(page, /31\. 10\. 2026/);
  assert.match(page, /individuální nárok/i);
  assert.match(front, /\/choditko-na-pojistovnu\//);
});


test("insurance resource page fails closed after the verified SÚKL month expires", () => {
  const page = read("page-choditko-na-pojistovnu.php");

  assert.match(page, /\$zp_sukl_valid_through = '2026-10-31'/);
  assert.match(page, /current_time\( 'Y-m-d' \)/);
  assert.match(page, /\$zp_sukl_is_current/);
  assert.match(page, /Říjnový záznam už není aktuální/);
  assert.match(page, /historický údaj z října 2026/i);
});


test("resource registry creates insurance and rental pages without overwriting content", () => {
  const functions = read("functions.php");
  const rental = read("page-pujceni-choditka.php");
  const insurance = read("page-choditko-na-pojistovnu.php");
  const front = read("front-page.php");

  assert.match(functions, /zaprazi_resource_pages_v21/);
  assert.match(functions, /get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(functions, /page-pujceni-choditka\.php/);
  assert.match(functions, /page-choditko-na-pojistovnu\.php/);
  assert.doesNotMatch(functions, /wp_update_post\(/);

  assert.match(rental, /12 Kč \/ den/);
  assert.match(rental, /360 Kč/);
  assert.match(rental, /600 Kč/);
  assert.match(rental, /1 000 Kč/);
  assert.match(rental, /2026-11-06/);
  assert.match(rental, /historick/i);

  assert.match(insurance, /zpětně proplatit/i);
  assert.match(insurance, /1 kus za 5 let/i);
  assert.match(insurance, /praktický lékař/i);

  assert.match(front, /\/pujceni-choditka\//);
  assert.match(front, /\/choditko-na-pojistovnu\//);
});


test("core navigation links mobility, central insurance hub and rental guidance", () => {
  const header = read("header.php");
  const footer = read("footer.php");
  const front = read("front-page.php");
  const insuranceWalker = read("page-choditko-na-pojistovnu.php");
  const style = read("style.css");

  assert.match(header, /aria-label=["']Hlavní navigace["']/);
  assert.match(header, /\/choditka-pro-seniory\//);
  assert.match(header, /\/kompenzacni-pomucky-pro-seniory\/#pojistovna/);
  assert.match(header, />Pojišťovna<\/a>/);
  assert.doesNotMatch(header, /home_url\( '\/choditko-na-pojistovnu\/' \).*?>Pojišťovna/);
  assert.match(header, /\/pujceni-choditka\//);

  assert.match(footer, /\/kompenzacni-pomucky-pro-seniory\/#pojistovna/);
  assert.match(front, /Pomůcky na pojišťovnu/);
  assert.match(front, /\/kompenzacni-pomucky-pro-seniory\/#pojistovna/);
  assert.match(insuranceWalker, /Nejdřív vybrat vhodný typ/);
  assert.match(insuranceWalker, /\/choditka-pro-seniory\//);

  assert.match(style, /\.zp-core-nav/);
  assert.match(style, /overflow-x:auto/);
  assert.match(style, /min-height:44px/);
});


test("GA4 loads only after explicit consent and receives only whitelisted generic events", () => {
  const functions = read("functions.php");
  const footer = read("footer.php");
  const analytics = read("assets/js/analytics-consent.js");
  const advisor = read("assets/js/mobility-advisor.js");

  assert.match(functions, /G-WM86QVXVST/);
  assert.match(functions, /assets\/js\/analytics-consent\.js/);

  assert.match(footer, /id=["']zp-analytics-allow["']/);
  assert.match(footer, /id=["']zp-analytics-deny["']/);
  assert.match(footer, /id=["']zp-analytics-settings["']/);
  assert.match(footer, /Neodesíláme odpovědi z poradce/);

  assert.match(analytics, /state !== "granted"/);
  assert.match(analytics, /state === "granted"/);
  assert.match(analytics, /googletagmanager\.com\/gtag\/js/);
  assert.match(analytics, /builder_start/);
  assert.match(analytics, /builder_complete/);
  assert.match(analytics, /recommendation_view/);
  assert.match(analytics, /product_click/);
  assert.match(analytics, /merchant_click/);
  assert.match(analytics, /allowedEvents\.has/);
  assert.match(analytics, /allow_google_signals: false/);
  assert.match(analytics, /allow_ad_personalization_signals: false/);
  assert.match(analytics, /clearGaCookies/);

  assert.doesNotMatch(analytics, /supportNeed/);
  assert.doesNotMatch(analytics, /environment/);
  assert.doesNotMatch(analytics, /canLiftWalker/);
  assert.doesNotMatch(analytics, /handBrakes/);
  assert.doesNotMatch(advisor, /gtag\(/);
});


test("privacy page transparently documents strict opt-in analytics without Advisor answers", () => {
  const functions = read("functions.php");
  const footer = read("footer.php");
  const privacy = read("page-ochrana-soukromi.php");

  assert.match(functions, /zaprazi_resource_pages_v21/);
  assert.match(functions, /'ochrana-soukromi' => array/);
  assert.match(functions, /page-ochrana-soukromi\.php/);
  assert.doesNotMatch(functions, /wp_update_post\(/);

  assert.match(footer, /\/ochrana-soukromi\//);
  assert.match(footer, /Podrobnosti/);

  assert.match(privacy, /Google Analytics se nenačte, dokud ho nepovolíte/);
  assert.match(privacy, /Odpovědi neposíláme do analytiky/);
  assert.match(privacy, /builder_start/);
  assert.match(privacy, /merchant_click/);
  assert.match(privacy, /zaprazi_analytics_consent_v1/);
  assert.match(privacy, /_ga/);
  assert.match(privacy, /Google Signals/);
  assert.match(privacy, /personalizaci reklam/);
});


test("return-home page builds SEO authority without duplicating downstream decision engines", () => {
  const functions = read("functions.php");
  const page = read("page-navrat-z-nemocnice.php");

  assert.match(page, /Návrat z nemocnice domů/);
  assert.ok(functions.includes("Návrat z nemocnice domů: co zařídit po propuštění | Zápraží"));

  for (const question of [
    "Co je potřeba zařídit před návratem z nemocnice domů?",
    "Jaké pomůcky mohou být potřeba po propuštění z nemocnice?",
    "Co musí fungovat první noc doma?",
    "Kdy řešit domácí zdravotní péči?",
    "Je lepší pomůcku půjčit, koupit, nebo řešit přes pojišťovnu?"
  ]) {
    assert.ok(page.includes(question), `visible FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `FAQ schema missing: ${question}`);
  }

  assert.equal((page.match(/id=["']zp-return-home-advisor["']/g) || []).length, 1);
  assert.match(functions, /assets\/js\/return-home-advisor\.js/);

  for (const path of [
    "/choditka-pro-seniory/",
    "/koupelna-a-wc/",
    "/polohovaci-postel/",
    "/invalidni-vozik/",
    "/kompenzacni-pomucky-pro-seniory/"
  ]) {
    assert.ok(page.includes(path), `return-home routing link missing: ${path}`);
  }
});


test("footwear main page builds SEO authority without a second decision engine", () => {
  const functions = read("functions.php");
  const page = read("page-obuv-pro-seniory.php");

  assert.match(page, /Obuv pro seniory/);
  assert.ok(functions.includes("Obuv pro seniory: široké boty na suchý zip | Zápraží"));

  for (const question of [
    "Jak vybrat obuv pro seniora?",
    "Jsou boty na suchý zip pro seniory vždy nejlepší?",
    "Jak vybrat boty pro širokou nebo objemnější nohu?",
    "Je lepší otevřená, nebo uzavřená špička?",
    "Kdy nestačí jen koupit širší botu?"
  ]) {
    assert.ok(page.includes(question), `visible FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `FAQ schema missing: ${question}`);
  }

  assert.equal((page.match(/id=["']zp-footwear-advisor["']/g) || []).length, 1);
  assert.match(functions, /assets\/js\/footwear-advisor\.js/);
  assert.match(page, /\/bezpecny-byt-pro-seniora\//);
  assert.match(page, /\/kompenzacni-pomucky-pro-seniory\//);
});


test("bathroom main page builds SEO authority without a second decision engine", () => {
  const functions = read("functions.php");
  const page = read("page-koupelna-a-wc.php");

  assert.match(page, /Pomůcky do koupelny pro seniory/);
  assert.ok(functions.includes("Pomůcky do koupelny pro seniory: WC, sprcha a vana | Zápraží"));

  for (const question of [
    "Jaké pomůcky do koupelny pro seniory dávají nejčastěji smysl?",
    "Jak vybrat pomůcku k WC pro seniora?",
    "Je lepší sprchovací židle, nebo toaletní židle 4v1?",
    "Je do koupelny vždy lepší nástěnné madlo?",
    "Může být pomůcka do koupelny hrazená pojišťovnou?"
  ]) {
    assert.ok(page.includes(question), `visible FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `FAQ schema missing: ${question}`);
  }

  assert.equal((page.match(/id=["']zp-bathroom-advisor["']/g) || []).length, 1);
  assert.match(functions, /assets\/js\/bathroom-advisor\.js/);

  for (const path of [
    "/nastavec-na-wc-pro-seniory/",
    "/sprchovaci-zidle-pro-seniory/",
    "/toaletni-zidle-pro-seniory/",
    "/madlo-k-wc-pro-seniory/",
    "/sedatko-do-vany-pro-seniory/",
    "/pomucky-do-koupelny-na-pojistovnu/"
  ]) {
    assert.ok(page.includes(path), `bathroom authority link missing: ${path}`);
  }
});


test("bed main page builds SEO authority without a second decision engine", () => {
  const functions = read("functions.php");
  const page = read("page-polohovaci-postel.php");

  assert.match(page, /Polohovací postel pro seniory/);
  assert.ok(functions.includes("Polohovací postel pro seniory: elektrická a jak vybrat | Zápraží"));

  for (const question of [
    "Jak vybrat polohovací postel pro seniora?",
    "Je vždy potřeba elektrická polohovací postel?",
    "Jaké rozměry změřit před koupí polohovací postele?",
    "Jak ověřit nosnost polohovací postele?",
    "Je lepší polohovací postel půjčit, koupit, nebo řešit přes pojišťovnu?"
  ]) {
    assert.ok(page.includes(question), `visible FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `FAQ schema missing: ${question}`);
  }

  assert.equal((page.match(/id=["']zp-bed-advisor["']/g) || []).length, 1);
  assert.match(functions, /assets\/js\/bed-advisor\.js/);
  assert.match(page, /\/polohovaci-postel-na-pojistovnu\//);
  assert.match(page, /\/bezpecny-byt-pro-seniora\//);
  assert.match(page, /\/navrat-z-nemocnice\//);
});


test("wheelchair main page builds SEO authority without a second decision engine", () => {
  const functions = read("functions.php");
  const page = read("page-invalidni-vozik.php");

  assert.match(page, /Invalidní vozík pro seniory/);
  assert.ok(functions.includes("Invalidní vozík pro seniory: mechanický nebo elektrický | Zápraží"));
  assert.ok(functions.includes("šířky sedu, průchodů a nosnosti"));

  for (const question of [
    "Jak vybrat invalidní vozík pro seniora?",
    "Je lepší mechanický, nebo elektrický invalidní vozík?",
    "Jak poznat správnou šířku sedu a vozíku?",
    "Je lepší invalidní vozík půjčit, koupit, nebo řešit přes pojišťovnu?",
    "Kdy Zápraží nedoporučí konkrétní vozík?"
  ]) {
    assert.ok(page.includes(question), `visible FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `FAQ schema missing: ${question}`);
  }

  assert.equal((page.match(/id=["']zp-wheelchair-advisor["']/g) || []).length, 1);
  assert.match(functions, /assets\/js\/wheelchair-advisor\.js/);
  assert.match(page, /\/invalidni-vozik-na-pojistovnu\//);
  assert.match(page, /\/bezpecny-byt-pro-seniora\//);
  assert.match(page, /\/kompenzacni-pomucky-pro-seniory\//);
});


test("0.8.48 deployment integrity contract covers critical runtime files", () => {
  const functions = read("functions.php");
  const critical = [
    "header.php",
    "footer.php",
    "front-page.php",
    "page-choditko-na-pojistovnu.php",
    "page-pujceni-choditka.php",
    "page-ochrana-soukromi.php",
    "page-koupelna-a-wc.php",
    "page-pomucky-do-koupelny-na-pojistovnu.php",
    "page-polohovaci-postel.php",
    "page-polohovaci-postel-na-pojistovnu.php",
    "page-invalidni-vozik.php",
    "page-invalidni-vozik-na-pojistovnu.php",
    "page-navrat-z-nemocnice.php",
    "page-sobestacnost.php",
    "page-kompenzacni-pomucky-pro-seniory.php",
    "page-bezpecny-byt-pro-seniora.php",
    "page-obuv-pro-seniory.php",
    "page-nastavec-na-wc-pro-seniory.php",
    "page-sprchovaci-zidle-pro-seniory.php",
    "page-toaletni-zidle-pro-seniory.php",
    "page-madlo-k-wc-pro-seniory.php",
    "page-sedatko-do-vany-pro-seniory.php",
    "page-choditko-do-bytu-pro-seniory.php",
    "page-rollator-pro-seniory.php",
    "page-choditka-pro-seniory.php",
    "assets/js/analytics-consent.js",
    "assets/js/mobility-advisor.js",
    "assets/js/bathroom-advisor.js",
    "assets/js/bed-advisor.js",
    "assets/js/wheelchair-advisor.js",
    "assets/js/return-home-advisor.js",
    "assets/js/adl-advisor.js",
    "assets/js/footwear-advisor.js",
    "assets/js/toilet-riser-advisor.js",
    "assets/js/shower-chair-advisor.js",
    "assets/js/toilet-chair-advisor.js",
    "assets/js/toilet-support-advisor.js",
    "assets/js/bath-transfer-advisor.js",
    "assets/js/indoor-walker-advisor.js",
    "assets/js/rollator-advisor.js",
    "assets/js/runtime-config.js",
    "style.css"
  ];

  assert.ok(functions.includes("define( 'ZAPRAZI_RELEASE', '0.8.48' );"));
  assert.match(functions, /zaprazi_2_release_integrity_ok/);
  assert.match(functions, /zaprazi-integrity/);
  for (const path of critical) {
    assert.ok(functions.includes(path), `integrity list missing ${path}`);
    assert.match(read(path), /ZP_RELEASE_0_8_48/);
  }
  assert.ok(read("style.css").includes("Version: 0.8.48"));
});


test("commercial Advisor CTAs are clear, trustworthy and consistently tracked", () => {
  const commercialAdvisors = [
    "assets/js/adl-advisor.js",
    "assets/js/bath-transfer-advisor.js",
    "assets/js/bathroom-advisor.js",
    "assets/js/bed-advisor.js",
    "assets/js/footwear-advisor.js",
    "assets/js/indoor-walker-advisor.js",
    "assets/js/mobility-advisor.js",
    "assets/js/rollator-advisor.js",
    "assets/js/shower-chair-advisor.js",
    "assets/js/toilet-chair-advisor.js",
    "assets/js/toilet-riser-advisor.js",
    "assets/js/toilet-support-advisor.js",
    "assets/js/wheelchair-advisor.js"
  ];

  for (const path of commercialAdvisors) {
    const source = read(path);
    assert.ok(source.includes("Zobrazit cenu a dostupnost"), `affiliate CTA missing in ${path}`);
    assert.ok(source.includes("Zobrazit produkt a dostupnost"), `fallback CTA missing in ${path}`);
    assert.ok(source.includes("Výběr produktu se neřídí výší provize."), `commission-independence note missing in ${path}`);
    assert.doesNotMatch(source, /Přejít k obchodníkovi/);
    assert.doesNotMatch(source, /Zobrazit produkt u obchodníka/);
    assert.match(source, /nofollow sponsored/);
  }

  const indoor = read("assets/js/indoor-walker-advisor.js");
  const rollator = read("assets/js/rollator-advisor.js");
  for (const source of [indoor, rollator]) {
    assert.match(source, /product_click/);
    assert.match(source, /merchant_click/);
    assert.match(source, /addEventListener\("click"/);
  }

  const style = read("style.css");
  assert.match(style, /\.zp-affiliate-policy/);
});


test("affiliate deeplink workbench is network-aware and keeps RehaVita on eHUB", () => {
  const functions = read("functions.php");

  assert.match(functions, /zaprazi_2_affiliate_merchant_networks/);
  assert.match(functions, /zaprazi_2_affiliate_network_for_key/);
  assert.match(functions, /'unizdrav-cz' => array/);
  assert.match(functions, /CJ program 5654758/);
  assert.match(functions, /'rehavita-cz' => array/);
  assert.match(functions, /eHUB kampaň 18119967/);
  assert.doesNotMatch(functions, /RehaVita\.cz \(eHUB 18119967\)/);
  assert.match(functions, /RehaVita\.cz \(eHUB 18119967\)/);

  assert.match(functions, /Deeplink workbench/);
  assert.match(functions, /Kopírovat URL/);
  assert.match(functions, /zp-copy-affiliate-target/);
  assert.match(functions, /data-zp-copy-target/);
  assert.match(functions, /navigator\.clipboard/);

  assert.match(functions, /'network' => \$network\['network'\]/);
  assert.match(functions, /'program' => \$network\['program'\]/);
});


test("affiliate admin shows slice readiness without changing recommendation logic", () => {
  const functions = read("functions.php");
  const mobilityAdvisor = read("assets/js/mobility-advisor.js");
  const bathroomAdvisor = read("assets/js/bathroom-advisor.js");
  const bedAdvisor = read("assets/js/bed-advisor.js");

  assert.match(functions, /zaprazi_2_affiliate_groups/);
  assert.match(functions, /'label' => 'Mobility'/);
  assert.match(functions, /'label' => 'Koupelna a WC'/);
  assert.match(functions, /'label' => 'Polohovací postel'/);
  assert.match(functions, /\$readiness/);
  assert.match(functions, /Partnerský odkaz aktivní/);
  assert.match(functions, /Otestovat deeplink/);
  assert.match(functions, /Fallback/);
  assert.match(functions, /Affiliate readiness nemění doporučení/);

  assert.doesNotMatch(mobilityAdvisor, /commission/i);
  assert.doesNotMatch(mobilityAdvisor, /affiliate.*sort/i);
  assert.doesNotMatch(bathroomAdvisor, /commission/i);
  assert.doesNotMatch(bathroomAdvisor, /affiliate.*sort/i);
  assert.doesNotMatch(bedAdvisor, /commission/i);
  assert.doesNotMatch(bedAdvisor, /affiliate.*sort/i);
});


test("public affiliate readiness API exposes counts and missing canonical targets without tracking URLs", () => {
  const functions = read("functions.php");

  assert.match(functions, /zaprazi_2_affiliate_readiness_payload/);
  assert.match(functions, /register_rest_route/);
  assert.match(functions, /zaprazi\/v1/);
  assert.match(functions, /affiliate-readiness/);
  assert.match(functions, /configured_total/);
  assert.match(functions, /slot_total/);
  assert.match(functions, /'missing'/);
  assert.match(functions, /Cache-Control/);
  assert.match(functions, /no-store, max-age=0/);
  assert.match(functions, /permission_callback' => '__return_true'/);

  const payloadStart = functions.indexOf("function zaprazi_2_affiliate_readiness_payload()");
  const payloadEnd = functions.indexOf("function zaprazi_2_sanitize_affiliate_map", payloadStart);
  const payloadCode = functions.slice(payloadStart, payloadEnd);

  assert.doesNotMatch(payloadCode, /affiliate_url/i);
  assert.doesNotMatch(payloadCode, /tracking/i);
  assert.doesNotMatch(payloadCode, /supportNeed|environment|diagnosis|answer/i);
  assert.match(payloadCode, /zaprazi_2_affiliate_targets/);
  assert.match(payloadCode, /zaprazi_2_affiliate_fields/);
  assert.match(payloadCode, /zaprazi_2_affiliate_groups/);
  assert.match(payloadCode, /'network'/);
  assert.match(payloadCode, /'program'/);
});


test("WordPress admins are warned when release integrity is partial", () => {
  const functions = read("functions.php");

  assert.match(functions, /zaprazi_2_release_integrity_admin_notice/);
  assert.match(functions, /admin_notices/);
  assert.match(functions, /Zápraží deployment partial/);
  assert.match(functions, /zaprazi_2_release_integrity_ok\(\)/);
  assert.match(functions, /current_user_can\( 'manage_options' \)/);
});

test("homepage FAQ structured data mirrors visible Mobility FAQs", () => {
  const functions = read("functions.php");
  const front = read("front-page.php");

  assert.match(functions, /zaprazi_2_front_faq_schema/);
  assert.match(functions, /'@type'\s*=>\s*'FAQPage'/);
  assert.match(functions, /'@type'\s*=>\s*'Question'/);
  assert.match(functions, /'@type'\s*=>\s*'Answer'/);
  assert.match(functions, /data-zaprazi-schema="faq"/);

  for (const question of [
    "Jaké chodítko pro seniora do bytu?",
    "Jaké chodítko nebo rollátor na ven?",
    "Je lepší chodítko půjčit, nebo koupit?",
    "Hradí chodítko zdravotní pojišťovna?"
  ]) {
    assert.ok(functions.includes(question));
    assert.ok(front.includes(question));
  }

  assert.match(functions, /nepotvrzuje individuální nárok konkrétního člověka/);
  assert.doesNotMatch(functions, /FAQPage[\s\S]*provize/i);
});

test("affiliate admin exposes exact canonical targets for VIV/CJ deep-link generation", () => {
  const functions = read("functions.php");

  assert.match(functions, /zaprazi_2_affiliate_targets/);
  assert.match(functions, /Deep Link Generator/);
  assert.match(functions, /Tracking URL ručně neskládejte/);
  assert.match(functions, /Cílová URL pro Deep Link Generator/);
  assert.match(functions, /besco-ctyrbodove-choditko-skladaci/);
  assert.match(functions, /besco-dvoukolove-choditko-skladaci/);
  assert.match(functions, /meyra-ideal-rollator-ctyrkolove-choditko/);
  assert.match(functions, /zvysovac-wc-s-priklopem-unizdrav-15-cm/);
  assert.match(functions, /toaletni-opora/);
  assert.match(functions, /toaletni-zidle-vyskove-nastavitelna-unizdrav/);
  assert.match(functions, /sprchovaci-zidle-s-ruckami/);
  assert.match(functions, /protiskluzove-madlo-do-koupelny-a-toalety/);
  assert.match(functions, /Otevřít produkt/);
  assert.doesNotMatch(functions, /pid=\d+/i);
  assert.doesNotMatch(functions, /aid=\d+/i);
});

test("high-intent resource FAQ schema mirrors visible insurance and rental FAQs", () => {
  const functions = read("functions.php");
  const insurance = read("page-choditko-na-pojistovnu.php");
  const rental = read("page-pujceni-choditka.php");

  assert.match(functions, /zaprazi_2_resource_faq_schema/);
  assert.match(functions, /data-zaprazi-schema="resource-faq"/);
  assert.match(functions, /zaprazi_2_is_insurance_walker_page/);
  assert.match(functions, /zaprazi_2_is_rental_walker_page/);

  const insuranceQuestions = [
    "Je každé chodítko hrazené pojišťovnou?",
    "Musím mít od roku 2026 papírový poukaz?",
    "Mohu chodítko s ePoukazem koupit v libovolném e-shopu?",
    "Je úhrada 3 408 Kč u MEYRA Ideal garantovaná i v listopadu?"
  ];

  const rentalQuestions = [
    "Kolik stojí půjčení rollátoru na měsíc?",
    "Platí se při půjčení chodítka kauce?",
    "Vyplatí se půjčení po operaci?",
    "Mohu si půjčit chodítko, než vyřídím ePoukaz?"
  ];

  for (const question of insuranceQuestions) {
    assert.ok(functions.includes(question));
    assert.ok(insurance.includes(question));
  }

  for (const question of rentalQuestions) {
    assert.ok(functions.includes(question));
    assert.ok(rental.includes(question));
  }

  assert.match(functions, /nepovažuje za aktuální, dokud neověří nový měsíční seznam/);
  assert.match(functions, /Ceny a dostupnost se mohou změnit/);
});



test("Bathroom WC Advisor is a privacy-safe separate decision surface", () => {
  const page = read("page-koupelna-a-wc.php");
  const app = read("assets/js/bathroom-advisor.js");
  const functions = read("functions.php");

  assert.doesNotMatch(page, /<form[^>]+id=["']zp-bathroom-advisor/);
  assert.match(page, /id=["']zp-bathroom-advisor["'][^>]+role=["']form/);
  assert.match(page, /Neptá se na diagnózu/i);
  assert.match(page, /affiliate systém nedostává kombinaci odpovědí/i);
  assert.match(page, /data-zp-bath-required=["']primaryNeed["']/);
  assert.match(page, /data-zp-bath-required=["']transferAbility["']/);
  assert.match(page, /data-zp-bath-required=["']loadFit["']/);
  assert.match(page, /data-zp-bath-required=["']bathTransferIndependent["']/);
  assert.match(page, /data-zp-bath-required=["']bathFit["']/);

  assert.match(app, /recommendBathroom/);
  assert.match(app, /getBathroomProducts/);
  assert.match(app, /zaprazi:analytics/);
  assert.doesNotMatch(app, /gtag\(/);
  assert.doesNotMatch(app, /new FormData/);
  assert.doesNotMatch(app, /commission/i);

  assert.match(functions, /zaprazi_2_is_bathroom_page/);
  assert.match(functions, /assets\/js\/bathroom-advisor\.js/);
  assert.match(functions, /'koupelna-a-wc' => array/);
  assert.match(functions, /page-koupelna-a-wc\.php/);
});

test("Bathroom WC keeps high-support branches closed while allowing only gated independent bath transfer", () => {
  const page = read("page-koupelna-a-wc.php");
  const engine = read("src/bathroom/engine.js");

  assert.match(page, /běžně pomáhá druhá osoba/i);
  assert.match(page, /Jednoduchý samostatný přesun přes vanu/i);
  assert.match(page, /bez fyzické pomoci druhé osoby/i);
  assert.match(page, /41–65 cm/);
  assert.match(engine, /combined_shower_toilet/);
  assert.match(engine, /bathTransferIndependent/);
  assert.match(engine, /bathFit/);
  assert.match(engine, /besco-bs008/);
  assert.match(engine, /professional_check/);
});

test("Bathroom WC navigation is reachable from homepage and core navigation", () => {
  const front = read("front-page.php");
  const header = read("header.php");

  assert.match(front, /\/koupelna-a-wc\//);
  assert.match(front, /Řešit koupelnu a WC/);
  assert.match(header, /\/koupelna-a-wc\//);
  assert.match(header, /Koupelna a WC/);
});

test("Bathroom WC acquisition UI separates direct retail from reimbursement evidence", () => {
  const app = read("assets/js/bathroom-advisor.js");
  const engine = read("src/bathroom/engine.js");

  assert.match(engine, /check_reimbursement_alternative/);
  assert.match(engine, /není automaticky hrazený/);
  assert.match(app, /Aktuální seznam SÚKL/);
  assert.match(app, /Zdroj VZP/);
  assert.match(app, /sponsored/);
  assert.doesNotMatch(app, /hradí tento produkt/i);
});


test("Bathroom WC catalog affiliate keys have matching WordPress runtime slots", () => {
  const functions = read("functions.php");
  const catalog = read("src/bathroom/catalog.js");

  for (const key of [
    "unizdrav-cz:p2868",
    "unizdrav-cz:p2015",
    "unizdrav-cz:p2807",
    "unizdrav-cz:p2062",
    "unizdrav-cz:p2131",
    "rehabilitacni-pomucky-cz:besco-bs008",
    "rehabilitacni-pomucky-cz:besco-bs15",
    "drmax-cz:dma-eh-cmda",
    "unizdrav-cz:p2203"
  ]) {
    assert.ok(catalog.includes(key), `catalog missing ${key}`);
    assert.ok(functions.includes(key), `runtime affiliate slot missing ${key}`);
  }

  assert.doesNotMatch(functions, /unizdrav-cz:p2085/);
});


test("Bathroom reimbursement resource is created non-destructively and linked from the Advisor", () => {
  const functions = read("functions.php");
  const page = read("page-pomucky-do-koupelny-na-pojistovnu.php");
  const bathroom = read("page-koupelna-a-wc.php");
  const app = read("assets/js/bathroom-advisor.js");

  assert.match(functions, /'pomucky-do-koupelny-na-pojistovnu' => array/);
  assert.match(functions, /page-pomucky-do-koupelny-na-pojistovnu\.php/);
  assert.match(functions, /zaprazi_2_is_bathroom_insurance_page/);
  assert.doesNotMatch(functions, /wp_update_post\(/);

  assert.match(page, /Pomůcky do koupelny a na WC na pojišťovnu v roce 2026/);
  assert.match(page, /Zpracováno 29\. 9\. 2026/);
  assert.match(page, /1 kus za 10 let/);
  assert.match(page, /praktický lékař/);
  assert.match(page, /Affiliate produkt není automaticky hrazený produkt/);
  assert.match(page, /UNIZDRAV P2868/);
  assert.match(page, /UNIZDRAV P2131/);

  assert.match(bathroom, /\/pomucky-do-koupelny-na-pojistovnu\//);
  assert.match(app, /\/pomucky-do-koupelny-na-pojistovnu\//);
  assert.match(app, /Jak funguje úhrada koupelnových pomůcek/);
});

test("Bathroom reimbursement FAQ schema mirrors the visible FAQ", () => {
  const functions = read("functions.php");
  const page = read("page-pomucky-do-koupelny-na-pojistovnu.php");

  const questions = [
    "Hradí pojišťovna sprchovací nebo toaletní židli?",
    "Mohu si koupit pomůcku a potom požádat pojišťovnu o proplacení?",
    "Může pomůcku do koupelny předepsat praktický lékař?",
    "Je nástavec na WC automaticky hrazený?"
  ];

  for (const question of questions) {
    assert.ok(functions.includes(question), `FAQ schema missing ${question}`);
    assert.ok(page.includes(question), `visible FAQ missing ${question}`);
  }

  assert.match(functions, /zaprazi_2_is_bathroom_insurance_page/);
  assert.match(functions, /data-zaprazi-schema="resource-faq"/);
});

test("Bathroom reimbursement copy does not claim current retail candidates are reimbursed", () => {
  const page = read("page-pomucky-do-koupelny-na-pojistovnu.php");
  const catalog = read("src/bathroom/catalog.js");

  assert.match(page, /vedeme zatím jen jako přímý nákup/);
  assert.match(page, /přesná identita prostředku/);
  assert.doesNotMatch(page, /P2868[^\n]{0,120}hrazen[ýá]/i);
  assert.doesNotMatch(page, /P2131[^\n]{0,120}hrazen[ýá]/i);
  assert.match(catalog, /affiliateKey: "unizdrav-cz:p2868"/);
});


test("Bathroom bath-transfer UI asks only practical safety and fit questions", () => {
  const page = read("page-koupelna-a-wc.php");
  const app = read("assets/js/bathroom-advisor.js");

  assert.match(page, /name=["']bathTransferIndependent["']/);
  assert.match(page, /name=["']bathFit["']/);
  assert.match(page, /41–65 cm/);
  assert.match(app, /bathTransferIndependent/);
  assert.match(app, /bathFit/);
  assert.match(app, /bath_transfer_seat/);
  assert.doesNotMatch(page, /diagn[oó]za[^<]{0,120}vana/i);
});


test("Bathroom raised-WC steadying branch has exact BS15 runtime routing", () => {
  const functions = read("functions.php");
  const catalog = read("src/bathroom/catalog.js");
  const engine = read("src/bathroom/engine.js");
  const app = read("assets/js/bathroom-advisor.js");

  assert.match(functions, /rehabilitacni-pomucky-cz:besco-bs15/);
  assert.match(functions, /besco-nastavec-na-wc-s-odnimatelnymi-madly/);
  assert.match(catalog, /raised_toilet_seat_with_arms/);
  assert.match(catalog, /besco-bs15/);
  assert.match(engine, /needsArmSupport/);
  assert.match(engine, /besco-bs15/);
  assert.match(app, /Nástavec na WC s madly/);
});


test("Bathroom multifunction WC/shower branch is wired to DrMax without overclaiming reimbursement", () => {
  const functions = read("functions.php");
  const page = read("page-koupelna-a-wc.php");
  const app = read("assets/js/bathroom-advisor.js");
  const catalog = read("src/bathroom/catalog.js");
  const engine = read("src/bathroom/engine.js");

  assert.match(page, /Jedna stabilní židle pro WC i sprchu/);
  assert.match(page, /multifunction_toilet_shower/);
  assert.match(app, /multifunction_toilet_shower_chair/);
  assert.match(engine, /multifunction_toilet_shower/);
  assert.match(engine, /dma-eh-cmda/);

  assert.match(catalog, /payerCode: "5019427"/);
  assert.match(catalog, /monthlySuklListVerified: false/);
  assert.match(catalog, /drmax-cz:dma-eh-cmda/);
  assert.match(functions, /drmax-cz:dma-eh-cmda/);
  assert.match(functions, /dma-eh-cmda-toaletni-zidle-4v1/);

  assert.doesNotMatch(page, /5019427[^\n]{0,120}aktuálně hrazen/i);
  assert.doesNotMatch(app, /5019427[^\n]{0,120}aktuálně hrazen/i);
});


test("Bathroom bath-transfer fallback shows bench question only after rim-seat mismatch", () => {
  const page = read("page-koupelna-a-wc.php");
  const app = read("assets/js/bathroom-advisor.js");
  const engine = read("src/bathroom/engine.js");
  const catalog = read("src/bathroom/catalog.js");
  const functions = read("functions.php");

  assert.match(page, /data-zp-bath-conditional=["']bath_bench["']/);
  assert.match(page, /name=["']bathBenchFit["']/);
  assert.match(page, /81 × 61 cm/);

  assert.match(app, /condition === "bath_bench"/);
  assert.match(app, /checkedValue\("bathFit", "unknown"\) === "no"/);
  assert.match(app, /bathBenchFit/);
  assert.match(app, /bath_transfer_bench/);

  assert.match(engine, /bathBenchFit/);
  assert.match(engine, /unizdrav-p2203/);
  assert.match(catalog, /unizdrav-p2203/);
  assert.match(catalog, /bath_transfer_bench/);
  assert.match(functions, /unizdrav-cz:p2203/);
  assert.match(functions, /sprchovaci-zidle-do-vany/);
});


test("Bathroom product cards expose guarded reimbursement identity without current-month overclaim", () => {
  const app = read("assets/js/bathroom-advisor.js");
  const catalog = read("src/bathroom/catalog.js");

  assert.match(app, /renderReimbursementEvidence/);
  assert.match(app, /Úhradová identita/);
  assert.match(app, /Aktuální seznam SÚKL: zatím neověřeno/);
  assert.match(app, /Kód prostředku/);
  assert.match(app, /Ověřit aktuální seznam SÚKL/);
  assert.match(app, /Neberte tuto kartu jako potvrzení nároku ani aktuální úhrady/);

  assert.match(catalog, /payerCode: "5019427"/);
  assert.match(catalog, /reimbursementGroup: "07\.04\.03\.01"/);
  assert.match(catalog, /monthlySuklListVerified: false/);

  assert.doesNotMatch(app, /5019427[^\n]{0,160}aktuálně hrazen/i);
  assert.doesNotMatch(app, /plně hrazeno/i);
});


test("Adjustable bed Advisor is a separate privacy-safe Slice 3 surface", () => {
  const page = read("page-polohovaci-postel.php");
  const app = read("assets/js/bed-advisor.js");
  const functions = read("functions.php");
  const engine = read("src/bed/engine.js");

  assert.doesNotMatch(page, /<form[^>]+id=["']zp-bed-advisor/);
  assert.match(page, /id=["']zp-bed-advisor["'][^>]+role=["']form/);
  assert.match(page, /Nepotřebujeme jméno, diagnózu ani přesnou hmotnost/i);
  assert.match(page, /affiliate systém nedostává kombinaci odpovědí/i);
  assert.match(page, /data-zp-bed-required=["']primaryNeed["']/);
  assert.match(page, /data-zp-bed-required=["']transferAbility["']/);
  assert.match(page, /data-zp-bed-required=["']loadFit["']/);
  assert.match(page, /data-zp-bed-required=["']spaceFit["']/);

  assert.match(app, /recommendAdjustableBed/);
  assert.match(app, /getAdjustableBedProducts/);
  assert.match(app, /zaprazi:analytics/);
  assert.doesNotMatch(app, /gtag\(/);
  assert.doesNotMatch(app, /new FormData/);
  assert.doesNotMatch(app, /commission/i);

  assert.match(engine, /rent_first/);
  assert.match(engine, /check_reimbursement_or_circulation/);
  assert.match(functions, /zaprazi_2_is_bed_page/);
  assert.match(functions, /assets\/js\/bed-advisor\.js/);
  assert.match(functions, /'polohovaci-postel' => array/);
  assert.match(functions, /page-polohovaci-postel\.php/);
});

test("Adjustable bed UI exposes exact branch fit facts without raw body-weight collection", () => {
  const page = read("page-polohovaci-postel.php");
  const app = read("assets/js/bed-advisor.js");

  assert.match(app, /178 kg/);
  assert.match(app, /250 kg/);
  assert.match(app, /260 kg/);
  assert.match(app, /102,5 × 212 cm/);
  assert.match(app, /105 × 214 cm/);
  assert.match(app, /96 × 212 cm/);
  assert.match(page, /Přesnou hmotnost člověka do poradce nezadávejte/i);
  assert.doesNotMatch(page, /name=["']weight/i);
});

test("Adjustable bed affiliate runtime slots match all production candidates", () => {
  const functions = read("functions.php");
  const catalog = read("src/bed/catalog.js");

  for (const key of [
    "unizdrav-cz:p2777",
    "unizdrav-cz:p4707",
    "unizdrav-cz:p4044"
  ]) {
    assert.ok(functions.includes(key), `runtime affiliate slot missing ${key}`);
    assert.ok(catalog.includes(key), `bed catalog missing ${key}`);
  }

  assert.match(functions, /'label' => 'Polohovací postel'/);
  assert.match(functions, /elektricka-polohovaci-postel-classic/);
  assert.match(functions, /elektricka-polohovaci-postel-hospital/);
  assert.match(functions, /elektricka-polohovaci-postel-s-matraci-multibed/);
});

test("Adjustable bed is reachable from homepage and core navigation", () => {
  const front = read("front-page.php");
  const header = read("header.php");

  assert.match(front, /\/polohovaci-postel\//);
  assert.match(front, /Řešit polohovací postel/);
  assert.match(header, /\/polohovaci-postel\//);
  assert.match(header, /Polohovací postel/);
});


test("Adjustable bed high-intent acquisition page separates insurer rental and retail paths", () => {
  const functions = read("functions.php");
  const page = read("page-polohovaci-postel-na-pojistovnu.php");
  const bed = read("page-polohovaci-postel.php");

  assert.match(functions, /zaprazi_resource_pages_v21/);
  assert.match(functions, /'polohovaci-postel-na-pojistovnu' => array/);
  assert.match(functions, /page-polohovaci-postel-na-pojistovnu\.php/);
  assert.match(functions, /zaprazi_2_is_bed_acquisition_page/);
  assert.doesNotMatch(functions, /wp_update_post\(/);

  assert.match(page, /Polohovací postel na pojišťovnu 2026/);
  assert.match(page, /max\. 1× za 10 let/);
  assert.match(page, /cirkulace/);
  assert.match(page, /750 Kč \/ měsíc/);
  assert.match(page, /900 Kč \/ měsíc/);
  assert.match(page, /40 Kč \/ den/);
  assert.match(page, /2 000 Kč/);
  assert.match(page, /600 Kč/);
  assert.match(page, /19 Kč\/km/);
  assert.match(page, /nepotvrzuje individuální nárok/i);
  assert.match(page, /Seznam zdravotnických prostředků hrazených na poukaz/);
  assert.match(page, /\/polohovaci-postel\/#poradce-postel/);

  assert.match(bed, /\/polohovaci-postel-na-pojistovnu\//);
});

test("Adjustable bed acquisition FAQ schema mirrors visible questions", () => {
  const functions = read("functions.php");
  const page = read("page-polohovaci-postel-na-pojistovnu.php");

  const questions = [
    "Hradí pojišťovna polohovací postel?",
    "Může polohovací postel předepsat praktický lékař?",
    "Kolik stojí půjčení elektrické polohovací postele?",
    "Je lepší postel půjčit, nebo koupit?",
    "Dostanu od pojišťovny novou postel?"
  ];

  for (const question of questions) {
    assert.ok(functions.includes(question), `FAQ schema missing: ${question}`);
    assert.ok(page.includes(question), `visible FAQ missing: ${question}`);
  }

  assert.match(functions, /zaprazi_2_is_bed_acquisition_page/);
  assert.match(functions, /data-zaprazi-schema="resource-faq"/);
});


test("Wheelchair Advisor is a separate privacy-safe Slice 4 surface", () => {
  const page = read("page-invalidni-vozik.php");
  const app = read("assets/js/wheelchair-advisor.js");
  const functions = read("functions.php");
  const engine = read("src/wheelchair/engine.js");

  assert.doesNotMatch(page, /<form[^>]+id=["']zp-wheelchair-advisor/);
  assert.match(page, /id=["']zp-wheelchair-advisor["'][^>]+role=["']form/);
  assert.match(page, /Nepotřebujeme jméno, diagnózu ani přesnou hmotnost/i);
  assert.match(page, /affiliate systém nedostává kombinaci odpovědí/i);
  assert.match(page, /data-zp-wheelchair-required=["']propulsion["']/);
  assert.match(page, /data-zp-wheelchair-required=["']transferAbility["']/);
  assert.match(page, /data-zp-wheelchair-required=["']seatFit["']/);
  assert.match(page, /data-zp-wheelchair-required=["']widthFit["']/);
  assert.match(page, /data-zp-wheelchair-required=["']loadFit["']/);
  assert.match(page, /data-zp-wheelchair-required=["']joystickSafe["']/);
  assert.match(page, /data-zp-wheelchair-required=["']chargingReady["']/);

  assert.match(app, /recommendWheelchair/);
  assert.match(app, /getWheelchairProducts/);
  assert.match(app, /zaprazi:analytics/);
  assert.doesNotMatch(app, /gtag\(/);
  assert.doesNotMatch(app, /new FormData/);
  assert.doesNotMatch(app, /commission/i);

  assert.match(engine, /rent_first/);
  assert.match(engine, /check_insurer/);
  assert.match(functions, /zaprazi_2_is_wheelchair_page/);
  assert.match(functions, /assets\/js\/wheelchair-advisor\.js/);
  assert.match(functions, /'invalidni-vozik' => array/);
  assert.match(functions, /page-invalidni-vozik\.php/);
});

test("Wheelchair UI exposes exact fit facts without raw body-weight collection", () => {
  const page = read("page-invalidni-vozik.php");
  const app = read("assets/js/wheelchair-advisor.js");

  assert.match(app, /sed 48 cm/);
  assert.match(app, /68 nebo 70 cm/);
  assert.match(app, /nosnost 135 kg/);
  assert.match(app, /62 kg/);
  assert.match(app, /86,5 cm/);
  assert.match(page, /Přesnou hmotnost člověka do poradce nezadávejte/i);
  assert.doesNotMatch(page, /name=["']weight/i);
});

test("Wheelchair affiliate runtime slots match all production candidates", () => {
  const functions = read("functions.php");
  const catalog = read("src/wheelchair/catalog.js");

  for (const key of [
    "unizdrav-cz:p4384",
    "unizdrav-cz:p3641",
    "unizdrav-cz:p2961"
  ]) {
    assert.ok(functions.includes(key), `runtime affiliate slot missing ${key}`);
    assert.ok(catalog.includes(key), `wheelchair catalog missing ${key}`);
  }

  assert.match(functions, /'label' => 'Invalidní vozík'/);
  assert.match(functions, /invalidni-vozik-unizdrav-basic/);
  assert.match(functions, /invalidni-vozik-odlehceny-s-brzdami-pro-doprovod/);
  assert.match(functions, /elektricky-invalidni-vozik-46-cm/);
});

test("Wheelchair is reachable from homepage and core navigation", () => {
  const front = read("front-page.php");
  const header = read("header.php");

  assert.match(front, /\/invalidni-vozik\//);
  assert.match(front, /Řešit invalidní vozík/);
  assert.match(header, /\/invalidni-vozik\//);
  assert.match(header, /Invalidní vozík/);
});


test("Wheelchair high-intent acquisition page separates insurer rental and retail paths", () => {
  const functions = read("functions.php");
  const page = read("page-invalidni-vozik-na-pojistovnu.php");
  const advisor = read("page-invalidni-vozik.php");

  assert.match(functions, /zaprazi_resource_pages_v21/);
  assert.match(functions, /'invalidni-vozik-na-pojistovnu' => array/);
  assert.match(functions, /page-invalidni-vozik-na-pojistovnu\.php/);
  assert.match(functions, /zaprazi_2_is_wheelchair_acquisition_page/);
  assert.doesNotMatch(functions, /wp_update_post\(/);

  assert.match(page, /Invalidní vozík na pojišťovnu 2026/);
  assert.match(page, /většina vozíků může zůstat majetkem pojišťovny/i);
  assert.match(page, /zaměřovací protokol/i);
  assert.match(page, /300 Kč \/ měsíc/);
  assert.match(page, /360 Kč/);
  assert.match(page, /420 Kč \/ měsíc/);
  assert.match(page, /nepotvrzuje individuální nárok/i);
  assert.match(page, /Seznam zdravotnických prostředků hrazených na základě předepsání na poukaz/);
  assert.match(page, /\/invalidni-vozik\/#poradce-vozik/);

  assert.match(advisor, /\/invalidni-vozik-na-pojistovnu\//);
});

test("Wheelchair acquisition FAQ schema mirrors visible questions", () => {
  const functions = read("functions.php");
  const page = read("page-invalidni-vozik-na-pojistovnu.php");

  const questions = [
    "Hradí pojišťovna mechanický invalidní vozík?",
    "Dostanu hrazený vozík do vlastnictví?",
    "Kolik stojí půjčení mechanického invalidního vozíku?",
    "Je elektrický vozík na pojišťovnu složitější?",
    "Mohu si nejdřív koupit vozík a potom chtít proplacení?"
  ];

  for (const question of questions) {
    assert.ok(functions.includes(question), `FAQ schema missing: ${question}`);
    assert.ok(page.includes(question), `visible FAQ missing: ${question}`);
  }

  assert.match(functions, /zaprazi_2_is_wheelchair_acquisition_page/);
  assert.match(functions, /data-zaprazi-schema="resource-faq"/);
});

test("Wheelchair acquisition page never labels retail candidates as currently reimbursed", () => {
  const page = read("page-invalidni-vozik-na-pojistovnu.php");

  assert.match(page, /nebude žádný retail vozík označovat jako „hrazený“/i);
  assert.match(page, /účinném seznamu SÚKL/i);
  assert.doesNotMatch(page, /P4384[^\n]{0,160}hrazen/i);
  assert.doesNotMatch(page, /P3641[^\n]{0,160}hrazen/i);
  assert.doesNotMatch(page, /P2961[^\n]{0,160}hrazen/i);
});


test("Return-home Advisor is a privacy-safe orchestration surface", () => {
  const page = read("page-navrat-z-nemocnice.php");
  const app = read("assets/js/return-home-advisor.js");
  const functions = read("functions.php");
  const engine = read("src/return-home/engine.js");

  assert.doesNotMatch(page, /<form[^>]+id=["']zp-return-home-advisor/);
  assert.match(page, /id=["']zp-return-home-advisor["'][^>]+role=["']form/);
  assert.match(page, /Nepotřebujeme jméno, diagnózu, typ operace, seznam léků ani přesnou hmotnost/i);
  assert.match(page, /Neodesíláme jejich kombinaci do analytiky ani affiliate systémů/i);

  for (const field of [
    "timing",
    "entranceReady",
    "transferAbility",
    "walking",
    "wheelchairReady",
    "toiletReady",
    "bedReady",
    "bathroomReady",
    "homeCare"
  ]) {
    assert.ok(page.includes(`data-zp-return-required="${field}"`) || page.includes(`name="${field}"`), `missing return-home field ${field}`);
  }

  assert.match(app, /buildReturnHomePlan/);
  assert.match(app, /zaprazi:analytics/);
  assert.doesNotMatch(app, /gtag\(/);
  assert.doesNotMatch(app, /new FormData/);
  assert.doesNotMatch(app, /commission/i);

  assert.match(engine, /blocked_before_discharge/);
  assert.match(engine, /entrance_not_ready/);
  assert.match(engine, /assisted_transfer/);
  assert.match(engine, /14 dní/);
  assert.match(functions, /zaprazi_2_is_return_home_page/);
  assert.match(functions, /assets\/js\/return-home-advisor\.js/);
  assert.match(functions, /'navrat-z-nemocnice' => array/);
  assert.match(functions, /page-navrat-z-nemocnice\.php/);
});

test("Return-home Advisor routes only into existing Zápraží decision surfaces", () => {
  const engine = read("src/return-home/engine.js");

  assert.match(engine, /\/#poradce/);
  assert.match(engine, /\/koupelna-a-wc\/#poradce-koupelna/);
  assert.match(engine, /\/polohovaci-postel\/#poradce-postel/);
  assert.match(engine, /\/invalidni-vozik\/#poradce-vozik/);

  assert.doesNotMatch(engine, /affiliate/i);
  assert.doesNotMatch(engine, /merchant/i);
  assert.doesNotMatch(engine, /productCandidateIds/);
});

test("Return-home surface is reachable from homepage and core navigation", () => {
  const front = read("front-page.php");
  const header = read("header.php");

  assert.match(front, /\/navrat-z-nemocnice\//);
  assert.match(front, /Připravit návrat domů/);
  assert.match(header, /\/navrat-z-nemocnice\//);
  assert.match(header, /Návrat domů/);
});


test("ADL self-care Advisor is privacy-safe and merchant-separated", () => {
  const page = read("page-sobestacnost.php");
  const app = read("assets/js/adl-advisor.js");
  const functions = read("functions.php");
  const engine = read("src/adl/engine.js");
  const header = read("header.php");
  const front = read("front-page.php");

  assert.match(page, /id=["']zp-adl-advisor["'][^>]+role=["']form/);
  assert.doesNotMatch(page, /<form[^>]+id=["']zp-adl-advisor/);
  assert.match(page, /Nezadávejte jméno, diagnózu, typ operace/i);
  assert.match(page, /polykání, zakuckávání/i);

  for (const field of ["task", "mainProblem", "stableSurface", "oneHandUse"]) {
    assert.ok(page.includes(`data-zp-adl-required="${field}"`) || page.includes(`name="${field}"`), `missing ADL field ${field}`);
  }

  assert.match(app, /chooseAdlSelfCareAid/);
  assert.match(app, /zaprazi:analytics/);
  assert.doesNotMatch(app, /gtag\(/);
  assert.doesNotMatch(app, /new FormData/);
  assert.match(app, /affiliateMap/);
  assert.match(app, /output\.status === "candidate"/);

  assert.match(engine, /swallowing_or_medical/);
  assert.match(engine, /professional_check/);
  assert.match(engine, /rehavita-cz:upcup-15-050101/);
  assert.match(engine, /rehavita-cz:beat-it-15-050102/);
  assert.match(engine, /rehavita-cz:theomatik-15-050103/);
  assert.match(engine, /rehavita-cz:open-it-15-050105/);
  assert.match(engine, /36,5 × 18,8 × 3 cm/);
  assert.match(engine, /hmotnost 60 g/);

  assert.match(functions, /zaprazi_2_is_adl_page/);
  assert.match(functions, /assets\/js\/adl-advisor\.js/);
  assert.match(functions, /'sobestacnost' => array/);
  assert.match(functions, /'adl' => array/);
  assert.match(functions, /rehavita-cz:upcup-15-050101/);
  assert.match(functions, /rehavita-cz:beat-it-15-050102/);
  assert.match(functions, /rehavita-cz:theomatik-15-050103/);
  assert.match(functions, /rehavita-cz:open-it-15-050105/);
  assert.match(functions, /mvs-open-it-multifunkcni-oteviraci-pomucka-5-v-1/);

  assert.match(header, /\/sobestacnost\//);
  assert.match(front, /\/sobestacnost\//);
});


test("Return-home and self-care journeys cross-link without mixing decision logic", () => {
  const returnHome = read("page-navrat-z-nemocnice.php");
  const adl = read("page-sobestacnost.php");
  const returnEngine = read("src/return-home/engine.js");

  assert.match(returnHome, /\/sobestacnost\//);
  assert.match(returnHome, /každodenní soběstačnost/i);
  assert.match(adl, /\/#poradce/);
  assert.match(adl, /\/koupelna-a-wc\//);
  assert.match(adl, /\/polohovaci-postel\//);
  assert.match(adl, /\/invalidni-vozik\//);
  assert.match(adl, /\/navrat-z-nemocnice\//);

  // Cross-links are navigational only; return-home orchestration must remain product-free.
  assert.doesNotMatch(returnEngine, /rehavita|upcup|beat it|theomatik|open-it/i);
});


test("homepage is a six-scenario hub while keeping Mobility Advisor intact", () => {
  const front = read("front-page.php");
  const header = read("header.php");
  const functions = read("functions.php");

  assert.match(front, /id=["']co-resite["']/);
  for (const label of [
    "Chůze a opora",
    "Koupelna a WC",
    "Polohovací postel",
    "Invalidní vozík",
    "Návrat z nemocnice",
    "Každodenní soběstačnost"
  ]) {
    assert.ok(front.includes(label), `homepage scenario missing: ${label}`);
  }

  assert.match(front, /id=["']zp-mobility-advisor["']/);
  assert.match(front, /Začněte situací, ne názvem pomůcky/);
  assert.match(header, />Zápraží<\/a>/);
  assert.match(header, /Cesta k lepšímu životu/);
  assert.match(functions, /Zápraží: domácí poradce pro bezpečný a samostatný život doma/);
  assert.match(functions, /Praktický domácí poradce pro chůzi, koupelnu a WC/);
});


test("global footer exposes all six core advisor journeys", () => {
  const footer = read("footer.php");
  const style = read("style.css");

  assert.match(footer, /Hlavní poradci/);
  for (const path of [
    "/choditka-pro-seniory/",
    "/koupelna-a-wc/",
    "/polohovaci-postel/",
    "/invalidni-vozik/",
    "/navrat-z-nemocnice/",
    "/sobestacnost/"
  ]) {
    assert.ok(footer.includes(path), `footer core route missing: ${path}`);
  }
  assert.match(footer, />Zápraží<\/strong>/);
  assert.match(style, /zp-footer-core/);
});


test("RehaVita affiliate helper identifies eHUB campaign without fabricating tracking URLs", () => {
  const functions = read("functions.php");
  const evidence = read("docs/ADL_SELF_CARE_EVIDENCE_V0.md");

  assert.match(functions, /RehaVita\.cz \(eHUB 18119967\)/);
  assert.match(functions, /advertiser <strong>18119967<\/strong>/);
  assert.match(functions, /CJ Deep Link Generator/);
  assert.match(evidence, /VIVnetworks \/ CJ/);
  assert.match(evidence, /advertiser ID: \*\*18119967\*\*/);
  assert.match(evidence, /do not manually construct tracking parameters/);
  assert.doesNotMatch(functions, /jdoqocy\.com\/click-[0-9]/i);
  assert.doesNotMatch(functions, /anrdoezrs\.net\/links\/[0-9]/i);
});


test("theme supports production custom logo with accessible text fallback", () => {
  const functions = read("functions.php");
  const header = read("header.php");
  const style = read("style.css");

  assert.match(functions, /add_theme_support\('custom-logo'/);
  assert.match(header, /has_custom_logo\(\)/);
  assert.match(header, /the_custom_logo\(\)/);
  assert.match(header, />Zápraží<\/a>/);
  assert.match(style, /zp-brand-wrap \.custom-logo/);
  assert.match(style, /max-height:54px/);
});


test("ADL packaging branch stays narrow and does not become medication advice", () => {
  const page = read("page-sobestacnost.php");
  const engine = read("src/adl/engine.js");
  const functions = read("functions.php");

  assert.match(page, /value=["']open_packaging["']/);
  assert.match(page, /value=["']grip_or_twist["']/);
  assert.match(page, /Otevřít běžný obal nebo uzávěr/);
  assert.match(page, /ne rozhodování o lécích/i);
  assert.match(engine, /MVS Open-It/);
  assert.match(engine, /neřeší výběr, dávkování ani bezpečnost léků/i);
  assert.match(functions, /RehaVita\.cz \(eHUB 18119967\) — MVS Open-It 15-050105/);
});


test("self-care page has SEO authority layer with matching visible FAQ and schema", () => {
  const page = read("page-sobestacnost.php");
  const functions = read("functions.php");

  assert.match(functions, /Pomůcky pro sebeobsluhu seniorů: jak vybrat \| Zápraží/);
  assert.match(functions, /Jak vybrat pomůcky pro sebeobsluhu seniorů podle konkrétního úkonu/);
  assert.match(page, /Pomůcky pro sebeobsluhu a soběstačnost seniorů/);
  assert.match(page, /Jak vybrat pomůcky pro sebeobsluhu seniora/);

  for (const question of [
    "Jak vybrat pomůcku pro soběstačnost seniora?",
    "Co může pomoci při jídle jednou rukou?",
    "Co dělat, když se člověk při pití zakuckává nebo má problém polykat?",
    "Existuje pomůcka na otevírání lahví a obalů při slabším úchopu?",
    "Jaké pomůcky pro sebeobsluhu seniorů existují?"
  ]) {
    assert.ok(page.includes(question), `visible self-care FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `self-care FAQ schema missing: ${question}`);
  }

  assert.match(page, /nzip\.cz\/rejstrikovy-pojem\/1949/);
  assert.match(page, /\/kompenzacni-pomucky-pro-seniory\//);
  assert.match(page, /\/obuv-pro-seniory\//);
  assert.equal((page.match(/id=["']zp-adl-advisor["']/g) || []).length, 1);
  assert.match(functions, /zaprazi_2_is_adl_page\(\)/);
});


test("compensatory aids SEO hub routes to all six decision journeys", () => {
  const page = read("page-kompenzacni-pomucky-pro-seniory.php");
  const functions = read("functions.php");
  const front = read("front-page.php");
  const footer = read("footer.php");

  assert.match(page, /Kompenzační pomůcky pro seniory: začněte problémem, ne katalogem/);
  assert.match(page, /Šest různých situací potřebuje šest různých rozhodovacích cest/);

  for (const path of [
    "/choditka-pro-seniory/",
    "/koupelna-a-wc/",
    "/polohovaci-postel/",
    "/invalidni-vozik/",
    "/navrat-z-nemocnice/",
    "/sobestacnost/"
  ]) {
    assert.ok(page.includes(path), `compensatory aids route missing: ${path}`);
  }

  assert.match(page, /Kompenzační pomůcky na pojišťovnu: začněte konkrétní kategorií/);

  for (const path of [
    "/choditko-na-pojistovnu/",
    "/pomucky-do-koupelny-na-pojistovnu/",
    "/polohovaci-postel-na-pojistovnu/",
    "/invalidni-vozik-na-pojistovnu/"
  ]) {
    assert.ok(page.includes(path), `insurance route missing from compensatory hub: ${path}`);
  }

  for (const detailPath of [
    "page-choditko-na-pojistovnu.php",
    "page-pomucky-do-koupelny-na-pojistovnu.php",
    "page-polohovaci-postel-na-pojistovnu.php",
    "page-invalidni-vozik-na-pojistovnu.php"
  ]) {
    assert.match(read(detailPath), /\/kompenzacni-pomucky-pro-seniory\/#pojistovna/);
  }

  assert.match(page, /ePoukaz/);
  assert.match(page, /nemění ceny ani úhrady/i);
  assert.match(page, /sukl\.gov\.cz/);
  assert.match(page, /vzp\.cz/);
  assert.match(page, /nevyhodnocuje diagnózu ani individuální nárok/i);

  assert.match(functions, /zaprazi_2_is_compensatory_aids_page/);
  assert.match(functions, /'kompenzacni-pomucky-pro-seniory' => array/);
  assert.match(functions, /page-kompenzacni-pomucky-pro-seniory\.php/);
  assert.match(functions, /Kompenzační pomůcky pro seniory: jak vybrat \| Zápraží/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  assert.match(front, /\/kompenzacni-pomucky-pro-seniory\//);
  assert.match(footer, /\/kompenzacni-pomucky-pro-seniory\//);
});

test("compensatory aids visible FAQ matches FAQPage schema", () => {
  const page = read("page-kompenzacni-pomucky-pro-seniory.php");
  const functions = read("functions.php");

  const questions = [
    "Co jsou kompenzační pomůcky pro seniory?",
    "Jak vybrat správnou kompenzační pomůcku?",
    "Hradí kompenzační pomůcky zdravotní pojišťovna?",
    "Znamená ePoukaz automaticky, že pomůcku pojišťovna zaplatí?",
    "Je lepší pomůcku půjčit, nebo koupit?"
  ];

  for (const question of questions) {
    assert.ok(page.includes(question), `visible compensatory FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `compensatory FAQ schema missing: ${question}`);
  }

  assert.match(functions, /zaprazi_2_is_compensatory_aids_page\(\)/);
  assert.match(functions, /data-zaprazi-schema="resource-faq"/);
});


test("safe-home senior audit is task-first and routes into existing advisors", () => {
  const page = read("page-bezpecny-byt-pro-seniora.php");
  const functions = read("functions.php");
  const footer = read("footer.php");
  const returnHome = read("page-navrat-z-nemocnice.php");
  const compensatory = read("page-kompenzacni-pomucky-pro-seniory.php");

  assert.match(page, /Jak upravit byt pro seniora a předcházet pádům doma/);
  assert.match(page, /Postel → WC/);
  assert.match(page, /Volné koberce a kabely/);
  assert.match(page, /Noční osvětlení/);
  assert.match(page, /Protiskluz v koupelně/);
  assert.match(page, /nzip\.cz\/clanek\/1242-zlomenina-krcku-stehenni-kosti/);
  assert.match(page, /nzip\.cz\/clanek\/441-vseobecne-preventivni-prohlidky-dospelych/);

  for (const path of [
    "/choditka-pro-seniory/",
    "/koupelna-a-wc/",
    "/polohovaci-postel/",
    "/invalidni-vozik/",
    "/navrat-z-nemocnice/",
    "/sobestacnost/"
  ]) {
    assert.ok(page.includes(path), `safe-home route missing: ${path}`);
  }

  assert.ok(functions.includes("Jak upravit byt pro seniora a předcházet pádům | Zápraží"));
  assert.ok(functions.includes("Jak upravit byt pro seniora a předcházet pádům doma: audit vstupu"));
  assert.match(page, /Prevence pádů seniorů doma/);
  assert.match(functions, /zaprazi_2_is_safe_home_page/);
  assert.match(functions, /'bezpecny-byt-pro-seniora' => array/);
  assert.match(functions, /page-bezpecny-byt-pro-seniora\.php/);
  assert.match(functions, /zaprazi_resource_pages_v21/);
  assert.match(compensatory, /\/bezpecny-byt-pro-seniora\//);
  assert.match(returnHome, /\/bezpecny-byt-pro-seniora\//);
  assert.match(footer, /\/bezpecny-byt-pro-seniora\//);
});

test("safe-home visible FAQ mirrors FAQPage schema", () => {
  const page = read("page-bezpecny-byt-pro-seniora.php");
  const functions = read("functions.php");

  const questions = [
    "Co upravit v bytě pro seniora jako první?",
    "Jak předcházet pádům seniorů doma?",
    "Je lepší přidat madla, nebo koupit chodítko?",
    "Kdy má smysl polohovací postel?",
    "Co řešit před návratem seniora z nemocnice?"
  ];

  for (const question of questions) {
    assert.ok(page.includes(question), `visible safe-home FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `safe-home FAQ schema missing: ${question}`);
  }
});


test("easy-footwear Advisor is privacy-safe, fit-gated and merchant-separated", () => {
  const page = read("page-obuv-pro-seniory.php");
  const app = read("assets/js/footwear-advisor.js");
  const engine = read("src/footwear/engine.js");
  const functions = read("functions.php");
  const footer = read("footer.php");
  const safeHome = read("page-bezpecny-byt-pro-seniora.php");

  assert.match(page, /id=["']zp-footwear-advisor["'][^>]+role=["']form/);
  assert.doesNotMatch(page, /<form[^>]+id=["']zp-footwear-advisor/);
  assert.match(page, /Nezadávejte diagnózu, příčinu otoku, léky/i);

  for (const field of ["openingNeed", "toe", "velcroUse", "measuredFeet"]) {
    assert.ok(page.includes(`data-zp-footwear-required="${field}"`) || page.includes(`name="${field}"`), `missing footwear field ${field}`);
  }

  assert.match(app, /chooseEasyFootwear/);
  assert.match(app, /affiliateMap/);
  assert.doesNotMatch(app, /new FormData/);
  assert.doesNotMatch(app, /gtag\(/);
  assert.match(app, /output\.status === "candidate"/);

  assert.match(engine, /zdrava-obuv-cz:arsene/);
  assert.match(engine, /zdrava-obuv-cz:xavier/);
  assert.match(engine, /zdrava-obuv-cz:altitude/);
  assert.match(engine, /measuredFeet/);
  assert.match(engine, /velcroUse/);

  assert.match(functions, /zaprazi_2_is_footwear_page/);
  assert.match(functions, /assets\/js\/footwear-advisor\.js/);
  assert.match(functions, /'obuv-pro-seniory' => array/);
  assert.match(functions, /page-obuv-pro-seniory\.php/);
  assert.match(functions, /'footwear' => array/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  assert.match(footer, /\/obuv-pro-seniory\//);
  assert.match(safeHome, /\/obuv-pro-seniory\//);
});

test("footwear shortlist never routes by diagnosis and requires measurement before merchant CTA", () => {
  const engine = read("src/footwear/engine.js");
  const page = read("page-obuv-pro-seniory.php");

  assert.doesNotMatch(engine, /input\.(diagnosis|diabetes|medication|swellingCause)/i);
  assert.match(engine, /measuredFeet !== "yes"/);
  assert.match(engine, /needs_fit_check/);
  assert.match(page, /Náhlá změna chodidla nepatří jen do nákupního filtru/);
});


test("toilet-riser micro-Advisor reuses Bathroom engine and exact verified candidates", () => {
  const page = read("page-nastavec-na-wc-pro-seniory.php");
  const app = read("assets/js/toilet-riser-advisor.js");
  const catalog = read("src/bathroom/catalog.js");
  const functions = read("functions.php");
  const bathroom = read("page-koupelna-a-wc.php");
  const insurer = read("page-pomucky-do-koupelny-na-pojistovnu.php");
  const compensatory = read("page-kompenzacni-pomucky-pro-seniory.php");

  assert.match(page, /Nástavec na WC pro seniory: jak vybrat správnou výšku a madla/);
  assert.match(page, /data-zp-toilet-required=["']transferAbility["']/);
  assert.match(page, /data-zp-toilet-required=["']toiletFit["']/);
  assert.match(page, /data-zp-toilet-required=["']feetFlatAtRaisedHeight["']/);
  assert.match(page, /data-zp-toilet-required=["']loadFit["']/);

  assert.match(app, /recommendBathroom/);
  assert.match(app, /primaryNeed:\s*"raise_toilet"/);
  assert.match(app, /getBathroomProducts/);
  assert.match(app, /affiliateMap/);
  assert.doesNotMatch(app, /gtag\(/);
  assert.doesNotMatch(app, /new FormData/);

  assert.match(catalog, /id: "unizdrav-p2868"/);
  assert.match(catalog, /id: "besco-bs15"/);
  assert.match(catalog, /heightIncreaseCm: 15/);
  assert.match(catalog, /heightIncreaseCm: 11\.5/);

  assert.match(functions, /zaprazi_2_is_toilet_riser_page/);
  assert.match(functions, /assets\/js\/toilet-riser-advisor\.js/);
  assert.match(functions, /'nastavec-na-wc-pro-seniory' => array/);
  assert.match(functions, /page-nastavec-na-wc-pro-seniory\.php/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  assert.match(bathroom, /\/nastavec-na-wc-pro-seniory\//);
  assert.match(insurer, /\/nastavec-na-wc-pro-seniory\//);
  assert.match(compensatory, /\/nastavec-na-wc-pro-seniory\//);
});

test("toilet-riser visible FAQ mirrors FAQPage schema", () => {
  const page = read("page-nastavec-na-wc-pro-seniory.php");
  const functions = read("functions.php");

  const questions = [
    "Jak vysoký nástavec na WC vybrat?",
    "Kdy má smysl nástavec s madly?",
    "Pasuje nástavec na každý záchod?",
    "Hradí nástavec na WC zdravotní pojišťovna?"
  ];

  for (const question of questions) {
    assert.ok(page.includes(question), `visible toilet-riser FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `toilet-riser FAQ schema missing: ${question}`);
  }
});


test("shower-chair micro-Advisor reuses Bathroom engine and verified P2062 candidate", () => {
  const page = read("page-sprchovaci-zidle-pro-seniory.php");
  const app = read("assets/js/shower-chair-advisor.js");
  const catalog = read("src/bathroom/catalog.js");
  const functions = read("functions.php");
  const bathroom = read("page-koupelna-a-wc.php");
  const insurer = read("page-pomucky-do-koupelny-na-pojistovnu.php");
  const compensatory = read("page-kompenzacni-pomucky-pro-seniory.php");

  assert.match(page, /Sprchovací židle pro seniory: jak vybrat rozměr, výšku a opory/);
  for (const field of ["transferAbility", "floorStable", "spaceFit", "loadFit"]) {
    assert.ok(page.includes(`data-zp-shower-required="${field}"`) || page.includes(`name="${field}"`), `missing shower field ${field}`);
  }

  assert.match(app, /recommendBathroom/);
  assert.match(app, /primaryNeed:\s*"shower_seated"/);
  assert.match(app, /getBathroomProducts/);
  assert.match(app, /affiliateMap/);
  assert.doesNotMatch(app, /new FormData/);
  assert.doesNotMatch(app, /gtag\(/);

  assert.match(catalog, /id: "unizdrav-p2062"/);
  assert.match(catalog, /totalWidthCm: 55/);
  assert.match(catalog, /totalDepthCm: 48/);
  assert.match(catalog, /seatHeightCm: "38–50\.5"/);
  assert.match(catalog, /maxUserWeightKg: 136/);

  assert.match(functions, /zaprazi_2_is_shower_chair_page/);
  assert.match(functions, /assets\/js\/shower-chair-advisor\.js/);
  assert.match(functions, /'sprchovaci-zidle-pro-seniory' => array/);
  assert.match(functions, /page-sprchovaci-zidle-pro-seniory\.php/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  assert.match(bathroom, /\/sprchovaci-zidle-pro-seniory\//);
  assert.match(insurer, /\/sprchovaci-zidle-pro-seniory\//);
  assert.match(compensatory, /\/sprchovaci-zidle-pro-seniory\//);
});

test("shower-chair visible FAQ mirrors FAQPage schema", () => {
  const page = read("page-sprchovaci-zidle-pro-seniory.php");
  const functions = read("functions.php");

  const questions = [
    "Jak vysoká má být sprchovací židle?",
    "Jak změřit, zda se sprchovací židle vejde?",
    "Kdy online poradce konkrétní židli nedoporučí?",
    "Hradí sprchovací židli zdravotní pojišťovna?"
  ];

  for (const question of questions) {
    assert.ok(page.includes(question), `visible shower FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `shower FAQ schema missing: ${question}`);
  }
});


test("Advisor asset loader is structurally clean and contains no FAQ payload", () => {
  const functions = read("functions.php");
  const start = functions.indexOf("function zaprazi_2_assets()");
  const end = functions.indexOf("add_action('wp_enqueue_scripts', 'zaprazi_2_assets');", start);
  assert.ok(start >= 0 && end > start, "asset loader block not found");
  const assets = functions.slice(start, end);
  assert.doesNotMatch(assets, /\$faq\s*=/);
  assert.doesNotMatch(assets, /'question'\s*=>/);

  for (const handle of [
    "zaprazi-adl-advisor",
    "zaprazi-footwear-advisor",
    "zaprazi-toilet-riser-advisor",
    "zaprazi-shower-chair-advisor",
    "zaprazi-toilet-chair-advisor",
    "zaprazi-toilet-support-advisor",
    "zaprazi-bath-transfer-advisor",
    "zaprazi-indoor-walker-advisor",
    "zaprazi-rollator-advisor"
  ]) {
    assert.ok(assets.includes(handle), `missing Advisor enqueue: ${handle}`);
  }
});

test("bathroom micro-page FAQs live in resource FAQ schema, not asset loader", () => {
  const functions = read("functions.php");
  const faqStart = functions.indexOf("function zaprazi_2_resource_faq_schema()");
  const faqEnd = functions.indexOf("add_action( 'wp_head', 'zaprazi_2_resource_faq_schema', 7 );", faqStart);
  const faq = functions.slice(faqStart, faqEnd);
  for (const question of [
    "Jak vysoký nástavec na WC vybrat?",
    "Jak vysoká má být sprchovací židle?",
    "Kdy má smysl samostatná toaletní židle?"
  ]) {
    assert.ok(faq.includes(question), `resource FAQ missing: ${question}`);
  }
});

test("toilet-chair micro-Advisor reuses Bathroom engine for static vs 4v1 routing", () => {
  const page = read("page-toaletni-zidle-pro-seniory.php");
  const app = read("assets/js/toilet-chair-advisor.js");
  const catalog = read("src/bathroom/catalog.js");
  const functions = read("functions.php");
  const bathroom = read("page-koupelna-a-wc.php");
  const insurer = read("page-pomucky-do-koupelny-na-pojistovnu.php");
  const compensatory = read("page-kompenzacni-pomucky-pro-seniory.php");
  const footer = read("footer.php");

  assert.match(page, /Toaletní židle pro seniory: statická u lůžka, nebo 4v1 i do sprchy/);
  for (const field of ["chairMode", "transferAbility", "floorStable", "spaceFit", "loadFit"]) {
    assert.ok(page.includes(`name="${field}"`), `missing toilet-chair field ${field}`);
  }

  assert.match(app, /recommendBathroom/);
  assert.match(app, /"multifunction_toilet_shower"/);
  assert.match(app, /"toilet_nearby"/);
  assert.match(app, /getBathroomProducts/);
  assert.match(app, /affiliateMap/);
  assert.doesNotMatch(app, /new FormData/);
  assert.doesNotMatch(app, /gtag\(/);

  assert.match(catalog, /id: "unizdrav-p2807"/);
  assert.match(catalog, /id: "dma-eh-cmda"/);
  assert.match(catalog, /seatHeightCm: "36–60"/);
  assert.match(catalog, /seatHeightCm: "39–54"/);

  assert.match(functions, /zaprazi_2_is_toilet_chair_page/);
  assert.match(functions, /assets\/js\/toilet-chair-advisor\.js/);
  assert.match(functions, /'toaletni-zidle-pro-seniory' => array/);
  assert.match(functions, /page-toaletni-zidle-pro-seniory\.php/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  for (const content of [bathroom, insurer, compensatory, footer]) {
    assert.match(content, /\/toaletni-zidle-pro-seniory\//);
  }
});

test("toilet-chair visible FAQ mirrors resource FAQ schema", () => {
  const page = read("page-toaletni-zidle-pro-seniory.php");
  const functions = read("functions.php");
  for (const question of [
    "Kdy má smysl samostatná toaletní židle?",
    "Jaký je rozdíl mezi toaletní židlí a 4v1?",
    "Jak vysoká má být toaletní židle?",
    "Hradí toaletní židli zdravotní pojišťovna?"
  ]) {
    assert.ok(page.includes(question), `visible toilet-chair FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `toilet-chair FAQ schema missing: ${question}`);
  }
});


test("toilet-support micro-Advisor reuses Bathroom engine for wall rail vs support frame", () => {
  const page = read("page-madlo-k-wc-pro-seniory.php");
  const app = read("assets/js/toilet-support-advisor.js");
  const catalog = read("src/bathroom/catalog.js");
  const functions = read("functions.php");
  const bathroom = read("page-koupelna-a-wc.php");
  const insurer = read("page-pomucky-do-koupelny-na-pojistovnu.php");
  const compensatory = read("page-kompenzacni-pomucky-pro-seniory.php");
  const footer = read("footer.php");

  assert.match(page, /Madlo k WC pro seniory: pevné do zdi, nebo toaletní opora/);
  assert.match(app, /recommendBathroom/);
  assert.match(app, /primaryNeed:"toilet_support"/);
  assert.match(app, /wallFixing/);
  assert.match(app, /getBathroomProducts/);
  assert.match(catalog, /id: "unizdrav-p2015"/);
  assert.match(catalog, /id: "unizdrav-p2131"/);

  assert.match(functions, /zaprazi_2_is_toilet_support_page/);
  assert.match(functions, /assets\/js\/toilet-support-advisor\.js/);
  assert.match(functions, /'madlo-k-wc-pro-seniory' => array/);
  assert.match(functions, /page-madlo-k-wc-pro-seniory\.php/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  for (const content of [bathroom, insurer, compensatory, footer]) {
    assert.match(content, /\/madlo-k-wc-pro-seniory\//);
  }
});

test("toilet-support visible FAQ mirrors resource FAQ schema", () => {
  const page = read("page-madlo-k-wc-pro-seniory.php");
  const functions = read("functions.php");
  for (const question of [
    "Je lepší madlo do zdi, nebo toaletní opora?",
    "Jak vysoko umístit madlo k WC?",
    "Stačí znát nosnost madla?",
    "Kdy online poradce konkrétní oporu nedoporučí?"
  ]) {
    assert.ok(page.includes(question), `visible toilet-support FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `toilet-support FAQ schema missing: ${question}`);
  }
});


test("bath-transfer micro-Advisor reuses Bathroom engine for seat vs transfer bench", () => {
  const page = read("page-sedatko-do-vany-pro-seniory.php");
  const app = read("assets/js/bath-transfer-advisor.js");
  const catalog = read("src/bathroom/catalog.js");
  const functions = read("functions.php");
  const bathroom = read("page-koupelna-a-wc.php");
  const insurer = read("page-pomucky-do-koupelny-na-pojistovnu.php");
  const compensatory = read("page-kompenzacni-pomucky-pro-seniory.php");
  const footer = read("footer.php");

  assert.match(page, /Sedátko do vany pro seniory: přes okraj vany, nebo transferová lavice/);
  assert.match(app, /recommendBathroom/);
  assert.match(app, /primaryNeed:"bath_transfer"/);
  assert.match(app, /bathTransferIndependent/);
  assert.match(app, /bathFit/);
  assert.match(app, /bathBenchFit/);
  assert.match(app, /getBathroomProducts/);
  assert.match(catalog, /id: "besco-bs008"/);
  assert.match(catalog, /id: "unizdrav-p2203"/);

  assert.match(functions, /zaprazi_2_is_bath_transfer_page/);
  assert.match(functions, /assets\/js\/bath-transfer-advisor\.js/);
  assert.match(functions, /'sedatko-do-vany-pro-seniory' => array/);
  assert.match(functions, /page-sedatko-do-vany-pro-seniory\.php/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  for (const content of [bathroom, insurer, compensatory, footer]) {
    assert.match(content, /\/sedatko-do-vany-pro-seniory\//);
  }
});

test("bath-transfer visible FAQ mirrors resource FAQ schema", () => {
  const page = read("page-sedatko-do-vany-pro-seniory.php");
  const functions = read("functions.php");
  for (const question of [
    "Jak změřit vanu pro sedátko?",
    "Kdy dává smysl transferová lavice přes vanu?",
    "Kdy online poradce konkrétní sedátko nedoporučí?",
    "Hradí sedátko do vany zdravotní pojišťovna?"
  ]) {
    assert.ok(page.includes(question), `visible bath-transfer FAQ missing: ${question}`);
    assert.ok(functions.includes(question), `bath-transfer FAQ schema missing: ${question}`);
  }
});


test("mobility high-intent Advisors reuse Mobility engine and verified products", () => {
  const indoorPage = read("page-choditko-do-bytu-pro-seniory.php");
  const indoorApp = read("assets/js/indoor-walker-advisor.js");
  const rollPage = read("page-rollator-pro-seniory.php");
  const rollApp = read("assets/js/rollator-advisor.js");
  const catalog = read("src/mobility/catalog.js");
  const functions = read("functions.php");
  const front = read("front-page.php");
  const hub = read("page-kompenzacni-pomucky-pro-seniory.php");
  const insurer = read("page-choditko-na-pojistovnu.php");
  const footer = read("footer.php");

  assert.match(indoorPage, /Chodítko do bytu pro seniory: čtyřbodové, nebo dvoukolové/);
  assert.match(indoorApp, /recommendMobility/);
  assert.match(indoorApp, /environment:"indoor"/);
  assert.match(indoorApp, /canLiftWalker/);

  assert.match(rollPage, /Rollátor pro seniory: kdy dává smysl čtyřkolové chodítko s brzdami/);
  assert.match(rollApp, /recommendMobility/);
  assert.match(rollApp, /environment:"both"/);
  assert.match(rollApp, /handBrakes/);

  assert.match(catalog, /id: "besco-wa17"/);
  assert.match(catalog, /id: "besco-wa21"/);
  assert.match(catalog, /id: "meyra-ideal-3061982"/);

  assert.match(functions, /zaprazi_2_is_indoor_walker_page/);
  assert.match(functions, /zaprazi_2_is_rollator_page/);
  assert.match(functions, /assets\/js\/indoor-walker-advisor\.js/);
  assert.match(functions, /assets\/js\/rollator-advisor\.js/);
  assert.match(functions, /'choditko-do-bytu-pro-seniory' => array/);
  assert.match(functions, /'rollator-pro-seniory' => array/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  for (const content of [front, hub, insurer, footer]) {
    assert.match(content, /\/choditko-do-bytu-pro-seniory\//);
    assert.match(content, /\/rollator-pro-seniory\//);
  }
});

test("mobility high-intent visible FAQs mirror resource FAQ schema", () => {
  const indoor = read("page-choditko-do-bytu-pro-seniory.php");
  const roll = read("page-rollator-pro-seniory.php");
  const functions = read("functions.php");

  for (const question of [
    "Jaké chodítko je vhodnější do bytu?",
    "Kolik místa chodítko potřebuje?",
    "Je lehčí chodítko automaticky lepší?",
    "Kdy online poradce konkrétní chodítko nedoporučí?"
  ]) {
    assert.ok(indoor.includes(question));
    assert.ok(functions.includes(question));
  }

  for (const question of [
    "Jak poznat, že je rollátor vhodnější než chodítko bez brzd?",
    "Musí mít rollátor sedátko?",
    "Hradí rollátor zdravotní pojišťovna?",
    "Kdy online poradce rollátor nedoporučí?"
  ]) {
    assert.ok(roll.includes(question));
    assert.ok(functions.includes(question));
  }
});


test("mobility hub consolidates walker intent without a duplicate Advisor engine", () => {
  const page = read("page-choditka-pro-seniory.php");
  const functions = read("functions.php");
  const header = read("header.php");
  const footer = read("footer.php");
  const front = read("front-page.php");
  const compensatory = read("page-kompenzacni-pomucky-pro-seniory.php");
  const insurer = read("page-choditko-na-pojistovnu.php");
  const rental = read("page-pujceni-choditka.php");

  assert.match(page, /Chodítka pro seniory: jak vybrat správný typ doma i venku/);
  assert.match(page, /\/choditko-do-bytu-pro-seniory\//);
  assert.match(page, /\/rollator-pro-seniory\//);
  assert.match(page, /\/pujceni-choditka\//);
  assert.match(page, /\/choditko-na-pojistovnu\//);
  assert.doesNotMatch(page, /recommendMobility|recommendBathroom|wp_enqueue_script_module/);

  assert.match(functions, /zaprazi_2_is_mobility_hub_page/);
  assert.match(functions, /'choditka-pro-seniory' => array/);
  assert.match(functions, /page-choditka-pro-seniory\.php/);
  assert.match(functions, /zaprazi_resource_pages_v21/);

  for (const content of [header, footer, front, compensatory, insurer, rental]) {
    assert.match(content, /\/choditka-pro-seniory\//);
  }
});

test("mobility hub visible FAQ mirrors resource FAQ schema", () => {
  const page = read("page-choditka-pro-seniory.php");
  const functions = read("functions.php");
  for (const question of [
    "Jaký je rozdíl mezi chodítkem a rollátorem?",
    "Jaké chodítko je nejlepší do bytu?",
    "Kdy dává smysl rollátor se sedátkem?",
    "Hradí chodítko zdravotní pojišťovna?",
    "Je lepší chodítko půjčit, nebo koupit?"
  ]) {
    assert.ok(page.includes(question));
    assert.ok(functions.includes(question));
  }
});


test("core navigation targets are unique", () => {
  const header = read("header.php");
  const navStart = header.indexOf('<nav class="zp-core-nav"');
  const navEnd = header.indexOf("</nav>", navStart);
  assert.ok(navStart >= 0 && navEnd > navStart, "core nav block missing");
  const nav = header.slice(navStart, navEnd);
  const targets = [...nav.matchAll(/home_url\(\s*'([^']+)'\s*\)/g)].map((m) => m[1]);
  assert.ok(targets.length >= 6, "too few core navigation targets");
  assert.equal(new Set(targets).size, targets.length, "duplicate core navigation target");
  assert.ok(targets.includes("/choditka-pro-seniory/"));
  assert.ok(targets.includes("/kompenzacni-pomucky-pro-seniory/"));
});
