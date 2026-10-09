import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
const slug = "/co-zmerit-pred-vyberem-choditka/";

test("Walker measurement guide is one original task-first article, not a duplicate product engine", () => {
  const page = read("page-co-zmerit-pred-vyberem-choditka.php");
  assert.match(page, /Template Name: Zápraží — Co změřit před výběrem chodítka/);
  assert.equal((page.match(/<h1[ >]/g) || []).length, 1);
  assert.match(page, /Sedm věcí doma/);
  for (const step of [
    "1. Kde a jak", "2. Výška madel", "3. Nejužší dveře",
    "4. Podlaha", "5. U rollátoru brzdy", "6. Nosnost", "7. Skládání"
  ]) assert.ok(page.includes(step), step);
  assert.match(page, /fyzickou pomoc další osoby/);
  assert.match(page, /neprovádějte měření bez bezpečné pomoci/);
  assert.match(page, /bezpečné ovládání brzd není potvrzené/);
  assert.doesNotMatch(page, /<form\b|data-zp-merchant-link|affiliateMap|eHUB|awin1\.com/i);
});
test("Editorial proof and useful Advisor links", () => {
  const page = read("page-co-zmerit-pred-vyberem-choditka.php");
  for (const source of [
    "www.mayoclinic.org/healthy-lifestyle/healthy-aging/in-depth/walker/art-20546805",
    "www.southtees.nhs.uk/resources/how-to-use-a-walking-frame-or-wheeled-walking-frame/"
  ]) assert.ok(page.includes(source), source);
  for (const path of [
    "/choditka-pro-seniory/",
    "/choditko-do-bytu-pro-seniory/#poradce-choditko-byt",
    "/rollator-pro-seniory/#poradce-rollator",
    "/#poradce", "/jak-vznika-doporuceni/"
  ]) assert.ok(page.includes(path), "missing existing destination " + path);
  assert.match(page, /Zdroje ověřeny 9\. 10\. 2026/);
  assert.match(page, /externí individuální odborná revize není doložená/);
  assert.match(page, /bez ukládání rozměrů či osobních údajů/);
});
test("Walker selection hub and specialized Advisors link back to unique measurement guide", () => {
  for (const name of ["page-choditka-pro-seniory.php","page-choditko-do-bytu-pro-seniory.php","page-rollator-pro-seniory.php"]) {
    const c = read(name);
    assert.ok(c.includes(slug), name);
    assert.ok(c.includes("home_url( '" + slug + "' )"), name);
  }
});
test("SEO bootstrap does not overwrite legacy, title and meta work with or without Yoast", () => {
  const php = read("functions.php");
  const start = php.indexOf("function zaprazi_2_ensure_walker_measurements_page()");
  const end = php.indexOf("add_action( 'init', 'zaprazi_2_ensure_walker_measurements_page', 34 );", start);
  assert.ok(start > 0 && end > start);
  const bootstrap = php.slice(start, end);
  assert.match(bootstrap, /get_option\( 'zaprazi_walker_measurements_page_v1' \)/);
  assert.match(bootstrap, /get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(bootstrap, /wp_insert_post\(/);
  assert.match(bootstrap, /page-co-zmerit-pred-vyberem-choditka\.php/);
  assert.doesNotMatch(bootstrap, /wp_update_post\(|wp_trash_post\(|wp_delete_post\(/);
  assert.match(php, /function zaprazi_2_is_walker_measurements_page\(\)/);
  assert.match(php, /Co změřit před výběrem chodítka a rollátoru \| Zápraží/);
  assert.match(php, /zaprazi_2_walker_measurements_meta_fallback/);
  assert.match(php, /defined\( 'WPSEO_VERSION' \)/);
  assert.match(php, /add_filter\( 'wpseo_metadesc', 'zaprazi_2_resource_description'/);
  assert.doesNotMatch(read("data/legacy-url-inventory.csv"), /"https:\/\/zaprazi\.cz\/co-zmerit-pred-vyberem-choditka\/?"/);
});
