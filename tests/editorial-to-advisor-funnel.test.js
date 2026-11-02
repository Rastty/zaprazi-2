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

test("six relevant existing high-intent guides have one explicit safe CTA marker to a real Advisor",()=>{
  for(const [file,destination] of routes){
    const source=read(file);
    const anchors=[...source.matchAll(/<a\b[^>]*data-zp-journey="advisor"[^>]*>/g)].map(m=>m[0]);
    assert.equal(anchors.length,1,"Exactly one marked primary CTA in "+file);
    assert.match(anchors[0],/class="zp-btn"/,"Do not track secondary or incidental links");
    const localDestination=destination.startsWith("#")
      ? 'href="'+destination+'"'
      : destination.includes("polohovaci-postel")
        ? "home_url( '/polohovaci-postel/#poradce-postel' )"
        : "home_url( '/#poradce' )";
    assert.ok(anchors[0].includes(localDestination),"Wrong tracked route in "+file);
    assert.doesNotMatch(anchors[0],/rel="sponsored"|target="_blank"|data-zp-merchant-link/);
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
