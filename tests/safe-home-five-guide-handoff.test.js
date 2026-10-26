import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const page=readFileSync(new URL("../page-bezpecny-byt-pro-seniora.php",import.meta.url),"utf8");
const routes=[
  ["2. Postel → WC","/toaletni-zidle-vedle-postele/#rozhodovaci-matice-zidle-postel"],
  ["3. WC","/madlo-k-wc-pro-seniory/#rozhodnuti-opora-wc"],
  ["4. Koupelna","/sprchova-zidle-maly-kout-80x80/#rozhodovaci-tabulka-sprcha"],
  ["5. Chůze po bytě","/choditko-do-bytu-pro-seniory/#rozhodnuti-choditko-byt"],
  ["6. Postel a okolí","/senior-nemuze-vstat-z-postele/#rozhodnuti-vstavani-postel"]
];
test("safe-home hub links five specific risks to the right published action guide",()=>{
  for(const [heading,url] of routes){
    const i=page.indexOf("<h3>"+heading+"</h3>");
    assert.ok(i>0,"missing heading "+heading);
    const begin=page.lastIndexOf('<article class="zp-decision-card">',i);
    const end=page.indexOf("</article>",i);
    const card=page.slice(begin,end);
    assert.ok(card.includes(url),"missing contextual route in "+heading);
    assert.doesNotMatch(card,/data-zp-merchant-link|data-zp-affiliate-target|ehub\.cz\/system\/scripts\/click/i);
  }
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
});
test("home-safety sequence stays numbered in practical walking order",()=>{
  const six=page.indexOf("<h3>6. Postel a okolí</h3>");
  const seven=page.indexOf("<h3>7. Vstávání z křesla a židle</h3>");
  assert.ok(six>0&&seven>six);
});
