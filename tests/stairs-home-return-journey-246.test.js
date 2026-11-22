import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const home=read("front-page.php");
const returning=read("page-navrat-z-nemocnice.php");
const stairs=read("page-schody-pro-seniora-doma.php");
const css=read("style.css");
const release=css.match(/^Version: (\d+\.\d+\.\d+)$/m)?.[1];
const marker="ZP_RELEASE_"+release?.replaceAll(".","_");
test("0.8.246 offers two exact contextual stairs routes from existing decision entrances",()=>{
  assert.match(release??"",/^0\.8\.\d+$/);
  assert.ok(home.includes(marker)&&returning.includes(marker));
  for(const source of [home,returning]){
    assert.ok(source.includes(marker));
    assert.equal(source.split("home_url( '/schody-pro-seniora-doma/' )").length-1,1);
    assert.equal(source.split("<h1>").length-1,1);
  }
  assert.match(home,/Návrat z nemocnice[\s\S]*?Nejdřív prověřit bezpečný přístup po schodech/);
  assert.match(returning,/1\. Vstup a přesun[\s\S]*?Co prověřit na schodišti před propuštěním/);
  assert.match(returning,/chodítko není řešením schodiště/);
  assert.match(home,/bez riskantního přenášení/);
  assert.match(stairs,/Chodítko nebo rollátor není náhrada bezpečného řešení schodiště/);
});
test("0.8.246 does not add homepage hero actions or an ungated merchant shortcut",()=>{
  const hero=home.split('<section class="zp-hero zp-illustrated-hero zp-home-hero">')[1].split("</section>")[0];
  assert.equal(hero.split("<a ").length-1,3);
  for(const document of [home,returning]){
    const links=document.match(/href="<\?php echo esc_url\( home_url\( '\/schody-pro-seniora-doma\/' \) \); \?>"/g)||[];
    assert.equal(links.length,1);
    assert.ok(!links[0].includes("affiliate")&&!links[0].includes("click"));
    assert.equal(document.split(marker).length-1,1);
  }
});
