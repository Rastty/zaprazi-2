import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("page-senior-malo-pije.php"),fn=read("functions.php");
function section(id){const i=page.indexOf('id="'+id+'"');assert.ok(i>=0,"Missing "+id);const a=page.lastIndexOf("<section",i),b=page.indexOf("</section>",i);assert.ok(a>=0&&b>i,"Malformed "+id);return page.slice(a,b);}
test("Fluid safety, content structure and limits are explicit",()=>{
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 for(const [id,n,pattern] of [["varovne-priznaky-malo-pije",4,/class="zp-decision-card"/g],["proc-senior-malo-pije",4,/class="zp-decision-card"/g],["pomucky-pro-piti",4,/class="zp-decision-card"/g],["sedm-kroku-pitny-rezim",7,/<li>/g],["denni-kontrola-piti",8,/<li>/g],["faq-senior-malo-pije",6,/<details>/g]])assert.equal((section(id).match(pattern)||[]).length,n,id);
 for(const s of ["volejte 155","omezený","zahušťování","zakuckává","Neexistuje bezpečná univerzální norma","nepodávejte ústy"])assert.ok(page.toLocaleLowerCase("cs").includes(s.toLocaleLowerCase("cs")),s);
 assert.doesNotMatch(page,/data-zp-merchant-link|data-zp-affiliate-target|100 % účinné/);
});
test("evidence, inbound journeys and real decision routes",()=>{
 const sources=section("zdroje-senior-malo-pije");
 for(const s of ["nzip.cz/clanek/2488","nzip.cz/clanek/1281","nhs.uk/conditions/dehydration","nzip.cz/clanek/344"])assert.ok(sources.includes(s),s);
 for(const s of ["/sobestacnost/#poradce-sobestacnost","/nocni-cesta-z-postele-na-wc/#nocni-audit","/senior-nemuze-vstat-z-postele/#co-delat-postel"])assert.ok(page.includes(s),s);
 for(const s of ["front-page.php","page-sobestacnost.php","page-nocni-cesta-z-postele-na-wc.php"])assert.ok(read(s).includes("/senior-malo-pije/#"),s);
});
test("WP creates fresh slug only, SEO fallback, required sitemap, release marker",()=>{
 const start=fn.indexOf("function zaprazi_2_ensure_low_fluid_intake_page()"),end=fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_low_fluid_intake_page'",start);
 assert.ok(start>=0 && end>start);
 const seed=fn.slice(start,end);
 for(const s of ["get_page_by_path( $slug, OBJECT, 'page' )","wp_insert_post","page-senior-malo-pije.php","post_name","post_status"])assert.ok(seed.includes(s),s);
 assert.doesNotMatch(seed,/wp_update_post|delete_post/);
 assert.match(fn,/function zaprazi_2_low_fluid_intake_meta_fallback/);
 const sitemap=read("scripts/audit-public-sitemap.mjs");
 assert.ok(sitemap.split("export const requiredDecisionPaths")[1].split("]);")[0].includes('"/senior-malo-pije/"'));
 assert.ok(sitemap.split("export const requiredDecisionPaths")[1].split("]);")[0].includes('"/senior-malo-pije/"'));
 const version=read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];
 assert.ok(page.includes("ZP_RELEASE_"+version.replaceAll(".","_")));
});
