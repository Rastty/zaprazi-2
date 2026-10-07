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

test("public SEO brand is ZaPrazi while database mutation stays unnecessary", () => {
  const functions = read("functions.php");

  assert.match(functions, /wpseo_schema_website/);
  assert.match(functions, /wpseo_opengraph_site_name/);
  assert.match(functions, /ZaPrazi\.cz/);
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

  assert.match(functions, /zaprazi_resource_pages_v9/);
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


test("core navigation links Advisor, reimbursement, rental and selection guidance", () => {
  const header = read("header.php");
  const style = read("style.css");

  assert.match(header, /aria-label=["']Hlavní navigace["']/);
  assert.match(header, /\/#poradce/);
  assert.match(header, /\/choditko-na-pojistovnu\//);
  assert.match(header, /\/pujceni-choditka\//);
  assert.match(header, /\/#jak-vybrat/);

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

  assert.match(functions, /zaprazi_resource_pages_v9/);
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


test("0.8.22 deployment integrity contract covers critical runtime files", () => {
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
    "assets/js/analytics-consent.js",
    "assets/js/mobility-advisor.js",
    "assets/js/bathroom-advisor.js",
    "assets/js/bed-advisor.js",
    "assets/js/wheelchair-advisor.js",
    "assets/js/runtime-config.js",
    "style.css"
  ];

  assert.ok(functions.includes("define( 'ZAPRAZI_RELEASE', '0.8.22' );"));
  assert.match(functions, /zaprazi_2_release_integrity_ok/);
  assert.match(functions, /zaprazi-integrity/);
  for (const path of critical) {
    assert.ok(functions.includes(path), `integrity list missing ${path}`);
    assert.match(read(path), /ZP_RELEASE_0_8_22/);
  }
  assert.ok(read("style.css").includes("Version: 0.8.22"));
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


test("WordPress admins are warned when release integrity is partial", () => {
  const functions = read("functions.php");

  assert.match(functions, /zaprazi_2_release_integrity_admin_notice/);
  assert.match(functions, /admin_notices/);
  assert.match(functions, /ZaPrazi deployment partial/);
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
  assert.match(front, /Řeším koupelnu nebo WC/);
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
  assert.match(front, /Řeším polohovací postel/);
  assert.match(header, /\/polohovaci-postel\//);
  assert.match(header, /Polohovací postel/);
});


test("Adjustable bed high-intent acquisition page separates insurer rental and retail paths", () => {
  const functions = read("functions.php");
  const page = read("page-polohovaci-postel-na-pojistovnu.php");
  const bed = read("page-polohovaci-postel.php");

  assert.match(functions, /zaprazi_resource_pages_v9/);
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
  assert.match(front, /Řeším invalidní vozík/);
  assert.match(header, /\/invalidni-vozik\//);
  assert.match(header, /Invalidní vozík/);
});


test("Wheelchair high-intent acquisition page separates insurer rental and retail paths", () => {
  const functions = read("functions.php");
  const page = read("page-invalidni-vozik-na-pojistovnu.php");
  const advisor = read("page-invalidni-vozik.php");

  assert.match(functions, /zaprazi_resource_pages_v9/);
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
