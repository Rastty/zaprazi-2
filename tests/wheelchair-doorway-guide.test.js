import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("wheelchair doorway guide is a separate situation guide, not an alternate advisor",()=>{
 const p=read("page-projede-invalidni-vozik-dvermi.php");
 assert.match(p,/id="mereni-pruchodu"/);
 assert.match(p,/id="porovnani-sirek"/);
 for(let n=1;n<=6;n++)assert.match(p,new RegExp("<h3>"+n+"\\."));
 assert.match(p,/id="zp-doorway-check"[^>]*hidden/);
 assert.match(p,/id="zp-doorway-result"[^>]*role="status" aria-live="polite"/);
 assert.match(p,/To NENÍ potvrzení|nikdy nepotvrzuje bezpečné|nikdy nepotvrdí bezpečný/);
 assert.match(p,/invalidni-vozik\/#poradce-vozik/);
 assert.match(p,/Americké pokyny nejsou automaticky použitelný český právní limit/);
 assert.match(p,/https:\/\/www\.access-board\.gov\/ada\/guides\/chapter-4-entrances-doors-and-gates\//);
 for(const related of ["page-invalidni-vozik.php","page-bezpecny-byt-pro-seniora.php"])
  assert.match(read(related),/projede-invalidni-vozik-dvermi\/#mereni-pruchodu/);
 const fn=read("functions.php");
 assert.match(fn,/function zaprazi_2_ensure_wheelchair_doorway_page/);
 assert.match(fn,/is_page\( 'projede-invalidni-vozik-dvermi' \)/);
 assert.match(fn,/assets\/js\/wheelchair-doorway-check\.js/);
 assert.match(read("scripts/audit-public-sitemap.mjs"),/\/projede-invalidni-vozik-dvermi\//);
});
test("doorway comparator never guesses medical suitability",()=>{
 const source=read("assets/js/wheelchair-doorway-check.js");
 for(const forbidden of [/\bfetch\s*\(/,/\blocalStorage\b/,/\bsessionStorage\b/,/sendBeacon/,
 /XMLHttpRequest/,/document\.cookie/,/innerHTML/,/\bconsole\./,/merchant_click/])
  assert.doesNotMatch(source,forbidden);
 const ctx={document:{querySelector:()=>null},Intl};
 vm.runInNewContext(source+"\nglobalThis.calc=compareDoorwayWidths;",ctx);
 const calc=(a,b)=>JSON.parse(JSON.stringify(ctx.calc({clearWidth:a,chairWidth:b})));
 assert.deepEqual(calc("76.5","70"),{difference:6.5,category:"unverified_margin"});
 assert.deepEqual(calc("65","68"),{difference:-3,category:"not_enough"});
 assert.deepEqual(calc("70","70"),{difference:0,category:"not_enough"});
 for(const bad of ["","0","-10","NaN","999","1.43","5<script>","6e1"])
   assert.equal(ctx.calc({clearWidth:bad,chairWidth:70}),null);
});
test("changing the measurements immediately invalidates prior comparison",()=>{
 const source=read("assets/js/wheelchair-doorway-check.js");
 const l={},el={
 "#zp-door-clear-width":{value:"76"},"#zp-chair-overall-width":{value:"70"},
 "#zp-doorway-result":{textContent:""}
 };
 const form={hidden:true,querySelector:x=>el[x],addEventListener:(x,cb)=>l[x]=cb};
 vm.runInNewContext(source,{document:{querySelector:x=>x==="#zp-doorway-check"?form:null},Intl});
 assert.equal(form.hidden,false);
 l.submit({preventDefault(){}});
 assert.match(el["#zp-doorway-result"].textContent,/NENÍ potvrzení bezpečného/);
 el["#zp-door-clear-width"].value="60";l.input();
 assert.match(el["#zp-doorway-result"].textContent,/Předchozí přepočet už neplatí/);
 l.submit({preventDefault(){}});
 assert.match(el["#zp-doorway-result"].textContent,/nestačí/);
 el["#zp-door-clear-width"].value="0";l.change();l.submit({preventDefault(){}});
 assert.match(el["#zp-doorway-result"].textContent,/Zadejte obě ověřené šířky/);
});
