#!/usr/bin/env node
/**
 * One-shot bounded release preparation for Zápraží 0.8.193.
 * Only runs on a dedicated GitHub branch after explicit source-version check.
 * Does not deploy, touch WP DB, redirect visitors, or alter affiliate maps.
 */
import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
const OLD="0.8.192", NEXT="0.8.193";
const OLD_MARK="ZP_RELEASE_0_8_192", NEXT_MARK="ZP_RELEASE_0_8_193";
const fn=readFileSync("functions.php","utf8");
const manifest=fn.match(/\$files = array\(([\s\S]*?)\n  \);/);
assert.ok(manifest,"Exact integrity manifest missing");
const files=[...manifest[1].matchAll(/^\s*'([^']+)',\s*$/gm)].map(m=>m[1]);
assert.equal(files.length,100,"Do not change an unfamiliar theme manifest");
assert.equal(new Set(files).size,100);
assert.ok(files.includes("style.css")&&files.includes("page-pujceni-choditka.php")&&
  files.includes("page-choditko-na-pojistovnu.php"));
const current=fn.match(/define\( 'ZAPRAZI_RELEASE', '([^']+)' \);/)?.[1];
if(current===NEXT){
  for(const path of files)assert.ok(readFileSync(path,"utf8").includes(NEXT_MARK),
    "Partial already-written release: "+path);
  console.log("RELEASE_ALREADY_PREPARED_0_8_193");
  process.exit(0);
}
assert.equal(current,OLD,"Unexpected source release");
const oldPrimary='<a class="zp-btn" href="<?php echo esc_url( home_url( \'/choditka-pro-seniory/\' ) ); ?>">Nejdřív vybrat vhodný typ</a>';
const newPrimary='<a class="zp-btn" data-zp-journey="advisor" href="<?php echo esc_url( home_url( \'/#poradce\' ) ); ?>">Ověřit vhodný typ v poradci</a>\n        <a class="zp-text-link" href="<?php echo esc_url( home_url( \'/choditka-pro-seniory/#vyber-typu\' ) ); ?>">Porovnat typy chodítek</a>';
const modifications=[];
for(const path of files){
  assert.ok(!path.startsWith("/")&&!path.includes("..")&&!path.includes("\\"),
    "Unsafe release manifest path");
  let text=readFileSync(path,"utf8");
  assert.ok(text.includes(OLD_MARK),"Stale or missing source marker: "+path);
  text=text.replaceAll(OLD_MARK,NEXT_MARK);
  if(path==="style.css"){
    assert.ok(text.includes("Version: "+OLD),"Theme version mismatch");
    text=text.replace("Version: "+OLD,"Version: "+NEXT);
  }
  if(["page-pujceni-choditka.php","page-choditko-na-pojistovnu.php"].includes(path)){
    assert.equal(text.split(oldPrimary).length,2,"Primary acquisition hero CTA changed: "+path);
    text=text.replace(oldPrimary,newPrimary);
  }
  modifications.push([path,text]);
}
assert.ok(fn.includes("define( 'ZAPRAZI_RELEASE', '"+OLD+"' );"));
const gitBlobHash=value=>{
  const bytes=Buffer.from(value,"utf8");
  return createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0"))
    .update(bytes).digest("hex");
};
// The four critical Git blob locks must remain exact. Changing even a release
// marker changes Git's SHA1. Recalculate only for the reviewed new bytes.
let nextFunctions=fn.replace("define( 'ZAPRAZI_RELEASE', '"+OLD+"' );",
  "define( 'ZAPRAZI_RELEASE', '"+NEXT+"' );");
for(const path of [
  "src/bathroom/engine.js","src/bathroom/preview.js",
  "src/mobility/engine.js","src/mobility/offer-fit-gate.js"
]){
  const oldBytes=readFileSync(path,"utf8");
  const nextBytes=modifications.find(([p])=>p===path)?.[1]??oldBytes;
  const prevHash=gitBlobHash(oldBytes);
  const nextHash=gitBlobHash(nextBytes);
  const pin="'"+path+"' => '"+prevHash+"'";
  assert.ok(nextFunctions.includes(pin),"Existing critical blob lock not valid: "+path);
  nextFunctions=nextFunctions.replace(pin,"'"+path+"' => '"+nextHash+"'");
}
modifications.push(["functions.php",nextFunctions]);
// Only write after validating all 101 files.
for(const [path,text] of modifications)writeFileSync(path,text,"utf8");
console.log("PREPARED_RELEASE_0_8_193",{files:modifications.length,
  primaryLandingChanges:2,tracking:"consent-gated event name only",deploy:false});
