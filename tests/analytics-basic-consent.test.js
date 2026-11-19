import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const script=readFileSync(new URL("../assets/js/analytics-consent.js",import.meta.url),"utf8");

function runWithPreference(preference="unknown",href="https://zaprazi.cz/choditka-pro-seniory/"){
  const url=new URL(href),queue=[],scripts=[],listeners={},buttons={};
  let stored=preference,reloads=0;
  for(const id of ["#zp-analytics-consent","#zp-analytics-allow",
    "#zp-analytics-deny","#zp-analytics-settings"]){
    buttons[id]={hidden:true,focus(){},addEventListener(name,handler){this[name]=handler;}};
  }
  const window={
    location:{href:url.href,origin:url.origin,pathname:url.pathname,
      hostname:url.hostname,reload(){reloads++;}},
    ZaPraziAnalyticsConfig:{measurementId:"G-TEST123",storageKey:"consent-basic-test"},
    localStorage:{getItem(){return stored;},setItem(_key,value){stored=value;}},
    dataLayer:queue,
    addEventListener(name,handler){listeners[name]=handler;},
    setTimeout(handler){handler();}
  };
  const document={
    referrer:"",readyState:"complete",cookie:"",
    head:{appendChild(node){scripts.push(node);}},
    createElement(){return {};},addEventListener(){},
    querySelector(id){return buttons[id]??null;}
  };
  vm.runInNewContext(script,{window,document,URL,Date,encodeURIComponent});
  return {calls:()=>queue.map(a=>Array.from(a)),scripts,
    allow(){buttons["#zp-analytics-allow"].click();},
    deny(){buttons["#zp-analytics-deny"].click();},
    emit(event){listeners["zaprazi:analytics"]?.({detail:{event}});},
    status:()=>stored,reloads:()=>reloads};
}

function assertOrderedConsent(calls){
  assert.deepEqual(calls.slice(0,4).map(x=>x[0]),["consent","consent","js","config"]);
  assert.equal(calls[0][1],"default");
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0][2])),{
    analytics_storage:"denied",ad_storage:"denied",
    ad_user_data:"denied",ad_personalization:"denied"
  });
  assert.equal(calls[1][1],"update");
  assert.deepEqual(JSON.parse(JSON.stringify(calls[1][2])),{analytics_storage:"granted"});
}

test("new visitor sends nothing before consent, then queues basic consent before GA4",()=>{
  const session=runWithPreference();
  session.emit("builder_start");
  assert.deepEqual(session.calls(),[]);
  assert.equal(session.scripts.length,0);
  session.allow();
  assert.equal(session.status(),"granted");
  assertOrderedConsent(session.calls());
  assert.equal(session.scripts.length,1);
  session.emit("builder_start");
  assert.deepEqual(session.calls().filter(x=>x[0]==="event").map(x=>x[1]),["builder_start"]);
});

test("returning granted visitor queues explicit consent before initial page view",()=>{
  const session=runWithPreference("granted");
  assertOrderedConsent(session.calls());
  assert.equal(session.scripts.length,1);
  assert.equal(session.calls().filter(x=>x[0]==="config").length,1);
});

test("denied visitor sends no GA4 request and an explicit revocation is fail-closed",()=>{
  const denied=runWithPreference("denied");
  denied.emit("merchant_click");
  assert.deepEqual(denied.calls(),[]);
  assert.equal(denied.scripts.length,0);
  const granted=runWithPreference("granted");
  granted.deny();
  assert.equal(granted.status(),"denied");
  assert.equal(granted.reloads(),1);
  const last=granted.calls().at(-1);
  assert.equal(last[0],"consent");
  assert.equal(last[1],"update");
  assert.equal(last[2].analytics_storage,"denied");
  granted.emit("merchant_click");
  assert.equal(granted.calls().filter(x=>x[0]==="event").length,0);
});

test("private search page remains fully excluded even with stored grant",()=>{
  const session=runWithPreference("granted","https://zaprazi.cz/?s=rodic+po+padu");
  session.emit("builder_complete");
  assert.deepEqual(session.calls(),[]);
  assert.equal(session.scripts.length,0);
});
