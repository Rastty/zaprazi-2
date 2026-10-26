import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ramp=read("page-najezdova-rampa-na-jeden-schod.php");
const grab=read("page-prisavne-madlo-do-koupelny-bez-vrtani.php");
const section=(page,id)=>{
 const i=page.indexOf('id="'+id+'"');
 assert.ok(i>=0,"Missing section "+id);
 const a=page.lastIndexOf("<section",i),b=page.indexOf("</section>",i);
 assert.ok(a>=0&&b>i,"Malformed section "+id);
 return page.slice(a,b);
};
test("one-step ramp separates mobility context from arithmetic and provides safe next steps",()=>{
 const decision=section(ramp,"rozhodnuti-rampa-schod");
 assert.equal((decision.match(/class="zp-decision-card"/g)||[]).length,4);
 for(const phrase of ["pevným nebo dvoukolovým chodítkem","Mechanický vozík",
 "elektrický vozík","dveře","Stop pravidlo"])assert.ok(decision.includes(phrase),phrase);
 const math=section(ramp,"vypocet-sklonu-rampy");
 for(const phrase of ["5 %","10 %","20 %","nejsou tři doporučené varianty"])assert.ok(math.includes(phrase),phrase);
 const measurements=section(ramp,"mereni-rampy-schod");
 assert.equal((measurements.match(/class="zp-decision-card"/g)||[]).length,7);
 assert.equal((section(ramp,"volba-rampy-jeden-schod").match(/class="zp-decision-card"/g)||[]).length,3);
 const worksheet=section(ramp,"pracovni-list-rampa-schod");
 assert.equal((worksheet.match(/<li>/g)||[]).length,8);
 const faq=section(ramp,"faq-rampa-schod");
 assert.equal((faq.match(/<details>/g)||[]).length,6);
 assert.match(faq,/Jak dlouhou rampu potřebuji na schod 10 cm/);
 assert.match(ramp,/access-board\.gov\/ada\/guides/);
 assert.match(ramp,/altech\.cz\/blog/);
 assert.equal((ramp.match(/<h1\b/g)||[]).length,1);
 assert.doesNotMatch(ramp,/data-zp-affiliate-target|data-zp-merchant-link|ehub\.cz\/system\/scripts\/click/i);
});
test("bathroom suction-grab safety rejects use as load-bearing support",()=>{
 const decision=section(grab,"rozhodnuti-madlo-bez-vrtani");
 assert.equal((decision.match(/class="zp-decision-card"/g)||[]).length,4);
 for(const phrase of ["Přísavné madlo jako nosnou oporu nevybírejte",
  "Nezaměňujte","lehký nenosný úchop","Zákaz vrtání nemění potřebnou bezpečnost"]){
  assert.ok(decision.includes(phrase),phrase);
 }
 assert.equal((section(grab,"rozdily-madel-bez-vrtani").match(/class="zp-decision-card"/g)||[]).length,4);
 assert.equal((section(grab,"sedm-kontrol-madla-bez-vrtani").match(/<li>/g)||[]).length,7);
 assert.equal((section(grab,"modelove-situace-madlo-bez-vrtani").match(/class="zp-decision-card"/g)||[]).length,3);
 assert.equal((section(grab,"list-madlo-bez-vrtani").match(/<li>/g)||[]).length,6);
 assert.equal((section(grab,"faq-madlo-bez-vrtani").match(/<details>/g)||[]).length,6);
 const sources=section(grab,"zdroje-madlo-bez-vrtani");
 assert.match(sources,/suffolk\.gov\.uk/);
 assert.match(sources,/meyra\.cz/);
 assert.match(sources,/repom\.cz/);
 assert.equal((grab.match(/<h1\b/g)||[]).length,1);
 assert.doesNotMatch(grab,/data-zp-affiliate-target|data-zp-merchant-link|ehub\.cz\/system\/scripts\/click/i);
});
test("both new guides have protected auto-publication, sitemap staging, SEO and relevant inbound links",()=>{
 const php=read("functions.php");
 const filenames=["page-najezdova-rampa-na-jeden-schod.php","page-prisavne-madlo-do-koupelny-bez-vrtani.php"];
 for(const name of filenames)assert.ok(php.includes("'"+name+"'"),"runtime protected inventory missing "+name);
 for(const symbol of ["zaprazi_2_ensure_one_step_ramp_page","zaprazi_2_ensure_suction_grab_bar_page",
  "zaprazi_2_is_one_step_ramp_page","zaprazi_2_is_suction_grab_bar_page",
  "zaprazi_one_step_ramp_page_v1","zaprazi_suction_grab_bar_page_v1"])
  assert.ok(php.includes(symbol),symbol);
 const sitemap=read("scripts/audit-public-sitemap.mjs");
 for(const slug of ["/najezdova-rampa-na-jeden-schod/","/prisavne-madlo-do-koupelny-bez-vrtani/"])
  assert.ok(sitemap.includes('"'+slug+'"'));
 for(const [page,route] of [
  ["page-prahy-pro-choditko-a-vozik.php","/najezdova-rampa-na-jeden-schod/#rozhodnuti-rampa-schod"],
  ["page-schody-pro-seniora-doma.php","/najezdova-rampa-na-jeden-schod/#mereni-rampy-schod"],
  ["page-madlo-na-sadrokarton-u-wc.php","/prisavne-madlo-do-koupelny-bez-vrtani/#rozhodnuti-madlo-bez-vrtani"],
  ["page-koupelna-a-wc.php","/prisavne-madlo-do-koupelny-bez-vrtani/#rozdily-madel-bez-vrtani"]
 ])assert.ok(read(page).includes(route),"Missing contextual path "+page);
 assert.match(ramp,/prahy-pro-choditko-a-vozik\/#reseni-prahu/);
 assert.match(grab,/madlo-k-wc-pro-seniory\/#rozhodnuti-opora-wc/);
});
