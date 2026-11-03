import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root=new URL("../",import.meta.url);
const template=readFileSync(new URL("page-choditko-do-bytu-pro-seniory.php",root),"utf8");
const manuals=[
  "https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_ctyrbodove.pdf",
  "https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_dvoukolove.pdf"
];
test("WA17/WA21 landing has explicit source-backed model weight transparency, not a buy shortcut",()=>{
 const start=template.indexOf("WA17 vs. WA21: hlavní rozdíl.");
 const end=template.indexOf('id="zp-pruchod-choditko-byt"',start);
 assert.ok(start>0&&end>start);
 const section=template.slice(start,end);
 assert.match(section,/data-zp-besco-weight-sources="WA17,WA21"/);
 for(const word of ["2,3 kg","2,8 kg","2,2 a 2,7 kg","Podklady porovnány 3. 11. 2026",
                   "ověřte si konkrétní provedení před pořízením"])
   assert.ok(section.includes(word),"Missing provenance fact or safe guidance: "+word);
 for(const url of manuals){
   assert.ok(section.includes('href="'+url+'" target="_blank" rel="noopener noreferrer"'),
      "Source manual must be a safe exact HTTPS link: "+url);
   assert.equal(section.split(url).length-1,1,"Do not duplicate source manual");
 }
 assert.doesNotMatch(section,/data-zp-merchant-link|data-zp-affiliate-target|data-zp-offer|<form\b|gtag\(|localStorage|sessionStorage/i);
 assert.ok(section.indexOf("Odkud pochází hmotnost") < section.indexOf("Pozor na úzké dveře"));
});
test("WordPress PHP template produces the exact two source links without leaking visitor answers",()=>{
 const stub=[
   "function get_header(){}","function get_footer(){}",
   'function home_url($p=""){return "https://zaprazi.cz".$p;}',
   'function esc_url($u){return htmlspecialchars($u,ENT_QUOTES,"UTF-8");}',
   'include "page-choditko-do-bytu-pro-seniory.php";'
 ].join("\n");
 const html=execFileSync("php",["-r",stub],{
   cwd:fileURLToPath(root),encoding:"utf8",maxBuffer:2_000_000
 });
 assert.match(html,/data-zp-besco-weight-sources="WA17,WA21"/);
 for(const url of manuals) assert.ok(html.includes('href="'+url+'"'));
 assert.doesNotMatch(html,/besco_skladaci_choditko_[^"]+\.pdf\?/);
});
