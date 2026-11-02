import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("coordinated release 0.8.186 contains exactly 100 coherent runtime markers",()=>{
  const functions=read("functions.php"),css=read("style.css");
  assert.match(css,/^Version: 0\.8\.186$/m);
  assert.match(functions,/define\( 'ZAPRAZI_RELEASE', '0\.8\.186' \)/);
  const begin=functions.indexOf("  $files = array(");
  const end=functions.indexOf("\n  );",begin);
  assert.ok(begin>=0&&end>begin,"Runtime manifest must be present");
  const paths=[...functions.slice(begin,end).matchAll(/'([^']+)'/g)].map(match=>match[1]);
  assert.equal(paths.length,100);
  assert.equal(new Set(paths).size,100,"Manifest must contain no duplicate paths");
  const marker="ZP_RELEASE_0_8_186";
  for(const path of paths){
    const content=read(path);
    assert.ok(content.includes(marker),"Stale runtime file: "+path);
    assert.ok(!content.includes("ZP_RELEASE_0_8_185"),"Older release marker: "+path);
  }
  assert.ok(!functions.includes("define( 'ZAPRAZI_RELEASE', '0.8.185' )"));
  assert.ok(!css.includes("Version: 0.8.185"));
});

test("mobility critical blobs use current reviewed hashes, bathroom locks remain unchanged",()=>{
  const fn=read("functions.php");
  assert.match(fn,/'src\/mobility\/engine\.js' => '3a9fc00a7f3d5c487e75626ce740599187301e93'/);
  assert.match(fn,/'src\/mobility\/offer-fit-gate\.js' => 'a74bd06fa408d5b5f86afda46f90cd31c7593c5f'/);
  assert.match(fn,/'src\/bathroom\/engine\.js' => 'e29555aef72f943429110692710c6f039c1c80b4'/);
  assert.match(fn,/'src\/bathroom\/preview\.js' => 'd560bd9fb0521d969e6782b613e7468fa634b048'/);
});

test("both user features ship without new rule engine, affiliate mutation or persisted answers",()=>{
  const rental=read("page-pujceni-choditka.php");
  const budget=read("assets/js/walker-rental-budget.js");
  const returnHome=read("assets/js/return-home-advisor.js");
  assert.match(rental,/id="zp-walker-own-quote-budget"/);
  assert.match(rental,/zp_rental_is_fresh/);
  assert.match(rental,/Přepočet není k dispozici/);
  assert.match(budget,/event\.preventDefault\(\)/);
  assert.doesNotMatch(budget,/localStorage|sessionStorage|sendBeacon|fetch\(/);
  assert.match(returnHome,/renderOverview\(output\)/);
  const posCritical=returnHome.lastIndexOf('renderItems("Blokuje bezpečný návrat domů"');
  const posOverview=returnHome.lastIndexOf('renderOverview(output)');
  const posFull=returnHome.lastIndexOf('renderChecklist(output)');
  assert.ok(posCritical>=0&&posCritical<posOverview&&posOverview<posFull);
  assert.doesNotMatch(returnHome,/localStorage|sessionStorage|sendBeacon|fetch\(/);
});
