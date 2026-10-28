import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

const micro=read("src/bathroom/micro-staging.js");
const style=read("style.css");
const journeys=[
 ["toilet-riser","page-nastavec-na-wc-pro-seniory.php","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc"],
 ["shower-chair","page-sprchovaci-zidle-pro-seniory.php","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha"],
 ["toilet-chair","page-toaletni-zidle-pro-seniory.php","/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel"],
 ["toilet-support","page-madlo-k-wc-pro-seniory.php","/madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton"],
 ["bath-transfer","page-sedatko-do-vany-pro-seniory.php","/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana"]
];

test("five complex bathroom product-advisors receive one coherent two-step UX, not five competing rules",()=>{
 for(const [key,page,path] of journeys){
  assert.ok(micro.includes('"'+key+'": ["'+path+'"'),"No verified-help path for "+key);
  assert.ok(read("assets/js/"+key+"-advisor.js").includes("installBathroomMicroStaging({"),key);
  assert.ok(read(page).includes('id="zp-'+key+'-fit-stage"'),key);
 }
 assert.match(micro,/document[.]createElement[(]"section"[)]/);
 assert.ok(micro.includes('progress.setAttribute("aria-label", "Postup poradcem")'));
 assert.match(micro,/data-zp-progress-phase="situation"/);
 assert.match(micro,/data-zp-progress-phase="fit"/);
 assert.match(micro,/role="progressbar"/);
 assert.match(micro,/Zodpovězeno/);
 assert.match(micro,/updateProgress[(]"fit"[)]/);
 assert.match(micro,/updateProgress[(]"situation"[)]/);
 assert.match(micro,/updateProgress[(]"paused"[)]/);
});

test("progress counts only actually visible required groups including model-dependent fit questions",()=>{
 assert.ok(micro.includes('group.closest("[hidden]")'));
 assert.match(micro,/phaseRequiredGroups/);
 assert.ok(micro.includes('group.querySelector(\'input[type="radio"]:checked\')'));
 assert.match(micro,/aria-valuenow/);
 assert.match(micro,/firstStepAttempted/);
 assert.match(micro,/dependentFitResets/);
 assert.match(micro,/updateConditionalFit[(][)]/);
 assert.match(micro,/typeof document[.]createElement === "function"/);
 assert.match(micro,/typeof form[.]insertBefore === "function"/);
});

test("unsafe or unknown answers lead to safe action plan, no merchant in preliminary or blocked branch",()=>{
 const preview=micro.split("const renderProduct =")[1].split("const block =")[0];
 const blocked=micro.split("const block =")[1].split("const reset =")[0];
 assert.ok(preview);
 assert.doesNotMatch(preview,/href=|data-zp-merchant-link|affiliateMap|merchantName/);
 assert.match(blocked,/Nejdřív bezpečný další krok/);
 assert.match(blocked,/Bez splnění bezpečnostních podmínek/);
 assert.match(blocked,/Co můžete udělat teď[?]/);
 assert.match(blocked,/esc[(]guideLabel[)]/);
 assert.match(blocked,/esc[(]guidePath[)]/);
 assert.match(blocked,/Zobrazit bezpečný kontrolní návod/);
 assert.match(blocked,/target="_blank" rel="noopener noreferrer"/);
 assert.doesNotMatch(blocked,/affiliateMap|merchant-link|[.]offers/);
 assert.match(micro,/event[.]stopImmediatePropagation[(][)]/);
 assert.match(micro,/if \(previewReady\)/);
 assert.match(micro,/queueMicrotask/);
});

test("readable accessible visuals on mobile without sticky overlay or motion requirement",()=>{
 for(const selector of [".zp-micro-progress",".zp-micro-progress__steps",".zp-micro-progress__bar",
                         ".zp-micro-progress__help",".zp-micro-next"]){
  assert.ok(style.includes(selector),selector);
 }
 assert.match(style,/@media\(max-width:600px\)/);
 assert.match(style, /prefers-reduced-motion:reduce/);
 assert.doesNotMatch(style.slice(style.indexOf("/* 0.8.161:")),/position:sticky|position:fixed/);
 assert.doesNotMatch(micro,/localStorage|sessionStorage|fetch[(]|sendBeacon|gtag[(]|window[.]location[.](?:hash|search)/);
});
