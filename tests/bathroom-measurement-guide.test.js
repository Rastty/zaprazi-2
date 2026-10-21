import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("bathroom measurement resource answers a distinct problem with real, scoped sources",()=>{
 const p=read("page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php");
 assert.match(p,/ZP_RELEASE_0_8_142/);
 assert.match(p,/<h1>Co změřit v koupelně před výběrem pomůcky pro seniora\?/);
 for(const id of ["vyberte-misto","mereni-wc","mereni-sprcha","mereni-vana","kontrolni-list-koupelna"])
  assert.match(p,new RegExp('id="'+id+'"'));
 for(let n=1;n<=7;n++)assert.match(p,new RegExp("<h3>"+n+"\\."));
 for(const link of [
  "/koupelna-a-wc/#poradce-koupelna",
  "/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle",
  "/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc",
  "/madlo-k-wc-pro-seniory/#poradce-opora-wc",
  "/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana"])
  assert.ok(p.includes(link),"No relevant advisor path "+link);
 assert.match(p,/www\.nice\.org\.uk\/guidance\/ng249\/chapter\/recommendations/);
 assert.match(p,/www\.nhs\.uk\/social-care-and-support/);
 assert.match(p,/nikoli o český předpis/);
 assert.match(p,/Samy ale neprokážou stabilitu/);
 assert.match(p,/bez fyzického zvedání/);
 assert.doesNotMatch(p,/<form\b|data-merchant|affiliate|ePoukaz pokryje/i);
});
test("bathroom measuring guide is linked from decision hubs without exposing product offer gates",()=>{
 const url="/co-zmerit-v-koupelne-pred-vyberem-pomucky/";
 const pages=[
  "page-koupelna-a-wc.php",
  "page-sprchovaci-zidle-pro-seniory.php",
  "page-nastavec-na-wc-pro-seniory.php",
  "page-madlo-k-wc-pro-seniory.php",
  "page-sedatko-do-vany-pro-seniory.php"
 ];
 for(const p of pages)assert.ok(read(p).includes(url),"Missing contextual guide link from "+p);
 const fn=read("functions.php");
 assert.match(fn,/function zaprazi_2_ensure_bathroom_measurements_page/);
 assert.match(fn,/get_page_by_path\( \$slug, OBJECT, 'page' \)/);
 assert.match(fn,/is_page\( 'co-zmerit-v-koupelne-pred-vyberem-pomucky' \)/);
 assert.match(fn,/add_filter\( 'wpseo_metadesc'/);
 assert.match(read("scripts/audit-public-sitemap.mjs"),/\/co-zmerit-v-koupelne-pred-vyberem-pomucky\//);
});
