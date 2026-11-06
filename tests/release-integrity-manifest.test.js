import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("Release version, 100 theme manifest markers and four exact Git blob pins agree",()=>{
  const php=read("functions.php"),css=read("style.css");
  const phpVersion=php.match(/define\( 'ZAPRAZI_RELEASE', '([0-9.]+)' \)/)?.[1];
  const cssVersion=css.match(/^Version:\s*([0-9.]+)/m)?.[1];
  assert.ok(phpVersion&&cssVersion,"Missing release version");
  assert.equal(phpVersion,cssVersion,"PHP and CSS versions differ");
  const marker="ZP_RELEASE_"+cssVersion.replaceAll(".","_");
  const manifest=php.match(/\$files\s*=\s*array\(([\s\S]*?)\);/)?.[1];
  assert.ok(manifest,"Missing integrity manifest");
  const paths=[...manifest.matchAll(/'([^']+\.(?:php|js|css))'/g)].map(m=>m[1]);
  assert.equal(paths.length,100,"Theme manifest unexpectedly changed");
  assert.equal(new Set(paths).size,paths.length,"Duplicate release file");
  for(const path of paths){
    assert.ok(read(path).includes(marker),path+" has a stale release marker");
  }
  for(const path of ["src/bathroom/engine.js","src/bathroom/preview.js","src/mobility/engine.js","src/mobility/offer-fit-gate.js"]){
    const content=read(path);
    const actual=createHash("sha1").update("blob "+Buffer.byteLength(content)+"\0").update(content).digest("hex");
    assert.ok(php.includes("'"+path+"' => '"+actual+"'"),path+" mismatches pinned blob");
  }
});
