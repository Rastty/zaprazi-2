import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const article = read("page-senior-spadl-doma.php");
const functions = read("functions.php");
const home = read("front-page.php");
const safety = read("page-bezpecny-byt-pro-seniora.php");
const night = read("page-nocni-cesta-z-postele-na-wc.php");
const search = read("src/seo/search-guidance.php");
const version = read("style.css").match(/^Version:\s*([\d.]+)$/m)?.[1];

test("Post-fall guide has unique problem intent and clear acute safety boundary", () => {
  assert.match(version, /^0\\.8\\.\\d+$/);\n  assert.ok(Number(version.split(".")[2]) >= 156, "Post-fall page exists from 0.8.156 onward");
  assert.ok(article.includes("ZP_RELEASE_" + version.replaceAll(".", "_")));
  assert.match(article, /Template Name: Zápraží — Senior spadl doma/);
  assert.equal((article.match(/<h1(?:\s|>)/g) || []).length, 1);
  for (const id of ["prvni-krok-pad", "plan-po-padu", "dalsi-krok-pad", "faq-pad", "zdroje-pad"]) {
    assert.ok(article.includes('id="' + id + '"'), id);
  }
  for (let n = 1; n <= 7; n++) assert.ok(article.includes(String(n).padStart(2, "0") + " ·"), "Step " + n);
  for (const phrase of ["Volejte 155", "násilně nezvedejte", "odbornou pomoc", "nezkoušejte ho sami vytahovat", "Nezávislá odborná revize textu zatím není doložena"]) {
    assert.ok(article.toLowerCase().includes(phrase.toLowerCase()), phrase);
  }
  assert.doesNotMatch(article, /<form\b|data-zp-merchant-link|data-zp-affiliate-target|Koupit nyní|ehub\.cz|desturl/i);
});

test("Sources and action paths are explicit and distinguish prevention vs actual fall", () => {
  for (const url of [
    "https://www.nzip.cz/clanek/205-zdravotnicka-zachranna-sluzba",
    "https://www.nhs.uk/conditions/falls/",
    "https://www.nzip.cz/clanek/1242-zlomenina-krcku-stehenni-kosti",
    "https://oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru-prevence-a-privolani-pomoci-po-padu/"
  ]) assert.ok(article.includes(url), url);
  for (const target of [
    "/choditka-pro-seniory/",
    "/nocni-cesta-z-postele-na-wc/#nocni-audit",
    "/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo",
    "/koupelna-a-wc/#poradce-koupelna",
    "/senior-nemuze-vstat-z-postele/#co-delat-postel",
    "/bezpecny-byt-pro-seniora/#audit-bytu"
  ]) assert.ok(article.includes(target), target);
});

test("Only missing slug is published, and only safe existing pages link in", () => {
  const start = functions.indexOf("function zaprazi_2_ensure_post_fall_page()");
  const end = functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_post_fall_page', 37 );", start);
  assert.ok(start > 0 && end > start);
  const publication = functions.slice(start, end);
  assert.match(publication, /get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(publication, /file_exists/);
  assert.match(publication, /wp_insert_post/);
  assert.doesNotMatch(publication, /wp_update_post|wp_delete_post|wp_trash_post/);
  assert.ok(publication.includes("page-senior-spadl-doma.php"));
  for (const [name, file] of [["homepage", home], ["safe-home", safety], ["night-wc", night]]) {
    assert.ok(file.includes("/senior-spadl-doma/#prvni-krok-pad"), name);
  }
  assert.match(functions, /is_page\( 'senior-spadl-doma' \)/);
  assert.match(functions, /zaprazi_2_post_fall_description_fallback/);
  assert.ok(search.includes("/senior-spadl-doma/#prvni-krok-pad"));
});

test("New page is in release-integrity manifest, while no diagnostic or merchant shortcut is added", () => {
  const list = functions.slice(functions.indexOf("function zaprazi_2_release_integrity_ok()"), functions.indexOf("function zaprazi_2_release_meta()"));
  assert.ok(list.includes("'page-senior-spadl-doma.php'"));
  assert.ok(functions.includes("define( 'ZAPRAZI_RELEASE', '" + version + "' );"));
  assert.doesNotMatch(article, /[?&](?:diagnosis|weight|patient|user)=|wp-json\/wp\/v2|sessionStorage|localStorage/);
});
