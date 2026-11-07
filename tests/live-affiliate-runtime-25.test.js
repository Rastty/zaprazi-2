import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  ORIGIN,extractPublicAffiliateMap,classifyPublicAffiliateMap,auditLiveRuntime
} from "../scripts/audit-live-affiliate-runtime-25.mjs";
import {extractCanonicalTargets} from "../scripts/audit-canonical-merchant-targets.mjs";

const php=readFileSync(new URL("../functions.php",import.meta.url),"utf8");
const targets=extractCanonicalTargets(php);
const readiness={release:"0.8.200",integrity:"ok",configured_total:25,slot_total:25};
const makeMap=()=>Object.fromEntries(targets.map((t,i)=>[
  t.key,t.key.startsWith("rehavita-cz:")
    ?"https://www.ehub.cz/s/test-"+i
    :"https://www.dpbolvw.net/click-test-"+i
]));
const fixture=map=>'<!doctype html><html><h1>ZaPrazi</h1><script id="zaprazi-runtime-config-js-after">window.ZaPraziRuntime = Object.assign({}, window.ZaPraziRuntime || {}, {affiliateMap:'+JSON.stringify(map)+'});</script></html>';
const response=(body,mime,url)=>({
  status:200,url,headers:{get:k=>k==="content-type"?mime+"; charset=UTF-8":null},
  text:async()=>body
});
const fail=(fn)=>assert.throws(fn,/LIVE_AFFILIATE_RUNTIME_/);

test("live source contract: all 25 affiliate slots are unique and correctly routed",()=>{
  const map=makeMap();
  assert.equal(targets.length,25);
  assert.equal(Object.keys(map).length,25);
  assert.deepEqual(extractPublicAffiliateMap(fixture(map)),map);
  const result=classifyPublicAffiliateMap(map,targets,readiness);
  assert.deepEqual(result.networkCounts,{cj:21,ehub:4});
  assert.equal(result.configured,25);
  assert.equal(result.state,"runtime_slots_present_network_hygiene_pass");
  assert.equal(result.attributionVerified,false);
  assert.equal(result.productDestinationVerified,false);
  assert.equal(result.publisherConversionVerified,false);
  assert.doesNotMatch(JSON.stringify(result),/dpbolvw|ehub\.cz|click-test/);
});

test("read-only public QA fetches exactly two own-origin GETs and never visits affiliate/merchant hosts",async()=>{
  const map=makeMap(), calls=[];
  const html=fixture(map);
  const run=await auditLiveRuntime(async (url,init)=>{
    calls.push({url,init});
    if(url.endsWith("/affiliate-readiness"))
      return response(JSON.stringify(readiness),"application/json",url);
    return response(html,"text/html",url);
  },php,"0.8.200");
  assert.equal(run.configured,25);
  assert.deepEqual(calls.map(x=>x.url),[
    ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness",ORIGIN+"/"
  ]);
  for(const call of calls){
    assert.equal(call.init.method,"GET");
    assert.equal(call.init.redirect,"manual");
    assert.ok(!new URL(call.url).search);
    assert.equal(Object.keys(call.init.headers).length,2);
    assert.ok(!Object.keys(call.init.headers).includes("Cookie"));
    assert.ok(!Object.keys(call.init.headers).includes("Authorization"));
  }
});

test("never accept missing, duplicate, decoy or inert affiliate runtime script",()=>{
  const map=makeMap(),html=fixture(map);
  fail(()=>extractPublicAffiliateMap(html.replace("zaprazi-runtime-config-js-after","bogus-config")));
  fail(()=>extractPublicAffiliateMap(html+html));
  fail(()=>extractPublicAffiliateMap("<!--"+html+"-->"));
  fail(()=>extractPublicAffiliateMap(html.replace(/affiliateMap:/,"wrongProperty:")));
  fail(()=>extractPublicAffiliateMap(html.replace('affiliateMap:',"affiliateMap:{bad:")));
  const escaped={...map};
  escaped[targets[0].key]='https://www.dpbolvw.net/click-special-"}-encoded';
  assert.deepEqual(extractPublicAffiliateMap(fixture(escaped)),escaped);
});

