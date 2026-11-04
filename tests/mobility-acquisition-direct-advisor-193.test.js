import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const pages=[
  ["page-pujceni-choditka.php","Půjčení chodítka nebo rollátoru."],
  ["page-choditko-na-pojistovnu.php","Chodítko na pojišťovnu v roce 2026."]
];

test("both Mobility acquisition landings hand off directly to existing home Advisor",()=>{
  assert.ok(read("front-page.php").includes('id="poradce"'));
  for(const [path,title] of pages){
    const markup=read(path);
    const hero=markup.slice(markup.indexOf('<section class="zp-hero">'),markup.indexOf('</section>'));
    assert.ok(hero.includes(title),"Retain original search intent and heading: "+path);
    assert.ok(hero.includes('class="zp-btn" data-zp-journey="advisor"'),
      "Primary CTA must use consent-gated generic signal: "+path);
    assert.ok(hero.includes("home_url( '/#poradce' )"),
      "Primary CTA should avoid intermediary hub: "+path);
    assert.ok(hero.includes("home_url( '/choditka-pro-seniory/#vyber-typu' )"),
      "Retain a comparison-first alternative: "+path);
    assert.ok(hero.indexOf("home_url( '/#poradce' )")<
      hero.indexOf("home_url( '/choditka-pro-seniory/#vyber-typu' )"),
      "Safe Advisor first, optional overview second");
    assert.doesNotMatch(hero,/data-zp-merchant-link|data-zp-affiliate-target|data-zp-offer|rel="sponsored"|[?&](?:answer|health|diagnosis)=/);
  }
});
test("new hero does not displace high-intent rental or SÚKL guidance",()=>{
  const rental=read(pages[0][0]);
  const insurance=read(pages[1][0]);
  assert.match(rental,/id="rozpocet-pujceni-choditka"/);
  assert.match(rental,/id="zp-otazky-pujcovna"/);
  assert.match(insurance,/id="postup"/);
  assert.match(insurance,/id="zp-overit-mesicni-seznam"/);
  assert.match(insurance,/ePoukaz/);
});
