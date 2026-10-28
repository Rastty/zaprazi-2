import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const hub=read("assets/js/bathroom-advisor.js");
const safe=hub.slice(hub.indexOf("const blockedGuides ="),hub.indexOf("const showBlockedPreview ="));

const guides=[
 ["raise_toilet","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"],
 ["toilet_support","/madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton","page-madlo-na-sadrokarton-u-wc.php"],
 ["toilet_nearby","/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel","page-toaletni-zidle-vedle-postele.php"],
 ["shower_seated","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"],
 ["bath_transfer","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana","page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php"],
 ["multifunction_toilet_shower","/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel","page-toaletni-zidle-vedle-postele.php"]
];

test("Main Bathroom hub safe blocked guides route only to verified internal content",()=>{
 assert.ok(safe);
 for(const [need,dest,template] of guides){
   assert.ok(safe.includes(need+': "'+dest+'"'),need+" missing vetted route");
   const anchor=dest.split("#")[1];
   assert.ok(read(template).includes('id="'+anchor+'"'),dest+" missing real heading anchor");
   assert.ok(dest.startsWith("/")&&dest.includes("/#")&&!dest.includes("?"));
 }
 assert.doesNotMatch(safe,/combined_shower_toilet\s*:/,
   "Do not suggest generic measuring help for a complex wheelchair transfer that needs professional assessment");
 assert.match(safe,/if \(!guide\) return ""/);
});

test("Blocked and incomplete results get an informational route, never merchant or purchase paths",()=>{
 assert.match(safe,/status !== "professional_check" && status !== "needs_more_info"/);
 assert.match(safe,/target="_blank" rel="noopener noreferrer"/);
 assert.match(safe,/escapeHtml\(guide\)/);
 assert.match(safe,/samotné měření nestačí/);
 assert.doesNotMatch(safe,/affiliateMap|offers\.|merchant-link|merchantName|merchant_click|fetch\(|sendBeacon/);
 assert.doesNotMatch(safe,/localStorage|sessionStorage|history\.pushState|new URLSearchParams/);
 const blocked=hub.split("const showBlockedPreview =")[1].split("const visibleRequiredGroups =")[0];
 assert.match(blocked,/renderBlockedGuide\(outcome\.status\)/);
 assert.match(blocked,/renderEditButtons\(false\)/);
 assert.match(hub,/renderBlockedGuide\(output\.status\)/);
 assert.match(hub,/renderEditButtons\(previewReady && !fitStage\.hidden\)/);
});

test("Candidate purchase gates and old results remain unchanged by editorial navigation",()=>{
 assert.match(hub,/form\.addEventListener\("change", \(\) => \{\s*result\.hidden = true;\s*result\.innerHTML = "";/);
 assert.match(hub,/renderBathroomAcquisition\(output\.acquisition/);
 assert.match(hub,/const renderOffers =/);
 const src=safe.split("const renderBlockedGuide =")[1];
 assert.equal((src.match(/href=/g)||[]).length,1,
   "The only link in an unsafe result is a single whitelisted help path");
 assert.doesNotMatch(src,/Koupit|Objednat|Zobrazit cenu|Půjčit|Ověřit nárok/);
});
