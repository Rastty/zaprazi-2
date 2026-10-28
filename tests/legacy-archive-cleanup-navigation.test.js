import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const footer=read("footer.php"),css=read("style.css"),fn=read("functions.php");
test("retired old archives are not linked from the universal footer",()=>{
 assert.ok(footer.includes("Hlavní poradci"));
 for(const path of ["/choditka-pro-seniory/","/koupelna-a-wc/","/bezpecny-byt-pro-seniora/"])
  assert.ok(footer.includes(path));
 assert.doesNotMatch(footer,/Starší archiv|zp-footer-legacy|legacy_categories|get_categories\(|Starší katalog produktů/);
 assert.ok(css.includes("grid-template-columns:.9fr 1.35fr 1.5fr"));
 assert.doesNotMatch(css,/zp-footer-legacy/);
});
test("legacy category and tag sitemap routes are excluded, not senior-focused Pages",()=>{
 assert.ok(fn.includes("return is_category() || is_tag();"));
 assert.ok(fn.includes("add_filter( 'wpseo_robots'"));
 assert.ok(fn.includes("add_filter( 'wpseo_robots_array'"));
 assert.ok(fn.includes("add_filter( 'wp_robots'"));
 assert.ok(fn.includes("add_filter( 'wpseo_sitemap_exclude_taxonomy'"));
 assert.ok(fn.includes("in_array( $taxonomy, array( 'category', 'post_tag' ), true )"));
 assert.match(fn,/\\? 'noindex, follow' : \\$robots/);
 assert.doesNotMatch(fn.slice(fn.indexOf("SEO housekeeping after archival cleanup")),/wp_delete_post|wp_trash_post|post_status\\s*=|wp_redirect/);
});
