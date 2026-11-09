import test from "node:test";
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE} from "../scripts/lib/live-release.mjs";
import {RELEASE_CHECK_PATHS} from "../scripts/audit-live-release-coherence.mjs";
import {inspectPendingReadiness,observePublicDeploy,verifyInsuranceFirstAnswer,verifyInsuranceSearchHero,verifyMobilityGuideHandoffs,decideDispatch,
  dispatchWhenReady} from "../scripts/auto-postdeploy-qa.mjs";

const origin="https://zaprazi.cz";
const readinessUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const sha="a".repeat(40),token="test-mocked-placeholder-not-real";
const readiness=(release=SOURCE_THEME_RELEASE)=>({
  release,integrity:"ok",slot_total:25,configured_total:25,
  groups:{mobility:{total:3,configured:3,missing:[]},bathroom:{total:22,configured:22,missing:[]}}
});
const html=(release=SOURCE_THEME_RELEASE,integrity="ok")=>
  '<!doctype html><head><meta name="zaprazi-release" content="'+release+
  '"><meta name="zaprazi-integrity" content="'+integrity+'"></head>';
const insurancePage=(release="0.8.199")=>html(release)+
  '<section class="zp-section" id="rychla-cesta-na-epoukaz">'+
    '<h2>Jak získat chodítko na pojišťovnu?</h2>'+
    '<ol><li>Ověřte bezpečný typ pomůcky</li>'+
      '<li>Zeptejte se předepisujícího lékaře na možnost ePoukazu</li>'+
      '<li>U oprávněného výdejce ověřte přesný model</li></ol>'+
    '<p>Neplaťte předem v očekávání zpětného proplacení.</p>'+
    '<a href="https://zaprazi.cz/#poradce">Otevřít poradce</a>'+
    '<a href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka">VZP</a>'+
  '</section>';
const historicalRun=(status="completed",conclusion="success",head_sha=sha)=>({
  event:"workflow_dispatch",head_branch:"main",head_sha,status,conclusion
});

test("old 0.8.198 live is a pending deploy, never an accepted 0.8.199",async()=>{
  const observed=[];
  const fetchMock=async(url,options)=>{
    observed.push({url,options});
    return {status:200,url,json:async()=>readiness("0.8.198")};
  };
  const state=await observePublicDeploy(fetchMock,"0.8.199");
  assert.deepEqual(state,{status:"pending_wp_pull_and_deploy",
    source_release:"0.8.199",live_release:"0.8.198"});
  assert.equal(observed.length,1,"Do not probe all pages or request QA before deploy");
  assert.equal(observed[0].url,readinessUrl);
  assert.equal(observed[0].options.method,"GET");
  assert.equal(observed[0].options.redirect,"error");
  assert.equal(await dispatchWhenReady(state,{}),"no_dispatch_unverified_public_release");
});

test("0.8.199 must serve five coherent pages including its real ePoukaz answer before QA",async()=>{
  const called=[];
  const fetchMock=async(url,options)=>{
    called.push({url,options});
    return {status:200,url,
      json:async()=>readiness("0.8.199"),
      text:async()=>url===origin+"/choditko-na-pojistovnu/"?insurancePage():html("0.8.199")};
  };
  const state=await observePublicDeploy(fetchMock,"0.8.199");
  assert.deepEqual(state,{status:"ready_for_full_qa",source_release:"0.8.199",
    live_release:"0.8.199",pages:5,insurance_first_answer:"verified",
    affiliate_slots:25,readiness_checks:2});
  assert.deepEqual(called.map(c=>c.url),[
    readinessUrl,...RELEASE_CHECK_PATHS.map(p=>origin+p),
    origin+"/choditko-na-pojistovnu/",readinessUrl
  ]);
  assert.ok(called.every(c=>c.options.method==="GET"&&c.options.redirect==="error"));
  assert.ok(called.every(c=>!c.url.includes("?")));
  assert.ok(called.every(c=>c.url.startsWith(origin)));
});


