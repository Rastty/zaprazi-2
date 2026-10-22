import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const page=read("page-vstavani-z-kresla-pro-seniora.php");
const fn=read("functions.php");
const home=read("page-bezpecny-byt-pro-seniora.php");
const hub=read("page-kompenzacni-pomucky-pro-seniory.php");
const search=read("src/seo/search-guidance.php");
test("chair-rise guide is distinct, actionable and safety-first",()=>{
  assert.match(page,/Template Name: Zápraží — Vstávání z křesla pro seniora/);
  assert.match(page,/ZP_RELEASE_0_8_150/);
  assert.equal((page.match(/<h1(?:\s|>)/g)||[]).length,1);
  for(const anchor of ["jak-postupovat-kreslo","porovnani-kresel","mereni-kresla","zpusob-porizeni-kresla","zdroje-kreslo"])assert.ok(page.includes('id="'+anchor+'"'));
  for(let i=1;i<=7;i++)assert.ok(page.includes("0"+i+" ·"));
  assert.match(page,/Elektrické polohovací křeslo/);
  assert.match(page,/Zvýšení stávajícího sedu/);
  assert.match(page,/nezkoušejte jej vytahovat za paže/);
  assert.match(page,/náhle vzniklé výrazné slabosti/);
  assert.match(page,/externí odborná revize obsahu zatím není doložena/);
});
test("guide has trustworthy sources and no premature medical-commerce promise",()=>{
  for(const url of [
    "https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/chair-raisers",
    "https://www.cuh.nhs.uk/patient-information/seating-and-ergonomics/",
    "https://oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru-prevence-a-privolani-pomoci-po-padu/"
  ])assert.ok(page.includes(url));
  assert.match(page,/Maloobchodní křeslo není automaticky předepsaná pomůcka/);
  assert.doesNotMatch(page,/<form\b|data-zp-affiliate-target|data-zp-offer|ehub\.cz|desturl|affiliate_url|Koupit nyní/i);
});
test("two independent inbound routes and relevant safe outbound path",()=>{
  const p="/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo";
  assert.ok(home.includes(p)&&hub.includes(p));
  assert.ok(search.includes("'/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo'"));
  for(const x of ["/bezpecny-byt-pro-seniora/#audit-bytu","/kompenzacni-pomucky-pro-seniory/#pojistovna","/navrat-z-nemocnice/#plan-navratu","/jak-vznika-doporuceni/"])assert.ok(page.includes(x));
});
test("one-slug non-destructive WordPress auto publication with SEO and protected release",()=>{
  const start=fn.indexOf("function zaprazi_2_ensure_chair_rise_page()");
  const end=fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_chair_rise_page', 35 );",start);
  assert.ok(start>0&&end>start);
  const seed=fn.slice(start,end);
  assert.match(seed,/get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(seed,/wp_insert_post/);
  assert.doesNotMatch(seed,/wp_update_post|wp_delete_post|wp_trash_post/);
  assert.match(seed,/'page-vstavani-z-kresla-pro-seniora.php'/);
  assert.match(fn,/zaprazi_2_chair_rise_description_fallback/);
  assert.match(fn,/ZAPRAZI_RELEASE', '0\.8\.150'/);
});
