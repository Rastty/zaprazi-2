import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("release keeps the 0.8.186 human UX while all 100 runtime markers match the current version",()=>{
  const functions=read("functions.php"),css=read("style.css");
  const version=css.match(/^Version:\s*(\d+\.\d+\.\d+)\s*$/m)?.[1];
  assert.ok(version,"Current WordPress release must be defined");
  assert.ok(functions.includes("define( 'ZAPRAZI_RELEASE', '"+version+"' )"));
  const begin=functions.indexOf("  $files = array(");
  const end=functions.indexOf("\n  );",begin);
  assert.ok(begin>=0&&end>begin,"Runtime manifest must be present");
  const paths=[...functions.slice(begin,end).matchAll(/'([^']+)'/g)].map(match=>match[1]);
  assert.equal(paths.length,100);
  assert.equal(new Set(paths).size,100,"Manifest must contain no duplicate paths");
  const marker="ZP_RELEASE_"+version.replaceAll(".","_");
  for(const path of paths){
    const content=read(path);
    assert.ok(content.includes(marker),"Stale runtime file: "+path);
    assert.ok(!content.includes("ZP_RELEASE_0_8_185"),"Older release marker: "+path);
  }
  assert.ok(!functions.includes("define( 'ZAPRAZI_RELEASE', '0.8.185' )"));
  assert.ok(!css.includes("Version: 0.8.185"));
});

test("all four critical runtime blob SHA locks match their actual checked-in content",()=>{
  const fn=read("functions.php");
  for(const path of [
    "src/mobility/engine.js","src/mobility/offer-fit-gate.js",
    "src/bathroom/engine.js","src/bathroom/preview.js"
  ]){
    const content=read(path);
    const blob=createHash("sha1").update("blob "+Buffer.byteLength(content,"utf8")+"\0"+content).digest("hex");
    assert.ok(fn.includes("'"+path+"' => '"+blob+"'"),"Critical Git blob lock mismatch: "+path);
  }
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
