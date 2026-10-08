import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

test("live PHP sanitizer rejects non-affiliate product URLs without losing existing links", () => {
  const source = fs.readFileSync(new URL("../functions.php", import.meta.url), "utf8");
  const between = (first, next) => {
    const start = source.indexOf(first);
    const end = source.indexOf(next, start);
    assert.ok(start >= 0 && end > start, "PHP helper boundaries");
    return source.slice(start, end);
  };
  const methods = [
    between("function zaprazi_2_is_plain_product_target(", "function zaprazi_2_effective_affiliate_map("),
    between("function zaprazi_2_effective_affiliate_map(", "function zaprazi_2_affiliate_groups("),
    between("function zaprazi_2_sanitize_affiliate_map(", "function zaprazi_2_register_settings()")
  ].join("\n");
  const encoded = Buffer.from(methods, "utf8").toString("base64");
  const php = [
    '$GLOBALS["saved"] = ["m:a"=>"https://tracking.example/original", "m:b"=>"https://shop.example/product/"];',
    '$GLOBALS["errors"] = [];',
    'function get_option($key, $default = []) { return $GLOBALS["saved"]; }',
    'function wp_parse_url($url) { return parse_url($url); }',
    'function zaprazi_2_affiliate_targets() { return ["m:a"=>"https://shop.example/other/", "m:b"=>"https://shop.example/product/"]; }',
    'function zaprazi_2_affiliate_fields() { return ["m:a"=>"A", "m:b"=>"B"]; }',
    'function esc_url_raw($url, $protocols = []) { return preg_match("~^https://[a-z0-9.-]+(?:/|$)~i", $url) ? $url : ""; }',
    'function add_settings_error($setting, $code, $message, $type) { $GLOBALS["errors"][] = ["setting"=>$setting, "type"=>$type]; }',
    'eval(base64_decode("' + encoded + '"));',
    '$checks = [];',
    '$checks["plain"] = zaprazi_2_is_plain_product_target("m:b", "https://shop.example/product");',
    '$checks["tracking"] = !zaprazi_2_is_plain_product_target("m:b", "https://tracking.example/valid");',
    '$checks["active"] = zaprazi_2_effective_affiliate_map();',
    '$checks["canonicalRejected"] = zaprazi_2_sanitize_affiliate_map(["m:a"=>"https://tracking.example/new", "m:b"=>"https://shop.example/product/"]);',
    '$checks["httpRejected"] = zaprazi_2_sanitize_affiliate_map(["m:a"=>"http://tracking.example/bad"]);',
    '$checks["malformedRejected"] = zaprazi_2_sanitize_affiliate_map("bad");',
    '$checks["accepted"] = zaprazi_2_sanitize_affiliate_map(["m:a"=>"https://tracking.example/new","m:b"=>"https://tracking.example/other"]);',
    '$checks["cleared"] = zaprazi_2_sanitize_affiliate_map(["m:a"=>"", "m:b"=>""]);',
    '$checks["errorCount"] = count($GLOBALS["errors"]);',
    'echo json_encode($checks, JSON_THROW_ON_ERROR);'
  ].join("\n");

  const output = execFileSync("php", ["-r", php], { encoding: "utf8" });
  const data = JSON.parse(output);
  const original = { "m:a": "https://tracking.example/original", "m:b": "https://shop.example/product/" };
  assert.equal(data.plain, true);
  assert.equal(data.tracking, true);
  assert.deepEqual(data.active, { "m:a": "https://tracking.example/original" });
  assert.deepEqual(data.canonicalRejected, original);
  assert.deepEqual(data.httpRejected, original);
  assert.deepEqual(data.malformedRejected, original);
  assert.deepEqual(data.accepted, { "m:a": "https://tracking.example/new", "m:b": "https://tracking.example/other" });
  assert.deepEqual(data.cleared, []);
  assert.equal(data.errorCount, 3);
});
