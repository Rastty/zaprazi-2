import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {publicEditorialReport} from "../scripts/lib/public-editorial-report.mjs";

test("public editorial CI output never serializes untrusted URL, schema or metadata values",()=>{
  const secret="HEALTH_ANSWER_DO_NOT_LOG_20261101";
  const report={
    audited:2,edges:1,
    errors:[{path:"/guide/",code:"CANONICAL_MISMATCH",
      details:"https://zaprazi.cz/guide/?answer="+secret},
      {path:"/guide/?answer="+secret,code:"YOAST_SEARCH_SCHEME",
        details:"https://other.example/?answer="+secret}],
    warnings:[{path:"/guide/",code:"NOINDEX",details:"noindex "+secret}],
    inbound:{"/guide/":1,["/guide/?answer="+secret]:99},
    pages:[{path:"/guide/",status:200,h1:1,descriptionLength:120,words:200,
      outboundCore:1,inboundCore:1,mainContentInternalLinks:2,
      title:secret,canonical:"https://zaprazi.cz/guide/?answer="+secret,
      robots:"noindex "+secret,yoastSchema:secret},
      {path:"/guide/?answer="+secret,status:"fetch_error",h1:0,
        title:secret,canonical:secret,robots:secret}]
  };
  const safe=publicEditorialReport(report);
  assert.ok(!JSON.stringify(safe).includes(secret));
  assert.deepEqual(safe.summary.errors,[
    {path:"/guide/",code:"CANONICAL_MISMATCH"},
    {path:"unlisted_path",code:"YOAST_SEARCH_SCHEME"}
  ]);
  assert.deepEqual(safe.summary.warnings,[{path:"/guide/",code:"NOINDEX"}]);
  assert.deepEqual(safe.summary.inbound,{"/guide/":1});
  assert.equal(safe.pages[0].words,200);
  assert.equal(safe.pages[0].canonical,undefined);
  assert.equal(safe.pages[0].title,undefined);
  assert.equal(safe.pages[1].status,"fetch_error");
});

test("public reporter fails closed on unknown paths, codes and non-count fields",()=>{
  const safe=publicEditorialReport({audited:2,edges:0,errors:[
    {path:"/unsafe/#answer",code:"CANONICAL_MISMATCH\nSECRET"},
    {path:"/safe/",code:"NOINDEX"}],
    warnings:[],inbound:{"/safe/":"1000"},pages:[{
      path:"/unsafe/?answer=private",status:"secret",h1:"1",
      words:-1,descriptionLength:120.5
    }]});
  assert.deepEqual(safe.summary.errors,[
    {path:"unlisted_path",code:"UNCLASSIFIED"},
    {path:"/safe/",code:"NOINDEX"}
  ]);
  assert.equal(safe.summary.inbound["/safe/"],null);
  assert.equal(safe.pages[0].status,"unknown");
  assert.equal(safe.pages[0].words,null);
  assert.equal(safe.pages[0].descriptionLength,null);
});

test("live SEO audit logs only sanitized public report and fixed browser failure codes",()=>{
  const runner=readFileSync(new URL("../scripts/audit-live-editorial-seo.mjs",import.meta.url),"utf8");
  assert.match(runner,/publicEditorialReport\(report\)/);
  assert.match(runner,/canonical_matches:result\.canonical===base\+path/);
  assert.doesNotMatch(runner,/description:result\.description\.length,canonical:result\.canonical/);
  assert.doesNotMatch(runner,/PAGE_AUDIT_FAILURE",path,String\(error\)/);
  assert.doesNotMatch(runner,/JSON\.stringify\(summary\)|JSON\.stringify\(pages\)/);
});
