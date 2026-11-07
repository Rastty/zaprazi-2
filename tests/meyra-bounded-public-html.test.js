import test from "node:test";
import assert from "node:assert/strict";
import {readBoundedPublicHtml} from "../scripts/audit-meyra-public-identity.mjs";

const responseFor=parts=>({body:new ReadableStream({start(controller){for(const part of parts)controller.enqueue(new TextEncoder().encode(part));controller.close();}})});
test("bounded public merchant HTML accepts small streamed evidence",async()=>{
  assert.equal(await readBoundedPublicHtml(responseFor(["<h1>MEYRA ","Ideal</h1>"]),100),"<h1>MEYRA Ideal</h1>");
});
test("bounded public merchant HTML rejects oversized streamed evidence without Content-Length",async()=>{
  assert.equal(await readBoundedPublicHtml(responseFor(["12345","67890"]),8),null);
});
test("bounded public merchant HTML does not trust a missing stream",async()=>{
  assert.equal(await readBoundedPublicHtml({body:null}),null);
});
