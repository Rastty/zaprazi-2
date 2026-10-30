import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const releaseMarker="ZP_RELEASE_"+read("style.css").match(/^Version:\s*(\S+)/m)[1].replaceAll(".","_");
const page=read("page-senior-nestihne-dojit-na-wc.php");
const functions=read("functions.php");
const template="page-senior-nestihne-dojit-na-wc.php";
const slug="senior-nestihne-dojit-na-wc";
test("WC reach problem page has one H1, actual safety triage, differentiated choices and source traceability",()=>{
 assert.equal((page.match(/<h1>/g)||[]).length,1);
 assert.ok(page.includes(releaseMarker));
 for(const anchor of ["prvni-bezpecnost-wc","proc-se-nestihne-wc","kontrolni-seznam-wc-doma","pomucka-na-wc-az-potom","faq-nestihne-wc","zdroje-nestihne-wc"]){
   assert.ok(page.includes('id="'+anchor+'"'),anchor+" must be a real section");
 }
 for(const phrase of ["volejte 155","akutní lékařskou pomoc","nepřenášejte jej silou","Naléhavé nucení","Vzdálenost a čas","Sednutí a vstávání","Přesun a asistence","Nesnižujte člověku příjem tekutin","bezpečný způsob přesunu","nákup"]){
   assert.ok(page.includes(phrase),"Missing safety or decision: "+phrase);
 }
 for(const source of ["www.nzip.cz/clanek/1283","www.nhs.uk/conditions/urinary-incontinence/","mpsv.gov.cz/pece-a-sluzby","osobni-asistence.cz/kompenzacni-pomucky-do-koupelny-a-na-toaletu"]){
   assert.ok(page.includes(source),"Missing cited source "+source);
 }
 assert.doesNotMatch(page,/awin1\.com|click\.php|data-zp-merchant-link|data-zp-affiliate|sponsored/i,"Editorial guide must not send merchant traffic directly");
});

test("Every in-article destination is a safe, known, same-site path; no search params",()=>{
 const targets=[...page.matchAll(/home_url\(\s*'([^']+)'\s*\)/g)].map(m=>m[1]);
 assert.ok(targets.length>=10);
 for(const target of targets){
  assert.ok(target.startsWith("/")&&!target.includes("?")&&!target.includes("//"),target);
  const slugAndAnchor=target.slice(1).split("#");
  if(!slugAndAnchor[0])continue;
  const file="page-"+slugAndAnchor[0].replace(/\/$/,"")+".php";
  const destination=read(file);
  if(slugAndAnchor[1])assert.ok(destination.includes('id="'+slugAndAnchor[1]+'"'),target+" missing anchor");
 }
});

test("New WordPress page is created once without overwriting existing content; deployment integrity includes template",()=>{
 assert.ok(functions.includes("'"+template+"'"),"New template belongs to release integrity inventory");
 assert.ok(functions.includes("zaprazi_2_ensure_senior_cannot_reach_wc_page"));
 assert.ok(functions.includes("get_page_by_path( $slug, OBJECT, 'page' )"));
 assert.ok(functions.includes("'post_name' => $slug"));
 assert.ok(functions.includes("'_wp_page_template' => '"+template+"'"));
 assert.ok(functions.includes("zaprazi_senior_cannot_reach_wc_page_v1"));
 assert.ok(functions.includes("add_action( 'init', 'zaprazi_2_ensure_senior_cannot_reach_wc_page', 58 )"));
 const marker=releaseMarker;
 const core=functions.slice(functions.indexOf("  $files = array("),functions.indexOf("  foreach ( $files as $relative_path )"));
 const paths=[...core.matchAll(/^\s*'([^']+)',\s*$/gm)].map(m=>m[1]);
 assert.equal(paths.filter(p=>p===template).length,1);
 assert.equal(new Set(paths).size,paths.length);
 assert.ok(page.includes(marker));
});

test("Relevant existing hubs link to this new problem page in a real anchor",()=>{
 for(const file of ["page-nocni-cesta-z-postele-na-wc.php","page-koupelna-a-wc.php","page-toaletni-zidle-pro-seniory.php"]){
   assert.ok(read(file).includes("'/"+slug+"/#"),file+" should link to guide");
 }
});
