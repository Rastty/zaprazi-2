import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("0.8.211: first-screen answer explains the right bed decision without an unsafe shortcut",()=>{
  const php=read("page-senior-nemuze-vstat-z-postele.php");
  const hero=php.match(/<section class="zp-hero">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero,"Missing bed decision hero");
  const answer=hero.match(/<p class="zp-muted-copy"><strong>Rychlá odpověď:<\/strong>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(answer,"First-screen question should have a direct visible answer");
  for(const phrase of [
    "nedokáže posadit","zvednout ze sedu","náhlém zhoršení",
    "nezkoušejte zvedat silou","odborníkem"
  ])assert.ok(answer.includes(phrase),"Missing safety or decision distinction: "+phrase);
  for(const anchor of ["rozhodnuti-vstavani-postel","kontroly-postele"]){
    assert.equal((answer.match(new RegExp('href="#'+anchor+'"',"g"))||[]).length,1,
      "Quick answer must have one safe next-step anchor");
    assert.equal((php.match(new RegExp('id="'+anchor+'"',"g"))||[]).length,1,
      "Linked on-page next step must exist exactly once");
  }
  assert.equal((php.match(/<h1>/g)||[]).length,1,"Single original H1 preserved");
  assert.doesNotMatch(answer,/data-zp-merchant-link|data-zp-offer|affiliateMap|<form\b|name="health"|href="https?:/);
  const version=read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)$/m)?.[1];
  assert.match(version ?? "", /^\d+\.\d+\.\d+$/, "Theme release must be valid semver");
  const [major, minor, patch] = version.split(".").map(Number);
  assert.ok(major > 0 || minor > 8 || (minor === 8 && patch >= 211),
    "Bed first-answer guarantee is required from release 0.8.211 onward");
  assert.ok(php.includes("ZP_RELEASE_"+version.replaceAll(".","_")));
});

test("0.8.211: material date applies only to published exact-site bed guide",()=>{
  const code=[
    "define('ABSPATH','/');",
    "function add_filter($name,$callback,$priority=10,$accepted=1){}",
    "require 'src/seo/https-sitemaps.php';",
    "$post=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'senior-nemuze-vstat-z-postele'];",
    "$entry=['loc'=>'https://zaprazi.cz/senior-nemuze-vstat-z-postele/','mod'=>'2026-10-25'];",
    "$same=zaprazi_2_https_sitemap_entry($entry,'post',$post);",
    "$newer=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/senior-nemuze-vstat-z-postele/','mod'=>'2026-11-10'],'post',$post);",
    "$foreign=zaprazi_2_https_sitemap_entry(['loc'=>'https://example.org/senior-nemuze-vstat-z-postele/','mod'=>'2026-10-25'],'post',$post);",
    "$draft=zaprazi_2_https_sitemap_entry($entry,'post',(object)['post_type'=>'page','post_status'=>'draft','post_name'=>'senior-nemuze-vstat-z-postele']);",
    "echo json_encode(compact('same','newer','foreign','draft'));"
  ].join("\n");
  const data=JSON.parse(execFileSync("php",["-r",code],{
    cwd:new URL("../",import.meta.url).pathname,encoding:"utf8"
  }));
  assert.equal(data.same.mod,"2026-11-09T00:00:00+00:00");
  assert.equal(data.newer.mod,"2026-11-10","Never overwrite newer material WordPress edits");
  assert.equal(data.foreign.mod,"2026-10-25");
  assert.equal(data.draft.mod,"2026-10-25");
});