test("0.8.199 feature gate blocks missing, stale or unsafe ePoukaz content",async()=>{
  assert.equal(verifyInsuranceFirstAnswer(insurancePage(),"0.8.199"),true);
  for(const bad of [
    html("0.8.199"),
    insurancePage("0.8.198"),
    insurancePage().replace("U oprávněného výdejce ověřte přesný model",""),
    insurancePage().replace("Neplaťte předem v očekávání zpětného proplacení.",""),
    insurancePage().replace("https://zaprazi.cz/#poradce","https://example.org/"),
    insurancePage().replace("https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka",
      "https://merchant.example/"),
    insurancePage().replace("</ol>","<li>Kupte bez posouzení</li></ol>"),
    insurancePage().replace("</section>","<form><input name='health'></form></section>"),
    insurancePage()+insurancePage()
  ]) assert.throws(()=>verifyInsuranceFirstAnswer(bad,"0.8.199"));
  assert.throws(()=>verifyInsuranceFirstAnswer(insurancePage(),"0.8.200"));

  // Matching metadata on the generic four pages MUST NOT hide stale/missing
  // content on the most important changed URL in this release.
  for(const feature of [html("0.8.199"),insurancePage("0.8.198"),
    insurancePage().replace("Neplaťte předem v očekávání zpětného proplacení.","")]){
    const requested=[];
    const result=await observePublicDeploy(async url=>{
      requested.push(url);
      return {status:200,url,json:async()=>readiness("0.8.199"),
        text:async()=>url===origin+"/choditko-na-pojistovnu/"?feature:html("0.8.199")};
    },"0.8.199");
    assert.equal(result.status,"blocked_mixed_or_incomplete_live_release");
    assert.ok(requested.includes(origin+"/choditko-na-pojistovnu/"));
    assert.equal(await dispatchWhenReady(result,{}),"no_dispatch_unverified_public_release");
    assert.ok(!JSON.stringify(result).includes("health"));
  }
});

test("partial, misconfigured, duplicate or mixed release never unlocks a QA request",async()=>{
  for(const data of [
    {...readiness("0.8.199"),integrity:"partial"},
    {...readiness("0.8.199"),configured_total:24},
    {...readiness("0.8.199"),groups:{mobility:{total:3,configured:2,missing:["one"]}}},
    {...readiness("0.8.199"),release:"evil-token-or-health-payload"},
    null
  ]) {
    const safe=inspectPendingReadiness(data,"0.8.199");
    assert.ok(safe.status.startsWith("blocked"));
    assert.ok(!JSON.stringify(safe).includes("evil-token"));
  }
  let count=0;
  const mixed=await observePublicDeploy(async url=>{
    count++;
    return {status:200,url,
      json:async()=>readiness("0.8.199"),
      text:async()=>html(count===3?"0.8.198":"0.8.199")};
  },"0.8.199");
  assert.equal(mixed.status,"blocked_mixed_or_incomplete_live_release");
  assert.equal(await dispatchWhenReady(mixed,{}),"no_dispatch_unverified_public_release");

  let second=0;
  const changing=await observePublicDeploy(async url=>({
    status:200,url,
    json:async()=>readiness(++second===1?"0.8.199":"0.8.198"),
    text:async()=>html("0.8.199")
  }),"0.8.199");
  assert.equal(changing.status,"blocked_mixed_or_incomplete_live_release");
});

test("public probes reject redirects and HTTP errors instead of trusting HTML",async()=>{
  for(const response of [{status:302},{status:500},
    {status:200,url:"https://untrusted.example/redirect",json:async()=>readiness()}]) {
    await assert.rejects(()=>observePublicDeploy(async()=>response,"0.8.199"));
  }
});

test("dispatch dedupe refuses success, active runs or more than two failed attempts",()=>{
  assert.equal(decideDispatch([],sha),"dispatch_once");
  assert.equal(decideDispatch([historicalRun()],sha),"already_verified_for_this_commit");
  for(const status of ["queued","in_progress","waiting","requested","pending"]){
    assert.equal(decideDispatch([historicalRun(status,null)],sha),
      "already_running_for_this_commit");
  }
  assert.equal(decideDispatch([historicalRun("completed","failure")],sha),"dispatch_once");
  assert.equal(decideDispatch([historicalRun("completed","failure"),
    historicalRun("completed","failure")],sha),"manual_review_required_retry_cap");
  const different=historicalRun("completed","success","b".repeat(40));
  assert.equal(decideDispatch([different],sha),"dispatch_once");
  assert.throws(()=>decideDispatch([],"not-sha"));
});

