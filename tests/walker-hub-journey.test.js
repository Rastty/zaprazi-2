import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("Walkers hub differentiates indoor use, outdoor braking and professional-assessment stop",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  assert.equal((hub.match(/<h1\b/g)||[]).length,1);
  assert.match(hub,/Chodítko doma nejde při kroku nadzvednout/);
  assert.match(hub,/brzdy nejsou jisté/);
  assert.match(hub,/Nejužší dveře, práh nebo otočení/);
  assert.match(hub,/samotné změření nestačí/);
  assert.match(hub,/Při nejistém přesunu, opakovaných pádech/);
  assert.match(hub,/Poradce může doporučení pozastavit/);
  assert.doesNotMatch(hub,/data-zp-merchant-link|affiliateMap|eHUB|awin1\.com/i);
});

test("The walker's high-intent situations link directly to existing gated advisors",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  const indoor=read("page-choditko-do-bytu-pro-seniory.php");
  const outdoor=read("page-rollator-pro-seniory.php");
  const destinations=[
    "/choditko-do-bytu-pro-seniory/#poradce-choditko-byt",
    "/rollator-pro-seniory/#poradce-rollator",
    "/co-zmerit-pred-vyberem-choditka/#co-zmerit"
  ];
  for(const path of destinations)
    assert.ok(hub.includes("home_url( '"+path+"' )"),"Missing source-level route "+path);
  assert.match(indoor,/id="poradce-choditko-byt"/);
  assert.match(outdoor,/id="poradce-rollator"/);
  assert.match(read("page-co-zmerit-pred-vyberem-choditka.php"),/id="co-zmerit"/);
  for(const page of [indoor,outdoor]){
    assert.ok(page.includes("home_url( '/choditka-pro-seniory/#vyber-typu' )"));
    assert.match(page,/Zpět na srovnání typů chodítek/);
  }
});

test("Walker comparison keeps distinct rent, buy and reimbursement paths",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  for(const path of ["/pujceni-choditka/","/choditko-na-pojistovnu/","/#poradce"])
    assert.ok(hub.includes("home_url( '"+path+"' )"));
  assert.match(hub,/retail nákup a výdej na ePoukaz jsou dvě odlišné cesty/);
  assert.doesNotMatch(hub,/postMessage|localStorage|sessionStorage|fetch\(/);
});
