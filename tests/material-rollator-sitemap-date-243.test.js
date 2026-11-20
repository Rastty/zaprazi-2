import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  SOURCE_DATES,PREDEPLOY_242_MATERIAL_DATES,
  assertMaterialLastmod,selectLiveSitemapScope
} from "../scripts/audit-205-postdeploy-seo.mjs";

const path="/rollator-pro-seniory/";
const edits=JSON.parse(readFileSync(new URL("../config/gsc-material-edits.json",import.meta.url),"utf8"));
const xmlFor=dates=>"<urlset>"+Object.entries(dates).map(([slug,date])=>
  "<url><loc>https://zaprazi.cz"+slug+"</loc><lastmod>"+date+
  "T00:00:00+00:00</lastmod></url>").join("")+"</urlset>";

test("20 November rollator date is tied to merged substantive editorial evidence",()=>{
  assert.equal(SOURCE_DATES[path],"2026-11-20");
  assert.equal(PREDEPLOY_242_MATERIAL_DATES[path],"2026-11-10");
  assert.deepEqual(Object.keys(SOURCE_DATES),Object.keys(PREDEPLOY_242_MATERIAL_DATES));
  assert.deepEqual(edits.changes.filter(change=>change.path===path),[{
    path,mergedDate:"2026-11-20",
    pullRequest:"https://github.com/Rastty/zaprazi-2/pull/878"
  }]);
});

test("old live sitemap is valid only as a predeploy predecessor",()=>{
  const old=xmlFor(PREDEPLOY_242_MATERIAL_DATES);
  const updated=xmlFor(SOURCE_DATES);
  assert.equal(assertMaterialLastmod(old,"2026-11-20",PREDEPLOY_242_MATERIAL_DATES).lastmodsVerified,12);
  assert.throws(()=>assertMaterialLastmod(old,"2026-11-20",SOURCE_DATES),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
  assert.equal(assertMaterialLastmod(updated,"2026-11-20",SOURCE_DATES).lastmodsVerified,12);
  assert.throws(()=>assertMaterialLastmod(updated,"2026-11-19",SOURCE_DATES),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
});

test("0.8.243 accepts exactly 0.8.242 in PR before deploy, never as production",()=>{
  const pre=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.243",
    liveRelease:"0.8.242",integrity:"ok"});
  assert.equal(pre.mode,"predeploy_verified_242_dates_only");
  assert.deepEqual(pre.dates,PREDEPLOY_242_MATERIAL_DATES);
  assert.throws(()=>selectLiveSitemapScope({event:"push",sourceRelease:"0.8.243",
    liveRelease:"0.8.242",integrity:"ok"}),/SITEMAP_LIVE_RELEASE_MISMATCH/);
  assert.throws(()=>selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.243",
    liveRelease:"0.8.241",integrity:"ok"}),/SITEMAP_LIVE_RELEASE_MISMATCH/);
  assert.deepEqual(selectLiveSitemapScope({event:"push",sourceRelease:"0.8.243",
    liveRelease:"0.8.243",integrity:"ok"}),
    {dates:SOURCE_DATES,mode:"postdeploy_exact_release"});
});
