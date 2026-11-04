#!/usr/bin/env node
/**
 * One-shot, branch-only WordPress theme release 0.8.195 → 0.8.196.
 * Exact scoped semantic delta is the evidence-led reimbursement model
 * identity clarification in page-choditko-na-pojistovnu.php.
 * Fail closed on unexpected manifest count, release or critical blob SHA.
 * Do not publish or modify WordPress.
 */
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
const OLD="0.8.195",NEXT="0.8.196";
const OLD_MARK="ZP_RELEASE_0_8_195",NEXT_MARK="ZP_RELEASE_0_8_196";
const fn=readFileSync("functions.php","utf8");
assert.equal(fn.match(/define\( 'ZAPRAZI_RELEASE', '([^']+)' \);/)?.[1],OLD);
const m=fn.match(/\$files = array\(([\s\S]*?)\n  \);/);
assert.ok(m,"Exact integrity manifest missing");
const paths=[...m[1].matchAll(/^\s*'([^']+)',\s*$/gm)].map(x=>x[1]);
assert.equal(paths.length,100);
assert.equal(new Set(paths).size,100);
assert.ok(paths.includes("page-choditko-na-pojistovnu.php"));
assert.ok(paths.includes("style.css"));
const page=readFileSync("page-choditko-na-pojistovnu.php","utf8");
for(const required of [
 "IDEAL ROLLATOR 3061982",
 "ROLLATOR 2 3061982-R",
 "Samotný kód z pojišťovny tedy nestačí",
 "https://www.meyra.cz/ctyrkolove-choditko-rollator2.html",
 "https://www.meyra.cz/ctyrkolove-choditko-rollator.html",
 "historický údaj z října 2026, nikoli potvrzená úhrada pro dnešek"
]) assert.ok(page.includes(required),"Required safety/source note missing: "+required);
assert.ok(!page.includes("data-zp-merchant-link"));
const gitBlob=x=>{
  const b=Buffer.from(x,"utf8");
  return createHash("sha1").update(Buffer.from("blob "+b.length+"\0")).update(b).digest("hex");
};
const toWrite=[];
for(const path of paths){
 assert.ok(!path.startsWith("/")&&!path.includes("..")&&!path.includes("\\"));
 let raw=readFileSync(path,"utf8");
 assert.ok(raw.includes(OLD_MARK),"Old release marker missing: "+path);
 raw=raw.replaceAll(OLD_MARK,NEXT_MARK);
 if(path==="style.css"){
  assert.ok(raw.includes("Version: "+OLD),"Style version mismatch");
  raw=raw.replace("Version: "+OLD,"Version: "+NEXT);
 }
 toWrite.push([path,raw]);
}
let newFn=fn.replace("define( 'ZAPRAZI_RELEASE', '"+OLD+"' );","define( 'ZAPRAZI_RELEASE', '"+NEXT+"' );");
assert.notEqual(newFn,fn);
for(const path of [
 "src/bathroom/engine.js",
 "src/bathroom/preview.js",
 "src/mobility/engine.js",
 "src/mobility/offer-fit-gate.js"
]){
  const original=readFileSync(path,"utf8");
  const transformed=toWrite.find(x=>x[0]===path)?.[1]??original;
  const oldHash="'"+path+"' => '"+gitBlob(original)+"'";
  assert.ok(newFn.includes(oldHash),"Critical production SHA mismatch: "+path);
  newFn=newFn.replace(oldHash,"'"+path+"' => '"+gitBlob(transformed)+"'");
}
toWrite.push(["functions.php",newFn]);
for(const [path,raw] of toWrite)writeFileSync(path,raw,"utf8");
console.log("PREPARED_RELEASE_0_8_196",JSON.stringify({
 source:OLD,next:NEXT,manifest:paths.length,
 semanticPage:"page-choditko-na-pojistovnu.php",
 verifiedManufacturerModelIdentifiers:2,
 updatedCriticalGitBlobLocks:4,
 siteWrite:false,merchantWrites:false
}));
