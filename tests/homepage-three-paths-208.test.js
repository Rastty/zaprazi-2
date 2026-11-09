import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home=readFileSync(new URL("../front-page.php",import.meta.url),"utf8");
const hero=home.split('<section class="zp-hero zp-illustrated-hero zp-home-hero">')[1]?.split("</section>")[0]??"";

test("0.8.208 first-screen offers three practical situations without extra decisions",()=>{
  assert.ok(home.includes("ZP_RELEASE_0_8_208"));
  assert.equal(hero.split("<a ").length-1,3,"Exactly three direct hero actions");
  assert.ok(hero.includes("home_url( '/senior-spadl-doma/#prvni-krok-pad' )"));
  assert.ok(hero.includes("home_url( '/navrat-z-nemocnice/' )"));
  assert.ok(hero.includes('href="#co-resite"'));
  assert.ok(hero.indexOf("Senior spadl: co dělat teď")<hero.indexOf("Návrat z nemocnice"));
  assert.ok(hero.indexOf("Návrat z nemocnice")<hero.indexOf("Vybrat pomůcku podle situace"));
});
test("Full homepage, trusted advice and private gated Mobility advisor remain",()=>{
  assert.ok(home.indexOf('id="co-resite"')<home.indexOf('id="poradce"'));
  assert.ok(home.includes('href="#poradce"'),"Existing Mobility entry retained inside the choice section");
  for(const path of ["/choditka-pro-seniory/","/koupelna-a-wc/","/polohovaci-postel/","/invalidni-vozik/","/senior-doma-sam-sos-pomoc/","/sobestacnost/"]){
    assert.ok(home.includes(path),"Existing topical route: "+path);
  }
  assert.ok(home.includes('id="zp-mobility-advisor"'));
  for(const forbidden of ["data-zp-merchant-link","data-zp-affiliate-target","affiliateKey","<form"]){
    assert.ok(!hero.includes(forbidden),"No merchant or form in direct home hero: "+forbidden);
  }
  assert.equal(home.split("<h1>").length-1,1);
});