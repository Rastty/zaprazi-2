import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";

const root=new URL("../",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");

test("Indexed parent pages expose plain crawlable, context-relevant links to two discovered guides",()=>{
  const home=read("front-page.php"),bathroom=read("page-koupelna-a-wc.php");
  const hub=read("page-kompenzacni-pomucky-pro-seniory.php");
  const targets=[
    [home,"/co-zmerit-pred-vyberem-choditka/", "Sedm věcí"],
    [home,"/sprchovaci-zidle-pro-seniory/", "Co ověřit před výběrem"],
    [bathroom,"/sprchovaci-zidle-pro-seniory/", "stabilita, rozměry a přesun"],
    [hub,"/co-zmerit-pred-vyberem-choditka/", "změřte doma průchody"]
  ];
  for(const [source,url,anchor] of targets){
    assert.ok(source.includes("home_url( '"+url+"' )"),url+" must be an ordinary server-side link");
    assert.ok(source.includes(anchor),"Contextual descriptive anchor "+url);
  }
  const version=read("style.css").match(/^Version:\s*([0-9]+[.][0-9]+[.][0-9]+)$/m)?.[1];
  assert.ok(version,"Release version missing");
  const marker="ZP_RELEASE_"+version.replaceAll(".","_");
  for(const path of ["front-page.php","page-koupelna-a-wc.php","page-kompenzacni-pomucky-pro-seniory.php"])
    assert.ok(read(path).includes(marker),path+" release marker out of sync");
  assert.equal((home.match(/<h1>/g)||[]).length,1);
  assert.doesNotMatch(home,/data-zp-affiliate-link|data-zp-merchant-link/);
});

test("Only four genuinely changed page types receive bounded sitemap lastmod signal",()=>{
  const code=[
    "define('ABSPATH','/');",
    "$registered=[];",
    "function add_filter($name,$cb,$priority=10,$args=1){global $registered;$registered[$name]=[$cb,$priority,$args];}",
    "require 'src/seo/https-sitemaps.php';",
    "$before=['loc'=>'http://zaprazi.cz/pujceni-choditka/','mod'=>'2026-10-02T10:00:00+00:00'];",
    "$rent=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'pujceni-choditka'];",
    "$r1=zaprazi_2_https_sitemap_entry($before,'post',$rent);",
    "$r2=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/pujceni-choditka/','mod'=>'2026-11-10T12:00:00+00:00'],'post',$rent);",
    "$unrelated=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'senior-malo-pije'];",
    "$r3=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/senior-malo-pije/','mod'=>'2026-10-01'],'post',$unrelated);",
    "$draft=(object)['post_type'=>'page','post_status'=>'draft','post_name'=>'pujceni-choditka'];",
    "$r4=zaprazi_2_https_sitemap_entry($before,'post',$draft);",
    "$r5=zaprazi_2_https_sitemap_entry(['loc'=>'https://other.example/pujceni-choditka/','mod'=>'2026-10-01'],'post',$rent);",
    "$r6=zaprazi_2_https_sitemap_entry($before,'taxonomy',$rent);",
    "$measured=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'co-zmerit-pred-vyberem-choditka'];",
    "$walker=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'choditka-pro-seniory'];",
    "$r7=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/co-zmerit-pred-vyberem-choditka/','mod'=>'2026-10-01'],'post',$measured);",
    "$r8=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/choditka-pro-seniory/','mod'=>'2026-10-01'],'post',$walker);",
    "$dates=zaprazi_2_material_sitemap_page_dates();",
    "echo json_encode(compact('registered','r1','r2','r3','r4','r5','r6','r7','r8','dates'));"
  ].join("\n");
  const x=JSON.parse(execFileSync("php",["-r",code],{
    cwd:root.pathname,encoding:"utf8"
  }));
  assert.equal(x.registered.wpseo_sitemap_entry[2],3);
  assert.equal(x.r1.loc,"https://zaprazi.cz/pujceni-choditka/");
  assert.equal(x.r1.mod,"2026-11-09T00:00:00+00:00");
  assert.ok(!Object.hasOwn(x.r1,"lastmod"),"Yoast renderer consumes mod, not lastmod");
  // Yoast's sitemap_url() translates internal 'mod' to the public XML
  // <lastmod>; a plausible-looking 'lastmod' array field is ignored.
  const renderedDate=entry=>entry.mod?new Date(entry.mod).toISOString().slice(0,10):null;
  assert.equal(renderedDate(x.r1),"2026-11-09");
  assert.equal(renderedDate(x.r2),"2026-11-10");
  assert.equal(renderedDate(x.r3),"2026-10-01");
  assert.equal(x.r2.mod,"2026-11-10T12:00:00+00:00");
  assert.equal(x.r3.mod,"2026-10-01");
  assert.equal(x.r4.mod,"2026-10-02T10:00:00+00:00");
  assert.equal(x.r5.mod,"2026-10-01");
  assert.equal(x.r6.mod,"2026-10-02T10:00:00+00:00");
  assert.equal(x.r7.mod,"2026-11-08T00:00:00+00:00");
  assert.equal(x.r8.mod,"2026-11-09T00:00:00+00:00");
  assert.deepEqual(Object.keys(x.dates).sort(),[
    "pujceni-choditka","choditko-na-pojistovnu","koupelna-a-wc",
    "kompenzacni-pomucky-pro-seniory","co-zmerit-pred-vyberem-choditka",
    "choditka-pro-seniory"].sort());
});
