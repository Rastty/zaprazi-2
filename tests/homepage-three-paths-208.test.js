import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home=readFileSync(new URL("../front-page.php",import.meta.url),"utf8");
const hero=home.split('<section class="zp-hero zp-illustrated-hero zp-home-hero">')[1]?.split("</section>")[0]??"";

test("0.8.208 first-screen provides exactly three high-value situation actions",()=>{
  assert.match(home,/ZP_RELEASE_0_8_208/);
  assert.equal((hero.match(/<a\\b/g)||[]).length,3,"No links or competing exits in hero");
  assert.match(hero,/home_url\\( '\\/senior-spadl-doma\\/#prvni-krok-pad' \\)/);
  assert.match(hero,/home_url\\( '\\/navrat-z-nemocnice\\/' \\)/);
  assert.match(hero,/href="#co-resite"/);
  assert.ok(hero.indexOf("Senior spadl: co dělat teď")<hero.indexOf("Návrat z nemocnice"));
  assert.ok(hero.indexOf("Návrat z nemocnice")<hero.indexOf("Vybrat pomůcku podle situace"));
});
test("Detailed home navigation and private gated Mobility advisor are preserved",()=>{
  assert.ok(home.indexOf('id="co-resite"')<home.indexOf('id="poradce"'));
  assert.ok(home.includes('href="#poradce"'),"Existing direct mobility entry remains in first scenario");
  for(const path of ["/choditka-pro-seniory/","/koupelna-a-wc/","/polohovaci-postel/","/invalidni-vozik/","/senior-doma-sam-sos-pomoc/","/sobestacnost/"]){
    assert.ok(home.includes(path),"Existing topic remains accessible: "+path);
  }
  assert.match(home,/id="zp-mobility-advisor"/);
  assert.doesNotMatch(hero,/data-zp-merchant-link|data-zp-affiliate-target|affiliateKey|<form\\b/);
  assert.equal((home.match(/<h1>/g)||[]).length,1);
});