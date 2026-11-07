#!/usr/bin/env node
/**
 * Safe local WordPress theme release preparer.
 *
 * Default mode plans all changes in memory and prints a summary; no writes.
 * --apply changes tracked files ONLY on a clean, dedicated release/* branch.
 * No network, WordPress, GitHub API, credentials or deploy action.
 */
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync,writeFileSync,lstatSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {fileURLToPath,pathToFileURL} from "node:url";
import {resolve,relative,isAbsolute,sep} from "node:path";

const ROOT=fileURLToPath(new URL("../",import.meta.url));
export const CRITICAL_FILES=Object.freeze([
  "src/bathroom/engine.js",
  "src/bathroom/preview.js",
  "src/mobility/engine.js",
  "src/mobility/offer-fit-gate.js"
]);

export function gitBlobSha(content){
  assert.equal(typeof content,"string","Blob content must be UTF-8 text");
  return createHash("sha1").update("blob "+Buffer.byteLength(content)+"\0")
    .update(content,"utf8").digest("hex");
}

export function parseReleaseManifest(php){
  assert.equal(typeof php,"string","PHP source missing");
  const section=php.match(/function zaprazi_2_release_integrity_ok\(\)\s*\{[\s\S]*?\$files = array\(([\s\S]*?)\n  \);/);
  assert.ok(section,"Exact runtime integrity manifest not found");
  const paths=[...section[1].matchAll(/^\s*'([^']+)',\s*$/gm)].map(m=>m[1]);
  assert.equal(paths.length,100,"Expected exactly 100 runtime integrity files");
  assert.equal(new Set(paths).size,100,"Duplicate runtime integrity file");
  for(const path of paths) {
    assert.ok(/^[a-zA-Z0-9/_\-.]+$/.test(path) && !path.startsWith("/") &&
      !path.startsWith("./") && !path.includes("..") && !path.includes("//") &&
      /\.(?:php|js|css)$/.test(path),"Unsafe manifest path");
  }
  assert.ok(paths.includes("style.css"),"CSS must be covered by manifest");
  for(const path of CRITICAL_FILES)
    assert.ok(paths.includes(path),"Critical blob omitted from manifest");
  return paths;
}

function oneReplace(text,before,after,reason){
  assert.ok(typeof text==="string" && before!=="" && text.split(before).length===2,
    "Missing or ambiguous "+reason);
  return text.replace(before,after);
}

export function planRelease(contents,nextVersion){
  assert.ok(contents instanceof Map,"Expected read-only Map of sources");
  const css=contents.get("style.css"),php=contents.get("functions.php");
  assert.ok(css&&php,"Release PHP and CSS required");
  const current=css.match(/^Version:\s*(\d+)\.(\d+)\.(\d+)\s*$/m);
  assert.ok(current,"Unique CSS source version required");
  const prevVersion=current.slice(1).join(".");
  assert.equal((css.match(/^Version:\s*\d+\.\d+\.\d+\s*$/gm)||[]).length,1);
  assert.match(nextVersion??"",/^\d+\.\d+\.\d+$/,"Invalid next release");
  const [a,b,c]=nextVersion.split(".").map(Number);
  assert.ok(Number.isSafeInteger(a)&&Number.isSafeInteger(b)&&Number.isSafeInteger(c));
  assert.ok(a===Number(current[1]) && b===Number(current[2]) &&
    c===Number(current[3])+1,"Only the next patch release is allowed");
  const oldMarker="ZP_RELEASE_"+prevVersion.replaceAll(".","_");
  const newMarker="ZP_RELEASE_"+nextVersion.replaceAll(".","_");
  assert.ok(!css.includes(newMarker) && !php.includes(newMarker),
    "Target release already present in source");
  const manifest=parseReleaseManifest(php);
  const changed=new Map();
  for(const path of manifest) {
    const original=contents.get(path);
    assert.equal(typeof original,"string","Missing release file: "+path);
    assert.ok(original.includes(oldMarker),"Stale or missing release marker: "+path);
    assert.ok(!original.includes(newMarker),"Release marker already staged: "+path);
    changed.set(path,original.replaceAll(oldMarker,newMarker));
  }
  const cssVersion=oneReplace(changed.get("style.css"),"Version: "+prevVersion,
    "Version: "+nextVersion,"CSS version");
  changed.set("style.css",cssVersion);

  let updatedPhp=oneReplace(php,
    "define( 'ZAPRAZI_RELEASE', '"+prevVersion+"' );",
    "define( 'ZAPRAZI_RELEASE', '"+nextVersion+"' );","PHP version");
  const pins={};
  for(const path of CRITICAL_FILES){
    const original=contents.get(path);
    const oldSha=gitBlobSha(original),newSha=gitBlobSha(changed.get(path));
    const before="'"+path+"' => '"+oldSha+"'";
    const after="'"+path+"' => '"+newSha+"'";
    updatedPhp=oneReplace(updatedPhp,before,after,"critical Git blob pin: "+path);
    pins[path]={previous:oldSha,next:newSha};
  }
  changed.set("functions.php",updatedPhp);
  assert.equal(changed.size,101,"Expected 100 runtime files plus PHP manifest");
  return {current:prevVersion,next:nextVersion,files:changed,pins};
}

function safeLocalPath(root,path){
  const full=resolve(root,path),rel=relative(root,full);
  assert.ok(!isAbsolute(rel)&&rel!==""&&!rel.startsWith(".."+sep)&&rel!=="..",
    "Refusing path outside repository");
  const stat=lstatSync(full);
  assert.ok(stat.isFile()&&!stat.isSymbolicLink(),"Refusing symlink/nonfile: "+path);
  return full;
}

export function loadReleaseFiles(root=ROOT){
  const php=readFileSync(safeLocalPath(root,"functions.php"),"utf8");
  const paths=parseReleaseManifest(php);
  const files=new Map([["functions.php",php]]);
  for(const path of paths)
    files.set(path,readFileSync(safeLocalPath(root,path),"utf8"));
  return files;
}

export function parseCli(argv){
  assert.ok(Array.isArray(argv),"Invalid arguments");
  assert.ok(argv.length===2||argv.length===3,
    "Usage: node scripts/prepare-theme-release.mjs --to X.Y.Z [--apply]");
  assert.equal(argv[0],"--to","Release number required");
  assert.ok(/^\d+\.\d+\.\d+$/.test(argv[1]),"Invalid version");
  assert.ok(argv.length===2||argv[2]==="--apply","Unsupported argument");
  return {to:argv[1],apply:argv.length===3};
}

function git(...args){
  return execFileSync("git",args,{cwd:ROOT,encoding:"utf8",timeout:20000,
    stdio:["ignore","pipe","pipe"]}).trim();
}

export function applyRelease(plan,root=ROOT,readGit=git){
  assert.ok(plan?.files instanceof Map && plan.files.size===101,
    "Only fully planned releases may be applied");
  const branch=readGit("symbolic-ref","--quiet","--short","HEAD");
  assert.ok(branch.startsWith("release/"),
    "Apply only from a dedicated release/* branch, never main/dev");
  assert.equal(readGit("status","--porcelain"),"",
    "Dirty working tree; commit/review existing changes before restamping");
  const original=new Map();
  for(const [path] of plan.files)
    original.set(path,readFileSync(safeLocalPath(root,path),"utf8"));
  // Recheck every file before writing; no partial preparation if checkout drifted.
  const latest=loadReleaseFiles(root);
  const check=planRelease(latest,plan.next);
  for(const [path,newText] of check.files)
    assert.equal(plan.files.get(path),newText,"Plan changed underfoot: "+path);
  const written=[];
  try{
    for(const [path,content] of plan.files){
      writeFileSync(safeLocalPath(root,path),content,"utf8");
      written.push(path);
    }
  }catch(error){
    for(const path of written.reverse())writeFileSync(safeLocalPath(root,path),original.get(path),"utf8");
    throw error;
  }
  return {status:"staged_for_git_review_only",changed:written.length,branch};
}

export function main(argv=process.argv.slice(2)){
  const options=parseCli(argv),files=loadReleaseFiles(),plan=planRelease(files,options.to);
  const result=options.apply?applyRelease(plan):{status:"dry_run_no_writes",changed:plan.files.size};
  return {from:plan.current,to:plan.next,...result,
    criticalGitPinsRecomputed:CRITICAL_FILES.length,
    wordpressDeployed:false,productionVerified:false};
}

if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{console.log("ZP_THEME_RELEASE_PLAN "+JSON.stringify(main()));}
  catch(error){
    console.error("ZP_THEME_RELEASE_REFUSED "+error.message);
    process.exitCode=1;
  }
}
