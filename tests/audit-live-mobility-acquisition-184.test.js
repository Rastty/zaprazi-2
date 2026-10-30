import test from "node:test";
import assert from "node:assert/strict";
import {assertMobilityAcquisition} from "../scripts/audit-live-mobility-acquisition-184.mjs";

const origin="https://zaprazi.cz",version="0.8.184";
const href=path=>'<a href="'+origin+path+'">Praktický krok</a>';
function page(path,body,release=version,integrity="ok"){
  return '<html><head><meta name="zaprazi-release" content="'+release+'">'+
    '<meta name="zaprazi-integrity" content="'+integrity+'">'+
    '<link rel="canonical" href="'+origin+path+'"></head><body><main>'+
    body+'</main></body></html>';
}
function fixtures(){
  return {
    hub:page("/choditka-pro-seniory/",
      '<section id="jak-ziskat-choditko"><h3 id="choditko-pred-ziskanim-nadpis">'+
      'Čtyři věci, které si ověřit před koupí</h3>'+
      href("/#poradce")+href("/co-zmerit-pred-vyberem-choditka/#co-zmerit")+
      href("/pujceni-choditka/")+href("/choditko-na-pojistovnu/")+'</section>'),
    insurance:page("/choditko-na-pojistovnu/",
      '<section id="postup"><a href="#kdyz-cekate-na-epoukaz">Dočasné možnosti</a></section>'+
      '<section id="kdyz-cekate-na-epoukaz"><h2>Bezpečné půjčení při čekání</h2>'+
      href("/pujceni-choditka/")+href("/co-zmerit-pred-vyberem-choditka/#co-zmerit")+'</section>'),
    rental:page("/pujceni-choditka/",'<section id="rozpocet-pujceni-choditka">Rozpočet</section>'),
    measuring:page("/co-zmerit-pred-vyberem-choditka/",'<section id="co-zmerit">Měření</section>')
  };
}
test("release 0.8.184: safe walker purchase/rental/ePoukaz handoffs have live target anchors",()=>{
  assert.deepEqual(assertMobilityAcquisition(fixtures(),version),{
    release:version,pages_checked:4,acquisition_links_checked:4,
    waiting_links_checked:2,section_targets_checked:4
  });
});
test("do not accept missing or spoofed in-section editorial links",()=>{
  const pages=fixtures();
  pages.hub=pages.hub.replace(href("/#poradce"),"");
  assert.throws(()=>assertMobilityAcquisition(pages,version),/Missing safe walker acquisition link/);
  const spoof=fixtures();
  spoof.insurance=spoof.insurance.replace(href("/pujceni-choditka/"),
    '<!-- '+href("/pujceni-choditka/")+' -->');
  assert.throws(()=>assertMobilityAcquisition(spoof,version),/Missing safe ePoukaz waiting link/);
});
test("fail closed on missing live checklist, waiting section or target",()=>{
  const a=fixtures();
  a.hub=a.hub.replace('id="choditko-pred-ziskanim-nadpis"','data-id="choditko-pred-ziskanim-nadpis"');
  assert.throws(()=>assertMobilityAcquisition(a,version),/Missing four-point checklist/);
  const b=fixtures();
  b.insurance=b.insurance.replace('id="kdyz-cekate-na-epoukaz"','data-id="kdyz-cekate-na-epoukaz"');
  assert.throws(()=>assertMobilityAcquisition(b,version),/Missing ePoukaz waiting guidance/);
  const c=fixtures();
  c.measuring=c.measuring.replace('id="co-zmerit"','data-id="co-zmerit"');
  assert.throws(()=>assertMobilityAcquisition(c,version),/Measurement target missing/);
});
test("never accept stale release, partial integrity or wrong canonical",()=>{
  const stale=fixtures();
  stale.hub=stale.hub.replace('content="0.8.184"','content="0.8.183"');
  assert.throws(()=>assertMobilityAcquisition(stale,version),/Stale\/missing page release/);
  const partial=fixtures();
  partial.insurance=partial.insurance.replace('content="ok"','content="partial"');
  assert.throws(()=>assertMobilityAcquisition(partial,version),/Partial page integrity/);
  const canonical=fixtures();
  canonical.rental=canonical.rental.replace(
    'rel="canonical" href="https://zaprazi.cz/pujceni-choditka/"',
    'rel="canonical" href="https://zaprazi.cz/"');
  assert.throws(()=>assertMobilityAcquisition(canonical,version),/incorrect canonical/);
});
