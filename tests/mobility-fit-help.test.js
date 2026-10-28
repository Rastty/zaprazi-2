import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {renderMobilityProductFitGate,installMobilityProductFitGate} from "../src/mobility/offer-fit-gate.js";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const merchant='<a href="https://example.com/demo" data-zp-merchant-link="1">Ověřit dostupnost</a>';

test("Family can find a real help path without unlocking a model or losing temporary answers",()=>{
  const html=renderMobilityProductFitGate(merchant);
  assert.ok(html.includes('class="zp-fit-locked-offers" hidden>'+merchant));
  assert.ok(html.includes('<details class="zp-fit-help">'));
  assert.ok(html.includes('<summary>Nemůžete některý bod potvrdit?'));
  assert.ok(html.includes('href="/co-zmerit-pred-vyberem-choditka/#co-zmerit"'));
  assert.ok(html.includes('target="_blank" rel="noopener"'));
  assert.ok(html.includes("Odkaz na nabídku zůstane uzamčený"));
  assert.ok(html.includes("Nezaškrtávejte odhad"));
  assert.equal((html.match(/data-zp-mobility-fit-confirm=/g)||[]).length,3);
  assert.equal(renderMobilityProductFitGate(""),"");
  const guide=read("page-co-zmerit-pred-vyberem-choditka.php");
  assert.ok(guide.includes('id="co-zmerit"'),"Actionable help must point to a real destination and anchor");
  assert.doesNotMatch(html,/navigator\.sendBeacon|localStorage|sessionStorage|FormData|onchange=|onclick=/);
});

test("Only relevant extra safety and verification hints show for seat, brakes and car transport",()=>{
  const base=renderMobilityProductFitGate(merchant);
  assert.doesNotMatch(base,/U rollátoru navíc osobně ověřte/);
  assert.doesNotMatch(base,/U sedátka ověřte stabilní zabrzdění/);
  assert.doesNotMatch(base,/Při převozu v autě vyžádejte/);

  const braked=renderMobilityProductFitGate(merchant,{requireBrakeFit:true});
  assert.equal((braked.match(/data-zp-mobility-fit-confirm=/g)||[]).length,4);
  assert.match(braked,/U rollátoru navíc osobně ověřte brzdy/);
  assert.doesNotMatch(braked,/U sedátka ověřte/);

  const full=renderMobilityProductFitGate(merchant,{
    requireBrakeFit:true,requireSeatFit:true,requireTransportFit:true
  });
  assert.equal((full.match(/data-zp-mobility-fit-confirm=/g)||[]).length,6);
  for(const label of ["load","width","height","brakes","seat","transport"]){
    assert.ok(full.includes('data-zp-mobility-fit-confirm="'+label+'"'),label);
  }
  assert.match(full,/U sedátka ověřte stabilní zabrzdění/);
  assert.match(full,/Při převozu v autě vyžádejte složené rozměry a hmotnost/);
  assert.ok(full.includes('class="zp-fit-locked-offers" hidden>'+merchant));
});

const setupGate=(count)=>{
  const checkboxes=Array.from({length:count},()=>({checked:false}));
  const offers={hidden:true};
  const progress={textContent:""};
  const gate={
    querySelectorAll:s=>{
      assert.equal(s,"[data-zp-mobility-fit-confirm]");
      return checkboxes;
    },
    querySelector:s=>{
      if(s===".zp-fit-locked-offers")return offers;
      if(s==="[data-zp-fit-progress]")return progress;
      throw Error(s);
    }
  };
  return {checkboxes,offers,progress,target:{
    matches:s=>s==='[data-zp-mobility-fit-confirm]',
    closest:s=>s===".zp-mobility-fit-gate"?gate:null
  }};
};

test("Help never changes safety gate state: missing check locks, all checks unlock, unchecking relocks",()=>{
  let listener=null;
  const root={addEventListener:(event,fn)=>{
    assert.equal(event,"change");listener=fn;
  }};
  installMobilityProductFitGate(root);
  assert.equal(typeof listener,"function");
  const a=setupGate(3);
  const b=setupGate(5);
  const trigger=gate=>listener({target:gate.target});

  a.checkboxes[0].checked=true;trigger(a);
  assert.equal(a.offers.hidden,true);
  assert.match(a.progress.textContent,/Potvrzeno 1 z 3 kontrol/);

  for(const c of a.checkboxes)c.checked=true;
  trigger(a);
  assert.equal(a.offers.hidden,false);
  assert.match(a.progress.textContent,/Všechna ověření hotová/);
  assert.equal(b.offers.hidden,true,"Another product must remain locked");

  for(const c of b.checkboxes)c.checked=true;
  trigger(b);
  assert.equal(b.offers.hidden,false);
  a.checkboxes[1].checked=false;
  trigger(a);
  assert.equal(a.offers.hidden,true);
  assert.equal(b.offers.hidden,false,"Re-locking one model must not touch the other");

  const unrelated={target:{matches:()=>false}};
  listener(unrelated);
  assert.equal(a.offers.hidden,true);
});

test("Mobile measurement-help entry stays keyboard operable, without overriding hidden product offers",()=>{
  const css=read("style.css");
  assert.match(css,/\.zp-fit-help>summary\{min-height:44px/);
  assert.match(css,/\.zp-fit-locked-offers\[hidden\]\{display:none!important\}/);
  const gate=read("src/mobility/offer-fit-gate.js");
  assert.match(gate,/role="status" aria-live="polite"/);
  assert.ok(!gate.includes("window.open("));
});
