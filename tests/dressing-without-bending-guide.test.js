import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("page-oblekani-ponozek-a-kalhot-bez-ohybani.php");
const functions=read("functions.php");
function section(id) {
 const i=page.indexOf('id="'+id+'"');
 assert.ok(i>=0,"Missing section "+id);
 const a=page.lastIndexOf("<section",i),b=page.indexOf("</section>",i);
 assert.ok(a>=0&&b>i,"Malformed section "+id);
 return page.slice(a,b);
}
test("dressing guide solves distinct intents with clear practical steps and accessible structure",()=>{
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.match(page,/Jak si obléct ponožky a kalhoty bez ohýbání/);
 assert.equal((section("bezpecnost-oblekani").match(/class="zp-decision-card"/g)||[]).length,4);
 assert.equal((section("podle-problemu-oblekani").match(/class="zp-decision-card"/g)||[]).length,4);
 assert.equal((section("srovnani-pomucek-oblekani").match(/class="zp-decision-card"/g)||[]).length,4);
 assert.equal((section("postup-ponozky").match(/<li>/g)||[]).length,4);
 assert.equal((section("postup-kalhoty").match(/<li>/g)||[]).length,5);
 assert.equal((section("pred-vyberem-oblekani").match(/<li>/g)||[]).length,7);
 assert.equal((section("faq-oblekani").match(/<details>/g)||[]).length,6);
 for(const id of ["podle-problemu-oblekani","postup-ponozky","postup-kalhoty","pred-vyberem-oblekani","faq-oblekani"])
  assert.match(page,new RegExp("href=\"#"+id+"\"|id=\""+id+"\""));
});
test("dressing guide fails closed on unsafe transfer, health precautions and mismatched compression aids",()=>{
 for(const keyword of ["individuálním režimem","netvrďte, že pomůcka zajistí samostatnost",
   "kompresní punčochy","nestabilní sed","stání","zdravotníka",
   "náhl","ergoterapeut","návod má přednost","Externí odborná revize"]) {
   assert.ok(page.toLocaleLowerCase("cs").includes(keyword.toLocaleLowerCase("cs")),keyword);
 }
 assert.match(page,/pooperační|po operaci/);
 assert.doesNotMatch(page,/100 % bezpečn|zaručeně nejlepší|automaticky vhodn/i);
 assert.doesNotMatch(page,/data-zp-affiliate-target|data-zp-merchant-link|ehub\.cz\/system\/scripts\/click/i);
});
test("independent sources and safe navigation are included",()=>{
 const source=section("zdroje-oblekani");
 for(const domain of ["nemocniceprostejov.agel.cz","cuh.nhs.uk","guysandstthomas.nhs.uk","nbt.nhs.uk"])
  assert.ok(source.includes(domain),domain);
 for(const slug of ["/obuv-pro-seniory/#poradce-obuv","/otazky-pred-propustenim-z-nemocnice/#otazky-pred-propustenim",
   "/sobestacnost/#poradce-sobestacnost","/navrat-z-nemocnice/#plan-navratu"])
   assert.ok(page.includes(slug),slug);
});
test("WordPress publication is idempotent and never overwrites an existing page",()=>{
 const start=functions.indexOf("function zaprazi_2_ensure_dressing_without_bending_page()");
 const end=functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_dressing_without_bending_page'",start);
 assert.ok(start>=0&&end>start);
 const seed=functions.slice(start,end);
 for(const keyword of ["get_page_by_path( $slug, OBJECT, 'page' )","wp_insert_post","'post_status' => 'publish'",
   "'_wp_page_template' => 'page-oblekani-ponozek-a-kalhot-bez-ohybani.php'"])
    assert.ok(seed.includes(keyword),keyword);
 assert.doesNotMatch(seed,/wp_update_post|wp_delete_post|delete_post/);
 assert.match(functions,/function zaprazi_2_is_dressing_without_bending_page/);
 assert.match(functions,/function zaprazi_2_dressing_without_bending_meta_fallback/);
 assert.match(functions,/defined\( 'WPSEO_VERSION' \)/);
 assert.match(functions,/Ponožky a kalhoty bez ohýbání: pomůcky \| Zápraží/);
});
test("staged discovery has four independent inbound guides and release protection",()=>{
 for(const f of ["page-sobestacnost.php","page-obuv-pro-seniory.php","page-navrat-z-nemocnice.php","page-otazky-pred-propustenim-z-nemocnice.php"]){
  assert.ok(read(f).includes("/oblekani-ponozek-a-kalhot-bez-ohybani/#podle-problemu-oblekani"),f);
 }
 assert.match(functions,/'page-oblekani-ponozek-a-kalhot-bez-ohybani.php'/);
 const sitemap=read("scripts/audit-public-sitemap.mjs");
 const staged=sitemap.split("export const stagedDecisionPaths")[1].split("]);")[0];
 assert.ok(staged.includes('"/oblekani-ponozek-a-kalhot-bez-ohybani/"'));
 const required=sitemap.split("export const requiredDecisionPaths")[1].split("]);")[0];
 assert.ok(!required.includes('"/oblekani-ponozek-a-kalhot-bez-ohybani/"'));
 const ver=read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];
 assert.ok(ver);
 assert.ok(page.includes("ZP_RELEASE_"+ver.replaceAll(".","_")));
 assert.match(read("style.css"),/\.zp-guide-steps/);
});
