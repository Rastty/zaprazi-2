import test from "node:test";
import assert from "node:assert/strict";
import {assertHomepageCards,assertMaterialLastmod,assertBedFirstAnswer,materialLastmodDates,SOURCE_DATES,PREDEPLOY_BASELINE_DATES,PREDEPLOY_216_MATERIAL_DATES,PREDEPLOY_220_MATERIAL_DATES,PREDEPLOY_233_MATERIAL_DATES,selectLiveSitemapScope} from "../scripts/audit-205-postdeploy-seo.mjs";

const html=String.raw`<html><main>
<article class="zp-decision-card"><h3>Chůze a opora</h3>
<p><a class="zp-text-link" href="https://zaprazi.cz/co-zmerit-pred-vyberem-choditka/">Sedm věcí, které změřit</a></p></article>
<article class="zp-decision-card"><h3>Koupelna a WC</h3>
<a href="https://zaprazi.cz/sprchovaci-zidle-pro-seniory/">Sprchovací židle: co ověřit</a></article>
</main></html>`;
const xml='<urlset>'+Object.entries(SOURCE_DATES).map(([path,date])=>
  '<url><loc>https://zaprazi.cz'+path+'</loc><lastmod>'+date+'T00:00:00+00:00</lastmod></url>').join('')+'</urlset>';
