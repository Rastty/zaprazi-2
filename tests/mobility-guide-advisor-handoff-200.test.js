import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../",import.meta.url);
const source=path=>readFileSync(new URL(path,root),"utf8");

function anchorContaining(file,label){
 const lines=source(file).split("\n");
 const matches=lines.filter(x=>x.includes("<a ")&&x.includes(label));
 assert.equal(matches.length,1,"Exactly one visible CTA expected: "+label);
 return matches[0];
}
function assertSafeTrackedAnchor(line,fragment){
 assert.match(line,/<a\b[^>]*\bdata-zp-journey="advisor"/);
 assert.ok(line.includes(fragment),"Expected exact local Advisor path/anchor");
 assert.doesNotMatch(line,/\?|\bdata-zp-merchant-link\b|\brel="[^"]*sponsored/);
}

test("high intent indoor-walker hero announces its purpose and measures a consent-only Advisor handoff",()=>{
 const line=anchorContaining("page-choditko-do-bytu-pro-seniory.php",
   "Ověřit vhodný typ v poradci");
 assertSafeTrackedAnchor(line,'href="#poradce-choditko-byt"');
 assert.match(source("page-choditko-do-bytu-pro-seniory.php"),
   /<section id="poradce-choditko-byt"/);
});

test("walkers hub links to both distinct, real specialized Advisors, never directly to merchant",()=>{
 const file="page-choditka-pro-seniory.php";
 const indoor=anchorContaining(file,"Hlavně doma: poradce pro chodítko");
 const outdoor=anchorContaining(file,"Venku: poradce pro rollátor a brzdy");
 assertSafeTrackedAnchor(indoor,
   "home_url( '/choditko-do-bytu-pro-seniory/#poradce-choditko-byt' )");
 assertSafeTrackedAnchor(outdoor,
   "home_url( '/rollator-pro-seniory/#poradce-rollator' )");
 assert.match(source("page-choditko-do-bytu-pro-seniory.php"),
   /<section id="poradce-choditko-byt"/);
 assert.match(source("page-rollator-pro-seniory.php"),
   /<section id="poradce-rollator"/);
});

test("ePoukaz first answer records Advisor interest but keeps safe reimbursement content",()=>{
 const file="page-choditko-na-pojistovnu.php",markup=source(file);
 const line=anchorContaining(file,"Začít orientačním poradcem");
 assertSafeTrackedAnchor(line,"home_url( '/#poradce' )");
 assert.match(markup,/id="rychla-cesta-na-epoukaz"/);
 assert.match(markup,/Neplaťte předem v očekávání zpětného proplacení/);
 assert.match(markup,/www\.vzp\.cz\/o-nas\/tiskove-centrum\/otazky-tydne\/proplaceni-choditka/);
});

test("analytics accepts only explicitly marked local Advisor links and only after opt-in",()=>{
 const js=source("assets/js/analytics-consent.js");
 assert.match(js,/const oncePerPage = new Set\(\[[^\]]*"guide_advisor_click"/);
 assert.match(js,/state !== "granted"/);
 assert.match(js,/a\[data-zp-journey=\\"advisor\\"\]\[href\]/);
 assert.match(js,/destination\.origin !== window\.location\.origin/);
 assert.match(js,/destination\.search/);
 assert.match(js,/sendEvent\("guide_advisor_click"\)/);
 // No answer, profile, landing-page or link-url payload is passed to GA4.
 assert.match(js,/window\.gtag\("event", eventName\)/);
 assert.doesNotMatch(js,/window\.gtag\("event", eventName,\s*\{/);
 assert.match(source("scripts/ga4-bigquery-readonly.mjs"),
   /"guide_advisor_click"/);
});
