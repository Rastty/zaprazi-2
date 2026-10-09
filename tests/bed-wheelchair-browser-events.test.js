import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { recommendAdjustableBed } from "../src/bed/engine.js";
import { getAdjustableBedProducts } from "../src/bed/catalog.js";
import { recommendWheelchair } from "../src/wheelchair/engine.js";
import { getWheelchairProducts } from "../src/wheelchair/catalog.js";
import { previewAdjustableBed, previewWheelchair } from "../src/decision/product-preview.js";

function create(kind) {
  const prefix=kind==="bed"?"bed":"wheelchair";
  const isWheelchair=kind==="wheelchair";
  const requiredAttr=isWheelchair?"zpWheelchairRequired":"zpBedRequired";
  const attr=isWheelchair?"data-zp-wheelchair-required":"data-zp-bed-required";
  const fitFields=isWheelchair?["seatFit","widthFit","loadFit"]:["loadFit","spaceFit"];
  const names=isWheelchair?["propulsion","transferAbility",...fitFields,"joystickSafe","chargingReady","duration"]:
    ["primaryNeed","transferAbility",...fitFields,"duration"];
  const inputs=new Map(),fields=new Map(),listeners={};
  const stage={
    hidden:true,
    appendChild(group){group.parent=this;},
    querySelectorAll(selector){return selector==='input[type="radio"]'?[...inputs.values()].filter(x=>x.group.parent===this):[];}
  };
  const preview={hidden:true,innerHTML:"",focus(){}};
  const result={hidden:true,innerHTML:"",focus(){},querySelectorAll(){return [];}};
  const candidateNote={innerHTML:""};
  const errorBox={hidden:true,textContent:""};
  const submitButton={
    textContent:"1. Ukázat možný výrobek",
    handlers:[],
    addEventListener(name,fn){assert.equal(name,"click");this.handlers.push(fn);},
    click(){for(const fn of this.handlers) fn();}
  };
  for(const name of names){
    const group={
      parent:null,hidden:isWheelchair && ["joystickSafe","chargingReady"].includes(name),
      dataset:{[requiredAttr]:name},attributes:{},
      classList:{toggle(){},remove(){},add(){}},
      closest(selector){return selector==='[hidden]' && this.parent?.hidden?stage:null;},
      setAttribute(k,v){this.attributes[k]=v;},
      removeAttribute(k){delete this.attributes[k];},
      querySelectorAll(selector){return selector==="input"?[inputs.get(name)]:[];},
      focus(){}
    };
    const input={
      name,value:"unknown",required:false,checked:false,group,
      closest(selector){
        if(selector==="["+attr+"]")return group;
        if(selector==="#zp-"+prefix+"-fit-stage"&&group.parent===stage)return stage;
        return null;
      }
    };
    fields.set(name,group);
    inputs.set(name,input);
  }
  const defaults=isWheelchair?{propulsion:"companion",transferAbility:"independent",duration:"unknown"}:
    {primaryNeed:"home_positioning",transferAbility:"independent",duration:"unknown"};
  for(const [name,v] of Object.entries(defaults)) {inputs.get(name).value=v;inputs.get(name).checked=true;}
  const form={
    addEventListener(kind,fn){(listeners[kind] ||= []).push(fn);},
    querySelector(selector){
      const match=selector.match(/^input\[name="([^"]+)"\](?::checked)?$/);
      if(match){const input=inputs.get(match[1]);return input && (!selector.endsWith(":checked")||input.checked)?input:null;}
      const field=selector.match(/^\[data-zp-product-fit\]\[data-zp-(?:bed|wheelchair)-required="([^"]+)"\]$/);
      return field?fields.get(field[1]):null;
    },
    querySelectorAll(selector){
      if(selector==="["+attr+"]")return [...fields.values()].filter(g=>g.dataset[requiredAttr]);
      if(selector==="[data-zp-wheelchair-conditional='powered']")return [fields.get("joystickSafe"),fields.get("chargingReady")].filter(Boolean);
      throw Error("Unexpected form selector "+selector);
    },
    change(name,value){
      const input=inputs.get(name);assert.ok(input,"Unknown field "+name);
      input.value=value;input.checked=true;
      for(const fn of listeners.change||[]) fn({target:input});
    }
  };
  let emitted=[];
  const globals={
    document:{querySelector(selector){
      return {
        ["#zp-"+prefix+"-advisor"]:form,
        ["#zp-"+prefix+"-result"]:result,
        ["#zp-"+prefix+"-submit"]:submitButton,
        ["#zp-"+prefix+"-errors"]:errorBox,
        ["#zp-"+prefix+"-candidate-note"]:candidateNote,
        ["#zp-"+prefix+"-preview"]:preview,
        ["#zp-"+prefix+"-fit-stage"]:stage
      }[selector]||null;
    }},
    window:{ZaPraziRuntime:{affiliateMap:{}},dispatchEvent(evt){emitted.push(evt.detail?.event);}},
    CustomEvent:class{constructor(type,opts){this.detail=opts.detail;}},
    recommendAdjustableBed,getAdjustableBedProducts,previewAdjustableBed,
    recommendWheelchair,getWheelchairProducts,previewWheelchair
  };
  const filename="assets/js/"+kind+"-advisor.js";
  const script=fs.readFileSync(new URL("../"+filename,import.meta.url),"utf8")
    .replace(/^import .*;\s*$/gm,"");
  vm.runInNewContext(script,globals,{filename,timeout:1500});
  return {form,preview,stage,result,submitButton,inputs,fields,errorBox,candidateNote,emitted,fitFields};
}

