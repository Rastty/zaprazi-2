import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const file=read("page-senior-nemuze-vstat-z-postele.php");
const fn=read("functions.php");
const home=read("front-page.php");
const hub=read("page-kompenzacni-pomucky-pro-seniory.php");
const bed=read("page-polohovaci-postel.php");
const night=read("page-nocni-cesta-z-postele-na-wc.php");
const search=read("src/seo/search-guidance.php");
const version=read("style.css").match(/^Version:\s*([\d.]+)$/m)?.[1];
const marker="ZP_RELEASE_"+version.replaceAll(".","_");

test("new bed-rise guide has unique topical intent and seven practical checks",()=>{
 assert.ok(file.includes(marker),"New page integrity marker must match theme");
 assert.match(file,/Template Name: Zápraží — Senior nemůže vstát z postele/);
 assert.equal((file.match(/<h1(?:\s|>)/g)||[]).length,1);
 for(const id of ["co-delat-postel","pomucky-k-posteli","kontroly-postele",
  "co-dal-postel","faq-postel-vstavani","zdroje-postel-vstavani"])
  assert.ok(file.includes('id="'+id+'"'),id);
 for(let n=1;n<=7;n++)assert.ok(file.includes("0"+n+" ·"),"Checklist "+n);
 for(const word of ["Madlo k posteli","Hrazda","Postelová zábrana",
  "polohovací postel","zaklínění","matrace","nosnost","fyzioterapeutem"])
  assert.ok(file.toLowerCase().includes(word.toLowerCase()),word);
 assert.match(file,/externí odborná revize tohoto textu zatím nejsou doložené/);
});

test("official safety sources and safe conversion path without ungated commerce",()=>{
 for(const url of [
  "https://www.gov.uk/guidance/bed-rails-management-and-safe-use",
  "https://www.kentcht.nhs.uk/leaflet/safe-use-of-bed-rails-or-grab-bed-handles-in-the-community/",
  "https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/bed-lever"
 ])assert.ok(file.includes(url));
 for(const path of [
  "/polohovaci-postel/#poradce-postel",
  "/polohovaci-postel-na-pojistovnu/#porovnani-pujceni-postele",
  "/nocni-cesta-z-postele-na-wc/#nocni-audit",
  "/navrat-z-nemocnice/#plan-navratu",
  "/jak-vznika-doporuceni/"
 ])assert.ok(file.includes(path),path);
 assert.doesNotMatch(file,/<form\b|data-zp-merchant-link|data-zp-affiliate-target|ehub\.cz|desturl|Koupit nyní/i);
});

test("SEO entry receives contextual inbound links from four live main pages and internal search",()=>{
 const slug="/senior-nemuze-vstat-z-postele/";
 for(const [name,src] of [
  ["homepage",home],["bed advisor",bed],["hub",hub],["night-toilet",night]
 ])assert.ok(src.includes(slug),name);
 assert.ok(search.includes("'/senior-nemuze-vstat-z-postele/#co-delat-postel'"));
 assert.match(search,/Madlo, hrazda, nebo zábrana\?/);
});

test("single slug auto-publication and unique Yoast meta do not overwrite legacy posts",()=>{
 const start=fn.indexOf("function zaprazi_2_ensure_bed_rise_page()");
 const end=fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_bed_rise_page', 36 );",start);
 assert.ok(start>0 && end>start);
 const part=fn.slice(start,end);
 assert.match(part,/get_page_by_path\( \$slug, OBJECT, 'page' \)/);
 assert.match(part,/file_exists\(/);
 assert.match(part,/wp_insert_post/);
 assert.doesNotMatch(part,/wp_update_post|wp_delete_post|wp_trash_post/);
 assert.match(part,/'page-senior-nemuze-vstat-z-postele.php'/);
 assert.ok(fn.includes("    'page-senior-nemuze-vstat-z-postele.php',"));
 assert.match(fn,/zaprazi_2_bed_rise_description_fallback/);
 assert.ok(fn.includes("define( 'ZAPRAZI_RELEASE', '"+version+"' );"),"Release header and PHP differ");
});
