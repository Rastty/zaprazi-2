import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("discharge questions have an independent search intent without duplicating the home Advisor",()=>{
  const page=read("page-otazky-pred-propustenim-z-nemocnice.php");
  const hub=read("page-navrat-z-nemocnice.php");
  const home=read("page-bezpecny-byt-pro-seniora.php");
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.match(page, /Na co se zeptat v nemocnici před propuštěním domů/);
  assert.match(page, /Propouštěcí zpráva a návazné kontroly/);
  assert.match(page, /Domácí zdravotní péče a praktický lékař/);
  assert.match(page, /Bezpečný odvoz a první hodiny doma/);
  assert.match(page, /Když rodina sama péči nezvládne/);
  assert.match(page, /Co se zeptat lékaře, sestry a sociálního pracovníka/);
  assert.doesNotMatch(page, /id="zp-return-home-advisor"|wp_enqueue_script_module|<form\b/);
  assert.doesNotMatch(page, /data-zp-(?:adl|return-home|merchant)-link|affiliateMap|href="https:\/\/(?:ehub|awin)/i);
  assert.match(page, /\/navrat-z-nemocnice\/#plan-navratu/);
  assert.match(page, /\/bezpecny-byt-pro-seniora\//);
  assert.match(page, /\/koupelna-a-wc\//);
  assert.match(page, /\/choditka-pro-seniory\//);
  assert.match(hub, /\/otazky-pred-propustenim-z-nemocnice\//);
  assert.match(home, /\/otazky-pred-propustenim-z-nemocnice\//);
});

test("discharge article claims are traceable and scoped to Czech official guidance",()=>{
  const page=read("page-otazky-pred-propustenim-z-nemocnice.php");
  for(const source of [
    "nzip.cz/clanek/290-propusteni-z-nemocnice",
    "nzip.cz/clanek/209-domaci-pece",
    "nzip.cz/clanek/295-zdravotnicka-dopravni-sluzba",
    "vzp.cz/o-nas/tiskove-centrum/otazky-tydne/kdo-ma-narok-na-hrazenou-domaci-peci"
  ]) assert.ok(page.includes(source),"Missing official evidence "+source);
  assert.match(page,/9\. 10\. 2026/);
  assert.match(page,/České republiky/);
  assert.match(page,/Nejsou to pokyny k léčbě ani náhrada individuálních doporučení/);
  assert.match(page,/bez léků|Léčbu sami neměňte|léčbu.*neměňte/);
  assert.match(page,/Nejdůležitější není koupit všechny pomůcky/);
});

test("non-destructive WordPress publication and SEO identity are wired",()=>{
  const f=read("functions.php");
  assert.match(f,/function zaprazi_2_ensure_discharge_questions_page\(\)/);
  assert.match(f,/get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(f,/if \( \$existing \) \{[\s\S]*?Never repurpose\/overwrite existing page content/);
  assert.match(f,/'otazky-pred-propustenim-z-nemocnice'/);
  assert.match(f,/page-otazky-pred-propustenim-z-nemocnice\.php/);
  assert.match(f,/zaprazi_discharge_questions_v1/);
  assert.match(f,/zaprazi_2_is_discharge_questions_page/);
  assert.match(f,/Na co se zeptat před propuštěním z nemocnice \| Zápraží/);
  assert.match(f,/Praktické otázky před propuštěním z nemocnice:/);
  assert.match(f,/zaprazi_2_discharge_questions_meta_fallback/);
});

test("new informational URL does not reuse historical content slug",()=>{
  const s=read("data/legacy-url-inventory.csv");
  const needle="otazky-pred-propustenim-z-nemocnice";
  assert.equal(s.includes(needle),false,"Historical page collision: inspect before publishing");
});
