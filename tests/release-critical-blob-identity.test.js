import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";

const root=new URL("../",import.meta.url);
const EXPECTED=[
  "src/bathroom/engine.js",
  "src/bathroom/preview.js",
  "src/mobility/engine.js",
  "src/mobility/offer-fit-gate.js"
];

test("release integrity pins the exact Git blobs for all critical decision files",()=>{
  const php=readFileSync(new URL("functions.php",root),"utf8");
  const begin=php.indexOf("$bathroom_git_blobs = array(");
  const end=php.indexOf("foreach ( $files as $relative_path )",begin);
  assert.ok(begin>=0&&end>begin,"Critical runtime blob manifest missing");
  const manifest=php.slice(begin,end);
  const entries=[...manifest.matchAll(/^\s*'([^'\r\n]+)'\s*=>\s*'([0-9a-f]{40})',?\s*$/gm)];
  const paths=entries.map(m=>m[1]);

  assert.deepEqual([...paths].sort(),[...EXPECTED].sort(),
    "Critical decision files must be pinned once each; review any manifest change");
  assert.equal(new Set(paths).size,paths.length,"Duplicate critical blob path");
  assert.match(manifest,/array_merge\(\s*\$files,\s*array_keys\(\s*\$critical_git_blobs\s*\)\s*\)/,
    "Critical blobs must be included in the runtime integrity walk");
  assert.match(php,/hash_equals\(\s*\$critical_git_blobs\[\s*\$relative_path\s*\],\s*\$actual_blob\s*\)/,
    "Runtime must compare exact blob identities, not just release markers");

  for(const [,path,expectedSha] of entries){
    assert.ok(!path.startsWith("/")&&!path.includes("..")&&!path.includes("\\"),
      "Unsafe critical runtime path: "+path);
    const bytes=readFileSync(new URL(path,root));
    const actualSha=createHash("sha1")
      .update(Buffer.from("blob "+bytes.length+"\0"))
      .update(bytes)
      .digest("hex");
    assert.equal(actualSha,expectedSha,
      "Stale critical Git blob pin: "+path+"; update only after review of the matching runtime code");
  }
});
