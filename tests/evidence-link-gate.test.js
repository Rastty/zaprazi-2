import test from "node:test";
import assert from "node:assert/strict";
import { canLinkEvidence } from "../src/decision/evidence-links.js";

test("commercial evidence cannot bypass a locked product-fit gate", () => {
  const merchant = "https://shop.example/product/?utm_source=test#buy";
  assert.equal(canLinkEvidence("https://shop.example/product/", [merchant], false), false);
  assert.equal(canLinkEvidence("https://manufacturer.example/manual.pdf", [merchant], false), true);
  assert.equal(canLinkEvidence("https://shop.example/product/", [merchant], true), true);
});
