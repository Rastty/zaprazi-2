import test from "node:test";
import assert from "node:assert/strict";
import {
  RELEASE_CHANGED_PATHS,validateCandidatePaths,indexNowKeyLocation,
  releaseGate,indexNowPayload,runIndexNow
} from "../scripts/seznam-indexnow-248.mjs";
const ORIGIN="https://zaprazi.cz";
const KEY="ZPIndexNow2026Mobility83721";
const state=verifiedRelease=>({nodes:{safety_qa:{status:"verified",verifiedRelease,
  evidenceUrl:"https://github.com/Rastty/zaprazi-2/actions/runs/45008893699"}}});
const meta=(v="0.8.248")=>'<meta name="zaprazi-release" content="'+v+'">'+
  '<meta name="zaprazi-integrity" content="ok">';
const transport=()=>meta()+'<section class="zp-hero"><p class="zp-transport-mobility-route">'+
  'dojít bezpečně k autu nebo do ordinace; bez fyzického přidržování '+
  '<a href="https://zaprazi.cz/choditka-pro-seniory/#vyber-typu">Typ opory</a> '+
  'Chodítko ale neřeší nemožnost bezpečně nastoupit do auta; odborné posouzení.</p></section>';
const stairs=()=>meta()+'<article class="zp-decision-card">'+
  '<h3>4. Před propuštěním z nemocnice vše domluvte</h3>'+
  'schody komplikují i cestu na plánované vyšetření '+
  '<a href="https://zaprazi.cz/prevoz-seniora-k-lekari/#vyber-dopravy">Doprava</a> '+
  'automaticky nezakládají nárok na hrazenou sanitku; rozhoduje lékař</article>';
