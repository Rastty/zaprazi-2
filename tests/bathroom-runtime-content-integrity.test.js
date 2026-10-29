import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";

const php=readFileSync(new URL("../functions.php",import.meta.url),"utf8");
const tracked=["src/bathroom/engine.js","src/bathroom/preview.js"];

test("WordPress integrity fingerprints match the exact reviewed bathroom engine and preview bytes",()=>{
  assert.ok(php.includes("$bathroom_git_blobs = array("));
  assert.ok(php.includes("$critical_git_blobs = array_merge( $bathroom_git_blobs"));
  assert.ok(php.includes("array_merge( $files, array_keys( $critical_git_blobs ) )"));
  assert.ok(php.includes("hash_equals( $critical_git_blobs[ $relative_path ], $actual_blob )"));
  assert.ok(php.includes("sha1( 'blob ' . strlen( $contents )"));
  for(const path of tracked){
    const listing=php.split("\n").find(line=>line.includes("'"+path+"' => '"));
    assert.ok(listing,"Missing exact Git blob for "+path);
    const expected=listing.match(/'([0-9a-f]{40})'/)?.[1];
    assert.ok(expected,"Malformed Git blob SHA for "+path);
    const bytes=readFileSync(new URL("../"+path,import.meta.url));
    const blobHeader=Buffer.from("blob "+bytes.length+String.fromCharCode(0));
    const actual=createHash("sha1").update(blobHeader).update(bytes).digest("hex");
    assert.equal(actual,expected,"Update the reviewed git hash-object for "+path);
  }
});
