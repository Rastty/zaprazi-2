import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const guide=read("page-senior-malo-pije.php");
const adl=read("page-sobestacnost.php");
const homepage=read("front-page.php");
const sitemap=read("src/seo/https-sitemaps.php");

test("existing hydration URL gains one distinct eating-refusal decision section",()=>{
  assert.equal((guide.match(/id="senior-nechce-jist"/g)||[]).length,1);
  assert.match(guide,/id="senior-nechce-jist-title"/);
  const section=guide.split('<section id="senior-nechce-jist"')[1]
    ?.split('<section id="zdroje-senior-malo-pije"')[0];
  assert.ok(section?.length>2800);
  for(const wording of ["Senior nechce jíst","Volejte 155","Kašle při jídle",
    "Trvalé nechutenství","praktického lékaře","Sedm otázek",
    "nutričního terapeuta","externí klinické revize"])
    assert.ok(section.includes(wording),"Missing care or safety cue: "+wording);
  assert.equal((section.match(/<li><strong>/g)||[]).length,7);
  assert.doesNotMatch(section,/<form\b|data-zp-merchant-link|affiliateMap|\?utm_|\?a_box=/i);
});

test("eating-refusal decision links only to real internal destinations and primary sources",()=>{
  const section=guide.split('<section id="senior-nechce-jist"')[1]
    ?.split('<section id="zdroje-senior-malo-pije"')[0];
  for(const source of [
    "https://www.nzip.cz/rejstrikovy-pojem/1947",
    "https://www.nzip.cz/clanek/1498-podvaha-a-podvyziva",
    "https://www.nzip.cz/rejstrikovy-pojem/1949",
    "https://www.nzip.cz/clanek/1873-diety-s-upravenou-texturou-stravy"
  ])assert.ok(section.includes(source),"Official source missing: "+source);
  assert.match(section,/href="#varovne-priznaky-malo-pije"/);
  assert.match(guide,/id="varovne-priznaky-malo-pije"/);
  assert.match(section,/sobestacnost\/#poradce-sobestacnost/);
  assert.match(adl,/id="poradce-sobestacnost"/);
});

test("homepage and ADL guide offer contextual, not commercial, entry",()=>{
  for(const source of [homepage,adl]){
    assert.equal((source.match(/\/senior-malo-pije\/#senior-nechce-jist/g)||[]).length,1);
    assert.match(source,/polykáním|polykání/);
  }
  assert.match(sitemap,/'senior-malo-pije' => '2026-11-18T00:00:00\+00:00'/);
});
