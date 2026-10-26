import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
for(const [file,anchor] of [
 ["page-sprchova-zidle-maly-kout-80x80.php","rozhodovaci-tabulka-sprcha"],
 ["page-toaletni-zidle-vedle-postele.php","rozhodovaci-matice-zidle-postel"]
]){
 test("hero navigates directly to completed decision matrix: "+file,()=>{
  const html=read(file);
  const hero=html.slice(html.indexOf('<section class="zp-hero">'),html.indexOf('</section>'));
  assert.ok(hero.includes('href="#'+anchor+'"'));
  assert.ok(html.includes('id="'+anchor+'"'));
  assert.ok(hero.includes("Co udělat dál podle situace"));
 });
}
