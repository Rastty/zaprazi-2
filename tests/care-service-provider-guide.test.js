import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {requiredDecisionPaths,stagedDecisionPaths} from "../scripts/audit-public-sitemap.mjs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const slug="jak-vybrat-pecovatelskou-sluzbu";
const path="page-"+slug+".php";
const page=read(path);
const functions=read("functions.php");

test("Care-service guide solves actual family coordination with seven steps, eight questions and accountable sources",()=>{
 assert.ok(page.length>15000,"Concrete guide must not be a thin SEO doorway");
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.equal((page.match(/<main\b/g)||[]).length,1);
 assert.ok(page.includes("ZP_RELEASE_0_8_183"));
 for(const id of ["pecovatelska-sluzba-nebo-jina-pomoc","vyber-pecovatelske-sluzby-kroky",
   "vyhledat-pecovatelskou-sluzbu-v-registru","otazky-pro-pecovatelskou-sluzbu",
   "smlouva-a-cena-pecovatelske-sluzby","kdyz-sluzba-nema-kapacitu",
   "faq-pecovatelska-sluzba","zdroje-pecovatelska-sluzba"]){
  assert.equal((page.match(new RegExp('id="'+id+'"',"g"))||[]).length,1,"Missing or repeated "+id);
 }
 for(const phrase of ["Pečovatelská služba","Osobní asistence","Domácí zdravotní péče","Odlehčovací služba",
   "příspěvek na péči","skutečnou kapacitu","obce s rozšířenou působností",
   "155","Smlouva","bezpečně","nemá volnou kapacitu"]){
  assert.ok(page.toLowerCase().includes(phrase.toLowerCase()),"Missing care distinction "+phrase);
 }
 assert.ok((page.match(/<li><strong>/g)||[]).length>=14);
 assert.ok((page.match(/<details><summary>/g)||[]).length>=6);
 assert.ok((page.match(/class="zp-decision-card"/g)||[]).length>=12);
 assert.doesNotMatch(page, /<form\b|data-zp-merchant-link|data-zp-affiliate|awin1\.com|click\.php|rel="sponsored"|FormData|localStorage/i);
 assert.doesNotMatch(page, /\b(?:150|160|170|180|190|200)\s*Kč\s*(?:za hodinu|\/hodina)\b/i,
   "Never ship frozen price caps");
});

test("Only official primary sources are outbound destinations and registry search remains on MPSV",()=>{
 for(const href of ["https://mpsv.gov.cz/poskytovani-socialnich-sluzeb",
   "https://mpsv.gov.cz/pro-verejnost",
   "https://mpsv.gov.cz/desatero-k-socialnim-sluzbam",
   "https://portal.gov.cz/sluzby-vs/vypis-z-registru-poskytovatelu-socialnich-sluzeb-S12091"]){
  assert.ok(page.includes(href),"Missing primary source "+href);
 }
 for(const href of [...page.matchAll(/href="(https:\/\/[^"]+)"/g)].map(x=>x[1])){
  assert.ok(["mpsv.gov.cz","portal.gov.cz"].includes(new URL(href).hostname),"Unvetted external link "+href);
 }
 assert.match(page,/Zápraží neověřilo kapacitu jednotlivých poskytovatelů/);
 assert.match(page,/nesjednává služby|nezaručuje dostupnost/i);
});

test("Every internal article destination has real template and exact anchor",()=>{
 const hrefs=[...page.matchAll(/home_url\(\s*'([^']+)'\s*\)/g)].map(m=>m[1]);
 assert.ok(hrefs.length>=4);
 for(const href of hrefs){
  const u=new URL(href,"https://zaprazi.cz");
  assert.equal(u.search,"");
  assert.equal(u.origin,"https://zaprazi.cz");
  const template=read("page-"+u.pathname.replace(/^\/|\/$/g,"")+".php");
  if(u.hash)assert.ok(template.includes('id="'+u.hash.slice(1)+'"'),"Unknown anchor "+href);
 }
});

test("New page is created only once and protected by runtime release integrity",()=>{
 const code=functions.slice(functions.indexOf("function zaprazi_2_ensure_care_services_guide_page()"),
  functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_care_services_guide_page', 60 )"));
 assert.ok(code.includes("'post_status' => 'publish'"));
 assert.ok(code.includes("get_page_by_path( $slug, OBJECT, 'page' )"));
 assert.ok(code.includes("file_exists( get_theme_file_path( '/"+path+"' ) )"));
 assert.ok(code.includes("'_wp_page_template' => '"+path+"'"));
 assert.doesNotMatch(code,/wp_update_post|wp_delete_post|update_option|wp_trash_post/);
 assert.ok(functions.includes("'"+path+"'"));
 assert.ok(stagedDecisionPaths.includes("/"+slug+"/"));
 assert.ok(!requiredDecisionPaths.includes("/"+slug+"/"),
   "Do not treat staged, not-yet-deployed page as live");
});

test("Search guidance and contextual links put this guide within reach without pretending care is medical",()=>{
 const search=read("src/seo/search-guidance.php");
 assert.match(search,/pecovatelsk\[a-z\]/);
 assert.match(search,/osobn\[a-z\]/);
 assert.ok(search.includes("/"+slug+"/#vyber-pecovatelske-sluzby-kroky"));
 for(const [file,hash] of [
  ["front-page.php","vyber-pecovatelske-sluzby-kroky"],
  ["page-navrat-z-nemocnice.php","vyber-pecovatelske-sluzby-kroky"],
  ["page-prispevek-na-peci-pro-seniora.php","vyhledat-pecovatelskou-sluzbu-v-registru"],
  ["page-otazky-pred-propustenim-z-nemocnice.php","otazky-pro-pecovatelskou-sluzbu"]
 ]){
  const target="/"+slug+"/#"+hash;
  assert.ok(read(file).includes("home_url( '"+target+"' )"),"Missing journey "+file+" → "+target);
 }
});

test("Blank print sheet reuses local-only control and requires a real user click",()=>{
 assert.ok(page.includes('data-zp-paper-checklist="care-service-calls"'));
 assert.equal((page.match(/data-zp-paper-print/g)||[]).length,1);
 assert.equal((page.match(/zp-paper-note-line/g)||[]).length,14);
 assert.ok(page.includes("Nic nezadáváte do webu a nic se neodesílá"));
 assert.ok(functions.includes("'jak-vybrat-pecovatelskou-sluzbu'"));
 const js=read("assets/js/family-checklist-print.js");
 assert.ok(js.includes('button.addEventListener("click"'));
 assert.ok(js.includes("window.print()"));
 assert.doesNotMatch(js,/fetch\(|localStorage|sessionStorage|FormData|sendBeacon/);
});
