import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const sources=[
  ["hub","page-choditka-pro-seniory.php"],
  ["measurement","page-co-zmerit-pred-vyberem-choditka.php"],
  ["rental","page-pujceni-choditka.php"]
];
const rollator=read("page-rollator-pro-seniory.php");
const href="/rollator-pro-seniory/#rollator-se-sedatkem";

test("Exactly three problem-specific source pages link to one existing seated-rollator URL",()=>{
  assert.match(rollator,/<section id="rollator-se-sedatkem"/);
  for(const [label,file] of sources){
    const content=read(file);
    assert.ok(content.includes("home_url( '"+href+"' )"),"Missing live PHP URL to seat guide from "+label);
    assert.equal(content.split("home_url( '"+href+"' )").length-1,1,"Avoid sitewide link stuffing in "+label);
    assert.match(content,/brzd|used|sedatk/i,"Context must discuss fit and safety");
    assert.doesNotMatch(content,/ehub[.]cz|desturl=|data-zp-merchant-link/i,
      "Source page must not expose a new merchant bypass");
  }
});

test("Walker hub decision cards preserve exact one-link gate",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  const card=hub.match(/<h3>Venku nebo doma i venku<\/h3>([\s\S]*?)<\/article>/)?.[1];
  assert.ok(card);
  assert.equal((card.match(/<a\b/g)||[]).length,1,"Do not replace generic outdoor gate with purchase link");
  assert.match(card,/\/rollator-pro-seniory\/#poradce-rollator/);
  const seat=hub.indexOf("home_url( '"+href+"' )");
  const after=hub.indexOf("</article>",hub.indexOf("<h3>Při chůzi běžně pomáhá druhá osoba"));
  assert.ok(after > 0 && seat > after,"The additional editorial link must sit outside decision cards");
});

test("No new product identity, reimbursement claim or separate canonical created",()=>{
  const measurement=read("page-co-zmerit-pred-vyberem-choditka.php");
  const rental=read("page-pujceni-choditka.php");
  assert.match(measurement,/Výška sedu, parkovací brzdy/);
  assert.match(rental,/Než porovnáte sazby/);
  assert.match(rental,/Než porovnáte sazby, ověřte, jestli zvládá člověk obě brzdy/);
  assert.ok(rollator.includes('id="zp-rollator-advisor"'));
  assert.ok(rollator.includes('name="handBrakes"'));
});
