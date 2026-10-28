import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("page-senior-nemuze-vstat-z-postele.php");
test("caregiver transfer guidance is clear safety-first, not unassessed transfer technique",()=>{
 const start=html.indexOf('id="presun-z-postele-na-vozik"');
 const end=html.indexOf('id="pomucky-k-posteli"',start);
 assert.ok(start>0&&end>start,"section must be included before product discussion");
 const s=html.slice(start,end);
 assert.match(s,/aria-labelledby="nadpis-presun-z-postele"/);
 assert.match(s,/Nezvládám zvedání seniora z postele na vozík/);
 assert.match(s,/za ruce nebo v podpaží/);
 assert.match(s,/volejte 155/);
 assert.match(s,/kompatibilní závěs/);
 assert.match(s,/Sedm otázek/);
 assert.match(s,/HSE — individuální posouzení a plán/);
 assert.match(s,/NHS — rady pro pečující/);
 assert.doesNotMatch(s,/data-zp-merchant-link|data-zp-affiliate-target|affiliateKey|<form|wp_redirect\s*\(/);
 assert.match(s,/home_url\( '\/invalidni-vozik\/#poradce-vozik' \)/);
});
test("four contextual source pages link to one canonical guide anchor without duplicate page",()=>{
 for(const path of ["page-invalidni-vozik.php","page-navrat-z-nemocnice.php","page-otazky-pred-propustenim-z-nemocnice.php","front-page.php"]){
   assert.ok(read(path).includes("home_url( '/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik' )"),"missing crosslink "+path);
 }
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
});
