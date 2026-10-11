import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

const pages=[
  {name:"WC support",file:"page-madlo-k-wc-pro-seniory.php",
    guide:"wc-support",form:"zp-toilet-support-advisor",expectedCards:5,
    text:["Ověřit skutečný nosný podklad","Samostatný rám musí pasovat k WC","nosnost"],
    sources:["kentcht.nhs.uk","kingstonandrichmond.nhs.uk","nzip.cz"]},
  {name:"bath transfer",file:"page-sedatko-do-vany-pro-seniory.php",
    guide:"bath-transfer",form:"zp-bath-transfer-advisor",expectedCards:4,
    text:["Změřit vanu a volnou podlahu","Protiskluz a stabilita","přesunu"],
    sources:["guysandstthomas.nhs.uk","nhs.uk","nzip.cz"]}
];
test("separate source-backed WC and bath guides retain actual advice form",()=>{
  for(const spec of pages){
    const page=read(spec.file);
    assert.equal((page.match(/<main\b/g)||[]).length,1,spec.name);
    assert.equal((page.match(/<h1\b/g)||[]).length,1,spec.name);
    assert.equal((page.match(/<\/main>/g)||[]).length,1,spec.name);
    assert.match(page,new RegExp('id="'+spec.form+'"'));
    assert.equal((page.match(/data-zp-editorial-guide=/g)||[]).length,1);
    const marker='data-zp-editorial-guide="'+spec.guide+'"';
    const excerpt=page.slice(page.indexOf(marker),page.indexOf('<section class="zp-section">',page.indexOf(marker)+1));
    assert.ok(excerpt.length>1200,"Guide section missing "+spec.name);
    assert.equal((excerpt.match(/<h3\b/g)||[]).length,spec.expectedCards);
    for(const t of spec.text)assert.ok(excerpt.includes(t),spec.name+": "+t);
    for(const host of spec.sources)assert.ok(excerpt.includes(host),"No verified reference "+host);
    assert.match(excerpt,/Zdroje|Podklady/i);
    assert.match(excerpt,/11\. 10\. 2026/);
    assert.match(excerpt,/individuální odborná revize|externí odborná revize/);
    assert.doesNotMatch(excerpt,/data-zp-merchant-link|href="https:\/\/(?:ehub|awin|cj)\b|affiliateMap|zp-offer\b/);
    assert.ok(excerpt.includes('target="_blank" rel="noopener"'));
  }
});

test("WC support content doesn't assume unverified mounting or free-standing safety",()=>{
 const page=read(pages[0].file);
 assert.match(page,/nosný podklad/);
 assert.match(page,/nerovná podlaha/);
 assert.match(page,/zvedání druhou osobou/);
 assert.match(page,/\/nastavec-na-wc-pro-seniory\/#poradce-nastavec-wc/);
});

test("bath guide doesn't turn unsupported transfer into a merchant offer",()=>{
 const page=read(pages[1].file);
 assert.match(page,/fyzické zvedání druhou osobou/);
 assert.match(page,/neklouzavá/);
 assert.match(page,/\/koupelna-a-wc\/#poradce-koupelna/);
 assert.match(page,/100 kg/);
 assert.match(page,/110 kg/);
});

test("both content pages remain tracked by release integrity for future deployment",()=>{
 const theme=read("functions.php");
 for(const spec of pages){
   assert.ok(theme.includes(spec.file),"Critical integrity file missing: "+spec.file);
 }
});
