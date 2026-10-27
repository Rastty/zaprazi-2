import test from "node:test";
import assert from "node:assert/strict";
import {report} from "../scripts/report-topical-authority-coverage.mjs";
test("Page link topology report covers all authored templates and has deterministic totals",()=>{
 assert.ok(report.pages>=50);
 assert.ok(report.publicContent>=45);
 assert.ok(Array.isArray(report.lowInbound));
 assert.equal(report.all.length,report.pages);
 assert.ok(report.all.some(x=>x.path==="/"));
 assert.ok(report.all.some(x=>x.path==="/senior-malo-pije/"));
 assert.ok(report.all.some(x=>x.path==="/senior-odmita-koupani/"));
 assert.ok(report.all.some(x=>x.path==="/senior-odmita-choditko/"));
 assert.ok(!report.lowInbound.some(x=>x.path==="/"));
 for(const p of report.all){
  assert.ok(p.inbound>=0&&p.outbound>=0);
  assert.equal(p.h1,1,"Unexpected H1 count: "+p.path);
 }
});
