import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SOURCE_DATES,PREDEPLOY_216_MATERIAL_DATES,selectLiveSitemapScope} from "../scripts/audit-205-postdeploy-seo.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const page=read("page-otazky-pred-propustenim-z-nemocnice.php");
const php=read("functions.php");
test("217 discharge guide gives a first-screen answer without unsafe commercial shortcuts",()=>{
 assert.match(page,/<p class="zp-muted-copy" id="rychla-odpoved-propusteni">[\s\S]*?Rychlá odpověď:/);
 for(const part of ["doma není zajištěná nezbytná péče","ošetřujícímu týmu","sociálním pracovníkem","pouhý seznam kontaktů"])
   assert.ok(page.includes(part),"Missing safety information: "+part);
 assert.equal((page.match(/id="nezajistena-pece-po-propusteni"/g)||[]).length,1);
 assert.equal((page.match(/href="#nezajistena-pece-po-propusteni"/g)||[]).length,1);
 const block=page.split('<section id="nezajistena-pece-po-propusteni"')[1]?.split("</section>")[0];
 assert.ok(block,"Missing real on-page section");
 assert.equal((block.match(/<li>/g)||[]).length,4);
 assert.match(block,/https:\/\/www\.nzip\.cz\/clanek\/290-propusteni-z-nemocnice/);
 assert.match(block,/https:\/\/oporadiakonie\.cz\/rada\/tlaci-na-vas-v-nemocnici-abyste-si-blizkeho-vzali-domu\//);
 assert.doesNotMatch(block,/<form\b|<input\b|<textarea\b|data-zp-merchant-link|affil/i);
 assert.match(block,/není příslib prodloužení hospitalizace/i);
 const themeVersion=read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)\s*$/m)?.[1];
 assert.ok(themeVersion,"Theme release version must exist");
 assert.ok(page.includes("ZP_RELEASE_"+themeVersion.replaceAll(".","_")),
   "Discharge guide must carry the current theme release marker");
});
test("217 dated revision and SEO metadata honor exact-live predecessor gate",()=>{
 assert.match(php,/return 'Propuštění z nemocnice: 7 otázek pro rodinu \| Zápraží';/);
 assert.match(php,/return 'Propuštění z nemocnice: 7 otázek pro lékaře, sestru a rodinu/);
 assert.equal(SOURCE_DATES["/otazky-pred-propustenim-z-nemocnice/"],"2026-11-10");
 assert.equal(Object.keys(SOURCE_DATES).length,11);
 assert.equal(Object.keys(PREDEPLOY_216_MATERIAL_DATES).length,10);
 const before=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.217",liveRelease:"0.8.216",integrity:"ok"});
 assert.equal(before.mode,"predeploy_verified_216_dates_only");
 assert.ok(!Object.hasOwn(before.dates,"/otazky-pred-propustenim-z-nemocnice/"));
 assert.equal(selectLiveSitemapScope({event:"schedule",sourceRelease:"0.8.217",liveRelease:"0.8.217",integrity:"ok"}).dates,SOURCE_DATES);
});
