import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const cases = [
 {name:"bed",path:"page-polohovaci-postel.php",guide:"adjustable-bed",form:"zp-bed-advisor",
  facts:["102,5 × 212 cm","38,6–80,6 cm","178 kg","215 kg","Matrace není","zaklínění"],
  sources:["unizdrav.cz/zbozi/2777/","gov.uk/guidance/bed-rails-management-and-safe-use","england.nhs.uk/long-read/patient-entrapment-in-beds-bed-rails-and-related-devices/"],
  anchor:"#poradce-postel"},
 {name:"wheelchair",path:"page-invalidni-vozik.php",guide:"wheelchair",form:"zp-wheelchair-advisor",
  facts:["48 nebo 51 cm","68 nebo 70 cm","125 kg","136 kg","parkovací","stupačky"],
  sources:["unizdrav.cz/zbozi/3641/","fhft.nhs.uk/patients-and-visitors/patient-information-library/wheelchair-safety-information-standard-wheelchairs","merseycare.nhs.uk/our-services/knowsley/wheelchair-service"],
  anchor:"#poradce-vozik"}
];
test("high-ticket practical guides have five actionable, sourced steps without a merchant shortcut",()=>{
  for(const item of cases){
    const page=read(item.path);
    assert.equal((page.match(/<h1\b/g)||[]).length,1,"One H1 "+item.name);
    assert.equal((page.match(/<main\b/g)||[]).length,1,"One main "+item.name);
    assert.equal((page.match(/data-zp-editorial-guide=/g)||[]).length,1,"Exactly one guide "+item.name);
    assert.ok(page.includes('id="'+item.form+'"'),"Original Advisor preserved "+item.name);
    const marker='data-zp-editorial-guide="'+item.guide+'"';
    const start=page.indexOf(marker), end=page.indexOf("zp-faq",start);
    assert.ok(start>0&&end>start,"Guide is missing or after FAQ "+item.name);
    const guide=page.slice(start,end);
    assert.equal((guide.match(/<h3\b/g)||[]).length,5,"Five distinct steps "+item.name);
    for(const fact of item.facts) assert.ok(guide.includes(fact),"Missing exact practical evidence "+fact);
    for(const source of item.sources)assert.ok(guide.includes(source),"Uncited safety guidance: "+source);
    assert.ok(guide.includes(item.anchor),"Cannot return to original Advisor "+item.name);
    assert.match(guide,/12\. 10\. 2026/);
    assert.match(guide,/odborn|posouzení/i);
    assert.doesNotMatch(guide,/data-zp-merchant-link|zp-offer\b|affiliateMap|ehub\.cz|kqzyfj\.com|dpbolvw\.net/);
    assert.equal((guide.match(/target="_blank" rel="noopener"/g)||[]).length>=3,true,
      "At least three grounded external sources "+item.name);
  }
});
test("critical bed and wheelchair safety claims remain variant-specific and conservative",()=>{
  const bed=read("page-polohovaci-postel.php");
  const wheelchair=read("page-invalidni-vozik.php");
  assert.match(bed,/178 kg a pracovní zatížení lůžka 215 kg/);
  assert.match(bed,/Boční zábrany nelze automaticky považovat za bezpečné pro každého/);
  assert.match(bed,/závažná rizika zaklínění|rizika zaklínění/i);
  assert.match(wheelchair,/nosnost 125 kg s pneumatickými koly, ale 136 kg s bezdušovými/);
  assert.match(wheelchair,/Parkovací zámky neslouží k brzdění za jízdy/);
  assert.match(wheelchair,/fyzicky asistovaném přesunu/);
  assert.ok(read("functions.php").includes("page-polohovaci-postel.php"));
  assert.ok(read("functions.php").includes("page-invalidni-vozik.php"));
});
