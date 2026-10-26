import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const functions=read("functions.php"),home=read("front-page.php");
const pages=[
 {slug:"prahy-pro-choditko-a-vozik",path:"page-prahy-pro-choditko-a-vozik.php",section:"mereni-prahu",parent:"page-bezpecny-byt-pro-seniora.php",other:"page-choditka-pro-seniory.php",
 sources:["oporadiakonie.cz","livingmadeeasy.org.uk","sensorytrust.org.uk"],targets:["/choditko-do-bytu-pro-seniory/#poradce-choditko-byt","/projede-invalidni-vozik-dvermi/","/schody-pro-seniora-doma/#plan-schody"],warnings:["Nezávislá odborná revize","nezkoušejte"]},
 {slug:"sprchova-zidle-maly-kout-80x80",path:"page-sprchova-zidle-maly-kout-80x80.php",section:"sedm-mereni-sprchy",parent:"page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php",other:"page-koupelna-a-wc.php",
 sources:["nzip.cz","oporadiakonie.cz","huppe.cz"],targets:["/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha","/koupelna-a-wc/#poradce-koupelna"],warnings:["odborné","nevkládejte"]}
];
test("Both original problem-solving articles provide substantive steps and verified public sources",()=>{
 for(const item of pages) {
  const src=read(item.path);
  assert.ok(src.length>=11000,item.slug+" too thin");
  assert.match(src,/ZP_RELEASE_0_8_159/);
  assert.equal((src.match(/<h1\b/g)||[]).length,1,"one intent H1");
  assert.equal((src.match(/<main\b/g)||[]).length,1);
  assert.equal((src.match(/<\/main>/g)||[]).length,1);
  assert.ok(src.includes('id="'+item.section+'"'),"missing entry anchor");
  assert.ok((src.match(/class="zp-check-grid"/g)||[]).length>=1);
  for(let n=1;n<=7;n++)assert.ok(src.includes("<span>"+String(n).padStart(2,"0")+"</span>"),"missing measure "+n);
  for(const source of item.sources)assert.ok(src.includes(source),"unattributed source "+source);
  for(const target of item.targets)assert.ok(src.includes(target),"missing safe journey "+target);
  for(const warning of item.warnings)assert.ok(src.toLowerCase().includes(warning.toLowerCase()),"missing safety "+warning);
  assert.ok((src.match(/<details><summary>/g)||[]).length>=5,"needs genuine use-case FAQ");
  assert.doesNotMatch(src,/<form\b|wp-json\/wp\/v2|data-zp-merchant-link|data-zp-affiliate-target|click\.php|desturl=|Koupit nyní/i);
  assert.doesNotMatch(src,/diagnostiku určíme|zaručeně bezpečn|garantovan[áé] úhrada/i);
 }
});

test("Every guide is discoverable through natural editorial links, not a hidden URL",()=>{
 for(const item of pages){
  const target="/"+item.slug+"/#"+item.section;
  for(const [name,src] of [["homepage",home],["source",read(item.parent)],["second source",read(item.other)]]){
   assert.ok(src.includes("home_url( '"+target+"' )"),name+" missing "+target);
  }
 }
});
test("Publishing never changes a legacy article and supports both Yoast and no-Yoast descriptions",()=>{
 const begin=functions.indexOf("function zaprazi_2_ensure_problem_articles_v159()");
 const end=functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_problem_articles_v159', 38 );",begin);
 assert.ok(begin>0&&end>begin);
 const publisher=functions.slice(begin,end);
 for(const item of pages){
  assert.ok(publisher.includes("'"+item.slug+"'"));
  assert.ok(publisher.includes("'"+item.path+"'"));
  assert.ok(functions.includes("is_page( '"+item.slug+"' )"));
  assert.ok(functions.includes("'"+item.path+"'"));
 }
 assert.match(publisher,/get_page_by_path\(\s*\$slug,\s*OBJECT,\s*'page'\s*\)/);
 assert.match(publisher,/file_exists/);
 assert.match(publisher,/wp_insert_post/);
 assert.doesNotMatch(publisher,/wp_update_post|wp_delete_post|wp_trash_post|update_post_meta/);
 assert.match(functions,/zaprazi_2_problem_articles_meta_fallback/);
 assert.match(functions,/defined\( 'WPSEO_VERSION' \)/);
});
