import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const source=read("page-navrat-z-nemocnice.php");
const linkTargets=[
  ["/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel","page-toaletni-zidle-vedle-postele.php"],
  ["/myti-vlasu-na-luzku/#vyber-myti-vlasu","page-myti-vlasu-na-luzku.php"],
  ["/oblekani-ponozek-a-kalhot-bez-ohybani/#podle-problemu-oblekani","page-oblekani-ponozek-a-kalhot-bez-ohybani.php"],
  ["/hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku","page-hygiena-leziciho-seniora-doma.php"],
  ["/nastupovani-seniora-do-auta/#situace-nastupovani-auto","page-nastupovani-seniora-do-auta.php"],
  ["/prevoz-seniora-k-lekari/#vyber-dopravy","page-prevoz-seniora-k-lekari.php"]
];

test("return-home visitor reaches the primary safety plan before optional editorial detours",()=>{
  const hero=source.slice(source.indexOf('<section class="zp-hero">'),source.indexOf('</section>'));
  assert.equal((hero.match(/<h1\b/g)||[]).length,1);
  assert.equal((hero.match(/href="#plan-navratu"/g)||[]).length,1);
  assert.match(hero,/class="zp-btn" href="#plan-navratu"/);
  assert.match(hero,/Sedm otázek k vytištění před propuštěním/);
  assert.doesNotMatch(hero,/zp-muted-copy|toaletni-zidle-vedle-postele|myti-vlasu-na-luzku|vyber-dopravy/);
  const advisor=source.indexOf('id="plan-navratu"');
  const priorities=source.indexOf('Co má přednost před „dokonalým vybavením“');
  const optional=source.indexOf('id="navrat-prakticke-navody"');
  assert.ok(advisor>0&&priorities>advisor&&optional>priorities,
    "Optional content must follow the advisor and first-night safety priorities");
  assert.ok(source.indexOf('id="domaci-zdravotni-pece-nebo-pecovatelska-sluzba"')>optional);
});

test("all six helpful links remain in three understandable cards with real in-theme anchors",()=>{
  const start=source.indexOf('<section id="navrat-prakticke-navody"');
  const end=source.indexOf('</section>',start);
  assert.ok(start>=0&&end>start);
  const region=source.slice(start,end);
  assert.match(region,/aria-labelledby="navrat-prakticke-navody-title"/);
  assert.match(region,/id="navrat-prakticke-navody-title"/);
  assert.equal((region.match(/<article class="zp-decision-card">/g)||[]).length,3);
  assert.match(region,/nenahrazují pokyny ošetřujícího týmu/);
  assert.match(region,/Zpět k plánu první noci doma/);
  for(const [path,file] of linkTargets){
    const expression="home_url( '"+path+"' )";
    assert.equal(region.split(expression).length-1,1,"Missing or duplicate route: "+path);
    assert.ok(read(file).includes('id="'+path.split("#")[1]+'"'),"Missing real target anchor: "+path);
  }
  assert.doesNotMatch(region,/data-zp-merchant|affiliateMap|tracking|<form\b|name="diagnosis"|localStorage|sessionStorage|fetch\(/i);
});

test("theme stays on one release without new merchant or clinical logic",()=>{
  const current=read("style.css").match(/^Version:\s*(\S+)/m)?.[1];
  assert.ok(current);
  const marker="ZP_RELEASE_"+current.replaceAll(".","_");
  assert.ok(source.includes(marker));
  assert.match(source,/id="zp-return-home-advisor"/);
  assert.match(source,/id="zp-return-home-submit"/);
  assert.match(source,/id="zp-return-home-result"/);
});
