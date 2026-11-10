import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const source=read("src/seo/https-sitemaps.php");
const pages=["rollator-pro-seniory","choditka-pro-seniory","choditko-na-pojistovnu"];

test("0.8.213 dates match three actual material mobility edits, not arbitrary pages",()=>{
  for(const slug of pages)
    assert.ok(source.includes("\x27"+slug+"\x27 => \x272026-11-10T00:00:00+00:00\x27"),
      "Material sitemap date missing: "+slug);
  assert.ok(source.includes("\x27pujceni-choditka\x27 => \x272026-11-09T00:00:00+00:00\x27"),
    "Do not stamp an unrelated older rental edit");
  assert.ok(read("page-rollator-pro-seniory.php").includes(\x27id="rollator-uzke-dvere"\x27));
  assert.ok(read("page-choditka-pro-seniory.php").includes("/rollator-pro-seniory/#rollator-uzke-dvere"));
  assert.ok(read("page-choditko-na-pojistovnu.php").includes("/rollator-pro-seniory/#rollator-uzke-dvere"));
  const cases=[
    ["rollator-pro-seniory","2026-10-01","https://zaprazi.cz/rollator-pro-seniory/","publish","page"],
    ["choditka-pro-seniory","2026-11-09","https://zaprazi.cz/choditka-pro-seniory/","publish","page"],
    ["choditko-na-pojistovnu","2026-11-09","https://zaprazi.cz/choditko-na-pojistovnu/","publish","page"],
    ["rollator-pro-seniory","2026-11-11","https://zaprazi.cz/rollator-pro-seniory/","publish","page"],
    ["rollator-pro-seniory","2026-10-01","https://another.example/rollator-pro-seniory/","publish","page"],
    ["rollator-pro-seniory","2026-10-01","https://zaprazi.cz/rollator-pro-seniory/","draft","page"],
    ["rollator-pro-seniory","2026-10-01","https://zaprazi.cz/rollator-pro-seniory/","publish","post"],
    ["not-an-edited-guide","2026-10-01","https://zaprazi.cz/not-an-edited-guide/","publish","page"],
    ["pujceni-choditka","2026-11-09","https://zaprazi.cz/pujceni-choditka/","publish","page"]
  ];
  const php=[
    "define(\x27ABSPATH\x27,\x27/\x27);",
    "function add_filter($name,$callback,$priority=10,$accepted=1){}",
    "require \x27src/seo/https-sitemaps.php\x27;",
    "$cases="+JSON.stringify(cases)+";",
    "$out=[]; foreach($cases as $case){",
    "  $entry=[\x27loc\x27=>$case[2],\x27mod\x27=>$case[1]];",
    "  $post=(object)[\x27post_name\x27=>$case[0],\x27post_status\x27=>$case[3],\x27post_type\x27=>$case[4]];",
    "  $out[]=zaprazi_2_https_sitemap_entry($entry,\x27post\x27,$post);",
    "} echo json_encode($out);"
  ].join("\n");
  const result=JSON.parse(execFileSync("php",["-r",php],{
    cwd:new URL("../",import.meta.url).pathname,encoding:"utf8"}));
  assert.equal(result.length,cases.length);
  for(const i of [0,1,2]) assert.equal(result[i].mod,"2026-11-10T00:00:00+00:00");
  for(const i of [3,4,5,6,7,8]) assert.equal(result[i].mod,cases[i][1],
    "Do not overwrite newer, foreign, draft, post, unrelated or dated rental record");
  assert.ok(result.every(r=>!("lastmod" in r)),"Yoast uses mod, not lastmod");
});
