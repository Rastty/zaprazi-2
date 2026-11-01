import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("every published custom page template is covered exactly once by the current release integrity manifest",()=>{
  const functions=read("functions.php");
  const list=functions.match(/function zaprazi_2_release_integrity_ok\(\) \{[\s\S]*?\$files = array\(([\s\S]*?)\n  \);/);
  assert.ok(list,"Integrity manifest missing");
  const listed=[...list[1].matchAll(/^\s*'([^']+)',\s*$/gm)].map(m=>m[1]);
  assert.equal(new Set(listed).size,listed.length,"Duplicate runtime integrity path");
  const version=read("style.css").match(/^Version:\s*(\S+)/m)?.[1];
  assert.ok(version,"Missing source theme version");
  const marker="ZP_RELEASE_"+version.replaceAll(".","_");
  const root=new URL("../",import.meta.url);
  // Runtime PHP checks *every* manifest file, but CI previously verified only
  // page templates. Catch missing/stale JS, CSS and shared PHP before a release
  // reaches the manual WordPress Pull + Deploy gate.
  for(const path of listed){
    assert.ok(!path.startsWith("/")&&!path.includes(".."),
      "Invalid runtime integrity path: "+path);
    let contents;
    try{
      contents=readFileSync(new URL("../"+path,import.meta.url),"utf8");
    }catch{
      assert.fail("Runtime integrity file missing from Git: "+path);
    }
    assert.ok(contents.includes(marker),
      "Runtime integrity file has stale release marker: "+path);
  }

  const templates=readdirSync(root).filter(p=>/^page-[^/]+\.php$/.test(p));
  for(const path of templates){
    assert.ok(listed.includes(path),"Page template missing from runtime integrity manifest: "+path);
  }
});
