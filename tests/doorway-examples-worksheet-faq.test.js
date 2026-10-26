import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../page-projede-invalidni-vozik-dvermi.php",import.meta.url),"utf8");
const section=(id,next)=>{const p=source.indexOf('id="'+id+'"'),q=source.indexOf("</section>",p);assert.ok(p>0&&q>p,"Missing section "+id);return source.slice(p,q);};

test("doorway guide explains four realistic measurements without asserting a safe clearance",()=>{
 const a=section("modelove-situace-pruchod");
 assert.equal((a.match(/class="zp-decision-card"/g)||[]).length,4);
 for(const text of ["70 cm, vozík 68 cm","75 cm, vozík 78 cm","90 cm, vozík 70 cm","Šířku vozíku nebo otvoru neznáte","neznamená, že vozík projede bezpečně","+20 cm","−3 cm","nejsou univerzální limity"])assert.ok(a.includes(text),text);
 assert.doesNotMatch(a,/data-zp-merchant-link|data-zp-affiliate-target|Koupit nyní|ehub\.cz\/system\/scripts\/click/i);
});
test("doorway guide includes usable seven-line worksheet and five error checks",()=>{
 const sheet=section("pracovni-list-pruchody");
 assert.equal((sheet.match(/<li>/g)||[]).length,7);
 for(const text of ["Dveře A","Dveře B","Nejužší další místo","Prahy a povrch","Vozík:","Způsob jízdy a pomoci","Co ještě není ověřeno"])assert.ok(sheet.includes(text),text);
 const pitfalls=section("chyby-mereni-pruchodu");
 assert.equal((pitfalls.match(/class="zp-decision-card"/g)||[]).length,5);
});
test("doorway search FAQ and link navigation preserve safety-critical existing calculator",()=>{
 const faq=section("otazky-prujezd-dvermi");
 assert.equal((faq.match(/<details>/g)||[]).length,5);
 assert.match(faq,/Projde invalidní vozík dveřmi 70 cm/);
 assert.match(faq,/Stačí v bytě dveře 80 cm nebo 90 cm/);
 const hero=source.slice(source.indexOf('<section class="zp-hero"'),source.indexOf('</section>'));
 assert.ok(hero.includes('href="#modelove-situace-pruchod"'));
 assert.ok(hero.includes('href="#mereni-pruchodu"'));
 assert.ok(hero.includes('href="#porovnani-sirek"'));
 assert.ok(source.includes('id="zp-doorway-check"'));
 assert.equal((source.match(/<h1\b/g)||[]).length,1);
 assert.ok(source.includes("Liga vozíčkářů"));
 assert.ok(source.includes("Americké pokyny nejsou automaticky použitelný český právní limit"));
});
