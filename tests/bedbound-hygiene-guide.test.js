import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("page-hygiena-leziciho-seniora-doma.php"),fn=read("functions.php");
function section(id){const idx=html.indexOf('id="'+id+'"');assert.ok(idx>=0,"Missing section "+id);const start=html.lastIndexOf("<section",idx),end=html.indexOf("</section>",idx);assert.ok(start>=0&&end>idx,id);return html.slice(start,end)}
test("hygiene home-care guide offers distinct choices, checklists and FAQ",()=>{
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/Jak zvládnout hygienu ležícího seniora doma/);
 for(const [id,cards] of [["bezpecnost-hygiena-na-luzku",4],["vyber-hygieny-na-luzku",4],["intimni-hygiena-na-luzku",3],["srovnani-hygienickych-pomucek",4]])
 assert.equal((section(id).match(/class="zp-decision-card"/g)||[]).length,cards,id);
 assert.equal((section("plan-hygieny-na-luzku").match(/<li>/g)||[]).length,7);
 assert.equal((section("checklist-hygiena-na-luzku").match(/<li>/g)||[]).length,8);
 assert.equal((section("faq-hygiena-na-luzku").match(/<details>/g)||[]).length,6);
 for(const id of ["vyber-hygieny-na-luzku","plan-hygieny-na-luzku","checklist-hygiena-na-luzku","zdroje-hygiena-na-luzku"])
   assert.ok(html.includes('href="#'+id+'"'),id);
});
test("safe handling and skin warning gates prevent untrained or coercive care",()=>{
 for(const needle of ["neotáčejte člověka silou","Nemasírujte zarudlé místo","zdravotníka",
   "domácí sestrou","zavolejte","zakrývejte právě nemyté","bezpečné polohy",
   "nevrstvěte do plenkových kalhotek","Externí odborná revize"]) {
  const variants=needle==="zavolejte"?["volejte 155"]:needle==="bezpečné polohy"?["bezpečné","polohy"]:[needle];
  assert.ok(variants.every(t=>html.toLocaleLowerCase("cs").includes(t.toLocaleLowerCase("cs"))),needle);
 }
 assert.doesNotMatch(html,/zaručeně nejlepší|garantuje bezpečnost|100\s*% bezpečné/i);
 assert.doesNotMatch(html,/data-zp-affiliate-target|data-zp-merchant-link|ehub\.cz\/system\/scripts\/click/i);
 assert.doesNotMatch(html,/<form\b|<input\b/i);
});
test("primary sources, crosslinked bed hygiene, pressure care and real advisors",()=>{
 const src=section("zdroje-hygiena-na-luzku");
 for(const domain of ["oporadiakonie.cz","nhs.uk/social-care-and-support","nzip.cz/clanek/1284","nhs.uk/conditions/pressure-sores","royalfree.nhs.uk"])
 assert.ok(src.includes(domain),domain);
 for(const path of ["/myti-vlasu-na-luzku/#vyber-myti-vlasu","/antidekubitni-matrace-na-polohovaci-postel/#rozhodnuti-antidekubitni-matrace",
  "/polohovaci-postel/#poradce-postel","/koupelna-a-wc/#poradce-koupelna",
  "/navrat-z-nemocnice/#plan-navratu"])
 assert.ok(html.includes(path),path);
});
test("one-time publication cannot overwrite legacy page or force merchant outcomes",()=>{
 const a=fn.indexOf("function zaprazi_2_ensure_bedbound_hygiene_page()");
 const b=fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_bedbound_hygiene_page'",a);
 assert.ok(a>=0&&b>a);
 const seed=fn.slice(a,b);
 for(const token of ["get_page_by_path( $slug, OBJECT, 'page' )","wp_insert_post","'post_status' => 'publish'","page-hygiena-leziciho-seniora-doma.php"])assert.ok(seed.includes(token),token);
 assert.doesNotMatch(seed,/wp_update_post|wp_delete_post|delete_post/);
 assert.match(fn,/function zaprazi_2_is_bedbound_hygiene_page/);
 assert.match(fn,/function zaprazi_2_bedbound_hygiene_meta_fallback/);
 assert.match(fn,/defined\( 'WPSEO_VERSION' \)/);
 assert.match(fn,/Hygiena ležícího seniora doma: praktický postup \| Zápraží/);
});
test("five inbound sources, required sitemap, versioned release inventory",()=>{
 for(const path of ["page-myti-vlasu-na-luzku.php","page-antidekubitni-matrace-na-polohovaci-postel.php","page-polohovaci-postel.php","page-navrat-z-nemocnice.php","page-koupelna-a-wc.php"])
 assert.ok(read(path).includes("/hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku"),path);
 const sitemap=read("scripts/audit-public-sitemap.mjs");
 assert.ok(sitemap.split("export const requiredDecisionPaths")[1].split("]);")[0].includes('"/hygiena-leziciho-seniora-doma/"'));
 assert.ok(sitemap.split("export const requiredDecisionPaths")[1].split("]);")[0].includes('"/hygiena-leziciho-seniora-doma/"'));
 assert.match(fn,/'page-hygiena-leziciho-seniora-doma.php'/);
 const v=read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];
 assert.ok(v && html.includes("ZP_RELEASE_"+v.replaceAll(".","_")));
 assert.match(read("style.css"),/\.zp-guide-steps/);
});
