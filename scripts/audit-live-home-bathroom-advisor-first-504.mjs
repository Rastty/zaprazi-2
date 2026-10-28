/**
 * PR #504 production Chrome acceptance: Advisor-first layout and SEO discovery.
 * Only same-origin GET, no merchant clicks, no stored form answers.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
  .filter(Boolean).find(path=>{try{accessSync(path,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"Real Chrome is required");
const readyResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(25000)});
assert.equal(readyResponse.status,200);
const ready=await readyResponse.json();
assert.equal(ready.integrity,"ok","WordPress complete release integrity");
assert.equal(ready.configured_total,ready.slot_total,"Affiliate release mismatch");
assert.ok(ready.slot_total>=25);

const homeLinks=[
 "/otazky-pred-propustenim-z-nemocnice/",
 "/prevoz-seniora-k-lekari/#vyber-dopravy",
 "/senior-odmita-choditko/#proc-senior-odmita",
 "/senior-odmita-koupani/#duvody-odmitani-koupani",
 "/senior-malo-pije/#proc-senior-malo-pije",
 "/senior-spadl-doma/#prvni-krok-pad",
 "/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik",
 "/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc",
 "/nocni-cesta-z-postele-na-wc/",
 "/prahy-pro-choditko-a-vozik/#mereni-prahu",
 "/sprchova-zidle-maly-kout-80x80/#sedm-mereni-sprchy",
 "/bezpecny-byt-pro-seniora/"
];
const bathroomLinks=[
 "/senior-nestihne-dojit-na-wc/#proc-se-nestihne-wc",
 "/senior-odmita-koupani/#duvody-odmitani-koupani",
 "/madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton",
 "/prisavne-madlo-do-koupelny-bez-vrtani/#rozdily-madel-bez-vrtani",
 "/myti-vlasu-na-luzku/#vyber-myti-vlasu",
 "/hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku"
];

const browser=await puppeteer.launch({executablePath:chrome,headless:true,
 args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const failures=[],nonGets=[],checks=[];
async function openPage(path,width){
 const page=await browser.newPage();
 await page.setViewport({width,height:844,deviceScaleFactor:1});
 page.on("pageerror",err=>failures.push({path,width,error:err.message}));
 await page.setRequestInterception(true);
 page.on("request",req=>{
  if(req.method()!=="GET"){nonGets.push({path,method:req.method(),url:req.url()});return req.abort();}
  if(req.url().startsWith(origin+"/")||req.url().startsWith("data:")||req.url().startsWith("about:"))return req.continue();
  return req.abort();
 });
 const res=await page.goto(origin+path,{waitUntil:"networkidle2",timeout:45000});
 assert.equal(res?.status(),200,path+" route status");
 const meta=await page.evaluate(()=>({
  release:document.querySelector('meta[name="zaprazi-release"]')?.content,
  integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
  canonical:document.querySelector('link[rel="canonical"]')?.href,
  h1:document.querySelectorAll("h1").length
 }));
 assert.equal(meta.integrity,"ok",path+" release");
 assert.equal(meta.release,ready.release,path+" release mismatch");
 assert.equal(meta.canonical,origin+(path==="/" ? "/" : path),path+" canonical");
 assert.equal(meta.h1,1,path+" H1");
 return page;
}
function validateLinks(actual,expected,name){
 assert.equal(actual.length,expected.length,name+" guide count");
 for(const target of expected){
   assert.equal(actual.filter(href=>href===origin+target).length,1,name+" missing/duplicate "+target);
 }
}
async function checkPage(path,width){
 const page=await openPage(path,width);
 try{
  const isHome=path==="/";
  const x=await page.evaluate(isHome=>{
    const ids=isHome?["co-resite","poradce","prakticke-kontroly"]:["poradce-koupelna","navody-koupelna"];
    const elements=ids.map(id=>document.getElementById(id));
    const body=document.querySelector("main");
    const guide=elements[elements.length-1];
    return {
      order:elements.map(el=>el?Array.from(body.querySelectorAll("[id]")).indexOf(el):-1),
      actual:elements.map(el=>el?.id||null),
      cards:guide?.querySelectorAll(".zp-decision-card").length,
      links:Array.from(guide?.querySelectorAll("a[href]")||[]).map(a=>a.href),
      firstButton:document.querySelector(".zp-hero-actions .zp-btn")?.getAttribute("href"),
      form:!!document.getElementById(isHome?"zp-mobility-advisor":"zp-bathroom-advisor"),
      submit:!!document.getElementById(isHome?"zp-advisor-submit":"zp-bathroom-submit"),
      firstEditorialBeforeAdvisor:isHome?null:document.querySelector(".zp-hero-copy")?.textContent.includes("Senior nestihne dojít na toaletu?"),
      heading:guide?.querySelector("h2")?.textContent,
      title:document.title,
      heroText:document.querySelector(".zp-hero-copy")?.textContent?.slice(0,650)
    };
  },isHome);
  assert.ok(x.order.every(v=>v>=0),path+" missing expected section");
  assert.ok(x.order.every((v,i)=>i===0||v>x.order[i-1]),path+" Advisor/guide DOM ordering");
  assert.equal(x.cards,isHome?12:6,path+" guide cards");
  assert.equal(x.form,true,path+" Advisor not rendered");
  assert.equal(x.submit,true,path+" submit missing");
  if(isHome){
    validateLinks(x.links.filter(href=>homeLinks.some(v=>href===origin+v)),homeLinks,"Homepage");
    assert.equal(x.firstButton,"#co-resite");
  }else{
    validateLinks(x.links,bathroomLinks,"Bathroom");
    assert.equal(x.firstButton,"#poradce-koupelna");
    assert.equal(x.firstEditorialBeforeAdvisor,false,"Six guides still in hero");
    assert.match(x.heading,/šest|Šest/i,"Six guides section heading");
  }
  const button=isHome?'a[href="#poradce"]':'a[href="#poradce-koupelna"]';
  await page.$eval(button,a=>a.click());
  const hash=await page.evaluate(()=>location.hash);
  assert.equal(hash,isHome?"#poradce":"#poradce-koupelna",path+" hero navigation");
  const targetVisible=await page.evaluate(isHome=>{
    const target=document.getElementById(isHome?"poradce":"poradce-koupelna");
    return target && target.getBoundingClientRect().width>0;
  },isHome);
  assert.ok(targetVisible,path+" target not visible");
  const loc=await page.evaluate(()=>({pathname:location.pathname,search:location.search}));
  assert.deepEqual(loc,{pathname:path,search:""},path+" URLs carry no answers");
  checks.push({path,width,cards:x.cards,guideLinks:x.links.length,form:true,hash,integrity:"ok"});
  console.log("PASS LIVE PR504",path,width+"px","editorial cards",x.cards);
 }finally{await page.close();}
}
try{
 for(const width of [390,1280])for(const path of ["/","/koupelna-a-wc/"])
   await checkPage(path,width);
 assert.deepEqual(failures,[],"Uncaught production JavaScript exception");
 assert.deepEqual(nonGets,[],"No POST or other writes are allowed");
 console.log("LIVE_HOME_BATHROOM_ADVISOR_FIRST_504",JSON.stringify({
  release:ready.release,integrity:ready.integrity,affiliateSlots:ready.configured_total,
  scenarios:checks.length,checks,nonGets:0,merchantClicks:0
 }));
}finally{await browser.close();}
