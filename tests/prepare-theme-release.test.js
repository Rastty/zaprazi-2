import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {
  CRITICAL_FILES,parseReleaseManifest,gitBlobSha,
  loadReleaseFiles,planRelease,parseCli,applyRelease
} from "../scripts/prepare-theme-release.mjs";

const sources=loadReleaseFiles();
const oldPhp=sources.get("functions.php");

test("0.8.198 real runtime inventory can be planned as 0.8.199, without disk changes",()=>{
  const before=readFileSync(new URL("../style.css",import.meta.url),"utf8");
  const paths=parseReleaseManifest(oldPhp);
  assert.equal(paths.length,100);
  assert.equal(sources.size,101);
  const plan=planRelease(sources,"0.8.199");
  assert.equal(plan.current,"0.8.198");
  assert.equal(plan.next,"0.8.199");
  assert.equal(plan.files.size,101);
  assert.match(plan.files.get("style.css"),/^Version: 0\.8\.199$/m);
  assert.match(plan.files.get("functions.php"),/define\( 'ZAPRAZI_RELEASE', '0\.8\.199' \);/);
  for(const path of paths){
    const updated=plan.files.get(path);
    assert.ok(updated.includes("ZP_RELEASE_0_8_199"),"No new marker in "+path);
    assert.ok(!updated.includes("ZP_RELEASE_0_8_198"),"Old marker in "+path);
  }
  for(const path of CRITICAL_FILES){
    const expected=gitBlobSha(plan.files.get(path));
    assert.equal(plan.pins[path].next,expected);
    assert.ok(plan.files.get("functions.php").includes("'"+path+"' => '"+expected+"'"));
    assert.equal(plan.pins[path].previous,gitBlobSha(sources.get(path)));
  }
  assert.equal(readFileSync(new URL("../style.css",import.meta.url),"utf8"),before,
    "Dry-run planning MUST NOT write a real theme file");
});

test("any stale marker, tampered critical file or modified release PHP fails closed",()=>{
  const damagedMarker=new Map(sources);
  damagedMarker.set("page-choditka-pro-seniory.php",
    damagedMarker.get("page-choditka-pro-seniory.php").replace(
      "ZP_RELEASE_0_8_198","ZP_RELEASE_0_8_197"));
  assert.throws(()=>planRelease(damagedMarker,"0.8.199"),/Stale or missing release marker/);
  const damagedBlob=new Map(sources);
  damagedBlob.set("src/mobility/engine.js",
    damagedBlob.get("src/mobility/engine.js")+"\n// unexpected runtime modification\n");
  assert.throws(()=>planRelease(damagedBlob,"0.8.199"),/critical Git blob pin/);
  const damagedPhp=new Map(sources);
  damagedPhp.set("functions.php",oldPhp.replace(
    "define( 'ZAPRAZI_RELEASE', '0.8.198' );",
    "define( 'ZAPRAZI_RELEASE', '0.8.197' );"));
  assert.throws(()=>planRelease(damagedPhp,"0.8.199"),/PHP version/);
  assert.throws(()=>planRelease(sources,"0.8.198"),/Only the next patch release/);
  assert.throws(()=>planRelease(sources,"0.8.200"),/Only the next patch release/);
  assert.throws(()=>planRelease(sources,"0.9.0"),/Only the next patch release/);
});

test("manifest cannot be silently shortened, duplicated or made to escape repository",()=>{
  assert.throws(()=>parseReleaseManifest(oldPhp.replace(
    "    'page-choditka-pro-seniory.php',\n","")),/100 runtime/);
  assert.throws(()=>parseReleaseManifest(oldPhp.replace(
    "    'page-choditka-pro-seniory.php',",
    "    '../outside.php',")),/Unsafe manifest path/);
  assert.throws(()=>parseReleaseManifest(oldPhp.replace(
    "    'page-choditka-pro-seniory.php',",
    "    'front-page.php',")),/Duplicate runtime integrity file/);
});

test("CLI only allows exact explicit patch release and is read-only without --apply",()=>{
  assert.deepEqual(parseCli(["--to","0.8.199"]),{to:"0.8.199",apply:false});
  assert.deepEqual(parseCli(["--to","0.8.199","--apply"]),{to:"0.8.199",apply:true});
  for(const args of [
    [],["0.8.199"],["--to","0.8.199","--apply","--force"],
    ["--to","0.8.199","--dry-run"],["--to","0.8.199?answer=private"]
  ]) assert.throws(()=>parseCli(args));
  const p=spawnSync(process.execPath,["scripts/prepare-theme-release.mjs","--to","0.8.199"],
    {encoding:"utf8",timeout:10000});
  assert.equal(p.status,0,p.stderr||"Dry-run helper failed");
  assert.match(p.stdout,/"status":"dry_run_no_writes"/);
  assert.match(p.stdout,/"changed":101/);
  assert.match(p.stdout,/"wordpressDeployed":false/);
  assert.match(p.stdout,/"productionVerified":false/);
});

test("even with a complete plan, apply refuses main/dev, dirty checkout or drift",()=>{
  const plan=planRelease(sources,"0.8.199");
  let calls=0;
  assert.throws(()=>applyRelease(plan,undefined,(...args)=>{
    calls++;
    return args[0]==="symbolic-ref"?"main":"";
  }),/dedicated release/);
  assert.equal(calls,1,"Refuse main before touching disk");
  assert.throws(()=>applyRelease(plan,undefined,(...args)=>
    args[0]==="symbolic-ref"?"release/next":" M unwanted-change.js"
  ),/Dirty working tree/);
});
