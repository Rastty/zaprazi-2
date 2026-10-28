import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const js=readFileSync(new URL("../assets/js/analytics-consent.js",import.meta.url),"utf8");
function inspect(href,referrer="https://zaprazi.cz/?s=senior%20nepije"){
  const dataLayer=[],scripts=[],handlers={};
  const url=new URL(href);
  const window={
    location:{href:url.href,origin:url.origin,pathname:url.pathname,hostname:url.hostname},
    ZaPraziAnalyticsConfig:{measurementId:"G-TEST123",storageKey:"privacy-test"},
    localStorage:{getItem(){return "granted";},setItem(){}},
    dataLayer,
    addEventListener(name,fn){handlers[name]=fn;}
  };
  const document={
    referrer,readyState:"loading",cookie:"",
    head:{appendChild(script){scripts.push(script);}},
    createElement(){return {};},
    addEventListener(){},
    querySelector(){return null;}
  };
  vm.runInNewContext(js,{window,document,URL,Date,encodeURIComponent});
  const calls=()=>dataLayer.map(a=>Array.from(a));
  return {scripts,calls,emit(name){handlers["zaprazi:analytics"]?.({detail:{event:name}});}};
}
test("No Google script, pageview or events on WordPress search even after consent",()=>{
  for(const href of [
    "https://zaprazi.cz/?s=senior+nepije",
    "https://zaprazi.cz/?s=malo+pije&paged=2",
    "https://zaprazi.cz/?paged=2&s=nemuze+chodit"
  ]){
    const h=inspect(href);
    h.emit("builder_start");h.emit("merchant_click");
    assert.equal(h.scripts.length,0,href);
    assert.equal(h.calls().length,0,href);
  }
});
test("Normal page GA configuration gets query-free page location and origin referrer",()=>{
  const h=inspect("https://zaprazi.cz/rollator-pro-seniory/?utm_source=newsletter&answer=secret","https://zaprazi.cz/?s=rodic+po+padu");
  assert.equal(h.scripts.length,1);
  const cfg=h.calls().find(a=>a[0]==="config");
  assert.ok(cfg);
  const opts=JSON.parse(JSON.stringify(cfg[2]));
  assert.equal(opts.page_location,"https://zaprazi.cz/rollator-pro-seniory/");
  assert.equal(opts.page_referrer,"https://zaprazi.cz/");
  assert.equal(opts.send_page_view,true);
  assert.equal(opts.allow_google_signals,false);
  h.emit("builder_start");
  assert.deepEqual(h.calls().filter(a=>a[0]==="event").map(a=>a[1]),["builder_start"]);
  assert.ok(h.calls().filter(a=>a[0]==="event").every(a=>a.length===2));
});
test("External referrer preserves only origin",()=>{
  const h=inspect("https://zaprazi.cz/","https://search.example.org/health/patient?q=family");
  assert.equal(h.calls().find(a=>a[0]==="config")[2].page_referrer,"https://search.example.org/");
});
test("Privacy notice describes search opt-out and query cleaning",()=>{
 const page=readFileSync(new URL("../page-ochrana-soukromi.php",import.meta.url),"utf8");
 assert.match(page,/Interní vyhledávání/);
 assert.match(page,/neměří ani po souhlasu/);
 assert.match(page,/parametry URL/);
});
