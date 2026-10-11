import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

for(const spec of [
  {key:"indoor",page:"page-choditko-do-bytu-pro-seniory.php",script:"assets/js/indoor-walker-advisor.js",mustShow:"canLiftWalker",fields:4},
  {key:"roll",page:"page-rollator-pro-seniory.php",script:"assets/js/rollator-advisor.js",mustShow:"handBrakes",fields:3}
]){
  test(spec.key+" specialist skips irrelevant product questions and resets all stale answers",()=>{
    const page=read(spec.page),js=read(spec.script),condition="data-zp-"+spec.key+"-condition";
    const conditional=[...page.matchAll(new RegExp("<fieldset[^>]*"+condition+'="steady" hidden>',"g"))];
    assert.equal(conditional.length,spec.fields,"All product questions must start hidden");
    assert.match(page,new RegExp(condition+'="steady" hidden>\\s*<legend>'));
    assert.match(page,new RegExp('data-zp-'+(spec.key==="indoor"?"indoor-required":"roll-required")+'="'+spec.mustShow+'"[^>]*'+condition+'="steady" hidden'));
    assert.match(js,/const updateProductQuestions=/);
    assert.match(js,/name="supportNeed"\]:checked/);
    const gate=spec.mustShow;
    assert.ok(js.includes('["supportNeed","'+gate+'"].includes(event.target?.name)'),"Recalculate on gate change");
    assert.ok(js.includes('const gateValue=steady'),"Gate input read only in the safe branch");
    assert.ok(js.includes('const detailsAllowed=steady&&'),"Secondary questions depend on safe model selection");
    assert.ok(js.includes('const isGateQuestion=!!section.querySelector(\'input[name="'+gate+'"]\')'));
    assert.match(js,/const show=steady&&\(isGateQuestion\|\|detailsAllowed\)/);
    assert.match(js,/section\.hidden=!show/);
    assert.ok(js.includes('if(!show||(gateChanged&&!isGateQuestion))'),"Hide and clear obsolete question answers");
    assert.match(js,/previousGateValue=gateValue/);
    if(spec.key==="indoor"){
      assert.ok(js.includes('gateValue==="yes"||gateValue==="no"'),"Indoor model details require knowing whether full walker can be lifted");
    }else{
      assert.ok(js.includes('gateValue==="yes"'),"Rollator model details require verified safe hand brakes");
    }
    assert.match(js,/querySelectorAll\('input\[type="radio"\],input\[type="checkbox"\]'\)/);
    assert.match(js,/input\.checked=false/);
    assert.match(js,/const freeGuide=/);
    assert.match(js,/out\.status==="outside_current_slice"/);
    assert.match(js,/href="\/bezpecny-byt-pro-seniora\/"/);
    assert.match(js,/\$\{freeGuide\}\$\{nextMarkup\}/);
    // Product fit and merchant gates remain in place even for steady support.
    assert.match(js,/renderMobilityProductFitGate\(/);
    assert.match(js,/installMobilityProductFitGate\(result\)/);
    // No-product messages must represent the real branch. The edit action
    // should never focus a model question hidden for non-steady support.
    assert.ok(js.includes('const blockedReason = out.status==="outside_current_slice"'));
    assert.ok(js.includes('out.status==="professional_check"'));
    assert.ok(js.includes('out.missing?.includes("supportNeed")'));
    assert.ok(js.includes("esc(blockedReason)"));
    assert.ok(js.includes('questionName=val("supportNeed")==="steady"?'));
    assert.ok(js.includes('if(target&&!target.closest("[hidden]")) target.focus();'));
    assert.ok(!js.includes("form.querySelector('input[name=\"handBrakes\"]')?.focus();"));


  });
}
