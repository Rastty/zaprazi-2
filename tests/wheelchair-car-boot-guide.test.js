import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("page-invalidni-vozik-do-auta.php");
function section(id){
  const pos=page.indexOf('id="'+id+'"'),start=page.lastIndexOf("<section",pos),end=page.indexOf("</section>",pos);
  assert.ok(start>=0 && pos>=start && end>pos,"Missing or malformed "+id);
  return page.slice(start,end);
}
test("wheelchair car guide helps decide safely before considering a candidate",()=>{
 const s=section("rozhodnuti-vozik-auto");
 assert.equal((s.match(/class="zp-decision-card"/g)||[]).length,4);
 for(const phrase of ["bezpečně přesunout na sedadlo auta","nevejde otvorem",
   "naložení je příliš těžké","lze bezpečně ověřit","prázdný složený vozík",
   "cestovat přímo ve vozíku","kvalifikovanou osobou","odborné"]){
   assert.ok(s.includes(phrase),"Missing decision safety copy: "+phrase);
 }
 assert.doesNotMatch(s,/data-zp-affiliate-target|data-zp-merchant-link|Koupit nyní|ehub\.cz\/system\/scripts\/click/i);
});
test("measurements, two-model worksheet, product types, FAQs and sources are comprehensive",()=>{
 const measurements=section("mereni-kufru-vozik");
 for(let n=1;n<=7;n++)assert.match(measurements,new RegExp("0"+n+" ·"));
 assert.equal((measurements.match(/class="zp-decision-card"/g)||[]).length,7);
 assert.equal((section("pracovni-list-vozik-auto").match(/class="zp-decision-card"/g)||[]).length,3);
 assert.equal((section("rozdily-voziku-auto").match(/class="zp-decision-card"/g)||[]).length,3);
 const faq=section("faq-vozik-do-auta");
 assert.equal((faq.match(/<details>/g)||[]).length,6);
 assert.match(faq,/Škody Octavia nebo Fabia/);
 assert.match(faq,/Kolik váží skládací invalidní vozík/);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 for(const id of ["rozhodnuti-vozik-auto","mereni-kufru-vozik",
  "pracovni-list-vozik-auto","bezpecny-prevoz-voziku","faq-vozik-do-auta",
  "zdroje-vozik-auto"])assert.ok(page.includes('id="'+id+'"'),id);
 const sources=section("zdroje-vozik-auto");
 assert.match(sources,/leedsth\.nhs\.uk/);
 assert.match(sources,/motability\.co\.uk/);
 assert.match(sources,/externí odbornou revizi.*nemáme|Nemáme doloženou externí odbornou revizi/);
});
test("new page will publish only when missing and has sitemap and safe inbound links",()=>{
 const fn=read("functions.php");
 assert.match(fn,/'page-invalidni-vozik-do-auta\.php'/);
 assert.match(fn,/function zaprazi_2_ensure_wheelchair_car_guide\(\)/);
 assert.match(fn,/get_page_by_path\( \$slug, OBJECT, 'page' \)/);
 assert.match(fn,/zaprazi_wheelchair_car_guide_v1/);
 assert.match(fn,/wp_insert_post/);
 assert.match(fn,/zaprazi_2_is_wheelchair_car_guide/);
 assert.match(fn,/Invalidní vozík do auta: vejde se do kufru\?/);
 assert.match(read("scripts/audit-public-sitemap.mjs"),/\/invalidni-vozik-do-auta\//);
 assert.match(read("page-invalidni-vozik.php"),/invalidni-vozik-do-auta\/#rozhodnuti-vozik-auto/);
 assert.match(read("page-navrat-z-nemocnice.php"),/invalidni-vozik-do-auta\/#mereni-kufru-vozik/);
 assert.match(page,/invalidni-vozik\/#poradce-vozik/);
 assert.match(page,/projede-invalidni-vozik-dvermi\/#mereni-pruchodu/);
 assert.doesNotMatch(page,/data-zp-affiliate-target|data-zp-merchant-link/i);
});
