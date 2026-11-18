import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractCanonicalTargets, markdownSummary } from "../scripts/audit-canonical-merchant-targets.mjs";
import { curatedOfferObservations, auditOfferObservationAge, markdownOfferAgeSummary } from "../scripts/lib/merchant-offer-age-audit.mjs";

const php = readFileSync(new URL("../functions.php", import.meta.url), "utf8");
const targets = extractCanonicalTargets(php);
const observations = curatedOfferObservations();
const now = new Date("2026-11-18T12:00:00Z");

test("all 25 PHP slots have exactly one matching, source-owned dated observation", () => {
  const report = auditOfferObservationAge(targets, observations, now);
  assert.equal(report.total, 25);
  assert.equal(report.counts.fresh + report.counts.stale + report.counts.unknown, 25);
  assert.deepEqual(new Set(report.results.map(x => x.group)),
    new Set(["mobility", "bathroom", "bed", "wheelchair", "adl", "footwear"]));
  assert.equal(new Set(report.results.map(x => x.key)).size, 25);
  assert.equal(report.counts.stale, 25, "The historical October source observations must be recognized as aged on November 18");
  const serialized = JSON.stringify(report) + markdownOfferAgeSummary(report);
  assert.ok(!serialized.includes("https://"), "Never expose raw merchant or affiliate URLs in summary");
  assert.match(markdownSummary({counts:{},results:[],limitations:"HTTP",offer_evidence_age:report}),
    /Dated merchant evidence/);
});

test("fresh on the inclusive 30-day boundary, stale after; no HTTP probe can refresh source age", () => {
  const target = [{key:"demo:one",url:"https://merchant.test/product"}];
  const sources = [{key:"demo:one",group:"mobility",url:target[0].url,checkedAt:"2026-10-19"}];
  assert.equal(auditOfferObservationAge(target,sources,new Date("2026-11-18T00:00:00Z")).counts.fresh,1);
  assert.equal(auditOfferObservationAge(target,sources,new Date("2026-11-19T00:00:00Z")).counts.stale,1);
  assert.equal(auditOfferObservationAge(target,sources,new Date("2026-11-19T00:00:00Z")).counts.fresh,0);
});

test("unknown and future calendar dates do not become new evidence or public price claims", () => {
  const targets = [{key:"demo:one",url:"https://merchant.test/product"}];
  for(const bad of ["2026-02-30","2026-12-01",null,"unknown",""]){
    const report = auditOfferObservationAge(targets,[{key:"demo:one",group:"bed",url:targets[0].url,checkedAt:bad}],now);
    assert.equal(report.counts.unknown,1);
    assert.equal(report.results[0].source_checked_at,null);
    assert.equal(report.results[0].age_days,null);
  }
});

test("source mismatches, extra or missing keys, duplicate records and invalid audit dates fail closed", () => {
  assert.throws(()=>auditOfferObservationAge(targets,observations.slice(1),now),/count/);
  assert.throws(()=>auditOfferObservationAge(targets,[...observations,observations[0]],now),/Duplicate/);
  const changed = observations.map(x=>({...x}));
  changed[0].url="https://merchant.test/other";
  assert.throws(()=>auditOfferObservationAge(targets,changed,now),/mismatch/);
  assert.throws(()=>auditOfferObservationAge(targets,observations,new Date("invalid")),/Invalid audit date/);
});
