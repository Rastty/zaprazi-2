import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {renderBathroomMeasurementNextStep} from "../src/bathroom/measurement-next-step.js";

const root="/co-zmerit-v-koupelne-pred-vyberem-pomucky/";
const blocked=field=>({status:"needs_more_info",missing:[field]});

test("Blocked bathroom product fit links to a relevant local measuring guide without commerce",()=>{
 for(const [topic,field,anchor] of [
  ["toilet","toiletFit","mereni-wc"],
  ["toilet","feetFlatAtRaisedHeight","mereni-wc"],
  ["toilet","supportFrameFit","mereni-wc"],
  ["shower","spaceFit","mereni-sprcha"],
  ["shower","loadFit","mereni-sprcha"],
  ["bath","bathFit","mereni-vana"],
  ["bath","bathBenchFit","mereni-vana"]
 ]){
  const html=renderBathroomMeasurementNextStep(blocked(field),topic);
  assert.ok(html.includes(root+"#"+anchor),topic+"/"+field);
  assert.match(html,/Samotné měření nenahrazuje posouzení přesunu/);
  assert.doesNotMatch(html,/data-zp-.*merchant|https?:\/\/|affiliate|desturl|click\.php/i);
 }
});

test("Professional-check, wrong fit, transfer uncertainty and candidate result never gain shortcut",()=>{
 for(const outcome of [
  {status:"candidate",missing:["loadFit"]},
  {status:"professional_check",missing:[]},
  blocked("transferAbility"),
  blocked("floorStable"),
  {status:"invalid_input",missing:["loadFit"]}
 ])assert.equal(renderBathroomMeasurementNextStep(outcome,"toilet"),"");
 assert.equal(renderBathroomMeasurementNextStep(blocked("loadFit"),"unknown"),"");
 assert.equal(renderBathroomMeasurementNextStep({status:"needs_more_info",missing:null},"bath"),"");
});

test("Five existing bathroom specialist results show context help without changing product gating",()=>{
 const cases={
  "toilet-riser":"toilet",
  "toilet-support":"toilet",
  "toilet-chair":"toilet",
  "shower-chair":"shower",
  "bath-transfer":"bath"
 };
 for(const [name,topic] of Object.entries(cases)){
  const src=readFileSync(new URL("../assets/js/"+name+"-advisor.js",import.meta.url),"utf8");
  assert.match(src,/import \{ renderBathroomMeasurementNextStep \} from/);
  assert.ok(src.includes('renderBathroomMeasurementNextStep(output, "'+topic+'")')||
   src.includes('renderBathroomMeasurementNextStep(out,"'+topic+'")'),name);
  assert.match(src,/status\s*===\s*["']candidate["']/);
  assert.doesNotMatch(src,/localStorage|sendBeacon|FormData|location\.search/);
 }
 const guide=readFileSync(new URL("../page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php",import.meta.url),"utf8");
 for(const anchor of ["mereni-wc","mereni-sprcha","mereni-vana"])
  assert.ok(guide.includes('id="'+anchor+'"'),anchor);
});