test("fail closed on missing/extra key, swapped network and unsafe affiliate URLs",()=>{
  const mutate=fn=>{const m=makeMap();fn(m);return m;};
  const cj=targets.find(x=>!x.key.startsWith("rehavita-cz:")).key;
  const ehub=targets.find(x=>x.key.startsWith("rehavita-cz:")).key;
  const variants=[
    mutate(m=>delete m[cj]),
    mutate(m=>m["unknown:slot"]="https://www.dpbolvw.net/click-999"),
    mutate(m=>m[cj]="http://www.dpbolvw.net/click-1"),
    mutate(m=>m[cj]="https://dpbolvw.net.evil.example/click"),
    mutate(m=>m[cj]="https://evil.example/click"),
    mutate(m=>m[cj]="https://www.ehub.cz/s/wrong-network"),
    mutate(m=>m[ehub]="https://www.dpbolvw.net/click-wrong-network"),
    mutate(m=>m[cj]="https://www.dpbolvw.net/click?supportNeed=steady"),
    mutate(m=>m[cj]="https://www.dpbolvw.net/click?health_profile=sensitive"),
    mutate(m=>m[cj]="https://user:pass@www.dpbolvw.net/click"),
    mutate(m=>m[cj]="https://www.dpbolvw.net/click#answer"),
    mutate(m=>m[cj]=targets[0].url),
    mutate(m=>m[cj]="https://www.dpbolvw.net/click/undefined"),
    mutate(m=>m[cj]=null)
  ];
  for(const m of variants)fail(()=>classifyPublicAffiliateMap(m,targets,readiness));
  fail(()=>classifyPublicAffiliateMap(makeMap(),targets,{...readiness,configured_total:24}));
  fail(()=>classifyPublicAffiliateMap(makeMap(),targets,{...readiness,integrity:"partial"}));
});

test("failure paths do not echo secret URLs or tracking values in diagnostic text",()=>{
  const m=makeMap(),key=targets[0].key, secret="private-do-not-echo";
  m[key]="https://not-approved.example/path?clickid="+secret;
  assert.throws(()=>classifyPublicAffiliateMap(m,targets,readiness),err=>{
    assert.match(err.message,/LIVE_AFFILIATE_RUNTIME_NETWORK_MISMATCH/);
    assert.doesNotMatch(err.message,/private-do-not-echo|https:|clickid/);
    return true;
  });
});

test("live release and integrity mismatches stop acceptance before reading homepage",async()=>{
  const calls=[];
  const badReadiness={...readiness,release:"0.8.199"};
  await assert.rejects(auditLiveRuntime(async url=>{
    calls.push(url);
    return response(JSON.stringify(badReadiness),"application/json",url);
  },php,"0.8.200"),/SOURCE_LIVE_RELEASE_MISMATCH/);
  assert.equal(calls.length,1);
});

test("invalid status, redirect, MIME, and too-large own origin responses fail closed",async()=>{
  const map=makeMap(),html=fixture(map), endpoint=ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness";
  const badCases=[
    ()=>({...response(JSON.stringify(readiness),"application/json",endpoint),status:302}),
    ()=>response(JSON.stringify(readiness),"text/plain",endpoint),
    ()=>response(JSON.stringify(readiness),"application/json",ORIGIN+"/elsewhere"),
    ()=>({...response(JSON.stringify(readiness),"application/json",endpoint),
      headers:{get:k=>k==="content-type"?"application/json":"20000000"}})
  ];
  for(const fn of badCases)
    await assert.rejects(auditLiveRuntime(async()=>fn(),php,"0.8.200"),/LIVE_AFFILIATE_RUNTIME_/);
  await assert.rejects(auditLiveRuntime(async url=>
    url.endsWith("/affiliate-readiness")
      ?response(JSON.stringify(readiness),"application/json",url)
      :response(html.repeat(500),"text/html",url)
  ,php,"0.8.200"),/RESPONSE_TOO_LARGE/);
});

test("contract: script and workflow never click merchants, use credentials or log secret URLs",()=>{
  const source=readFileSync(new URL("../scripts/audit-live-affiliate-runtime-25.mjs",import.meta.url),"utf8");
  const wf=readFileSync(new URL("../.github/workflows/production-affiliate-runtime-qa.yml",import.meta.url),"utf8");
  assert.match(source,/redirect:"manual"/);
  assert.match(source,/attributionVerified:false/);
  assert.match(source,/publisherConversionVerified:false/);
  assert.match(wf,/node --test tests\/live-affiliate-runtime-25\.test\.js/);
  assert.match(wf,/node scripts\/audit-live-affiliate-runtime-25\.mjs/);
  assert.match(wf,/schedule:/);
  assert.doesNotMatch(source,/(?:page\.click|click\(|wp_update_post|wp_insert_post|update_option\()/);
  assert.doesNotMatch(wf,/\bcontents:\s*write\b/);
});
