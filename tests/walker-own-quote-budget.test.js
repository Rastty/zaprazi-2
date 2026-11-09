import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import vm from "node:vm";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const renderAt=date=>execFileSync("php",["-r",[
  'function current_time($format) { return getenv("ZP_TEST_DATE"); }',
  'function get_header() {}',
  'function get_footer() {}',
  'function home_url($path = "") { return "https://example.test" . $path; }',
  'function esc_url($url) { return htmlspecialchars($url, ENT_QUOTES, "UTF-8"); }',
  'include "page-pujceni-choditka.php";'
].join("\n")],{cwd:fileURLToPath(new URL("../",import.meta.url)),
  env:{...process.env,ZP_TEST_DATE:date},encoding:"utf8"});

test("user-entered quote is available before and after editorial price evidence expiry",()=>{
  for(const date of ["2026-12-09","2026-12-10"]){
    const html=renderAt(date);
    const section=html.slice(html.indexOf('<section id="rozpocet-pujceni-choditka"'),
      html.indexOf('<section class="zp-section">',html.indexOf('<section id="rozpocet-pujceni-choditka"')));
    assert.match(section,/id="zp-walker-own-quote-budget"/);
    assert.match(section,/id="zp-walker-own-quote-monthly" type="number"/);
    assert.match(section,/id="zp-walker-own-quote-result"/);
    assert.match(section,/type="submit" class="zp-btn">Spočítat z vlastní nabídky/);
    assert.match(section,/zadanou cenu nikam neodesíláme ani neukládáme/);
    assert.match(section,/výpočet neposuzuje zdravotní vhodnost/i);
    assert.doesNotMatch(section,/\baction="https?:/);
  }
  const fresh=renderAt("2026-12-09"),stale=renderAt("2026-12-10");
  assert.match(fresh,/id="zp-walker-rental-budget"/);
  assert.match(fresh,/data-monthly-price="360"/);
  assert.doesNotMatch(stale,/id="zp-walker-rental-budget"/);
  assert.doesNotMatch(stale,/data-monthly-price=/);
  assert.match(stale,/Přepočet není k dispozici:/);
  assert.match(stale,/historicky 360 Kč/);
  assert.match(stale,/id="zp-walker-own-quote-budget"/);
  assert.doesNotMatch(stale,/id="zp-walker-own-quote-monthly"[^>]*value=/,
    "Old rental rates must never be prefilled in the visitor quote");
});

test("own quote calculator is private, validates numbers, never submits and clears old estimate",()=>{
  const code=read("assets/js/walker-rental-budget.js");
  for(const forbidden of [/\bfetch\s*\(/,/XMLHttpRequest/,/sendBeacon/,/localStorage/,/sessionStorage/,
    /document\.cookie/,/\bFormData\b/,/window\.gtag/,/merchant_click/,/affiliateMap/]){
    assert.doesNotMatch(code,forbidden,"Calculator must not leak the visitor's price");
  }
  const events={};
  const monthly={value:"",addEventListener:(event,fn)=>events["price."+event]=fn};
  const months={value:"1",addEventListener:(event,fn)=>events["months."+event]=fn};
  const output={children:[],replaceChildren(...items){this.children=items;}};
  const ownForm={hidden:true,addEventListener:(event,fn)=>events["form."+event]=fn,
    querySelector:selector=>({
      "#zp-walker-own-quote-monthly":monthly,
      "#zp-walker-own-quote-months":months,
      "#zp-walker-own-quote-result":output
    })[selector]};
  const document={
    querySelector:selector=>selector==="#zp-walker-own-quote-budget"?ownForm:null,
    createElement:tag=>({tag,textContent:""}),
    createTextNode:textContent=>({textContent})
  };
  vm.runInNewContext(code,{document,Intl,Number,String});
  assert.equal(ownForm.hidden,false);
  let submitted=false;
  const submit=()=>events["form.submit"]({preventDefault:()=>{submitted=true;}});
  const rendered=()=>output.children.map(c=>c.textContent).join("").replaceAll(/\s/g,"");
  assert.match(rendered(),/Nicneodesíláme/);
  monthly.value="450"; months.value="3"; submit();
  assert.equal(submitted,true);
  assert.ok(rendered().includes("1350Kč"),"450 x 3 months = 1350 Kč");
  assert.match(rendered(),/kauci,dopravu/);
  monthly.value="500"; events["price.input"]();
  assert.doesNotMatch(rendered(),/1350Kč/,"Old result must be cleared immediately");
  months.value="6"; submit();
  assert.ok(rendered().includes("3000Kč"));
  for(const invalid of ["0","-5","1e2","12.5","100001","nan"," "]) {
    monthly.value=invalid;submit();
    assert.match(rendered(),/Nelzepřepočítat/,"Invalid monthly rate: "+invalid);
  }
  monthly.value="250";months.value="13";submit();
  assert.match(rendered(),/Nelzepřepočítat/);
  monthly.value="100000";months.value="6";submit();
  assert.ok(rendered().includes("600000Kč"),"Bounded high estimate should remain exact");
});

test("both rental modes use existing readable mobile fields and never create a new merchant gate",()=>{
  const php=read("page-pujceni-choditka.php");
  const css=read("style.css");
  assert.match(php,/id="zp-walker-own-quote-budget"[^>]*hidden/);
  assert.match(css,/\.zp-rental-budget-fields select,\.zp-rental-budget-fields input/);
  assert.match(css,/\.zp-rental-budget-result:not\(:empty\)/);
  assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
  assert.match(php,/\/choditka-pro-seniory\//);
  assert.match(php,/\/choditko-na-pojistovnu\//);
  const field=php.slice(php.indexOf('<form id="zp-walker-own-quote-budget"'),
    php.indexOf('</form>',php.indexOf('<form id="zp-walker-own-quote-budget"')));
  assert.doesNotMatch(field,/data-zp-offer|data-zp-merchant|affiliate|data-monthly-price|value="(300|360|600)"/i);
});
