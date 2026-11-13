import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const functions=readFileSync(new URL("../functions.php",import.meta.url),"utf8");

test("two GSC-evidenced problem pages use concise, distinct and actionable SEO titles",()=>{
  const section=functions.split("function zaprazi_2_resource_title( $title ) {")[1]
    ?.split("\n  return $title;")[0];
  assert.ok(section,"Cannot find resource title filter");
  const titles=[
    ["prevoz-seniora-k-lekari", "Převoz seniora k lékaři: kdy je sanitka hrazená? | Zápraží"],
    ["senior-nemuze-vstat-z-postele", "Senior nemůže vstát z postele: co dělat bezpečně | Zápraží"]
  ];
  for(const [slug,title] of titles){
    assert.ok(section.includes(`if ( is_page( '${slug}' ) ) return '${title}';`),slug);
    assert.ok(title.length<=65,`Title too long: ${slug}`);
    assert.equal(section.split(`is_page( '${slug}' )`).length,2,`Duplicate SEO rule: ${slug}`);
  }
  assert.match(functions,/add_filter\( 'pre_get_document_title', 'zaprazi_2_resource_title', 30 \)/);
  assert.match(functions,/add_filter\( 'wpseo_title', 'zaprazi_2_resource_title', 30 \)/);
});

test("title experiment retains page-specific descriptions and unchanged medical/affiliate gates",()=>{
  assert.match(functions,/is_page\( 'prevoz-seniora-k-lekari' \) \) return 'Převoz seniora k lékaři: kdy požádat lékaře/);
  assert.match(functions,/is_page\( 'senior-nemuze-vstat-z-postele' \) \) return 'Senior nedokáže vstát z postele/);
  assert.doesNotMatch(functions,/Převoz seniora k lékaři: sanitka zdarma|Senior nemůže vstát z postele: nejlepší výrobek/);
});
