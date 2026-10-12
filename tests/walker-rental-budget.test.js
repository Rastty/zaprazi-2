import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("rental planner uses only sourced monthly prices and stops when evidence is stale",()=>{
  const page=read("page-pujceni-choditka.php");
  const fn=read("functions.php");
  assert.match(page,/id="rozpocet-pujceni-choditka"/);
  assert.match(page,/<\?php if \( \$zp_rental_is_fresh \) : \?>/);
  assert.match(page,/Přepočet není k dispozici/);
  assert.match(page,/6\. 10\. 2026/);
  assert.match(page,/data-monthly-price="360"/);
  assert.match(page,/data-monthly-price="300"/);
  assert.match(page,/data-monthly-price="600"/);
  assert.match(page,/Vratná kauce, doprava/);
  assert.ok(page.includes("https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek"));
  assert.ok(page.includes("https://www.meyra.cz/cenik-meyra.html"));
  assert.match(fn,/function zaprazi_2_walker_rental_budget_asset/);
  assert.match(fn,/is_page\( 'pujceni-choditka' \)/);
  assert.match(fn,/assets\/js\/walker-rental-budget\.js/);
});

test("rental budget arithmetic, alternative plans, safe invalid state and local privacy",()=>{
  const source=read("assets/js/walker-rental-budget.js");
  const css=read("style.css"),release=css.split("\n").find(l=>l.startsWith("Version: "))?.slice(9).trim();
  assert.ok(release&&source.includes("ZP_RELEASE_"+release.replaceAll(".","_")),"JS version not aligned with theme");
  for(const bad of [/\bfetch\s*\(/,/\bXMLHttpRequest\b/,/navigator\.sendBeacon/,/\blocalStorage\b/,/\bsessionStorage\b/,/document\.cookie/,/\bFormData\b/,/\blocation\.href/,/affiliateMap|merchant_click|zaprazi:analytics/])
    assert.doesNotMatch(source,bad,"Rental planner cannot send or persist personal data");
  const events={};
  const opt={dataset:{monthlyPrice:"360",provider:"RehaKomp",model:"Čtyřkolové venkovní chodítko"}};
  const model={selectedOptions:[opt],addEventListener:(name,fn)=>{events["model."+name]=fn}};
  const months={value:"1",addEventListener:(name,fn)=>{events["months."+name]=fn}};
  const output={children:[],replaceChildren(...children){this.children=children}};
  const form={hidden:true,querySelector:(selector)=>({
    "#zp-rental-budget-model":model,"#zp-rental-budget-months":months,
    "#zp-rental-budget-result":output
  })[selector],addEventListener:(name,fn)=>{events["form."+name]=fn}};
  const document={
    querySelector:s=>s==="#zp-walker-rental-budget"?form:null,
    createTextNode:s=>({textContent:s}),
    createElement:tag=>({tag,textContent:""})
  };
  vm.runInNewContext(source,{document,Intl,Number});
  assert.equal(form.hidden,false);
  const joined=()=>output.children.map(c=>c.textContent).join("").replaceAll(/\s/g,"");
  assert.ok(joined().includes("360Kč"),"1-month rental estimate should be 360 Kč");
  assert.match(output.children.map(c=>c.textContent).join(""),/Vratná kauce/);
  months.value="3";events["months.change"]();
  assert.ok(joined().includes("1080Kč"),"3 months at 360 = 1080 Kč");
  model.selectedOptions=[{dataset:{monthlyPrice:"600",provider:"MEYRA",model:"Chodítko"}}];
  months.value="6";events["model.change"]();
  assert.ok(joined().includes("3600Kč"),"6 months at 600 = 3600 Kč");
  let prevented=false;events["form.submit"]({preventDefault:()=>{prevented=true}});
  assert.equal(prevented,true,"Rental planner must never submit a form");
  months.value="500";events["months.change"]();
  assert.match(joined(),/Přepočetnenídostupný/);
});

test("planner is usable with mobile width and keeps the original rental and insurance guides",()=>{
  const css=read("style.css"),page=read("page-pujceni-choditka.php");
  assert.match(css,/\.zp-rental-budget-fields/);
  assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
  assert.match(page,/\/choditka-pro-seniory\//);
  assert.match(page,/\/choditko-na-pojistovnu\//);
  assert.match(page,/id="ceny"/);
  assert.match(page,/type="submit" class="zp-btn">Spočítat orientační půjčovné/);
});
