import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const css=readFileSync(new URL("../style.css",import.meta.url),"utf8");

test("single-product Advisor results expand without changing multi-product comparisons",()=>{
  assert.match(css,/\.zp-product-grid\s*\{\s*display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/\.zp-product-grid\s*>\s*\.zp-product-card:only-child\s*\{[^}]*grid-column:1\s*\/\s*-1;[^}]*max-width:780px\}/);
  assert.match(css,/@media\(max-width:800px\)\s*\{[\s\S]*?\.zp-product-grid\s*\{grid-template-columns:1fr\}/);
  assert.doesNotMatch(css,/\.zp-product-grid\s*>\s*\.zp-product-card\s*\{/,
    "Do not stretch every card in a multi-candidate comparison");
});
