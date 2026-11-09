import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("0.8.212: transport first screen directly distinguishes paid, ordinary and emergency transport",()=>{
  const page=read("page-prevoz-seniora-k-lekari.php");
  const hero=page.match(/<section class="zp-hero">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero,"Transport guide must render exactly one visible first screen");
  const answers=[...hero.matchAll(/<p class="zp-muted-copy">([\s\S]*?)<\/p>/g)]
    .map(x=>x[1]).filter(x=>x.includes("Rychlá odpověď:"));
  assert.equal(answers.length,1,"Exactly one transport first answer");
  const answer=answers[0];
  for(const required of [
    "Sanitku hrazenou zdravotní pojišťovnou","zdravotní stav",
    "ošetřující lékař","Příkaz ke zdravotnímu transportu",
    "cestu zpět","běžná doprava bezpečná","volejte 155"
  ])assert.ok(answer.includes(required),"Missing safety/decision criterion: "+required);
  for(const anchor of ["vyber-dopravy","otazky-pro-lekare"]){
    assert.equal((answer.match(new RegExp('href="#'+anchor+'"',"g"))||[]).length,1);
    assert.equal((page.match(new RegExp('id="'+anchor+'"',"g"))||[]).length,1,
      "All first-answer actions must lead to one real decision or doctor checklist");
  }
  assert.doesNotMatch(answer,/data-zp-offer|data-zp-merchant-link|data-zp-affiliate|<form\b|name="health"|https?:\/\//i);
  assert.equal((hero.match(/<h1>/g)||[]).length,1);
  assert.match(page,/https:\/\/www\.vzp\.cz\//,"Public VZP evidence must remain linked");
  assert.match(page,/https:\/\/www\.nzip\.cz\//,"Public NZIP evidence must remain linked");
  assert.match(page,/zdroje VZP a NZIP znovu ověřeny 9\. 11\. 2026/);
  assert.match(read("style.css"),/^Version:\s*0\.8\.212$/m);
  assert.ok(page.includes("ZP_RELEASE_0_8_212"));
});

test("0.8.212: Yoast latest meaningful edit only for exact published transport URL",()=>{
  const php=[
    "define('ABSPATH','/');",
    "function add_filter($name,$cb,$priority=10,$args=1){}",
    "require 'src/seo/https-sitemaps.php';",
    "$post=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'prevoz-seniora-k-lekari'];",
    "$before=['loc'=>'https://zaprazi.cz/prevoz-seniora-k-lekari/','mod'=>'2026-10-28'];",
    "$same=zaprazi_2_https_sitemap_entry($before,'post',$post);",
    "$newer=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/prevoz-seniora-k-lekari/','mod'=>'2026-11-10'],'post',$post);",
    "$other=zaprazi_2_https_sitemap_entry(['loc'=>'https://other.example/prevoz-seniora-k-lekari/','mod'=>'2026-10-28'],'post',$post);",
    "$draft=zaprazi_2_https_sitemap_entry($before,'post',(object)['post_type'=>'page','post_status'=>'draft','post_name'=>'prevoz-seniora-k-lekari']);",
    "echo json_encode(compact('same','newer','other','draft'));"
  ].join("\n");
  const result=JSON.parse(execFileSync("php",["-r",php],{
    cwd:new URL("../",import.meta.url).pathname,encoding:"utf8"
  }));
  assert.equal(result.same.mod,"2026-11-09T00:00:00+00:00");
  assert.equal(result.newer.mod,"2026-11-10");
  assert.equal(result.other.mod,"2026-10-28");
  assert.equal(result.draft.mod,"2026-10-28");
});
