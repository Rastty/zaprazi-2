import test from "node:test";
import assert from "node:assert/strict";
import {EXPECTED_LIVE_RELEASE} from "../scripts/lib/live-release.mjs";
import {
  auditLiveReleaseCoherence,readReleaseMarkers,verifyReleaseCoherence,RELEASE_CHECK_PATHS
} from "../scripts/audit-live-release-coherence.mjs";

const html=(release="0.8.185",integrity="ok")=>
  '<!doctype html><html><head><meta content="'+release+
  '" name="zaprazi-release"><meta name="zaprazi-integrity" content="'+integrity+
  '"></head><body></body></html>';
const readiness=(release="0.8.185")=>({
  release,integrity:"ok",slot_total:25,configured_total:25,
  groups:{mobility:{total:3,configured:3,missing:[]},other:{total:22,configured:22,missing:[]}}
});
const snapshot=()=>({
  before:readiness(),after:readiness(),expected:"0.8.185",
  pages:RELEASE_CHECK_PATHS.map(path=>({path,html:html()}))
});

test("reads release markers regardless of attribute order",()=>{
  assert.deepEqual(readReleaseMarkers(html()),{release:"0.8.185",integrity:"ok"});
});

test("accepts only one consistent, fully configured live snapshot",()=>{
  assert.deepEqual(verifyReleaseCoherence(snapshot()),{
    release:"0.8.185",integrity:"ok",pages:4,affiliate_slots:25,readiness_checks:2
  });
});

test("fails closed when one public page still serves the previous release",()=>{
  const s=snapshot();
  s.pages[2].html=html("0.8.184");
  assert.throws(()=>verifyReleaseCoherence(s),/Mixed release/);
});

test("fails closed when readiness changes during the page sample",()=>{
  const s=snapshot();
  s.after=readiness("0.8.186");
  assert.throws(()=>verifyReleaseCoherence(s),/Readiness release/);
});

test("rejects partial page integrity and duplicate release markers",()=>{
  assert.throws(()=>readReleaseMarkers(html("0.8.185","partial")) ,/integrity/);
  assert.throws(()=>readReleaseMarkers(html()+'<meta name="zaprazi-release" content="0.8.184">'),
    /duplicate/);
});

test("rejects incomplete affiliate groups or missing slots",()=>{
  const s=snapshot();
  s.before.groups.mobility.missing=["unknown"];
  assert.throws(()=>verifyReleaseCoherence(s),/group/);
  const t=snapshot();
  t.after.configured_total=24;
  assert.throws(()=>verifyReleaseCoherence(t),/slots/);
});

test("rejects duplicated or missing sample paths",()=>{
  const s=snapshot();
  s.pages[3].path=s.pages[0].path;
  assert.throws(()=>verifyReleaseCoherence(s),/duplicate/);
  const t=snapshot();
  t.pages.pop();
  assert.throws(()=>verifyReleaseCoherence(t),/Incomplete/);
});

test("never reflects a sensitive value in an error",()=>{
  const secret="health-answer-private-canary";
  const s=snapshot();
  s.pages[0].html=html(secret);
  assert.throws(()=>verifyReleaseCoherence(s),error=>{
    assert.ok(!error.message.includes(secret));
    return true;
  });
});

test("preflight retries a transport exception then checks the full exact release snapshot",async t=>{
  let requests=0;
  t.mock.method(globalThis,"fetch",async (url,options)=>{
    requests++;
    assert.equal(options.method,"GET");
    assert.equal(options.redirect,"error");
    assert.equal(options.cache,"no-store");
    assert.equal(new URL(url).origin,"https://zaprazi.cz");
    if(requests===1)throw new TypeError("transient network failure");
    if(url.endsWith("/affiliate-readiness"))
      return new Response(JSON.stringify(readiness(EXPECTED_LIVE_RELEASE)),{status:200});
    return new Response(html(EXPECTED_LIVE_RELEASE),{status:200});
  });
  assert.deepEqual(await auditLiveReleaseCoherence(),{
    release:EXPECTED_LIVE_RELEASE,integrity:"ok",pages:4,
    affiliate_slots:25,readiness_checks:2
  });
  assert.equal(requests,7);
});

test("preflight fails immediately on HTTP 503; retry cannot hide a bad server status",async t=>{
  let requests=0;
  t.mock.method(globalThis,"fetch",async ()=>{
    requests++;
    return new Response("unavailable",{status:503});
  });
  await assert.rejects(auditLiveReleaseCoherence(),/HTTP status is not 200/);
  assert.equal(requests,1);
});

test("rejects nominal 25/25 when group counts do not reconcile",()=>{
  const invalid=[
    {},
    {mobility:{total:3,configured:3,missing:[]}},
    {mobility:{total:26,configured:26,missing:[]}},
    {mobility:{total:25,configured:25,missing:[]},empty:{total:0,configured:0,missing:[]}},
    {mobility:{total:25.5,configured:25.5,missing:[]}},
    {mobility:{total:"25",configured:"25",missing:[]}},
    {mobility:{total:-1,configured:-1,missing:[]},other:{total:26,configured:26,missing:[]}},
    {mobility:{total:25,configured:25,missing:[]},broken:{}}
  ];
  for(const groups of invalid){
    for(const phase of ["before","after"]){
      const s=snapshot();
      s[phase].groups=groups;
      assert.throws(()=>verifyReleaseCoherence(s),/group/);
    }
  }
});
