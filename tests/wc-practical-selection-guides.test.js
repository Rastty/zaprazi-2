import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const specs = [
 {path:"page-nastavec-na-wc-pro-seniory.php",guide:"toilet-riser",advisor:"zp-toilet-riser-advisor",
  title:"Pět kontrol nástavce na WC",phrases:["36 × 40 cm","21 × 26 cm","15 cm","11,5 cm","100 kg","chodidla","uchycení"],
  sources:["kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/raised-toilet-seat",
    "worcsacute.nhs.uk/leaflets/how-to-fit-your-raised-toilet-seat/",
    "unizdrav.cz/zbozi/2868/","rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/"],
  anchor:"#poradce-nastavec-wc"},
 {path:"page-toaletni-zidle-pro-seniory.php",guide:"toilet-chair",advisor:"zp-toilet-chair-advisor",
  title:"Pět kontrol toaletní židle",phrases:["60 cm","36–60 cm","100 kg","rovnou pevnou podlahou","4v1","přesunu"],
  sources:["kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/commode",
    "nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/",
    "unizdrav.cz/zbozi/2807/"],anchor:"#poradce-toaletni-zidle"}
];
test("both WC practical guides have 5 evidenced checks and keep their Advisors",()=>{
 for (const s of specs) {
   const page=read(s.path);
   assert.equal((page.match(/<main\b/g)||[]).length,1);
   assert.equal((page.match(/<h1\b/g)||[]).length,1);
   assert.equal((page.match(/data-zp-editorial-guide=/g)||[]).length,1);
   assert.ok(page.includes('id="'+s.advisor+'"'),"Advisor disappeared "+s.path);
   const a=page.indexOf('data-zp-editorial-guide="'+s.guide+'"');
   const b=page.indexOf('  <section class="zp-section">\n    <div class="zp-wrap zp-faq">',a);
   assert.ok(a>0&&b>a,"Guide missing before FAQ "+s.path);
   const section=page.slice(a,b);
   assert.ok(section.includes(s.title));
   assert.equal((section.match(/<h3\b/g)||[]).length,5,"Exactly 5 checks "+s.path);
   for(const key of s.phrases)assert.ok(section.includes(key),"Guide lost factual input "+key);
   for(const source of s.sources)assert.ok(section.includes(source),"Guide lost source "+source);
   assert.ok(section.includes(s.anchor),"Guide lost link back to real Advisor");
   assert.match(section,/12\. 10\. 2026/);
   assert.match(section,/odborné posouzení/);
   assert.doesNotMatch(section,/data-zp-merchant-link|zp-offer\b|affiliateMap|ehub\.cz|awin1\.com/);
   assert.ok(!section.includes('href="http://'),"Only HTTPS sources");
 }
});

test("WC product facts and safety rules stay model-specific",()=>{
 const riser=read(specs[0].path);
 const chair=read(specs[1].path);
 assert.match(riser,/P2868 a BS15[^<]*100 kg/);
 assert.match(riser,/pokud nedosáhnou, nástavec nepoužívejte/);
 assert.match(chair,/nesmějí být automaticky přeneseny na variantu 4v1/);
 assert.match(chair,/nutnosti fyzického zvedání druhou osobou/);
 for(const id of ["zp-toilet-riser-fit-stage","zp-toilet-chair-fit-stage"])
   assert.ok((riser+chair).includes(id),"Existing product-specific fit gate removed: "+id);
});
