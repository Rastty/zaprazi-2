import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
const slug = "/jak-zmerit-chodidlo-pro-vyber-obuvi/";

test("footwear measurement page has six practical steps and explicit safety boundaries", () => {
  const page = read("page-jak-zmerit-chodidlo-pro-vyber-obuvi.php");
  assert.match(page, /Template Name: Zápraží — Jak změřit chodidlo/);
  assert.equal((page.match(/<h1[ >]/g) || []).length, 1);
  for (const step of [
    "1. Připravte papír", "2. Změřte každé chodidlo", "3. Zapište délku",
    "4. Zapište šířku", "5. Ověřte tabulku", "6. Před nákupem"
  ]) assert.ok(page.includes(step), step);
  assert.match(page, /pokud člověk neudrží jistý stoj/);
  assert.match(page, /odborné změření/);
  assert.match(page, /zdravotní stav s odborníkem/);
  assert.match(page, /nezadáváte|neukládá|neodesíláme/);
  assert.doesNotMatch(page, /<form\b|data-zp-merchant-link|affiliateMap|data-zp-footwear-merchant-link/i);
});

test("footwear guide is source-backed and linked both ways to the sole footwear Advisor", () => {
  const page = read("page-jak-zmerit-chodidlo-pro-vyber-obuvi.php");
  const advisor = read("page-obuv-pro-seniory.php");
  for (const host of [
    "www.lpft.nhs.uk/our-services/older-adults/inpatient-wards/footwear-guide",
    "www.bdct.nhs.uk/footwear-advice/",
    "www.southtees.nhs.uk/services/community/podiatry/footwear-advice/"
  ]) assert.ok(page.includes(host), "Missing verified evidence " + host);
  assert.ok(advisor.includes("home_url( '" + slug + "' )"), "Advisor must link to guide for unmeasured feet");
  assert.ok(page.includes("/obuv-pro-seniory/#poradce-obuv"), "Guide must return to active selection");
  assert.ok(page.includes("/jak-vznika-doporuceni/"), "Editorial methodology link must exist");
  assert.doesNotMatch(page, /ZP_RELEASE_0_8_10[01]\b/, "Guide should be created on current release baseline");
});

test("one-time WordPress page publication and Yoast-safe title/meta do not overwrite existing URLs", () => {
  const php = read("functions.php");
  const start = php.indexOf("function zaprazi_2_ensure_footwear_measurement_page()");
  const end = php.indexOf("add_action( 'init', 'zaprazi_2_ensure_footwear_measurement_page', 35 );", start);
  assert.ok(start !== -1 && end > start, "Missing idempotent bootstrap");
  const block = php.slice(start,end);
  for (const expected of [
    "get_option( 'zaprazi_footwear_measurement_page_v1' )",
    "get_page_by_path( $slug, OBJECT, 'page' )",
    "wp_insert_post(",
    "page-jak-zmerit-chodidlo-pro-vyber-obuvi.php"
  ]) assert.ok(block.includes(expected), expected);
  assert.doesNotMatch(block,/wp_update_post|wp_delete_post|wp_trash_post/);
  assert.match(php,/function zaprazi_2_is_footwear_measurement_page/);
  assert.match(php,/Jak změřit chodidlo pro výběr obuvi \| Zápraží/);

  assert.match(php,/function zaprazi_2_footwear_measurement_meta_fallback/);
  assert.match(php,/defined\( 'WPSEO_VERSION' \)/);
  assert.match(php,/add_filter\( 'wpseo_metadesc', 'zaprazi_2_resource_description'/);
  assert.ok(php.includes("'page-jak-zmerit-chodidlo-pro-vyber-obuvi.php'"));
  assert.doesNotMatch(read("data/legacy-url-inventory.csv"), /"https:\/\/zaprazi\.cz\/jak-zmerit-chodidlo-pro-vyber-obuvi\/?"/);

});