test("dispatch checks current main SHA and prior workflow_dispatch runs; never writes WordPress",async()=>{
  const urls=[],body=[];
  const api="https://api.github.com/repos/Rastty/zaprazi-2";
  const githubFetch=async(url,opts)=>{
    urls.push(url);
    assert.ok(url.startsWith(api+"/"));
    assert.ok(opts.headers.Authorization.startsWith("Bearer "));
    if(opts.method==="POST")body.push(JSON.parse(opts.body));
    if(url.endsWith("/git/ref/heads/main"))return {
      status:200,json:async()=>({object:{sha}})};
    if(url.includes("/runs?"))return {
      status:200,json:async()=>({workflow_runs:[]})};
    return {status:204};
  };
  const input={status:"ready_for_full_qa"};
  const options={repo:"Rastty/zaprazi-2",ref:"refs/heads/main",sha,token};
  assert.equal(await dispatchWhenReady(input,options,githubFetch),
    "full_production_qa_requested");
  assert.deepEqual(body,[{ref:"main"}]);
  assert.equal(urls.length,3);
  assert.equal(urls[2],api+"/actions/workflows/production-advisor-qa.yml/dispatches");

  const stale=await dispatchWhenReady(input,options,async(url)=>({
    status:200,json:async()=>({object:{sha:"b".repeat(40)}})
  }));
  assert.equal(stale,"source_ref_changed_no_dispatch");
  await assert.rejects(()=>dispatchWhenReady(input,{...options,ref:"refs/heads/dev"},
    githubFetch),/Invalid GitHub Actions/);
  await assert.rejects(()=>dispatchWhenReady(input,{...options,sha:"not valid"},
    githubFetch),/Invalid GitHub Actions/);
});

test("a prior success never repeats automated QA, even if the public release is ready",async()=>{
  const requests=[],input={status:"ready_for_full_qa"};
  const result=await dispatchWhenReady(input,{
    repo:"Rastty/zaprazi-2",ref:"refs/heads/main",sha,token
  },async(url,opts)=>{
    requests.push(opts.method);
    if(url.endsWith("/git/ref/heads/main"))
      return {status:200,json:async()=>({object:{sha}})};
    return {status:200,json:async()=>({workflow_runs:[historicalRun()]})};
  });
  assert.equal(result,"already_verified_for_this_commit");
  assert.deepEqual(requests,["GET","GET"]);
});

const walkerHubPage=(release="0.8.200")=>html(release)+
 '<section><a data-zp-journey="advisor" href="https://zaprazi.cz/choditko-do-bytu-pro-seniory/#poradce-choditko-byt">Doma</a>'+
 '<a data-zp-journey="advisor" href="https://zaprazi.cz/rollator-pro-seniory/#poradce-rollator">Venku</a></section>';
const indoorPage=(release="0.8.200")=>html(release)+
 '<section id="poradce-choditko-byt"><a data-zp-journey="advisor" href="#poradce-choditko-byt">Ověřit vhodný typ</a></section>';
const insuranceTracked=(release="0.8.200")=>
  insurancePage(release).replace('href="https://zaprazi.cz/#poradce"',
    'data-zp-journey="advisor" href="https://zaprazi.cz/#poradce"');

test("0.8.200 release gate reads all seven pages and verifies the real high-intent handoffs",async()=>{
 const requested=[];
 const get=async(url,options)=>{
  requested.push({url,options});
  return {status:200,url,json:async()=>readiness("0.8.200"),text:async()=>(
    url===origin+"/choditka-pro-seniory/"?walkerHubPage():
    url===origin+"/choditko-do-bytu-pro-seniory/"?indoorPage():
    url===origin+"/choditko-na-pojistovnu/"?insuranceTracked():
    html("0.8.200"))};
 };
 const state=await observePublicDeploy(get,"0.8.200");
 assert.deepEqual(state,{status:"ready_for_full_qa",source_release:"0.8.200",
   live_release:"0.8.200",pages:7,insurance_first_answer:"verified",
   mobility_guide_handoffs:"verified",affiliate_slots:25,readiness_checks:2});
 assert.deepEqual(requested.map(x=>x.url),[
   readinessUrl,...RELEASE_CHECK_PATHS.map(path=>origin+path),
   origin+"/choditko-na-pojistovnu/",origin+"/choditka-pro-seniory/",
   origin+"/choditko-do-bytu-pro-seniory/",readinessUrl
 ]);
 assert.ok(requested.every(x=>x.options.method==="GET"&&x.options.redirect==="error"));
 assert.ok(requested.every(x=>!x.url.includes("?")));
});