function mock(options={}){
 const calls=[];
 const serve=async(url,opt)=>{
  calls.push({url,opt});
  if(opt.method==="POST")return {status:options.postStatus??200,url};
  const body=url.endsWith("/affiliate-readiness")?JSON.stringify({
    release:options.release??"0.8.248",integrity:"ok",slot_total:25,configured_total:25
  }):url===ORIGIN+"/"+KEY+".txt"?(options.keyBody??KEY):
    url===ORIGIN+"/prevoz-seniora-k-lekari/"?(options.transport??transport()):
    url===ORIGIN+"/schody-pro-seniora-doma/"?(options.stairs??stairs()):"";
  return {status:url===ORIGIN+"/"+KEY+".txt"?(options.keyStatus??200):200,
    url,headers:{get:()=>null},text:async()=>body};
 };
 return {calls,serve};
}
test("only the two previously reviewed 0.8.248 canonical pages are eligible",()=>{
 const urls=validateCandidatePaths();
 assert.deepEqual(urls,RELEASE_CHANGED_PATHS.map(x=>ORIGIN+x));
 for(const list of [[RELEASE_CHANGED_PATHS[0]],
   [...RELEASE_CHANGED_PATHS, "/"],[...RELEASE_CHANGED_PATHS].reverse(),
   [RELEASE_CHANGED_PATHS[0],RELEASE_CHANGED_PATHS[0]],
   ["/wp-content/themes/zaprazi-2/",RELEASE_CHANGED_PATHS[1]]]){
  assert.throws(()=>validateCandidatePaths(list),/UNREVIEWED_CANONICALS/);
 }
});
test("domain-root proof cannot be an arbitrary theme-subfolder URL",()=>{
 assert.equal(indexNowKeyLocation(KEY),ORIGIN+"/"+KEY+".txt");
 for(const invalid of ["x","../key","/themes/key","token?answer=private","a".repeat(129),""])
  assert.throws(()=>indexNowKeyLocation(invalid),/INVALID_KEY/);
 const payload=indexNowPayload(KEY);
 assert.deepEqual(Object.keys(payload),["host","key","keyLocation","urlList"]);
 assert.equal(payload.host,"zaprazi.cz");
 assert.equal(payload.urlList.length,2);
});
test("pending source release or older accepted WordPress must do zero external calls",async()=>{
 for(const [s,release,expected] of [
  [state("0.8.247"),"0.8.248","pending_independent_wp_release_qa"],
  [state("0.8.248"),"0.8.249","source_release_requires_manual_review"]
 ]){
  const m=mock();
  const result=await runIndexNow({state:s,source:release,key:KEY,mode:"submit",fetchImpl:m.serve});
  assert.equal(result.status,expected);assert.equal(result.indexnow_posts,0);
  assert.equal(m.calls.length,0);
 }
});
test("offline dry-run needs no key, credential, WordPress fetch or submission",async()=>{
 const m=mock();const r=await runIndexNow({state:state("0.8.247"),
   source:"0.8.248",mode:"dry-run",fetchImpl:m.serve});
 assert.equal(r.status,"pending_independent_wp_release_qa");
 assert.equal(r.indexnow_posts,0);assert.equal(m.calls.length,0);
 assert.doesNotMatch(JSON.stringify(r),/indexnowkey|ZPIndexNow|diagnosis/);
});
test("even accepted release cannot submit unless domain-root key configured",async()=>{
 const m=mock();const r=await runIndexNow({state:state("0.8.248"),
   source:"0.8.248",mode:"submit",fetchImpl:m.serve});
 assert.equal(r.status,"domain_root_key_not_configured");
 assert.equal(m.calls.length,0);
});
test("valid exact acceptance probes four own-origin GETs; no merchant/cookie requests",async()=>{
 const m=mock();const r=await runIndexNow({state:state("0.8.248"),
   source:"0.8.248",key:KEY,mode:"probe",fetchImpl:m.serve});
 assert.equal(r.status,"ready_no_external_submission");
 assert.equal(r.indexnow_posts,0);
 assert.deepEqual(m.calls.map(x=>x.url),[
  ORIGIN+"/wp-json/zaprazi/v1/affiliate-readiness",
  ORIGIN+"/"+KEY+".txt",
  ORIGIN+"/prevoz-seniora-k-lekari/",ORIGIN+"/schody-pro-seniora-doma/"
 ]);
 assert.ok(m.calls.every(x=>x.opt.method==="GET"&&x.opt.redirect==="error"&&
   !x.url.includes("?")&&!x.opt.headers?.Cookie));
 assert.doesNotMatch(JSON.stringify(r),/ZPIndexNow|click-|ehub/);
});
test("wrong key, unavailable root, partial WordPress and stale content fail without POST",async()=>{
 for(const variant of [
  {keyBody:"different"},
  {keyStatus:404},
  {release:"0.8.247"},
  {transport:transport().replace("bez fyzického přidržování","")},
  {stairs:stairs().replace("rozhoduje lékař","")}
 ]){
  const m=mock(variant);
  await assert.rejects(()=>runIndexNow({state:state("0.8.248"),
    source:"0.8.248",key:KEY,mode:"submit",fetchImpl:m.serve}));
  assert.equal(m.calls.some(x=>x.opt.method==="POST"),false);
 }
});
test("actual Seznam POST allowed only after readback, response means receipt NOT indexing",async()=>{
 const m=mock();const r=await runIndexNow({state:state("0.8.248"),
    source:"0.8.248",key:KEY,mode:"submit",fetchImpl:m.serve});
 assert.equal(r.status,"indexnow_receipt_only");
 assert.equal(r.indexnow_posts,1);assert.equal(r.indexed_urls_verified,false);
 const posted=m.calls.filter(x=>x.opt.method==="POST");
 assert.equal(posted.length,1);
 assert.equal(posted[0].url,"https://search.seznam.cz/indexnow");
 const body=JSON.parse(posted[0].opt.body);
 assert.equal(body.keyLocation,ORIGIN+"/"+KEY+".txt");
 assert.deepEqual(body.urlList,RELEASE_CHANGED_PATHS.map(p=>ORIGIN+p));
 assert.equal(m.calls.length,5);
 const blocked=mock({postStatus:403});
 await assert.rejects(()=>runIndexNow({state:state("0.8.248"),
   source:"0.8.248",key:KEY,mode:"submit",fetchImpl:blocked.serve}),
   /INDEXNOW_NOT_ACCEPTED/);
});
