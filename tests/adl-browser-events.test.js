import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { chooseAdlSelfCareAid } from "../src/adl/engine.js";

function createAdl() {
  const listeners = {};
  const groups = new Map();
  const inputs = new Map();
  const fitChecks = { innerHTML: "", textContent: "" };
  let focused = null;

  function addGroup(name, values, conditional = null, hidden = false) {
    const group = {
      hidden,
      dataset: { zpAdlRequired: name, ...(conditional ? {zpAdlConditional: conditional} : {}) },
      classList: { toggle(){}, remove(){}, add(){} },
      setAttribute(){}, removeAttribute(){}, focus(){focused = name;},
      querySelectorAll(selector) { assert.equal(selector, "input"); return inputs.get(name); }
    };
    const radios = values.map(value => ({
      name, value, checked: false, required: false,
      closest(selector) { return selector === "[data-zp-adl-required]" ? group : null; }
    }));
    groups.set(name, group);
    inputs.set(name, radios);
  }
  addGroup("task", ["drink","stabilize_container","one_hand_meal","open_packaging","other"]);
  addGroup("mainProblem", ["grip_or_spill","container_moves","one_hand_setup","grip_or_twist","swallowing_or_medical","other"]);
  addGroup("stableSurface", ["yes","no","unknown"], "stabilize_container", true);
  addGroup("oneHandUse", ["yes","no","unknown"], "one_hand_meal", true);
  addGroup("productFit", ["yes","no","unknown"], null, true);
  const form = {
    addEventListener(name, fn){ (listeners[name] ||= []).push(fn); },
    querySelector(selector){
      if (selector === "#zp-adl-product-fit") return groups.get("productFit");
      if (selector === "#zp-adl-product-fit-checks") return fitChecks;
      if (selector === '[data-zp-adl-required="mainProblem"]') return groups.get("mainProblem");
      const match = selector.match(/^input\[name="([^"]+)"\]:checked$/);
      return match ? inputs.get(match[1])?.find(x => x.checked) || null : null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-zp-adl-conditional]") return [...groups.values()].filter(x=>x.dataset.zpAdlConditional);
      if (selector === "[data-zp-adl-required]") return [...groups.values()];
      if (selector === 'input[name="mainProblem"]') return inputs.get("mainProblem");
      throw Error("Unrecognized form query " + selector);
    },
    change(name,value){
      const list=inputs.get(name);
      assert.ok(list, "missing question "+name);
      const selected=list.find(x=>x.value===value);
      assert.ok(selected, name+":"+value);
      list.forEach(x=>{x.checked=x===selected;});
      for(const listener of listeners.change||[]) listener({target:selected});
    }
  };
  const result = {hidden:true,innerHTML:"",focus(){focused="result";},querySelectorAll(){return [];}};
  const button = {listeners:[],addEventListener(type,fn){assert.equal(type,"click");this.listeners.push(fn);},click(){this.listeners.forEach(fn=>fn());}};
  const errorBox = {hidden:true,textContent:""};
  const nodes = new Map([
    ["#zp-adl-advisor",form],["#zp-adl-result",result],
    ["#zp-adl-submit",button],["#zp-adl-errors",errorBox]
  ]);
  const emitted = [];
  const globals = {
    document:{querySelector(q){return nodes.get(q)||null;}},
    window:{ZaPraziRuntime:{affiliateMap:{}},dispatchEvent(e){emitted.push(e.detail.event);}},
    CustomEvent: class { constructor(type, opts){this.detail=opts.detail;} },
    chooseAdlSelfCareAid,
    canLinkEvidence: ()=>false
  };
  const script=fs.readFileSync(new URL("../assets/js/adl-advisor.js",import.meta.url),"utf8")
    .replace(/^import .*;\s*$/gm,"");
  vm.runInNewContext(script,globals,{filename:"assets/js/adl-advisor.js",timeout:1500});
  return {form,result,button,errorBox,groups,inputs,fitChecks,emitted,get focused(){return focused;}};
}

