import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("page-rollator-pro-seniory.php");
const fn=read("functions.php");
const search=read("src/seo/search-guidance.php");

test("rollator with seat has unique high-intent section and an actionable safety-first branch",()=>{
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.equal((page.match(/id="rollator-se-sedatkem"/g)||[]).length,1);
  const from=page.indexOf('<section id="rollator-se-sedatkem"');
  const to=page.indexOf('<section class="zp-section zp-section-soft">',from);
  assert.ok(from>0 && to>from);
  const excerpt=page.slice(from,to);
  for(const required of [
    "Rollátor se sedátkem pro seniory", "přestávek při chůzi",
    "parkovací brzdy","není automaticky transportní invalidní vozík",
    "Brzdy nebo vstávání nejsou jisté",
    "/invalidni-vozik/#poradce-vozik",
    "/co-zmerit-pred-vyberem-choditka/#co-zmerit",
    "/pujceni-choditka/#rozpocet-pujceni-choditka",
    'href="#poradce-rollator"'
  ])assert.ok(excerpt.includes(required),required);
  assert.equal((excerpt.match(/class="zp-decision-card"/g)||[]).length,3);
  assert.doesNotMatch(excerpt,/data-zp-merchant-link|data-zp-affiliate-target|zp-offer|desturl|ehub\.cz|Koupit nyní/i);
  assert.match(excerpt,/Produkt a obchodní nabídka se zobrazují pouze ve stávajícím poradci/);
});

test("SEO title and meta reinforce intent but preserve existing advisor, official copy and offer gates",()=>{
  const seo="Rollátor se sedátkem pro seniory: brzdy a výběr | Zápraží";
  assert.equal(fn.split(seo).length-1,2);
  assert.match(fn,/Rollátor se sedátkem pro seniory: kdy lze bezpečně odpočívat/);
  assert.match(page,/id="zp-rollator-advisor"/);
  assert.match(page,/name="handBrakes"/);
  assert.match(page,/MEYRA Ideal Rollator 3061982/);
  assert.match(page,/Údaj o doplatku na stránce výrobce není automatickým potvrzením/);
  for(const path of ["/pujceni-choditka/","/choditko-na-pojistovnu/"])assert.ok(page.includes(path));
  assert.ok(search.includes("/rollator-pro-seniory/#rollator-se-sedatkem"));
  const section=search.slice(search.indexOf("Specific seated-rollator intent"),search.indexOf("  $groups = array("));
  assert.ok(section.includes("/rollator-pro-seniory/#poradce-rollator"));
  assert.doesNotMatch(section,/href.*affiliate|click\.php|desturl|\?[a-z]+=/i);
});
