import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const hub=read("assets/js/bathroom-advisor.js");
const style=read("style.css");
test("Main Bathroom hub exposes safe result revision after approved and blocked decisions",()=>{
 assert.match(hub,/const renderEditButtons = \(includeFit = false\)/);
 assert.match(hub,/Upravit potřeby a přepočítat výsledek/);
 assert.match(hub,/Upravit rozměry a bezpečnostní ověření/);
 assert.match(hub,/data-zp-bathroom-edit="situation"/);
 assert.match(hub,/data-zp-bathroom-edit="fit"/);
 assert.match(hub,/renderEditButtons\(false\)/);
 assert.match(hub,/renderEditButtons\(previewReady && !fitStage\.hidden\)/);
 assert.match(hub,/button type="button"/);
 assert.match(style,/\.zp-bathroom-edit-actions \.zp-link-btn\{[^}]*min-height:44px/);
});
test("Delegated keyboard focus never targets hidden/irrelevant fit questions",()=>{
 assert.match(hub,/result\.addEventListener\("click", event =>/);
 assert.match(hub,/if \(!button \|\| !result\.contains\(button\)\) return/);
 assert.match(hub,/previewReady && !fitStage\.hidden/);
 assert.match(hub,/fitNames\.map\(name => form\.querySelector/);
 assert.match(hub,/item && !item\.hidden && !item\.closest\("\[hidden\]"\)/);
 assert.match(hub,/form\.scrollIntoView\(\{ block: "start" \}\)/);
 assert.match(hub,/if \(target && !target\.closest\("\[hidden\]"\)\) target\.focus\(\)/);
 assert.match(hub,/form\.querySelector\('\[data-zp-bath-required="primaryNeed"\]'\)/);
});
test("Result changes always erase existing offers and reset model facts on stage-one changes",()=>{
 assert.match(hub,/form\.addEventListener\("change", \(\) => \{\s*result\.hidden = true;\s*result\.innerHTML = "";/);
 assert.match(hub,/if \(previewReady && !event\.target\?\.closest\?\.\("#zp-bathroom-fit-stage"\)\)/);
 assert.match(hub,/fitStage\.querySelectorAll\('input\[type="radio"\]'\)\.forEach\(input => \{ input\.checked = false; \}\)/);
 assert.match(hub,/renderBathroomAcquisition\(output\.acquisition/);
 const helper=hub.slice(hub.indexOf("const renderEditButtons ="),hub.indexOf("const blockedGuides ="));
 assert.doesNotMatch(helper,/href=|merchant-link|affiliateMap|sendBeacon|localStorage|sessionStorage|fetch\(/);
 assert.doesNotMatch(helper,/window\.location|history\.pushState|new URLSearchParams/);
});
