import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const functions=read("functions.php");
const pages=[
 {slug:"madlo-na-sadrokarton-u-wc",template:"page-madlo-na-sadrokarton-u-wc.php",entry:"kontroly-madla-sadrokarton",
  inbound:["page-madlo-k-wc-pro-seniory.php","page-koupelna-a-wc.php","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"],
  outs:["/madlo-k-wc-pro-seniory/#poradce-opora-wc","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc"],
  source:["kentcht.nhs.uk","garaventalift.cz","osobni-asistence.cz"]},
 {slug:"toaletni-zidle-vedle-postele",template:"page-toaletni-zidle-vedle-postele.php",entry:"sedm-kontrol-zidle-postel",
  inbound:["page-toaletni-zidle-pro-seniory.php","page-nocni-cesta-z-postele-na-wc.php","page-navrat-z-nemocnice.php"],
  outs:["/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle","/nocni-cesta-z-postele-na-wc/#nocni-audit"],
  source:["healthlinkbc.ca","fsfhg.health.wa.gov.au","invira.cz"]}
];
test("Two independent narrow buyer-problem articles have safety-first standalone editorial value",()=>{
 for(const spec of pages){
  const body=read(spec.template);
  assert.ok(body.length>11500,"Insufficient guide depth: "+spec.slug);
  const released=read("style.css").split("\n").find(line=>line.startsWith("Version: "))?.slice(9)?.trim();
  assert.ok(released && Number(released.split(".")[2]) >= 160);
  assert.ok(body.includes("ZP_RELEASE_"+released.replaceAll(".","_")));
  assert.equal((body.match(/<h1\b/g)||[]).length,1);
  assert.ok(body.includes('id="'+spec.entry+'"'));
  assert.equal((body.match(/<span>0[1-7]<\/span>/g)||[]).length,7);
  assert.ok((body.match(/<details><summary>/g)||[]).length>=5);
  for(const target of spec.outs)assert.ok(body.includes(target),"Missing safe advisor "+target);
  for(const source of spec.source)assert.ok(body.includes(source),"Missing evidence link "+source);
  assert.doesNotMatch(body,/<form\b|data-zp-merchant-link|data-zp-affiliate-target|desturl=|ehub[.]cz|Koupit nyní/i);
  assert.match(body,/nezávisl[áé]|nezávisle/i,"Review transparency missing");
 }
});
test("Each new article has three already-established editorial entry points",()=>{
 for(const spec of pages){
  const literal="home_url( '/"+spec.slug+"/#"+spec.entry+"' )";
  for(const name of spec.inbound)assert.ok(read(name).includes(literal),"Missing contextual inbound from "+name);
 }
});
test("Publisher creates only unused WordPress slugs, never edits existing pages or legacy posts",()=>{
 const i=functions.indexOf("function zaprazi_2_ensure_problem_articles_v160()");
 const j=functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_problem_articles_v160', 39 );",i);
 assert.ok(i>0 && j>i);
 const scope=functions.slice(i,j);
 assert.match(scope,/get_page_by_path\(\s*\$slug,\s*OBJECT,\s*'page'\s*\)/);
 assert.match(scope,/file_exists/);
 assert.match(scope,/wp_insert_post/);
 assert.doesNotMatch(scope,/wp_update_post|wp_delete_post|wp_trash_post|update_post_meta/);
 for(const s of pages) {
  assert.ok(scope.includes("'"+s.slug+"'"));
  assert.ok(scope.includes("'"+s.template+"'"));
  assert.ok(functions.includes("is_page( '"+s.slug+"' )"));
 }
 assert.match(functions,/zaprazi_2_problem_articles_160_meta_fallback/);
 assert.match(functions,/defined\( 'WPSEO_VERSION' \)/);
});
