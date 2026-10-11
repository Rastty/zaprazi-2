import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
const relativeLuminance = hex => {
  const parts = hex.replace("#", "").match(/.{2}/g).map(x => parseInt(x, 16) / 255);
  const channels = parts.map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrastRatio = (a,b) => {
  const ls=[relativeLuminance(a),relativeLuminance(b)].sort((x,y) => y-x);
  return (ls[0] + 0.05) / (ls[1] + 0.05);
};

test("muted copy meets WCAG AA contrast even on gray educational sections", () => {
  const css=read("style.css");
  const muted=css.match(/--zp-muted:\s*(#[0-9a-f]{6})/i)?.[1];
  const background=css.match(/\.zp-section-soft\{background:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(muted && background, "Expected explicit theme token and educational section surface");
  assert.ok(contrastRatio(muted,background)>=4.5,
    "Muted copy on the guide's .zp-section-soft surface must meet WCAG 2.2 AA; actual contrast "+contrastRatio(muted,background).toFixed(2));
  for(const bg of ["#f6f3ed","#fffdf8","#e8efe9"]) {
    assert.ok(contrastRatio(muted,bg)>=4.5,"Muted text must also work on "+bg);
  }
});

test("paper checklist is printable with an explicit user gesture and no data capture", () => {
  const page=read("page-jak-zmerit-chodidlo-pro-vyber-obuvi.php");
  const script=read("assets/js/footwear-measurement-print.js");
  const css=read("style.css");
  const functions=read("functions.php");
  assert.match(page, /class="zp-section zp-section-soft zp-footwear-print-checklist"/);
  assert.match(page, /id="zp-footwear-measurement-print"/);
  assert.match(page, /Vytisknout prázdný seznam měření/);
  assert.match(page, /Délka: ______ mm · šířka: ______ mm/);
  assert.match(script,/addEventListener\("click"/);
  assert.match(script,/window\.print\(\)/);
  assert.match(script,/addEventListener\("afterprint"/);
  assert.match(css, /body\.zp-footwear-print-mode main > :not\(\.zp-footwear-print-checklist\)/);
  assert.match(css, /body\.zp-footwear-print-mode \.zp-footwear-print-checklist \.zp-check-grid/);
  for(const forbidden of [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /navigator\.sendBeacon/,
    /\blocalStorage\b/, /\bsessionStorage\b/, /\bdocument\.cookie\b/, /\bFormData\b/,
    /location\.(search|hash|href)/, /zaprazi:analytics|affiliateMap|merchant_click/i])
    assert.doesNotMatch(script,forbidden, "Printing must not leak or persist measurement data");
  assert.match(functions,/function zaprazi_2_footwear_guide_print_asset/);
  assert.match(functions,/zaprazi_2_is_footwear_measurement_page\(\)/);
  assert.match(functions,/assets\/js\/footwear-measurement-print\.js/);
  const version=read("style.css").match(/^Version:\s*([\d.]+)/m)?.[1];
  assert.ok(version, "Theme version missing");
  assert.ok(script.includes("ZP_RELEASE_" + version.replaceAll(".", "_")),"Print asset marker must match theme release");
});
