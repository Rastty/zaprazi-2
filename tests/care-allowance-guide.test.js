import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {stagedDecisionPaths,requiredDecisionPaths} from "../scripts/audit-public-sitemap.mjs";

const read = p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const slug="prispevek-na-peci-pro-seniora";
const template="page-"+slug+".php";
const src=read(template);
const fn=read("functions.php");
const marker="ZP_RELEASE_0_8_183";

test("Care allowance guide helps without diagnosis, individual entitlement or unverified amounts",()=>{
  assert.equal((src.match(/<h1\b/g)||[]).length,1);
  assert.match(src,/Příspěvek na péči pro seniora/);
  assert.match(src,/Úřad práce/);
  assert.match(src,/příspěvek na péči není automatický poukaz|Příspěvek na péči není automatický poukaz/i);
  assert.match(src,/není totéž jako úhrada zdravotních výkonů|Příspěvek na péči, zdravotní pojišťovna a objednání pomoci/i);
  for(const id of [
    "prispevek-neni-vsechno","kdy-zacit-resit-prispevek",
    "zadost-krok-za-krokem","oficialni-formulare-prispevek",
    "po-zadosti-pece","faq-prispevek-na-peci","zdroje-prispevek-na-peci"
  ]){
    assert.equal((src.match(new RegExp('id="'+id+'"',"g"))||[]).length,1,"Unique missing section "+id);
  }
  for(const term of [
    "Oznámení o poskytovateli pomoci", "sociální šetření",
    "plné moci","odvolací postup","zdravotní pojišťovna",
    "nezůstat bez pomoci","nespoléhejte"
  ]){
    assert.ok(src.toLowerCase().includes(term.toLowerCase()),"Missing caregiver explanation "+term);
  }
  assert.ok((src.match(/<li><strong>/g)||[]).length>=7,"Seven actionable application steps");
  assert.ok((src.match(/<details><summary>/g)||[]).length>=6,"Six substantive FAQs");
  assert.ok((src.match(/class="zp-decision-card"/g)||[]).length>=10);
  assert.ok(src.includes(marker));
  assert.match(src,/28\. 10\. 2026/);
  assert.doesNotMatch(src,/data-zp-merchant-link|data-zp-affiliate|awin1\.com|click\.php|rel="sponsored"|<form\b/i);
  assert.doesNotMatch(src,/garantovaná úhrada|automatický nárok|máte nárok na příspěvek|přiznáme vám příspěvek/i);
  assert.doesNotMatch(src,/\b(?:1[0-9] [0-9]{3}|2[0-9] [0-9]{3}) Kč\b/,"No stale benefit amount");
});

test("Only official, primary-source links provide the legal process and official forms",()=>{
  for(const url of [
    "https://up.gov.cz/prispevek-na-peci",
    "https://mpsv.gov.cz/zadost-o-prispevek-na-peci",
    "https://mpsv.gov.cz/zacinam-pecovat",
    "https://mpsv.gov.cz/pece-a-sluzby"
  ]) assert.ok(src.includes(url),"Missing official source "+url);
  for(const href of [...src.matchAll(/href="(https:\/\/[^"]+)"/g)].map(m=>m[1])){
    const u=new URL(href);
    assert.ok(["up.gov.cz","mpsv.gov.cz","portal.gov.cz"].includes(u.hostname),
      "External reference is not a primary government source: "+href);
  }
  assert.ok(src.includes("Externí odborná právní nebo sociální revize Zápraží není doložená"));
});

test("Guide routes point to real internal templates and anchors, never serialize a health profile",()=>{
  const destinations=[...src.matchAll(/home_url\(\s*'([^']+)'\s*\)/g)].map(m=>m[1]);
  assert.ok(destinations.length>=5);
  for(const href of destinations){
    const u=new URL(href,"https://zaprazi.cz");
    assert.equal(u.origin,"https://zaprazi.cz");
    assert.equal(u.search,"");
    const file="page-"+u.pathname.replace(/^\/|\/$/g,"")+".php";
    const target=read(file);
    if(u.hash)assert.ok(target.includes('id="'+u.hash.slice(1)+'"'),"Missing anchor "+href);
  }
});

test("WordPress publication is idempotent and template is in release integrity",()=>{
  const fragment=fn.slice(fn.indexOf("function zaprazi_2_ensure_care_allowance_guide_page()"),
    fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_care_allowance_guide_page', 59 )"));
  assert.ok(fragment.includes("get_page_by_path( $slug, OBJECT, 'page' )"));
  assert.ok(fragment.includes("file_exists( get_theme_file_path( '/"+template+"' ) )"));
  assert.ok(fragment.includes("'post_status' => 'publish'"));
  assert.ok(fragment.includes("'post_name' => $slug"));
  assert.ok(fragment.includes("'_wp_page_template' => '"+template+"'"));
  assert.doesNotMatch(fragment,/wp_update_post|wp_delete_post|wp_trash_post|update_option/);
  const core=fn.slice(fn.indexOf("  $files = array("),fn.indexOf("  foreach ( $files as $relative_path )"));
  const paths=[...core.matchAll(/^\s*'([^']+)',\s*$/gm)].map(m=>m[1]);
  assert.equal(paths.filter(p=>p===template).length,1);
  assert.equal(new Set(paths).size,paths.length);
  // WordPress published the page and Yoast page sitemap includes it on 2026-10-28.
  assert.ok(requiredDecisionPaths.includes("/"+slug+"/"),
    "Verified live care allowance page must be audited as required");
  assert.ok(!stagedDecisionPaths.includes("/"+slug+"/"),
    "Verified published page must not stay staged-only");
});

test("Guide is independently discoverable from four relevant user journeys",()=>{
  const sources=[
    ["front-page.php","#kdy-zacit-resit-prispevek"],
    ["page-navrat-z-nemocnice.php","#zadost-krok-za-krokem"],
    ["page-otazky-pred-propustenim-z-nemocnice.php","#oficialni-formulare-prispevek"],
    ["page-kompenzacni-pomucky-pro-seniory.php","#prispevek-neni-vsechno"]
  ];
  for(const [file,hash] of sources){
    const s=read(file);
    assert.ok(s.includes("home_url( '/"+slug+"/"+hash+"' )"),"Missing contextual inbound link "+file);
    assert.equal(s.split("home_url( '/"+slug+"/"+hash+"' )").length-1,1);
  }
});

test("Search only selects care allowance when the query is actually about care benefits",()=>{
  const php=read("src/seo/search-guidance.php");
  assert.ok(php.includes("care_allowance_intent"));
  assert.ok(php.includes("care_inquiry_intent"));
  assert.ok(php.includes("/"+slug+"/#zadost-krok-za-krokem"));
  assert.ok(read("tests/search-guidance.php").includes("socialni setreni prispevek"));
});
