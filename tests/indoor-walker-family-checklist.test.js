import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const page=readFileSync(new URL("../page-choditko-do-bytu-pro-seniory.php",import.meta.url),"utf8");
test("indoor walker has four safe next-step branches and a useful measurement worksheet",()=>{
 const start=page.indexOf('id="rozhodnuti-choditko-byt"'),end=page.indexOf('data-zp-context-links="indoor-walker-acquisition"',start);
 assert.ok(start>=0 && end>start);
 const block=page.slice(start,end);
 assert.equal((block.match(/<article class="zp-decision-card">/g)||[]).length,4);
 assert.equal((block.match(/<li>/g)||[]).length,6);
 for(const term of ["fyzickou pomoc","Manipulace je nejistá","neznáte rozměry bytu","ověřené","odborným posouzením"])assert.ok(block.includes(term),term);
 assert.ok(block.includes('href="#poradce-choditko-byt"'));
 assert.doesNotMatch(block,/data-zp-merchant-link|data-zp-affiliate-target|Koupit nyní/i);
 const hero=page.slice(page.indexOf('<section class="zp-hero">'),page.indexOf('</section>'));
 assert.ok(hero.includes('href="#rozhodnuti-choditko-byt"'));
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
});
