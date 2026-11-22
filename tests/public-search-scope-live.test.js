import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {requiresPublishedPageScope,assertPublishedPageResults}
  from "../scripts/lib/public-search-scope.mjs";

test("search page-only assertion starts at deployed 0.8.247, not predeploy 0.8.246",()=>{
  assert.equal(requiresPublishedPageScope("0.8.246"),false);
  assert.equal(requiresPublishedPageScope("0.8.247"),true);
  assert.equal(requiresPublishedPageScope("0.8.248"),true);
  assert.equal(requiresPublishedPageScope("0.9.0"),true);
  assert.equal(requiresPublishedPageScope("1.0.0"),true);
  assert.throws(()=>requiresPublishedPageScope("0.8.247-not-deployed"),/Invalid live release/);
  assert.throws(()=>requiresPublishedPageScope(""),/Invalid live release/);
});

test("published WordPress Pages pass and empty off-topic searches are permitted",()=>{
  assert.equal(assertPublishedPageResults([]),0);
  assert.equal(assertPublishedPageResults([
    "post-42 page type-page status-publish hentry zp-archive-card",
    "zp-archive-card post-44 type-page status-publish"
  ]),2);
});

test("retired posts, unapproved pages, spoofed classes fail closed",()=>{
  for(const item of [
    "post-4 post type-post status-publish zp-archive-card",
    "post-5 page type-page status-draft zp-archive-card",
    "post-6 page type-page status-private zp-archive-card",
    "post-7 page type-pageish status-publish zp-archive-card",
    "post-8 page type-page status-published zp-archive-card",
    "post-9 page type-page status-publish type-post zp-archive-card",
    "",
    null
  ]) assert.throws(()=>assertPublishedPageResults([item]));
  assert.throws(()=>assertPublishedPageResults("type-page"));
  assert.throws(()=>assertPublishedPageResults(Array(201).fill("type-page status-publish")));
});

test("live browser QA samples real rendered cards without logging user queries",()=>{
  const src=readFileSync(new URL("../scripts/audit-live-search-guidance.mjs",import.meta.url),"utf8");
  assert.match(src,/article\\.zp-archive-card/);
  assert.match(src,/requiresPublishedPageScope\\(data\\.release\\)/);
  assert.match(src,/assertPublishedPageResults\\(data\\.resultClasses\\)/);
  assert.match(src,/await page\\.setJavaScriptEnabled\\(false\\)/);
  assert.match(src,/req\\.method\\(\\)==="GET"/);
});
