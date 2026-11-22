import test from "node:test";
import assert from "node:assert/strict";
import {
  loadRetiredArchiveSlugs,loadThemeTemplateSlugs,summarizeOrganicLandingRows
} from "../scripts/organic-landing-cohorts.mjs";
const retired=loadRetiredArchiveSlugs(),templates=loadThemeTemplateSlugs();
const row=(landing_page,sessions,engaged_sessions,channel="Organic Search")=>({
  landing_page,session_default_channel_group:channel,sessions,engaged_sessions
});

test("27-day consented GA4 organic cohorts preserve counts but separate engagement",()=>{
  const rows=[
    row("/5-beznych-problemu-s-cerpadly-a-jak-je-vyresit",9,1),
    row("/cerpadla-pro-ucinne-cerpani-vody-ze-jezer-a-rybniku",2,1),
    row("/senior-odmita-koupani",2,2),
    row("/prevoz-seniora-k-lekari",1,1),
    row("/vstavani-z-kresla-pro-seniora",1,1),
    row("/pomucky-do-koupelny-na-pojistovnu",1,0),
    row("/prahy-pro-choditko-a-vozik",1,1),
    row("(not set)",2,0),
    row("/",23,17,"AI Assistant")
  ];
  const out=summarizeOrganicLandingRows(rows,retired,templates);
  assert.equal(out.totalOrganicSessions,19);
  assert.equal(out.retired_archive,11);
  assert.equal(out.non_archive_path,6);
  assert.equal(out.unassigned,2);
  assert.equal(out.engagement.totalOrganicEngagedSessions,7);
  assert.equal(out.engagement.retired_archive,2);
  assert.equal(out.engagement.non_archive_path,5);
  assert.equal(out.engagement.theme_template_candidate,5);
  assert.equal(out.engagement.unassigned,0);
  assert.equal(out.engagement.other_non_archive_path,0);
  assert.doesNotMatch(JSON.stringify(out),/cerpadly|koupani|prevoz|answers=|user_id|IP address/);
  assert.match(out.warning,/není objednávka/);
});

test("older session-only exports remain supported; never infer engagement zero",()=>{
  const rows=[{landing_page:"/prevoz-seniora-k-lekari",
    session_default_channel_group:"Organic Search",sessions:2}];
  const out=summarizeOrganicLandingRows(rows,retired,templates);
  assert.equal(out.totalOrganicSessions,2);
  assert.equal(out.engagement,null);
});

test("mixed organic observation fails closed instead of inventing missing engaged sessions",()=>{
  assert.throws(()=>summarizeOrganicLandingRows([
    row("/prevoz-seniora-k-lekari",1,1),
    {landing_page:"(not set)",session_default_channel_group:"Organic Search",sessions:2}
  ],retired,templates),/Partial organic engagement/);
});

test("engaged sessions cannot be larger than sessions or negative/nonintegral",()=>{
  for(const invalid of [-1,1.4,3,Number.MAX_SAFE_INTEGER,"2"]){
    assert.throws(()=>summarizeOrganicLandingRows([row("/",2,invalid)],retired,templates),
      /Invalid aggregate row/);
  }
  assert.throws(()=>summarizeOrganicLandingRows([{
    ...row("/",2,1),client_id:"sensitive"
  }],retired,templates),/Invalid aggregate row/);
});

test("non-organic AI Assistant engaged sessions cannot inflate organic engagement",()=>{
  const report=summarizeOrganicLandingRows([
    row("/",30,29,"AI Assistant"),
    row("/prevoz-seniora-k-lekari",1,1),
    row("(not set)",2,0),
    row("/5-beznych-problemu-s-cerpadly-a-jak-je-vyresit",1,0)
  ],retired,templates);
  assert.equal(report.totalOrganicSessions,4);
  assert.equal(report.engagement.totalOrganicEngagedSessions,1);
});