for(const kind of ["bed","wheelchair"]){
  test(kind+" first click reveals actual model, not merchant link",()=>{
    const h=create(kind);
    assert.equal(h.stage.hidden,true);
    for(const name of h.fitFields)assert.equal(h.fields.get(name).parent,h.stage);
    h.submitButton.click();
    assert.equal(h.stage.hidden,false);
    assert.equal(h.preview.hidden,false);
    assert.match(h.preview.innerHTML,kind==="bed"?/P2777/:/P4384/);
    assert.match(h.preview.innerHTML,/kg/);
    assert.doesNotMatch(h.preview.innerHTML,/href=|merchant-link|sponsored/);
    assert.equal(h.result.hidden,true);
    assert.deepEqual(h.emitted,[]);
  });

  test(kind+" cannot offer without real model-specific confirmations",()=>{
    const h=create(kind);
    h.submitButton.click();
    h.submitButton.click();
    assert.equal(h.errorBox.hidden,false,"missing fit input must be visible as error");
    assert.equal(h.result.hidden,true);
    for(const name of h.fitFields)h.form.change(name,"unknown");
    h.submitButton.click();
    assert.equal(h.result.hidden,false);
    assert.doesNotMatch(h.result.innerHTML,/href=.*(?:dpbolvw|anrdoezrs|tkqlhce|unizdrav)/);
    assert.doesNotMatch(h.result.innerHTML,/data-zp-.*merchant-link/);
    for(const name of h.fitFields)h.form.change(name,"yes");
    h.submitButton.click();
    assert.equal(h.result.hidden,false);
    assert.match(h.result.innerHTML,/data-zp-.*merchant-link/);
  });

  test(kind+" changing scenario clears prior approvals and requires new preview",()=>{
    const h=create(kind);
    h.submitButton.click();
    for(const name of h.fitFields)h.form.change(name,"yes");
    h.form.change(kind==="bed"?"primaryNeed":"propulsion",kind==="bed"?"robust_high_load":"self_manual");
    assert.equal(h.stage.hidden,true);
    assert.equal(h.preview.hidden,true);
    assert.ok(h.fitFields.every(n=>!h.inputs.get(n).checked));
    assert.equal(h.submitButton.textContent,"1. Ukázat možný výrobek");
    h.submitButton.click();
    assert.match(h.preview.innerHTML,kind==="bed"?/P4707/:/P3641/);
    assert.equal(h.result.hidden,true);
  });
}

test("assisted wheelchair transfer must not expose even a model preview",()=>{
  const h=create("wheelchair");
  h.form.change("transferAbility","person_assist");
  h.submitButton.click();
  assert.equal(h.stage.hidden,true);
  assert.equal(h.preview.hidden,true);
  assert.equal(h.result.hidden,false);
  assert.doesNotMatch(h.result.innerHTML,/merchant-link|href=/);
});
