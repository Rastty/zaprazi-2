#!/usr/bin/env node
/**
 * Branch-only, one-shot, bounded 0.8.195 release preparation.
 * The ONLY runtime semantic change is moving optional analytics-consent.js
 * from the parser-blocking wp_head into wp_footer. Source invariants, critical
 * SHA locks and the full tests must pass BEFORE committing to the PR branch.
 * No live WordPress write, personal data, affiliate requests or deploy.
 */
import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";

const OLD="0.8.194",NEXT="0.8.195";
const OLD_MARK="ZP_RELEASE_0_8_194",NEXT_MARK="ZP_RELEASE_0_8_195";
const originalFunctions=readFileSync("functions.php","utf8");
assert.equal(
  originalFunctions.match(/define\( 'ZAPRAZI_RELEASE', '([^']+)' \);/)?.[1],OLD,
  "Unexpected source release; refuse concurrent or partial theme upgrade");
const match=originalFunctions.match(/\$files = array\(([\s\S]*?)\n  \);/);
assert.ok(match,"Exact integrity manifest missing");
const paths=[...match[1].matchAll(/^\s*'([^']+)',\s*$/gm)].map(m=>m[1]);
assert.equal(paths.length,100,"Unexpected 100-file integrity manifest");
assert.equal(new Set(paths).size,100,"Duplicate integrity path");
assert.ok(paths.includes("assets/js/analytics-consent.js"));
assert.ok(paths.includes("style.css")&&paths.includes("header.php")&&paths.includes("footer.php"));

const analyticsEnqueue=/wp_enqueue_script\(\s*'zaprazi-analytics-consent',[\s\S]*?assets\/js\/analytics-consent\.js'[\s\S]*?\n  \);/g;
const enqueueBlocks=[...originalFunctions.matchAll(analyticsEnqueue)];
assert.equal(enqueueBlocks.length,1,"Exactly one optional analytics adapter enqueue expected");
const oldBlock=enqueueBlocks[0][0];
assert.ok(oldBlock.endsWith("    false\n  );"),"Consent adapter is no longer a head script; audit source before release");
const newBlock=oldBlock.replace(/    false\n  \);$/,"    true // Nonessential opt-in adapter after the HTML and consent controls\n  );");
assert.notEqual(oldBlock,newBlock);
const configPosition=originalFunctions.indexOf("wp_add_inline_script(\n    'zaprazi-analytics-consent'");
assert.ok(configPosition>originalFunctions.indexOf(oldBlock),"Consent inline config follows the matching enqueue");
assert.ok(originalFunctions.slice(configPosition,configPosition+420).includes("'before'"),"Inline config must remain BEFORE script");

const files=[];
for(const path of paths){
  assert.ok(!path.startsWith("/")&&!path.includes("\\")&&!path.includes(".."),
    "Unsafe integrity path");
  let content=readFileSync(path,"utf8");
  assert.ok(content.includes(OLD_MARK),"Missing 0.8.194 marker "+path);
  content=content.replaceAll(OLD_MARK,NEXT_MARK);
  if(path==="style.css"){
    assert.ok(content.includes("Version: "+OLD),"Unexpected style.css version");
    content=content.replace("Version: "+OLD,"Version: "+NEXT);
  }
  files.push([path,content]);
}
const hashGitBlob=txt=>{
  const buf=Buffer.from(txt,"utf8");
  return createHash("sha1").update(Buffer.from("blob "+buf.length+"\0"))
    .update(buf).digest("hex");
};
let nextFunctions=originalFunctions
  .replace("define( 'ZAPRAZI_RELEASE', '"+OLD+"' );",
    "define( 'ZAPRAZI_RELEASE', '"+NEXT+"' );")
  .replace(oldBlock,newBlock);
assert.notEqual(nextFunctions,originalFunctions,"Expected explicit in_footer change");
for(const path of [
  "src/bathroom/engine.js","src/bathroom/preview.js",
  "src/mobility/engine.js","src/mobility/offer-fit-gate.js"
]){
  const oldBytes=readFileSync(path,"utf8");
  const newBytes=files.find(([name])=>name===path)?.[1]??oldBytes;
  const oldPin="'"+path+"' => '"+hashGitBlob(oldBytes)+"'";
  assert.ok(nextFunctions.includes(oldPin),"Critical Git blob SHA mismatch: "+path);
  nextFunctions=nextFunctions.replace(oldPin,
    "'"+path+"' => '"+hashGitBlob(newBytes)+"'");
}
assert.ok(nextFunctions.includes("    true // Nonessential opt-in adapter after the HTML and consent controls"));
files.push(["functions.php",nextFunctions]);
for(const [path,content] of files)writeFileSync(path,content,"utf8");
console.log("PREPARED_RELEASE_0_8_195",JSON.stringify({
  source:OLD,release:NEXT,manifestFiles:paths.length,
  optInAdapterMoved:"head_to_footer",configOrder:"before_adapter",
  advisorLogicModified:false,merchantTargetsModified:false,deploy:false
}));
