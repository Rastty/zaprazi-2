import test from "node:test";
import assert from "node:assert/strict";
import {
  loadRetiredArchiveSlugs, loadThemeTemplateSlugs, classifyLanding, summarizeOrganicLandingRows
} from "../scripts/organic-landing-cohorts.mjs";

const retired = loadRetiredArchiveSlugs();
const row = (landing_page, sessions, session_default_channel_group = "Organic Search") =>
  ({landing_page, sessions, session_default_channel_group});

test("historical archive snapshot has exactly 4,359 retired posts, excludes retained post", () => {
  assert.equal(retired.size, 4359);
  assert.equal(retired.has("5-beznych-problemu-s-cerpadly-a-jak-je-vyresit"), true);
  assert.equal(retired.has("stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu"), false);
});

test("cohorts distinguish retired archive, current candidate and missing landing", () => {
  const aggregate = summarizeOrganicLandingRows([
    row("/5-beznych-problemu-s-cerpadly-a-jak-je-vyresit", 11),
    row("/choditka-pro-seniory/", 4),
    row("(not set)", 2),
    row("/5-beznych-problemu-s-cerpadly-a-jak-je-vyresit", 9, "Direct")
  ], retired);
  assert.deepEqual(Object.keys(aggregate).slice(0, 6), [
    "totalOrganicSessions", "organicLandingRows", "retired_archive",
    "non_archive_path", "unassigned", "unclassifiable"
  ]);
  assert.equal(aggregate.totalOrganicSessions, 17);
  assert.equal(aggregate.retired_archive, 11);
  assert.equal(aggregate.non_archive_path, 4);
  assert.equal(aggregate.theme_template_candidate, 4);
  assert.equal(aggregate.other_non_archive_path, 0);
  assert.equal(aggregate.unassigned, 2);
  assert.equal(aggregate.retiredArchiveShare, 64.71);
  assert.doesNotMatch(JSON.stringify(aggregate), /cerpadly|choditka|Health/);
});

test("untrusted URL, queries, encoded path, fragments and whitespace are never treated as clean pages", () => {
  for (const path of ["https://zaprazi.cz/x/", "/?s=soukromy-dotaz", "/x/#a",
    "/x%2fy/", "/x//", "/x y/", "/../", "//external/"]) {
    assert.equal(classifyLanding(path, retired), "unclassifiable", path);
  }
  assert.equal(classifyLanding("/", retired), "non_archive_path");
  assert.equal(classifyLanding("/prevoz-seniora-k-lekari", retired), "non_archive_path");
});

test("fail closed for person-level fields, invalid counts, oversized inputs and no data", () => {
  assert.throws(() => summarizeOrganicLandingRows([{
    ...row("/", 1), client_id: "user-123"
  }], retired), /Invalid aggregate row/);
  assert.throws(() => summarizeOrganicLandingRows([row("/", 0.3)], retired), /Invalid aggregate row/);
  assert.throws(() => summarizeOrganicLandingRows([row("/", -1)], retired), /Invalid aggregate row/);
  assert.throws(() => summarizeOrganicLandingRows({rows: []}, retired), /Expected bounded/);
  assert.throws(() => summarizeOrganicLandingRows(Array.from({length:10001}, () => row("/", 1)), retired), /Expected bounded/);
  assert.throws(() => summarizeOrganicLandingRows([row("/", Number.MAX_SAFE_INTEGER), row("/", 1)], retired), /overflow/);
});

test("unknown landing and retained post do not automatically become archived", () => {
  const summary = summarizeOrganicLandingRows({data:[
    row("/stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu", 3),
    row("(not set)", 4),
    row("/nonexistent-new-url/", 5)
  ]}, retired);
  assert.equal(summary.retired_archive, 0);
  assert.equal(summary.non_archive_path, 8);
  assert.equal(summary.theme_template_candidate, 0);
  assert.equal(summary.other_non_archive_path, 8);
  assert.equal(summary.unassigned, 4);
});


test("theme-file hints are bounded and do not count unknown URLs as live decisions", () => {
  const templates = loadThemeTemplateSlugs();
  assert.ok(templates.has("choditka-pro-seniory"));
  assert.ok(templates.has("schody-pro-seniora-doma"));
  assert.ok(!templates.has("not-a-real-decision"));
  const result = summarizeOrganicLandingRows([
    row("/", 2), row("/choditka-pro-seniory/", 3),
    row("/schody-pro-seniora-doma/", 4),
    row("/not-a-real-decision/", 5), row("(not set)", 1)
  ], retired, templates);
  assert.equal(result.totalOrganicSessions, 15);
  assert.equal(result.non_archive_path, 14);
  assert.equal(result.theme_template_candidate, 9);
  assert.equal(result.other_non_archive_path, 5);
  assert.match(result.warning, /NE potvrzení existující živé decision page/);
  assert.doesNotMatch(JSON.stringify(result), /not-a-real-decision|choditka-pro|schody-pro/);
});
