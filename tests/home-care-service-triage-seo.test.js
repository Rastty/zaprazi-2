import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = file => readFileSync(new URL("../"+file,import.meta.url), "utf8");
const home = read("page-navrat-z-nemocnice.php");
test("service decision guidance distinguishes medical home care, social services and home assistance",()=>{
  const first=home.indexOf('id="domaci-zdravotni-pece-nebo-pecovatelska-sluzba"');
  const last=home.indexOf('Až jsou kritické věci vyřešené',first);
  assert.ok(first>0 && last>first,"care triage precedes other lower-priority home tasks");
  const section=home.slice(first,last);
  assert.match(section,/aria-labelledby="domaci-pece-sluzby-nadpis"/);
  for(const s of ["Domácí zdravotní péče","Terénní pečovatelská služba","Osobní asistence",
    "předpis","14 dní","za úhradu","registrovaného poskytovatele","kapacitu","příspěvek na péči",
    "155","Šest kroků","MPSV","NZIP","VZP"])assert.ok(section.includes(s),"Missing: "+s);
  assert.doesNotMatch(section,/data-zp-merchant-link|affiliateKey|data-zp-affiliate-target|<form\b|wp_redirect/);
  assert.match(section,/home_url\( '\/otazky-pred-propustenim-z-nemocnice\/#socialni-a-zdravotni-sluzby' \)/);
});
test("three context sources link to established single page instead of duplicating SEO URL",()=>{
  for(const file of ["front-page.php","page-otazky-pred-propustenim-z-nemocnice.php","page-senior-nemuze-vstat-z-postele.php"]){
    assert.ok(read(file).includes("home_url( '/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba' )"),"Missing contextual link "+file);
  }
  assert.ok(read("page-otazky-pred-propustenim-z-nemocnice.php").includes('id="socialni-a-zdravotni-sluzby"'));
  assert.equal((home.match(/<h1\b/g)||[]).length,1);
});
