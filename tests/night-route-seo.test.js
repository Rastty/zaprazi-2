import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
const slug = "/nocni-cesta-z-postele-na-wc/";

test("Night-time bed-to-WC content has one clear purpose, its own H1 and seven practical checkpoints", () => {
  const page = read("page-nocni-cesta-z-postele-na-wc.php");
  assert.match(page, /Template Name: Zápraží — Noční cesta z postele na WC/);
  assert.equal((page.match(/<h1[ >]/g) || []).length, 1);
  assert.match(page, /Noční cesta z postele na WC: 7 bodů/);
  for (const item of [
    "1. Vstání z postele", "2. Světlo", "3. Volná cesta",
    "4. Práh", "5. Stabilní opora", "6. Usednutí", "7. Návrat"
  ]) {
    assert.ok(page.includes(item), "Missing critical practical task: " + item);
  }
  assert.match(page, /zajistěte neodkladnou pomoc/);
  assert.match(page, /není to test|Není to test/);
  assert.match(page, /Odborná individuální revize tohoto seznamu není doložená/);
  assert.doesNotMatch(page, /<form\b|affiliateMap|data-zp-merchant-link|eHUB|awin1\.com/i);
});

test("New article links into existing Advisors, while both distinct existing hubs link back contextually", () => {
  const page = read("page-nocni-cesta-z-postele-na-wc.php");
  const safeHome = read("page-bezpecny-byt-pro-seniora.php");
  const returnHome = read("page-navrat-z-nemocnice.php");
  for (const outbound of [
    "/bezpecny-byt-pro-seniora/", "/#poradce", "/koupelna-a-wc/",
    "/navrat-z-nemocnice/", "/jak-vznika-doporuceni/"
  ]) assert.ok(page.includes(outbound), "Article route missing: " + outbound);
  assert.ok(safeHome.includes(slug), "Safe home hub must link to specific night route");
  assert.ok(returnHome.includes(slug), "Return home must link contextually to the night route");
  assert.ok(page.includes("home_url("), "Every internal link must use canonical WordPress home_url");
  assert.doesNotMatch(page, /href="https:\/\/zaprazi\.cz\//);
});

test("SEO publication is idempotent, non-destructive to legacy pages and has Yoast and no-Yoast metadata paths", () => {
  const php = read("functions.php");
  const start = php.indexOf("function zaprazi_2_ensure_night_wc_page()");
  const end = php.indexOf("add_action( 'init', 'zaprazi_2_ensure_night_wc_page', 33 );", start);
  assert.ok(start > 0 && end > start, "Dedicated one-shot bootstrap absent");
  const section = php.slice(start, end);
  assert.match(section, /get_option\( 'zaprazi_night_wc_page_v1' \)/);
  assert.match(section, /get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(section, /if \( get_page_by_path/);
  assert.match(section, /wp_insert_post\(/);
  assert.match(section, /'post_status'\s*=>\s*'publish'/);
  assert.match(section, /'post_name'\s*=>\s*\$slug/);
  assert.match(section, /_wp_page_template' => 'page-nocni-cesta-z-postele-na-wc\.php'/);
  assert.doesNotMatch(section, /wp_update_post\(|wp_delete_post\(|wp_trash_post\(/);
  assert.match(php, /function zaprazi_2_is_night_wc_page\(\)/);
  assert.match(php, /Noční cesta z postele na WC: 7 bodů kontroly \| Zápraží/);
  assert.match(php, /Noční cesta z postele na WC: praktická kontrola světla/);
  assert.match(php, /add_filter\( 'wpseo_title', 'zaprazi_2_resource_title'/);
  assert.match(php, /add_filter\( 'wpseo_metadesc', 'zaprazi_2_resource_description'/);
  assert.match(php, /function zaprazi_2_night_wc_meta_fallback\(\)/);
  assert.match(php, /! zaprazi_2_is_night_wc_page\(\) \|\| defined\( 'WPSEO_VERSION' \)/);
  assert.match(php, /'page-nocni-cesta-z-postele-na-wc.php'/);
});

test("Article cites suitable authoritative sources and does not state unverifiable individualized benefit", () => {
  const page = read("page-nocni-cesta-z-postele-na-wc.php");
  for (const source of [
    "www.nzip.cz/clanek/1242-zlomenina-krcku-stehenni-kosti",
    "oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru"
  ]) assert.ok(page.includes(source), "Evidence missing: " + source);
  assert.match(page, /Zdroje zkontrolovány 9\. 10\. 2026/);
  assert.doesNotMatch(page, /zaručeně|stoprocentně|vyléčí|diagnóza:|potvrzený nárok/i);
});

test("Legacy article inventory has no canonical night-route slug collision", () => {
  const csv = read("data/legacy-url-inventory.csv");
  assert.doesNotMatch(csv, /"https:\/\/zaprazi\.cz\/nocni-cesta-z-postele-na-wc\/?"/);
});