test("Exact visible homepage decision cards link to matching useful guides",()=>{
  const v=assertHomepageCards(html);
  assert.equal(v.linksVerified,2);
  for(const path of ["/co-zmerit-pred-vyberem-choditka/","/sprchovaci-zidle-pro-seniory/"])
    assert.ok(v.paths.includes(path));
  assert.throws(()=>assertHomepageCards(html.replace("Sedm věcí, které změřit","Koupit hned")),
    /MISSING_CONTEXTUAL_HOME_LINK/);
  assert.throws(()=>assertHomepageCards(html.replace("https://zaprazi.cz/sprchovaci-zidle","http://zaprazi.cz/sprchovaci-zidle")),
    /MISSING_CONTEXTUAL_HOME_LINK/);
  assert.throws(()=>assertHomepageCards(html.replace("/co-zmerit-pred-vyberem-choditka/","/co-zmerit-pred-vyberem-choditka/?symptom=x")),
    /MISSING_CONTEXTUAL_HOME_LINK/);
});
test("All 12 source-declared material changes have bounded real sitemap dates",()=>{
  const v=assertMaterialLastmod(xml,"2026-11-18");
  assert.equal(v.lastmodsVerified,12);
  assert.deepEqual(v.pages.map(x=>x.path),Object.keys(SOURCE_DATES));
  assert.throws(()=>assertMaterialLastmod(xml.replaceAll("<lastmod>","<lastmid>"),"2026-11-18"),
    /SITEMAP_LASTMOD_UNVERIFIED/);
  assert.throws(()=>assertMaterialLastmod(xml.replace("2026-11-09T00","2026-10-09T00"),"2026-11-18"),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
  assert.throws(()=>assertMaterialLastmod(xml.replace("2026-11-09T00","2026-12-09T00"),"2026-11-18"),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
  assert.throws(()=>assertMaterialLastmod(xml+xml,"2026-11-18"),
    /SITEMAP_MISSING_OR_DUPLICATE_PAGE/);
  assert.throws(()=>assertMaterialLastmod(xml.replace("https://zaprazi.cz/pujceni-choditka/","https://other.example/pujceni-choditka/"),"2026-11-18"),
    /SITEMAP_MISSING_OR_DUPLICATE_PAGE/);
});


test("Only prior four changed pages are asserted before 0.8.209 deploy; full six after",()=>{
  assert.equal(Object.keys(PREDEPLOY_BASELINE_DATES).length,4);
  const pre=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.209",liveRelease:"0.8.208",integrity:"ok"});
  assert.equal(pre.mode,"predeploy_verified_baseline_only");
  assert.equal(assertMaterialLastmod(xml,"2026-11-15",pre.dates).lastmodsVerified,4);
  const pending=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.215",liveRelease:"0.8.214",integrity:"ok"});
  assert.equal(pending.mode,"predeploy_verified_214_dates_only");
  assert.equal(assertMaterialLastmod(xml,"2026-11-15",pending.dates).lastmodsVerified,10);
  assert.equal(pending.dates["/choditka-pro-seniory/"],"2026-11-10");
  assert.throws(()=>selectLiveSitemapScope({event:"schedule",sourceRelease:"0.8.215",liveRelease:"0.8.214",integrity:"ok"}),/SITEMAP_LIVE_RELEASE_MISMATCH/);
  const pending216=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.216",liveRelease:"0.8.215",integrity:"ok"});
  assert.equal(pending216.mode,"predeploy_verified_215_dates_only");
  assert.equal(Object.keys(pending216.dates).length,10);
  const pending217=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.217",liveRelease:"0.8.216",integrity:"ok"});
  assert.equal(pending217.mode,"predeploy_verified_216_dates_only");
  assert.equal(Object.keys(pending217.dates).length,10);
  assert.throws(()=>selectLiveSitemapScope({event:"schedule",sourceRelease:"0.8.216",liveRelease:"0.8.215",integrity:"ok"}),/SITEMAP_LIVE_RELEASE_MISMATCH/);
  assert.throws(()=>selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.216",liveRelease:"0.8.214",integrity:"ok"}),/SITEMAP_LIVE_RELEASE_MISMATCH/);
  const post=selectLiveSitemapScope({event:"schedule",sourceRelease:"0.8.215",liveRelease:"0.8.215",integrity:"ok"});
  assert.equal(post.mode,"postdeploy_exact_release");
  assert.equal(assertMaterialLastmod(xml,"2026-11-18",post.dates).lastmodsVerified,12);
  const pre220=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.221",liveRelease:"0.8.220",integrity:"ok"});
  assert.equal(pre220.mode,"predeploy_verified_220_dates_only");
  assert.equal(pre220.dates["/choditka-pro-seniory/"],"2026-11-10");
  assert.equal(PREDEPLOY_220_MATERIAL_DATES["/rollator-pro-seniory/"],"2026-11-10");
  const live220Xml=xml.replace(/(<loc>https:\/\/zaprazi\.cz\/choditka-pro-seniory\/<\/loc><lastmod>)2026-11-15/,
    (_,prefix)=>prefix+"2026-11-10");
  assert.equal(assertMaterialLastmod(live220Xml,"2026-11-15",pre220.dates).lastmodsVerified,11);
  assert.throws(()=>assertMaterialLastmod(live220Xml,"2026-11-15",SOURCE_DATES),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
  assert.throws(()=>selectLiveSitemapScope({event:"push",sourceRelease:"0.8.221",liveRelease:"0.8.220",integrity:"ok"}),
    /SITEMAP_LIVE_RELEASE_MISMATCH/);
  const pre234=selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.234",liveRelease:"0.8.233",integrity:"ok"});
  assert.equal(pre234.mode,"predeploy_verified_233_dates_only");
  assert.equal(Object.keys(pre234.dates).length,11);
  assert.equal(PREDEPLOY_233_MATERIAL_DATES["/senior-malo-pije/"],undefined);
  assert.equal(assertMaterialLastmod(xml,"2026-11-18",pre234.dates).lastmodsVerified,11);
  assert.throws(()=>selectLiveSitemapScope({event:"schedule",sourceRelease:"0.8.234",liveRelease:"0.8.233",integrity:"ok"}),
    /SITEMAP_LIVE_RELEASE_MISMATCH/);
  assert.throws(()=>selectLiveSitemapScope({event:"pull_request",sourceRelease:"0.8.234",liveRelease:"0.8.232",integrity:"ok"}),
    /SITEMAP_LIVE_RELEASE_MISMATCH/);
  for(const opts of [
    {event:"schedule",sourceRelease:"0.8.209",liveRelease:"0.8.208",integrity:"ok"},
    {event:"pull_request",sourceRelease:"0.8.209",liveRelease:"0.8.207",integrity:"ok"},
    {event:"pull_request",sourceRelease:"0.8.209",liveRelease:"0.8.208",integrity:"partial"}
  ])assert.throws(()=>selectLiveSitemapScope(opts),/SITEMAP_LIVE_/);
});


const liveBed=String.raw`<!doctype html>
<head><meta name="zaprazi-release" content="0.8.211">
<meta name="zaprazi-integrity" content="ok"></head>
<main>
<section class="zp-hero"><div class="zp-wrap">
<h1>Senior nemůže vstát z postele</h1>
<p class="zp-muted-copy"><strong>Rychlá odpověď:</strong>
Když se nedokáže posadit nebo zvednout ze sedu, při náhlém zhoršení
jej nezkoušejte zvedat silou; situaci ověřte s odborníkem.
<a href="#rozhodnuti-vstavani-postel">Co udělat dnes</a>
<a href="#kontroly-postele">Co změřit</a></p>
<div class="zp-hero-actions"><a href="#rozhodnuti-vstavani-postel">Zopakovat bezpečnou navigaci</a></div>
</div></section>
<section id="rozhodnuti-vstavani-postel"></section>
<section id="kontroly-postele"></section></main>`;

test("0.8.211 actual first-screen safety answer and repeated safe navigation pass",()=>{
  const result=assertBedFirstAnswer(liveBed,"0.8.211");
  assert.equal(result.bedFirstAnswer,"verified");
  assert.equal(result.bedAnchorsVerified,2);
  for(const v of [
    liveBed.replace('content="0.8.211"','content="0.8.210"'),
    liveBed.replace('content="ok"','content="partial"'),
    liveBed.replace("Rychlá odpověď:","Něco jiného:"),
    liveBed.replace("nezkoušejte zvedat silou","zkuste jej zvednout"),
    liveBed.replace('href="#kontroly-postele"','href="#chybi-kotva"'),
    liveBed.replace('<section id="kontroly-postele"></section>',''),
    liveBed.replace('<section id="kontroly-postele"></section>',
      '<section id="kontroly-postele"></section><section id="kontroly-postele"></section>'),
    liveBed.replace('<div class="zp-hero-actions">','<form><input name="health"></form><div class="zp-hero-actions">'),
    liveBed.replace("</section>\n<section id=\"rozhodnuti",'<p class="zp-muted-copy">Rychlá odpověď: duplicitní</p></section>\n<section id="rozhodnuti')
  ])assert.throws(()=>assertBedFirstAnswer(v,"0.8.211"));
});
test("0.8.211's dated bed page must appear once, with actual verified date",()=>{
  assert.equal(Object.keys(SOURCE_DATES).length,12);
  assert.equal(SOURCE_DATES["/senior-nemuze-vstat-z-postele/"],"2026-11-09");
  const missing=xml.replace(/<url><loc>https:\/\/zaprazi\.cz\/senior-nemuze-vstat-z-postele\/<\/loc>[\s\S]*?<\/url>/,"");
  assert.throws(()=>assertMaterialLastmod(missing,"2026-11-18"),/SITEMAP_MISSING_OR_DUPLICATE_PAGE/);
  const invalid=xml.replace('<loc>https://zaprazi.cz/senior-nemuze-vstat-z-postele/</loc><lastmod>2026-11-09',
    '<loc>https://zaprazi.cz/senior-nemuze-vstat-z-postele/</loc><lastmod>2026-10-09');
  assert.throws(()=>assertMaterialLastmod(invalid,"2026-11-18"),/SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
});


test("all 12 source material lastmods are captured; no hardcoded ten-page blind spot",()=>{
  assert.equal(Object.keys(SOURCE_DATES).length,12);
  assert.equal(SOURCE_DATES["/senior-malo-pije/"],"2026-11-18");
  assert.equal(SOURCE_DATES["/choditko-na-pojistovnu/"],"2026-11-10");
  assert.equal(SOURCE_DATES["/rollator-pro-seniory/"],"2026-11-10");
  assert.equal(SOURCE_DATES["/choditka-pro-seniory/"],"2026-11-15");
  assert.equal(SOURCE_DATES["/jak-vybrat-pecovatelskou-sluzbu/"],"2026-11-10");
  assert.equal(SOURCE_DATES["/navrat-z-nemocnice/"],"2026-11-10");
  assert.equal(SOURCE_DATES["/otazky-pred-propustenim-z-nemocnice/"],"2026-11-10");
  assert.equal(Object.keys(PREDEPLOY_216_MATERIAL_DATES).length,10);
  assert.throws(()=>assertMaterialLastmod(
    xml.replace(/<url><loc>https:\/\/zaprazi\.cz\/rollator-pro-seniory\/<\/loc>[\s\S]*?<\/url>/,""),
    "2026-11-18"),/SITEMAP_MISSING_OR_DUPLICATE_PAGE/);
  const source="function zaprazi_2_material_sitemap_page_dates() { return array(\n"+
    Object.entries(SOURCE_DATES).map(([path,date])=>
      "'"+path.slice(1,-1)+"' => '"+date+"T00:00:00+00:00',").join("\n")+
    "\n); }";
  assert.deepEqual(materialLastmodDates(source),SOURCE_DATES);
  assert.throws(()=>materialLastmodDates(source.replace(
    "'pujceni-choditka' => '2026-11-09T00:00:00+00:00',",
    "'pujceni-choditka' => '2026-11-09T00:00:00+00:00',\n"+
    "'pujceni-choditka' => '2026-11-09T00:00:00+00:00',"
  )),/SITEMAP_MATERIAL_DATE_DUPLICATE/);
  assert.throws(()=>materialLastmodDates(source.replace(
    "'rollator-pro-seniory' => '2026-11-10T00:00:00+00:00',",
    "'rollator-pro-seniory' => '2026-13-10T00:00:00+00:00',"
  )),/SITEMAP_MATERIAL_DATE_INVALID/);
});
