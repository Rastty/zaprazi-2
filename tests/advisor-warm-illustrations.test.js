import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const pages=[
 ["page-choditka-pro-seniory.php","chuze-s-oporou.svg","Chodítka pro seniory"],
 ["page-koupelna-a-wc.php","koupelna-s-jistotou.svg","Pomůcky do koupelny"],
 ["page-sobestacnost.php","sobestacnost-u-stolu.svg","Pomůcky pro sebeobsluhu"]
];
for(const [name,img,h1Text] of pages){
 test("First-party contextual illustration on "+name,()=>{
  const php=read(name),svg=read("assets/illustrations/"+img);
  assert.equal((php.match(/<h1\b/g)||[]).length,1);
  assert.ok(php.includes(h1Text),"original H1 missing");
  assert.match(php,/class="zp-hero zp-illustrated-hero"/);
  assert.match(php,/class="zp-wrap zp-hero-layout"/);
  assert.equal((php.match(/class="zp-hero-art"/g)||[]).length,1);
  assert.ok(php.includes("'/assets/illustrations/"+img+"'"),"missing correct first-party image");
  assert.match(php,/width="720" height="510" decoding="async" loading="eager" fetchpriority="high"/);
  assert.ok(/alt="[^"]{45,}"/.test(php),"descriptive alt text missing");
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 510"'));
  assert.match(svg,/<title id="title">/);
  assert.match(svg,/<desc id="desc">/);
  assert.doesNotMatch(svg,/<script\b|<image\b|https?:\/\/|foreignObject|onload=/i);
  assert.match(php,/class="zp-hero-actions"/);
 });
}
test("Existing CSS supports mobile responsive hero and correct image intrinsic ratio",()=>{
 const css=read("style.css");
 assert.match(css,/\.zp-hero-layout\{display:grid/);
 assert.match(css,/@media\(max-width:820px\)/);
 assert.match(css,/\.zp-hero-art img\{display:block;width:100%;height:auto/);
});
