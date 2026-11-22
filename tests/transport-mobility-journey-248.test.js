import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const transport=read("page-prevoz-seniora-k-lekari.php");
const stairs=read("page-schody-pro-seniora-doma.php");
test("GSC-observed transport first screen offers only safe Mobility guide, not direct merchant",()=>{
  const hero=transport.split('class="zp-hero"')[1]?.split("</section>")[0]||"";
  const notes=[...hero.matchAll(/<p\b[^>]*class="zp-muted-copy zp-transport-mobility-route"[^>]*>[\s\S]*?<\/p>/g)];
  assert.equal(notes.length,1);
  const note=notes[0][0];
  assert.ok(note.includes("bez fyzického přidržování"));
  assert.ok(note.includes("neřeší nemožnost bezpečně nastoupit do auta"));
  assert.ok(note.includes("odborné posouzení"));
  assert.equal((note.match(/\/choditka-pro-seniory\/#vyber-typu/g)||[]).length,1);
  assert.doesNotMatch(note,/data-zp-merchant-link|affiliate|utm_|answers=/);
});
test("stairs discharge card alone links to documented transport decision without promise of sanita",()=>{
  const cards=[...stairs.matchAll(/<article class="zp-decision-card">[\s\S]*?<\/article>/g)].map(m=>m[0]);
  const discharge=cards.filter(c=>c.includes("<h3>4. Před propuštěním z nemocnice vše domluvte</h3>"));
  assert.equal(discharge.length,1);
  assert.equal((discharge[0].match(/\/prevoz-seniora-k-lekari\/#vyber-dopravy/g)||[]).length,1);
  assert.match(discharge[0],/automaticky nezakládají nárok na hrazenou sanitku/);
  assert.match(discharge[0],/rozhoduje lékař/);
  assert.doesNotMatch(discharge[0],/data-zp-merchant-link|data-zp-affiliate-target|utm_/);
});
