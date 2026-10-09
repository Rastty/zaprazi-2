import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("trust methodology never invents a medical reviewer or universal review date", () => {
  const page = read("page-jak-vznika-doporuceni.php");
  assert.match(page, /redakce projektu Zápraží/);
  assert.match(page, /Externí odborná revize:/);
  assert.match(page, /není doložená/);
  assert.match(page, /Metodika aktualizována:/);
  assert.match(page, /nejde o datum poslední věcné revize každého výrobku/i);
  assert.match(page, /nestačí|nenahrazuje|není diagnóza/i);
  assert.match(page, /SÚKL/);
  assert.match(page, /datum kontroly/);
  assert.match(page, /Provize neovlivňuje/);
  assert.match(page, /<main id="main-content" tabindex="-1">/);
  assert.doesNotMatch(page, /MUDr\.|PhDr\.|Mgr\.\s+|garantováno odborníkem/i);
});

test("methodology page creation is non-destructive and idempotent", () => {
  const php = read("functions.php");
  assert.match(php, /function zaprazi_2_ensure_methodology_page\(\)/);
  assert.match(php, /zaprazi_methodology_page_v1/);
  assert.match(php, /get_page_by_path\( 'jak-vznika-doporuceni'/);
  assert.match(php, /if \( \$existing \)/);
  assert.match(php, /_wp_page_template' => 'page-jak-vznika-doporuceni\.php'/);
  assert.match(php, /is_wp_error\( \$created \)/);
  assert.match(php, /add_action\( 'init', 'zaprazi_2_ensure_methodology_page', 31 \)/);
  const body = php.split("function zaprazi_2_ensure_methodology_page() {")[1].split("add_action( 'init', 'zaprazi_2_ensure_methodology_page'")[0];
  assert.doesNotMatch(body, /wp_update_post|wp_delete_post|wp_trash_post/);
});

test("each core Advisor has an honest method disclosure without implying clinician certification", () => {
  const footer = read("footer.php");
  const style = read("style.css");
  for (const slug of [
    "koupelna-a-wc", "polohovaci-postel", "invalidni-vozik",
    "navrat-z-nemocnice", "sobestacnost", "obuv-pro-seniory",
    "nastavec-na-wc-pro-seniory", "sprchovaci-zidle-pro-seniory",
    "toaletni-zidle-pro-seniory", "madlo-k-wc-pro-seniory",
    "sedatko-do-vany-pro-seniory", "choditko-do-bytu-pro-seniory",
    "rollator-pro-seniory"
  ]) {
    assert.ok(footer.includes("'" + slug + "'"), "trust page missing: " + slug);
  }
  assert.match(footer, /is_front_page\(\) \|\| is_page\(/);
  assert.match(footer, /Externí odborná revize dosud není doložená/);
  assert.match(footer, /aria-labelledby="zp-editorial-trust-title"/);
  assert.match(footer, /\/jak-vznika-doporuceni\//);
  assert.match(style, /\.zp-editorial-trust-inner/);
  assert.match(read(".github/workflows/ci.yml"), /php -l page-jak-vznika-doporuceni\.php/);
});
