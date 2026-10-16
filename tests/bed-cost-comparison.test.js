import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("bed acquisition offers optional decision calculator with source-safe cost inputs",()=>{
 const page=read("page-polohovaci-postel-na-pojistovnu.php");
 const hub=read("page-polohovaci-postel.php");
 const fn=read("functions.php");
 const css=read("style.css");
 assert.match(page,/id="porovnani-pujceni-postele"/);
 assert.match(page,/id="zp-bed-cost-comparison"[^>]*hidden/);
 for(const id of ["months","monthly","rental-extras","purchase","result"])
   assert.ok(page.includes('id="zp-bed-cost-'+id+'"'),"Missing accessible field "+id);
 assert.match(page,/vratná kauce není konečný náklad/);
 assert.match(page,/Nezahrnuje možnou úhradu pojišťovnou/);
 assert.match(page,/noscript/);
 assert.ok(hub.includes("home_url( '/polohovaci-postel-na-pojistovnu/#porovnani-pujceni-postele' )"));
 assert.match(fn,/function zaprazi_2_bed_cost_comparison_asset/);
 assert.match(fn,/is_page\( 'polohovaci-postel-na-pojistovnu' \)/);
 assert.match(fn,/assets\/js\/bed-cost-comparison\.js/);
 assert.match(css,/\.zp-rental-budget-fields select,\.zp-rental-budget-fields input/);
});

test("cost worksheet never persists, transmits, invents rates or logs health-related input",()=>{
 const src=read("assets/js/bed-cost-comparison.js");
 for(const forbidden of [/\bfetch\s*\(/,/\bXMLHttpRequest\b/,/sendBeacon/,
  /\blocalStorage\b/,/\bsessionStorage\b/,/document\.cookie/,
  /affiliateMap|merchant_click|zaprazi:analytics|dataLayer/,
  /\bconsole\./,/\binnerHTML\b/,/\bsubmit\(\)/])
  assert.doesNotMatch(src,forbidden,"Calculator must be local and data-minimal");
 assert.match(src,/ZP_RELEASE_0_8_139/);
 const code=src+"\nglobalThis.bedCalc=compareBedCosts;";
 const ctx={document:{querySelector:()=>null},Intl,Number};
 vm.runInNewContext(code,ctx);
 const calc=v=>JSON.parse(JSON.stringify(ctx.bedCalc(v)));
 assert.deepEqual(calc({months:"6",monthlyRent:"900",rentalExtras:"500",purchaseTotal:"12000"}),
  {months:6,rent:5900,buy:12000,difference:6100,cheaper:"rent"});
 assert.deepEqual(calc({months:"24",monthlyRent:"950",rentalExtras:"0",purchaseTotal:"15000"}),
  {months:24,rent:22800,buy:15000,difference:7800,cheaper:"buy"});
 assert.deepEqual(calc({months:"10",monthlyRent:"1000",rentalExtras:"0",purchaseTotal:"10000"}),
  {months:10,rent:10000,buy:10000,difference:0,cheaper:"equal"});
 for(const bad of [
  {months:"0",monthlyRent:"900",rentalExtras:"0",purchaseTotal:"11000"},
  {months:"61",monthlyRent:"900",rentalExtras:"0",purchaseTotal:"11000"},
  {months:"6.5",monthlyRent:"900",rentalExtras:"0",purchaseTotal:"11000"},
  {months:"6",monthlyRent:"-900",rentalExtras:"0",purchaseTotal:"11000"},
  {months:"6",monthlyRent:"900",rentalExtras:"",purchaseTotal:""},
  {months:"6",monthlyRent:"Infinity",rentalExtras:"0",purchaseTotal:"11000"},
  {months:"6",monthlyRent:"900",rentalExtras:"0<script>",purchaseTotal:"11000"},
  {months:"6",monthlyRent:"900",rentalExtras:"20000000",purchaseTotal:"11000"}
 ])assert.equal(ctx.bedCalc(bad),null,"Invalid inputs must fail closed");
});

test("cost form handles submission locally, keyboard form and only safe text output",()=>{
 const src=read("assets/js/bed-cost-comparison.js");
 const handlers={};
 const els={months:{value:"3"},monthly:{value:"900"},
   "rental-extras":{value:"500"},purchase:{value:"10000"},result:{textContent:""}};
 const form={hidden:true,querySelector:id=>{
   const key=id.replace("#zp-bed-cost-","");return els[key]??null;
 },addEventListener:(n,fn)=>{handlers[n]=fn;}};
 const ctx={document:{querySelector:s=>s==="#zp-bed-cost-comparison"?form:null},Intl,Number};
 vm.runInNewContext(src,ctx);
 assert.equal(form.hidden,false);
 let prevented=0;
 const submit=()=>handlers.submit({preventDefault:()=>prevented++});
 submit();
 assert.equal(prevented,1);
 assert.match(els.result.textContent,/3 měsíců: půjčení/);
 assert.match(els.result.textContent,/nákup/);
 assert.match(els.result.textContent,/pojišťovnou/);
 els.months.value="0";submit();
 assert.match(els.result.textContent,/Vyplňte platné celé částky/);
});
