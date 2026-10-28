import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const helper=read("src/bathroom/micro-staging.js");
const five=["toilet-riser","shower-chair","toilet-chair","toilet-support","bath-transfer"];

test("All five Bathroom Advisors share one accessible post-result edit implementation",()=>{
 for(const name of five){
  const source=read("assets/js/"+name+"-advisor.js");
  assert.match(source,/installBathroomMicroStaging\(\{/);
  assert.ok(source.includes('key: "'+name+'"'));
  assert.match(source,/result\.hidden = true;\s*result\.innerHTML = "";/,
    "Any changed answer must remove old merchant links and recommendation: "+name);
 }
 assert.match(helper,/const addEditActions = \(\) =>/);
 assert.match(helper,/result\.addEventListener\("click", event =>/);
 assert.match(helper,/data-zp-bath-edit="situation"/);
 assert.match(helper,/data-zp-bath-edit="fit"/);
 assert.match(helper,/Upravit potřeby a přepočítat výsledek/);
 assert.match(helper,/Upravit rozměry a bezpečnostní ověření/);
 assert.match(helper,/button type="button"/);
 assert.match(helper,/if \(!button \|\| !result\.contains\?\.\(button\)\) return/);
});

test("Second step and unsafe blocked step both expose a non-commercial edit route",()=>{
 const blocked=helper.split("const block = outcome => {")[1].split("const reset = () => {")[0];
 assert.match(blocked,/addEditActions\(\)/);
 assert.match(blocked,/updateProgress\("paused"\)/);
 assert.doesNotMatch(blocked,/affiliateMap|merchant-link|merchantName|offer\.url/);
 const second=helper.split("if \(previewReady\) {");
 // This is an intentional source contract, not an inference that any answer is safe.
 assert.equal(second.length,1);
 assert.match(helper,/if \(!result\.hidden && result\.innerHTML\.trim\(\)\) \{\s*addEditActions\(\)/);
 assert.match(helper,/queueMicrotask\(\(\) =>/);
 assert.match(helper,/const canEditFit = !fitStage\.hidden/);
 assert.match(helper,/!group\.hidden && !group\.closest\("\[hidden\]"\)/);
 assert.match(helper,/if \(!group\) return/);
 assert.match(helper,/target\.focus\(\)/);
});

test("Edit controls are deliberately not linked to buying or reimbursement",()=>{
 const section=helper.slice(helper.indexOf("const addEditActions ="),helper.indexOf("const block = outcome =>"));
 assert.doesNotMatch(section,/href=|merchant-link|affiliateUrl|\.offers|fetch\(|sendBeacon|localStorage|sessionStorage/);
 assert.ok(section.includes('result.querySelector?.("[data-zp-bath-edit]")'),
   "Repeated final submits must never duplicate edit controls");
 assert.ok(section.includes('button.dataset.zpBathEdit === "fit" && !fitStage.hidden'),
   "Never target hidden fit controls");
 const styles=read("style.css");
 assert.match(styles,/\.zp-bathroom-edit-actions\{display:flex/);
 assert.match(styles,/\.zp-bathroom-edit-actions \.zp-link-btn\{[^}]*min-height:44px/);
 assert.match(styles,/@media\(max-width:600px\)\{\.zp-bathroom-edit-actions/);
 assert.doesNotMatch(section,/window\.location|history\.pushState|new URLSearchParams|document\.cookie/);
});
