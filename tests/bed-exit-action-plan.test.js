import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const s=readFileSync(new URL("../page-senior-nemuze-vstat-z-postele.php",import.meta.url),"utf8");
test("bed exit reader has direct hero route to four actionable states",()=>{
 const hero=s.slice(s.indexOf('<section class="zp-hero">'),s.indexOf('</section>'));
 const start=s.indexOf('id="rozhodnuti-vstavani-postel"');
 const end=s.indexOf('id="pomucky-k-posteli"',start);
 assert.ok(start>0 && end>start);
 const b=s.slice(start,end);
 assert.ok(hero.includes('href="#rozhodnuti-vstavani-postel"'));
 assert.equal((b.match(/<article class="zp-decision-card">/g)||[]).length,4);
 for(const v of ["Náhlé zhoršení","Dlouhodobě nezvládá","Posadí se bezpečně","Vstane, ale další cesta"]) assert.ok(b.includes(v));
 assert.match(b,/155 či 112/);
 assert.match(b,/nezkoušejte jej sami/);
 assert.match(b,/nepodkládejte postel/);
 assert.match(b,/přesun odborně ověřen/);
 assert.doesNotMatch(b,/data-zp-merchant-link|data-zp-affiliate-target|desturl=|Koupit nyní/i);
});
test("existing article keeps single H1 and seven checks",()=>{
 assert.equal((s.match(/<h1\b/g)||[]).length,1);
 for(let i=1;i<=7;i++)assert.ok(s.includes(String(i).padStart(2,"0")+" ·"));
});
