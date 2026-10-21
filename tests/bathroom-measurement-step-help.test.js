import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../"+path, import.meta.url), "utf8");
const guide = read("page-co-zmerit-v-koupelne-pred-vyberem-pomucky.php");

test("all six Bathroom product-fit stages link a scoped measurement guide, with no commerce bypass", () => {
  const pages = [
    ["page-koupelna-a-wc.php","zp-bathroom-fit-stage","vyberte-misto"],
    ["page-nastavec-na-wc-pro-seniory.php","zp-toilet-riser-fit-stage","mereni-wc"],
    ["page-madlo-k-wc-pro-seniory.php","zp-toilet-support-fit-stage","mereni-wc"],
    ["page-sprchovaci-zidle-pro-seniory.php","zp-shower-chair-fit-stage","mereni-sprcha"],
    ["page-sedatko-do-vany-pro-seniory.php","zp-bath-transfer-fit-stage","mereni-vana"],
    ["page-toaletni-zidle-pro-seniory.php","zp-toilet-chair-fit-stage","kontrolni-list-koupelna"]
  ];
  for (const [path, stage, anchor] of pages) {
    const page = read(path), start = page.indexOf('<section id="'+stage+'"');
    assert.ok(start >= 0, "Missing fit stage: "+path);
    const end = page.indexOf("</section>", start);
    assert.ok(end > start, "Missing fit section end: "+path);
    const fit = page.slice(start, end);
    assert.match(fit, /hidden>/);
    assert.match(fit, /zp-fit-measurement-help/);
    // The exact measurement instructions must not navigate away from the in-progress
    // form: answers are intentionally browser-only and would be lost on same-tab navigation.
    assert.match(fit, /target="_blank" rel="noopener noreferrer"/);
    assert.match(fit, /Praktický kontrolní návod \(nová karta\)/);
    assert.doesNotMatch(fit, /onclick=|javascript:|window\.location/);
    assert.ok(fit.includes("/co-zmerit-v-koupelne-pred-vyberem-pomucky/#"+anchor), path);
    assert.ok(guide.includes('id="'+anchor+'"'), "Missing guide anchor: "+anchor);
    assert.doesNotMatch(fit, /data-zp-bath-merchant-link|nofollow sponsored|desturl=/);
  }
});

test("toilet-chair problem has a guide route and a safe, non-product checklist", () => {
  assert.match(guide, /Je obtížné dojít až na WC/);
  assert.ok(guide.includes("/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle"));
  assert.match(read("page-toaletni-zidle-pro-seniory.php"), /Kontrolní list měření/);
  assert.doesNotMatch(guide, /data-zp-bath-merchant-link|desturl=/);
});
