import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  INDEX_WATCH_PATHS,inspectIndexabilityHtml,fetchLiveIndexability,selectIndexWatchScope
} from "../scripts/audit-index-watch-live.mjs";
const ORIGIN="https://zaprazi.cz";
const path=INDEX_WATCH_PATHS[0];
const headers=()=>new Headers({"content-type":"text/html; charset=UTF-8"});
const html=(p=path,extra="",body="Useful unique decision content ".repeat(20))=>
  '<!doctype html><html lang="cs"><head><title>Chodítka pro seniory</title>'+
  '<meta name="zaprazi-release" content="0.8.217">'+
  '<meta name="zaprazi-integrity" content="ok">'+
  '<link rel="canonical" href="'+ORIGIN+p+'">'+extra+
  '</head><body><main><h1>Jak vybrat chodítko?</h1>'+body+'</main></body></html>';
test("four exact previously excluded URLs are the sole authorized live watch",()=>{
 assert.deepEqual(INDEX_WATCH_PATHS,[
   "/choditka-pro-seniory/",
   "/choditko-do-bytu-pro-seniory/",
   "/co-zmerit-pred-vyberem-choditka/",
   "/sprchovaci-zidle-pro-seniory/"
 ]);
 for(const p of INDEX_WATCH_PATHS)
   assert.equal(inspectIndexabilityHtml(p,html(p),headers(),"0.8.217").canonical,"self");
 for(const p of ["/go/merchant/","/wp-admin/","/secret-health-query/",
     "/choditka-pro-seniory/?patient_id=123","https://evil.example/"])
   assert.throws(()=>inspectIndexabilityHtml(p,html(p),headers(),"0.8.217"),/UNAUTHORIZED/);
});
test("canonical, robots and release gates are independent and fail closed",()=>{
 const variations=[
  html(path,'<link rel="canonical" href="'+ORIGIN+path+'">'),
  html("/rollator-pro-seniory/"),
  html(path,'<meta name="robots" content="noindex, follow">'),
  html(path,'<meta name="googlebot" content="none">'),
  html(path).replace('content="0.8.217"','content="0.8.216"'),
  html(path).replace('content="ok"','content="mismatch"'),
  html(path).replace('name="zaprazi-integrity"','name="wrong-integrity"'),
  html(path).replace('<head>','<div>'),
  '<!doctype html><html><head></head></html>',
 ];
 for(const value of variations){
   assert.throws(()=>inspectIndexabilityHtml(path,value,headers(),"0.8.217"));
 }
 const withHeader=headers();withHeader.set("x-robots-tag","googlebot: noindex");
 assert.throws(()=>inspectIndexabilityHtml(path,html(path),withHeader,"0.8.217"),/NOINDEX/);
 const good=inspectIndexabilityHtml(path,
   html(path,'<meta name="robots" content="index, follow">'),headers(),"0.8.217");
 assert.equal(good.explicitNoindex,false);
});
test("0.8.221 PR checks exact 0.8.220 production, never approves a predeploy source",()=>{
 const live={release:"0.8.220",integrity:"ok",configured_total:25,slot_total:25};
 assert.deepEqual(selectIndexWatchScope("pull_request","0.8.221",live),
   {release:"0.8.220",mode:"predeploy_verified_220_only"});
 assert.deepEqual(selectIndexWatchScope("push","0.8.220",live),
   {release:"0.8.220",mode:"exact_live_source"});
 for(const [event,source,value] of [
   ["push","0.8.221",live],["schedule","0.8.221",live],
   ["pull_request","0.8.222",live],["pull_request","0.8.221",{...live,release:"0.8.219"}],
   ["pull_request","0.8.221",{...live,integrity:"partial"}],
   ["pull_request","0.8.221",{...live,slot_total:24}]
 ])assert.throws(()=>selectIndexWatchScope(event,source,value),/INDEX_LIVE_/);
});
test("0.8.234 PR checks exact live 0.8.233 only and never claims production acceptance",()=>{
 const live={release:"0.8.233",integrity:"ok",configured_total:25,slot_total:25};
 assert.deepEqual(selectIndexWatchScope("pull_request","0.8.234",live),
   {release:"0.8.233",mode:"predeploy_verified_233_only"});
 assert.deepEqual(selectIndexWatchScope("schedule","0.8.234",{...live,release:"0.8.234"}),
   {release:"0.8.234",mode:"exact_live_source"});
 for(const [event,source,readiness] of [
   ["push","0.8.234",live],
   ["schedule","0.8.234",live],
   ["pull_request","0.8.234",{...live,release:"0.8.232"}],
   ["pull_request","0.8.234",{...live,integrity:"partial"}],
   ["pull_request","0.8.234",{...live,configured_total:24}]
 ])assert.throws(()=>selectIndexWatchScope(event,source,readiness),/INDEX_LIVE_/);
});
test("0.8.235 visual-only PR audits exactly deployed 0.8.234",()=>{
 const live={release:"0.8.234",integrity:"ok",configured_total:25,slot_total:25};
 assert.deepEqual(selectIndexWatchScope("pull_request","0.8.235",live),
   {release:"0.8.234",mode:"predeploy_verified_234_only"});
 assert.deepEqual(selectIndexWatchScope("schedule","0.8.235",{...live,release:"0.8.235"}),
   {release:"0.8.235",mode:"exact_live_source"});
 for(const [event,readiness] of [
   ["push",live],["schedule",live],
   ["pull_request",{...live,release:"0.8.233"}],
   ["pull_request",{...live,integrity:"partial"}],
   ["pull_request",{...live,slot_total:24}]
 ])assert.throws(()=>selectIndexWatchScope(event,"0.8.235",readiness),/INDEX_LIVE_/);
});
test("commented or scripted fake canonical/meta tags never satisfy the real head",()=>{
 const decoys=[
   '<!-- <link rel="canonical" href="'+ORIGIN+path+'"> -->',
   '<script type="application/ld+json">{"canonical":"'+ORIGIN+path+'","noindex":true}</script>',
   '<template><link rel="canonical" href="'+ORIGIN+path+'"></template>'
 ];
 for(const s of decoys){
  const noCanonical=html(path,s).replace(
    '<link rel="canonical" href="'+ORIGIN+path+'">',"");
  assert.throws(()=>inspectIndexabilityHtml(path,noCanonical,headers(),"0.8.217"),/CANONICAL/);
 }
 const withComment=html(path,'<!-- <meta name="robots" content="noindex"> -->');
 assert.equal(inspectIndexabilityHtml(path,withComment,headers(),"0.8.217").canonical,"self");
});
test("exact public HTML GET never follows redirects, accepts only 200 HTML",async()=>{
 const requests=[];
 const ok=async(url,opts)=>{
   requests.push({url,redirect:opts.redirect});
   return new Response(html(path),{status:200,headers:headers()});
 };
 const result=await fetchLiveIndexability(path,ok,"0.8.217");
 assert.equal(result.http,200);
 assert.deepEqual(requests,[{url:ORIGIN+path,redirect:"error"}]);
 await assert.rejects(fetchLiveIndexability(path,async()=>new Response("",{status:302,
     headers:{"location":"https://merchant.example/secret"}}),"0.8.217"),/NOT_200/);
 await assert.rejects(fetchLiveIndexability(path,async()=>new Response("json",{status:200,
     headers:{"content-type":"application/json"}}),"0.8.217"),/NOT_HTML/);
 await assert.rejects(fetchLiveIndexability(path,async()=>{throw Error("TOKEN_IN_ERROR")}),
   /NETWORK_OR_REDIRECT_FAILED/);
 await assert.rejects(fetchLiveIndexability("/out/click",ok,"0.8.217"),/UNAUTHORIZED/);
});
test("source is a read-only audit with no GSC credentials, writes or merchant navigation",()=>{
 const source=readFileSync(new URL("../scripts/audit-index-watch-live.mjs",import.meta.url),"utf8");
 for(const pattern of [/writeFileSync/,/wp_update_post/,/wp_remote_post/,
  /oauth2.googleapis.com/,/searchconsole.googleapis.com/,/sendBeacon/,/axios/])
  assert.doesNotMatch(source,pattern);
});
