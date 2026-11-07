import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractCanonicalTargets, statusOf, checkCanonicalTarget,
  auditCanonicalTargets, markdownSummary } from "../scripts/audit-canonical-merchant-targets.mjs";

const source=readFileSync(new URL("../functions.php",import.meta.url),"utf8");
const small="function zaprazi_2_affiliate_targets() { return array("+
  "'rehabilitacni-pomucky-cz:besco-wa17'=>'https://www.rehabilitacnipomucky.cz/wa17/',"+
  "'lekarna-cz:meyra-ideal-3061982'=>'https://www.lekarna.cz/ideal/'"+
  "); }";

test("exact current PHP canonical inventory: 25 unique merchant product URLs, no tracking params",()=>{
  const targets=extractCanonicalTargets(source);
  assert.equal(targets.length,25);
  assert.equal(new Set(targets.map(x=>x.key)).size,25);
  assert.ok(targets.some(x=>x.key==="rehabilitacni-pomucky-cz:besco-wa17"));
  assert.ok(targets.some(x=>x.key==="lekarna-cz:meyra-ideal-3061982"));
  assert.ok(targets.every(x=>x.url.startsWith("https://")));
});

test("fail closed on unexpected host, duplicate, canonical query, missing slot or extra PHP",()=>{
  assert.equal(extractCanonicalTargets(small,2).length,2);
  for(const bad of [
    small.replace("www.lekarna.cz","evil.example"),
    small.replace("https://www.lekarna.cz/ideal/","http://www.lekarna.cz/ideal/"),
    small.replace("/ideal/","/ideal/?answer=yes"),
    small.replace("/ideal/","/"),
    small.replace("'lekarna-cz:meyra-ideal-3061982'","'rehabilitacni-pomucky-cz:besco-wa17'"),
    small.replace("); }",", badsyntax); }")
  ]) assert.throws(()=>extractCanonicalTargets(bad,2));
  assert.throws(()=>extractCanonicalTargets(small),/count/);
});

test("request never follows merchant redirects, sends no referral, cookie, answers or affiliate URL",async()=>{
  const target=extractCanonicalTargets(small,2)[0];
  const calls=[];
  const fetchImpl=async(url,opts)=>{calls.push({url,opts});return {status:301}};
  const result=await checkCanonicalTarget(target,fetchImpl);
  assert.equal(result.status,"redirect_review");
  assert.equal(result.http_status,301);
  assert.equal(calls.length,1);
  assert.equal(calls[0].url,target.url);
  assert.equal(calls[0].opts.method,"GET");
  assert.equal(calls[0].opts.redirect,"manual");
  assert.deepEqual(calls[0].opts.headers,{Accept:"text/html"});
  assert.deepEqual(Object.keys(calls[0].opts.headers),["Accept"]);
  assert.ok(!("url" in result),"Never log canonical or redirect location in report");
});
test("HTTP 200 at a different final URL is not canonical product evidence and never leaks URL",async()=>{
  const target=extractCanonicalTargets(small,2)[0];
  const redirected="https://www.rehabilitacnipomucky.cz/other-product/?secret=do-not-log";
  const result=await checkCanonicalTarget(target,async()=>({status:200,url:redirected}));
  assert.equal(result.status,"redirect_review");
  assert.equal(result.http_status,200);
  assert.ok(!JSON.stringify(result).includes(redirected));
  assert.ok(!("url" in result));
  const exact=await checkCanonicalTarget(target,async()=>({status:200,url:target.url}));
  assert.equal(exact.status,"http_ok_identity_unverified");
});
test("404/410 are review, blocking/throttling and failures are UNKNOWN not proven broken",async()=>{
  assert.equal(statusOf(200),"http_ok_identity_unverified");
  assert.equal(statusOf(404),"not_found_review");
  assert.equal(statusOf(410),"not_found_review");
  assert.equal(statusOf(302),"redirect_review");
  assert.equal(statusOf(403),"access_unverifiable");
  assert.equal(statusOf(429),"access_unverifiable");
  assert.equal(statusOf(500),"upstream_unavailable");
  const target=extractCanonicalTargets(small,2)[0];
  const result=await checkCanonicalTarget(target,()=>{throw Error("private detail must not leak");});
  assert.equal(result.status,"network_unverifiable");
  assert.ok(!JSON.stringify(result).includes("private detail"));
});
test("bounded audit reports each slot once and distinguishes HTTP reachability from affiliate approval",async()=>{
  const targets=extractCanonicalTargets(small,2);
  const statuses=[200,429];
  let count=0;
  const report=await auditCanonicalTargets(targets,async()=>({status:statuses[count++]}),2);
  assert.equal(report.total,2);
  assert.equal(report.counts.http_ok_identity_unverified,1);
  assert.equal(report.counts.access_unverifiable,1);
  assert.match(report.limitations,/not product identity/);
  assert.match(markdownSummary(report),/access_unverifiable/);
  await assert.rejects(()=>auditCanonicalTargets(targets,()=>({status:200}),4),/Bound public requests/);
});

test("HTTP 200 serving non-HTML is not treated as a reachable product page",async()=>{
  const target=extractCanonicalTargets(small,2)[0];
  const fake=(type)=>({status:200,url:target.url,headers:{get:(name)=>name==="content-type"?type:null}});
  assert.equal((await checkCanonicalTarget(target,async()=>fake("application/json"))).status,"unexpected_content_review");
  assert.equal((await checkCanonicalTarget(target,async()=>fake("text/plain; charset=utf-8"))).status,"unexpected_content_review");
  assert.equal((await checkCanonicalTarget(target,async()=>fake("text/html; charset=UTF-8"))).status,"http_ok_identity_unverified");
  assert.equal((await checkCanonicalTarget(target,async()=>fake(null))).status,"http_ok_identity_unverified");
  const report=await auditCanonicalTargets([target],async()=>fake("application/pdf"));
  assert.equal(report.counts.unexpected_content_review,1);
  assert.ok(!JSON.stringify(report).includes(target.url));
});


test("body cleanup failure does not mask a real merchant HTTP response",async()=>{
  const target=extractCanonicalTargets(small,2)[0];
  for(const status of [200,404,403]){
    const result=await checkCanonicalTarget(target,async()=>({
      status,url:target.url,headers:{get:()=>"text/html"},
      body:{cancel:async()=>{throw Error("private stream detail must not leak");}}
    }));
    assert.equal(result.http_status,status);
    assert.equal(result.status,statusOf(status));
    assert.ok(!JSON.stringify(result).includes("private stream detail"));
  }
});
