import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("rental call preparation can be printed without forms, network or storage",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page, /href="#zp-otazky-pujcovna">Připravit telefonát do půjčovny/);
  assert.match(page, /data-zp-paper-print hidden>Vytisknout otázky pro půjčovnu/);
  const start=page.indexOf('<section class="zp-section zp-paper-checklist" data-zp-paper-checklist="walker-rental-call"');
  const end=page.indexOf("</main>",start);
  assert.ok(start>0&&end>start,"Printable worksheet must be inside main");
  const sheet=page.slice(start,end);
  const questions=sheet.match(/<ol class="zp-paper-questions">([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(questions,"Printable worksheet must use the shared print style");
  assert.equal((questions.match(/<li>/g)||[]).length,5);
  for(const topic of ["typ chodítka","rozměry, nosnost, nastavení, brzdy, koncovky",
    "celková cena","návod ke konkrétnímu modelu","vrátit pomůcku",
    "závadě nebo poškození"]){
    assert.ok(questions.toLowerCase().includes(topic),"Missing printable question: "+topic);
  }
  assert.match(sheet,/Vadné brzdy, koncovky nebo nestabilní pomůcku nepoužívejte/);
  assert.match(sheet,/Kdy a jak vrátit pomůcku, za jakých podmínek dostanu zpět kauci/,
    "Paper checklist must explain aid return as well as deposit refund");
  assert.match(sheet,/předá návod ke konkrétnímu modelu/,
    "Paper checklist must request the exact model instructions");
  assert.match(sheet,/nastavení, brzdy, koncovky a technický stav/,
    "Paper checklist must retain the on-page handover safety checks");
  assert.match(sheet,/Sedátko rollátoru neopravňuje k převozu/);
  assert.doesNotMatch(sheet,/<form\b|<input\b|<textarea\b|data-zp-merchant-link|data-monthly-price|localStorage|sessionStorage|fetch\s*\(/i);
});

test("existing print helper is enabled for rental page only and remains privacy-safe",()=>{
  const fn=read("functions.php");
  const start=fn.indexOf("function zaprazi_2_family_checklist_print_asset()");
  const end=fn.indexOf("add_action( 'wp_enqueue_scripts', 'zaprazi_2_family_checklist_print_asset', 20 );",start);
  assert.ok(start>0&&end>start);
  const enqueue=fn.slice(start,end);
  assert.match(enqueue,/'pujceni-choditka'/);
  assert.match(enqueue,/assets\/js\/family-checklist-print\.js/);
  const js=read("assets/js/family-checklist-print.js");
  assert.match(js,/\[data-zp-paper-print\]/);
  assert.match(js,/\[data-zp-paper-checklist\]/);
  assert.match(js,/window\.print\(\)/);
  assert.doesNotMatch(js,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|navigator\.sendBeacon|dataLayer|gtag\s*\(/);
  const css=read("style.css");
  assert.match(css,/\.zp-paper-checklist\{display:none\}/);
  assert.match(css,/body\.zp-paper-print-mode main > :not\(\.zp-paper-checklist\)\{display:none!important\}/);
  assert.match(css,/\[hidden\]\{display:none!important\}/);
});

test("print sheet restores the normal page when print media ends without afterprint",()=>{
  const handlers=new Map(),mediaHandlers=new Map(),buttonHandlers=new Map();
  const classes=new Set();
  const button={
    hidden:true,
    addEventListener:(name,handler)=>buttonHandlers.set(name,handler)
  };
  const windowMock={
    print:()=>{},
    addEventListener:(name,handler)=>handlers.set(name,handler),
    matchMedia:query=>{
      assert.equal(query,"print");
      return {addEventListener:(name,handler)=>mediaHandlers.set(name,handler)};
    }
  };
  const documentMock={
    querySelector:selector=>selector==="[data-zp-paper-print]"?button:
      selector==="[data-zp-paper-checklist]"?{}:null,
    body:{classList:{
      add:value=>classes.add(value),
      remove:value=>classes.delete(value)
    }}
  };
  runInNewContext(read("assets/js/family-checklist-print.js"),{
    window:windowMock,document:documentMock
  });
  assert.equal(button.hidden,false,"Print button should be available with JavaScript");
  buttonHandlers.get("click")();
  assert.equal(classes.has("zp-paper-print-mode"),true);
  mediaHandlers.get("change")({matches:false});
  assert.equal(classes.has("zp-paper-print-mode"),false,
    "Cancelled print must not leave the rest of the page hidden");
  buttonHandlers.get("click")();
  handlers.get("afterprint")();
  assert.equal(classes.has("zp-paper-print-mode"),false,
    "Standard afterprint cleanup must still work");
});
