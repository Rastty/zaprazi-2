import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const p=JSON.parse(read("data/organic-engagement-windows-20261122.json")).periods;
const date=s=>Date.parse(s+"T00:00:00Z");
test("27/28 day source periods reconcile against cohort and engine separately",()=>{
 assert.deepEqual(p.map(x=>x.days),[28,27]);
 for(const row of p){
  assert.equal((date(row.to)-date(row.from))/86400000+1,row.days);
  for(const type of ["cohorts","engines"]){
   for(const metric of ["sessions","engaged"])assert.equal(
    Object.values(row.organic[type]).reduce((a,v)=>a+v[metric],0),row.organic[metric]);
   for(const val of Object.values(row.organic[type]))assert.ok(
    Number.isSafeInteger(val.sessions)&&Number.isSafeInteger(val.engaged)&&val.engaged>=0&&val.engaged<=val.sessions);
  }
 }
});
test("one additional day is one engaged archived Seznam session",()=>{
 const [a,b]=p;assert.equal(a.to,b.to);assert.equal(date(b.from)-date(a.from),86400000);
 for(const type of ["organic"]){
  assert.equal(a[type].sessions-b[type].sessions,1);assert.equal(a[type].engaged-b[type].engaged,1);
 }
 for(const k of ["theme","unassigned"])assert.deepEqual(a.organic.cohorts[k],b.organic.cohorts[k]);
 for(const k of ["google","bing"])assert.deepEqual(a.organic.engines[k],b.organic.engines[k]);
 for(const metric of ["sessions","engaged"]){
  assert.equal(a.organic.cohorts.archive[metric]-b.organic.cohorts.archive[metric],1);
  assert.equal(a.organic.engines.seznam[metric]-b.organic.engines.seznam[metric],1);
 }
});
test("source evidence and public report never copy 28d total into 27d text",()=>{
 const d=read("docs/MEASUREMENT_BASELINE_2026-11-20.md"),s=read("PROJECT_STATE.md");
 assert.ok(d.includes("| **Celkem Organic Search** | **18** | **7** |"));
 assert.ok(d.includes("| 25. 10.–20. 11. (27 dní) | **18** | **7** |"));
 assert.ok(d.includes("| 24. 10.–20. 11. (28 dní) | **19** | **8** |"));
 assert.ok(s.includes("GA4 27d 25. 10.–20. 11.:** 18 Organic sessions"));
});
