import test from "node:test";
import assert from "node:assert/strict";
import { installBathroomMicroStaging } from "../src/bathroom/micro-staging.js";
import { recommendBathroom } from "../src/bathroom/engine.js";

function setup({key, primaryNeed, fitNames, conditionalFit, dependentFitResets = {}, requiredAttr, required, initial}) {
  const events = [], groups = new Map(), radios = new Map();
  const stage = {
    hidden: true,
    appendChild(group) { group.parent = stage; },
    querySelectorAll(selector) {
      assert.equal(selector, 'input[type="radio"]');
      return [...radios.values()].filter(r => r.group.parent === stage);
    }
  };
  const preview = { hidden: true, innerHTML:"", focus(){} };
  const result = { hidden: true, innerHTML:"", focus(){} };
  const errors = { hidden: true, textContent:"" };
  const button = {
    textContent: "1. Ukázat možný výrobek", listeners:[],
    addEventListener(type, fn, capture=false) { assert.equal(type,"click"); this.listeners.push({fn,capture}); },
    click() {
      const event = {stopped:false, preventDefault(){}, stopImmediatePropagation(){this.stopped=true;}};
      for (const {fn} of [...this.listeners].sort((a,b)=>Number(b.capture)-Number(a.capture))) {
        if (event.stopped) break;
        fn(event);
      }
    }
  };
  const names = [...new Set([...required, ...fitNames, ...Object.keys(initial)])];
  for (const name of names) {
    const group = {
      hidden: false, parent: null, name,
      getAttribute(attr) { return attr === requiredAttr ? name : null; },
      closest(selector) { return selector === "[hidden]" && (this.hidden || this.parent?.hidden) ? (this.hidden ? this : stage) : null; },
      querySelectorAll(selector) { assert.equal(selector,'input[type="radio"]'); return [radios.get(name)]; },
      classList:{toggle(){},remove(){}},removeAttribute(){},setAttribute(){},focus(){}
    };
    const radio = {name,checked:false,group,value:"unknown",
      closest(selector) {
        if (selector === "fieldset") return group;
        if (selector === "#zp-" + key + "-fit-stage" && group.parent === stage) return stage;
        return null;
      }
    };
    groups.set(name,group);radios.set(name,radio);
  }
  for (const [name,value] of Object.entries(initial)) {
    radios.get(name).value=value;
    radios.get(name).checked=true;
  }
  const form = {
    addEventListener(type,fn){if(type==="change")events.push(fn);},
    querySelector(selector) {
      const m=selector.match(/^input\[name="([^"]+)"\](:checked)?$/);
      if(!m)return null;
      const radio=radios.get(m[1]);
      return m[2]&&!radio?.checked ? null : radio||null;
    },
    querySelectorAll(selector) {
      assert.equal(selector,"["+requiredAttr+"]");
      return required.map(name=>groups.get(name));
    },
    change(name,value) {
      const radio=radios.get(name);
      radio.checked=true;
      radio.value=value;
      for(const fn of events) fn({target:radio});
    }
  };
  const priorDocument=globalThis.document;
  globalThis.document={querySelector(selector) {
    return {
      ["#zp-"+key+"-preview"]:preview,
      ["#zp-"+key+"-fit-stage"]:stage
    }[selector]||null;
  }};
  try {
    assert.equal(installBathroomMicroStaging({
      form,result,submit:button,errors,key,requiredAttr,fitNames,
      primaryNeed,conditionalFit,dependentFitResets
    }),true);
  } finally {globalThis.document=priorDocument;}
  return {form,groups,radios,stage,preview,result,button};
}

test("WC rail: do not ask for P2015 frame measurements when wall mounting is already verified",()=>{
  const h=setup({
    key:"toilet-support",primaryNeed:"toilet_support",
    fitNames:["loadFit","supportFrameFit"],
    conditionalFit:{supportFrameFit:value=>value("wallFixing")!=="verified"},
    requiredAttr:"data-zp-support-required",
    required:["transferAbility","wallFixing","loadFit"],
    initial:{transferAbility:"independent",wallFixing:"verified",duration:"unknown",supportFrameFit:"yes"}
  });
  h.button.click();
  assert.equal(h.stage.hidden,false);
  assert.equal(h.groups.get("supportFrameFit").hidden,true);
  assert.equal(h.radios.get("supportFrameFit").checked,false,"irrelevant stale fit must be cleared");
  assert.equal(h.groups.get("loadFit").hidden,false);
  assert.doesNotMatch(h.preview.innerHTML,/href=|merchant-link|affiliateMap/);

  const safeRail=recommendBathroom({primaryNeed:"toilet_support",transferAbility:"independent",wallFixing:"verified",supportFrameFit:"unknown",loadFit:"yes"});
  assert.equal(safeRail.status,"candidate","confirmed wall rail must not require irrelevant frame measurements");
  assert.ok(safeRail.recommendations[0].productCandidateIds.includes("unizdrav-p2131"));

  h.form.change("wallFixing","unverified");
  assert.equal(h.stage.hidden,true,"changing the mounting approach resets preview");
  h.button.click();
  assert.equal(h.groups.get("supportFrameFit").hidden,false,"frame branch must ask its own dimensions");
  const noFrameFit=recommendBathroom({primaryNeed:"toilet_support",transferAbility:"independent",wallFixing:"unverified",loadFit:"yes",supportFrameFit:"unknown"});
  assert.notEqual(noFrameFit.status,"candidate");
  assert.deepEqual(noFrameFit.recommendations,[]);
  const yesFrameFit=recommendBathroom({primaryNeed:"toilet_support",transferAbility:"independent",wallFixing:"unverified",loadFit:"yes",supportFrameFit:"yes"});
  assert.equal(yesFrameFit.status,"candidate");
  assert.ok(yesFrameFit.recommendations[0].productCandidateIds.includes("unizdrav-p2015"));
});

