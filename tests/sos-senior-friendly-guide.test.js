import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("page-senior-doma-sam-sos-pomoc.php"),fn=read("functions.php"),home=read("front-page.php"),css=read("style.css"),svg=read("assets/illustrations/doma-v-bezpeci.svg");
function section(id){const i=page.indexOf('id="'+id+'"');assert.ok(i>=0,"Missing "+id);const a=page.lastIndexOf("<section",i),b=page.indexOf("</section>",i);assert.ok(a>=0&&b>i,"Malformed "+id);return page.slice(a,b)}
test("SOS guide uses precise problem-first distinctions and actionable chain of response",()=>{
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.match(page,/Senior žije sám: jak si přivolá pomoc/);
 assert.equal((section("krize-a-bezpeci").match(/class="zp-decision-card"/g)||[]).length,2);
 assert.equal((section("vyber-sos-pomoci").match(/class="zp-decision-card"/g)||[]).length,4);
 assert.equal((section("jak-overit-sluzbu-sos").match(/class="zp-decision-card"/g)||[]).length,3);
 assert.equal((section("navazujici-pomoc-sos").match(/class="zp-decision-card"/g)||[]).length,3);
 assert.equal((section("sos-kontrolni-seznam").match(/<li>/g)||[]).length,9);
 assert.equal((section("faq-sos-senior").match(/<details>/g)||[]).length,6);
 assert.equal((section("jak-funguje-pomoc-sos").match(/class="zp-sos-flow-item"/g)||[]).length,3);
 for(const q of ["tísňová péče","SMS","mobilní pokrytí","baterie","registru MPSV","155"]){
   assert.ok(page.toLocaleLowerCase("cs").includes(q.toLocaleLowerCase("cs")),q);
 }
});
test("No unsafe medical, commercial or surveillance claims; fail closed when no receiver",()=>{
 for(const s of ["neznamená přijetí pomoci","detekce pádu","falešná hlášení","není to záruka","registrovaná sociální služba","nevolejte 155 jen kvůli zkoušce"]){
  assert.ok(page.toLocaleLowerCase("cs").includes(s.toLocaleLowerCase("cs")),s);
 }
 assert.doesNotMatch(page,/garantovan[ýá] zásah|stoprocentně spolehliv[ýá]\.|nejlevnější SOS|zdarma od pojišťovny/i);
 assert.doesNotMatch(page,/data-zp-affiliate-target|data-zp-merchant-link|adsbygoogle|gtag\(/);
 for(const host of ["mpsv.gov.cz","www.nhs.uk","www.praha7.cz"]) assert.ok(page.includes(host),host);
});
test("SOS page publication never overwrites existing editorial content",()=>{
 const a=fn.indexOf("function zaprazi_2_ensure_senior_sos_page()");
 const b=fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_senior_sos_page'",a);
 assert.ok(a>=0&&b>a);const seed=fn.slice(a,b);
 for(const s of ["get_page_by_path( $slug, OBJECT, 'page' )","wp_insert_post","'post_status' => 'publish'","page-senior-doma-sam-sos-pomoc.php"])
   assert.ok(seed.includes(s),s);
 assert.doesNotMatch(seed,/wp_update_post|wp_delete_post|delete_post/);
 assert.match(fn,/function zaprazi_2_is_senior_sos_page/);
 assert.match(fn,/function zaprazi_2_senior_sos_meta_fallback/);
 assert.match(fn,/defined\( 'WPSEO_VERSION' \)/);
 assert.match(fn,/Senior žije sám: SOS tlačítko, hodinky či tísňová péče/);
});
test("Original responsive first-party illustration used on homepage and guide, no remote asset",()=>{
 assert.match(svg,/^<svg[^>]+viewBox="0 0 720 510"/);
 assert.match(svg,/<title id="t">/);
 assert.match(svg,/<desc id="d">/);
 assert.doesNotMatch(svg,/<(?:script|foreignObject|image)\b/i);
 assert.doesNotMatch(svg,/https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
 for(const p of [page,home]){
  assert.ok(p.includes("/assets/illustrations/doma-v-bezpeci.svg"),"Missing original illustration");
  assert.match(p,/width="720" height="510"/);
  assert.match(p,/<figure class="zp-hero-art">/);
  assert.match(p,/alt="[^"]{30,}"/);
 }
 for(const selector of [".zp-illustrated-hero",".zp-hero-layout",".zp-hero-art img",".zp-sos-flow",".zp-sos-flow-item"]){
  assert.ok(css.includes(selector),selector);
 }
 assert.match(css,/@media\(max-width:820px\)/);
 assert.match(home,/href="<\?php echo esc_url\( home_url\( '\/senior-doma-sam-sos-pomoc\/#vyber-sos-pomoci' \) \); \?>"/);
});
test("New page has three existing independent inbound sources and staged sitemap",()=>{
 for(const f of ["page-senior-spadl-doma.php","page-bezpecny-byt-pro-seniora.php","page-nocni-cesta-z-postele-na-wc.php"]){
  assert.ok(read(f).includes("/senior-doma-sam-sos-pomoc/#vyber-sos-pomoci"),f);
 }
 for(const href of ["/senior-spadl-doma/#plan-po-padu","/nocni-cesta-z-postele-na-wc/#nocni-audit","/bezpecny-byt-pro-seniora/#audit-bytu"])
  assert.ok(page.includes(href),href);
 const map=read("scripts/audit-public-sitemap.mjs");
 assert.ok(map.split("export const stagedDecisionPaths")[1].split("]);")[0].includes('"/senior-doma-sam-sos-pomoc/"'));
 assert.ok(!map.split("export const requiredDecisionPaths")[1].split("]);")[0].includes('"/senior-doma-sam-sos-pomoc/"'));
 const v=css.match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];assert.ok(v);
 assert.ok(page.includes("ZP_RELEASE_"+v.replaceAll(".","_")));
 assert.match(fn,/'page-senior-doma-sam-sos-pomoc.php'/);
});
