import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const article=read("page-choditko-do-bytu-pro-seniory.php");
const guide=read("page-co-zmerit-pred-vyberem-choditka.php");
const anchor='zp-pruchod-choditko-byt';

test("the existing indoor walker decision page addresses 60 cm doorway uncertainty next to verified models",()=>{
  const comparison=article.slice(article.indexOf("WA17 vs. WA21:"),article.indexOf('id="'+anchor+'"'));
  assert.match(comparison,/WA17/);
  assert.match(comparison,/WA21/);
  assert.match(comparison,/šířka 59 cm/);
  assert.match(comparison,/šířka 60 cm/);
  assert.match(comparison,/šířka chodítka v katalogu není totéž jako prostor potřebný k bezpečnému průchodu/);
  assert.match(comparison,new RegExp('href="#'+anchor+'"'));
  const section=article.slice(article.indexOf('id="'+anchor+'"'),article.indexOf('id="bezpecne-pouziti-choditka"'));
  assert.match(section,/Projde chodítko dveřmi širokými 60 cm\?/);
  assert.match(section,/Ze samotného čísla to bezpečně určit nelze/);
  assert.match(section,/člověk potřebuje prostor pro ruce/);
  assert.match(section,/Dveře otevřete do polohy/);
  assert.match(section,/nominální šířkou dveřního křídla/);
  assert.match(section,/Univerzální „rezervu v centimetrech“ nepředstíráme/);
  assert.match(section,/Otočení u WC nebo postele/);
  assert.match(section,/neobjednávejte konkrétní model podle šířky z katalogu/);
  assert.equal((section.match(/<li>/g)||[]).length,3);
  assert.equal((article.match(/<h1\b/g)||[]).length,1);
  assert.match(article,/href="#zp-pruchod-choditko-byt">Jak bezpečně zkontrolovat úzký průchod/);
});

test("narrow-door help links to a real measurement guide and existing gated advisor, never checkout",()=>{
  const section=article.slice(article.indexOf('id="'+anchor+'"'),article.indexOf('id="bezpecne-pouziti-choditka"'));
  assert.match(section,/home_url\( '\/co-zmerit-pred-vyberem-choditka\/#co-zmerit' \)/);
  assert.match(guide,/id="co-zmerit"/);
  assert.match(section,/href="#poradce-choditko-byt"/);
  assert.match(article,/id="poradce-choditko-byt"/);
  assert.match(article,/id="zp-indoor-walker-advisor"/);
  assert.doesNotMatch(section,/<form|<input|data-zp-merchant-link|data-zp-offer|affiliateMap|localStorage|sessionStorage|fetch\(|gtag\(/i);
});

test("PHP renders valid safe anchors with no blank URLs when WordPress helpers run",()=>{
  const php=[
    'function get_header(){}',
    'function get_footer(){}',
    'function home_url($path=""){ return "https://zaprazi.cz".$path; }',
    'function esc_url($url){return htmlspecialchars($url, ENT_QUOTES, "UTF-8");}',
    'include "page-choditko-do-bytu-pro-seniory.php";'
  ].join("\n");
  const html=execFileSync("php",["-r",php],{
    cwd:fileURLToPath(new URL("../",import.meta.url)),encoding:"utf8"
  });
  assert.match(html,/<section id="zp-pruchod-choditko-byt" class="zp-section" aria-labelledby="zp-pruchod-choditko-byt-nadpis"/);
  assert.match(html,/href="https:\/\/zaprazi\.cz\/co-zmerit-pred-vyberem-choditka\/#co-zmerit"/);
  assert.match(html,/href="#poradce-choditko-byt"/);
  assert.match(html,/<section id="poradce-choditko-byt"/);
  assert.doesNotMatch(html,/href=""/);
});
