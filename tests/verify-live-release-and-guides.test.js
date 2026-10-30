import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {isExactAnchor,checkReadiness,assertGuidance,assertPrimaryGuidance,assertNoGuidance,liveSearchCases,assertLiveEditorialSeo,liveEditorialSeoCases} from "../scripts/verify-live-release-and-guides.mjs";
const ready={release:"0.8.182",integrity:"ok",configured_total:25,slot_total:25};
test("verify version, integrity and complete affiliate slots, distinguish pending deploy",()=>{
 assert.deepEqual(checkReadiness(ready,"0.8.182"),{expected:"0.8.182",deployed:"0.8.182",release_matches:true});
 assert.equal(checkReadiness(ready,"0.8.183").release_matches,false);
 assert.throws(()=>checkReadiness({...ready,integrity:"broken"}),"Reject partial production");
 assert.throws(()=>checkReadiness({...ready,configured_total:24}),"Reject incomplete affiliate slots");
});
test("exact IDs, not strings hidden in marketing copy",()=>{
 assert.ok(isExactAnchor('<section id="presun-z-postele-na-vozik">', "presun-z-postele-na-vozik"));
 assert.ok(isExactAnchor("<div class='hul-nebo-choditko' id='hul-nebo-choditko'>", "hul-nebo-choditko"));
 assert.ok(!isExactAnchor('<p>presun-z-postele-na-vozik</p>', "presun-z-postele-na-vozik"));
 assert.ok(!isExactAnchor('<section id="presun-z-postele-na-vozik-old">',"presun-z-postele-na-vozik"));
 assert.ok(!isExactAnchor('<section data-id="presun-z-postele-na-vozik">',"presun-z-postele-na-vozik"));
 assert.ok(!isExactAnchor('<!-- <section id="presun-z-postele-na-vozik"> -->',"presun-z-postele-na-vozik"));
 assert.ok(!isExactAnchor('<script>const html = \'<section id="presun-z-postele-na-vozik">\';</script>',"presun-z-postele-na-vozik"));
 assert.ok(!isExactAnchor('<template><section id="presun-z-postele-na-vozik"></section></template>',"presun-z-postele-na-vozik"));
 assert.ok(isExactAnchor('<!-- old <div id="presun-z-postele-na-vozik"> --><section class="guide" id="presun-z-postele-na-vozik">',"presun-z-postele-na-vozik"));
});
test("search intent detection checks actual guidance block and excludes unrelated topics",()=>{
 const positive='<section class="zp-search-guidance"><a href="https://zaprazi.cz/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba">Domácí péče</a></section>';
 assert.doesNotThrow(()=>assertGuidance(positive,"https://zaprazi.cz/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba"));
 assert.throws(()=>assertGuidance('<p>domaci-zdravotni-pece-nebo-pecovatelska-sluzba</p>',"https://zaprazi.cz/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba"));
 const target="https://zaprazi.cz/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba";
 assert.throws(()=>assertGuidance('<section class="zp-search-guidance"><p>Bez odkazu</p></section><a href="'+target+'">Mimo sekci</a>',target),/guide link/);
 assert.throws(()=>assertGuidance('<section class="zp-search-guidance"><p>'+target+'</p></section>',target),/guide link/);
 assert.throws(()=>assertGuidance('<section class="zp-search-guidance"><a href="'+target+'?s=senior">Návod</a></section>',target),/guide link/);
 assert.doesNotThrow(()=>assertNoGuidance('<main>Žádné výsledky pro fotovoltaika</main>'));
 assert.throws(()=>assertNoGuidance(positive));
});

test("live guidance CTA must lead to first safe guide without carrying search terms",()=>{
 const target="https://zaprazi.cz/senior-malo-pije/#varovne-priznaky-malo-pije";
 const section=href=>'<section class="zp-search-guidance"><p>Praktické návody</p><div class="zp-hero-actions"><a class="zp-btn" href="'+href+'">Otevřít první praktický návod</a></div><a href="'+target+'">Více</a></section>';
 assert.doesNotThrow(()=>assertPrimaryGuidance(section(target),target));
 assert.throws(()=>assertPrimaryGuidance(section("https://zaprazi.cz/sobestacnost/"),target),"Wrong primary CTA");
 assert.throws(()=>assertPrimaryGuidance(section(target+"?s=senior"),target),"No query leakage");
 assert.throws(()=>assertPrimaryGuidance('<section class="zp-search-guidance"><a href="'+target+'">Poznámka</a></section>',target),"Missing primary action");
});

test("production acceptance queries match real PHP safety-first search router",()=>{
  // Run the actual deterministic router (no WordPress, network or health data).
  // This catches stale hard-coded live expectations when a new safe guide
  // takes precedence over a generic page, without masking real live drift.
  const queries=liveSearchCases.map(({term})=>term);
  const encoded=Buffer.from(JSON.stringify(queries),"utf8").toString("base64");
  const php='require "src/seo/search-guidance.php"; '+
    '$terms=json_decode(base64_decode("'+encoded+'"),true); '+
    'echo json_encode(array_map(static fn($term) => zaprazi_2_search_guidance_for_query($term)[0][0] ?? null, $terms));';
  const stdout=execFileSync("php",["-r",php],{
    cwd:fileURLToPath(new URL("../",import.meta.url)),
    encoding:"utf8",timeout:10000
  });
  assert.deepEqual(JSON.parse(stdout),liveSearchCases.map(({target})=>target));
});


test("live SEO smoke requires unique intent-specific description and exact HTTPS canonical",()=>{
  const entry=liveEditorialSeoCases[0];
  const description="Jak zajistit zdravotnickou dopravu seniora k lékaři, kdy řešit doprovod a co předem ověřit s lékařem a poskytovatelem služby.";
  const head=(meta,canonical,robots="")=>"<html><head>"+meta+canonical+robots+"</head><body>Průvodce</body></html>";
  const meta='<meta content="'+description+'" name="description">';
  const canonical='<link href="https://zaprazi.cz'+entry.path+'" rel="canonical">';
  const valid=head(meta,canonical);
  assert.equal(assertLiveEditorialSeo(valid,entry).path,entry.path);
  assert.throws(()=>assertLiveEditorialSeo(head("",canonical),entry),/exactly one/);
  assert.throws(()=>assertLiveEditorialSeo(head(meta+meta,canonical),entry),/exactly one/);
  assert.throws(()=>assertLiveEditorialSeo(head('<meta name="description" content="Krátké">',canonical),entry),/implausible/);
  assert.throws(()=>assertLiveEditorialSeo(head(meta,canonical.replace("https:","http:")),entry),/Canonical/);
  assert.throws(()=>assertLiveEditorialSeo(head(meta,canonical,'<meta name="robots" content="noindex,follow">'),entry),/noindex/);
  assert.throws(()=>assertLiveEditorialSeo(head(meta,canonical,'<meta name="googlebot" content="nofollow noindex">'),entry),/noindex/);
  assert.throws(()=>assertLiveEditorialSeo(head(meta,canonical,'<meta name="robots" content="follow; none">'),entry),/noindex/);
  assert.throws(()=>assertLiveEditorialSeo(valid,entry,"googlebot: noindex, nofollow"),/noindex/);
  assert.throws(()=>assertLiveEditorialSeo(valid,entry,"none"),/noindex/);
  assert.doesNotThrow(()=>assertLiveEditorialSeo(valid,entry,"index, follow"));
  assert.throws(()=>assertLiveEditorialSeo(head(meta,canonical),liveEditorialSeoCases[1]),/Wrong intent|Canonical/);
  assert.equal(liveEditorialSeoCases.length,4);
});
