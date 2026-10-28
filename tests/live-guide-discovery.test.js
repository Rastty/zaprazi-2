import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {requiredDecisionPaths,stagedDecisionPaths} from "../scripts/audit-public-sitemap.mjs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const transport="/prevoz-seniora-k-lekari/#vyber-dopravy";
const toilet="/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc";

test("Both newly verified live guide URLs are required sitemap paths, not speculative staged pages",()=>{
  for(const url of ["/prevoz-seniora-k-lekari/","/senior-nestihne-dojit-na-wc/"]){
    assert.ok(requiredDecisionPaths.includes(url),"Missing required live sitemap path "+url);
    assert.ok(!stagedDecisionPaths.includes(url),"Live URL still marked merely staged "+url);
    assert.equal(requiredDecisionPaths.filter(x=>x===url).length,1);
  }
});

test("Homepage keeps both caregiver problems discoverable in safe cards after the mobility Advisor",()=>{
  const html=read("front-page.php");
  const start=html.indexOf('<section id="prakticke-kontroly"');
  const advisor=html.indexOf('<section id="poradce"');
  const end=html.indexOf('<section id="jak-vybrat"',start);
  assert.ok(advisor>0&&start>advisor&&end>start,"Keep complete editorial discovery section after the live Advisor");
  const region=html.slice(start,end);
  assert.equal((region.match(/class="zp-decision-card"/g)||[]).length,12);
  for(const destination of [transport,toilet]){
    assert.ok(region.includes("home_url( '"+destination+"' )"),"Homepage missing safety-first guide "+destination);
    const [slug,anchor]=destination.slice(1).split("/#");
    const target=read("page-"+slug+".php");
    assert.ok(target.includes('id="'+anchor+'"'),"Homepage destination anchor missing "+destination);
  }
  assert.ok(region.indexOf(transport)<region.indexOf(toilet));
  assert.doesNotMatch(region,/data-zp-merchant|data-zp-affiliate|awin1\.com|click\.php/);
});

test("Hospital-discharge and wheelchair-car readers can find safe doctor transport without merchant shortcuts",()=>{
  for(const path of [
    "page-otazky-pred-propustenim-z-nemocnice.php",
    "page-invalidni-vozik-do-auta.php"
  ]){
    const text=read(path);
    assert.ok(text.includes("home_url( '"+transport+"' )"),"No transport path from "+path);
    assert.match(text,/bezpečn/i);
    assert.equal(text.split("home_url( '"+transport+"' )").length-1,1,"One relevant link per parent");
  }
});

test("Safe-home walkthrough connects missed toilet trips to medical-first guide",()=>{
  const home=read("page-bezpecny-byt-pro-seniora.php");
  const wc=read("page-senior-nestihne-dojit-na-wc.php");
  assert.ok(home.includes("home_url( '"+toilet+"' )"));
  assert.ok(wc.includes('id="prvni-bezpecnost-wc"'));
  assert.match(home,/Nestíhá WC i přes den/);
  assert.match(home,/varovné příznaky/);
});
