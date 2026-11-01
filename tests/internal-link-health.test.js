import test from "node:test";
import assert from "node:assert/strict";
import { prepareInternalLinks, auditInternalTargets, prepareInternalFragments, auditInternalFragments, publicFragmentReport, isSafeMainFrameNavigation } from "../scripts/lib/internal-link-health.mjs";

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
  assert.deepEqual(result.insecure_internal_links,{count:1,sources:["/choditka-pro-seniory/"]});
  assert.equal(result.excluded.filter(x=>x.why==="not_safe_public_page").length,5);
});

test("first-party HTTP hrefs are reported even if HTTPS target is healthy",()=>{
  const report=prepareInternalLinks([
    {path:"/",links:["http://zaprazi.cz/guide/","http://zaprazi.cz/guide/?q=sample","https://zaprazi.cz/guide/"]},
    {path:"/guide/",links:["https://zaprazi.cz/guide/"]}
  ]);
  assert.deepEqual(report.targets,[{path:"/guide/",sources:["/","/guide/"]}]);
  assert.deepEqual(report.insecure_internal_links,{count:2,sources:["/"]});
  assert.deepEqual(prepareInternalLinks([{path:"/",links:["/guide/"]}])
    .insecure_internal_links,{count:0,sources:[]});
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

test("HTTP 200 is healthy only when the target is an HTML document",async()=>{
  const targets=[{path:"/guide/",sources:["/"]}];
  for(const mime of ["application/json", "application/pdf", "", "application/octet-stream"]){
    const result=await auditInternalTargets(targets,async()=>({
      status:200,headers:{get:name=>name==="content-type"?mime:""},
      body:{cancel:async()=>{}}
    }));
    assert.equal(result.ok,0,"A non-HTML soft-200 must not pass");
    assert.equal(result.broken.length,1);
    assert.equal(result.broken[0].outcome,"non_html_200");
    assert.equal(result.broken[0].status,200);
    assert.ok(["other","missing"].includes(result.broken[0].type));
  }
  for(const mime of ["text/html; charset=UTF-8", "application/xhtml+xml"]){
    const result=await auditInternalTargets(targets,async()=>({
      status:200,headers:{get:name=>name==="content-type"?mime:""},
      body:{cancel:async()=>{}}
    }));
    assert.equal(result.ok,1);
    assert.deepEqual(result.broken,[]);
  }
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
  assert.equal(data.broken[0].reason,"request_failed");
});

test("fragment audit detects missing live DOM IDs even when target path is HTTP 200",()=>{
  const pages=[
    {path:"/",links:["#poradce","/choditka-pro-seniory/#vyber-typu",
      "/koupelna-a-wc/#bezpe%C4%8D%C3%AD","/go/merchant#track",
      "https://other.example/path/#x","/page/?q=health#answer"]},
    {path:"/choditka-pro-seniory/",links:["/#poradce",
      "/choditka-pro-seniory/#vyber-typu"]}
  ];
  const targets=prepareInternalFragments(pages);
  assert.deepEqual(targets,[
    {path:"/",fragment:"poradce",sources:["/","/choditka-pro-seniory/"]},
    {path:"/choditka-pro-seniory/",fragment:"vyber-typu",
      sources:["/","/choditka-pro-seniory/"]},
    {path:"/koupelna-a-wc/",fragment:"bezpečí",sources:["/"]}
  ]);
  const report=auditInternalFragments(targets,new Map([
    ["/",new Set(["poradce"])],
    ["/choditka-pro-seniory/",new Set(["other-section"])],
    ["/koupelna-a-wc/",new Set(["bezpečí"])]
  ]));
  assert.equal(report.checked,3);
  assert.equal(report.broken.length,1);
  assert.equal(report.broken[0].path,"/choditka-pro-seniory/");
  assert.equal(report.broken[0].fragment,"vyber-typu");
  assert.equal(report.unchecked.length,0);
});

test("fragment audit never assumes missing DOM data means anchor success",()=>{
  const targets=prepareInternalFragments([{path:"/",links:["/other/#needed"]}]);
  const report=auditInternalFragments(targets,new Map());
  assert.equal(report.checked,0);
  assert.equal(report.broken.length,0);
  assert.deepEqual(report.unchecked.map(x=>x.path),["/other/"]);
  assert.throws(()=>prepareInternalFragments([],"https://other.example"),/exact production/);
  assert.throws(()=>auditInternalFragments(Array(241).fill(targets[0]),new Map()),/unbounded/);
});


test("live link audit redacts sensitive URL parameters and redirect targets from CI output",async()=>{
  const secret="HEALTH_ANSWER_DO_NOT_LOG_937";
  const prepared=prepareInternalLinks([
    {path:"/",links:[
      "http://zaprazi.cz/walker/?answer="+secret,
      "/go/merchant/?answer="+secret,
      "/private/?answer="+secret
    ]}
  ]);
  assert.ok(!JSON.stringify(prepared).includes(secret));
  assert.equal(prepared.excluded.filter(x=>x.why==="http_internal").length,1);
  assert.ok(prepared.excluded.every(x=>!Object.hasOwn(x,"href")));

  const target=[{path:"/walker/",sources:["/"]}];
  const response=location=>async()=>({
    status:302,headers:{get:name=>name==="location"?location:""},
    body:{cancel:async()=>{}}
  });
  const same=await auditInternalTargets(target,response("/next/"));
  assert.equal(same.redirects[0].redirect,"same_origin");
  assert.equal(same.broken.length,0);

  const sensitive=await auditInternalTargets(target,response("/next/?answer="+secret));
  assert.equal(sensitive.redirects[0].redirect,"off_origin_or_unsafe");
  assert.equal(sensitive.broken[0].outcome,"unsafe_redirect");
  assert.ok(!JSON.stringify(sensitive).includes(secret));

  const external=await auditInternalTargets(target,
    response("https://elsewhere.invalid/collect?answer="+secret));
  assert.equal(external.redirects[0].redirect,"off_origin_or_unsafe");
  assert.equal(external.broken[0].outcome,"unsafe_redirect");
  assert.ok(!JSON.stringify(external).includes(secret));
  const invalid=await auditInternalTargets(target,response("http://[invalid"));
  assert.equal(invalid.redirects[0].redirect,"invalid");
  const absent=await auditInternalTargets(target,response(""));
  assert.equal(absent.redirects[0].redirect,"missing");
});


test("public link audit does not leak sensitive error text, headers or rejected paths",async()=>{
  const secret="HEALTH_ANSWER_DO_NOT_LOG_731";
  const rows=[{path:"/safe/",sources:["/"]}];
  const errorReport=await auditInternalTargets(rows,async()=>{
    throw new Error("fetch failed for https://zaprazi.cz/safe/?answer="+secret);
  });
  assert.equal(errorReport.broken[0].reason,"request_failed");
  assert.ok(!JSON.stringify(errorReport).includes(secret));

  const headerReport=await auditInternalTargets(rows,async()=>({
    status:200,
    headers:{get:name=>name==="content-type"?"text/html; answer="+secret:""},
    body:{cancel:async()=>{}}
  }));
  assert.equal(headerReport.checked_paths[0].type,"text/html");
  assert.ok(!JSON.stringify(headerReport).includes(secret));

  const weirdHeader=await auditInternalTargets(rows,async()=>({
    status:200,headers:{get:name=>name==="content-type"?"custom/"+secret:""},
    body:{cancel:async()=>{}}
  }));
  assert.equal(weirdHeader.checked_paths[0].type,"other");
  assert.ok(!JSON.stringify(weirdHeader).includes(secret));

  await assert.rejects(auditInternalTargets([
    {path:"/safe/?answer="+secret,sources:["/"]}
  ],async()=>{}),error=>!String(error).includes(secret)&&/Unsafe path/.test(String(error)));
});

test("public fragment audit never exposes health answers embedded in anchor IDs",()=>{
  const canary="HEALTH_ANSWER_DO_NOT_LOG_621";
  const targets=prepareInternalFragments([
    {path:"/",links:["/choditka-pro-seniory/#answer_"+canary,
      "/missing/#diagnosis_"+canary]}
  ]);
  const report=auditInternalFragments(targets,new Map([
    ["/choditka-pro-seniory/",new Set(["unrelated-id"])]
  ]));
  assert.equal(report.broken.length,1);
  assert.equal(report.unchecked.length,1);
  assert.ok(JSON.stringify(report).includes(canary)); // Regression setup must exercise the leak.
  const publicReport=publicFragmentReport(report);
  assert.equal(publicReport.broken_count,1);
  assert.equal(publicReport.unchecked_count,1);
  assert.deepEqual(publicReport.affected_source_pages,["/"]);
  assert.ok(!JSON.stringify(publicReport).includes(canary));
  assert.ok(!JSON.stringify(publicReport).includes("diagnosis"));
  assert.ok(!JSON.stringify(publicReport).includes("/missing/"));
  assert.equal(Object.hasOwn(publicReport,"broken"),false);
  assert.equal(Object.hasOwn(publicReport,"unchecked"),false);
});


test("encoded paths cannot bypass click-route or WP endpoint exclusions", async () => {
  const encoded = [
    "/%67o/merchant/", "/go%2Fmerchant/", "/%6Fut/offer/",
    "/wp%2Djson/zaprazi/", "/%77p-json/zaprazi/", "/ordinary%2Fgo/merchant/"
  ];
  const pages=[{path:"/",links:[
    "/safe-public-page/", ...encoded,
    ...encoded.map(path=>path+"#section")
  ]}];
  const prepared=prepareInternalLinks(pages);
  assert.deepEqual(prepared.targets,[{path:"/safe-public-page/",sources:["/"]}]);
  assert.equal(prepared.excluded.filter(row=>row.why==="not_safe_public_page").length,
    encoded.length*2);
  const fragments=prepareInternalFragments(pages);
  assert.deepEqual(fragments,[]);

  let requests=0;
  for (const path of encoded) {
    await assert.rejects(
      auditInternalTargets([{path,sources:["/"]}],async()=>{
        requests++;
        throw new Error("Unsafe network request");
      }),
      /Unsafe path selected for GET/
    );
  }
  assert.equal(requests,0,"No encoded route may reach the network");
});

test("unsafe redirects are failed, never silently counted as healthy links",async()=>{
  const target=[{path:"/walking/",sources:["/"]}];
  for(const location of [
    "https://elsewhere.invalid/path/", "http://zaprazi.cz/guide/",
    "/go/merchant/", "/wp-json/zaprazi/v1/route", "/safe/?answer=private",
    "/safe/#private", "http://[invalid", ""
  ]){
    const report=await auditInternalTargets(target,async()=>({
      status:301,headers:{get:name=>name==="location"?location:"text/html"},
      body:{cancel:async()=>{}}
    }));
    assert.equal(report.broken.length,1,"Redirect must fail closed");
    assert.equal(report.broken[0].outcome,"unsafe_redirect");
    assert.equal(report.redirects.length,1);
    if(location)assert.ok(!JSON.stringify(report).includes(location),
      "Public report must not echo untrusted Location");
  }
});

test("DOM link crawler only permits exact expected top-frame URL",()=>{
  assert.equal(isSafeMainFrameNavigation("https://zaprazi.cz/guide/","/guide/"),true);
  assert.equal(isSafeMainFrameNavigation("https://zaprazi.cz/","/"),true);
  for(const url of [
    "https://elsewhere.invalid/guide/", "http://zaprazi.cz/guide/",
    "https://zaprazi.cz/other/", "https://zaprazi.cz/guide/?answer=private",
    "https://zaprazi.cz/guide/#answer", "https://zaprazi.cz/go/merchant/"
  ])assert.equal(isSafeMainFrameNavigation(url,"/guide/"),false);
  assert.equal(isSafeMainFrameNavigation("https://zaprazi.cz/go/merchant/","/go/merchant/"),false);
  assert.equal(isSafeMainFrameNavigation("https://zaprazi.cz/guide/","/guide/","https://elsewhere.invalid"),false);
});
