import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const functions=readFileSync(new URL("../functions.php",import.meta.url),"utf8");
const page=readFileSync(new URL("../page-jak-vznika-doporuceni.php",import.meta.url),"utf8");
test("methodology has a specific search description, not unverifiable clinical claims",()=>{
  const resource=functions.slice(functions.indexOf("function zaprazi_2_resource_description( $description )"),functions.indexOf("add_filter( 'wpseo_metadesc', 'zaprazi_2_resource_description'"));
  const desc=resource.match(/if \( is_page\( 'jak-vznika-doporuceni' \) \) \{\s*return '([^']+)';/);
  assert.ok(desc,"Description must be scoped to exact methodology slug");
  assert.ok(desc[1].length>=110 && desc[1].length<=165,"A practical readable snippet");
  assert.match(desc[1],/bezpečnostní omezení/);
  assert.match(desc[1],/zdroje údajů/);
  assert.match(page,/Externí odborná revize:/);
  assert.doesNotMatch(desc[1],/certifikov|klinicky ověřen|lékaři doporučují/i);
  assert.ok(functions.includes("add_filter( 'wpseo_metadesc', 'zaprazi_2_resource_description', 30 );"));
});
test("non-Yoast fallback applies to methodology only, without duplicating Yoast output",()=>{
  const part=functions.slice(functions.indexOf("function zaprazi_2_methodology_meta_fallback()"),functions.indexOf("add_action( 'wp_head', 'zaprazi_2_methodology_meta_fallback', 5 );"));
  assert.match(part,/is_page\( 'jak-vznika-doporuceni' \)/);
  assert.match(part,/defined\( 'WPSEO_VERSION' \)/);
  assert.match(part,/esc_attr\( zaprazi_2_resource_description\( '' \) \)/);
  assert.equal((part.match(/meta name="description"/g)||[]).length,1);
});
