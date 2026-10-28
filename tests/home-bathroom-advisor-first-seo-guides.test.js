import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const load=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const home=load("front-page.php");
const bathroom=load("page-koupelna-a-wc.php");

test("Homepage presents situations then live mobility Advisor before long editorial catalog",()=>{
 const hero=home.indexOf('id="co-resite"');
 const advisor=home.indexOf('id="poradce"');
 const result=home.indexOf('id="zp-mobility-result"');
 const guides=home.indexOf('id="prakticke-kontroly"');
 assert.ok(hero>=0 && hero<advisor && advisor<result && result<guides);
 assert.equal((home.match(/id="poradce"/g)||[]).length,1);
 assert.equal((home.match(/id="prakticke-kontroly"/g)||[]).length,1);
 assert.equal((home.match(/<h1>/g)||[]).length,1);
 for(const slug of [
  "otazky-pred-propustenim-z-nemocnice","prevoz-seniora-k-lekari",
  "senior-odmita-choditko","senior-odmita-koupani",
  "senior-malo-pije","senior-spadl-doma","senior-nemuze-vstat-z-postele",
  "senior-nestihne-dojit-na-wc","nocni-cesta-z-postele-na-wc",
  "prahy-pro-choditko-a-vozik","sprchova-zidle-maly-kout-80x80",
  "bezpecny-byt-pro-seniora"
 ]) assert.ok(home.includes("'/"+slug+"/"),"Guide missing: "+slug);
 assert.ok(home.includes('href="#poradce"'),"Entry to real advisor missing");
});
test("Bathroom leads into safe Advisor before six topical guides, preserving destinations",()=>{
 const hero=bathroom.indexOf('<section class="zp-hero');
 const advisor=bathroom.indexOf('id="poradce-koupelna"');
 const form=bathroom.indexOf('id="zp-bathroom-advisor"');
 const result=bathroom.indexOf('id="zp-bathroom-result"');
 const guides=bathroom.indexOf('id="navody-koupelna"');
 assert.ok(hero>=0 && hero<advisor && advisor<form && form<result && result<guides);
 assert.equal((bathroom.match(/id="poradce-koupelna"/g)||[]).length,1);
 assert.equal((bathroom.match(/id="navody-koupelna"/g)||[]).length,1);
 assert.equal((bathroom.match(/<h1>/g)||[]).length,1);
 const prefix=bathroom.slice(0,advisor);
 assert.doesNotMatch(prefix,/Senior nestihne dojít na toaletu\?|Člověk koupání odmítá/);
 for(const target of [
  "senior-nestihne-dojit-na-wc/#proc-se-nestihne-wc",
  "senior-odmita-koupani/#duvody-odmitani-koupani",
  "madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton",
  "prisavne-madlo-do-koupelny-bez-vrtani/#rozdily-madel-bez-vrtani",
  "myti-vlasu-na-luzku/#vyber-myti-vlasu",
  "hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku"
 ]) assert.equal(bathroom.split(target).length-1,1,"Unique guide anchor "+target);
 assert.ok(bathroom.indexOf('href="#poradce-koupelna"')<advisor);
 assert.ok(bathroom.includes('id="zp-bathroom-fit-stage"'));
 assert.ok(bathroom.includes('id="zp-bathroom-submit"'));
 assert.ok(bathroom.includes('id="zp-bathroom-privacy"'));
 assert.doesNotMatch(bathroom.slice(guides),/data-zp-bath-merchant-link/);
});
