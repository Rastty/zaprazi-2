import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const indoor = read("page-choditko-do-bytu-pro-seniory.php");
const threshold = read("page-prahy-pro-choditko-a-vozik.php");

test("60 cm doorway decision offers a contextual threshold guide, not a product shortcut", () => {
  const begin = indoor.indexOf('id="zp-pruchod-choditko-byt"');
  const end = indoor.indexOf('id="bezpecne-pouziti-choditka"', begin);
  assert.ok(begin >= 0 && end > begin);
  const section = indoor.slice(begin, end);
  assert.match(section, /Ze samotného čísla to bezpečně určit nelze/);
  assert.match(section, /neobjednávejte konkrétní model podle šířky z katalogu/);
  assert.match(section, /home_url\( '\/prahy-pro-choditko-a-vozik\/#mereni-prahu' \)/);
  assert.match(section, /Změřit a bezpečně řešit vysoký práh/);
  assert.match(section, /href="#poradce-choditko-byt"/);
  assert.match(threshold, /id="mereni-prahu"/);
  assert.equal((section.match(/prahy-pro-choditko-a-vozik/g) || []).length, 1);
  assert.doesNotMatch(section, /data-zp-merchant-link|data-zp-affiliate-target|data-zp-offer|gtag\(|localStorage|sessionStorage/i);
});

test("WordPress template renders exact same-origin handoff with no health answers in URL", () => {
  const php = [
    "function get_header(){}",
    "function get_footer(){}",
    'function home_url($path=""){return "https://zaprazi.cz".$path;}',
    'function esc_url($url){return htmlspecialchars($url, ENT_QUOTES, "UTF-8");}',
    'include "page-choditko-do-bytu-pro-seniory.php";'
  ].join("\n");
  const html = execFileSync("php", ["-r", php], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    encoding: "utf8"
  });
  assert.match(html, /href="https:\/\/zaprazi\.cz\/prahy-pro-choditko-a-vozik\/#mereni-prahu"/);
  assert.match(html, /href="#poradce-choditko-byt"/);
  assert.doesNotMatch(html, /prahy-pro-choditko-a-vozik\/\?[^"]+/);
});
