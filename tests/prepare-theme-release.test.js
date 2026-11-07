import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {
  CRITICAL_FILES,parseReleaseManifest,gitBlobSha,
  loadReleaseFiles,planRelease,parseCli,applyRelease
} from "../scripts/prepare-theme-release.mjs";

const sources=loadReleaseFiles();
const php=sources.get("functions.php");
const theme=sources.get("style.css");
const current=theme.match(/^Version:\s*(\d+)\.(\d+)\.(\d+)\s*$/m);
assert.ok(current,"WordPress release version missing");
const currentVersion=current.slice(1).join(".");
const nextVersion=[Number(current[1]),Number(current[2]),Number(current[3])+1].join(".");
const skippedVersion=[Number(current[1]),Number(current[2]),Number(current[3])+2].join(".");
const previousVersion=[Number(current[1]),Number(current[2]),Number(current[3])-1].join(".");
const oldMarker="ZP_RELEASE_"+currentVersion.replaceAll(".","_");
const newMarker="ZP_RELEASE_"+nextVersion.replaceAll(".","_");

test("current runtime can prepare exactly one patch version without writes",()=>{
  const before=readFileSync(new URL("../style.css",import.meta.url),"utf8");
  const paths=parseReleaseManifest(php);
  assert.equal(paths.length,100);
  assert.equal(sources.size,103); // 100 marker files, PHP, 2 separately pinned Bathroom blobs
  const plan=planRelease(sources,nextVersion);
  assert.equal(plan.current,currentVersion);
  assert.equal(plan.next,nextVersion);
  assert.equal(plan.files.size,101);
  assert.ok(plan.files.get("style.css").includes("Version: "+nextVersion));
  assert.ok(plan.files.get("functions.php").includes(
    "define( 'ZAPRAZI_RELEASE', '"+nextVersion+"' );"
  ));
  for(const path of paths){
    const updated=plan.files.get(path);
    assert.ok(updated.includes(newMarker),"Missing next marker in "+path);
    assert.ok(!updated.includes(oldMarker),"Old marker in "+path);
  }
  for(const path of CRITICAL_FILES){
    const expected=gitBlobSha(plan.files.get(path)??sources.get(path));
    assert.equal(plan.pins[path].next,expected);
    assert.ok(plan.files.get("functions.php").includes("'"+path+"' => '"+expected+"'"));
    assert.equal(plan.pins[path].previous,gitBlobSha(sources.get(path)));
  }
  assert.equal(readFileSync(new URL("../style.css",import.meta.url),"utf8"),before,
    "Dry run must not write theme CSS");
});

test("stale marker, altered critical file, mismatched PHP or skipped version refuse release",()=>{
  const damagedMarker=new Map(sources);
  damagedMarker.set("page-choditka-pro-seniory.php",
    damagedMarker.get("page-choditka-pro-seniory.php").replace(
      oldMarker,"ZP_RELEASE_INVALID_OLDER"));
  assert.throws(()=>planRelease(damagedMarker,nextVersion),/Stale or missing release marker/);
  const damagedBlob=new Map(sources);
  damagedBlob.set("src/mobility/engine.js",
    damagedBlob.get("src/mobility/engine.js")+"\n// unauthorized modification\n");
  assert.throws(()=>planRelease(damagedBlob,nextVersion),/critical Git blob pin/);
  const damagedPhp=new Map(sources);
  damagedPhp.set("functions.php",php.replace(
    "define( 'ZAPRAZI_RELEASE', '"+currentVersion+"' );",
    "define( 'ZAPRAZI_RELEASE', '"+previousVersion+"' );"));
  assert.throws(()=>planRelease(damagedPhp,nextVersion),/PHP version/);
  assert.throws(()=>planRelease(sources,currentVersion),/Only the next patch release/);
  assert.throws(()=>planRelease(sources,skippedVersion),/Only the next patch release/);
  assert.throws(()=>planRelease(sources,"0.9.0"),/Only the next patch release/);
});

test("manifest cannot be shortened, duplicated or made to escape repository",()=>{
  assert.throws(()=>parseReleaseManifest(php.replace(
    "    'page-choditka-pro-seniory.php',\n","")),/100 runtime/);
  assert.throws(()=>parseReleaseManifest(php.replace(
    "    'page-choditka-pro-seniory.php',",
    "    '../outside.php',")),/Unsafe manifest path/);
  assert.throws(()=>parseReleaseManifest(php.replace(
    "    'page-choditka-pro-seniory.php',",
    "    'front-page.php',")),/Duplicate runtime integrity file/);
});

test("CLI only allows explicit next patch and defaults to dry-run",()=>{
  assert.deepEqual(parseCli(["--to",nextVersion]),{to:nextVersion,apply:false});
  assert.deepEqual(parseCli(["--to",nextVersion,"--apply"]),{to:nextVersion,apply:true});
  for(const args of [
    [],[nextVersion],["--to",nextVersion,"--apply","--force"],
    ["--to",nextVersion,"--dry-run"],["--to",nextVersion+"?answer=private"]
  ])assert.throws(()=>parseCli(args));
  const p=spawnSync(process.execPath,["scripts/prepare-theme-release.mjs","--to",nextVersion],
    {encoding:"utf8",timeout:10000});
  assert.equal(p.status,0,p.stderr||"Dry-run helper failed");
  const result=JSON.parse(p.stdout.replace(/^ZP_THEME_RELEASE_PLAN /,""));
  assert.equal(result.from,currentVersion);
  assert.equal(result.to,nextVersion);
  assert.equal(result.status,"dry_run_no_writes");
  assert.equal(result.changed,101);
  assert.equal(result.wordpressDeployed,false);
  assert.equal(result.productionVerified,false);
});

test("apply refuses main/dev and dirty checkout before any file change",()=>{
  const plan=planRelease(sources,nextVersion);
  let calls=0;
  assert.throws(()=>applyRelease(plan,undefined,(...args)=>{
    calls++;
    return args[0]==="symbolic-ref"?"main":"";
  }),/dedicated release/);
  assert.equal(calls,1,"Must refuse main before any further Git call");
  assert.throws(()=>applyRelease(plan,undefined,(...args)=>
    args[0]==="symbolic-ref"?"release/next":" M unwanted-change.js"
  ),/Dirty working tree/);
});
