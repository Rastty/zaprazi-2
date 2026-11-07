import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root=fileURLToPath(new URL("../",import.meta.url));
const template=readFileSync(new URL("../page-choditko-na-pojistovnu.php",import.meta.url),"utf8");
const render=(date)=>execFileSync("php",["-r",[
  'function current_time($format) { return getenv("ZP_TEST_DATE"); }',
  'function get_header() {}',
  'function get_footer() {}',
  'function home_url($path="") { return "https://zaprazi.cz".$path; }',
  'function esc_url($url) { return htmlspecialchars($url, ENT_QUOTES, "UTF-8"); }',
  'include "page-choditko-na-pojistovnu.php";'
].join("\n")],{cwd:root,env:{...process.env,ZP_TEST_DATE:date},encoding:"utf8"});

test("High-intent insurance answer appears immediately after the hero and before stale historical amount",()=>{
  const first=template.indexOf('id="rychla-cesta-na-epoukaz"');
  const hero=template.indexOf('<section class="zp-hero">');
  const previousEnd=template.indexOf("</section>",hero);
  const historical=template.indexOf('class="zp-grid zp-resource-summary"');
  const detail=template.indexOf('id="postup"');
  assert.ok(hero>=0&&previousEnd<first&&first<historical&&historical<detail);
  assert.equal((template.match(/id="rychla-cesta-na-epoukaz"/g)||[]).length,1);
  assert.match(template,/aria-labelledby="rychla-cesta-na-epoukaz-nadpis"/);
  assert.match(template,/id="rychla-cesta-na-epoukaz-nadpis"/);
  const summary=template.slice(first,historical);
  assert.match(summary,/Jak získat chodítko na pojišťovnu/);
  assert.match(summary,/Ověřte bezpečný typ pomůcky/);
  assert.match(summary,/Zeptejte se předepisujícího lékaře na možnost ePoukazu/);
  assert.match(summary,/U oprávněného výdejce ověřte přesný model/);
  assert.match(summary,/Neplaťte předem v očekávání zpětného proplacení/);
  assert.match(summary,/ověřeno 7\. 11\. 2026/);
  assert.doesNotMatch(summary,/\b\d[\d\s]*Kč\b|data-zp-offer|data-zp-merchant-link|affiliateMap|sessionStorage|localStorage|fetch\(/i);
});
test("Rendered November quick answer leads to safe existing internal paths and official source only",()=>{
  const html=render("2026-11-07");
  const first=html.indexOf('id="rychla-cesta-na-epoukaz"');
  const next=html.indexOf('class="zp-grid zp-resource-summary"',first);
  const summary=html.slice(first,next);
  for(const href of [
    "https://zaprazi.cz/#poradce",
    "#postup",
    "#zp-overit-mesicni-seznam",
    "https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka"
  ]) assert.ok(summary.includes('href="'+href+'"'),"Missing safe action: "+href);
  assert.ok(html.includes('id="postup"'));
  assert.ok(html.includes('id="zp-overit-mesicni-seznam"'));
  assert.match(summary,/target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(summary,/(?:[?&](?:answer|diagnosis|health|patient)=)|<form\b|data-zp-journey="advisor"|data-zp-merchant-link/i);
  assert.match(html,/Historická úhrada v říjnovém seznamu/);
  assert.doesNotMatch(html,/Úhrada v aktuálním říjnovém seznamu/);
});
