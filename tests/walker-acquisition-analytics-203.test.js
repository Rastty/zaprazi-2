import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const adapter=read("assets/js/analytics-consent.js");
const SOURCE="/co-zmerit-pred-vyberem-choditka/";

function harness({consent="granted",pathname=SOURCE,query=""}={}){
  const dataLayer=[],scripts=[],clicks=[];
  const url=new URL("https://zaprazi.cz"+pathname+query);
  const window={
    location:{href:url.href,hostname:url.hostname,pathname:url.pathname,origin:url.origin},
    ZaPraziAnalyticsConfig:{measurementId:"G-TEST123",storageKey:"walker-203-test"},
    localStorage:{getItem(){return consent;},setItem(){}},
    dataLayer,
    addEventListener(){}
  };
  const document={
    readyState:"loading",referrer:"https://example.org/irrelevant?answer=secret",cookie:"",
    head:{appendChild(s){scripts.push(s)}},
    createElement(){return {}},
    addEventListener(name,listener){if(name==="click")clicks.push(listener)},
    querySelector(){return null}
  };
  vm.runInNewContext(adapter,{window,document,URL,Date,encodeURIComponent});
  function click(href,{inGuide=true,inAdvisorResult=false,advisorMark=false,
       sponsored=false,download=false}={}){
    const link={
      getAttribute(name){return name==="href"?href:null},
      closest(selector){
        if(selector===".zp-result")return inAdvisorResult?{}:null;
        if(selector==="#co-po-mereni")return inGuide?{}:null;
        return null;
      },
      matches(selector){return sponsored&&selector==='a[rel~="sponsored"]'},
      hasAttribute(name){return download&&name==="download"}
    };
    const target={closest(selector){
      if(selector==="a[href]")return link;
      if(selector==='a[rel~="sponsored"]')return sponsored?link:null;
      if(selector==='a[data-zp-journey="advisor"][href]')return advisorMark?link:null;
      return null;
    }};
    for(const listener of clicks)listener({target});
  }
  const calls=()=>dataLayer.map(x=>Array.from(x));
  return {click,calls,scripts,events:()=>calls().filter(c=>c[0]==="event"),
    config:()=>calls().find(c=>c[0]==="config")};
}

test("measurement guide counts both safe acquisition paths as generic next-step without distinguishing choice",()=>{
  const h=harness();
  h.click("/choditko-na-pojistovnu/#priprava-pro-lekare");
  h.click("/pujceni-choditka/#rozpocet-pujceni-choditka");
  assert.deepEqual(h.events().map(x=>x[1]),["next_step_click","next_step_click"]);
  assert.ok(h.events().every(c=>c.length===2),"No category, URL or answer params");
  assert.equal(h.config()[2].page_location,"https://zaprazi.cz/co-zmerit-pred-vyberem-choditka/");
  assert.equal(h.config()[2].page_referrer,"https://example.org/");
  assert.equal(h.scripts.length,1);
});
test("guide->Advisor already has its distinct once-per-page event; no double counting as next-step",()=>{
  const h=harness();
  h.click("https://zaprazi.cz/#poradce",{advisorMark:true});
  h.click("https://zaprazi.cz/#poradce",{advisorMark:true});
  assert.deepEqual(h.events().map(c=>c[1]),["guide_advisor_click"]);
});
test("funnel ignores nonmatching paths, external/merchant links, fragments and unmarked sections",()=>{
  const h=harness();
  for(const [href,opts] of [
    ["/pujceni-choditka/",{}],
    ["/choditko-na-pojistovnu/#wrong",{}],
    ["/pujceni-choditka/?answer=yes#rozpocet-pujceni-choditka",{}],
    ["/#poradce",{}],
    ["/pujceni-choditka/#rozpocet-pujceni-choditka",{inGuide:false}],
    ["/pujceni-choditka/#rozpocet-pujceni-choditka",{download:true}],
    ["/pujceni-choditka/#rozpocet-pujceni-choditka",{sponsored:true}],
    ["https://example.com/pujceni-choditka/#rozpocet-pujceni-choditka",{}],
    ["http://zaprazi.cz/pujceni-choditka/#rozpocet-pujceni-choditka",{}],
    ["#priprava-pro-lekare",{}]
  ]) h.click(href,opts);
  assert.deepEqual(h.events(),[]);
  const other=harness({pathname:"/rollator-pro-seniory/"});
  other.click("/pujceni-choditka/#rozpocet-pujceni-choditka");
  assert.deepEqual(other.events(),[]);
});
test("explicit denial, unknown consent and WordPress searches send no event and load no Google script",()=>{
  for(const options of [
    {consent:null},{consent:"denied"},{consent:"granted",query:"?s=nemuze-chodit"}
  ]){
    const h=harness(options);
    h.click("/choditko-na-pojistovnu/#priprava-pro-lekare");
    h.click("/pujceni-choditka/#rozpocet-pujceni-choditka");
    assert.deepEqual(h.events(),[]);
    assert.equal(h.scripts.length,0);
  }
});
test("existing Advisor-result next-step event survives measurement extension",()=>{
  const h=harness({pathname:"/rollator-pro-seniory/"});
  h.click("/pujceni-choditka/",{inGuide:false,inAdvisorResult:true});
  assert.deepEqual(h.events().map(c=>c[1]),["next_step_click"]);
  assert.equal(h.events()[0].length,2);
});
test("public notice accurately describes two additional generic routes",()=>{
  const page=read("page-ochrana-soukromi.php");
  assert.match(page,/dvě obecné návazné cesty z návodu na měření chodítka/);
  assert.match(page,/Nezaznamenáváme, kterou možnost návštěvník zvolil/);
  assert.match(page,/Cílovou adresu/);
  const walker=read("page-co-zmerit-pred-vyberem-choditka.php");
  assert.match(walker,/id="co-po-mereni"/);
  for(const target of [
    "/choditko-na-pojistovnu/#priprava-pro-lekare",
    "/pujceni-choditka/#rozpocet-pujceni-choditka",
    "/#poradce"
  ])assert.ok(walker.includes(target));
});
