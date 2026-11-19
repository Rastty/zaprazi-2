import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractCanonicalTargets, markdownSummary } from "../scripts/audit-canonical-merchant-targets.mjs";
import { curatedOfferObservations, auditOfferObservationAge, mobilityOfferRecheckQueue, markdownOfferAgeSummary } from "../scripts/lib/merchant-offer-age-audit.mjs";

const php = readFileSync(new URL("../functions.php", import.meta.url), "utf8");
const targets = extractCanonicalTargets(php);
const observations = curatedOfferObservations();
const now = new Date("2026-11-19T12:00:00Z");

test("all 25 PHP slots have exactly one matching, source-owned dated observation", () => {
  const report = auditOfferObservationAge(targets, observations, now);
  assert.equal(report.total, 25);
  assert.equal(report.counts.fresh + report.counts.stale + report.counts.unknown, 25);
  assert.deepEqual(new Set(report.results.map(x => x.group)),
    new Set(["mobility", "bathroom", "bed", "wheelchair", "adl", "footwear"]));
  assert.equal(new Set(report.results.map(x => x.key)).size, 25);
  assert.equal(report.counts.fresh, 2, "Two exact BESCO merchant listings were rechecked on November 19");
  assert.equal(report.counts.stale, 23, "MEYRA and the other 22 source observations remain aged");
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

test("P0 Slice 1 offers become a focused review queue without creating merchant or payout evidence", () => {
  const report = auditOfferObservationAge(targets, observations, now);
  const queue = mobilityOfferRecheckQueue(report);
  assert.deepEqual(queue.map(x => x.slot), ["lekarna-cz:meyra-ideal-3061982"]);
  assert.ok(queue.every(x => x.priority === "P0" && x.source_status === "stale" &&
    x.source_age_days === 44 && x.publisher_deeplink === "not_verified_by_source_age" &&
    x.approved_commission === "not_verified_by_source_age"));
  report.mobility_recheck_queue = queue;
  const summary = markdownOfferAgeSummary(report);
  assert.match(summary, /P0 Slice 1/);
  assert.match(summary, /independent/);
  assert.doesNotMatch(JSON.stringify(queue) + summary, /https?:\/\/|utm_|subid=|clickid=/i);
});

test("P0 queue closes only when a source observation is fresh; other groups remain untouched", () => {
  const fresh = observations.map(x => ({ ...x, checkedAt: x.group === "mobility" ? "2026-11-18" : x.checkedAt }));
  assert.deepEqual(mobilityOfferRecheckQueue(auditOfferObservationAge(targets, fresh, now)), []);
  const mixed = observations.map(x => ({ ...x, checkedAt: x.key.endsWith("besco-wa17") ? "2026-11-18" : x.checkedAt }));
  assert.equal(mobilityOfferRecheckQueue(auditOfferObservationAge(targets, mixed, now)).length, 1);
  const report = auditOfferObservationAge(targets, observations, now);
  assert.throws(() => mobilityOfferRecheckQueue({...report,results: report.results.slice(1)}), /Missing exact/);
  assert.throws(() => mobilityOfferRecheckQueue({...report,results: [...report.results,report.results[0]]}), /Duplicate/);
  assert.throws(() => mobilityOfferRecheckQueue({...report,results: report.results.map(x =>
    x.key.endsWith("besco-wa17") ? {...x,group:"bed"} : x)}), /Missing exact/);
});
