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
  for(const path of ["front-page.php","page-koupelna-a-wc.php","page-kompenzacni-pomucky-pro-seniory.php"])
    assert.match(read(path),/ZP_RELEASE_0_8_205/);
  assert.equal((home.match(/<h1>/g)||[]).length,1);
  assert.doesNotMatch(home,/data-zp-affiliate-link|data-zp-merchant-link/);
});

test("Only four genuinely changed page types receive bounded sitemap lastmod signal",()=>{
  const code=[
    "define('ABSPATH','/');",
    "$registered=[];",
    "function add_filter($name,$cb,$priority=10,$args=1){global $registered;$registered[$name]=[$cb,$priority,$args];}",
    "require 'src/seo/https-sitemaps.php';",
    "$before=['loc'=>'http://zaprazi.cz/pujceni-choditka/','lastmod'=>'2026-10-02T10:00:00+00:00'];",
    "$rent=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'pujceni-choditka'];",
    "$r1=zaprazi_2_https_sitemap_entry($before,'post',$rent);",
    "$r2=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/pujceni-choditka/','lastmod'=>'2026-11-10T12:00:00+00:00'],'post',$rent);",
    "$unrelated=(object)['post_type'=>'page','post_status'=>'publish','post_name'=>'co-zmerit-pred-vyberem-choditka'];",
    "$r3=zaprazi_2_https_sitemap_entry(['loc'=>'https://zaprazi.cz/co-zmerit-pred-vyberem-choditka/','lastmod'=>'2026-10-01'],'post',$unrelated);",
    "$draft=(object)['post_type'=>'page','post_status'=>'draft','post_name'=>'pujceni-choditka'];",
    "$r4=zaprazi_2_https_sitemap_entry($before,'post',$draft);",
    "$r5=zaprazi_2_https_sitemap_entry(['loc'=>'https://other.example/pujceni-choditka/','lastmod'=>'2026-10-01'],'post',$rent);",
    "$r6=zaprazi_2_https_sitemap_entry($before,'taxonomy',$rent);",
    "$dates=zaprazi_2_material_sitemap_page_dates();",
    "echo json_encode(compact('registered','r1','r2','r3','r4','r5','r6','dates'));"
  ].join("\n");
  const x=JSON.parse(execFileSync("php",["-r",code],{
    cwd:root.pathname,encoding:"utf8"
  }));
  assert.equal(x.registered.wpseo_sitemap_entry[2],3);
  assert.equal(x.r1.loc,"https://zaprazi.cz/pujceni-choditka/");
  assert.equal(x.r1.lastmod,"2026-11-09T00:00:00+00:00");
  assert.equal(x.r2.lastmod,"2026-11-10T12:00:00+00:00");
  assert.equal(x.r3.lastmod,"2026-10-01");
  assert.equal(x.r4.lastmod,"2026-10-02T10:00:00+00:00");
  assert.equal(x.r5.lastmod,"2026-10-01");
  assert.equal(x.r6.lastmod,"2026-10-02T10:00:00+00:00");
  assert.deepEqual(Object.keys(x.dates).sort(),[
    "pujceni-choditka","choditko-na-pojistovnu","koupelna-a-wc",
    "kompenzacni-pomucky-pro-seniory"].sort());
});
