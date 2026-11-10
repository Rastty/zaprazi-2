import test from "node:test";
import assert from "node:assert/strict";
import {assertMobilityAcquisition,assertExpiredSuklEvidence,assertMonthlySuklEvidence} from "../scripts/audit-live-mobility-acquisition-184.mjs";

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

// November 1 is a real freshness boundary for the October 2026 SÚKL record.
// These are server-rendered HTML fixtures, never synthetic reimbursement claims.
test("expired October SÚKL amount is clearly historical in public Mobility HTML",()=>{
  const valid='<h2>Říjnový záznam už není aktuální.</h2>'+
    '<p class="zp-stale-evidence">Tento měsíční záznam už není aktuální.</p>'+
    '<span>Historická úhrada v říjnovém seznamu</span><strong>3 408 Kč</strong>';
  assert.deepEqual(assertExpiredSuklEvidence(valid,"2026-11-01"),
    {status:"expired_record_clearly_historical"});
  assert.deepEqual(assertExpiredSuklEvidence(valid,"2026-10-31"),
    {status:"not_yet_expired"});
  assert.throws(()=>assertExpiredSuklEvidence(valid.replace("Historická úhrada","Úhrada"),"2026-11-01"),
    /historical label/);
  assert.throws(()=>assertExpiredSuklEvidence(valid.replace('class="zp-stale-evidence"','class="zp-note"'),"2026-11-01"),
    /historical-data warning/);
  assert.throws(()=>assertExpiredSuklEvidence(valid.replace("Říjnový záznam už není aktuální.","MEYRA Ideal: 3 408 Kč."),"2026-11-01"),
    /stale headline/);
  assert.throws(()=>assertExpiredSuklEvidence(valid+"<span>Úhrada v aktuálním říjnovém seznamu</span>","2026-11-01"),
    /still appears current/);
  assert.throws(()=>assertExpiredSuklEvidence(valid+"<h2>MEYRA Ideal: 3 408 Kč.</h2>","2026-11-01"),
    /current hero claim/);
});


const novemberRow='<article class="zp-card"><h2>Listopad 2026: úhrada 3 408 Kč.</h2>'+
  '<p>IDEAL ROLLATOR 3061982, kód 5005963, ověřený příklad pro listopad 2026.</p></article>'+
  '<div class="zp-resource-facts"><span>Úhrada v aktuálním listopadovém seznamu</span>'+
  '<strong>3 408 Kč</strong></div>';
const novemberHistorical='<article class="zp-card"><h2>Poslední ověřený záznam už není aktuální.</h2>'+
  '<p>Po 30. 11. 2026 ověřte nový seznam.</p></article>'+
  '<p class="zp-stale-evidence">Pozor: ověřená listopadová částka už není aktuální.</p>'+
  '<div><span>Historická úhrada v listopadovém seznamu</span><strong>3 408 Kč</strong></div>';

test("0.8.215: valid November official row replaces obsolete October-only QA gate",()=>{
  assert.deepEqual(assertMonthlySuklEvidence(novemberRow,"2026-11-01","0.8.215"),
    {status:"november_record_verified_current_month"});
  assert.deepEqual(assertMonthlySuklEvidence(novemberRow,"2026-11-30","0.8.215"),
    {status:"november_record_verified_current_month"});
  assert.throws(()=>assertMonthlySuklEvidence(novemberRow.replace("Listopad 2026: úhrada","Úhrada"),
    "2026-11-10","0.8.215"),/November SÚKL headline/);
  assert.throws(()=>assertMonthlySuklEvidence(novemberRow.replace("kód 5005963","kód 0000000"),
    "2026-11-10","0.8.215"),/model and SÚKL code/);
  assert.throws(()=>assertMonthlySuklEvidence(novemberRow.replace("Úhrada v aktuálním listopadovém seznamu",
    "Historická úhrada v listopadovém seznamu"),"2026-11-10","0.8.215"),
    /labeled with the valid month/);
  assert.throws(()=>assertMonthlySuklEvidence(novemberRow+
    "<span>Úhrada v aktuálním říjnovém seznamu</span>","2026-11-10","0.8.215"),
    /October record must not appear current/);
});

test("0.8.215: December and later must visibly expire November amount without deleting historical facts",()=>{
  assert.deepEqual(assertMonthlySuklEvidence(novemberHistorical,"2026-12-01","0.8.215"),
    {status:"november_record_expired_fail_closed"});
  assert.deepEqual(assertMonthlySuklEvidence(novemberHistorical,"2027-01-01","0.8.216"),
    {status:"november_record_expired_fail_closed"});
  assert.throws(()=>assertMonthlySuklEvidence(novemberRow,"2026-12-01","0.8.215"),
    /stale headline/);
  assert.throws(()=>assertMonthlySuklEvidence(novemberHistorical.replace('class="zp-stale-evidence"',
    'class="zp-note"'),"2026-12-01","0.8.215"),/visible stale-evidence warning/);
  assert.throws(()=>assertMonthlySuklEvidence(novemberHistorical.replace("Historická úhrada",
    "Úhrada"),"2026-12-01","0.8.215"),/historical label/);
  assert.throws(()=>assertMonthlySuklEvidence(novemberHistorical+
    "<span>Úhrada v aktuálním listopadovém seznamu</span>","2026-12-01","0.8.215"),
    /still presented as current/);
});

test("0.8.214 and earlier still require October historical warning in November",()=>{
  const legacy='<h2>Říjnový záznam už není aktuální.</h2>'+
    '<p class="zp-stale-evidence">Pozor, již historické.</p>'+
    '<span>Historická úhrada v říjnovém seznamu</span>';
  assert.deepEqual(assertMonthlySuklEvidence(legacy,"2026-11-10","0.8.214"),
    {status:"expired_record_clearly_historical"});
  assert.throws(()=>assertMonthlySuklEvidence(novemberRow,"2026-11-10","0.8.214"),
    /stale headline/);
});
