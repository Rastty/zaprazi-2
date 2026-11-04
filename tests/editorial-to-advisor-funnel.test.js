import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildGa4ReadOnlyQueries} from "../scripts/ga4-bigquery-readonly.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

const routes=[
  ["page-choditka-pro-seniory.php","/#poradce"],
  ["page-polohovaci-postel-na-pojistovnu.php","/polohovaci-postel/#poradce-postel"],
  ["page-polohovaci-postel.php","#poradce-postel"],
  ["page-invalidni-vozik.php","#poradce-vozik"],
  ["page-koupelna-a-wc.php","#poradce-koupelna"],
  ["page-rollator-pro-seniory.php","#poradce-rollator"]
];

test("six high-intent guides only mark safe primary Advisor CTAs; Mobility hub has two deliberate entry points",()=>{
  for(const [file,destination] of routes){
    const source=read(file);
    const anchors=[...source.matchAll(/<a\b[^>]*data-zp-journey="advisor"[^>]*>/g)].map(m=>m[0]);
    const expectedCount=file==="page-choditka-pro-seniory.php"?2:1;
    assert.equal(anchors.length,expectedCount,"Only deliberate primary Advisor links may be tracked in "+file);
    const localDestination=destination.startsWith("#")
      ? 'href="'+destination+'"'
      : destination.includes("polohovaci-postel")
        ? "home_url( '/polohovaci-postel/#poradce-postel' )"
        : "home_url( '/#poradce' )";
    for(const anchor of anchors){
      assert.match(anchor,/class="zp-btn"/,"Do not track secondary or incidental links");
      assert.ok(anchor.includes(localDestination),"Wrong tracked route in "+file);
      assert.doesNotMatch(anchor,/rel="sponsored"|target="_blank"|data-zp-merchant-link/);
    }
    if(expectedCount===2){
      assert.ok(source.indexOf(anchors[0])<source.indexOf('id="vyber-typu"'),
        "First CTA must be reachable before the hub comparison");
      assert.ok(source.lastIndexOf(anchors[1])<source.indexOf('id="vyber-typu"'),
        "Second CTA must remain before the hub comparison");
    }
  }
});

test("consented handoff remains a single parameterless GA4 event and cannot log answers or URLs",()=>{
  const adapter=read("assets/js/analytics-consent.js");
  assert.ok(adapter.includes('"guide_advisor_click"'));
  assert.match(adapter,/a\[data-zp-journey="advisor"\]\[href\]/);
  assert.match(adapter,/destination\.origin !== window\.location\.origin/);
  assert.match(adapter,/destination\.search/);
  assert.match(adapter,/!\/\^#poradce/);
  assert.match(adapter,/link\.closest\("\.zp-result"\)/);
  assert.match(adapter,/sendEvent\("guide_advisor_click"\)/);
  const eventArgs=adapter.match(/window\.gtag\("event",\s*eventName\)/g)||[];
  assert.equal(eventArgs.length,1,"No parameters in analytics event transport");
  assert.match(adapter,/state !== "granted"/,"Explicit opt-in only");
  assert.doesNotMatch(adapter,/guide_advisor_click\s*,\s*\{/,"Do not attach event parameters");
});

test("aggregate BigQuery query can distinguish guide CTA interest from actual Advisor start/completion",()=>{
  const q=buildGa4ReadOnlyQueries({project:"prometheus-503317",propertyId:"123456789",start:"20261001",end:"20261028"});
  const serialized=JSON.stringify(q);
  assert.match(serialized,/guide_advisor_click/);
  assert.match(serialized,/builder_start/);
  assert.match(serialized,/builder_complete/);
  assert.match(serialized,/analytics_storage = 'Yes'/);
  assert.match(serialized,/zaprazi/);
  assert.doesNotMatch(serialized,/SELECT.*(?:user_pseudo_id|user_id|full_url|response_value)/i);
});
