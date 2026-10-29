import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page = read("page-nastupovani-seniora-do-auta.php");
const fn=read("functions.php");
function section(id) {
 const i=page.indexOf('id="'+id+'"');
 assert.ok(i>=0,"Missing section "+id);
 const a=page.lastIndexOf("<section",i),b=page.indexOf("</section>",i);
 assert.ok(a>=0&&b>i,"Malformed "+id);
 return page.slice(a,b);
}
test("independent car entry problem guide resolves precise movement steps without product-first claims",()=>{
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.match(page,/Jak pomoci seniorovi nastoupit a vystoupit z auta/);
 for(const id of ["bezpecnost-nastupovani-auto","situace-nastupovani-auto","srovnani-pomucek-auto"])
  assert.equal((section(id).match(/class="zp-decision-card"/g)||[]).length,4,id);
 assert.equal((section("bezpecny-postup-auto").match(/<li>/g)||[]).length,7);
 assert.equal((section("sedm-mereni-auto").match(/<li>/g)||[]).length,7);
 assert.equal((section("faq-nastupovani-auto").match(/<details>/g)||[]).length,6);
 for(const s of ["otočný podsedák","přenosné madlo","nohy přes práh","přesun z vozíku"])
  assert.ok(page.toLocaleLowerCase("cs").includes(s.toLocaleLowerCase("cs")),s);
});
test("car access blocks unsafe transfers, slipping while driving, unverified load and universal compatibility",()=>{
 for(const s of [
  "Nepřetahujte člověka za paže","žádná pomůcka sama nezaručí",
  "kompatibilitu","Nejezděte na volně klouzající podložce",
  "Nejde o návod k zvedání nesoběstačného člověka",
  "bezpečnostního pásu","parkovací brzdou",
  "není náhradou","Externí odborná revize"
 ]) assert.ok(page.toLocaleLowerCase("cs").includes(s.toLocaleLowerCase("cs")),s);
 assert.doesNotMatch(page,/100 % bezpečné|vhodný pro každý vůz|garantuje pomoc/i);
 assert.doesNotMatch(page,/data-zp-affiliate-target|data-zp-merchant-link|ehub\.cz\/system\/scripts\/click/);
});
test("sources include RCOT, RiDC, NHS and Czech traffic safety authority",()=>{
 const s=section("zdroje-nastupovani-auto");
 for(const source of ["rcot.co.uk","ridc.org.uk","nhs.uk","besip.gov.cz"]) assert.ok(s.includes(source),source);
 for(const target of [
  "/navrat-z-nemocnice/#plan-navratu",
  "/invalidni-vozik-do-auta/#rozhodnuti-vozik-auto",
  "/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo",
  "/otazky-pred-propustenim-z-nemocnice/#otazky-pred-propustenim"
 ]) assert.ok(page.includes(target),target);
});
test("WP creates only a new page and has exact Yoast and fallback SEO metadata",()=>{
 const start=fn.indexOf("function zaprazi_2_ensure_senior_car_access_page()");
 const end=fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_senior_car_access_page'",start);
 assert.ok(start>=0&&end>start);
 const seed=fn.slice(start,end);
 for(const s of ["get_page_by_path( $slug, OBJECT, 'page' )","wp_insert_post",
   "'post_status' => 'publish'","'post_name' => $slug",
   "'_wp_page_template' => 'page-nastupovani-seniora-do-auta.php'"]) assert.ok(seed.includes(s),s);
 assert.doesNotMatch(seed,/wp_update_post|delete_post/);
 assert.match(fn,/function zaprazi_2_is_senior_car_access_page/);
 assert.match(fn,/function zaprazi_2_senior_car_access_meta_fallback/);
 assert.match(fn,/defined\( 'WPSEO_VERSION' \)/);
 assert.match(fn,/Nastupování seniora do auta: bezpečné pomůcky \| Zápraží/);
});
test("new long tail route remains staged until deployment and four inbound pages explain context",()=>{
 for(const path of ["page-navrat-z-nemocnice.php","page-invalidni-vozik-do-auta.php",
 "page-vstavani-z-kresla-pro-seniora.php","page-otazky-pred-propustenim-z-nemocnice.php"])
  assert.ok(read(path).includes("/nastupovani-seniora-do-auta/#situace-nastupovani-auto"),path);
 const map=read("scripts/audit-public-sitemap.mjs");
 const requiredCopy=map.split("export const requiredDecisionPaths")[1].split("]);")[0];
 const required=map.split("export const requiredDecisionPaths")[1].split("]);")[0];
 assert.ok(requiredCopy.includes('"/nastupovani-seniora-do-auta/"'));
 assert.ok(required.includes('"/nastupovani-seniora-do-auta/"'));
 assert.match(fn,/'page-nastupovani-seniora-do-auta.php'/);
 const version=read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];
 assert.ok(version);
 assert.ok(page.includes("ZP_RELEASE_"+version.replaceAll(".","_")));
});
