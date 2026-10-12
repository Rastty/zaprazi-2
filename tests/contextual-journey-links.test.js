import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

const destinations=[
 ["page-bezpecny-byt-pro-seniora.php","/jak-zmerit-chodidlo-pro-vyber-obuvi/","page-jak-zmerit-chodidlo-pro-vyber-obuvi.php"],
 ["page-navrat-z-nemocnice.php","/pujceni-choditka/","page-pujceni-choditka.php"],
 ["page-navrat-z-nemocnice.php","/polohovaci-postel-na-pojistovnu/","page-polohovaci-postel-na-pojistovnu.php"],
 ["page-navrat-z-nemocnice.php","/invalidni-vozik-na-pojistovnu/","page-invalidni-vozik-na-pojistovnu.php"],
 ["page-kompenzacni-pomucky-pro-seniory.php","/pujceni-choditka/","page-pujceni-choditka.php"]
];

test("evidence-first contextual acquisition links are real, internal, and explicit",()=>{
  for(const [source,href,target] of destinations){
    const page=read(source);
    assert.ok(page.includes("home_url( '"+href+"' )"),"Missing contextual internal route: "+href+" from "+source);
    assert.ok(read(target).includes("get_header();"),"Destination page template missing: "+target);
    const count=page.split("home_url( '"+href+"' )").length-1;
    assert.ok(count>=1&&count<=3,"Unnatural number of links from "+source+" to "+href+": "+count);
  }
});

test("do not imply that rental / reimbursement replaces product-fit safety",()=>{
  const hospital=read("page-navrat-z-nemocnice.php");
  const section=hospital.slice(hospital.indexOf('Pomůcky po propuštění'),hospital.indexOf("zp-section zp-section-soft",hospital.indexOf('Pomůcky po propuštění')));
  assert.match(section,/Teprve když je jasný bezpečný typ a potřebné parametry/);
  assert.match(section,/samostatné podmínky, nikoli o jeden univerzální nárok/);
  assert.match(section,/sukl\.gov\.cz/);
  const aids=read("page-kompenzacni-pomucky-pro-seniory.php");
  assert.match(aids,/Zvolený typ ale musí nejprve projít bezpečnostními podmínkami poradce/);
  const home=read("page-bezpecny-byt-pro-seniora.php");
  assert.match(home,/Jak bezpečně změřit chodidla/);
  assert.ok(!section.includes('data-zp-merchant-link')&&!section.includes('data-zp-offer'));
});
