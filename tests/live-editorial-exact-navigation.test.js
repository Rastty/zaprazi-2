import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isSafeMainFrameNavigation} from "../scripts/lib/internal-link-health.mjs";

test("editorial Chrome audit allows only the exact curated HTTPS main-frame document",()=>{
  for(const path of ["/","/choditka-pro-seniory/","/navrat-z-nemocnice/"]){
    const url="https://zaprazi.cz"+path;
    assert.equal(isSafeMainFrameNavigation(url,path),true);
    for(const unsafe of [
      "http://zaprazi.cz"+path,
      "https://www.zaprazi.cz"+path,
      "https://other.example"+path,
      url+"?answer=PRIVATE_ADVISOR_INPUT",
      url+"#private-answer",
      "https://zaprazi.cz/go/merchant/",
      "https://zaprazi.cz/wp-json/",
      "https://zaprazi.cz/other-page/"
    ]){
      assert.equal(isSafeMainFrameNavigation(unsafe,path),false);
    }
  }
});

test("live editorial runner blocks unexpected top-frame redirects before DOM inspection",()=>{
  const source=readFileSync(new URL("../scripts/audit-live-editorial-seo.mjs",import.meta.url),"utf8");
  assert.match(source,/await page\.setRequestInterception\(true\)/);
  assert.match(source,/page\.on\("request",request=>/);
  assert.match(source,/isSafeMainFrameNavigation\(request\.url\(\),path\)/);
  assert.match(source,/await lockEditorialMainFrame\(page,path\);\s*const response=await page\.goto\(base\+path/);
  assert.match(source,/response\?\.status\(\)!==200 \|\| page\.url\(\)!==base\+path/);
  assert.match(source,/navigation_or_render_failure/);
  assert.doesNotMatch(source,/PAGE_AUDIT_FAILURE",path,String\(error\)/);
});
