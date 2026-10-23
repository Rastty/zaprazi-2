import test from "node:test";
import assert from "node:assert/strict";
import {readdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";

// Parse-only: CI should catch mistakes in optional production-only Puppeteer
// scripts without needing Chromium or WordPress. Browser jobs install their
// own dependency and then execute these scripts against production.
const scriptsRoot=fileURLToPath(new URL("../scripts/",import.meta.url));
const checks=readdirSync(scriptsRoot)
  .filter(name=>/^audit-live-.*\.mjs$/.test(name))
  .map(name=>resolve(scriptsRoot,name));
checks.push(fileURLToPath(new URL("./production-advisor-smoke.mjs",import.meta.url)));

test("all read-only production browser probes are valid JavaScript",()=>{
  assert.ok(checks.length>=7,"Expected the production browser audit inventory");
  for(const path of checks){
    const result=spawnSync(process.execPath,["--check",path],{encoding:"utf8"});
    assert.equal(result.status,0, "Broken browser audit "+path+": "+result.stderr);
  }
});