test("no missing, stale or counterfeit Advisor link can unlock 0.8.200 acceptance",async()=>{
 const good={hub:walkerHubPage(),indoor:indoorPage(),insurance:insuranceTracked()};
 assert.equal(verifyMobilityGuideHandoffs(good,"0.8.200"),true);
 const bad=[
   {...good,hub:walkerHubPage().replace('data-zp-journey="advisor" href="https://zaprazi.cz/rollator','href="https://zaprazi.cz/rollator')},
   {...good,hub:walkerHubPage().replace('/#poradce-choditko-byt','/?source=sensitive#poradce-choditko-byt')},
   {...good,indoor:indoorPage().replace('data-zp-journey="advisor"','data-not-measured="1"')},
   {...good,indoor:indoorPage("0.8.199")},
   {...good,insurance:insurancePage("0.8.200")},
   {...good,insurance:insuranceTracked().replace('id="rychla-cesta-na-epoukaz"','id="old-insurance-answer"')}
 ];
 for(const sample of bad)assert.throws(()=>verifyMobilityGuideHandoffs(sample,"0.8.200"));
 assert.throws(()=>verifyMobilityGuideHandoffs(good,"0.8.199"));
 const fetchMock=async url=>({status:200,url,json:async()=>readiness("0.8.200"),
   text:async()=>(
    url===origin+"/choditka-pro-seniory/"?bad[0].hub:
    url===origin+"/choditko-do-bytu-pro-seniory/"?indoorPage():
    url===origin+"/choditko-na-pojistovnu/"?insuranceTracked():html("0.8.200"))});
 const blocked=await observePublicDeploy(fetchMock,"0.8.200");
 assert.equal(blocked.status,"blocked_mixed_or_incomplete_live_release");
 assert.equal(await dispatchWhenReady(blocked,{}),"no_dispatch_unverified_public_release");
});

const insuranceSearchPage=(release="0.8.210")=>
  insuranceTracked(release)+
  '<section class="zp-hero"><p><strong>Rychlá odpověď:</strong> Některá chodítka mohou být hrazena '+
  'při splnění podmínek. Nestačí koupit chodítko v e-shopu a poslat účtenku pojišťovně.</p>'+
  '<a href="#rychla-cesta-na-epoukaz">Tři kroky</a>'+
  '<a href="#zp-overit-mesicni-seznam">Platná úhrada</a></section>'+
  '<section id="zp-overit-mesicni-seznam"></section>'+
  '<p><a href="https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/">SÚKL 1</a>'+
  '<a href="https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/">SÚKL 2</a></p>';

test("0.8.210 exact live hero must answer the insurance query with safe next steps",async()=>{
  const good=insuranceSearchPage();
  assert.equal(verifyInsuranceSearchHero(good,"0.8.210"),true);
  for(const bad of [
    insuranceSearchPage("0.8.209"),
    insuranceTracked("0.8.210"),
    good.replace("Rychlá odpověď:", "Co je nového?"),
    good.replace("Nestačí koupit chodítko v e-shopu a poslat účtenku pojišťovně.",""),
    good.replace('href="#rychla-cesta-na-epoukaz"','href="https://untrusted.example/"'),
    good.replace('id="zp-overit-mesicni-seznam"','id="missing-sukl-section"'),
    good.replace("pro-predepisovani-", "pro-predpisovani-"),
    good.replace("</section><section id=\"zp-overit",'<form><input name="health"></form></section><section id="zp-overit')
  ]) assert.throws(()=>verifyInsuranceSearchHero(bad,"0.8.210"));
  assert.throws(()=>verifyInsuranceSearchHero(insuranceSearchPage("0.8.209"),"0.8.209"));
});

test("0.8.210 release must expose the actual new insurance search answer before QA dispatch",async()=>{
  const calls=[];
  const fetchMock=async url=>{
    calls.push(url);
    return {status:200,url,
      json:async()=>readiness("0.8.210"),
      text:async()=>url===origin+"/choditko-na-pojistovnu/"?insuranceSearchPage():
        url===origin+"/choditka-pro-seniory/"?walkerHubPage("0.8.210"):
        url===origin+"/choditko-do-bytu-pro-seniory/"?indoorPage("0.8.210"):
        html("0.8.210")};
  };
  const state=await observePublicDeploy(fetchMock,"0.8.210");
  assert.deepEqual(state,{status:"ready_for_full_qa",source_release:"0.8.210",
    live_release:"0.8.210",pages:7,insurance_first_answer:"verified",
    insurance_search_hero:"verified",mobility_guide_handoffs:"verified",
    affiliate_slots:25,readiness_checks:2});
  assert.equal(calls.length,2+RELEASE_CHECK_PATHS.length+3);
  const broken=await observePublicDeploy(async url=>({status:200,url,
    json:async()=>readiness("0.8.210"),
    text:async()=>url===origin+"/choditko-na-pojistovnu/"?insuranceTracked("0.8.210"):
      url===origin+"/choditka-pro-seniory/"?walkerHubPage("0.8.210"):
      url===origin+"/choditko-do-bytu-pro-seniory/"?indoorPage("0.8.210"):
      html("0.8.210")}),"0.8.210");
  assert.equal(broken.status,"blocked_mixed_or_incomplete_live_release");
  assert.equal(await dispatchWhenReady(broken,{}),"no_dispatch_unverified_public_release");
});
