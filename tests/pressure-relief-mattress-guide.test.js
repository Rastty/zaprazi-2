import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const page=read("page-antidekubitni-matrace-na-polohovaci-postel.php");
function section(id){
 const at=page.indexOf('id="'+id+'"'),start=page.lastIndexOf("<section",at),end=page.indexOf("</section>",at);
 assert.ok(at>0&&start>=0&&end>at,"Missing or malformed section "+id);
 return page.slice(start,end);
}
test("clinical safety gates precede selection; no medical product shortcut",()=>{
 const s=section("rozhodnuti-antidekubitni-matrace");
 assert.equal((s.match(/class="zp-decision-card"/g)||[]).length,4);
 for(const p of ["poškozenou kůži","dlouho na lůžku","polohovací posteli","Matrace je určená odborníkem",
 "žádný typ matrace není automatickou léčbou","konkrétní produkt nedoporučujeme"])
  assert.ok(s.includes(p),p);
 assert.doesNotMatch(page,/data-zp-affiliate-target|data-zp-merchant-link|ehub\.cz\/system\/scripts\/click|Koupit nyní/i);
});
test("mattress format, dimensions, examples and worksheets answer practical search intent",()=>{
 assert.equal((section("typy-antidekubitnich-matraci").match(/class="zp-decision-card"/g)||[]).length,3);
 assert.equal((section("rozmery-kompatibilita-matrace").match(/class="zp-decision-card"/g)||[]).length,8);
 assert.equal((section("priklady-matrace-postel").match(/class="zp-decision-card"/g)||[]).length,2);
 assert.equal((section("pracovni-list-matrace").match(/<li>/g)||[]).length,7);
 const faqs=section("faq-antidekubitni-matrace");
 assert.equal((faqs.match(/<details>/g)||[]).length,7);
 for(const p of ["Musí mít antidekubitní matrace kompresor","90 × 200 cm","Pomůže antidekubitní matrace sama","pojišťovna"])assert.ok(faqs.includes(p),p);
 assert.match(page,/19 cm/);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.match(page,/NICE/);
 assert.match(page,/internationalguideline\.com/);
 assert.match(page,/sukl\.gov\.cz/);
});
test("page is safely published, protected and linked from related advice",()=>{
 const php=read("functions.php");
 for(const word of ["'page-antidekubitni-matrace-na-polohovaci-postel.php'",
  "zaprazi_2_ensure_pressure_relief_mattress_page","zaprazi_pressure_relief_mattress_page_v1",
  "zaprazi_2_is_pressure_relief_mattress_page","get_page_by_path( $slug, OBJECT, 'page' )"])
  assert.ok(php.includes(word),word);
 assert.match(read("scripts/audit-public-sitemap.mjs"),/\/antidekubitni-matrace-na-polohovaci-postel\//);
 for(const [path,anchor] of [
  ["page-polohovaci-postel.php","rozmery-kompatibilita-matrace"],
  ["page-polohovaci-postel-na-pojistovnu.php","rozhodnuti-antidekubitni-matrace"],
  ["page-navrat-z-nemocnice.php","pracovni-list-matrace"],
  ["page-bezpecny-byt-pro-seniora.php","typy-antidekubitnich-matraci"]
 ]){
  assert.ok(read(path).includes("/antidekubitni-matrace-na-polohovaci-postel/#"+anchor),
   "Missing contextual guide inbound from "+path);
 }
 assert.match(page,/\/polohovaci-postel\/#poradce-postel/);
 assert.match(page,/\/polohovaci-postel-na-pojistovnu\//);
});
