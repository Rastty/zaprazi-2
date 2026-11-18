import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {chooseEasyFootwear} from "../src/footwear/engine.js";
import {merchantOfferPresentation} from "../src/evidence/freshness.js";

function create(now, overrideCheckedAt = null) {
  const required = ["openingNeed", "toe", "velcroUse", "measuredFeet", "sizeChartFit"];
  const inputs = new Map(required.map(name => [name,{name,value:"unknown",checked:false}]));
  const groups = new Map(required.map(name => [name,{
    dataset:{zpFootwearRequired:name},hidden:false,
    classList:{toggle(){},remove(){}},setAttribute(){},removeAttribute(){},focus(){}
  }]));
  for(const input of inputs.values()) input.closest = selector =>
    selector === "[data-zp-footwear-required]" ? groups.get(input.name) : null;
  const listeners = {};
  const form = {
    addEventListener(type,handler){(listeners[type] ??= []).push(handler);},
    querySelector(selector){
      const name = /^input\[name="([^"]+)"\]:checked$/.exec(selector)?.[1];
      return name && inputs.get(name)?.checked ? inputs.get(name) : null;
    },
    querySelectorAll(selector){
      if(selector === "[data-zp-footwear-required]") return [...groups.values()];
      throw new Error("Unexpected selector: "+selector);
    },
    change(name,value){
      const input = inputs.get(name); assert.ok(input);
      input.checked = true; input.value = value;
      for(const fn of listeners.change ?? []) fn({target:input});
    }
  };
  const result = {innerHTML:"",hidden:true,focus(){},querySelectorAll(){return [];}};
  const submit = {handlers:[],addEventListener(type,fn){assert.equal(type,"click");this.handlers.push(fn);},click(){for(const fn of this.handlers)fn();}};
  const sizeStage = {
    hidden:true,classList:{remove(){}},removeAttribute(){},focus(){},
    querySelectorAll(selector){assert.equal(selector,"input");return [inputs.get("sizeChartFit")];}
  };
  const sizeModel = {textContent:""};
  const sizeContact = {href:"",removeAttribute(name){if(name==="href")this.href="";}};
  const nodes = new Map([
    ["#zp-footwear-advisor",form],["#zp-footwear-result",result],
    ["#zp-footwear-submit",submit],["#zp-footwear-errors",{hidden:true,textContent:""}],
    ["#zp-footwear-size-stage",sizeStage],["#zp-footwear-size-model",sizeModel],
    ["#zp-footwear-size-contact",sizeContact]
  ]);
  const source = readFileSync(new URL("../assets/js/footwear-advisor.js",import.meta.url),"utf8")
    .replace(/^import .*;\s*$/gm, "");
  vm.runInNewContext(source,{
    document:{querySelector:selector=>nodes.get(selector)??null},
    window:{ZaPraziRuntime:{affiliateMap:{}},dispatchEvent(){}},
    CustomEvent:class{constructor(_,options){this.detail=options.detail;}},
    chooseEasyFootwear,canLinkEvidence:()=>false,encodeURIComponent,
    merchantOfferPresentation:checkedAt=>merchantOfferPresentation(
      overrideCheckedAt??checkedAt,new Date(now))
  },{filename:"assets/js/footwear-advisor.js",timeout:1500});
  function complete(){
    for(const [name,value] of Object.entries({
      openingNeed:"wide_opening",toe:"open_ok",velcroUse:"yes",measuredFeet:"yes"
    }))form.change(name,value);
    submit.click();
    assert.doesNotMatch(result.innerHTML,/data-zp-footwear-merchant-link|Cena při ověření/);
    form.change("sizeChartFit","yes");
    submit.click();
    assert.match(result.innerHTML,/data-zp-footwear-merchant-link/);
    return result.innerHTML;
  }
  return {complete,result,form,submit};
}

test("outdated footwear catalog price is not exposed as a shopping anchor",()=>{
  const html = create("2026-11-18T12:00:00Z").complete();
  assert.match(html,/data-zp-offer-freshness="stale"/);
  assert.match(html,/30 dnech znovu ověřena/);
  assert.doesNotMatch(html,/Cena při ověření|1\s?650 Kč/);
  assert.match(html,/U obuvi ověřte také správnou velikost/);
});

test("recent dated footwear price remains explicit and no stale warning is shown",()=>{
  const html = create("2026-10-17T12:00:00Z").complete();
  assert.match(html,/Cena při ověření 2026-10-07: 1650 Kč/);
  assert.doesNotMatch(html,/data-zp-offer-freshness/);
});

test("invalid or future offer date is UNKNOWN, not a verified price",()=>{
  const html = create("2026-11-18T12:00:00Z","2026-02-30").complete();
  assert.match(html,/data-zp-offer-freshness="unknown"/);
  assert.doesNotMatch(html,/Cena při ověření|1\s?650 Kč/);
});