test("ADL candidate reveals model-specific fit before any purchase link",()=>{
  const h=createAdl();
  h.form.change("task","drink");
  h.form.change("mainProblem","grip_or_spill");
  h.button.click();
  assert.equal(h.groups.get("productFit").hidden,false);
  assert.match(h.fitChecks.innerHTML,/UpCup/);
  assert.match(h.fitChecks.innerHTML,/ověřit pohodlný úchop/);
  assert.equal(h.focused,"productFit");
  assert.doesNotMatch(h.result.innerHTML,/data-zp-adl-merchant-link/);
  h.form.change("productFit","unknown");
  h.button.click();
  assert.doesNotMatch(h.result.innerHTML,/data-zp-adl-merchant-link/);
  h.form.change("productFit","no");
  h.button.click();
  assert.match(h.result.innerHTML,/nekupujte/i);
  assert.doesNotMatch(h.result.innerHTML,/data-zp-adl-merchant-link/);
  h.form.change("productFit","yes");
  h.button.click();
  assert.match(h.result.innerHTML,/data-zp-adl-merchant-link/);
  assert.ok(h.emitted.includes("recommendation_view"));
  h.form.change("mainProblem","swallowing_or_medical");
  assert.equal(h.groups.get("productFit").hidden,true);
  assert.ok(h.inputs.get("productFit").every(x=>!x.checked));
  assert.equal(h.result.hidden,true);
  assert.doesNotMatch(h.result.innerHTML,/merchant-link/);
  h.button.click();
  assert.doesNotMatch(h.result.innerHTML,/merchant-link/);
  assert.match(h.result.innerHTML,/odborníkem/);
});

test("ADL does not reveal final fit question before a required work surface is resolved",()=>{
  const h=createAdl();
  h.form.change("task","stabilize_container");
  h.form.change("mainProblem","container_moves");
  h.form.change("stableSurface","unknown");
  h.button.click();
  assert.equal(h.groups.get("productFit").hidden,true);
  assert.doesNotMatch(h.result.innerHTML,/data-zp-adl-merchant-link/);
  h.form.change("stableSurface","yes");
  h.button.click();
  assert.equal(h.groups.get("productFit").hidden,false);
  assert.match(h.fitChecks.innerHTML,/Beat It/);
  h.form.change("productFit","yes");
  h.button.click();
  assert.match(h.result.innerHTML,/data-zp-adl-merchant-link/);
  h.form.change("stableSurface","no");
  assert.equal(h.groups.get("productFit").hidden,true);
  assert.equal(h.result.hidden,true);
});

test("changing ADL activity clears the old obstacle and cannot reuse its approved product", () => {
  const h = createAdl();
  h.form.change("task", "drink");
  h.form.change("mainProblem", "grip_or_spill");
  h.button.click();
  h.form.change("productFit", "yes");
  h.button.click();
  assert.match(h.result.innerHTML, /data-zp-adl-merchant-link/);

  // Switching activity must not preserve the previous answer 'grip_or_spill'.
  h.form.change("task", "open_packaging");
  assert.equal(h.result.hidden, true);
  assert.equal(h.result.innerHTML, "");
  assert.equal(h.groups.get("productFit").hidden, true);
  assert.equal(h.inputs.get("mainProblem").filter(x => x.checked).length, 0);
  assert.equal(h.inputs.get("productFit").filter(x => x.checked).length, 0);

  h.button.click();
  assert.equal(h.errorBox.hidden, false, "new activity needs a fresh obstacle");
  assert.equal(h.result.hidden, true, "old affiliate offer must stay hidden");

  h.form.change("mainProblem", "grip_or_twist");
  h.button.click();
  assert.equal(h.groups.get("productFit").hidden, false);
  assert.match(h.fitChecks.innerHTML, /Open-It/);
  assert.doesNotMatch(h.result.innerHTML, /data-zp-adl-merchant-link/);
  h.form.change("productFit", "yes");
  h.button.click();
  assert.match(h.result.innerHTML, /data-zp-adl-merchant-link/);
  assert.match(h.result.innerHTML, /Open-It/);
});

test("changing task back to a previous activity still needs a new obstacle answer", () => {
  const h = createAdl();
  h.form.change("task", "stabilize_container");
  h.form.change("mainProblem", "container_moves");
  h.form.change("stableSurface", "yes");
  h.button.click();
  assert.match(h.fitChecks.innerHTML, /Beat It/);

  h.form.change("task", "drink");
  assert.equal(h.inputs.get("mainProblem").filter(x => x.checked).length, 0);
  assert.equal(h.inputs.get("stableSurface").filter(x => x.checked).length, 0);
  h.button.click();
  assert.equal(h.errorBox.hidden, false);
  assert.equal(h.groups.get("productFit").hidden, true);
});
