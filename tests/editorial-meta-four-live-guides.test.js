import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const functions = read("functions.php");
const resource = functions.slice(
  functions.indexOf("function zaprazi_2_resource_description( $description )"),
  functions.indexOf("add_filter( 'wpseo_metadesc', 'zaprazi_2_resource_description', 30 );")
);
const fallback = functions.slice(
  functions.indexOf("function zaprazi_2_four_editorial_meta_fallback()"),
  functions.indexOf("add_action( 'wp_head', 'zaprazi_2_four_editorial_meta_fallback', 5 );")
);
const routes = [
  ["prevoz-seniora-k-lekari", /zdravotnickou dopravu|zdravotnické dopravy/i],
  ["senior-nestihne-dojit-na-wc", /varovné příznaky/i],
  ["prispevek-na-peci-pro-seniora", /sociální šetření/i],
  ["jak-vybrat-pecovatelskou-sluzbu", /registr MPSV/i],
];

test("Four independently published problem guides have distinct safe Yoast descriptions", () => {
  assert.ok(resource.startsWith("function zaprazi_2_resource_description"));
  const seen = new Set();
  for (const [slug, intent] of routes) {
    assert.ok(read("page-" + slug + ".php").includes("get_header()"), slug + " has a real page template");
    const match = resource.match(new RegExp("if \\( is_page\\( '" + slug + "' \\) \\) return '([^']+)';"));
    assert.ok(match, "Missing scoped Yoast description for " + slug);
    const description = match[1];
    assert.ok(description.length >= 110 && description.length <= 165, slug + " description length");
    assert.match(description, intent, slug + " must describe its own intent");
    assert.doesNotMatch(description, /zaručen[áý]|automatický nárok|klinicky ověřen|nejlevnější|sleva|kupte hned/i);
    assert.ok(!seen.has(description), "Each guide needs a unique description");
    seen.add(description);
  }
  assert.ok(functions.includes("add_filter( 'wpseo_metadesc', 'zaprazi_2_resource_description', 30 );"));
});

test("Without Yoast emit exactly one escaped tag for only those four routes", () => {
  assert.ok(fallback.startsWith("function zaprazi_2_four_editorial_meta_fallback"));
  assert.match(fallback, /defined\( 'WPSEO_VERSION' \)/);
  assert.match(fallback, /is_page\( array\(/);
  assert.match(fallback, /esc_attr\( zaprazi_2_resource_description\( '' \) \)/);
  assert.equal((fallback.match(/meta name="description"/g) || []).length, 1);
  for (const [slug] of routes) {
    assert.equal((fallback.split("'" + slug + "'").length - 1), 1, "Scoped fallback " + slug);
  }
  assert.ok(functions.includes("add_action( 'wp_head', 'zaprazi_2_four_editorial_meta_fallback', 5 );"));
});
