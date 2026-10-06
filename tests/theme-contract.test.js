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
