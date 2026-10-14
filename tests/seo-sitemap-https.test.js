import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/seo/https-sitemaps.php", import.meta.url), "utf8");

test("Public SEO scheme fix is output-only and restricted to five Yoast/robots filters", () => {
  for (const name of ["wpseo_sitemap_index_links", "wpseo_sitemap_entry", "robots_txt", "wpseo_canonical", "wpseo_opengraph_url"]) {
    assert.ok(source.includes("add_filter( '" + name + "'"), "Missing filter: " + name);
  }
  assert.doesNotMatch(source, /add_filter\(\s*'(home_url|site_url|option_home|option_siteurl)'/);
  assert.doesNotMatch(source, /update_option|wp_redirect|redirect_canonical|http_response_code/);
  const php = readFileSync(new URL("../functions.php", import.meta.url), "utf8");
  assert.match(php, /require_once \$zp_https_sitemaps_file/);
});

test("Actual PHP callback rewrites only our exact HTTP host and preserves metadata", () => {
  const php = [
    "define('ABSPATH', '/');",
    "$registered = array();",
    "function add_filter($name, $cb, $priority = 10, $args = 1) { global $registered; $registered[$name] = array($cb, $priority, $args); }",
    "require 'src/seo/https-sitemaps.php';",
    "$urls = array('http://zaprazi.cz/sitemap_index.xml', 'http://zaprazi.cz', 'http://zaprazi.cz.attacker.invalid/x', 'http://other.example/page', 'https://zaprazi.cz/ok', '/relative/');",
    "$index = zaprazi_2_https_sitemap_index_links(array(array('loc' => 'http://zaprazi.cz/page-sitemap.xml', 'mod' => 'keep'), array('loc' => 'https://other.example/sitemap.xml'), array('invalid' => 'keep')));",
    "$entry = zaprazi_2_https_sitemap_entry(array('loc' => 'http://zaprazi.cz/page/', 'lastmod' => '2026-10-11'));",
    "$robots = zaprazi_2_https_robots_sitemap(\"User-agent: *\nSitemap: http://zaprazi.cz/sitemap_index.xml\nSitemap: http://other.example/sitemap.xml\n\");",
    "echo json_encode(array('urls' => array_map('zaprazi_2_https_sitemap_url', $urls), 'index' => $index, 'entry' => $entry, 'robots' => $robots, 'registered' => $registered, 'false_entry' => zaprazi_2_https_sitemap_entry(false), 'false_index' => zaprazi_2_https_sitemap_index_links(false)));"
  ].join("\n");
  const result = JSON.parse(execFileSync("php", ["-r", php], {
    cwd: new URL("..", import.meta.url).pathname, encoding: "utf8"
  }));
  assert.deepEqual(result.urls, [
    "https://zaprazi.cz/sitemap_index.xml", "https://zaprazi.cz",
    "http://zaprazi.cz.attacker.invalid/x", "http://other.example/page",
    "https://zaprazi.cz/ok", "/relative/"
  ]);
  assert.deepEqual(result.index, [
    {loc: "https://zaprazi.cz/page-sitemap.xml", mod: "keep"},
    {loc: "https://other.example/sitemap.xml"}, {invalid: "keep"}
  ]);
  assert.deepEqual(result.entry, {loc: "https://zaprazi.cz/page/", lastmod: "2026-10-11"});
  assert.match(result.robots, /^Sitemap: https:\/\/zaprazi.cz\/sitemap_index\.xml$/m);
  assert.match(result.robots, /^Sitemap: http:\/\/other\.example\/sitemap\.xml$/m);
  assert.deepEqual(Object.keys(result.registered).sort(),
    ["wpseo_sitemap_index_links", "wpseo_sitemap_entry", "robots_txt", "wpseo_canonical", "wpseo_opengraph_url"].sort());
  assert.equal(result.registered.robots_txt[2], 2);
  assert.equal(result.registered.wpseo_canonical[0], "zaprazi_2_https_sitemap_url");
  assert.equal(result.registered.wpseo_opengraph_url[0], "zaprazi_2_https_sitemap_url");
  assert.equal(result.registered.wpseo_canonical[1], 9223372036854776000);
  assert.equal(result.false_entry, false);
  assert.equal(result.false_index, false);
});
