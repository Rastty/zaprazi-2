import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {verifyTransportMobility248,auditLiveTransportMobility248}
  from "../scripts/audit-live-transport-mobility-248.mjs";
const meta=(v="0.8.248",ok="ok")=>
  '<meta name="zaprazi-release" content="'+v+'">'+
  '<meta name="zaprazi-integrity" content="'+ok+'">';
const transport=(url="https://zaprazi.cz/choditka-pro-seniory/#vyber-typu")=>
  meta()+'<section class="zp-hero"><div class="zp-wrap">'+
  '<p class="zp-muted-copy zp-transport-mobility-route">'+
  'Potíž je hlavně dojít bezpečně k autu nebo do ordinace? '+
  'Zvládá chůzi bez fyzického přidržování. '+
  '<a href="'+url+'">Prověřit typ opory</a>. '+
  'Chodítko ale neřeší nemožnost bezpečně nastoupit do auta. '+
  'V nejistotě odborné posouzení.</p></div></section>';
const stairs=(url="https://zaprazi.cz/prevoz-seniora-k-lekari/#vyber-dopravy")=>
  meta()+'<section class="zp-section"><article class="zp-decision-card">'+
  '<h3>4. Před propuštěním z nemocnice vše domluvte</h3>'+
  '<p>Pokud schody komplikují i cestu na plánované vyšetření, '+
  '<a href="'+url+'">řešit dopravu</a>. Samotné schody '+
  'automaticky nezakládají nárok na hrazenou sanitku; rozhoduje lékař.</p>'+
  '</article></section>';

test("exact 0.8.248 live guide routes pass with source release, never merchant requests",()=>{
  const v=verifyTransportMobility248({transport:transport(),stairs:stairs()},"0.8.248");
  assert.equal(v.status,"verified");assert.equal(v.get_requests,2);
  assert.equal(v.merchant_requests,0);assert.equal(v.wordpress_writes,0);
});
test("mixed and older release cannot accept new paths",()=>{
  assert.throws(()=>verifyTransportMobility248({transport:transport(),stairs:stairs()},"0.8.247"),/requires 0.8.248/);
  assert.throws(()=>verifyTransportMobility248({transport:transport(),stairs:stairs()},"0.8.249"),/mixed release/);
  assert.throws(()=>verifyTransportMobility248({transport:transport().replace('integrity" content="ok"','integrity" content="partial"'),stairs:stairs()},"0.8.248"));
});
test("offsite and query/answer-parameter links fail closed; no duplicated card routes",()=>{
  for(const url of ["https://merchant.example/item","https://zaprazi.cz/choditka-pro-seniory/?answers=secret#vyber-typu"]){
    assert.throws(()=>verifyTransportMobility248({transport:transport(url),stairs:stairs()},"0.8.248"));
  }
  assert.throws(()=>verifyTransportMobility248({transport:transport(),stairs:stairs("https://zaprazi.cz/")}, "0.8.248"));
  assert.throws(()=>verifyTransportMobility248({transport:transport(),stairs:stairs()+stairs()}, "0.8.248"));
});
test("production reader makes two exact GETs only; an older source is pending",async()=>{
  const seen=[];
  const body=[transport(),stairs()];
  const mock=async(url,opt)=>{
    seen.push({url,opt});
    return {status:200,url,text:async()=>body[seen.length-1]};
  };
  const pending=await auditLiveTransportMobility248(mock,"0.8.247");
  assert.equal(pending.status,"not_applicable");assert.equal(seen.length,0);
  const v=await auditLiveTransportMobility248(mock,"0.8.248");
  assert.equal(v.status,"verified");assert.equal(seen.length,2);
  assert.ok(seen.every(x=>x.opt.method==="GET"&&x.opt.redirect==="error"&&
    x.opt.cache==="no-store"&&!x.url.includes("?")));
  await assert.rejects(auditLiveTransportMobility248(async url=>({
    status:403,url,text:async()=>{throw Error("no")}
  }),"0.8.248"));
});
