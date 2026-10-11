import test from "node:test";
import assert from "node:assert/strict";
import { prepareInternalLinks, auditInternalTargets } from "../scripts/lib/internal-link-health.mjs";

test("core-link scanner retains safe page paths, sources and warns on HTTP",()=>{
  const pages=[
    {path:"/",links:["/koupelna-a-wc/#poradce-koupelna","https://zaprazi.cz/navrat-z-nemocnice/","https://ehub.cz/click", "/?s=senior", "/wp-json/zaprazi/v1/x", "/go/merchant", "/file.pdf"]},
    {path:"/choditka-pro-seniory/",links:["http://zaprazi.cz/koupelna-a-wc/","/koupelna-a-wc/","/out/something","mailto:info@zaprazi.cz"]}
  ];
  const result=prepareInternalLinks(pages);
  assert.deepEqual(result.targets,[
    {path:"/koupelna-a-wc/",sources:["/","/choditka-pro-seniory/"]},
    {path:"/navrat-z-nemocnice/",sources:["/"]}
  ]);
  assert.ok(result.excluded.some(x=>x.why==="http_internal"));
  assert.equal(result.excluded.filter(x=>x.why==="not_safe_public_page").length,5);
});

test("GET probe does not follow redirects and classifies broken pages",async()=>{
  const called=[];
  const mock=async(url,options)=>{
    called.push({url,options});
    const status=url.endsWith("/old/")?301:url.endsWith("/gone/")?404:200;
    return {status,headers:{get(name){
      return name==="location"&&status===301?"/updated/":name==="content-type"?"text/html":"";
    }},body:{cancel:async()=>{}}};
  };
  const data=await auditInternalTargets([
    {path:"/healthy/",sources:["/"]},{path:"/old/",sources:["/"]},
    {path:"/gone/",sources:["/"]}],mock);
  assert.equal(data.checked,3);
  assert.equal(data.ok,1);
  assert.equal(data.redirects.length,1);
  assert.equal(data.broken.length,1);
  assert.equal(data.broken[0].status,404);
  assert.ok(called.every(x=>x.options.redirect==="manual"&&x.options.method==="GET"));
  assert.ok(called.every(x=>x.url.startsWith("https://zaprazi.cz/")));
});

test("unsafe host, click route and unbounded scans are refused",async()=>{
  assert.throws(()=>prepareInternalLinks([],"https://other.example"),/exact production/);
  await assert.rejects(auditInternalTargets([{path:"/go/tracker",sources:["/"]}],async()=>{}),/Unsafe path/);
  await assert.rejects(auditInternalTargets(Array(121).fill({path:"/",sources:["/"]}),async()=>{}),/unbounded/);
});

test("network errors remain distinct from real HTTP 404",async()=>{
  const data=await auditInternalTargets([{path:"/offline/",sources:["/"]}],
    async()=>{throw new Error("test offline");});
  assert.equal(data.broken[0].outcome,"network_error");
  assert.equal(data.broken[0].status,null);
  assert.match(data.broken[0].reason,/offline/);
});
