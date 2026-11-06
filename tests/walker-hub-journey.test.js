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


test("Buy/rent/insurance section offers actionable safe next steps, not an ungated shop link",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  assert.match(hub,/href="#jak-ziskat-choditko"/);
  const section=hub.slice(hub.indexOf('id="jak-ziskat-choditko"'));
  assert.ok(section.startsWith('id="jak-ziskat-choditko" class="zp-section zp-section-dark" aria-labelledby="jak-ziskat-choditko-nadpis"'));
  assert.match(section,/id="jak-ziskat-choditko-nadpis"/);
  const buy=section.slice(section.indexOf("<h3>Koupit</h3>"),section.indexOf("<h3>Půjčit</h3>"));
  assert.match(buy,/Nejdřív ověřit vhodný typ v poradci/);
  assert.match(buy,/Připravit měření před výběrem modelu/);
  assert.ok(buy.includes("home_url( '/#poradce' )"));
  assert.ok(buy.includes("home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' )"));
  assert.doesNotMatch(buy,/data-zp-merchant-link|data-zp-offer|https?:\/\/[^\s"']+|affiliateMap/i);
  assert.ok(section.includes("home_url( '/pujceni-choditka/' )"));
  assert.ok(section.includes("home_url( '/choditko-na-pojistovnu/' )"));
  assert.match(read("front-page.php"),/id="poradce"/);
  assert.match(read("page-co-zmerit-pred-vyberem-choditka.php"),/id="co-zmerit"/);
});

test("Walker acquisition checklist makes the next call actionable without ungated offers",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  const start=hub.indexOf('id="jak-ziskat-choditko"');
  const end=hub.indexOf('<div class="zp-wrap zp-faq">',start);
  assert.ok(start>=0&&end>start,"Acquisition section must precede FAQ");
  const section=hub.slice(start,end);
  assert.match(section,/class="zp-system-empty zp-acquire-checklist"/);
  assert.match(section,/aria-labelledby="choditko-pred-ziskanim-nadpis"/);
  assert.match(section,/id="choditko-pred-ziskanim-nadpis"/);
  assert.match(section,/Čtyři věci, které si ověřit/);
  for(const item of [
    "Jak dlouho bude pomůcka potřeba?",
    "Je bezpečně ověřený typ a konkrétní model?",
    "Jaká je celková cena",
    "Je namístě prověřit úhradu?",
    "Neznámé údaje nedoplňujte odhadem",
    "Není nutné nic koupit hned"
  ]) assert.ok(section.includes(item),"Missing safe decision step: "+item);
  assert.ok(section.includes("home_url( '/#poradce' )"));
  assert.ok(section.includes("home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' )"));
  assert.ok(section.includes("home_url( '/choditko-na-pojistovnu/' )"));
  assert.doesNotMatch(section,/data-zp-merchant-link|data-zp-offer|affiliateMap|localStorage|sessionStorage|fetch\(/i);
  const checklist=section.slice(section.indexOf('class="zp-system-empty zp-acquire-checklist"'));
  assert.doesNotMatch(checklist,/zp-text-link-light/,"Light panel must not use white links");
  assert.match(read("style.css"),/\.zp-acquire-checklist\{[^}]*color:var\(--zp-ink\)/);
  assert.match(read("front-page.php"),/id="poradce"/);
  assert.match(read("page-co-zmerit-pred-vyberem-choditka.php"),/id="co-zmerit"/);
});

test("Outdoor walker choice explains brake check before gated advisor",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  const start=hub.indexOf("<h3>Venku nebo doma i venku</h3>");
  const end=hub.indexOf("<h3>Při chůzi běžně pomáhá druhá osoba</h3>",start);
  assert.ok(start>=0&&end>start);
  const card=hub.slice(start,end);
  assert.match(card,/brzdy stisknout, bezpečně zastavit a zajistit parkovací brzdu/);
  assert.match(card,/praktické posouzení a nácvik/);
  assert.ok(card.includes("home_url( '/rollator-pro-seniory/#poradce-rollator' )"));
  assert.doesNotMatch(card,/data-zp-merchant-link|affiliateMap|data-zp-offer/i);
});


test("Insurance acquisition card warns about unreimbursable advance retail purchase",()=>{
  const hub=read("page-choditka-pro-seniory.php");
  const start=hub.indexOf("<h3>Pojišťovna</h3>");
  const end=hub.indexOf("</article>",start);
  assert.ok(start>=0&&end>start,"Missing insurance acquisition card");
  const insurance=hub.slice(start,end);
  assert.match(insurance,/nekupujte chodítko z vlastních peněz/);
  assert.match(insurance,/není možné ani s následným doporučením lékaře/);
  assert.match(insurance,/https:\/\/www\.vzp\.cz\/o-nas\/tiskove-centrum\/otazky-tydne\/proplaceni-choditka/);
  assert.ok(insurance.includes("home_url( '/choditko-na-pojistovnu/' )"));
  assert.doesNotMatch(insurance,/data-zp-merchant-link|data-zp-offer|affiliateMap|[?&](?:answer|health|diagnosis)=/i);
});
