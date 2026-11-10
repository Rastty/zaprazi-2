import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const sitemap=read("src/seo/https-sitemaps.php");
const care=read("page-jak-vybrat-pecovatelskou-sluzbu.php");
const hospital=read("page-navrat-z-nemocnice.php");

test("Only two materially edited care URLs gain 2026-11-10 sitemap dates",()=>{
  assert.ok(care.includes('id="pece-o-rodice-pri-praci"'));
  assert.ok(hospital.includes("home_url( '/jak-vybrat-pecovatelskou-sluzbu/#pece-o-rodice-pri-praci' )"));
  assert.match(sitemap,/'jak-vybrat-pecovatelskou-sluzbu'\s*=>\s*'2026-11-10T00:00:00\+00:00'/);
  assert.match(sitemap,/'navrat-z-nemocnice'\s*=>\s*'2026-11-10T00:00:00\+00:00'/);
  const code=[
    "define('ABSPATH','/');",
    "function add_filter($name,$callback,$priority=10,$accepted=1){}",
    "require 'src/seo/https-sitemaps.php';",
    "$cases=[",
    "['slug'=>'jak-vybrat-pecovatelskou-sluzbu','mod'=>'2026-10-01','loc'=>'https://zaprazi.cz/jak-vybrat-pecovatelskou-sluzbu/','status'=>'publish','kind'=>'page'],",
    "['slug'=>'navrat-z-nemocnice','mod'=>'2026-11-09','loc'=>'https://zaprazi.cz/navrat-z-nemocnice/','status'=>'publish','kind'=>'page'],",
    "['slug'=>'jak-vybrat-pecovatelskou-sluzbu','mod'=>'2026-11-11','loc'=>'https://zaprazi.cz/jak-vybrat-pecovatelskou-sluzbu/','status'=>'publish','kind'=>'page'],",
    "['slug'=>'navrat-z-nemocnice','mod'=>'2026-10-01','loc'=>'https://example.org/navrat-z-nemocnice/','status'=>'publish','kind'=>'page'],",
    "['slug'=>'navrat-z-nemocnice','mod'=>'2026-10-01','loc'=>'https://zaprazi.cz/navrat-z-nemocnice/','status'=>'draft','kind'=>'page'],",
    "['slug'=>'navrat-z-nemocnice','mod'=>'2026-10-01','loc'=>'https://zaprazi.cz/navrat-z-nemocnice/','status'=>'publish','kind'=>'post'],",
    "['slug'=>'unrelated-guide','mod'=>'2026-10-01','loc'=>'https://zaprazi.cz/unrelated-guide/','status'=>'publish','kind'=>'page'],",
    "];",
    "$out=[];",
    "foreach($cases as $case){",
    "  $entry=['loc'=>$case['loc'],'mod'=>$case['mod']];",
    "  $post=(object)['post_type'=>$case['kind'],'post_status'=>$case['status'],'post_name'=>$case['slug']];",
    "  $out[]=zaprazi_2_https_sitemap_entry($entry,'post',$post);",
    "}",
    "echo json_encode($out);"
  ].join("\n");
  const result=JSON.parse(execFileSync("php",["-r",code],{
    cwd:new URL("../",import.meta.url).pathname,encoding:"utf8"
  }));
  assert.equal(result.length,7);
  assert.equal(result[0].mod,"2026-11-10T00:00:00+00:00");
  assert.equal(result[1].mod,"2026-11-10T00:00:00+00:00");
  assert.equal(result[2].mod,"2026-11-11","Never overwrite newer WordPress edit");
  assert.equal(result[3].mod,"2026-10-01","Foreign site must not inherit Zápraží date");
  assert.equal(result[4].mod,"2026-10-01","Draft must not inherit published date");
  assert.equal(result[5].mod,"2026-10-01","Legacy post must not inherit page date");
  assert.equal(result[6].mod,"2026-10-01","Unrelated page date must be unchanged");
  assert.ok(result.every(row=>!("lastmod" in row)),"Yoast uses mod, not lastmod");
});