test("Bath seat: transfer bench dimensions appear only when standard seat does not fit",()=>{
  const h=setup({
    key:"bath-transfer",primaryNeed:"bath_transfer",
    fitNames:["bathFit","bathBenchFit","loadFit"],
    conditionalFit:{bathBenchFit:value=>value("bathFit")==="no"},
    requiredAttr:"data-zp-bath-required",
    required:["transferAbility","bathTransferIndependent","bathFit","loadFit"],
    initial:{transferAbility:"independent",bathTransferIndependent:"yes",duration:"unknown",bathBenchFit:"yes"}
  });
  h.button.click();
  assert.equal(h.stage.hidden,false);
  assert.equal(h.groups.get("bathBenchFit").hidden,true);
  assert.equal(h.radios.get("bathBenchFit").checked,false,"prior bench answer must not carry over");
  assert.equal(h.groups.get("bathFit").hidden,false);
  h.form.change("bathFit","no");
  assert.equal(h.groups.get("bathBenchFit").hidden,false);
  const unknownBench=recommendBathroom({primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"yes",bathFit:"no",bathBenchFit:"unknown",loadFit:"yes"});
  assert.notEqual(unknownBench.status,"candidate");
  assert.deepEqual(unknownBench.recommendations,[]);
  h.form.change("bathBenchFit","yes");
  assert.equal(recommendBathroom({primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"yes",bathFit:"no",bathBenchFit:"yes",loadFit:"yes"}).status,"candidate");
  h.form.change("bathFit","yes");
  assert.equal(h.groups.get("bathBenchFit").hidden,true);
  assert.equal(h.radios.get("bathBenchFit").checked,false);
  assert.equal(recommendBathroom({primaryNeed:"bath_transfer",transferAbility:"independent",bathTransferIndependent:"yes",bathFit:"yes",bathBenchFit:"unknown",loadFit:"yes"}).status,"candidate");
});


test("Bath transfer: a 110 kg bench capacity confirmation cannot approve a 100 kg seat", () => {
  const h=setup({
    key:"bath-transfer",primaryNeed:"bath_transfer",
    fitNames:["bathFit","bathBenchFit","loadFit"],
    conditionalFit:{bathBenchFit:v=>v("bathFit")==="no"},
    dependentFitResets:{bathFit:["loadFit"]},
    requiredAttr:"data-zp-bath-required",
    required:["transferAbility","bathTransferIndependent","bathFit","loadFit"],
    initial:{transferAbility:"independent",bathTransferIndependent:"yes",bathFit:"no"}
  });
  h.button.click();
  h.form.change("bathBenchFit","yes");
  h.form.change("loadFit","yes");
  assert.equal(h.radios.get("loadFit").checked,true);

  // Bench 110 kg -> seat 100 kg: the previous weight confirmation is unsafe.
  h.form.change("bathFit","yes");
  assert.equal(h.radios.get("loadFit").checked,false, "seat needs a fresh 100 kg capacity check");
  assert.equal(h.groups.get("bathBenchFit").hidden,true);
  assert.equal(h.radios.get("bathBenchFit").checked,false);
  let output=recommendBathroom({
    primaryNeed:"bath_transfer",transferAbility:"independent",
    bathTransferIndependent:"yes",bathFit:"yes",loadFit:"unknown"
  });
  assert.notEqual(output.status,"candidate");
  assert.deepEqual(output.recommendations,[]);
  h.form.change("loadFit","yes");
  output=recommendBathroom({
    primaryNeed:"bath_transfer",transferAbility:"independent",
    bathTransferIndependent:"yes",bathFit:"yes",loadFit:"yes"
  });
  assert.equal(output.status,"candidate");
  assert.deepEqual(output.recommendations[0].productCandidateIds,["besco-bs008"]);

  // Seat 100 kg -> bench 110 kg: still require new confirmation; no carryover.
  h.form.change("bathFit","no");
  assert.equal(h.radios.get("loadFit").checked,false, "bench needs a fresh 110 kg capacity check");
  assert.equal(h.groups.get("bathBenchFit").hidden,false);
  output=recommendBathroom({
    primaryNeed:"bath_transfer",transferAbility:"independent",
    bathTransferIndependent:"yes",bathFit:"no",bathBenchFit:"yes",loadFit:"unknown"
  });
  assert.notEqual(output.status,"candidate");
  assert.deepEqual(output.recommendations,[]);
  h.form.change("bathBenchFit","yes");
  h.form.change("loadFit","yes");
  output=recommendBathroom({
    primaryNeed:"bath_transfer",transferAbility:"independent",
    bathTransferIndependent:"yes",bathFit:"no",bathBenchFit:"yes",loadFit:"yes"
  });
  assert.equal(output.status,"candidate");
  assert.deepEqual(output.recommendations[0].productCandidateIds,["unizdrav-p2203"]);
});
