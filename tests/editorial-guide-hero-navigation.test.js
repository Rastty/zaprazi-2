import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

const guides=[
  ["page-madlo-k-wc-pro-seniory.php","kontrola-opory-u-wc"],
  ["page-sedatko-do-vany-pro-seniory.php","kontrola-presunu-do-vany"],
  ["page-sprchovaci-zidle-pro-seniory.php","bezpecne-sprchovani-v-sede"],
  ["page-nastavec-na-wc-pro-seniory.php","kontrola-nastavce-na-wc"],
  ["page-toaletni-zidle-pro-seniory.php","kontrola-toaletni-zidle"],
  ["page-choditko-do-bytu-pro-seniory.php","bezpecne-pouziti-choditka"],
  ["page-rollator-pro-seniory.php","bezpecne-pouziti-rollatoru"],
  ["page-polohovaci-postel.php","kontrola-polohovaci-postele"],
  ["page-invalidni-vozik.php","bezpecne-pouzivani-voziku"]
];

test("every safety guide is accessible directly from its existing Advisor hero",()=>{
  for(const [path,id] of guides){
    const source=read(path);
    const header=source.slice(source.indexOf('<section class="zp-hero">'),
      source.indexOf("</section>",source.indexOf('<section class="zp-hero">')));
    assert.ok(header.includes('href="#'+id+'"'),"Safety entry not in hero "+path);
    assert.equal((source.match(new RegExp('href="#'+id+'"','g'))||[]).length,1,
      "Hero guide entry duplicated "+path);
    assert.equal((source.match(new RegExp('id="'+id+'"','g'))||[]).length,1,
      "Guide target missing or duplicated "+path);
    assert.ok(source.indexOf('id="'+id+'"')>source.indexOf('zp-advisor-form'),
      "Guide must never be a replacement for the Advisor "+path);
    assert.equal((source.match(new RegExp('data-zp-editorial-guide="[^"]+"',"g"))||[]).length,
      path==="page-nastavec-na-wc-pro-seniory.php"?2:1,
      "Expected original safety guide plus dedicated measured-height guide only on WC riser");
    assert.match(header, /Spustit poradce/);
    assert.match(header, /Co ověřit před výběrem/);
  }
});

test("guide jump links keep native navigation and mobile scrolling",()=>{
  const css=read("style.css");
  assert.match(css,/scroll-padding-top:136px/);
  assert.match(css,/\.zp-hero-actions\{[^}]*flex-wrap:wrap/);
  const smoke=read("tests/production-advisor-smoke.mjs");
  assert.ok(smoke.includes('releaseAtLeast("0.8.116")'));
  assert.ok(smoke.includes("Guide anchor failed to navigate"));
});
