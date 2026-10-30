import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const releaseMarker="ZP_RELEASE_"+source("style.css").match(/^Version:\s*(\S+)/m)[1].replaceAll(".","_");
const cases=[
  {
    page:"page-senior-odmita-choditko.php",
    section:"dalsi-krok-odmitani-choditka",
    primary:"/#poradce",
    secondary:"/pujceni-choditka/",
    safety:["souhlasí","bezpečný způsob chůze","Nepotvrdí zdravotní vhodnost","nejdřív řešte stav"]
  },
  {
    page:"page-senior-odmita-koupani.php",
    section:"dalsi-krok-odmitani-koupani",
    primary:"/koupelna-a-wc/#poradce-koupelna",
    secondary:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/#vyberte-misto",
    safety:["souhlasí","bezpečný způsob","Žádná pomůcka nenahradí","pečovatelskou službu"]
  },
  {
    page:"page-senior-malo-pije.php",
    section:"dalsi-krok-piti",
    primary:"/sobestacnost/#poradce-sobestacnost",
    secondary:"/nocni-cesta-z-postele-na-wc/#nocni-audit",
    safety:["bezpečně polyká","zakuckává","odborné pomoci","doporučení lékaře"]
  }
];

test("Each problem guide has exactly one prominent next-step handoff with genuine safety context",()=>{
  for (const item of cases){
    const html=source(item.page);
    const start='<section id="'+item.section+'"';
    assert.equal(html.split(start).length-1,1,item.page+" must contain one handoff");
    const region=html.slice(html.indexOf(start),html.indexOf("</section>",html.indexOf(start)));
    assert.match(region, /class="zp-hero-actions"/,item.page);
    assert.equal((region.match(/class="zp-btn"/g)||[]).length,1,item.page);
    const hrefs=[...region.matchAll(/home_url\(\s*'([^']+)'\s*\)/g)].map(m=>m[1]);
    assert.deepEqual(hrefs,[item.primary,item.secondary],item.page);
    for(const safety of item.safety) assert.ok(region.includes(safety),item.page+" lacks "+safety);
    assert.doesNotMatch(region,/data-zp-merchant|data-zp-affiliate|rel="sponsored"|awin1\.com|click\.php|<form\b/i,item.page);
    assert.ok(hrefs.every(h=>h.startsWith("/")&&!h.includes("?")&&!h.includes("//")),item.page);
    assert.match(region,/aria-labelledby=/);
  }
});

test("Every destination is present as an actual in-theme page and anchor",()=>{
  const targets=new Map([
    ["/#poradce","front-page.php"],
    ["/pujceni-choditka/","page-pujceni-choditka.php"],
    ["/koupelna-a-wc/#poradce-koupelna","page-koupelna-a-wc.php"],
    ["/co-zmerit-v-koupelne-pred-vyberem-pomucky/#vyberte-misto","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"],
    ["/sobestacnost/#poradce-sobestacnost","page-sobestacnost.php"],
    ["/nocni-cesta-z-postele-na-wc/#nocni-audit","page-nocni-cesta-z-postele-na-wc.php"]
  ]);
  for(const [target,file] of targets){
    const anchor=target.split("#")[1];
    assert.ok(source(file).length>1000,file+" must exist");
    if(anchor)assert.ok(source(file).includes('id="'+anchor+'"'),target+" must have a real anchor");
  }
});

test("Protected release markers match current theme version",()=>{
  for(const item of cases)assert.ok(source(item.page).includes(releaseMarker),item.page);
});
