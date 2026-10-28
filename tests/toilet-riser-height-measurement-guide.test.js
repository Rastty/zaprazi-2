import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const guide=read("page-nastavec-na-wc-pro-seniory.php");
const hub=read("page-koupelna-a-wc.php");
const measures=read("page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php");
const anchor="vyska-nastavce-5-10-15";
test("Height-guide intent stays on the existing WC riser landing page after the safe advisor",()=>{
 assert.equal(guide.split('id="'+anchor+'"').length-1,1);
 assert.equal(guide.split('id="poradce-nastavec-wc"').length-1,1);
 assert.ok(guide.indexOf('id="poradce-nastavec-wc"')<guide.indexOf('id="'+anchor+'"'));
 assert.ok(guide.indexOf('id="'+anchor+'"')<guide.indexOf('Dva různé problémy'));
 assert.equal((guide.match(/<h1>/g)||[]).length,1);
 for(const token of ["5 cm","10 cm","15 cm","Změřte okraj WC mísy",
   "Nesčítejte automaticky","stabilně podepřená chodidla","předepsané montáži",
   "nástavec se před usednutím nesmí viklat ani posouvat",
   "fyzioterapeutem či ergoterapeutem","nejsou náhradou individuálního doporučení",
   "data-zp-editorial-guide=\"toilet-riser-height\"","Roma Medical / DMA Praha",
   'id="zp-toilet-riser-advisor"','id="zp-toilet-riser-result"',
   'href="#poradce-nastavec-wc"','rel="noopener noreferrer"'])
  if(token!=="nejsou náhradou individuálního doporučení")assert.ok(guide.includes(token),token);
 assert.ok(!guide.includes("10 cm stačí většině seniorů"));
 assert.ok(!guide.includes("15 cm je vhodné po operaci kyčle"));
});
test("Measurement page and Bathroom hub route to exact existing guide anchor",()=>{
 for(const parent of [hub,measures])
  assert.ok(parent.includes("/nastavec-na-wc-pro-seniory/#"+anchor),"Contextual route missing");
 assert.ok(measures.includes('id="mereni-wc"'));
 assert.ok(hub.includes('id="zp-bathroom-advisor"'));
 assert.ok(guide.includes('id="zp-toilet-riser-fit-stage"'));
});
