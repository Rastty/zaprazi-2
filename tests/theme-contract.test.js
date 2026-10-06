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

  assert.match(functions, /zaprazi_resource_pages_v2/);
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
