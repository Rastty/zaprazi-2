#!/usr/bin/env node
/**
 * One-shot bounded release preparation for Zápraží 0.8.194.
 * Branch-only, no WordPress deploy or DB writes. Runtime changes: sole
 * Mobility hub hero CTA -> existing Home Advisor, with compare-first alternate.
 */
import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

const OLD="0.8.193",NEXT="0.8.194";
const OLD_MARK="ZP_RELEASE_0_8_193",NEXT_MARK="ZP_RELEASE_0_8_194";
const fn=readFileSync("functions.php","utf8");
const match=fn.match(/\$files = array\(([\s\S]*?)\n  \);/);
assert.ok(match,"Exact integrity manifest missing");
const files=[...match[1].matchAll(/^\s*'([^']+)',\s*$/gm)].map(m=>m[1]);
assert.equal(files.length,100,"Unexpected theme integrity manifest length");
assert.equal(new Set(files).size,100,"Duplicate integrity manifest path");
assert.ok(files.includes("page-choditka-pro-seniory.php")&&files.includes("style.css"));

const current=fn.match(/define\( 'ZAPRAZI_RELEASE', '([^']+)' \);/)?.[1];
assert.equal(current,OLD,"Unexpected old runtime version, refuse partial or concurrent release");
const previous='        <a class="zp-btn" href="#vyber-typu">Vybrat typ chodítka</a>';
const replacement='        <a class="zp-btn" data-zp-journey="advisor" href="<?php echo esc_url( home_url( \'/#poradce\' ) ); ?>">Ověřit vhodný typ v poradci</a>\n'+
  '        <a class="zp-text-link" href="#vyber-typu">Porovnat typy chodítek</a>';
const redundant='        <a class="zp-text-link" href="<?php echo esc_url( home_url( \'/#poradce\' ) ); ?>">Spustit celý poradce pro chůzi</a>';
const changes=[];
for(const path of files){
  assert.ok(!path.startsWith("/")&&!path.includes("..")&&!path.includes("\\"),
    "Unsafe manifest path");
  let data=readFileSync(path,"utf8");
  assert.ok(data.includes(OLD_MARK),"Missing 0.8.193 marker: "+path);
  data=data.replaceAll(OLD_MARK,NEXT_MARK);
  if(path==="style.css"){
    assert.ok(data.includes("Version: "+OLD),"Unexpected style.css release");
    data=data.replace("Version: "+OLD,"Version: "+NEXT);
  }
  if(path==="page-choditka-pro-seniory.php"){
    assert.equal(data.split(previous).length,2,"Mobility hub primary hero no longer matches");
    assert.equal(data.split(redundant).length,2,"Old tertiary Advisor link changed");
    data=data.replace(previous,replacement).replace(redundant,"");
    assert.ok(data.includes('id="vyber-typu"'),"Keep first-time comparison section");
    assert.ok(data.includes("home_url( '/pujceni-choditka/' )")&&
      data.includes("home_url( '/choditko-na-pojistovnu/' )"),
      "Retain buy/rent/reimbursement links");
  }
  changes.push([path,data]);
}
const blobHash=txt=>{
  const bytes=Buffer.from(txt,"utf8");
  return createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0"))
    .update(bytes).digest("hex");
};
let functions=fn.replace("define( 'ZAPRAZI_RELEASE', '"+OLD+"' );",
  "define( 'ZAPRAZI_RELEASE', '"+NEXT+"' );");
assert.notEqual(functions,fn);
for(const path of [
  "src/bathroom/engine.js","src/bathroom/preview.js",
  "src/mobility/engine.js","src/mobility/offer-fit-gate.js"
]){
  const before=readFileSync(path,"utf8");
  const after=changes.find(([p])=>p===path)?.[1]??before;
  const original="'"+path+"' => '"+blobHash(before)+"'";
  assert.ok(functions.includes(original),"Critical source SHA lock mismatched: "+path);
  functions=functions.replace(original,
    "'"+path+"' => '"+blobHash(after)+"'");
}
changes.push(["functions.php",functions]);
// All integrity, SHA and content assertions happened before writing files.
for(const [path,data] of changes)writeFileSync(path,data,"utf8");
console.log("PREPARED_RELEASE_0_8_194",JSON.stringify({
  touchedManifestFiles:files.length,mainHeroCTAs:1,comparisonPreserved:true,
  safetyLogicChanged:false,affiliateTargetsChanged:false,deploy:false
}));
