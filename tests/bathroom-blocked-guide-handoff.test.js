import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const micro=read("src/bathroom/micro-staging.js");
const guides=[
 ["toilet-riser","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"],
 ["shower-chair","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"],
 ["toilet-chair","/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel","page-toaletni-zidle-vedle-postele.php"],
 ["toilet-support","/madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton","page-madlo-na-sadrokarton-u-wc.php"],
 ["bath-transfer","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"]
];

test("Five blocked bathroom branches route to real vetted editorial pages and exact anchors",()=>{
 for(const [key,path,page] of guides){
  assert.ok(micro.includes('"'+key+'": ["'+path+'"'),key+" not in fixed whitelist");
  const [pathname,anchor]=path.slice(1).split("#");
  assert.ok(pathname.endsWith("/"));
  assert.ok(!path.includes("?"));
  assert.match(anchor,/^[a-z0-9-]+$/);
  assert.ok(read(page).includes('id="'+anchor+'"'),"Broken destination "+path);
  const advisor=read("assets/js/"+key+"-advisor.js");
  assert.ok(advisor.includes('installBathroomMicroStaging({'),"Shared safe route not installed for "+key);
 }
});

test("Blocked result contains exactly one noncommercial educational link and preserves form answers",()=>{
 const blocked=micro.split("const block = outcome => {")[1].split("const reset = () => {")[0];
 assert.ok(blocked);
 assert.match(blocked,/esc\(guidePath\)/);
 assert.match(blocked,/Zobrazit bezpečný kontrolní návod/);
 assert.match(blocked,/target="_blank" rel="noopener noreferrer"/);
 assert.match(blocked,/result\.hidden = false/);
 assert.match(blocked,/addEditActions\(\)/);
 assert.equal((blocked.match(/href=/g)||[]).length,1,"Exactly one safe link");
 assert.doesNotMatch(blocked,/affiliateMap|merchant-link|merchantName|checkout|offer\.url|purchase|sendBeacon|fetch\(/);
 assert.doesNotMatch(micro,/localStorage|sessionStorage|new URLSearchParams|window\.location\.search/);
});

test("Blocked help is an editorial route only; model-fit preview remains commerce-free",()=>{
 const preview=micro.split("const renderProduct =")[1].split("const addEditActions =")[0];
 assert.doesNotMatch(preview,/href=|merchant-link|affiliateMap/);
 const block=micro.split("const block = outcome => {")[1].split("const reset = () => {")[0];
 assert.match(block,/Bez splnění bezpečnostních podmínek/);
});
