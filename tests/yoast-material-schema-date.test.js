import test from "node:test";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

const root=resolve(fileURLToPath(new URL("../",import.meta.url)));
test("Yoast WebPage dates use verified source revisions only, without schema scope leakage",()=>{
  const run=spawnSync("php",["tests/yoast-material-schema-date.php"],{
    cwd:root,encoding:"utf8",timeout:20000
  });
  assert.equal(run.error,undefined,String(run.error));
  assert.equal(run.status,0,String(run.stderr||run.stdout));
  assert.match(run.stdout,/PASS Yoast material dateModified/);
});
