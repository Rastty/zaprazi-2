import test from "node:test";
import assert from "node:assert/strict";
import {isExactAnchor,checkReadiness,assertGuidance,assertNoGuidance} from "../scripts/verify-live-release-and-guides.mjs";
const ready={release:"0.8.182",integrity:"ok",configured_total:25,slot_total:25};
test("verify version, integrity and complete affiliate slots, distinguish pending deploy",()=>{
 assert.deepEqual(checkReadiness(ready,"0.8.182"),{expected:"0.8.182",deployed:"0.8.182",release_matches:true});
 assert.equal(checkReadiness(ready,"0.8.183").release_matches,false);
 assert.throws(()=>checkReadiness({...ready,integrity:"broken"}),"Reject partial production");
 assert.throws(()=>checkReadiness({...ready,configured_total:24}),"Reject incomplete affiliate slots");
});
test("exact IDs, not strings hidden in marketing copy",()=>{
 assert.ok(isExactAnchor('<section id="presun-z-postele-na-vozik">', "presun-z-postele-na-vozik"));
 assert.ok(isExactAnchor("<div class='hul-nebo-choditko' id='hul-nebo-choditko'>", "hul-nebo-choditko"));
 assert.ok(!isExactAnchor('<p>presun-z-postele-na-vozik</p>', "presun-z-postele-na-vozik"));
 assert.ok(!isExactAnchor('<section id="presun-z-postele-na-vozik-old">',"presun-z-postele-na-vozik"));
});
test("search intent detection checks actual guidance block and excludes unrelated topics",()=>{
 const positive='<section class="zp-search-guidance"><a href="https://zaprazi.cz/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba">Domácí péče</a></section>';
 assert.doesNotThrow(()=>assertGuidance(positive,"https://zaprazi.cz/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba"));
 assert.throws(()=>assertGuidance('<p>domaci-zdravotni-pece-nebo-pecovatelska-sluzba</p>',"https://zaprazi.cz/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba"));
 assert.doesNotThrow(()=>assertNoGuidance('<main>Žádné výsledky pro fotovoltaika</main>'));
 assert.throws(()=>assertNoGuidance(positive));
});
