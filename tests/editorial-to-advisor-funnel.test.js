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

test("guide tracking covers only the four deliberate Mobility hub actions and primary actions elsewhere",()=>{
  for(const [file,destination] of routes){
    const source=read(file);
    const anchors=[...source.matchAll(/<a\b[^>]*data-zp-journey="advisor"[^>]*>/g)].map(m=>m[0]);
    const hub=file==="page-choditka-pro-seniory.php";
    assert.equal(anchors.length,hub?4:1,"Unexpected tracked Advisor links in "+file);
    if(hub){
      const primary=anchors.filter(a=>/class="zp-btn"/.test(a));
      const specialist=anchors.filter(a=>/class="zp-text-link"/.test(a));
      assert.equal(primary.length,2,"Preserve two explicit main Advisor CTAs");
      assert.equal(specialist.length,2,"Track exactly two specialist Advisor entry points");
      for(const a of primary)
        assert.ok(a.includes("home_url( '/#poradce' )"));
      const targets=[
        "home_url( '/choditko-do-bytu-pro-seniory/#poradce-choditko-byt' )",
        "home_url( '/rollator-pro-seniory/#poradce-rollator' )"
      ];
      for(let i=0;i<specialist.length;i++)
        assert.ok(specialist[i].includes(targets[i]),"Wrong specialist target");
      for(const a of specialist)
        assert.ok(source.indexOf(a)<source.indexOf('id="vyber-typu"'),
          "Specialist entry must be available before detailed comparison");
    }else{
      const localDestination=destination.startsWith("#")
        ? 'href="'+destination+'"'
        : destination.includes("polohovaci-postel")
          ? "home_url( '/polohovaci-postel/#poradce-postel' )"
          : "home_url( '/#poradce' )";
      assert.match(anchors[0],/class="zp-btn"/,"Only deliberate main Advisor CTA");
      assert.ok(anchors[0].includes(localDestination),"Wrong tracked route in "+file);
    }
    for(const anchor of anchors)
      assert.doesNotMatch(anchor,
        /rel="sponsored"|target="_blank"|data-zp-merchant-link|[?&](?:answer|diagnosis|health)=/i);
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
